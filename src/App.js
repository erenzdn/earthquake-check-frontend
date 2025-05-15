import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import { motion } from "framer-motion";
import AOS from 'aos';
import 'aos/dist/aos.css';

// Componentler
import AddressForm from "./components/AddressForm";
import Navbar from "./components/Navbar";
import HowItWorks from "./components/HowItWorks";
import About from "./components/About";
import Contact from "./components/Contact";

// Ana Sayfa Componenti
function Home() {
  return (
    <>
      <section className="hero-section">
        <div className="hero-background"></div>
        <div className="hero-content">
          <motion.div 
            className="hero-text"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="hero-title">Binanızın Depreme Dayanıklılığını Kontrol Edin</h2>
            <p className="hero-subtitle">Adresinizi girin veya haritadan seçin, binanızın deprem riskini anında öğrenin. Güvenliğiniz için hemen analiz yapın.</p>
            <a href="#risk-form" className="hero-cta">
              <span>Hemen Başla</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
            </a>
          </motion.div>
          
          <motion.div 
            className="hero-image"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <img src="https://images.unsplash.com/photo-1544984243-ec57ea16fe25?q=80&w=700&auto=format&fit=crop" alt="Deprem güvenliği" />
          </motion.div>
        </div>
      </section>

      <main>
        <div className="app-description" data-aos="fade-up">
          <h2>Güvenliğiniz İçin Akıllı Analiz</h2>
          <p>Modern yapay zeka algoritmalarımız ve gelişmiş risk değerlendirme modellerimizle, binanızın olası bir depremde nasıl performans göstereceğini tahmin ediyoruz. Sadece birkaç dakika içinde, binanızın risk faktörlerini analiz edip size kapsamlı bir değerlendirme sunuyoruz.</p>
        </div>
        
        <div id="risk-form" data-aos="fade-up" data-aos-delay="200">
          <AddressForm />
        </div>
      </main>
    </>
  );
}

function App() {
  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
    });
  }, []);

  return (
    <Router>
      <div className="App">
        <Navbar />
        
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/nasil-calisir" element={<HowItWorks />} />
          <Route path="/hakkimizda" element={<About />} />
          <Route path="/iletisim" element={<Contact />} />
        </Routes>

        <footer className="app-footer">
          <div className="footer-container">
            <div className="footer-logo">EarthquakeCheck</div>
            <div className="footer-links">
              <a href="#" className="footer-link">Gizlilik Politikası</a>
              <a href="#" className="footer-link">Kullanım Şartları</a>
              <a href="#" className="footer-link">Yardım</a>
              <a href="#" className="footer-link">Sıkça Sorulan Sorular</a>
            </div>
            <p className="footer-copyright">© 2023 EarthquakeCheck | Tüm Hakları Saklıdır</p>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
