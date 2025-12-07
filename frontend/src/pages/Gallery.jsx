import React, { useState } from 'react';
import PhotoGallery from '../components/PhotoGallery';

export default function Gallery() {
  const [category, setCategory] = useState('all');

  return (
    <div className="gallery-page container">
      <h1>Фотогалерея</h1>

      <div className="category-filter">
        <button
          className={category === 'all' ? 'active' : ''}
          onClick={() => setCategory('all')}
        >
          Все фото
        </button>
        <button
          className={category === 'hotel' ? 'active' : ''}
          onClick={() => setCategory('hotel')}
        >
          Гостиница
        </button>
        <button
          className={category === 'room' ? 'active' : ''}
          onClick={() => setCategory('room')}
        >
            Комнаты
        </button>
        <button
          className={category === 'nature' ? 'active' : ''}
          onClick={() => setCategory('nature')}
        >
          Природа
        </button>
      </div>

      <PhotoGallery category={category === 'all' ? null : category} />
    </div>
  );
}
