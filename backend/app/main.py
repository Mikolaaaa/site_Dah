from fastapi import FastAPI, UploadFile, File, Depends, HTTPException, Query
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from typing import List, Optional
import shutil
from pathlib import Path
import uuid
from datetime import datetime, timedelta
from sqlalchemy import and_
from app.config import settings
from app.database import get_db, init_db
from app.models import Room, Photo, Booking
from app.schemas import (
    RoomCreate, RoomOut, RoomUpdate,
    PhotoOut, PhotoCreate,
    BookingCreate, BookingOut,
    LoginRequest, TokenResponse
)

from app.auth import (
    authenticate_user,
    create_access_token,
    verify_token,
    ACCESS_TOKEN_EXPIRE_MINUTES
)

# === APP SETUP ===

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Создание папки для uploads
UPLOAD_DIR = Path(settings.UPLOAD_DIR)
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

# Раздача статики
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

# === STARTUP ===

@app.on_event("startup")
async def startup_event():
    """Инициализация БД при старте"""
    await init_db()
    print("✅ Database initialized")


# === HEALTH CHECK ===

@app.get("/health")
async def health_check():
    return {"status": "ok", "project": settings.PROJECT_NAME}


# === AUTH ENDPOINTS ===

@app.post(f"{settings.API_PREFIX}/auth/login", response_model=TokenResponse, tags=["Auth"])
async def login(login_data: LoginRequest):
    """Вход в систему"""
    user = authenticate_user(login_data.username, login_data.password)

    if not user:
        raise HTTPException(
            status_code=401,
            detail="Неверный логин или пароль"
        )

    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user["username"]},
        expires_delta=access_token_expires
    )

    return TokenResponse(
        access_token=access_token,
        username=user["username"],
        full_name=user["full_name"]
    )


@app.get(f"{settings.API_PREFIX}/auth/me", tags=["Auth"])
async def get_current_user(username: str = Depends(verify_token)):
    """Получить текущего пользователя"""
    return {"username": username}


# === PHOTOS ENDPOINTS ===

@app.post(f"{settings.API_PREFIX}/photos", response_model=PhotoOut, tags=["Photos"])
async def upload_photo(
    file: UploadFile = File(...),
    category: str = Query("hotel", description="Категория фото"),
    room_id: Optional[int] = Query(None, description="ID номера"),
    db: AsyncSession = Depends(get_db),
    username: str = Depends(verify_token)
):
    """Загрузка фотографии"""
    
    # Проверка типа файла
    if not file.content_type or not file.content_type.startswith("image/"):
        raise HTTPException(400, "Разрешены только изображения")
    
    # Проверка расширения
    file_ext = Path(file.filename).suffix.lower()
    if file_ext not in settings.ALLOWED_EXTENSIONS:
        raise HTTPException(400, f"Разрешены только: {settings.ALLOWED_EXTENSIONS}")
    
    # Генерация уникального имени
    unique_filename = f"{uuid.uuid4()}{file_ext}"
    file_path = UPLOAD_DIR / unique_filename
    
    try:
        # Сохранение файла
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
    except Exception as e:
        raise HTTPException(500, f"Ошибка сохранения файла: {str(e)}")
    finally:
        await file.close()
    
    # Сохранение в БД
    photo = Photo(
        filename=unique_filename,
        url=f"/uploads/photos/{unique_filename}",
        category=category,
        room_id=room_id
    )
    
    db.add(photo)
    await db.commit()
    await db.refresh(photo)
    
    return photo


@app.get(f"{settings.API_PREFIX}/photos", response_model=List[PhotoOut], tags=["Photos"])
async def get_photos(
    category: Optional[str] = None,
    room_id: Optional[int] = None,
    db: AsyncSession = Depends(get_db)
):
    """Получение списка фотографий с фильтрацией"""
    
    query = select(Photo)
    
    if category:
        query = query.where(Photo.category == category)
    if room_id:
        query = query.where(Photo.room_id == room_id)
    
    result = await db.execute(query)
    photos = result.scalars().all()
    
    return photos


@app.delete(f"{settings.API_PREFIX}/photos/{{photo_id}}", tags=["Photos"])
async def delete_photo(
    photo_id: int,
    db: AsyncSession = Depends(get_db),
    username: str = Depends(verify_token)
):
    """Удаление фотографии"""
    
    result = await db.execute(select(Photo).where(Photo.id == photo_id))
    photo = result.scalar_one_or_none()
    
    if not photo:
        raise HTTPException(404, "Фото не найдено")
    
    # Удаление файла
    file_path = UPLOAD_DIR / photo.filename
    if file_path.exists():
        file_path.unlink()
    
    await db.delete(photo)
    await db.commit()
    
    return {"message": "Фото удалено"}


# === ROOMS ENDPOINTS ===

@app.get(f"{settings.API_PREFIX}/rooms", response_model=List[RoomOut], tags=["Rooms"])
async def get_rooms(
        db: AsyncSession = Depends(get_db)
):
    """Получение всех номеров"""

    # ⚠️ Явная загрузка photos
    result = await db.execute(
        select(Room).options(selectinload(Room.photos)).order_by(Room.id)
    )
    rooms = result.scalars().all()
    return rooms


@app.get(f"{settings.API_PREFIX}/rooms/{{room_id}}", response_model=RoomOut, tags=["Rooms"])
async def get_room(
        room_id: int,
        db: AsyncSession = Depends(get_db)
):
    """Получение одного номера"""

    # ⚠️ Явная загрузка photos
    result = await db.execute(
        select(Room)
        .options(selectinload(Room.photos))
        .where(Room.id == room_id)
    )
    room = result.scalar_one_or_none()

    if not room:
        raise HTTPException(404, "Номер не найден")

    return room


