import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  LuMapPin, 
  LuBuilding2, 
  LuActivity, 
  LuGlobe, 
  LuLayers, 
  LuChevronDown, 
  LuTriangleAlert, 
  LuDownload, 
  LuShieldAlert, 
  LuCpu
} from 'react-icons/lu';

function HowItWorks() {
  // State for active FAQ accordion item
  const [activeFaq, setActiveFaq] = useState(null);

  // State for Step 2 building hover floor simulator
  const [hoveredFloor, setHoveredFloor] = useState(null);

  const toggleFaq = (index) => {
    if (activeFaq === index) {
      setActiveFaq(null);
    } else {
      setActiveFaq(index);
    }
  };

  // Framer Motion Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.7,
        ease: [0.215, 0.61, 0.355, 1]
      }
    }
  };

  const steps = [
    {
      number: '01',
      title: 'Konum Belirleme',
      subtitle: 'Deprem risk analizinde ilk adım, binanızın tam coğrafi koordinatlarını saptamaktır.',
      description: 'Sistemimiz, iki yöntemle en doğru zemin ve fay hattı verilerine ulaşmanızı sağlar:',
      bullets: [
        { title: 'Adres Arama', text: 'Adresinizi yazarak akıllı jeo-kodlama motorumuzun koordinatları bulmasını sağlarsınız.' },
        { title: 'Harita Seçimi', text: 'Haritaya doğrudan tıklayıp binanızın bulunduğu parseli noktasal olarak işaretleyebilirsiniz.' }
      ],
      visualType: 'location'
    },
    {
      number: '02',
      title: 'Yapı Özelliklerinin Belirlenmesi',
      subtitle: 'Binanızın sismik dalgalara vereceği yapısal yanıtları anlamak için temel bilgileri toplarız.',
      description: 'Girilen her teknik veri, deprem yönetmelikleriyle eşleştirilerek risk formülüne dahil edilir:',
      bullets: [
        { title: 'Yapım Yılı', text: 'Binanızın hangi deprem yönetmeliği standartlarına (örneğin 1999 öncesi veya 2007/2018 sonrası) göre inşa edildiğini anlamak kritik önem taşır.' },
        { title: 'Kat Sayısı', text: 'Toplam kat yüksekliği, yapının rezonans frekansını ve deprem anında maruz kalacağı yükleri belirler.' }
      ],
      visualType: 'building'
    },
    {
      number: '03',
      title: 'Veri Analizi & Algoritmalar',
      subtitle: 'Toplanan konum ve yapı verileri, arka planda gelişmiş bilimsel veri katmanlarıyla entegre edilir.',
      description: 'EarthquakeCheck algoritmaları, şu veri kümelerini anlık olarak işler:',
      bullets: [
        { title: 'Fay Uzaklığı', text: 'En güncel diri fay hattı haritalarını kullanarak binanızın en yakın sismik kaynağa mesafesini hesaplar.' },
        { title: 'Zemin Yapısı', text: 'Konumunuzdaki zemin sınıfını (kaya, alüvyon vb.) ve sıvılaşma riskini sorgular.' },
        { title: 'Tarihsel Veriler', text: 'Bölgedeki geçmiş deprem büyüklüklerini ve ivme değerlerini analize katar.' }
      ],
      visualType: 'algorithm'
    },
    {
      number: '04',
      title: 'Risk Skoru & Öneri Raporu',
      subtitle: 'Analiz tamamlandığında karmaşık bilimsel veriler, anlaşılır ve eyleme dökülebilir bir rapora dönüştürülür.',
      description: 'Ende ettiğiniz ön analiz raporu şunları içerir:',
      bullets: [
        { title: 'Güvenlik Harf Notu', text: 'A\'dan F\'ye kadar uzanan risk derecelendirmesi (A en düşük risk, F en yüksek risk seviyesi).' },
        { title: 'Yüzdesel Değerlendirme', text: 'Yapısal ve zemin parametrelerinin ağırlıklı ortalamasıyla hesaplanan risk endeksi.' },
        { title: 'Eylem Tavsiyeleri', text: 'Risk derecenize göre atmanız gereken yapısal ve bireysel güvenlik adımları.' }
      ],
      visualType: 'report'
    }
  ];

  const reliabilitySources = [
    {
      icon: <LuActivity />,
      title: 'AFAD ve Kandilli Rasathanesi',
      desc: 'Aktif diri fay hatları, sismik aktivite veritabanları ve bölgesel deprem istatistikleri doğrudan entegre edilir.'
    },
    {
      icon: <LuBuilding2 />,
      title: 'Türkiye Bina Deprem Yönetmeliği',
      desc: 'Yapı yaş analizleri, Türkiye\'deki 1975, 1998, 2007 ve 2018 yıllarında yürürlüğe giren sismik mühendislik standartlarına göre ağırlıklandırılır.'
    },
    {
      icon: <LuGlobe />,
      title: 'USGS Küresel Sismik Verileri',
      desc: 'Uluslararası standartlarda deprem ivme modelleri ve kıtasal plaka hareket kestirim verileri analiz altyapımızı destekler.'
    },
    {
      icon: <LuLayers />,
      title: 'Geoteknik Zemin Haritaları',
      desc: 'İl ve ilçe bazlı zemin sınıfları, mikrobölgeleme çalışmaları, kaya-alüvyon zemin dağılımları ve sıvılaşma potansiyeli taranır.'
    }
  ];

  const faqs = [
    {
      q: 'Bu analiz resmi bir deprem dayanıklılık raporu yerine geçer mi?',
      a: 'Hayır, EarthquakeCheck uygulaması genel sismik veriler, zemin yapısı ve beyan ettiğiniz bina parametreleri üzerinden bir "ön risk tahmini" yapar. Kesin ve yasal olarak geçerli bir yapısal analiz raporu almak için Çevre, Şehircilik ve İklim Değişikliği Bakanlığı lisanslı yetkili mühendislik firmalarına başvurarak karot testi ve zemin etüdü yaptırmalısınız.'
    },
    {
      q: 'Risk derecelendirmesi (A-F) neyi ifade eder?',
      a: 'Harf notlarımız, binanızın deprem direnci yönünden genel durumunu sembolize eder. A ve B dereceleri, güncel yönetmeliklere uygun ve zemin kalitesi yüksek güvenli bölgeleri; D ve E dereceleri orta-yüksek riski; F derecesi ise eski bina yapısı ve zemin zayıflığı nedeniyle öncelikli sismik inceleme yapılması gereken en yüksek risk grubunu temsil eder.'
    },
    {
      q: 'Konum zemin verileri ne kadar güncel ve güvenilirdir?',
      a: 'Konum tabanlı zemin sınıflandırması ve fay hattı uzaklıkları, AFAD ve yerel yönetimlerin yayımladığı en güncel mikrobölgeleme geoteknik raporları ile sismik haritalara dayanmaktadır. Koordinatlarınız girildiğinde arka planda bu haritalardaki en yakın veri noktaları sorgulanır.'
    },
    {
      q: 'Analiz sonucunda yüksek risk çıkarsa ne yapmalıyım?',
      a: 'Yüksek risk (D, E veya F derecesi) çıkması durumunda paniğe kapılmamalısınız. Bu durum, yapınızın depremde kesinlikle yıkılacağı anlamına gelmez; ancak sismik olarak zayıf bir zemin veya eski bir bina yapısında olduğunuzu gösterir. İlk adım olarak apartman yönetimiyle görüşüp profesyonel bir yapı denetim ve risk tespit süreci başlatmanız ve acil durum eylem planlarınızı gözden geçirmeniz önerilir.'
    }
  ];

  // Render Interactive Mockups based on step
  const renderVisualMockup = (type) => {
    switch (type) {
      case 'location':
        return (
          <div className="mockup-map-grid">
            <div className="mockup-map-search">
              <div className="search-indicator"></div>
              <span className="search-text">Kadıköy, İstanbul</span>
              <svg 
                viewBox="0 0 20 20" 
                fill="currentColor" 
                style={{ width: '1.1rem', height: '1.1rem', color: '#10b981', flexShrink: 0 }}
              >
                <path 
                  fillRule="evenodd" 
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l5-5z" 
                  clipRule="evenodd" 
                />
              </svg>
            </div>
            <div className="mockup-map-marker">
              <div className="marker-pulse"></div>
              <LuMapPin className="marker-pin" />
            </div>
          </div>
        );
      case 'building':
        return (
          <div className="mockup-building-wireframe">
            <div className="building-label-card">
              <span className="label-item"><strong>Yapım Yılı:</strong> 1998 <span className="status-badge">Riskli Dönem</span></span>
              <span className="label-item"><strong>Kat Sayısı:</strong> 5 Kat</span>
              <span className="label-item"><strong>Yönetmelik:</strong> 1975 Standartları</span>
            </div>
            <div className="wireframe-building">
              {[1, 2, 3, 4, 5].map((floor) => (
                <div 
                  key={floor} 
                  className="wireframe-floor"
                  style={{
                    borderColor: hoveredFloor === floor ? 'var(--color-primary)' : '',
                    background: hoveredFloor === floor ? 'rgba(29, 78, 216, 0.15)' : '',
                    transform: hoveredFloor === floor ? 'scale(1.04)' : '',
                    boxShadow: hoveredFloor === floor ? '0 0 12px rgba(29, 78, 216, 0.15)' : ''
                  }}
                  onMouseEnter={() => setHoveredFloor(floor)}
                  onMouseLeave={() => setHoveredFloor(null)}
                >
                  <span style={{ fontSize: '0.65rem', color: 'rgba(15, 23, 42, 0.5)', fontWeight: 'bold', pointerEvents: 'none' }}>
                    Kat {floor}
                  </span>
                </div>
              ))}
            </div>
          </div>
        );
      case 'algorithm':
        return (
          <div className="mockup-algo-panel">
            <div className="algo-radar-ring ring-lg"></div>
            <div className="algo-radar-ring ring-md"></div>
            <div className="algo-radar-ring ring-sm"></div>
            <div className="radar-sweep-line"></div>
            <div className="algo-core">
              <LuCpu />
            </div>
            <div className="data-node node-1"></div>
            <div className="data-node node-2"></div>
            <div className="data-node node-3"></div>
            <div className="data-node node-4"></div>
          </div>
        );
      case 'report':
        return (
          <div className="mockup-report-card">
            <div className="report-gauge-container">
              <svg className="report-gauge-svg">
                <defs>
                  <linearGradient id="gauge-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#ef4444" />
                    <stop offset="50%" stopColor="#f59e0b" />
                    <stop offset="100%" stopColor="#10b981" />
                  </linearGradient>
                </defs>
                <circle className="gauge-track" cx="50" cy="50" r="40" />
                <circle className="gauge-fill" cx="50" cy="50" r="40" />
              </svg>
              <span className="gauge-grade">B</span>
            </div>
            <div className="report-card-details">
              <div className="report-card-title">Deprem Risk Analiz Raporu</div>
              <div className="report-card-score">Güvenlik Skoru: %68 (Orta Güvenli)</div>
            </div>
            <button className="report-card-button">
              <LuDownload />
              <span>Raporu İndir (.pdf)</span>
            </button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="page-container how-it-works-page">
      {/* Hero Section */}
      <div className="page-header">
        <h1 className="page-title">Nasıl Çalışır?</h1>
        <p className="page-subtitle">
          EarthquakeCheck deprem risk ön analizi uygulamamızın arkasındaki bilimsel yöntemleri, veri katmanlarını ve algoritma akışını keşfedin.
        </p>
      </div>

      {/* Steps Section */}
      <motion.div 
        className="how-it-works-timeline"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.08 }}
      >
        {steps.map((step, idx) => (
          <motion.div 
            className="timeline-step" 
            key={idx}
            variants={itemVariants}
          >
            <div className="timeline-step-content">
              <div className="timeline-step-badge">{step.number}</div>
              <h2>{step.title}</h2>
              <p>{step.subtitle}</p>
              <p style={{ fontSize: '0.96rem', color: 'var(--color-text-secondary)', marginBottom: '14px', fontStyle: 'italic' }}>
                {step.description}
              </p>
              <ul>
                {step.bullets.map((bullet, bIdx) => (
                  <li key={bIdx}>
                    <strong>{bullet.title}: </strong>{bullet.text}
                  </li>
                ))}
              </ul>
            </div>
            <div className="timeline-step-visual">
              <div className="mockup-container">
                {renderVisualMockup(step.visualType)}
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Reliability & Data Sources Section */}
      <motion.div 
        className="reliability-section"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 0.8 }}
      >
        <div className="reliability-header">
          <span className="section-tag">Veri Güvenilirliği</span>
          <h2>Bilimsel Veri Entegrasyonlarımız</h2>
          <p>
            Uygulamamız, gelişmiş risk ön analizi yapabilmek için ulusal ve uluslararası resmi deprem araştırmaları ve inşaat mühendisliği standartlarını harmanlar.
          </p>
        </div>

        <div className="reliability-grid">
          {reliabilitySources.map((source, idx) => (
            <div className="reliability-card" key={idx}>
              <div className="reliability-card-icon">
                {source.icon}
              </div>
              <h3>{source.title}</h3>
              <p>{source.desc}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* FAQ Accordion Section */}
      <motion.div 
        className="faq-section"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 0.8 }}
      >
        <div className="faq-header">
          <h2>Sıkça Sorulan Sorular</h2>
          <p>Deprem risk ön analizi süreci ve teknik detayları hakkında en çok merak edilenler.</p>
        </div>

        <div className="faq-container">
          {faqs.map((faq, idx) => (
            <div 
              className={`faq-item ${activeFaq === idx ? 'active' : ''}`} 
              key={idx}
            >
              <button 
                className="faq-question-btn" 
                onClick={() => toggleFaq(idx)}
                aria-expanded={activeFaq === idx}
              >
                <h3>{faq.q}</h3>
                <LuChevronDown className="faq-toggle-icon" />
              </button>
              <div className="faq-answer">
                <div className="faq-answer-content">
                  <p style={{ margin: 0, color: 'var(--color-text-secondary)' }}>{faq.a}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Disclaimer Section */}
      <motion.div 
        className="content-section how-it-works-notes"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="section-title">Hayati Uyarılar & Yasal Bilgilendirme</h2>
        <div className="notes-container">
          <div className="note-card">
            <div className="note-icon">
              <LuTriangleAlert />
            </div>
            <p>
              Bu risk değerlendirmesi bir <strong>ön analizdir</strong> ve kesinlikle binanızın nihai deprem performansını yansıtmaz. Bilimsel sismik ve geoteknik modellere dayanmasına rağmen hiçbir bina için resmi bir mühendislik raporu yerine konulamaz. Bina güvenliğinizden endişe duyuyorsanız resmi denetim yaptırmalısınız.
            </p>
          </div>
          <div className="note-card">
            <div className="note-icon">
              <LuShieldAlert style={{ color: '#ef4444' }} />
            </div>
            <p>
              Analiz sonuçları, kullanıcı tarafından beyan edilen yapım yılı ve kat sayısı gibi veriler üzerinden hesaplanmaktadır. Doğru olmayan beyanlar analizin tamamen hatalı sonuçlanmasına neden olur. EarthquakeCheck, bu platformda sunulan verilerin kullanımından kaynaklanabilecek kararlardan hukuki sorumluluk kabul etmez.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default HowItWorks;