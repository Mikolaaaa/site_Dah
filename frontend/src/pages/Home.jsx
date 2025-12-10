import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PhotoGallery from '../components/PhotoGallery';
import { roomAPI } from '../api';


export default function Home() {
  const [rooms, setRooms] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const heroImages = [
    '/images/house-main.jpg',
    '/images/main2.jpg',
    '/images/main3.jpg',
    '/images/main4.jpg',
    '/images/main5.jpg'
  ];

  useEffect(() => {
    roomAPI.getAll()
      .then(res =>{
        setRooms(Array.isArray(res.data) ? res.data : []);
      })
      .catch(err => {
        console.error('Error loading rooms:', err);
        setRooms([]);
      });
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) =>
        (prevIndex + 1) % heroImages.length
      );
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) =>
      (prevIndex + 1) % heroImages.length
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? heroImages.length - 1 : prevIndex - 1
    );
  };

  return (
      <div className="home-page">
        <section className="hero-main">
          <div className="hero-main-content">
            <div className="hero-text1">
              <h1>Гостиница Даховский берег</h1>
              <h3>📍 Адрес: Республика Адыгея, Майкопский район, станица Даховская, Кубанская 42</h3>
              <div className="hero-tags1">
                <span>⛰️ Горы и чистая река</span>
                <span>🔥 Барбекю-зона</span>
                <span>🏡 Три спальни</span>
                <span>🅿️ Парковка</span>
                <span>📶 Wi-Fi</span>
                <span>❄️ Кондиционер</span>
                <span>🌳 10 соток участка</span>
              </div>
              <div className="hero-description">
                <p>
                  Просторный коттедж, три спальни, кухня-зал и уютный двор.
                  Всё для семейного отдыха и компаний друзей у подножия Кавказа.
                </p>
              </div>
              <Link to="/house-tour" className="btn-hero-main">Посмотреть комнаты</Link>
              <Link to="/booking" className="btn-hero-main">
                Забронировать дом
              </Link>
            </div>
            <div className="hero-image hero-carousel">
              <img
                  src={heroImages[currentImageIndex]}
                  alt="Гостиница Даховский берег"
                  className="hero-carousel-image"
              />
              {/* Кнопки навигации */}
              <button
                  onClick={prevImage}
                  className="carousel-btn carousel-btn-prev"
                  aria-label="Previous image"
              >
                ←
              </button>
              <button
                  onClick={nextImage}
                  className="carousel-btn carousel-btn-next"
                  aria-label="Next image"
              >
                →
              </button>
              {/* Точки индикаторов */}
              <div className="carousel-indicators">
                {heroImages.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`carousel-dot ${currentImageIndex === index ? 'active' : ''}`}
                        aria-label={`Go to image ${index + 1}`}
                    />
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="property-tour">
          <div className="container">
            <h2>Наши комнаты и территория</h2>

            <div className="tour-grid">
              {rooms.map((room) => (
                  <div className="tour-card" key={room.id}>
                    <div className="tour-card-image">
                      <img
                          src={room.photos && room.photos.length > 0
                              ? room.photos[0].url
                              : '/images/placeholder.jpg'
                          }
                          alt={room.name}
                      />
                      <div className="tour-card-overlay">
                        <Link to={`/rooms/${room.id}`} className="btn-overlay-detail">
                          Посмотреть детали
                        </Link>
                      </div>
                    </div>
                    <div className="tour-content">
                      <h3>{room.name}</h3>
                      <p>{room.short_description || room.description?.substring(0, 150) + '...'}</p>
                      <Link to={`/rooms/${room.id}`} className="btn-room-detail-new">
                        <span className="btn-text">Подробнее о комнате</span>
                        <span className="btn-arrow">→</span>
                      </Link>
                    </div>
                  </div>
              ))}
            </div>
            <div className="features-note">
              <p>
                <strong>Дом полностью оборудован</strong> для самостоятельного проживания:
                от постельного белья до кухонной утвари. Вы почувствуете себя как дома,
                наслаждаясь тишиной, свежим горным воздухом и потрясающими видами на природу Адыгеи.
              </p>
            </div>
          </div>
        </section>

        {/* Адрес и карта */}
        <section className="location-section">
          <h2>Где мы находимся</h2>
          <div className="location-content">
            <div className="location-info">
              <h3>📍 Адрес: Республика Адыгея, Майкопский район, станица Даховская, Кубанская 42</h3>
              <p className="contact">
                <strong>📞 Телефон:</strong> <a href="tel:+79184340808">+7 (918) 434-08-08</a>
              </p>
              <p className="contact">
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


        {/* Идеально для */}
        <section className="ideal-for container">
          <h2>Идеально для</h2>
          <div className="ideal-grid">
            <div className="ideal-item">
              <span className="ideal-emoji">👨‍👩‍👧‍👦</span>
              <h4>Семейного отдыха</h4>
            </div>
            <div className="ideal-item">
              <span className="ideal-emoji">💑</span>
              <h4>Романтических выходных</h4>
            </div>
            <div className="ideal-item">
              <span className="ideal-emoji">👥</span>
              <h4>Отдыха с друзьями</h4>
            </div>
            <div className="ideal-item">
              <span className="ideal-emoji">🏔️</span>
              <h4>Активного туризма</h4>
              <p className="ideal-activities">Рафтинг • Треккинг • Конные прогулки</p>
            </div>
          </div>
        </section>

        {/* Галерея */}
        <section className="gallery-preview container">
          <h2>Фотогалерея</h2>
          <p className="section-subtitle">Посмотрите, как выглядит наша гостиница</p>
          <PhotoGallery category="hotel"/>
          <div className="gallery-cta">
            <Link to="/gallery" className="btn btn-secondary">
              Посмотреть все фото
            </Link>
          </div>
        </section>

        {/* CTA секция */}
        <section className="cta-section">
          <div className="container">
            <h2>Готовы забронировать?</h2>
            <p>Выберите номер и забронируйте свой идеальный отдых в горах Адыгеи</p>
            <Link to="/house-tour" className="btn btn-large">
              Посмотреть комнаты дома
            </Link>
          </div>
        </section>
      </div>
  );
}
