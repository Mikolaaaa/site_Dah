import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI } from '../api';

export default function Header() {
  const navigate = useNavigate();
  const isAuth = authAPI.isAuthenticated();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const [menuOpen, setMenuOpen] = useState(false); // ⚠️ Состояние меню

  const handleLogout = () => {
    authAPI.logout();
    setMenuOpen(false);
    navigate('/');
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="logo" onClick={closeMenu}>
          <h1>🏔️ Дах-Река</h1>
        </Link>

        {/* ⚠️ Гамбургер кнопка */}
        <button
          className={`hamburger ${menuOpen ? 'active' : ''}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Меню"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        {/* ⚠️ Навигация с мобильным меню */}
        <nav className={`nav ${menuOpen ? 'active' : ''}`}>
          <Link to="/" onClick={closeMenu}>Главная</Link>
          <Link to="/house-tour">Комнаты дома</Link>
          <Link to="/gallery" onClick={closeMenu}>Галерея</Link>

          {isAuth ? (
            <>
              <Link to="/admin" onClick={closeMenu}>Админ</Link>
              <span className="user-name">👤 {user.full_name}</span>
              <button onClick={handleLogout} className="btn btn-small">
                Выход
              </button>
            </>
          ) : (
            <Link to="/login" onClick={closeMenu}>Вход</Link>
          )}
        </nav>
      </div>
    </header>
  );
}
