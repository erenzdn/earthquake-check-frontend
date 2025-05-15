import React, { useState, useEffect } from "react";
import Map from "./Map";
import { motion } from "framer-motion";
import { fetchLocationFromAddress, fetchEvaluation } from "../Api";

function AddressForm() {
  const [address, setAddress] = useState("");
  const [buildingAge, setBuildingAge] = useState("");
  const [floorCount, setFloorCount] = useState("");
  const [addressMode, setAddressMode] = useState("manual"); 
  const [mapCoordinates, setMapCoordinates] = useState(null);
  const [formStep, setFormStep] = useState(1); 
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [evaluationResult, setEvaluationResult] = useState(null);
  
  useEffect(() => {
    if (mapCoordinates) {
      setAddress(`${mapCoordinates.lat.toFixed(6)}, ${mapCoordinates.lng.toFixed(6)}`);
    }
  }, [mapCoordinates]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!mapCoordinates) {
      setError("Konum bilgisi bulunamadı. Lütfen önce adres girişi yapın.");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      
      console.log("Gönderilecek veriler:", {
        latitude: mapCoordinates.lat.toFixed(3),
        longitude: mapCoordinates.lng.toFixed(3),
        buildingAge,
        floorCount
      });
      
      // API'den deprem risk değerlendirmesi al
      const result = await fetchEvaluation(
        mapCoordinates.lat,
        mapCoordinates.lng,
        buildingAge,
        floorCount
      );
      
      console.log("API sonucu:", result);
      
      if (result) {
        setEvaluationResult(result);
        setFormStep(3); // Sonuç sayfasına git
      } else {
        setError("Değerlendirme sonucu alınamadı. Lütfen tekrar deneyiniz.");
      }
    } catch (err) {
      console.error("Değerlendirme hatası:", err);
      setError("Değerlendirme yapılırken bir hata oluştu. Lütfen tekrar deneyin.");
    } finally {
      setIsLoading(false);
    }
  };

  const switchToStep2 = async (e) => {
    e.preventDefault();
    if (address) {
      // Manuel adres modunda ve adres girilmişse API'den konum bilgisini al
      if (addressMode === "manual") {
        try {
          setIsLoading(true);
          setError(null);
          
          const locationData = await fetchLocationFromAddress(address);
          
          if (locationData && locationData.latitude && locationData.longitude) {
            setMapCoordinates({
              lat: locationData.latitude,
              lng: locationData.longitude
            });
            console.log("API'den alınan konum:", locationData);
          } else {
            // API'den geçerli bir yanıt alınamadıysa hata göster
            setError("Girilen adres için konum bilgisi bulunamadı.");
          }
        } catch (err) {
          console.error("Adres sorgulama hatası:", err);
          setError("Adres sorgulanırken bir hata oluştu. Lütfen tekrar deneyin.");
        } finally {
          setIsLoading(false);
        }
      }
      
      // Sonraki adıma geç
      setFormStep(2);
    }
  };

  // Form içeriğindeki animasyon varyantları
  const formVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: "spring",
        stiffness: 260,
        damping: 20
      }
    },
    exit: { 
      opacity: 0, 
      y: -20,
      transition: { duration: 0.3 }
    }
  };

  // Input animasyon varyantları
  const inputVariants = {
    focus: { scale: 1.02, boxShadow: "0 0 0 3px rgba(99, 102, 241, 0.15)" },
    blur: { scale: 1, boxShadow: "none" }
  };

  // Derecelendirmeye göre renkleri belirle
  const getGradeColor = (grade) => {
    const gradeColors = {
      'A': '#10B981', // Yeşil
      'B': '#22D3EE', // Turkuaz
      'C': '#FCD34D', // Sarı
      'D': '#F97316', // Turuncu
      'E': '#F87171', // Kırmızı
      'F': '#EF4444'  // Koyu Kırmızı
    };
    
    return gradeColors[grade] || '#FCD34D'; // Varsayılan olarak sarı
  };
  
  // Derecelendirmeye göre metni belirle
  const getGradeText = (grade) => {
    const gradeTexts = {
      'A': 'Çok Yüksek Güvenlik',
      'B': 'Yüksek Güvenlik',
      'C': 'İyi Güvenlik',
      'D': 'Orta Güvenlik',
      'E': 'Düşük Güvenlik',
      'F': 'Çok Düşük Güvenlik'
    };
    
    return gradeTexts[grade] || 'Belirsiz Güvenlik';
  };

  // Derecelendirmeye göre puan aralığını belirle
  const getGradeRange = (grade) => {
    const gradeRanges = {
      'A': '90-100',
      'B': '80-89',
      'C': '70-79',
      'D': '50-69',
      'E': '30-49',
      'F': '0-29'
    };
    
    return gradeRanges[grade] || '';
  };

  // Tavsiye metnini belirle
  const getRecommendationText = (grade) => {
    const recommendations = {
      'A': 'Binanız çok yüksek güvenlik seviyesine sahip. Rutin kontroller dışında özel bir işleme gerek yoktur.',
      'B': 'Binanız yüksek güvenlik seviyesine sahip. Düzenli bakımlarla bu seviyeyi koruyabilirsiniz.',
      'C': 'Binanız iyi güvenlik seviyesinde. Bazı küçük iyileştirmeler yapılması tavsiye edilir.',
      'D': 'Binanız orta güvenlik seviyesinde. Bir mühendis tarafından değerlendirilmesi önerilir.',
      'E': 'Binanız düşük güvenlik seviyesinde. En kısa sürede bir yapı mühendisi ile iletişime geçmeniz tavsiye edilir.',
      'F': 'Binanız çok düşük güvenlik seviyesinde. Acil olarak bir yapı mühendisi ile görüşmelisiniz.'
    };
    
    return recommendations[grade] || 'Binanızın güvenlik durumu belirsiz. Bir yapı mühendisi ile iletişime geçmeniz tavsiye edilir.';
  };


  return (
    <div className="form-container">
      <h2 className="form-title">Deprem Risk Analizi</h2>
      
      {/* Adım Göstergesi */}
      <div className="form-progress">
        <div className={`progress-step ${formStep >= 1 ? 'active' : ''}`}>
          <div className="step-indicator">1</div>
          <span className="step-label">Adres</span>
        </div>
        <div className="progress-line"></div>
        <div className={`progress-step ${formStep >= 2 ? 'active' : ''}`}>
          <div className="step-indicator">2</div>
          <span className="step-label">Bina Bilgileri</span>
        </div>
        <div className="progress-line"></div>
        <div className={`progress-step ${formStep >= 3 ? 'active' : ''}`}>
          <div className="step-indicator">3</div>
          <span className="step-label">Sonuç</span>
        </div>
      </div>
      
      {/* Adım 1: Adres Girişi */}
      {formStep === 1 && (
        <motion.div
          key="step1"
          variants={formVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          {/* Adres giriş modu seçici */}
          <div className="address-mode-toggle">
            <button 
              type="button" 
              className={`mode-option ${addressMode === "manual" ? "active" : ""}`}
              onClick={() => setAddressMode("manual")}
            >
              <span>Adres Yaz</span>
            </button>
            <button 
              type="button" 
              className={`mode-option ${addressMode === "map" ? "active" : ""}`}
              onClick={() => setAddressMode("map")}
            >
              <span>Haritadan Seç</span>
            </button>
          </div>
          
          <form onSubmit={switchToStep2}>
            {/* Manuel adres girişi */}
            {addressMode === "manual" && (
              <div className="form-group">
                <label htmlFor="address" className="form-label">Adres Bilgisi</label>
                <motion.input
                  id="address"
                  className="form-input"
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Tam adresinizi giriniz"
                  required
                  variants={inputVariants}
                  whileFocus="focus"
                  initial="blur"
                />
                {error && <div className="form-error">{error}</div>}
              </div>
            )}
            
            {/* Harita seçim modu */}
            {addressMode === "map" && (
              <>
                <div className="map-container">
                  <Map 
                    selectedPosition={mapCoordinates} 
                    setSelectedPosition={setMapCoordinates} 
                  />
                </div>
                
                {mapCoordinates && (
                  <div className="selected-location">
                    <strong>Seçilen Konum:</strong> {address}
                  </div>
                )}
              </>
            )}

            <motion.button 
              className={`submit-button ${isLoading ? 'loading' : ''}`}
              type="submit"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="loading-spinner"></span>
              ) : (
                "Devam Et"
              )}
            </motion.button>
          </form>
        </motion.div>
      )}
      
      {/* Adım 2: Bina Bilgileri */}
      {formStep === 2 && (
        <motion.div
          key="step2"
          variants={formVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          {mapCoordinates && (
            <div className="coord-info">
              <div className="selected-location">
                <strong>Kullanılan Konum:</strong> {mapCoordinates.lat.toFixed(6)}, {mapCoordinates.lng.toFixed(6)}
              </div>
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="buildingAge" className="form-label">Yapım Yılı</label>
              <motion.input
                id="buildingAge"
                className="form-input"
                type="number"
                value={buildingAge}
                onChange={(e) => setBuildingAge(e.target.value)}
                placeholder="Binanın yapıldığı yılı giriniz"
                min="1800"
                max={new Date().getFullYear()}
                required
                variants={inputVariants}
                whileFocus="focus"
                initial="blur"
              />
            </div>

            <div className="form-group">
              <label htmlFor="floorCount" className="form-label">Kat Sayısı</label>
              <motion.input
                id="floorCount"
                className="form-input"
                type="number"
                value={floorCount}
                onChange={(e) => setFloorCount(e.target.value)}
                placeholder="Binanın toplam kat sayısını giriniz"
                min="1"
                max="100"
                required
                variants={inputVariants}
                whileFocus="focus"
                initial="blur"
              />
            </div>
            
            {error && <div className="form-error">{error}</div>}

            <div className="form-actions">
              <motion.button 
                className="back-button"
                type="button"
                onClick={() => setFormStep(1)}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
              >
                Geri
              </motion.button>
              
              <motion.button 
                className={`submit-button ${isLoading ? 'loading' : ''}`}
                type="submit"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="loading-spinner"></span>
                ) : (
                  "Risk Analizi Yap"
                )}
              </motion.button>
            </div>
          </form>
        </motion.div>
      )}
      
      {/* Adım 3: Sonuç */}
      {formStep === 3 && evaluationResult && (
        <motion.div
          key="step3"
          className="result-container"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
        >
          <h3 className="result-title">Deprem Risk Analizi Sonucu</h3>
          
          {/* Güvenlik Derecesi Göstergesi */}
          <div className="safety-grade-badge" style={{ backgroundColor: getGradeColor(evaluationResult.safetyGrade) }}>
            {evaluationResult.safetyGrade}
          </div>
          
          {/* Risk Metresi */}
          <div className="safety-meter-container">
            <div className="safety-meter">
              <div className="safety-meter-scale">
                <div className="safety-level" style={{backgroundColor: '#10B981'}}>A</div>
                <div className="safety-level" style={{backgroundColor: '#22D3EE'}}>B</div>
                <div className="safety-level" style={{backgroundColor: '#FCD34D'}}>C</div>
                <div className="safety-level" style={{backgroundColor: '#F97316'}}>D</div>
                <div className="safety-level" style={{backgroundColor: '#F87171'}}>E</div>
                <div className="safety-level" style={{backgroundColor: '#EF4444'}}>F</div>
              </div>
              
              {/* Gösterge İşareti - Üçgen */}
              <div 
                className="safety-meter-indicator"
                style={{
                  left: `${getIndicatorPosition(evaluationResult.safetyGrade)}%`,
                  borderBottomColor: getGradeColor(evaluationResult.safetyGrade)
                }}
              ></div>
            </div>
            <div className="safety-percentage">{evaluationResult.safetyGradePercentage}%</div>
          </div>
          
          {/* Bina Bilgileri Özet Kartları */}
          <div className="result-summary">
            <div className="summary-card">
              <div className="summary-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20.42 4.58a5.4 5.4 0 0 0-7.65 0l-.77.78-.77-.78a5.4 5.4 0 0 0-7.65 0C1.46 6.7 1.33 10.28 4 13l8 8 8-8c2.67-2.72 2.54-6.3.42-8.42z"></path>
                </svg>
              </div>
              <div className="summary-detail">
                <span className="summary-label">RİSK DERECESİ</span>
                <span className="summary-value" style={{color: getGradeColor(evaluationResult.safetyGrade)}}>
                  {getGradeText(evaluationResult.safetyGrade)}
                </span>
              </div>
            </div>
            
            <div className="summary-card">
              <div className="summary-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 9v11a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V9"/>
                  <path d="M9 22V12h6v10M2 10.6L12 2l10 8.6"/>
                </svg>
              </div>
              <div className="summary-detail">
                <span className="summary-label">YAPIM YILI</span>
                <span className="summary-value">{buildingAge} ({new Date().getFullYear() - buildingAge} yaşında)</span>
              </div>
            </div>
            
            <div className="summary-card">
              <div className="summary-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                  <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
                </svg>
              </div>
              <div className="summary-detail">
                <span className="summary-label">KAT SAYISI</span>
                <span className="summary-value">{floorCount} Kat</span>
              </div>
            </div>
          </div>
          
          {/* Değerlendirme ve Öneriler */}
          <div className="recommendation-container">
            <h4 className="recommendation-title">Değerlendirme ve Öneriler</h4>
            <p className="recommendation-text">
              {evaluationResult.evaluationNotes || getRecommendationText(evaluationResult.safetyGrade)}
            </p>
          </div>
          
          {/* En Yakın Toplanma Alanı */}
          {evaluationResult.nearestAssemblyArea && (
            <div className="assembly-area">
              <div className="area-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s-8-4.5-8-11.8A8 8 0 0 1 12 2a8 8 0 0 1 8 8.2c0 7.3-8 11.8-8 11.8z"/>
                  <circle cx="12" cy="10" r="3"/>
                </svg>
              </div>
              <div className="area-details">
                <h4>En Yakın Toplanma Alanı</h4>
                <p>{evaluationResult.nearestAssemblyArea}</p>
              </div>
            </div>
          )}
          
          {/* Butonlar */}
          <div className="result-actions">
            <motion.button 
              className="secondary-button"
              type="button"
              onClick={() => window.print()}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="6 9 6 2 18 2 18 9"></polyline>
                <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
                <rect x="6" y="14" width="12" height="8"></rect>
              </svg>
              Raporu Yazdır
            </motion.button>
            
            <motion.button 
              className="submit-button"
              type="button"
              onClick={() => setFormStep(1)}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
            >
              Yeni Analiz Yap
            </motion.button>
          </div>
        </motion.div>
      )}
    </div>
  );
}

// Güvenlik derecesine göre gösterge işaretinin konumunu belirleyen yardımcı fonksiyon
function getIndicatorPosition(grade) {
  const positions = {
    'A': 8.33,   // 1/6 * 50%
    'B': 25,     // 3/6 * 50%
    'C': 41.66,  // 5/6 * 50%
    'D': 58.33,  // 7/6 * 50%
    'E': 75,     // 9/6 * 50%
    'F': 91.66   // 11/6 * 50%
  };
  
  return positions[grade] || 50;
}

export default AddressForm;
