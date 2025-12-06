import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { roomAPI } from '../api';

export default function RoomDetail() {
  const { roomId } = useParams();
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    roomAPI.getOne(roomId)
      .then(res => {
        setRoom(res.data);
        setError(null);
      })
      .catch(err => {
        console.error('Error loading room:', err);
        setError('Не удалось загрузить информацию о комнате');
      })
      .finally(() => setLoading(false));
  }, [roomId]);

  if (loading) {
    return (
      <div className="room-detail-page">
        <div className="container">
          <div className="loading">Загрузка...</div>
        </div>
      </div>
    );
  }

  if (error || !room) {
    return (
      <div className="room-detail-page">
        <div className="container">
          <Link to="/" className="back-link">← Назад к главной</Link>
          <div className="error-message">{error || 'Комната не найдена'}</div>
          <Link to="/" className="btn btn-primary">Вернуться на главную</Link>
        </div>
      </div>
    );
  }

  const photos = Array.isArray(room.photos) ? room.photos : [];
  const amenities = Array.isArray(room.amenities) ? room.amenities : [];

  const nextImage = () => {
    if (photos.length > 0) {
      setCurrentImageIndex((prev) =>
        prev === photos.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevImage = () => {
    if (photos.length > 0) {
      setCurrentImageIndex((prev) =>
        prev === 0 ? photos.length - 1 : prev - 1
      );
    }
  };

  return (
    <div className="room-detail-page">
      <div className="container">
        <Link to="/house-tour " className="back-link">← Назад к обзору всех комнат</Link>

        <div className="room-detail-header">
          <h1>{room.name || 'Название не указано'}</h1>
        </div>

        {/* Галерея */}
        {photos.length > 0 ? (
          <div className="room-gallery">
            <div className="main-image-container">
              <img
                src={photos[currentImageIndex].url}
                alt={`${room.name} - фото ${currentImageIndex + 1}`}
                className="main-image"
              />
              {photos.length > 1 && (
                <>
                  <button className="gallery-btn prev" onClick={prevImage}>‹</button>
                  <button className="gallery-btn next" onClick={nextImage}>›</button>
                  <div className="image-counter">
                    {currentImageIndex + 1} / {photos.length}
                  </div>
                </>
              )}
            </div>

            {photos.length > 1 && (
              <div className="thumbnails">
                {photos.map((photo, idx) => (
                  <img
                    key={photo.id || idx}
                    src={photo.url}
                    alt={`Миниатюра ${idx + 1}`}
                    className={`thumbnail ${idx === currentImageIndex ? 'active' : ''}`}
                    onClick={() => setCurrentImageIndex(idx)}
                  />
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="no-photos">
            <p>📷 Фотографии этой комнаты будут добавлены в ближайшее время</p>
          </div>
        )}

        {/* Описание */}
        {room.description && room.description.trim() && (
          <div className="room-description">
            <h2>Описание</h2>
            <div className="description-text">
              {room.description.split('\n').map((paragraph, idx) => (
                paragraph.trim() && <p key={idx}>{paragraph}</p>
              ))}
            </div>
          </div>
        )}

        {/* Информация */}
        <div className="room-info-grid">
          {room.type && (
            <div className="room-info-item">
              <span className="info-label">Тип</span>
              <span className="info-value">{room.type}</span>
            </div>
          )}
          {room.capacity && (
            <div className="room-info-item">
              <span className="info-label">Вместимость</span>
              <span className="info-value">{room.capacity} чел.</span>
            </div>
          )}
          {room.area && (
            <div className="room-info-item">
              <span className="info-label">Площадь</span>
              <span className="info-value">{room.area} м²</span>
            </div>
          )}
        </div>

        {/* Удобства */}
        {amenities.length > 0 && (
          <div className="room-features">
            <h2>Удобства</h2>
            <ul className="features-list">
              {amenities.map((feature, idx) => (
                <li key={idx}>✓ {feature}</li>
              ))}
            </ul>
          </div>
        )}

        {/* CTA */}
        <div className="room-cta">
          <Link to="/" className="btn btn-secondary">
            ← Вернуться к обзору
          </Link>
          <Link to="/booking" className="btn btn-large">
            Забронировать дом
          </Link>
          <Link to="/" className="btn btn-primary">
            Посмотреть все комнаты
          </Link>
        </div>
      </div>
    </div>
  );
}
