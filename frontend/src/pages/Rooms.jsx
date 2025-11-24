import React, { useState, useEffect } from 'react';
import { roomAPI } from '../api';
import RoomCard from '../components/RoomCard';

export default function Rooms() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRooms();
  }, []);

  const loadRooms = async () => {
    try {
      const response = await roomAPI.getAll();
      setRooms(response.data);
    } catch (error) {
      console.error('Ошибка загрузки номеров:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Загрузка номеров...</div>;

  return (
    <div className="rooms-page container">
      <h1>Наши номера</h1>
      
      {rooms.length === 0 ? (
        <p>Номеров пока нет</p>
      ) : (
        <div className="rooms-grid">
          {rooms.map((room) => (
            <RoomCard key={room.id} room={room} />
          ))}
        </div>
      )}
    </div>
  );
}
