import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import "./App.css";
import { motion, AnimatePresence } from "framer-motion";
import { 
  LuArrowRight, 
  LuActivity, 
  LuMapPin, 
  LuMail, 
  LuGithub, 
  LuLinkedin, 
  LuSparkles, 
  LuChevronDown, 
  LuBadgeCheck, 
  LuBuilding2,
  LuFileText,
  LuLock,
  LuLayers,
  LuSettings,
  LuTimer,
  LuHeart,
  LuGlobe
} from "react-icons/lu";
import AOS from 'aos';
import 'aos/dist/aos.css';

// Componentler
import AddressForm from "./components/AddressForm";
import Navbar from "./components/Navbar";
import HowItWorks from "./components/HowItWorks";
import About from "./components/About";
import Contact from "./components/Contact";
import AdminMessages from "./components/AdminMessages";
import PageTransition from "./components/PageTransition";

// Ana Sayfa Componenti
function Home() {
  const [openFaq, setOpenFaq] = useState(null);
  const [earthquakes, setEarthquakes] = useState([]);
  const [eqLoading, setEqLoading] = useState(true);
  const [activeStepTab, setActiveStepTab] = useState(1);

  // Canlı deprem verilerini çekme (Kandilli Rasathanesi API veya Simülasyon)
  useEffect(() => {
    const fetchEarthquakes = async () => {
      try {
        const res = await fetch("https://api.orhanaydogdu.com.tr/deprem/kandilli/live?limit=5");
        const data = await res.json();
        if (data && data.status && data.result) {
          const formatted = data.result.slice(0, 4).map((eq, idx) => {
            const mag = parseFloat(eq.mag);
            let sinif = "low";
            if (mag >= 4.0) sinif = "high";
            else if (mag >= 3.0) sinif = "mid";
            return {
              id: idx,
              yer: eq.title,
              buyukluk: mag,
              saat: eq.date.split(" ")[1] || eq.date,
              derinlik: `${eq.depth} km`,
              sinif
            };
          });
          setEarthquakes(formatted);
        } else {
          throw new Error("Geçersiz veri formatı");
        }
      } catch (err) {
        // Hata durumunda gerçekçi yedek veriler
        setEarthquakes([
          { id: 1, yer: "Marmara Denizi (Yalova Açıkları)", buyukluk: 3.5, saat: "17:42", derinlik: "7.2 km", sinif: "mid" },
          { id: 2, yer: "Pütürge (Malatya)", buyukluk: 4.2, saat: "16:15", derinlik: "8.5 km", sinif: "high" },
          { id: 3, yer: "Göksun (Kahramanmaraş)", buyukluk: 2.8, saat: "15:30", derinlik: "5.0 km", sinif: "low" },
          { id: 4, yer: "Saray (Van)", buyukluk: 3.1, saat: "14:08", derinlik: "10.2 km", sinif: "low" },
        ]);
      } finally {
        setEqLoading(false);
      }
    };

    fetchEarthquakes();
    const interval = setInterval(fetchEarthquakes, 60000); // 1 dakikada bir güncelle
    return () => clearInterval(interval);
  }, []);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const faqData = [
    {
      q: "Bu ön analiz raporu ne kadar güvenilirdir?",
      a: "EarthquakeCheck ön analizi, binanızın yer aldığı konumun zemin parametreleri, deprem bölgesindeki konumu, yapım yılı ve kat sayısı gibi temel yapı mühendisliği faktörlerini kullanarak bilimsel algoritmalarla hesaplanır. Resmi bir rapor yerine geçmez fakat binanızın olası risk durumuna dair son derece tutarlı ve hızlı bir önizleme sunar."
    },
    {
      q: "Analiz için hangi bilgilere ihtiyacım var?",
      a: "Herhangi bir resmi teknik dokümana gerek yoktur. Sadece binanızın adresi (veya harita üzerindeki tam konumu), inşa yılı ve toplam kat sayısı bilgilerini girmeniz yeterlidir."
    },
    {
      q: "Girdiğim adres ve bina verileri kaydediliyor mu?",
      a: "Kişisel veri gizliliğine azami önem veriyoruz. Girdiğiniz konum ve bina bilgileri yalnızca anlık risk analizi hesaplamaları için kullanılır, veritabanımızda kesinlikle saklanmaz veya üçüncü taraflarla paylaşılmaz."
    },
    {
      q: "Analiz sonucu yüksek risk çıkarsa ne yapmalıyım?",
      a: "Ön analiz raporunuzda yüksek veya kritik risk düzeyi görüyorsanız, binanızın durumunu resmi olarak tescillemek ve gerekli güçlendirme/kentsel dönüşüm süreçlerini başlatmak adına Çevre ve Şehircilik Bakanlığı tarafından lisanslandırılmış yapı denetim firmalarına veya belediyenize başvurarak resmi Deprem Dayanıklılık Testi yaptırmanızı tavsiye ederiz."
    }
  ];

  return (
    <>
      {/* 1. Kahraman Alanı (Centered Hero Section) */}
      <section className="ec-premium-bg relative w-full pt-28 pb-24 md:pt-36 md:pb-32 overflow-hidden border-b border-slate-800 flex flex-col items-center justify-center">
        {/* Glow Işıkları */}
        <div className="ec-glow-ball ec-glow-ball-indigo" />
        <div className="ec-glow-ball ec-glow-ball-cyan" />

        <div className="mx-auto max-w-ecHero px-5 md:px-8 relative z-10 ec-centered-hero w-full">
          {/* Üst Rozet */}
          <motion.div 
            className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full ec-badge-glass text-xs font-medium uppercase tracking-[0.14em] mb-6"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <LuSparkles className="text-cyan-400 animate-pulse" />
            <span>Deprem Ön Analizinde Yeni Nesil Standart</span>
          </motion.div>
          
          {/* Başlık */}
          <motion.h1 
            className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-[1.05] text-center max-w-[20ch] mb-6 animate-fade-in"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            Binanızın Deprem Riskini <br />
            <span className="ec-text-gradient-cyan">Modern Modellerle</span> Raporlayın
          </motion.h1>
          
          {/* Açıklama */}
          <motion.p 
            className="text-lg md:text-xl text-slate-300 max-w-[65ch] text-center leading-relaxed mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Gelişmiş konum verilerini ve yapısal parametreleri coğrafi mühendislik algoritmalarıyla anında işliyoruz. Yapınıza özel şeffaf, hızlı ve bilimsel bir değerlendirme sunuyoruz.
          </motion.p>

          {/* Butonlar */}
          <motion.div 
            className="flex flex-col sm:flex-row items-center gap-4 mb-3 w-full sm:w-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <a 
              href="#risk-form" 
              className="btn-glow-indigo w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-semibold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5"
            >
              <span>Ön Analizi Başlat</span>
              <LuArrowRight className="text-lg" />
            </a>
            <Link 
              to="/nasil-calisir" 
              className="w-full sm:w-auto inline-flex items-center justify-center border border-slate-700 bg-slate-900/40 hover:bg-slate-900/80 text-slate-200 hover:text-white font-semibold px-8 py-4 rounded-xl transition-all duration-300 hover:border-slate-500"
            >
              Nasıl Çalışıyor?
            </Link>
          </motion.div>
          <p className="text-[11px] text-slate-500 font-mono mb-12">⚡️ Analiz tamamen ücretsizdir ve kayıt gerektirmez.</p>

          {/* Devasa Kontrol Paneli (Dashboard Viewport) Mockup */}
          <motion.div 
            className="dashboard-viewport w-full"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
          >
            {/* Header / Window Bar */}
            <div className="dashboard-header">
              <div className="window-dots">
                <div className="window-dot window-dot-red" />
                <div className="window-dot window-dot-yellow" />
                <div className="window-dot window-dot-green" />
              </div>
              <div className="window-address">
                earthquake-check://app.telemetry/preview
              </div>
            </div>

            {/* Body */}
            <div className="dashboard-body text-left">
              {/* Sidebar Mockup */}
              <div className="dashboard-sidebar font-mono text-[10px] text-slate-400">
                <div className="flex items-center gap-2 text-white bg-indigo-600/20 border border-indigo-500/20 px-2.5 py-1.5 rounded-md font-bold mb-4">
                  <LuActivity className="text-xs text-indigo-400" />
                  <span>DEPREM KONSOLU</span>
                </div>
                <div className="space-y-3 pl-2">
                  <div className="flex items-center gap-2 text-slate-300"><LuMapPin className="text-xs" /> Konum Matrisi</div>
                  <div className="flex items-center gap-2"><LuBuilding2 className="text-xs" /> Yapı Analizörü</div>
                  <div className="flex items-center gap-2"><LuLayers className="text-xs" /> Zemin Katmanları</div>
                  <div className="flex items-center gap-2"><LuSettings className="text-xs" /> Algoritma Ayarları</div>
                </div>
              </div>

              {/* Main Panel */}
              <div className="dashboard-main">
                {/* Sol Alan: Harita Simülatörü */}
                <div className="bg-slate-950/60 rounded-xl p-4 border border-slate-800/80 flex flex-col justify-between relative overflow-hidden">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.04),transparent)]" />
                  <div className="flex justify-between items-center text-[9px] font-mono text-slate-500 z-10">
                    <span>COĞRAFİ BİLGİ SİSTEMLERİ (CBS)</span>
                    <span className="flex items-center gap-1.5 text-emerald-400">
                      <span className="ec-pulse-dot" /> CANLI BAĞLANTI
                    </span>
                  </div>
                  
                  {/* Mock Radar Harita Çizimi */}
                  <div className="flex-grow flex items-center justify-center my-4 relative">
                    <svg viewBox="0 0 100 100" className="w-28 h-28 text-indigo-500/20" fill="none">
                      <circle cx="50" cy="50" r="45" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" />
                      <circle cx="50" cy="50" r="30" stroke="currentColor" strokeWidth="1" />
                      <circle cx="50" cy="50" r="15" stroke="currentColor" strokeWidth="1" strokeDasharray="1 1" />
                      <line x1="5" y1="50" x2="95" y2="50" stroke="currentColor" strokeWidth="0.5" />
                      <line x1="50" y1="5" x2="50" y2="95" stroke="currentColor" strokeWidth="0.5" />
                      <circle cx="65" cy="35" r="3" fill="#06b6d4" className="animate-pulse" />
                      <circle cx="35" cy="60" r="2" fill="#818cf8" />
                      <circle cx="45" cy="42" r="4" stroke="#e11d48" strokeWidth="1" />
                    </svg>
                  </div>
                  
                  <div className="text-[10px] font-mono text-slate-400 z-10 bg-slate-900/80 p-2 rounded border border-slate-800">
                    Konum: 41.0082° N, 28.9784° E <br />
                    Bölge: Marmara Sismik Fay Hattı
                  </div>
                </div>

                {/* Sağ Alan: Skyscraper Scanner ve Telemetri */}
                <div className="flex flex-col justify-between">
                  {/* Skyscraper wireframe scanner */}
                  <div className="scanner-building-wrap rounded-xl bg-slate-950/60 p-3 border border-slate-800/80 relative flex-grow flex items-center justify-center h-44 mb-3">
                    <div className="scanner-beam" />
                    <div className="scanner-overlay" />
                    
                    <svg viewBox="0 0 200 200" className="w-32 h-32 text-cyan-400 opacity-80" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <line x1="20" y1="180" x2="180" y2="180" stroke="#334155" strokeWidth="2" strokeDasharray="3 3" />
                      <rect x="45" y="55" width="45" height="125" rx="4" stroke="#6366f1" strokeWidth="1.5" strokeOpacity="0.7" />
                      <rect x="105" y="35" width="50" height="145" rx="4" stroke="#06b6d4" strokeWidth="1.5" />
                    </svg>
                  </div>

                  {/* PGA Wave Ticker */}
                  <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-2.5 font-mono text-[9px] text-slate-400">
                    <div className="flex justify-between mb-1 text-slate-500">
                      <span>SİSMİK PGA İVMESİ:</span>
                      <span className="text-rose-400">0.38g (AKTİF)</span>
                    </div>
                    <div className="h-6 overflow-hidden relative flex items-center">
                      <svg className="w-full h-full text-rose-500/80" viewBox="0 0 400 40" fill="none">
                        <path 
                          d="M 0,20 Q 15,35 30,5 T 60,20 T 90,20 T 120,38 T 150,2 T 180,20 T 210,20 T 240,32 T 270,8 T 300,20 T 330,20 T 360,20 T 400,20" 
                          stroke="currentColor" 
                          strokeWidth="1.5" 
                          strokeLinecap="round"
                          className="seismic-wave-path" 
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </section>

      {/* 2. Canlı Deprem Bilgi Akışı (Live Ticker) */}
      <section className="bg-slate-950 py-6 border-b border-slate-900 overflow-hidden">
        <div className="mx-auto max-w-ecHero px-5 md:px-8 flex flex-col md:flex-row items-center gap-6">
          <div className="flex items-center gap-2.5 text-xs font-semibold tracking-wider text-rose-500 uppercase shrink-0">
            <LuActivity className="text-base animate-pulse" />
            <span>Türkiye Son Depremler (Canlı):</span>
          </div>
          
          {eqLoading ? (
            <div className="text-sm text-slate-500 font-mono">Yükleniyor...</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
              {earthquakes.map((eq) => (
                <div 
                  key={eq.id} 
                  className="flex items-center gap-3 bg-slate-900/60 border border-slate-800/80 p-2.5 rounded-lg text-xs"
                >
                  <span className={`eq-badge shrink-0 text-sm ${
                    eq.sinif === 'high' ? 'eq-badge-high' : eq.sinif === 'mid' ? 'eq-badge-mid' : 'eq-badge-low'
                  }`}>
                    {eq.buyukluk.toFixed(1)}
                  </span>
                  <div className="overflow-hidden min-w-0">
                    <p className="text-slate-200 font-medium truncate">{eq.yer}</p>
                    <p className="text-slate-400 text-[10px] flex gap-2 mt-0.5">
                      <span>Saat: {eq.saat}</span>
                      <span>Derinlik: {eq.derinlik}</span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <main className="home-main bg-slate-50 w-full max-w-none px-0 py-0">
        
        {/* 3. Bento Grid Özellikler Bölümü */}
        <section className="py-24 bg-white border-b border-slate-100">
          <div className="mx-auto max-w-ecHero px-5 md:px-8">
            <div className="text-center max-w-[800px] mx-auto mb-16">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-indigo-600 mb-3">BİLİMSEL VE GÜVENLİ TEKNOLOJİ</p>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">
                Gelişmiş Ön Analiz Altyapısı
              </h2>
              <p className="mt-4 text-slate-500 text-base leading-relaxed">
                Yapınızın deprem güvenliğini belirlemek için konum ve yapı niteliklerini eş zamanlı inceleyen asimetrik veri modelleri kullanıyoruz.
              </p>
            </div>

            {/* Bento Grid Düzeni */}
            <div className="bento-grid">
              
              {/* Kutu 1: Geniş Kart - Zemin ve İvme */}
              <div className="bento-card bento-card-span-2 min-h-[340px]">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-lg mb-6">
                    <LuMapPin />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">Gelişmiş Zemin & İvme Haritalama</h3>
                  <p className="text-slate-500 text-sm leading-relaxed max-w-[55ch]">
                    Girdiğiniz koordinat verilerini kullanarak bölgenin diri fay hatlarına olan mesafesini, zemin sınıfını ve sismik ivme (PGA) katsayılarını coğrafi bilgi sistemleri (CBS) veritabanlarından çekerek işliyoruz.
                  </p>
                </div>
                
                {/* Mini Grafik Görseli */}
                <div className="mt-6 p-4 rounded-xl bg-slate-950/50 border border-slate-800/80 font-mono text-[9px] text-slate-400">
                  <div className="flex justify-between mb-1">
                    <span>SİSMİK İVMELENME DEĞERİ (ZEMİN)</span>
                    <span className="text-cyan-400">PGA: 0.38g</span>
                  </div>
                  <div className="h-10 flex items-center justify-center">
                    <svg className="w-full h-full text-cyan-400/80" viewBox="0 0 400 40" fill="none">
                      <path d="M 0,20 Q 25,5 50,20 T 100,20 T 150,38 T 200,2 T 250,20 T 300,20 T 350,30 T 400,20" stroke="currentColor" strokeWidth="1.5" fill="none" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Kutu 2: Dikey Kart - Yapısal Risk */}
              <div className="bento-card row-span-1 min-h-[340px]">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center text-lg mb-6">
                    <LuBuilding2 />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">Yapısal Dayanım Katsayısı</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">
                    İnşa yılı ve toplam kat sayısı gibi temel yapısal parametreleri, Türkiye Bina Deprem Yönetmeliği standartları temelindeki algoritmalarla değerlendiriyoruz.
                  </p>
                </div>
                
                <div className="mt-6 border-t border-slate-100 pt-4 space-y-2 text-xs font-mono text-slate-500">
                  <div className="flex justify-between">
                    <span>İnşa Yılı Kriteri:</span>
                    <span className="text-slate-800 font-bold">1999 Öncesi / Sonrası</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Kat Yüksekliği Sınırı:</span>
                    <span className="text-slate-800 font-bold">Dinamik İvme Hesabı</span>
                  </div>
                </div>
              </div>

              {/* Kutu 3: Kare Kart - KVKK Gizlilik */}
              <div className="bento-card min-h-[280px]">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center text-lg mb-6">
                    <LuLock />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">Veri Kayıt Defteri Tutulmaz</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">
                    Kişisel verilerinizin gizliliğine saygı duyuyoruz. Girdiğiniz adres ve bina nitelikleri yalnızca anlık hesaplama oturumunda işlenir, veritabanımızda kalıcı olarak saklanmaz.
                  </p>
                </div>
                <div className="text-[10px] text-slate-400 font-mono mt-4">
                  🔒 KVKK UYUMLU SEANS
                </div>
              </div>

              {/* Kutu 4: Kare Kart - Sosyal Sorumluluk */}
              <div className="bento-card min-h-[280px]">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-lg mb-6">
                    <LuHeart />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">Sosyal Sorumluluk Girişimi</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">
                    Amacımız halk sağlığı ve deprem bilincini artırmaktır. EarthquakeCheck, herkesin yaşadığı yapının durumu hakkında fikir sahibi olması için geliştirilmiş tamamen ücretsiz bir projedir.
                  </p>
                </div>
                <div className="text-[10px] text-slate-400 font-mono mt-4">
                  ❤️ DEPREM FARKINDALIĞI
                </div>
              </div>

              {/* Kutu 5: Kare Kart - Hızlı Sonuç */}
              <div className="bento-card min-h-[280px]">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center text-lg mb-6">
                    <LuTimer />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">3 Dakikada Rapor</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">
                    Uzun süren bürokratik prosedürlere veya pahalı dayanıklılık testlerine girmeden önce, binanızın durumuna dair en hızlı teknik risk projeksiyonunu elde edin.
                  </p>
                </div>
                <div className="text-[10px] text-slate-400 font-mono mt-4">
                  ⏱️ ANINDA PDF ÇIKTISI
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* 4. Etkileşimli Süreç Sekmeleri (Interactive Steps) */}
        <section className="py-24 bg-slate-50 border-b border-slate-100">
          <div className="mx-auto max-w-ecHero px-5 md:px-8">
            <div className="text-center max-w-[800px] mx-auto mb-16">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-indigo-600 mb-3">KULLANICI AKIŞI</p>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">
                Analiz Süreci Nasıl İşler?
              </h2>
              <p className="mt-4 text-slate-500 text-base">
                Sekmelere tıklayarak analiz esnasındaki aşamaları ve sistemin arka planda ürettiği çıktıları önizleyin.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              {/* Sol Alan: Sekme Seçimi */}
              <div className="lg:col-span-5 space-y-4">
                <button 
                  onClick={() => setActiveStepTab(1)}
                  className={`w-full text-left p-6 rounded-2xl border transition-all duration-300 ${
                    activeStepTab === 1 
                      ? 'bg-white border-indigo-500/40 shadow-md ring-1 ring-indigo-500/10' 
                      : 'bg-white/60 border-slate-200/60 hover:bg-white hover:border-slate-300'
                  }`}
                >
                  <h3 className="font-bold text-slate-900 text-base mb-1.5 flex items-center gap-2">
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${activeStepTab === 1 ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-500'}`}>1</span>
                    Konum ve Adres Belirleme
                  </h3>
                  <p className="text-slate-500 text-xs leading-relaxed pl-8">
                    Adresinizi yazın veya harita üzerinden yapınızın tam koordinatlarını işaretleyerek analiz zeminini hazırlayın.
                  </p>
                </button>

                <button 
                  onClick={() => setActiveStepTab(2)}
                  className={`w-full text-left p-6 rounded-2xl border transition-all duration-300 ${
                    activeStepTab === 2 
                      ? 'bg-white border-indigo-500/40 shadow-md ring-1 ring-indigo-500/10' 
                      : 'bg-white/60 border-slate-200/60 hover:bg-white hover:border-slate-300'
                  }`}
                >
                  <h3 className="font-bold text-slate-900 text-base mb-1.5 flex items-center gap-2">
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${activeStepTab === 2 ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-500'}`}>2</span>
                    Yapı Nitelik Girişi
                  </h3>
                  <p className="text-slate-500 text-xs leading-relaxed pl-8">
                    Binanın yapım yılı ve toplam kat sayısını girerek, yönetmelik çarpanlarının sismik yüke etkisini tanımlayın.
                  </p>
                </button>

                <button 
                  onClick={() => setActiveStepTab(3)}
                  className={`w-full text-left p-6 rounded-2xl border transition-all duration-300 ${
                    activeStepTab === 3 
                      ? 'bg-white border-indigo-500/40 shadow-md ring-1 ring-indigo-500/10' 
                      : 'bg-white/60 border-slate-200/60 hover:bg-white hover:border-slate-300'
                  }`}
                >
                  <h3 className="font-bold text-slate-900 text-base mb-1.5 flex items-center gap-2">
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${activeStepTab === 3 ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-500'}`}>3</span>
                    Derecelendirilmiş Risk Raporu
                  </h3>
                  <p className="text-slate-500 text-xs leading-relaxed pl-8">
                    Tüm verilerin işlenmesiyle saniyeler içinde A'dan F'ye harf notu içeren detaylı risk skor kartınızı elde edin.
                  </p>
                </button>
              </div>

              {/* Sağ Alan: Canlı Simülasyon Ekranı */}
              <div className="lg:col-span-7 flex justify-center">
                <div className="w-full max-w-[500px] bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl text-left font-mono text-xs text-slate-400 h-[280px] flex flex-col justify-between">
                  <div className="flex justify-between pb-3 border-b border-slate-800 text-[10px] text-slate-500">
                    <span>SİSTEM AŞAMA ÖNİZLEME</span>
                    <span className="text-indigo-400 font-bold">AŞAMA: {activeStepTab} / 3</span>
                  </div>

                  <div className="flex-grow flex flex-col justify-center my-4">
                    {activeStepTab === 1 && (
                      <div className="space-y-2">
                        <p className="text-white font-bold">📍 KONUM ALTYAPISI AKTİF</p>
                        <p className="text-slate-400 text-[11px]">Enlem: 40.9823° N | Boylam: 29.0234° E</p>
                        <p className="text-slate-400 text-[11px]">Zemin Parametresi (Vs30): 280 m/s (Z3 Sınıfı)</p>
                        <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden mt-3">
                          <div className="h-full bg-cyan-400 w-1/3 rounded-full" />
                        </div>
                      </div>
                    )}

                    {activeStepTab === 2 && (
                      <div className="space-y-2">
                        <p className="text-white font-bold">🏢 YAPI MATRİS PARAMETRELERİ</p>
                        <p className="text-slate-400 text-[11px]">Bina İnşa Yılı: 1996 (Kritik Yönetmelik Öncesi)</p>
                        <p className="text-slate-400 text-[11px]">Kat Adedi: 6 Kat | Yapı Türü: Betonarme</p>
                        <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden mt-3">
                          <div className="h-full bg-indigo-500 w-2/3 rounded-full" />
                        </div>
                      </div>
                    )}

                    {activeStepTab === 3 && (
                      <div className="space-y-2">
                        <p className="text-emerald-400 font-bold flex items-center gap-1.5">
                          <LuBadgeCheck className="text-sm" /> DEPREM RİSK SKOR KARTI ÜRETİLDİ
                        </p>
                        <div className="flex items-center gap-4 bg-slate-950/50 p-2.5 rounded-lg border border-slate-800 mt-2">
                          <span className="text-2xl font-black text-rose-500 bg-rose-500/10 px-3 py-1 rounded border border-rose-500/20">D</span>
                          <div>
                            <p className="text-slate-200 font-bold">Risk Sınıfı: Orta-Yüksek Risk</p>
                            <p className="text-[10px] text-slate-500">Hesaplanan Göreli Hasar İndeksi: %64</p>
                          </div>
                        </div>
                        <p className="text-[10px] text-slate-500 mt-1">Öneri: Lisanslı mühendislik firmalarınca karot ve donatı taraması yaptırınız.</p>
                      </div>
                    )}
                  </div>

                  <div className="text-[9px] text-slate-600 flex justify-between pt-2 border-t border-slate-800">
                    <span>OTURUM: AKTİF</span>
                    <span>HIZ: 12.4 ms</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* 5. Risk Formu Portalı (AddressForm) */}
        <section className="py-24 bg-white" id="risk-form">
          <div className="mx-auto max-w-[900px] px-5 md:px-8">
            <div className="text-center mb-12">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-indigo-600 mb-3">ADIM ADIM DEĞERLENDİRME</p>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">
                Binanız İçin Deprem Risk Analizini Başlatın
              </h2>
              <p className="mt-3 text-slate-500 text-base">
                Aşağıdaki formu eksiksiz doldurarak konum bazlı risk değerlendirmesini ve yapınıza özel tavsiyeleri edinin.
              </p>
            </div>

            <div className="risk-form-glow-shell p-1.5 md:p-3">
              <div className="bg-white rounded-[24px] p-5 md:p-8">
                <AddressForm />
              </div>
            </div>
          </div>
        </section>

        {/* 6. SSS (FAQ Section) */}
        <section className="py-24 bg-slate-50 border-t border-slate-100">
          <div className="mx-auto max-w-[800px] px-5 md:px-8">
            <div className="text-center mb-16">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-indigo-600 mb-3">SORULARINIZI YANITLIYORUZ</p>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">
                Sıkça Sorulan Sorular
              </h2>
            </div>

            <div className="space-y-4">
              {faqData.map((faq, index) => (
                <div 
                  key={index}
                  className="bg-white border border-slate-200/60 rounded-xl overflow-hidden shadow-sm"
                >
                  <div 
                    className="faq-header flex items-center justify-between p-5 font-bold text-slate-800 text-sm md:text-base"
                    onClick={() => toggleFaq(index)}
                  >
                    <span>{faq.q}</span>
                    <LuChevronDown className={`faq-arrow text-slate-400 text-lg ${openFaq === index ? 'rotated' : ''}`} />
                  </div>
                  
                  <AnimatePresence initial={false}>
                    {openFaq === index && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                      >
                        <div className="px-5 pb-5 pt-1 border-t border-slate-100 text-sm text-slate-500 leading-relaxed">
                          {faq.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

function App() {
  const [newsletterNotice, setNewsletterNotice] = useState("");

  const handleSubscribe = (e) => {
    e.preventDefault();
    setNewsletterNotice("Bülten kaydı yakında aktif olacaktır.");
    setTimeout(() => setNewsletterNotice(""), 5000);
  };

  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
    });
  }, []);

  return (
    <Router>
      <div className="App bg-slate-50 min-h-screen flex flex-col justify-between">
        <Navbar />
        
        <div className="flex-grow w-full">
          <PageTransition>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/nasil-calisir" element={<HowItWorks />} />
              <Route path="/hakkimizda" element={<About />} />
              <Route path="/iletisim" element={<Contact />} />
              <Route path="/admin/mesajlar" element={<AdminMessages />} />
            </Routes>
          </PageTransition>
        </div>

        {/* 7. Tamamen Yenilenmiş Premium Koyu Tema Footer */}
        <footer className="relative w-full bg-gradient-to-b from-slate-950 via-slate-950 to-black text-slate-400 pt-24 pb-12 border-t border-slate-900/80 overflow-hidden">
          {/* Arka Plan Glow Efektleri */}
          <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-indigo-600/5 rounded-full blur-[120px] pointer-events-none" />
          <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-cyan-500/5 rounded-full blur-[100px] pointer-events-none" />
          
          <div className="relative mx-auto max-w-ecHero px-5 md:px-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-12 mb-20">
            
            {/* Sütun 1: Marka Tanımı ve Sosyal İkonlar (Span 4) */}
            <div className="lg:col-span-4 flex flex-col justify-between">
              <div>
                <Link to="/" className="flex items-center gap-3 text-white font-bold text-lg mb-6 group w-fit" aria-label="EarthquakeCheck ana sayfa">
                  <img src="/logo.svg" alt="EarthquakeCheck logo" className="w-10 h-10 transition-all duration-300 group-hover:scale-105" />
                  <span className="brand-text-footer">
                    Earthquake<span className="brand-text-accent-footer">Check</span>
                  </span>
                </Link>
                <p className="text-sm leading-relaxed mb-8 max-w-[34ch] text-slate-400/90 font-light">
                  Deprem risk farkındalığını artırmak için zemin ivme verilerini ve bina parametrelerini analiz eden, yapay zeka destekli, bağımsız ve ücretsiz bir sosyal girişim platformu.
                </p>
              </div>
              
              {/* İnce Çember Sınırlı Sosyal Medya Butonları */}
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-slate-600 mb-4 font-mono">Sosyal Medya & İletişim</p>
                <div className="flex items-center gap-3">
                  <a 
                    href="https://www.linkedin.com/in/mehmet-eren-%C3%B6zden" 
                    className="footer-social-btn" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    aria-label="LinkedIn"
                  >
                    <LuLinkedin className="text-sm" />
                  </a>
                  <a 
                    href="https://github.com/erenzdn" 
                    className="footer-social-btn" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    aria-label="GitHub"
                  >
                    <LuGithub className="text-sm" />
                  </a>
                  <a 
                    href="mailto:mehmeteren850@gmail.com" 
                    className="footer-social-btn" 
                    aria-label="E-posta"
                  >
                    <LuMail className="text-sm" />
                  </a>
                  <a 
                    href="https://mehmeterenozden.com" 
                    className="footer-social-btn" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    aria-label="Web Sitesi"
                  >
                    <LuGlobe className="text-sm" />
                  </a>
                </div>
              </div>
            </div>

            {/* Sütun 2: Keşfet (Span 2) */}
            <div className="lg:col-span-2 lg:pl-2">
              <h4 className="text-white font-bold text-xs uppercase tracking-widest mb-6 font-semibold text-slate-200">Keşfet</h4>
              <ul className="space-y-4 text-sm font-medium">
                <li><Link to="/" className="footer-link-hover text-slate-400 flex items-center gap-2">Ana Sayfa</Link></li>
                <li><Link to="/nasil-calisir" className="footer-link-hover text-slate-400 flex items-center gap-2">Nasıl Çalışır</Link></li>
                <li><Link to="/hakkimizda" className="footer-link-hover text-slate-400 flex items-center gap-2">Hakkımızda</Link></li>
                <li><Link to="/iletisim" className="footer-link-hover text-slate-400 flex items-center gap-2">İletişim</Link></li>
              </ul>
            </div>

            {/* Sütun 3: Ön Analiz Portalı (Span 3) */}
            <div className="lg:col-span-3 lg:pl-2">
              <h4 className="text-white font-bold text-xs uppercase tracking-widest mb-6 font-semibold text-slate-200">Analiz Portalı</h4>
              <ul className="space-y-4 text-sm font-medium">
                <li><a href="/#risk-form" className="footer-link-hover text-slate-400">Hızlı Deprem Analizi</a></li>
                <li><a href="/#risk-form" className="footer-link-hover text-slate-400">Zemin İvme Ölçümü</a></li>
                <li><a href="/#risk-form" className="footer-link-hover text-slate-400">Bina Güvenlik Katsayısı</a></li>
                <li className="pt-2">
                  <span className="flex items-center gap-2 text-xs text-slate-500">
                    Sistem Durumu: 
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse mr-1" />
                      Aktif
                    </span>
                  </span>
                </li>
              </ul>
            </div>

            {/* Sütun 4: Afet Kaynakları (Span 3) */}
            <div className="lg:col-span-3">
              <h4 className="text-white font-bold text-xs uppercase tracking-widest mb-6 font-semibold text-slate-200">Afet Kaynakları</h4>
              <ul className="space-y-4 text-sm font-medium">
                <li>
                  <a href="https://deprem.afad.gov.tr" target="_blank" rel="noopener noreferrer" className="footer-link-hover text-slate-400 flex items-center justify-between group">
                    <span className="flex items-center gap-2"><LuFileText className="text-xs text-indigo-400" /> AFAD Deprem Portalı</span>
                    <span className="text-[10px] text-slate-600 group-hover:text-indigo-400 transition-colors">↗</span>
                  </a>
                </li>
                <li>
                  <a href="https://www.afad.gov.tr/afet-cantasi-nasil-hazirlanir" target="_blank" rel="noopener noreferrer" className="footer-link-hover text-slate-400 flex items-center justify-between group">
                    <span className="flex items-center gap-2"><LuFileText className="text-xs text-indigo-400" /> Deprem Çantası Rehberi</span>
                    <span className="text-[10px] text-slate-600 group-hover:text-indigo-400 transition-colors">↗</span>
                  </a>
                </li>
                <li>
                  <a href="http://www.koeri.boun.edu.tr/sismo" target="_blank" rel="noopener noreferrer" className="footer-link-hover text-slate-400 flex items-center justify-between group">
                    <span className="flex items-center gap-2"><LuFileText className="text-xs text-indigo-400" /> Kandilli Rasathanesi</span>
                    <span className="text-[10px] text-slate-600 group-hover:text-indigo-400 transition-colors">↗</span>
                  </a>
                </li>
                <li>
                  <a href="https://www.e-devlet.gov.tr" target="_blank" rel="noopener noreferrer" className="footer-link-hover text-slate-400 flex items-center justify-between group">
                    <span className="flex items-center gap-2"><LuFileText className="text-xs text-indigo-400" /> Hasar Tespit Kaydı</span>
                    <span className="text-[10px] text-slate-600 group-hover:text-indigo-400 transition-colors">↗</span>
                  </a>
                </li>
              </ul>
            </div>

          </div>

          {/* Bülten Aboneliği Banner (Geniş & Premium Alt Alan) */}
          <div className="mx-auto max-w-ecHero px-5 md:px-8 mb-16">
            <div className="relative p-6 md:p-8 rounded-2xl bg-gradient-to-r from-slate-900 to-indigo-950/40 border border-slate-800/80 overflow-hidden flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="absolute inset-0 bg-grid-white-02 pointer-events-none" />
              <div className="z-10 max-w-[50ch] text-center md:text-left">
                <h4 className="text-white font-bold text-base mb-2 flex items-center justify-center md:justify-start gap-2">
                  <LuSparkles className="text-indigo-400" /> Bilgilendirme Bültenine Katılın
                </h4>
                <p className="text-xs leading-relaxed text-slate-400 font-light">
                  Afet bilinci, yapı güçlendirme, deprem hazırlığı ve platform güncellemeleri ile ilgili akademik ve pratik rehberlerimizi doğrudan e-postanıza gönderelim.
                </p>
              </div>
              
              <div className="z-10 w-full md:w-auto shrink-0">
                {newsletterNotice ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-amber-500/10 border border-amber-500/20 text-amber-300 px-6 py-3 rounded-xl text-xs font-semibold"
                  >
                    {newsletterNotice}
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2 w-full max-w-md">
                    <div className="relative flex-grow">
                      <LuMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-sm" />
                      <input
                        type="email"
                        required
                        placeholder="E-posta adresiniz"
                        className="bg-slate-950/80 border border-slate-800 focus:border-indigo-500 rounded-xl pl-10 pr-4 py-3 text-xs text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 w-full font-sans transition-all"
                      />
                    </div>
                    <button type="submit" className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl px-6 py-3 text-xs font-bold transition-all shrink-0 shadow-lg shadow-indigo-600/15 hover:shadow-indigo-600/25 flex items-center justify-center gap-2 group">
                      Kayıt Ol <LuArrowRight className="text-xs transition-transform group-hover:translate-x-1" />
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>

          {/* Alt Sınır / Telif Hakları ve Politikalar */}
          <div className="mx-auto max-w-ecHero px-5 md:px-8 pt-8 border-t border-slate-900/80 flex flex-col sm:flex-row justify-between items-center gap-6 text-xs text-slate-500 font-light">
            <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3 text-center sm:text-left">
              <span className="font-semibold text-slate-400 flex items-center gap-1.5">
                EarthquakeCheck
              </span>
              <span className="hidden sm:inline text-slate-800">|</span>
              <p>© 2026. Tüm hakları saklıdır. Bağımsız ve açık kaynaklı sosyal girişim.</p>
            </div>
            <div className="flex gap-6">
              <a href="#" className="footer-link-hover text-slate-500 hover:text-slate-300">Gizlilik Sözleşmesi</a>
              <a href="#" className="footer-link-hover text-slate-500 hover:text-slate-300">Kullanım Koşulları</a>
              <a href="#" className="footer-link-hover text-slate-500 hover:text-slate-300">Çerez Politikası</a>
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;

