import React from 'react';
import { motion } from 'framer-motion';
import { 
  LuSparkles, 
  LuBuilding2, 
  LuGlobe, 
  LuCode, 
  LuCpu, 
  LuShieldCheck, 
  LuArrowUpRight, 
  LuDatabase, 
  LuLayers 
} from 'react-icons/lu';

function About() {
  // Animasyon varyasyonları
  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
    }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  return (
    <div className="page-container about-page">
      {/* 1. Kahraman Alanı (Hero Section) */}
      <div className="page-header about-page-header">
        <motion.div 
          className="about-eyebrow"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <LuSparkles className="eyebrow-icon" />
          <span>Farkındalık & Teknoloji</span>
        </motion.div>
        <motion.h1 
          className="page-title"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          Deprem Güvenliğinde <br />
          <span className="text-gradient-primary">Dijital Dönüşüm</span>
        </motion.h1>
        <motion.p 
          className="page-subtitle"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Deprem risk analizini herkes için anlaşılır, hızlı ve tamamen güvenli hale getiren bilimsel altyapı.
        </motion.p>
      </div>

      {/* 2. Kurucu Bölümü (Founder Section) */}
      <motion.div 
        className="content-section founder-section"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={fadeInUp}
      >
        <div className="founder-profile-card">
          <div className="founder-info-container">
            <div className="founder-icon-anchor">
              <LuCode className="anchor-icon" />
            </div>
            
            <div className="info-eyebrow">PROJENİN ARKASINDAKİ İSİM</div>
            <h2 className="founder-name">Mehmet Eren Özden</h2>
            <div className="founder-title">Kıdemli Yazılım Mühendisi & Sistem Mimarı</div>
            
            <div className="founder-bio-content">
              <p className="founder-bio">
                EarthquakeCheck platformunun kurucusu ve baş sistem mimarı olan <strong>Mehmet Eren Özden</strong>, coğrafi bilgi sistemleri (CBS), yüksek ölçeklenebilir bulut altyapıları ve modern web teknolojileri alanında uzmanlaşmış bir bilgisayar mühendisidir. Yazılım mühendisliği ve dijital ürün tasarımı disiplinlerini bir araya getirerek, karmaşık yapısal risk analizi modellerini son kullanıcılar için sade, anlaşılır ve bilimsel raporlara dönüştüren teknik altyapıyı tasarlamış ve hayata geçirmiştir.
              </p>
              
              <p className="founder-bio-secondary">
                Toplum yararına odaklanan bu sosyal girişim kapsamında; AFAD sismik veri entegrasyonları, koordinat tabanlı zemin sınıfı analiz algoritmaları ve Türkiye Bina Deprem Yönetmeliği (TBDY) mühendislik parametrelerinin dijitalleştirilmesi süreçlerini yönetmektedir. Geliştirme süreçlerini uçtan uca veri güvenliği, yüksek performans ve kullanıcı gizliliği standartlarına bağlı kalarak yürüten Özden, dijital çözümlerle toplumsal deprem bilincinin artırılmasına öncülük etmektedir.
              </p>
            </div>

            <div className="founder-actions">
              <motion.a 
                href="https://mehmeterenozden.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="founder-website-btn"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span>mehmeterenozden.com</span>
                <LuArrowUpRight className="btn-arrow" />
              </motion.a>
            </div>
          </div>
        </div>
      </motion.div>

      {/* 3. Platform Değerleri (Platform Core Values) */}
      <div className="content-section values-section">
        <motion.div 
          className="section-header-centered"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="info-eyebrow">ÇALIŞMA İLKELERİMİZ</div>
          <h2 className="section-title">Platformumuzun Temel Sütunları</h2>
        </motion.div>

        <motion.div 
          className="values-grid"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          <motion.div className="value-card" variants={fadeInUp} whileHover="hover" custom={0}>
            <div className="value-icon-wrapper">
              <LuCpu className="value-icon" />
            </div>
            <h3>Bilimsel Analiz</h3>
            <p>
              AFAD zemin verileri, yerel deprem yönetmelikleri ve yapı mühendisliği parametrelerini temel alan gelişmiş algoritmalarla çalışıyoruz.
            </p>
          </motion.div>

          <motion.div className="value-card" variants={fadeInUp} whileHover="hover" custom={1}>
            <div className="value-icon-wrapper">
              <LuGlobe className="value-icon" />
            </div>
            <h3>Herkes İçin Erişim</h3>
            <p>
              Karmaşık teknik raporları, herkesin saniyeler içinde kolayca anlayabileceği, sadeleştirilmiş ve görselleştirilmiş grafiklere dönüştürüyoruz.
            </p>
          </motion.div>

          <motion.div className="value-card" variants={fadeInUp} whileHover="hover" custom={2}>
            <div className="value-icon-wrapper">
              <LuShieldCheck className="value-icon" />
            </div>
            <h3>Uçtan Uca Gizlilik</h3>
            <p>
              Gizliliğinize önem veriyoruz. Analiz ettiğiniz bina veya adres bilgileri veritabanımıza asla kaydedilmez ve tamamen anonim kalır.
            </p>
          </motion.div>
        </motion.div>
      </div>

      {/* 4. Teknoloji Katmanı (Technology Architecture) */}
      <motion.div 
        className="content-section tech-section"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={fadeInUp}
      >
        <div className="tech-inner-card">
          <div className="tech-header">
            <div className="info-eyebrow">MÜHENDİSLİK VE ALTYAPI</div>
            <h2 className="section-title">Teknolojik Mimarimiz</h2>
            <p className="tech-subtitle">
              Saniyeler içinde hassas analizler sunabilmek için en modern yazılım ve veri işleme teknolojilerini kullanıyoruz.
            </p>
          </div>

          <div className="tech-grid">
            <div className="tech-item-card">
              <div className="tech-icon-title">
                <LuLayers className="tech-card-icon" />
                <h3>Modern Frontend</h3>
              </div>
              <p>React ve TailwindCSS tabanlı esnek arayüz, Framer Motion ve GSAP entegrasyonlarıyla pürüzsüz animasyonlar ve üst düzey kullanıcı deneyimi sunar.</p>
            </div>

            <div className="tech-item-card">
              <div className="tech-icon-title">
                <LuDatabase className="tech-card-icon" />
                <h3>Coğrafi Veri İşleme</h3>
              </div>
              <p>Koordinat tabanlı yerel zemin sınıfı tespiti, en yakın fay hatları mesafesi ve bölgesel ivme katsayılarının milisaniyeler düzeyinde hesaplanması.</p>
            </div>

            <div className="tech-item-card">
              <div className="tech-icon-title">
                <LuBuilding2 className="tech-card-icon" />
                <h3>Deprem Mühendisliği</h3>
              </div>
              <p>Türkiye Bina Deprem Yönetmeliği (TBDY) esasları doğrultusunda, binaların yaş, kat sayısı ve taşıyıcı sistem analiz formülleriyle modelleme.</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* 5. İşbirlikler (Partners) */}
      <motion.div 
        className="content-section partners-section"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeInUp}
      >
        <div className="partners-banner">
          <span className="partners-title">GÜVENİLİR VERİ KAYNAKLARI & ALTYAPI DESTEKÇİLERİ</span>
          <div className="partners-logos">
            <div className="partner-logo-item">
              <LuBuilding2 className="partner-logo-icon" />
              <span>AFAD Veri Sağlayıcı</span>
            </div>
            <div className="partner-divider"></div>
            <div className="partner-logo-item">
              <LuSparkles className="partner-logo-icon" />
              <span>TÜBİTAK Akademik Katkı</span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default About;