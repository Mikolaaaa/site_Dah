from pydantic import BaseModel, EmailStr, Field
from datetime import datetime
from typing import Optional
from pydantic import validator

# === PHOTO SCHEMAS ===

class PhotoBase(BaseModel):
    category: str = "hotel"
    room_id: Optional[int] = None


class PhotoCreate(PhotoBase):
    filename: str
    url: str


class PhotoOut(PhotoBase):
    id: int
    filename: str
    url: str
    uploaded_at: datetime

    class Config:
        from_attributes = True


# === ROOM SCHEMAS ===

class RoomBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    description: Optional[str] = None
    price: int = Field(..., gt=0)
    capacity: int = Field(default=2, ge=1, le=10)
    area: Optional[float] = Field(None, gt=0)
    amenities: Optional[list[str]] = []
    type: Optional[str] = None


class RoomCreate(RoomBase):
    pass


class RoomUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    price: Optional[int] = None
    capacity: Optional[int] = None
    area: Optional[float] = None
    amenities: Optional[list[str]] = None
    type: Optional[str] = None


class RoomOut(RoomBase):
    id: int
    created_at: datetime
    photos: list[PhotoOut] = []

    class Config:
        from_attributes = True


# === BOOKING SCHEMAS ===

class BookingBase(BaseModel):
    room_id: int
    guest_name: str = Field(..., min_length=2, max_length=100)
    guest_phone: str = Field(..., min_length=10, max_length=20)
    guest_email: Optional[EmailStr] = None
    check_in: datetime
    check_out: datetime
    guests_count: int = Field(default=1, ge=1)


class BookingCreate(BookingBase):
    @validator('check_out')
    def check_dates(cls, v, values):
        if 'check_in' in values and v <= values['check_in']:
            raise ValueError('Дата выезда должна быть позже даты заезда')
        return v
    @validator('check_in', 'check_out')
    @classmethod
    def make_naive(cls, v):
        if v and v.tzinfo:
            return v.replace(tzinfo=None)
        return v


class BookingOut(BookingBase):
    id: int
    total_price: int
    status: str
    created_at: datetime

    class Config:
        from_attributes = True

# === AUTH SCHEMAS ===

class LoginRequest(BaseModel):
    username: str
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    username: str
    full_name: str
