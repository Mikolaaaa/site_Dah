import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { roomAPI } from '../api';

export default function HouseTour() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    roomAPI.getAll()
      .then(res => {
        setRooms(Array.isArray(res.data) ? res.data : []);
      })
      .catch(err => {
        console.error(err);
        setRooms([]);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading">Загрузка...</div>;

  return (
    <div className="house-tour-page">
      <div className="container">
        <div className="page-header">
          <h1>🏠 Знакомство с домом</h1>
          <p className="page-subtitle">
            Просторный коттедж с тремя спальнями, кухней-залом и уютным двором.
            Посмотрите, как выглядит каждая комната и пространство внутри.
          </p>
        </div>

        <div className="rooms-grid">
          {rooms.map((room) => (
            <div className="room-card" key={room.id}>
              <div className="room-image-wrapper">
                {room.photos && room.photos.length > 0 ? (
                  <img src={room.photos[0].url} alt={room.name} />
                ) : (
                  <img src="/placeholder.jpg" alt="No photo" />
                )}
                {room.area && <span className="room-area-badge">{room.area} м²</span>}
              </div>
              <div className="room-card-content">
                <h3>{room.name}</h3>
                <p>
                  {room.short_description || room.description?.substring(0, 120) + '...'}
                </p>
                <Link to={`/rooms/${room.id}`} className="btn-view-room">
                  Посмотреть подробнее →
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="house-tour-cta">
        <h2>Готовы забронировать весь дом?</h2>
          <p>Дом сдаётся целиком. Выберите даты и забронируйте свой отдых в горах Адыгеи</p>
          <Link to="/booking" className="btn btn-large">
            Забронировать дом
          </Link>
        </div>
      </div>
    </div>
  );
}
