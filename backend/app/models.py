from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, Float
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base
from sqlalchemy.dialects.postgresql import ARRAY


class Room(Base):
    """Модель номера гостиницы"""
    __tablename__ = "rooms"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    description = Column(Text)
    price = Column(Integer, nullable=False)  # Цена за ночь
    capacity = Column(Integer, default=2)  # Количество гостей
    area = Column(Float, nullable=True)  # Площадь в м²
    created_at = Column(DateTime, default=datetime.utcnow)
    amenities = Column(ARRAY(String), default=[])  # Удобства
    type = Column(String(50), nullable=True)  # Тип номера

    # Связь с фото
    photos = relationship("Photo", back_populates="room", cascade="all, delete-orphan")
    bookings = relationship("Booking", back_populates="room")


class Photo(Base):
    """Модель фотографии"""
    __tablename__ = "photos"
    
    id = Column(Integer, primary_key=True, index=True)
    filename = Column(String(255), nullable=False)
    url = Column(String(500), nullable=False)
    category = Column(String(50), default="hotel")  # hotel, room, nature, exterior, interior
    room_id = Column(Integer, ForeignKey("rooms.id"), nullable=True)
    uploaded_at = Column(DateTime, default=datetime.utcnow)
    
    # Связь с номером
    room = relationship("Room", back_populates="photos")


class Booking(Base):
    """Модель бронирования"""
    __tablename__ = "bookings"
    
    id = Column(Integer, primary_key=True, index=True)
    room_id = Column(Integer, ForeignKey("rooms.id"), nullable=False)
    guest_name = Column(String(100), nullable=False)
    guest_phone = Column(String(20), nullable=False)
    guest_email = Column(String(100))
    check_in = Column(DateTime, nullable=False)
    check_out = Column(DateTime, nullable=False)
    guests_count = Column(Integer, default=1)
    total_price = Column(Integer, nullable=False)
    status = Column(String(20), default="pending")  # pending, confirmed, cancelled
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Связь с номером
    room = relationship("Room", back_populates="bookings")
