import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h3>🏔️ Гостиница Даховский берег</h3>
          <p>Станица Даховская, Республика Адыгея</p>
        </div>

        <div className="footer-section">
          <h4>Контакты</h4>
          <p>Телефон: +7 (XXX) XXX-XX-XX</p>
          <p>Email: info@dah-reka.ru</p>
        </div>

        <div className="footer-section">
          <h4>Социальные сети</h4>
          <div className="social-links">
            <a href="#" target="_blank" rel="noopener noreferrer">Instagram</a>
            <a href="#" target="_blank" rel="noopener noreferrer">VK</a>
            <a href="#" target="_blank" rel="noopener noreferrer">Telegram</a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2025 Даховский берег. Все права защищены.</p>
      </div>
    </footer>
  );
}
