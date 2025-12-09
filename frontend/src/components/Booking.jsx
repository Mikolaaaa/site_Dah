import React from 'react';
import BookingForm from '../components/BookingForm';

export default function Booking() {
  return (
    <div className="booking-page">
      <div className="container">
        <div className="booking-intro">
          <h1>Забронировать весь дом</h1>
          <p>Дом сдаётся целиком для вашего комфортного отдыха</p>
          <p className="booking-contact-note">
            Вы также можете забронировать дом по телефону или в WhatsApp по номеру&nbsp;
            <a href="tel:+79184340808">+7 (918) 434-08-08</a>.
            <a href="tel:+79184340808">+7 (928) 434-55-16</a>.
          </p>
        </div>

        {/* Краткий блок с ценами */}
        <section className="pricing-summary">
          <h2>Кратко о ценах</h2>
          <ul>
            <li><strong>4 гостя:</strong> 9 000 ₽ за сутки</li>
            <li><strong>6 гостей:</strong> 9 900 ₽ за сутки</li>
            <li><strong>C 31 декабря по 3 января</strong> 25000р</li>
            <li><strong>C 4 по 10 января</strong> 20000р</li>
            <li><strong>6 гостей максимум</strong></li>
          </ul>
        </section>

        <BookingForm roomId={null} roomPrice={5000}/>
      </div>
    </div>
  );
}
