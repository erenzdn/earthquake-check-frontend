import React from 'react';
import { motion } from 'framer-motion';

function About() {
  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Hakkımızda</h1>
        <p className="page-subtitle">EarthquakeCheck'in hikayesi ve misyonu</p>
      </div>

      <div className="content-section">
        <motion.div
          className="about-intro"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <p className="intro-text">
            EarthquakeCheck, Türkiye'deki binaların deprem güvenliğini değerlendirmek ve toplumu bilinçlendirmek amacıyla kurulmuş bir sosyal girişimdir. Amacımız, herkesin yaşadığı binanın deprem riskini kolayca anlayabileceği bir platform sunmaktır.
          </p>
        </motion.div>

        <div className="about-content">
          <motion.div
            className="about-card"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="about-icon">🔍</div>
            <h2>Misyonumuz</h2>
            <p>
              Türkiye'deki her bireyin, yaşadığı binanın deprem güvenliğini anlayabilmesini ve gerekli önlemleri alabilmesini sağlamak. Deprem bilincini artırarak, toplum olarak daha güvenli yaşam alanları oluşturmaya katkıda bulunmak.
            </p>
          </motion.div>

          <motion.div
            className="about-card"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="about-icon">🌟</div>
            <h2>Vizyonumuz</h2>
            <p>
              Deprem risk analizini herkes için erişilebilir kılarak, can ve mal kayıplarını en aza indirmeye yardımcı olmak. Teknoloji ve bilimi bir araya getirerek, depreme dayanıklı bir Türkiye inşa etme çabalarına öncülük etmek.
            </p>
          </motion.div>
        </div>
      </div>

      <motion.div
        className="content-section team-section"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <h2 className="section-title">Ekibimiz</h2>
        <div className="team-container">
          <div className="team-member">
            <div className="member-photo">
              <img src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200&auto=format&fit=crop" alt="Ayşe Yılmaz" />
            </div>
            <h3 className="member-name">Ayşe Yılmaz</h3>
            <p className="member-title">Kurucu & İnşaat Mühendisi</p>
            <p className="member-bio">
              15 yıllık yapı güvenliği deneyimiyle, EarthquakeCheck'in teknik altyapısını ve risk değerlendirme metodolojisini geliştirdi.
            </p>
          </div>

          <div className="team-member">
            <div className="member-photo">
              <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop" alt="Mehmet Kaya" />
            </div>
            <h3 className="member-name">Mehmet Kaya</h3>
            <p className="member-title">Veri Bilimci</p>
            <p className="member-bio">
              Risk analizi algoritmalarımızı geliştiren ve deprem verilerini modelleyen yapay zeka uzmanı.
            </p>
          </div>

          <div className="team-member">
            <div className="member-photo">
              <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop" alt="Zeynep Demir" />
            </div>
            <h3 className="member-name">Zeynep Demir</h3>
            <p className="member-title">Yazılım Geliştirme Lideri</p>
            <p className="member-bio">
              Kullanıcı dostu arayüzümüzü tasarlayan ve platformun teknik altyapısını yöneten deneyimli yazılım mühendisi.
            </p>
          </div>
        </div>
      </motion.div>

      <motion.div
        className="content-section"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
      >
        <h2 className="section-title">Teknolojimiz</h2>
        <div className="technology-container">
          <div className="tech-card">
            <h3>Veri Kaynakları</h3>
            <ul>
              <li>AFAD deprem kayıtları ve risk haritaları</li>
              <li>Yapı denetim arşivleri ve bina envanterleri</li>
              <li>Zemin etüt raporları</li>
              <li>Uydu görüntüleri ve haritalama verileri</li>
            </ul>
          </div>
          <div className="tech-card">
            <h3>Analiz Yöntemleri</h3>
            <ul>
              <li>Makine öğrenmesi algoritmaları</li>
              <li>İstatistiksel analiz modelleri</li>
              <li>Yapısal mühendislik simülasyonları</li>
              <li>Coğrafi bilgi sistemleri (CBS)</li>
            </ul>
          </div>
        </div>
      </motion.div>

      <motion.div
        className="content-section"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
      >
        <h2 className="section-title">İşbirliklerimiz</h2>
        <p className="partners-intro">
          EarthquakeCheck olarak, aşağıdaki kurum ve kuruluşlarla işbirliği içinde çalışmaktayız:
        </p>
        <div className="partners-list">
          <div className="partner">
            <p>🏢 İstanbul Teknik Üniversitesi</p>
          </div>
          <div className="partner">
            <p>🏢 AFAD (Afet ve Acil Durum Yönetimi Başkanlığı)</p>
          </div>
          <div className="partner">
            <p>🏢 TÜBİTAK</p>
          </div>
          <div className="partner">
            <p>🏢 Türkiye Belediyeler Birliği</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default About; 