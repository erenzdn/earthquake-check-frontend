import React from 'react';
import { motion } from 'framer-motion';

function HowItWorks() {
  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Nasıl Çalışır?</h1>
        <p className="page-subtitle">EarthquakeCheck deprem risk analizi uygulamamızın çalışma prensiplerini keşfedin</p>
      </div>

      <div className="content-section">
        <motion.div 
          className="info-card"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="step-number">1</div>
          <div className="info-content">
            <h2>Konum Belirleme</h2>
            <p>İki farklı yöntemle konum bilgilerinizi girebilirsiniz:</p>
            <ul>
              <li><strong>Adres Girişi:</strong> Tam adresinizi yazarak sistemimizin koordinatları bulmasını sağlayabilirsiniz.</li>
              <li><strong>Harita Seçimi:</strong> Harita üzerinde binanızın konumunu işaretleyerek daha hassas bir konum belirleyebilirsiniz.</li>
            </ul>
            <p>EarthquakeCheck, belirtilen konumdaki zemin yapısı, fay hatları ve geçmiş deprem verilerini analiz ederek risk değerlendirmesinde bulunur.</p>
          </div>
        </motion.div>

        <motion.div 
          className="info-card"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="step-number">2</div>
          <div className="info-content">
            <h2>Bina Bilgileri</h2>
            <p>Binanızın yapısal özelliklerini belirtmeniz gerekmektedir:</p>
            <ul>
              <li><strong>Yapım Yılı:</strong> Bina ne zaman inşa edildi? Bu bilgi, yapım sırasında uygulanan deprem yönetmeliklerini anlamak için kritik öneme sahiptir.</li>
              <li><strong>Kat Sayısı:</strong> Binanın toplam kat sayısı. Yüksek binalar farklı dinamik özelliklere sahip olabilir.</li>
            </ul>
            <p>Bu bilgiler, binanızın yapısal özelliklerini anlamak ve risk değerlendirmesini hassaslaştırmak için kullanılır.</p>
          </div>
        </motion.div>

        <motion.div 
          className="info-card"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <div className="step-number">3</div>
          <div className="info-content">
            <h2>Veri Analizi & Algoritmalar</h2>
            <p>Risk analizimiz şu kaynaklardan toplanan verileri değerlendirir:</p>
            <ul>
              <li>Deprem bölgesi haritaları ve yakın fay hatları</li>
              <li>Zemin yapısı ve sıvılaşma potansiyeli</li>
              <li>Yapı yönetmelikleri ve tarihsel uyumluluk</li>
              <li>Bölgesel deprem geçmişi</li>
            </ul>
            <p>Makine öğrenmesi modellerimiz, 100.000'den fazla bina değerlendirmesi ve gerçek depremlerdeki performans verilerine dayanarak eğitilmiştir.</p>
          </div>
        </motion.div>

        <motion.div 
          className="info-card"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <div className="step-number">4</div>
          <div className="info-content">
            <h2>Sonuç Değerlendirmesi</h2>
            <p>Risk analizimiz size şu bilgileri sunar:</p>
            <ul>
              <li><strong>Güvenlik Derecesi (A-F):</strong> A en güvenli, F en riskli kategoriyi temsil eder</li>
              <li><strong>Risk Yüzdesi:</strong> Binanızın genel risk durumunu sayısal olarak gösterir</li>
              <li><strong>Öneriler:</strong> Risk seviyenize göre alınması gereken önlemler</li>
              <li><strong>En Yakın Toplanma Alanı:</strong> Acil durum toplanma noktası bilgileri</li>
            </ul>
            <p>Sonuçlarınızı yazdırabilir veya yeni bir analiz için başka bir bina değerlendirebilirsiniz.</p>
          </div>
        </motion.div>
      </div>

      <div className="content-section">
        <h2 className="section-title">Önemli Notlar</h2>
        <div className="notes-container">
          <div className="note-card">
            <div className="note-icon">⚠️</div>
            <p>Bu risk değerlendirmesi genel bir tahmindir ve kesin bir yapısal analiz yerine geçmez. Bina güvenliğinden endişe duyuyorsanız, bir yapı mühendisine danışmanızı tavsiye ederiz.</p>
          </div>
          <div className="note-card">
            <div className="note-icon">📊</div>
            <p>Analiz sonuçları bilimsel verilere dayansa da, her binanın benzersiz özelliklere sahip olduğunu ve gerçek deprem performansının farklılık gösterebileceğini unutmayın.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HowItWorks; 