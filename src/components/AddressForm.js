import React, { useState, useEffect } from "react";
import Map from "./Map";
import { motion } from "framer-motion";
import { fetchEvaluation } from "../Api";
import { LuShieldAlert, LuHouse, LuBuilding2, LuMapPinHouse, LuPrinter, LuBadgeCheck, LuCircleGauge, LuActivity, LuSearch, LuLayers, LuCpu, LuFileText } from "react-icons/lu";
import { getGeneralErrorMessage, toUserFriendlyFieldErrors } from "../utils/errorMapping";

function AddressForm() {
  const [address, setAddress] = useState("");
  const [yearBuilt, setYearBuilt] = useState("");
  const [floorCount, setFloorCount] = useState("");
  const [addressMode, setAddressMode] = useState("manual");
  const [mapCoordinates, setMapCoordinates] = useState(null);
  const [formStep, setFormStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [generalError, setGeneralError] = useState("");
  const [apiFeedback, setApiFeedback] = useState(null);
  const [evaluationResult, setEvaluationResult] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStep, setAnalysisStep] = useState(0);
  const [isTremorActive, setIsTremorActive] = useState(false);
  const [displayPercentage, setDisplayPercentage] = useState(0);

  useEffect(() => {
    if (formStep === 3 && evaluationResult) {
      setDisplayPercentage(0);
      let start = 0;
      const end = evaluationResult.safetyGradePercentage || 0;
      if (end === 0) return;
      
      const duration = 1500; // ms
      const stepTime = Math.max(Math.floor(duration / end), 15);
      
      const timer = setInterval(() => {
        start += 1;
        if (start >= end) {
          setDisplayPercentage(end);
          clearInterval(timer);
        } else {
          setDisplayPercentage(start);
        }
      }, stepTime);
      
      return () => clearInterval(timer);
    }
  }, [formStep, evaluationResult]);

  const MIN_YEAR_BUILT = 1800;
  const MAX_YEAR_BUILT = new Date().getFullYear();
  const MIN_FLOOR_COUNT = 0;
  const MAX_FLOOR_COUNT = 100;

  const sanitizeNumericInput = (value) => (value || "").replace(/[<>'";-]/g, "").replace(/\D/g, "");

  const allowOnlyDigitKeys = (event) => {
    const allowedKeys = ["Backspace", "Delete", "ArrowLeft", "ArrowRight", "Tab", "Home", "End"];
    if (allowedKeys.includes(event.key)) {
      return;
    }

    if (!/^\d$/.test(event.key)) {
      event.preventDefault();
    }
  };

  const handleYearBuiltChange = (event) => {
    const cleaned = sanitizeNumericInput(event.target.value).slice(0, 4);
    setYearBuilt(cleaned);
  };

  const handleFloorCountChange = (event) => {
    let cleaned = sanitizeNumericInput(event.target.value).slice(0, 3);
    const numeric = Number(cleaned);
    if (!Number.isNaN(numeric) && numeric > MAX_FLOOR_COUNT) {
      cleaned = String(MAX_FLOOR_COUNT);
    }
    setFloorCount(cleaned);
  };

  const handleNumericPaste = (event, field) => {
    event.preventDefault();
    const pasted = event.clipboardData.getData("text");

    if (field === "yearBuilt") {
      setYearBuilt(sanitizeNumericInput(pasted).slice(0, 4));
      return;
    }

    let cleaned = sanitizeNumericInput(pasted).slice(0, 3);
    const numeric = Number(cleaned);
    if (!Number.isNaN(numeric) && numeric > MAX_FLOOR_COUNT) {
      cleaned = String(MAX_FLOOR_COUNT);
    }
    setFloorCount(cleaned);
  };
  
  const normalizeOptionalText = (value) => {
    const trimmed = (value || "").trim();
    return trimmed === "" ? null : trimmed;
  };

  const normalizeOptionalNumber = (value) => {
    if (value === undefined || value === null || value === "") {
      return null;
    }

    const numericValue = Number(value);
    return Number.isFinite(numericValue) ? numericValue : null;
  };

  const toRequiredInt = (value) => {
    if (value === "" || value === null || value === undefined) {
      return null;
    }

    const numericValue = Number(value);
    return Number.isFinite(numericValue) ? Math.trunc(numericValue) : null;
  };

  const isInRange = (value, min, max) => Number.isInteger(value) && value >= min && value <= max;

  const validateStep2 = () => {
    const nextErrors = {};

    const numericYearBuilt = toRequiredInt(yearBuilt);
    const numericFloorCount = toRequiredInt(floorCount);
    const latitudeValue = normalizeOptionalNumber(mapCoordinates?.lat);
    const longitudeValue = normalizeOptionalNumber(mapCoordinates?.lng);

    if (numericYearBuilt === null) {
      nextErrors.yearBuilt = "Yapım yılı zorunludur.";
    } else if (!Number.isInteger(numericYearBuilt)) {
      nextErrors.yearBuilt = "Yapım yılı geçerli bir sayı olmalıdır.";
    } else if (!isInRange(numericYearBuilt, MIN_YEAR_BUILT, MAX_YEAR_BUILT)) {
      nextErrors.yearBuilt = `Yapım yılı ${MIN_YEAR_BUILT}-${MAX_YEAR_BUILT} aralığında olmalıdır.`;
    }

    if (numericFloorCount === null) {
      nextErrors.floorCount = "Kat sayısı zorunludur.";
    } else if (!isInRange(numericFloorCount, MIN_FLOOR_COUNT, MAX_FLOOR_COUNT)) {
      nextErrors.floorCount = `Kat sayısı ${MIN_FLOOR_COUNT}-${MAX_FLOOR_COUNT} aralığında olmalıdır.`;
    }
    if (latitudeValue !== null && (latitudeValue < -90 || latitudeValue > 90)) {
      nextErrors.latitude = "Enlem -90 ile 90 arasında olmalıdır.";
    }
    if (longitudeValue !== null && (longitudeValue < -180 || longitudeValue > 180)) {
      nextErrors.longitude = "Boylam -180 ile 180 arasında olmalıdır.";
    }

    setFieldErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateStep2()) {
      return;
    }

    // Reset results and errors
    setGeneralError("");
    setApiFeedback(null);
    setEvaluationResult(null);
    setFieldErrors({});
    setIsLoading(true);

    const normalizedPayload = {
      yearBuilt: toRequiredInt(yearBuilt),
      floorCount: toRequiredInt(floorCount),
      address: normalizeOptionalText(address),
      buildingType: null,
      latitude: normalizeOptionalNumber(mapCoordinates?.lat),
      longitude: normalizeOptionalNumber(mapCoordinates?.lng)
    };
    console.debug("[AddressForm] normalized submit payload:", normalizedPayload);

    // 1. Start the API call in the background
    let apiPromise = fetchEvaluation(normalizedPayload);
    let apiSuccess = false;
    let apiResult = null;
    let apiError = null;

    apiPromise
      .then((res) => {
        apiSuccess = true;
        apiResult = res;
      })
      .catch((err) => {
        apiSuccess = false;
        apiError = err;
      });

    // 2. Start the simulation animation
    setIsAnalyzing(true);
    setAnalysisStep(1);

    // Helper to sleep (0ms in tests to avoid test timeouts and keep them fast)
    const isTest = process.env.NODE_ENV === "test";
    const stepDelay = isTest ? 0 : 800;
    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    try {
      // Step 1: 0 to 800ms
      await delay(stepDelay);
      setAnalysisStep(2);

      // Step 2: 800 to 1600ms
      await delay(stepDelay);
      setAnalysisStep(3);

      // Step 3: 1600 to 2400ms
      await delay(stepDelay);
      setAnalysisStep(4);
      setIsTremorActive(true); // Trigger tactile shake!

      // Step 4: 2400 to 3200ms
      await delay(stepDelay);
      setIsTremorActive(false); // Turn off shake
      setAnalysisStep(5);

      // Step 5: 3200 to 4000ms
      await delay(stepDelay);

      // 3. Coordinate transition to results
      // If API is still loading, wait for it
      if (!apiSuccess && !apiError) {
        await apiPromise.then((res) => {
          apiSuccess = true;
          apiResult = res;
        }).catch((err) => {
          apiSuccess = false;
          apiError = err;
        });
      }

      // If API failed, throw the error so we handle it in catch block
      if (apiError) {
        throw apiError;
      }

      // If API succeeded, transition to Step 3 (Results)
      if (apiResult) {
        setEvaluationResult(apiResult);
        setApiFeedback({ type: "success", message: "Değerlendirme başarıyla tamamlandı." });
        setIsAnalyzing(false);
        setFormStep(3);
      }
    } catch (err) {
      console.error("[AddressForm] submit error:", err);
      console.error("[AddressForm] error response body:", err?.responseBody);
      console.error("[AddressForm] error details:", err?.details);
      setFieldErrors(toUserFriendlyFieldErrors(err?.details || {}));
      setGeneralError(getGeneralErrorMessage(err));
      setIsAnalyzing(false); // Go back to form if error occurs
    } finally {
      setIsLoading(false);
    }
  };

  const switchToStep2 = (e) => {
    e.preventDefault();
    setGeneralError("");
    setApiFeedback(null);
    setFieldErrors({});
    setFormStep(2);
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
        <div className={`progress-step ${formStep >= 3 || isAnalyzing ? 'active' : ''}`}>
          <div className="step-indicator flex items-center justify-center">
            {isAnalyzing ? <span className="sim-spinner" style={{ borderWidth: '1.5px' }}></span> : "3"}
          </div>
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
            <div className="form-note">
              Adres girerseniz sistem koordinatları otomatik bulmaya çalışır. En doğru sonuç için haritadan konum seçebilirsiniz.
            </div>

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
                  variants={inputVariants}
                  whileFocus="focus"
                  initial="blur"
                />
                <p className="form-hint">
                  Adres doğruluğu düşük olabilir, haritadan konum doğrulamanız önerilir.
                </p>
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
                    <strong>Seçilen Konum:</strong> {mapCoordinates.lat.toFixed(6)}, {mapCoordinates.lng.toFixed(6)}
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
      {formStep === 2 && !isAnalyzing && (
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
              {address.trim() && (
                <div className="form-hint">
                  Hem adres hem pin bulunduğu için değerlendirmede harita koordinatı kullanılacaktır.
                </div>
              )}
            </div>
          )}

          {apiFeedback && (
            <div className={`form-alert ${apiFeedback.type === "success" ? "success" : "error"}`}>
              {apiFeedback.message}
            </div>
          )}
          {generalError && (
            <div className="form-alert error">
              {generalError}
            </div>
          )}
          {fieldErrors.location && (
            <div className="form-alert error">
              {fieldErrors.location}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="yearBuilt" className="form-label">Yapım Yılı</label>
              <motion.input
                id="yearBuilt"
                className="form-input"
                type="text"
                value={yearBuilt}
                onChange={handleYearBuiltChange}
                onKeyDown={allowOnlyDigitKeys}
                onPaste={(e) => handleNumericPaste(e, "yearBuilt")}
                placeholder="Binanın yapım yılını giriniz"
                inputMode="numeric"
                maxLength={4}
                required
                variants={inputVariants}
                whileFocus="focus"
                initial="blur"
              />
              {fieldErrors.yearBuilt && <div className="form-error">{fieldErrors.yearBuilt}</div>}
            </div>

            <div className="form-group">
              <label htmlFor="floorCount" className="form-label">Kat Sayısı</label>
              <motion.input
                id="floorCount"
                className="form-input"
                type="text"
                value={floorCount}
                onChange={handleFloorCountChange}
                onKeyDown={allowOnlyDigitKeys}
                onPaste={(e) => handleNumericPaste(e, "floorCount")}
                placeholder="Binanın toplam kat sayısını giriniz"
                inputMode="numeric"
                maxLength={3}
                required
                variants={inputVariants}
                whileFocus="focus"
                initial="blur"
              />
              {fieldErrors.floorCount && <div className="form-error">{fieldErrors.floorCount}</div>}
            </div>
            {fieldErrors.latitude && <div className="form-error">{fieldErrors.latitude}</div>}
            {fieldErrors.longitude && <div className="form-error">{fieldErrors.longitude}</div>}

            <div className="form-actions">
              <motion.button 
                className="back-button"
                type="button"
                onClick={() => {
                  setGeneralError("");
                  setApiFeedback(null);
                  setFormStep(1);
                }}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                disabled={isLoading}
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
      
      {/* Adım 2.5: Simülasyon Ekranı (Yeni) */}
      {isAnalyzing && (
        <motion.div
          key="analyzing"
          className={`simulation-container ${isTremorActive ? "seismic-tremor-active" : ""}`}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.4 }}
        >
          <h3 className="simulation-title">Bina Deprem Risk Analizi Yapılıyor...</h3>

          {/* Sismograf & Radar Görsel Efekti */}
          <div className="simulation-visual-box">
            {/* Radar Dairesi ve Tarayıcı Çizgi */}
            <svg className="simulation-visual-radar" viewBox="0 0 200 200">
              <circle cx="100" cy="100" r="90" stroke="rgba(27, 97, 201, 0.15)" strokeWidth="1.5" fill="none" />
              <circle cx="100" cy="100" r="60" stroke="rgba(27, 97, 201, 0.1)" strokeWidth="1.5" fill="none" />
              <circle cx="100" cy="100" r="30" stroke="rgba(27, 97, 201, 0.05)" strokeWidth="1.5" fill="none" />
              <line x1="100" y1="100" x2="100" y2="10" stroke="rgba(27, 97, 201, 0.4)" strokeWidth="2" strokeLinecap="round" className="radar-sweep-line" />
              <circle cx="100" cy="100" r="4" fill="#1b61c9" />
            </svg>

            {/* Sismik SVG Sismograf Dalga Çizgisi */}
            <svg className="simulation-visual-seismograph" viewBox="0 0 140 60">
              <path
                d={getSeismicPath(analysisStep)}
                fill="none"
                stroke="#1b61c9"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="seismic-wave-path"
              />
            </svg>
          </div>

          {/* Analiz Logları */}
          <div className="simulation-logs">
            <div className={`sim-log-item ${analysisStep === 1 ? "active" : analysisStep > 1 ? "completed" : ""}`}>
              <div className={`sim-log-icon ${analysisStep === 1 ? "active" : analysisStep > 1 ? "completed" : "pending"}`}>
                {analysisStep > 1 ? <LuBadgeCheck /> : analysisStep === 1 ? <div className="sim-spinner" /> : null}
              </div>
              <div className="sim-log-text">
                <strong>[Fay Hattı Analizi]</strong> Coğrafi koordinatlar ve fay hatları taranıyor...
              </div>
            </div>

            <div className={`sim-log-item ${analysisStep === 2 ? "active" : analysisStep > 2 ? "completed" : ""}`}>
              <div className={`sim-log-icon ${analysisStep === 2 ? "active" : analysisStep > 2 ? "completed" : "pending"}`}>
                {analysisStep > 2 ? <LuBadgeCheck /> : analysisStep === 2 ? <div className="sim-spinner" /> : null}
              </div>
              <div className="sim-log-text">
                <strong>[Zemin Spektrumu]</strong> Konumun zemin parametreleri ve ivme spektrumu sorgulanıyor...
              </div>
            </div>

            <div className={`sim-log-item ${analysisStep === 3 ? "active" : analysisStep > 3 ? "completed" : ""}`}>
              <div className={`sim-log-icon ${analysisStep === 3 ? "active" : analysisStep > 3 ? "completed" : "pending"}`}>
                {analysisStep > 3 ? <LuBadgeCheck /> : analysisStep === 3 ? <div className="sim-spinner" /> : null}
              </div>
              <div className="sim-log-text">
                <strong>[Yapısal Parametreler]</strong> Bina yapım yılı ({yearBuilt}) ve kat sayısı ({floorCount}) çarpanları analiz ediliyor...
              </div>
            </div>

            <div className={`sim-log-item ${analysisStep === 4 ? "active" : analysisStep > 4 ? "completed" : ""}`}>
              <div className={`sim-log-icon ${analysisStep === 4 ? "active" : analysisStep > 4 ? "completed" : "pending"}`}>
                {analysisStep > 4 ? <LuBadgeCheck /> : analysisStep === 4 ? <div className="sim-spinner" /> : null}
              </div>
              <div className="sim-log-text">
                <strong>[Sismik Direnç]</strong> Mühendislik formülleri ile yapının deprem yükü kapasitesi simüle ediliyor...
              </div>
            </div>

            <div className={`sim-log-item ${analysisStep === 5 ? "active" : analysisStep > 5 ? "completed" : ""}`}>
              <div className={`sim-log-icon ${analysisStep === 5 ? "active" : analysisStep > 5 ? "completed" : "pending"}`}>
                {analysisStep > 5 ? <LuBadgeCheck /> : analysisStep === 5 ? <div className="sim-spinner" /> : null}
              </div>
              <div className="sim-log-text">
                <strong>[Raporlama]</strong> Ön analiz raporu ve nihai güvenlik skoru derleniyor...
              </div>
            </div>
          </div>
        </motion.div>
      )}
      
      {/* Adım 3: Sonuç */}
      {formStep === 3 && evaluationResult && (
        <motion.div
          key="step3"
          className="result-container"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 180, damping: 20 }}
        >
          <div className="result-hero">
            <div className="result-hero-icon" style={{ color: getGradeColor(evaluationResult.safetyGrade) }}>
              <LuBadgeCheck />
            </div>
            <div className="result-hero-content">
              <h3 className="result-title">Deprem Risk Analizi Sonucu</h3>
              <p className="result-hero-subtitle">
                Binanız için oluşturulan güvenlik derecesi aşağıda detaylarıyla sunulmuştur.
              </p>
            </div>
          </div>

          {/* Güvenlik Derecesi Göstergesi */}
          <div className="safety-grade-badge-wrapper" style={{ position: 'relative', minHeight: '180px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            {/* Neon Glow Aura */}
            <div className={`glow-halo glow-${evaluationResult.safetyGrade}`} />
            
            <motion.div 
              className="safety-grade-badge animate-pulse" 
              style={{ 
                backgroundColor: getGradeColor(evaluationResult.safetyGrade),
                zIndex: 2,
                position: 'relative'
              }}
              initial={{ scale: 0, rotate: -25 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
              whileHover={{ scale: 1.1, transition: { duration: 0.2 } }}
            >
              {evaluationResult.safetyGrade}
            </motion.div>
            <motion.div 
              className="safety-grade-label"
              style={{ zIndex: 2, position: 'relative' }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              {getGradeText(evaluationResult.safetyGrade)}
            </motion.div>
          </div>
          
          {/* Risk Metresi */}
          <div className="safety-meter-container">
            <div className="meter-title-row">
              <span className="meter-title">
                <LuCircleGauge />
                Güvenlik Ölçümü
              </span>
              <span className="safety-percentage">{displayPercentage}%</span>
            </div>
            <div className="safety-meter">
              <div className="safety-meter-scale">
                <div className="safety-level" style={{backgroundColor: '#10B981'}}>A</div>
                <div className="safety-level" style={{backgroundColor: '#22D3EE'}}>B</div>
                <div className="safety-level" style={{backgroundColor: '#FCD34D'}}>C</div>
                <div className="safety-level" style={{backgroundColor: '#F97316'}}>D</div>
                <div className="safety-level" style={{backgroundColor: '#F87171'}}>E</div>
                <div className="safety-level" style={{backgroundColor: '#EF4444'}}>F</div>
              </div>
              
              {/* Gösterge İşareti - Üçgen (Kayan Animasyon) */}
              <motion.div 
                className="safety-meter-indicator"
                initial={{ left: "0%" }}
                animate={{ left: `${getIndicatorPosition(evaluationResult.safetyGrade)}%` }}
                transition={{ duration: 1.8, ease: [0.25, 1, 0.5, 1], delay: 0.5 }}
                style={{
                  borderBottomColor: getGradeColor(evaluationResult.safetyGrade)
                }}
              ></motion.div>
            </div>
          </div>
          
          {/* Bina Bilgileri Özet Kartları ve Detayları - Staggered Slide-In */}
          <motion.div 
            className="result-summary"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: { staggerChildren: 0.12, delayChildren: 0.4 }
              }
            }}
            initial="hidden"
            animate="visible"
          >
            <motion.div 
              className="summary-card"
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 120 } }
              }}
            >
              <div className="summary-icon">
                <LuShieldAlert />
              </div>
              <div className="summary-detail">
                <span className="summary-label">RİSK DERECESİ</span>
                <span className="summary-value" style={{color: getGradeColor(evaluationResult.safetyGrade)}}>
                  {getGradeText(evaluationResult.safetyGrade)}
                </span>
              </div>
            </motion.div>
            
            <motion.div 
              className="summary-card"
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 120 } }
              }}
            >
              <div className="summary-icon">
                <LuHouse />
              </div>
              <div className="summary-detail">
                <span className="summary-label">YAPIM YILI</span>
                <span className="summary-value">{yearBuilt}</span>
              </div>
            </motion.div>
            
            <motion.div 
              className="summary-card"
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 120 } }
              }}
            >
              <div className="summary-icon">
                <LuBuilding2 />
              </div>
              <div className="summary-detail">
                <span className="summary-label">KAT SAYISI</span>
                <span className="summary-value">{floorCount} Kat</span>
              </div>
            </motion.div>
          </motion.div>
          
          {/* Değerlendirme ve Öneriler */}
          <motion.div 
            className="recommendation-container" 
            style={{ borderLeftColor: getGradeColor(evaluationResult.safetyGrade) }}
            initial={{ opacity: 0, x: -15 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            <h4 className="recommendation-title">Değerlendirme ve Öneriler</h4>
            <p className="recommendation-text">
              {evaluationResult.evaluationNotes || getRecommendationText(evaluationResult.safetyGrade)}
            </p>
          </motion.div>
          
          {/* En Yakın Toplanma Alanı */}
          {evaluationResult.nearestAssemblyArea && (
            <motion.div 
              className="assembly-area"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.9 }}
            >
              <div className="area-icon">
                <LuMapPinHouse />
              </div>
              <div className="area-details">
                <h4>En Yakın Toplanma Alanı</h4>
                <p>{evaluationResult.nearestAssemblyArea}</p>
              </div>
            </motion.div>
          )}
          
          {/* Butonlar */}
          <motion.div 
            className="result-actions"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1.0 }}
          >
            <motion.button 
              className="secondary-button"
              type="button"
              onClick={() => window.print()}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
            >
              <LuPrinter />
              Raporu Yazdır
            </motion.button>
            
            <motion.button 
              className="submit-button"
              type="button"
              onClick={() => {
                setFormStep(1);
                setGeneralError("");
                setApiFeedback(null);
                setFieldErrors({});
              }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
            >
              Yeni Analiz Yap
            </motion.button>
          </motion.div>
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

// Simülasyon adımlarına göre dinamik SVG sismograf dalga yolu oluşturan yardımcı fonksiyon
function getSeismicPath(step) {
  if (step === 4) {
    // Sismik direnç simülasyonu adımı - Büyük sismik dalgalar
    return "M 5 30 L 15 10 L 25 50 L 35 3 M 35 3 L 45 57 L 55 8 L 65 52 L 75 12 L 85 48 L 95 18 L 105 42 L 115 22 L 125 38 L 135 30";
  }
  if (step === 5) {
    // Raporlama adımı - Sakinleşen ve durağanlaşan dalgalar
    return "M 5 30 Q 20 20, 35 30 T 65 30 T 95 30 T 125 30 T 135 30";
  }
  // Diğer ilk adımlar - Orta seviye sismik dalgalar
  return "M 5 30 Q 20 12, 35 30 T 65 30 T 95 30 T 125 30 T 135 30";
}

export default AddressForm;
