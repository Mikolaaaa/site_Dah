import React, { useState } from 'react';
import { photoAPI } from '../api';

export default function PhotoUpload({ category = 'hotel', roomId, onUploadSuccess }) {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result);
    reader.readAsDataURL(selectedFile);
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    try {
      await photoAPI.upload(file, category, roomId);
      alert('Фото успешно загружено!');
      setFile(null);
      setPreview(null);
      if (onUploadSuccess) onUploadSuccess();
    } catch (error) {
      console.error('Ошибка загрузки:', error);
      alert('Ошибка загрузки фото');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="photo-upload">
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        disabled={uploading}
      />
      {preview && (
        <div className="preview">
          <img src={preview} alt="Preview" width="200" />
        </div>
      )}
      <button
        onClick={handleUpload}
        disabled={!file || uploading}
        className="btn"
      >
        {uploading ? 'Загрузка...' : 'Загрузить фото'}
      </button>
    </div>
  );
}
