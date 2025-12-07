import React, { useState, useEffect } from 'react';
import { roomAPI, bookingAPI, photoAPI } from '../api'; // Не забудь photoAPI!
import PhotoUpload from '../components/PhotoUpload';

export default function Admin() {
  const [roomData, setRoomData] = useState({
    name: '',
    description: '',
    short_description: '',
    price: '',
    capacity: 2,
    area: '',
    amenities: '',
    type: '',
  });

  const [rooms, setRooms] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [selectedRoomId, setSelectedRoomId] = useState(null);

  // Для редактирования комнаты
  const [selectedRoomEdit, setSelectedRoomEdit] = useState(null);
  const [editingRoomData, setEditingRoomData] = useState(null);

  useEffect(() => {
    loadRooms();
    loadBookings();
  }, []);

  const loadRooms = async () => {
    try {
      const response = await roomAPI.getAll();
      setRooms(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Ошибка загрузки номеров:', error);
      setRooms([]);
    }
  };

  const loadBookings = async () => {
    try {
      const response = await bookingAPI.getAll();
      setBookings(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Ошибка загрузки броней:', error);
      setBookings([]);
    }
  };

  const handleChange = (e) => {
    setRoomData({ ...roomData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await roomAPI.create({
        name: roomData.name,
        description: roomData.description,
        short_description: roomData.short_description,
        price: parseInt(roomData.price),
        capacity: parseInt(roomData.capacity),
        area: roomData.area ? parseFloat(roomData.area) : null,
        amenities: roomData.amenities ? roomData.amenities.split(',').map(s => s.trim()) : [],
        type: roomData.type || null,
      });
      alert('Номер создан!');
      setRoomData({ name: '', description: '', short_description: '', price: '', capacity: 2, area: '', amenities: '', type: '' });
      loadRooms();
    } catch (error) {
      console.error('Ошибка создания номера:', error);
      alert('Ошибка создания номера');
    }
  };

  const handlePhotoUploadSuccess = () => {
    loadRooms();
  };

  // === Редактирование комнаты ===
  const startEditRoom = (room) => {
    setSelectedRoomEdit(room);
    setEditingRoomData({
      name: room.name,
      description: room.description,
      short_description: room.short_description || '',
      price: room.price,
      capacity: room.capacity,
      area: room.area || '',
      amenities: Array.isArray(room.amenities) ? room.amenities.join(', ') : '',
      type: room.type || '',
    });
  };


  const handleEditRoomChange = (e) => {
    setEditingRoomData({ ...editingRoomData, [e.target.name]: e.target.value });
  };

  const saveEditRoom = async (e) => {
    e.preventDefault();
    await roomAPI.update(selectedRoomEdit.id, {
      ...editingRoomData,
      short_description: editingRoomData.short_description,
      price: parseInt(editingRoomData.price),
      capacity: parseInt(editingRoomData.capacity),
      area: editingRoomData.area ? parseFloat(editingRoomData.area) : null,
      amenities: editingRoomData.amenities ? editingRoomData.amenities.split(',').map(s => s.trim()) : [],
      type: editingRoomData.type || null,
    });
    setSelectedRoomEdit(null);
    setEditingRoomData(null);
    loadRooms();
  };

  const handleDeleteRoom = async (id) => {
    if (!window.confirm('Удалить этот номер?')) return;
    await roomAPI.delete(id);
    loadRooms();
  };

  // === Удаление фото номера ===
  const handleDeletePhoto = async (photoId) => {
    if (!window.confirm('Удалить фото?')) return;
    await photoAPI.delete(photoId);
    loadRooms(); // чтобы фото исчезло из комнаты
  };

  // === Управление бронированиями ===
  const handleDeleteBooking = async (id) => {
    if (!window.confirm('Удалить бронь?')) return;
    await bookingAPI.delete(id);
    loadBookings();
  };

  const handleBookingStatusUpdate = async (id, status) => {
    await bookingAPI.updateStatus(id, status);
    loadBookings();
  };

  return (
    <div className="admin-page container">
      <h1>Админ-панель</h1>

      {/* ---- Бронирования ---- */}
      <section className="admin-section">
        <h2>Бронирования</h2>
        {bookings.length === 0 ? (
          <p>Броней пока нет</p>
        ) : (
          <div className="bookings-list">
            {bookings.map((booking) => (
              <div key={booking.id} className="booking-item">
                <h4>Бронь #{booking.id}</h4>
                <p><strong>Гость:</strong> {booking.guest_name}</p>
                <p><strong>Телефон:</strong> {booking.guest_phone}</p>
                <p><strong>Email:</strong> {booking.guest_email || '—'}</p>
                <p><strong>Номер комнаты:</strong> {booking.room_id}</p>
                <p><strong>Заезд:</strong> {new Date(booking.check_in).toLocaleDateString('ru-RU')}</p>
                <p><strong>Выезд:</strong> {new Date(booking.check_out).toLocaleDateString('ru-RU')}</p>
                <p><strong>Гостей:</strong> {booking.guests_count}</p>
                <p><strong>Стоимость:</strong> {booking.total_price} ₽</p>
                <p>
                  <strong>Статус:</strong>
                  <select
                    value={booking.status}
                    onChange={e => handleBookingStatusUpdate(booking.id, e.target.value)}
                    style={{ marginLeft: "7px" }}
                  >
                    <option value="pending">Активна</option>
                    <option value="cancelled">Отменена</option>
                    <option value="confirmed">Завершена</option>
                  </select>
                  <button
                    className="btn-delete"
                    style={{ marginLeft: "12px" }}
                    onClick={() => handleDeleteBooking(booking.id)}
                  >
                    Удалить
                  </button>
                </p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ---- Фото гостиницы / природы ---- */}
      <section className="admin-section">
        <h2>Загрузить фото гостиницы / природы</h2>
        <div className="category-uploads">
          <div>
            <h3>Гостиница</h3>
            <PhotoUpload category="hotel" onUploadSuccess={handlePhotoUploadSuccess} />
          </div>
          <div>
            <h3>Природа</h3>
            <PhotoUpload category="nature" onUploadSuccess={handlePhotoUploadSuccess} />
          </div>
        </div>
      </section>

      {/* ---- Фото номеров ---- */}
      <section className="admin-section">
        <h2>Загрузить фото для номера</h2>
        {rooms.length === 0 ? (
          <p>Сначала создайте номер</p>
        ) : (
          <>
            <div className="room-selector">
              <label>Выберите номер:</label>
              <select
                value={selectedRoomId || ''}
                onChange={(e) => setSelectedRoomId(parseInt(e.target.value))}
              >
                <option value="">-- Выберите номер --</option>
                {rooms.map((room) => (
                  <option key={room.id} value={room.id}>
                    {room.name}
                  </option>
                ))}
              </select>
            </div>
            {selectedRoomId && (
              <div className="photo-upload-section">
                <h3>Загрузить фото для: {rooms.find(r => r.id === selectedRoomId)?.name}</h3>
                <PhotoUpload
                  category="room"
                  roomId={selectedRoomId}
                  onUploadSuccess={handlePhotoUploadSuccess}
                />
                <div className="existing-photos">
                  <h4>Существующие фото:</h4>
                  <div className="photos-grid">
                    {rooms
                      .find(r => r.id === selectedRoomId)
                      ?.photos?.map((photo) => (
                        <div key={photo.id} className="photo-item-small" style={{ position: "relative" }}>
                          <img
                            src={`http://localhost:8000${photo.url}`}
                            alt="Room photo"
                          />
                          <button
                            className="btn-delete-photo"
                            onClick={() => handleDeletePhoto(photo.id)}
                            style={{ position: "absolute", top: 7, right: 7 }}
                          >
                            🗑️
                          </button>
                        </div>
                      ))}
                  </div>
                  {rooms.find(r => r.id === selectedRoomId)?.photos?.length === 0 && (
                    <p>Фото пока нет</p>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </section>

      {/* ---- Список всех номеров ---- */}
      <section className="admin-section">
        <h2>Все номера</h2>
        <div className="rooms-list">
          {rooms.map((room) => (
            <div key={room.id} className="room-item">
              <h3>{room.name}</h3>
              <p>{room.description}</p>
              <p><strong>Цена:</strong> {room.price} ₽/ночь</p>
              <p><strong>Вместимость:</strong> {room.capacity} чел.</p>
              <p><strong>Тип:</strong> {room.type || '—'}</p>
              <p><strong>Удобства:</strong> {room.amenities?.join(', ') || '—'}</p>
              <p><strong>Фото:</strong> {room.photos?.length || 0} шт.</p>
              <div className="room-actions">
                <button onClick={() => startEditRoom(room)} className="btn-edit">Редактировать</button>
                <button onClick={() => handleDeleteRoom(room.id)} className="btn-delete">Удалить</button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ---- Модалка редактирования номера ---- */}
      {selectedRoomEdit && (
        <div className="modal-overlay" onClick={() => setSelectedRoomEdit(null)}>
          <div className="modal-edit" onClick={e => e.stopPropagation()}>
            <h3>Редактировать номер</h3>
            <form onSubmit={saveEditRoom} className="admin-form">
              <input
                  name="name"
                  value={editingRoomData.name}
                  onChange={handleEditRoomChange}
                  required
                  placeholder="Название номера"
              />
              <textarea
                  name="description"
                  value={editingRoomData.description}
                  onChange={handleEditRoomChange}
                  placeholder="Описание"
              />
              <textarea
                  name="short_description"
                  placeholder="Краткое описание"
                  value={editingRoomData.short_description}
                  onChange={handleEditRoomChange}
                  maxLength={200}
                  rows={2}
              />
              <textarea
                  name="short_description"
                  placeholder="Краткое описание (для главной страницы, до 200 символов)"
                  value={roomData.short_description}
                  onChange={handleChange}
                  maxLength={200}
                  rows={2}
              />
              <input
                  name="price"
                  value={editingRoomData.price}
                  type="number"
                  onChange={handleEditRoomChange}
                  required
                  placeholder="Цена за ночь"
              />
              <input
                  name="capacity"
                  value={editingRoomData.capacity}
                  type="number"
                  onChange={handleEditRoomChange}
                  required
                  placeholder="Вместимость"
              />
              <input
                  name="area"
                  value={editingRoomData.area}
                  type="number"
                  step="0.1"
                  onChange={handleEditRoomChange}
                  placeholder="Площадь (м²)"
              />
              <input
                  name="type"
                  value={editingRoomData.type}
                  onChange={handleEditRoomChange}
                  placeholder="Тип номера"
              />
              <input
                  name="amenities"
                  value={editingRoomData.amenities}
                  onChange={handleEditRoomChange}
                  placeholder="Удобства через запятую"
              />
              <button type="submit" className="btn btn-primary">Сохранить</button>
              <button type="button" className="btn btn-secondary" onClick={() => setSelectedRoomEdit(null)}>Отмена
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ---- Создать новый номер ---- */}
      <section className="admin-section">
        <h2>Создать номер</h2>
        <form onSubmit={handleSubmit} className="admin-form">
          <input
              type="text"
              name="name"
              placeholder="Название номера"
              value={roomData.name}
              onChange={handleChange}
              required
          />
          <textarea
              name="description"
              placeholder="Описание"
              value={roomData.description}
              onChange={handleChange}
          />
          <textarea
              name="short_description"
              placeholder="Краткое описание (для главной страницы, до 200 символов)"
              value={roomData.short_description}
              onChange={handleChange}
              maxLength={200}
              rows={2}
          />
          <input
              type="number"
              name="price"
              placeholder="Цена за ночь"
              value={roomData.price}
              onChange={handleChange}
              required
          />
          <input
              type="number"
              name="capacity"
              placeholder="Вместимость"
              value={roomData.capacity}
              onChange={handleChange}
              required
          />
          <input
              type="number"
              step="0.1"
              name="area"
              placeholder="Площадь (м²)"
              value={roomData.area}
              onChange={handleChange}
          />
          <input
              type="text"
              name="type"
              placeholder="Тип номера (Стандарт, Люкс...)"
              value={roomData.type}
              onChange={handleChange}
          />
          <input
              type="text"
              name="amenities"
              placeholder="Удобства через запятую (Wi-Fi, Кухня, Душ)"
              value={roomData.amenities}
              onChange={handleChange}
          />
          <button type="submit" className="btn">Создать номер</button>
        </form>
      </section>
    </div>
  );
}

