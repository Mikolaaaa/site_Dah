import React from 'react';
import { Link } from 'react-router-dom';

export default function Pricing() {
  return (
    <div className="pricing-page">
      <div className="container">
        {/* Hero: текст слева, фото справа */}
        <section className="pricing-hero">
          <div className="pricing-hero-text">
            <h1>Цены на аренду дома</h1>
            <p>
              Дом сдаётся целиком. Стоимость зависит от количества гостей и выбранных дат.
            </p>
            <Link to="/booking" className="btn-hero-main">
              Забронировать дом
            </Link>

            {/* Таблица прямо в этом блоке */}
            <div className="pricing-table-inline">
              <table className="pricing-table">
                <thead>
                <tr>
                  <th>Количество гостей</th>
                  <th>Стоимость за сутки</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                  <td>2 гостя</td>
                  <td>10 000 ₽</td>
                </tr>
                <tr>
                  <td>4 гостя</td>
                  <td>14 000 ₽</td>
                </tr>
                <tr>
                  <td>6 гостей</td>
                  <td>17 000 ₽</td>
                </tr>
                <tr>
                  <td>Доп. гости (до 11 чел.)</td>
                  <td>2 500 ₽ за человека</td>
                </tr>
                <tr>
                  <td>Праздничные дни</td>
                  <td>цена может быть изменена</td>
                </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="pricing-hero-image">
            <img src="/images/house-main.jpg" alt="Дом Даховский берег"/>
          </div>
        </section>

        {/* Галерея */}
        <section className="pricing-gallery">
          <h2>Дом и территория</h2>
          <div className="pricing-gallery-grid">
            <img src="/images/main2.jpg" alt="Дом снаружи"/>
            <img src="/images/main6.jpg" alt="Барбекю-зона"/>
            <img src="/images/main3.jpg" alt="Гостиная"/>
            <img src="/images/main7.jpg" alt="Вид на горы"/>
          </div>
        </section>

        {/* Финальный CTA */}
        <section className="pricing-cta">
          <h2>Готовы забронировать?</h2>
          <p>
            Укажите даты и количество гостей — система рассчитает стоимость автоматически.
          </p>
          <Link to="/booking" className="btn btn-large">
            Перейти к бронированию
          </Link>
        </section>
      </div>
    </div>
  );
}
