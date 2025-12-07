import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PhotoGallery from '../components/PhotoGallery';
import { roomAPI } from '../api';


export default function Home() {
  const [rooms, setRooms] = useState([]);

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
  return (
      <div className="home-page">
        <section className="hero-main">
          <div className="hero-main-content">
            <div className="hero-text">
              <h1>Гостиница Дах-Река</h1>
              <p className="hero-subtitle">Ваш уютный дом в Адыгее</p>
              <div className="hero-tags">
                <span>📍 Станица Даховская</span>
                <span>⛰️ Горы и чистая река</span>
              </div>
              <div className="hero-description">
                <p>
                  Просторный коттедж, три спальни, кухня-зал и уютный двор.
                  Всё для семейного отдыха и компаний друзей у подножия Кавказа.
                </p>
              </div>
              <Link to="/house-tour" className="btn-hero-main">Посмотреть номера →</Link>
            </div>
            <div className="hero-image">
              <img src="/images/house-main.jpg" alt="Гостиница Дах-Река"/>
            </div>
          </div>
        </section>

        <section className="property-tour">
          <div className="container">
            <h2>Знакомство с гостиницей</h2>

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
