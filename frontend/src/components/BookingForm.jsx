import React, { useState, useEffect } from 'react';
import { roomAPI, bookingAPI } from '../api';

export default function BookingForm() {
  const [formData, setFormData] = useState({
    guest_name: '',
    guest_phone: '',
    guest_email: '',
    check_in: '',
    check_out: '',
    guests_count: 1,
  });
  const [bookedDates, setBookedDates] = useState([]);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    loadBookedDates();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrorMsg(''); // Очистить ошибку при изменении
  };

  const calculateDays = () => {
    if (!formData.check_in || !formData.check_out) return 0;
    const start = new Date(formData.check_in);
    const end = new Date(formData.check_out);
    const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    return days > 0 ? days : 0;
  };

  const loadBookedDates = async () => {
    try {
      const response = await bookingAPI.getBookedDates();
      setBookedDates(response.data);
    } catch (error) {
      console.error('Ошибка загрузки занятых дат:', error);
    }
  };

  const isDateRangeAvailable = () => {
    if (!formData.check_in || !formData.check_out) return true;

    const checkIn = new Date(formData.check_in);
    const checkOut = new Date(formData.check_out);

    for (const period of bookedDates) {
      const bookedIn = new Date(period.check_in);
      const bookedOut = new Date(period.check_out);

      // Проверка пересечения
      if (checkIn < bookedOut && checkOut > bookedIn) {
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!isDateRangeAvailable()) {
      setErrorMsg('⚠️ Выбранные даты заняты. Пожалуйста, выберите другие.');
      return;
    }

    try {
      const bookingData = {
        ...formData,
        check_in: formData.check_in,
        check_out: formData.check_out,
        guests_count: parseInt(formData.guests_count),
      };

      await bookingAPI.create(bookingData);
      alert('Бронирование успешно создано!');
      setFormData({
        guest_name: '',
        guest_phone: '',
        guest_email: '',
        check_in: '',
        check_out: '',
        guests_count: 1,
      });
    } catch (error) {
      if (error.response?.data?.detail) {
        setErrorMsg(error.response.data.detail);
      } else {
        setErrorMsg('Ошибка при создании бронирования');
      }
    }
  };

  const days = calculateDays();
  const totalPrice = days * 9900;

  return (
    <form className="booking-form" onSubmit={handleSubmit}>

      <label htmlFor="guest_name">Имя<span style={{color: '#db2828'}}>*</span></label>
      <input
        type="text"
        name="guest_name"
        id="guest_name"
        placeholder="Ваше имя (например, Михаил)"
        value={formData.guest_name}
        onChange={handleChange}
        required
      />

      <label htmlFor="guest_phone">Телефон<span style={{color: '#db2828'}}>*</span></label>
      <input
        type="tel"
        name="guest_phone"
        id="guest_phone"
        placeholder="+7 (999) 888-77-66 или 79998887766"
        value={formData.guest_phone}
        onChange={handleChange}
        required
      />

      <label htmlFor="guest_email">Email</label>
      <input
        type="email"
        name="guest_email"
        id="guest_email"
        placeholder="Электронная почта для подтверждения (необязательно)"
        value={formData.guest_email}
        onChange={handleChange}
      />

      <p style={{margin:"8px 0 5px 0", color:"#285f22", fontStyle:"italic"}}>
        Выберите дату заезда и выезда:
      </p>

      <label htmlFor="check_in">Дата заезда<span style={{color: '#db2828'}}>*</span></label>
      <input
        type="date"
        name="check_in"
        id="check_in"
        value={formData.check_in}
        onChange={handleChange}
        required
      />

      <label htmlFor="check_out">Дата выезда<span style={{color: '#db2828'}}>*</span></label>
      <input
        type="date"
        name="check_out"
        id="check_out"
        value={formData.check_out}
        onChange={handleChange}
        required
      />

      <label htmlFor="guests_count">Количество гостей<span style={{color: '#db2828'}}>*</span></label>
      <input
        type="number"
        name="guests_count"
        id="guests_count"
        min="1"
        placeholder="Сколько человек будет проживать?"
        value={formData.guests_count}
        onChange={handleChange}
        required
      />

      {bookedDates.length > 0 && (
        <div className="busy-dates-tip" style={{
          background: '#fff3cd',
          border: '1px solid #ffc107',
          borderRadius: '8px',
          padding: '12px',
          marginTop: '15px'
        }}>
          <b>⚠️ Занятые даты:</b>
          <ul style={{margin: '8px 0', paddingLeft: '20px'}}>
            {bookedDates.map((period, i) => (
              <li key={i}>
                {new Date(period.check_in).toLocaleDateString('ru-RU')} – {new Date(period.check_out).toLocaleDateString('ru-RU')}
              </li>
            ))}
          </ul>
          <span style={{color: '#856404', fontSize: '0.9em'}}>
            Пожалуйста, выберите другие даты.
          </span>
        </div>
      )}

      {/* Ошибка */}
      {errorMsg && (
        <div className="booking-error" style={{
          background: '#f8d7da',
          color: '#721c24',
          padding: '12px',
          borderRadius: '8px',
          marginTop: '10px'
        }}>
          {errorMsg}
        </div>
      )}

      {/* Итоговая стоимость */}
      {days > 0 && (
          <div className="total-price">
              <p>Количество ночей: {days}</p>
              <p className="total">Итого: {totalPrice.toLocaleString('ru-RU')} ₽</p>
          </div>
      )}

        <button
            type="submit"
            className="btn btn-primary"
        disabled={days <= 0}
      >
        Забронировать
      </button>
    </form>
  );
}
