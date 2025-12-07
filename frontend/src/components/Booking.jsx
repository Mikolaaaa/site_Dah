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
          </p>
        </div>

        {/* Краткий блок с ценами */}
        <section className="pricing-summary">
          <h2>Кратко о ценах</h2>
          <ul>
            <li><strong>2 гостя:</strong> 10 000 ₽ за сутки</li>
            <li><strong>4 гостя:</strong> 14 000 ₽ за сутки</li>
            <li><strong>6 гостей:</strong> 17 000 ₽ за сутки</li>
            <li><strong>Дополнительные места:</strong> 2 500 ₽ за человека в сутки</li>
            <li><strong>Максимум гостей:</strong> до 11 человек</li>
            <li><strong>Праздничные дни:</strong> стоимость может отличаться, уточняйте при бронировании</li>
          </ul>
        </section>

        <BookingForm roomId={null} roomPrice={5000}/>
      </div>
    </div>
  );
}