@app.post(f"{settings.API_PREFIX}/rooms", response_model=RoomOut, tags=["Rooms"])
async def create_room(
        room_data: RoomCreate,
        db: AsyncSession = Depends(get_db),
        username: str = Depends(verify_token)
):
    """Создание номера"""

    room = Room(**room_data.dict())
    db.add(room)
    await db.commit()
    await db.refresh(room)

    # ⚠️ Явная загрузка photos после refresh
    await db.refresh(room, attribute_names=['photos'])

    return room


@app.patch(f"{settings.API_PREFIX}/rooms/{{room_id}}", response_model=RoomOut, tags=["Rooms"])
async def update_room(
        room_id: int,
        room_data: RoomUpdate,
        db: AsyncSession = Depends(get_db),
        username: str = Depends(verify_token)
):
    """Обновление номера"""

    # ⚠️ Явная загрузка photos
    result = await db.execute(
        select(Room)
        .options(selectinload(Room.photos))
        .where(Room.id == room_id)
    )
    room = result.scalar_one_or_none()

    if not room:
        raise HTTPException(404, "Номер не найден")

    # Обновление полей
    for field, value in room_data.dict(exclude_unset=True).items():
        setattr(room, field, value)

    await db.commit()
    await db.refresh(room)

    return room


@app.delete(f"{settings.API_PREFIX}/rooms/{{room_id}}", tags=["Rooms"])
async def delete_room(
    room_id: int,
    db: AsyncSession = Depends(get_db),
    username: str = Depends(verify_token)
):
    """Удаление номера"""
    
    result = await db.execute(select(Room).where(Room.id == room_id))
    room = result.scalar_one_or_none()
    
    if not room:
        raise HTTPException(404, "Номер не найден")
    
    await db.delete(room)
    await db.commit()
    
    return {"message": "Номер удален"}


# === BOOKINGS ENDPOINTS ===


@app.post(f"{settings.API_PREFIX}/bookings", response_model=BookingOut, tags=["Bookings"])
async def create_booking(
        booking_data: BookingCreate,
        db: AsyncSession = Depends(get_db)
):
    # ⚠️ Проверка пересечений по датам
    overlapping = await db.execute(
        select(Booking)
        .where(
            Booking.status != "cancelled",
            Booking.check_out > booking_data.check_in,
            Booking.check_in < booking_data.check_out
        )
    )
    if overlapping.scalars().all():
        raise HTTPException(409, "Номер занят в эти даты")

    # Расчет стоимости и сохранение
    days = (booking_data.check_out - booking_data.check_in).days
    if days <= 0:
        raise HTTPException(400, "Некорректные даты")
    total_price = 9900 * days
    booking = Booking(
        **booking_data.dict(),
        total_price=total_price
    )
    db.add(booking)
    await db.commit()
    await db.refresh(booking)
    return booking


@app.get(f"{settings.API_PREFIX}/bookings", response_model=List[BookingOut], tags=["Bookings"])
async def get_bookings(
    db: AsyncSession = Depends(get_db)
):
    """Получение бронирований"""

    query = select(Booking)

    result = await db.execute(query)
    bookings = result.scalars().all()

    return bookings

@app.patch(f"{settings.API_PREFIX}/bookings/{{booking_id}}/status", tags=["Bookings"])
async def update_booking_status(
        booking_id: int,
        status: str,  # "pending", "confirmed", "cancelled"
        db: AsyncSession = Depends(get_db),
        username: str = Depends(verify_token)
):
    """Изменить статус бронирования (админ)"""
    result = await db.execute(select(Booking).where(Booking.id == booking_id))

    booking = result.scalar_one_or_none()
    if not booking:
        raise HTTPException(404, "Бронирование не найдено")

    booking.status = status
    await db.commit()
    await db.refresh(booking)
    return booking


@app.patch(f"{settings.API_PREFIX}/bookings/{{booking_id}}", response_model=BookingOut, tags=["Bookings"])
async def update_booking(
        booking_id: int,
        data: BookingCreate,  # или BookingUpdate с Optional'ами
        db: AsyncSession = Depends(get_db),
        username: str = Depends(verify_token)
):
    result = await db.execute(select(Booking).where(Booking.id == booking_id))
    booking = result.scalar_one_or_none()
    if not booking:
        raise HTTPException(404, "Бронирование не найдено")

    for field, value in data.dict(exclude_unset=True).items():
        setattr(booking, field, value)

    await db.commit()
    await db.refresh(booking)
    return booking


@app.delete(f"{settings.API_PREFIX}/bookings/{{booking_id}}", tags=["Bookings"])
async def delete_booking(
        booking_id: int,
        db: AsyncSession = Depends(get_db),
        username: str = Depends(verify_token)
):
    result = await db.execute(select(Booking).where(Booking.id == booking_id))
    booking = result.scalar_one_or_none()
    if not booking:
        raise HTTPException(404, "Бронирование не найдено")

    await db.delete(booking)
    await db.commit()
    return {"message": "Бронирование удалено"}


@app.get(f"{settings.API_PREFIX}/bookings/booked-dates", tags=["Bookings"])
async def get_booked_dates(db: AsyncSession = Depends(get_db)):
    """Получить все занятые даты"""
    result = await db.execute(
        select(Booking)
        .where(Booking.status != "cancelled")
        .order_by(Booking.check_in)
    )
    bookings = result.scalars().all()

    return [
        {
            "check_in": booking.check_in.strftime('%Y-%m-%d'),
            "check_out": booking.check_out.strftime('%Y-%m-%d')
        }
        for booking in bookings
    ]
