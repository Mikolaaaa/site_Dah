import React, { useState, useEffect } from 'react';
import { photoAPI } from '../api';

export default function PhotoGallery({ category, roomId }) {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  useEffect(() => {
    loadPhotos();
  }, [category, roomId]);

  const loadPhotos = async () => {
    try {
      const response = await photoAPI.getAll(category, roomId);
      setPhotos(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Ошибка загрузки фото:', error);
      setPhotos([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Загрузка фотографий...</div>;
  if (photos.length === 0) return <div className="empty">Фотографий пока нет</div>;

  return (
    <>
      <div className="photo-gallery">
        {photos.map((photo) => (
          <div
            key={photo.id}
            className="gallery-frame"
            onClick={() => setSelectedPhoto(photo)}
          >
            <img src={photo.url} alt={photo.category} className="gallery-image" />
          </div>
        ))}
      </div>

      {/* Lightbox, если нужно */}
      {selectedPhoto && (
        <div className="lightbox" onClick={() => setSelectedPhoto(null)}>
          <button className="close-btn" onClick={() => setSelectedPhoto(null)}>
            ✕
          </button>
          <img src={selectedPhoto.url} alt={selectedPhoto.category} />
        </div>
      )}
    </>
  );
}
