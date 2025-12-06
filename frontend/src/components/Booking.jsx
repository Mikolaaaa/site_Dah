import React from 'react';
import BookingForm from '../components/BookingForm';

export default function Booking() {
  return (
    <div className="booking-page">
      <div className="container">
        <h1>Забронировать весь дом</h1>
        <p>Дом сдаётся целиком для вашего комфортного отдыха</p>

        {/* Форма бронирования без привязки к конкретной комнате */}
        <BookingForm roomId={null} roomPrice={5000} />
      </div>
    </div>
  );
}
