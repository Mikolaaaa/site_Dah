import React from 'react';
import { Link } from 'react-router-dom';

export default function RoomCard({ room }) {
  const mainPhoto = room.photos?.[0]?.url || '/placeholder.jpg';

  return (
    <div className="room-card">
      <img src={mainPhoto} alt={room.name} />
      <div className="room-info">
        <h3>{room.name}</h3>

        {/* Тип */}
        <div className="room-meta">
          {room.type && <span>🏷️ {room.type}</span>}
        </div>

        <p>{room.description?.slice(0, 100)}...</p>

        {/* Удобства */}
        {room.amenities && room.amenities.length > 0 && (
          <div className="room-amenities-preview">
            {room.amenities.slice(0, 3).map(a => (
              <span key={a} className="amenity-tag">{a}</span>
            ))}
          </div>
        )}

        <div className="room-details">
          <span>👥 {room.capacity} чел.</span>
          {room.area && <span>📐 {room.area} м²</span>}
        </div>

        <div className="room-footer">
          <span className="price">{room.price?.toLocaleString('ru-RU')} ₽/ночь</span>
          <Link to={`/rooms/${room.id}`} className="btn">Подробнее</Link>
        </div>
      </div>
    </div>
  );
}
