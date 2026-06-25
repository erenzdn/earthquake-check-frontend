import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { LuPhone, LuMail, LuMapPin, LuLinkedin, LuGithub, LuGlobe } from 'react-icons/lu';

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // API entegrasyonu yerine gerçek bir gönderim yapmadığımız için
    // başarılı bir gönderim simüle ediyoruz
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitStatus('success');
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
      
      // Başarı mesajını 5 saniye sonra temizle
      setTimeout(() => {
        setSubmitStatus(null);
      }, 5000);
    }, 1500);
  };
  
  return (
    <div className="page-container contact-page">
      <div className="page-header">
        <h1 className="page-title">İletişim</h1>
        <p className="page-subtitle">Sorularınız ve geri bildirimleriniz için bizimle iletişime geçin</p>
      </div>
      
      <div className="contact-container contact-layout">
        <motion.div 
          className="contact-info"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2>Bize Ulaşın</h2>
          
          <div className="contact-block">
            <div className="contact-icon">
              <LuPhone />
            </div>
            <div className="contact-text">
              <h3>Telefon</h3>
              <p>+90 507 027 6300</p>
            </div>
          </div>
          
          <div className="contact-block">
            <div className="contact-icon">
              <LuMail />
            </div>
            <div className="contact-text">
              <h3>E-posta</h3>
              <p>mehmeteren850@gmail.com</p>
            </div>
          </div>
          
          <div className="contact-block">
            <div className="contact-icon">
              <LuMapPin />
            </div>
            <div className="contact-text">
              <h3>Adres</h3>
              <p>İstanbul, Türkiye</p>
            </div>
          </div>
          
          <div className="social-links">
            <h3>Sosyal Medya & İletişim</h3>
            <div className="social-icons">
              <a 
                href="https://www.linkedin.com/in/mehmet-eren-%C3%B6zden" 
                className="social-icon" 
                target="_blank" 
                rel="noopener noreferrer" 
                aria-label="LinkedIn"
              >
                <LuLinkedin />
              </a>
              <a 
                href="https://github.com/erenzdn" 
                className="social-icon" 
                target="_blank" 
                rel="noopener noreferrer" 
                aria-label="GitHub"
              >
                <LuGithub />
              </a>
              <a 
                href="mailto:mehmeteren850@gmail.com" 
                className="social-icon" 
                aria-label="E-posta"
              >
                <LuMail />
              </a>
              <a 
                href="https://mehmeterenozden.com" 
                className="social-icon" 
                target="_blank" 
                rel="noopener noreferrer" 
                aria-label="Web Sitesi"
              >
                <LuGlobe />
              </a>
            </div>
          </div>
        </motion.div>
        
        <motion.div 
          className="contact-form-container"
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h2>Mesaj Gönderin</h2>
          
          {submitStatus === 'success' && (
            <div className="success-message">
              Mesajınız başarıyla gönderildi! En kısa sürede size dönüş yapacağız.
            </div>
          )}
          
          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Ad Soyad</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Adınız ve soyadınız"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="email">E-posta</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="E-posta adresiniz"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="subject">Konu</label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
                placeholder="Mesaj konunuz"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="message">Mesaj</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                placeholder="Mesajınızı buraya yazın..."
                rows="5"
              ></textarea>
            </div>
            
            <button 
              type="submit" 
              className={`submit-button ${isSubmitting ? 'loading' : ''}`}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span className="loading-spinner"></span>
              ) : (
                "Mesaj Gönder"
              )}
            </button>
          </form>
        </motion.div>
      </div>
      
      <div className="map-section contact-map-section">
        <h2 className="section-title">Konum</h2>
        <div className="google-map contact-map-card">
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d48168.83165063538!2d28.950779079101566!3d41.03644605!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14cab7650656bd63%3A0x8ca058b28c20b6c3!2zTWFzbGFrLCDFnmnFn2xpL8Swc3RhbmJ1bA!5e0!3m2!1str!2str!4v1652278456023!5m2!1str!2str" 
            width="100%" 
            height="450" 
            style={{ border: 0 }} 
            allowFullScreen="" 
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade"
            title="EarthquakeCheck Ofis Konumu"
          ></iframe>
        </div>
      </div>
    </div>
  );
}

export default Contact; 