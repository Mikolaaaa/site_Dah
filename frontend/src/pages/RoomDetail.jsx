import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { roomAPI } from '../api';
import BookingForm from '../components/BookingForm';

export default function RoomDetail() {
  const { roomId } = useParams();
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    roomAPI.getOne(roomId)
      .then(res => setRoom(res.data))
      .catch(() => setRoom(null))
      .finally(() => setLoading(false));
  }, [roomId]);

  if (loading) return <div className="loading">Загрузка информации...</div>;
  if (!room) return <div>Номер не найден</div>;

  // Безопасные значения (устойчивый дефолт)
  const photos = Array.isArray(room.photos) ? room.photos : [];
  const amenities = Array.isArray(room.amenities) ? room.amenities : [];
  const areaText = typeof room.area === 'number' ? `${room.area} м²` : '—';
  const typeText = room.type || '—';
  const priceText = typeof room.price === 'number' ? `${room.price.toLocaleString('ru-RU')} ₽/ночь` : '—';

  return (
      <div className="room-detail-container">
          <div className="room-detail-header">
              <h1>{room.name || 'Без названия'}</h1>
          </div>

          {/* Фото-галерея */}
          <div className="room-gallery">
              {photos.length > 0
                  ? photos.map((ph, i) => (
                      <img key={ph.id || ph.url || i} src={ph.url} alt={`Фото ${i + 1}`} className="gallery-image"/>
                  ))
                  : <img src="/placeholder.jpg" alt="Нет фото" className="gallery-image"/>}
          </div>

          {/* Описание */}
          <div className="room-detail-desc">
              <h2>Описание:</h2>
              <p>
                  {room.description && room.description.length > 80
                      ? room.description
                      : 'Описание этого номера будет добавлено позже.'}
              </p>
          </div>

          {/* Параметры */}
          <div className="room-detail-params">
              <div className="room-param">
                  <span className="room-icon">👥</span>
                  <span className="room-label">Вместимость:</span>
                  <span className="room-value">{room.capacity ? `${room.capacity} чел.` : '—'}</span>
              </div>
              <div className="room-param">
                  <span className="room-icon">📐</span>
                  <span className="room-label">Площадь:</span>
                  <span className="room-value">{areaText}</span>
              </div>
              <div className="room-param">
                  <span className="room-icon">🏷️</span>
                  <span className="room-label">Тип:</span>
                  <span className="room-value">{typeText}</span>
              </div>
              <div className="room-param">
                  <span className="room-icon">💰</span>
                  <span className="room-label">Цена:</span>
                  <span className="room-value">{priceText}</span>
              </div>
          </div>

          <div className="room-amenities-block">
              <h2>Удобства:</h2>
              {Array.isArray(room.amenities) && room.amenities.length > 0 ? (
                  <ul className="amenities-list">
                      {room.amenities.map(a => (
                          <li key={a} className="amenity-pill">{a}</li>
                      ))}
                  </ul>
              ) : (
                  <p className="empty-amenities">Нет данных</p>
              )}
          </div>


          {/* Форма брони */}
          <div className="booking-section">
              <h2>Забронировать номер</h2>
              <BookingForm roomId={room.id} roomPrice={room.price || 0}/>
          </div>
      </div>
  );
}
