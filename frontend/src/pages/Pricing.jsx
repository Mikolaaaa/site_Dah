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
            <p><strong>6 гостей максимум 🚨</strong></p>
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
                  <td>4 гостя</td>
                  <td>9 000 ₽</td>
                </tr>
                <tr>
                  <td>6 гостей</td>
                  <td>9 900 ₽</td>
                </tr>
                <tr>
                  <td>C 31 декабря по 3 января</td>
                  <td>25 000 ₽</td>
                </tr>
                <tr>
                  <td>с 4 по 10 января</td>
                  <td>20 000 ₽</td>
                </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="pricing-hero-image">
            <img src="/images/house-main.jpg" alt="Дом Даховский берег"/>
          </div>
        </section>

         <section className="location-section">
          <h2>Где мы находимся</h2>
          <div className="location-content">
            <div className="location-info">
              <p className="address">
                <strong>📍 Адрес:</strong> Республика Адыгея, Майкопский район, станица Даховская, Кубанская 42
              </p>
              <p className="contact">
                <strong>📞 Телефон:</strong> <a href="tel:+79184340808">+7 (918) 434-08-08</a>
                <strong>📞 Телефон:</strong> <a href="tel:+79184340808">+7 (928) 434-55-16</a>
              </p>
            </div>
            <div className="map-container">
              <iframe
                  src="https://yandex.ru/map-widget/v1/?um=constructor%3A607cc2515ad4d92bf7f61dae2478eb5f329143a170fe55b4f99a8c261f84fc46&amp;source=constructor"
                  width="500" height="400" frameBorder="0">
              </iframe>
            </div>
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
