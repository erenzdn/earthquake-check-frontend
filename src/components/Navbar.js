import React, { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { LuMenu, LuX } from 'react-icons/lu';

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    // Sayfa değiştiğinde menüyü kapat
    setMenuOpen(false);
  }, [location]);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="nav-container">
        <Link to="/" className="app-title" aria-label="EarthquakeCheck ana sayfa">
          <img src="/logo.svg" alt="EarthquakeCheck logo" className="app-logo" />
          <span className="brand-text">
            Earthquake<span className="brand-text-accent">Check</span>
          </span>
        </Link>
        
        <button className="mobile-menu-btn" onClick={toggleMenu}>
          {menuOpen ? (
            <LuX />
          ) : (
            <LuMenu />
          )}
        </button>
        
        <div className={`nav-links ${menuOpen ? 'open' : ''}`}>
          <NavLink to="/" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'} end>
            Ana Sayfa
          </NavLink>
          <NavLink to="/nasil-calisir" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
            Nasıl Çalışır
          </NavLink>
          <NavLink to="/hakkimizda" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
            Hakkımızda
          </NavLink>
          <NavLink to="/iletisim" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
            İletişim
          </NavLink>
        </div>
      </div>
    </nav>
  );
}

export default Navbar; 