# EarthquakeCheck Frontend - Teknoloji ve Tasarım Dokümantasyonu

Bu doküman, `earthquake-check-frontend` projesinde kullanılan teknolojileri, mimari yapıyı, arayüz tasarım yaklaşımını ve geliştirme pratiklerini detaylı şekilde özetler.

## 1) Proje Özeti

EarthquakeCheck, kullanıcıdan adres/konum ve bina bilgileri alarak deprem risk değerlendirmesi sunan bir React tabanlı web uygulamasıdır. Uygulama, çok adımlı bir form deneyimi ve sonuç ekranı ile kullanıcıyı yönlendirir.

Temel kullanıcı akışı:

1. Adres yazma veya haritadan konum seçme
2. Bina bilgilerini girme (yapım yılı, kat sayısı)
3. Backend API üzerinden değerlendirme sonucu alma
4. Sonucu görselleştirilmiş metriklerle görüntüleme ve yazdırma

## 2) Kullanılan Teknolojiler

### 2.1 Çekirdek Teknolojiler

- `React 19` (`react`, `react-dom`): Bileşen tabanlı UI geliştirme.
- `JavaScript (ES6+)`: Uygulama dili.
- `Create React App / react-scripts 5`: Build, dev server, test altyapısı.

### 2.2 Yönlendirme ve Sayfa Yapısı

- `react-router-dom 6`: SPA (Single Page Application) route yönetimi.
  - Tanımlı route’lar:
    - `/` (Ana sayfa + risk formu)
    - `/nasil-calisir`
    - `/hakkimizda`
    - `/iletisim`

### 2.3 Harita ve Konum Teknolojileri

- `leaflet` + `react-leaflet`:
  - Harita render etme (`MapContainer`, `TileLayer`, `Marker`)
  - Kullanıcının haritaya tıklayarak konum seçebilmesi
  - OpenStreetMap tile kaynağı kullanımı
- `navigator.geolocation`:
  - Kullanıcı izin verirse başlangıçta mevcut konumu merkeze alma

### 2.4 Animasyon ve Etkileşim

- `framer-motion`:
  - Giriş animasyonları, adım geçişleri, hover/tap mikro etkileşimleri
- `aos` (Animate On Scroll):
  - Scroll sırasında fade-up benzeri animasyon efektleri

### 2.5 API İletişimi

- Tarayıcı `fetch` API’si ile backend entegrasyonu
- Geliştirme API tabanı:
  - `http://localhost:8082/api`
- Kullanılan endpoint’ler:
  - `POST /geolocation/coordinates` (adres -> koordinat)
  - `POST /building/evaluate` (risk değerlendirmesi)

### 2.6 Stil ve UI Katmanı

- Global CSS (`App.css`, `index.css`)
- CSS Custom Properties (design tokens):
  - renkler, gölgeler, geçişler, border-radius değerleri
- Responsive tasarım:
  - `@media` kırılımları (`1024`, `992`, `768`, `480`)
- Print stylesheet:
  - Sonuç ekranında yazdırma için optimize edilmiş görünüm

### 2.7 Test ve Kalite

- `@testing-library/react`, `@testing-library/jest-dom`, `@testing-library/user-event`
- `App.test.js`, `setupTests.js` altyapısı mevcut
- `web-vitals` entegrasyonu (`reportWebVitals.js`)

### 2.8 PWA ve Meta

- `public/manifest.json` ile temel PWA metadata
- `public/index.html` içinde:
  - tema rengi
  - viewport
  - Leaflet CSS linki
  - SEO amaçlı temel description

## 3) Mimari Yapı

### 3.1 Dosya/Bileşen Organizasyonu

- `src/App.js`: Uygulama kabuğu, router, ana layout, footer
- `src/components/AddressForm.js`: Ana iş akışını yöneten çok adımlı form + sonuç ekranı
- `src/components/Map.js`: Harita bileşeni ve konum seçim davranışı
- `src/components/Navbar.js`: Üst gezinme ve mobil menü
- `src/components/HowItWorks.js`, `About.js`, `Contact.js`: Statik/içerik odaklı sayfalar
- `src/Api.js`: Backend API çağrıları

### 3.2 Durum Yönetimi Yaklaşımı

Proje global state kütüphanesi (Redux, Zustand vb.) kullanmıyor. Durum yönetimi, komponent içi `useState` ve yaşam döngüsü davranışları için `useEffect` ile sağlanıyor.

Bu yaklaşım, mevcut ölçek için:

- Basit
- Okunabilir
- Hızlı geliştirme dostu

olarak değerlendirilebilir.

### 3.3 Veri Akışı

1. Kullanıcı giriş yapar (adres/koordinat + bina verisi)
2. `AddressForm` gerekli doğrulamaları yapar
3. `Api.js` üzerinden backend’e istek atılır
4. Response sonucu `evaluationResult` state’ine yazılır
5. Sonuç ekranı UI metrikleri ve önerilerle render edilir

## 4) UI/UX Tasarım Yaklaşımı

### 4.1 Tasarım Dili

Arayüz modern, kart tabanlı, yumuşak gölgeler ve gradient vurgular içeren bir dil kullanır. Tasarım dili şu prensiplere dayanır:

- Güven veren mavi tonları (ana aksan)
- Yüksek kontrastlı aksiyon butonları
- Bilgi yoğun alanlarda kart/section ayrımı
- Animasyonla rehberlik edilen kullanıcı akışı

### 4.2 Bilgi Mimarisi

Bilgi mimarisi 4 ana bölümde yapılandırılmıştır:

- Ana kullanım (risk analizi)
- Nasıl çalışır (eğitici içerik)
- Hakkımızda (kurumsal kimlik)
- İletişim (erişim ve form)

Bu düzen, hem ürün kullanımını hem de güven/şeffaflık ihtiyacını dengeler.

### 4.3 Etkileşim Tasarımı

- Çok adımlı ilerleme göstergesi (`Adres -> Bina Bilgileri -> Sonuç`)
- Haritadan konum seçme ve koordinat geri bildirimi
- İşlem sırasında loading göstergesi
- Başarılı/başarısız işlem mesajları
- Sonuç ekranında:
  - Harf notu (A-F)
  - Yüzde metrik
  - Renk kodlu risk seviyesi
  - Öneri metni

### 4.4 Responsive Tasarım Stratejisi

- Masaüstünde grid/flex ile geniş içerik
- Mobilde tek sütun düzeni
- Navbar’da mobil menüye düşme
- Kartların dikey hizalanması
- Form ve harita yüksekliğinin cihaz boyutuna göre optimize edilmesi

### 4.5 Görsel ve Marka Öğeleri

- Proje adı: `EarthquakeCheck`
- `public/logo.svg` ve klasik favicon/logo seti
- Kurucu görseli: `public/mehmet-eren-ozden.jpg`
- Tutarlı tipografi ve ikon kullanımı

## 5) Sayfa Bazlı Tasarım ve Fonksiyonellik Analizi

### 5.1 Ana Sayfa (`/`)

- Hero alanı (başlık, açıklama, CTA)
- Scroll animasyonlu tanıtım bloğu
- Ana form bileşeni (`AddressForm`)
- Kullanıcıyı hızlı aksiyona yönlendiren bir “Hemen Başla” yapısı

### 5.2 Nasıl Çalışır (`/nasil-calisir`)

- Adım adım süreç anlatımı
- Teknik süreçlerin kullanıcı dostu açıklaması
- Uyarı/not kartları ile beklenti yönetimi

### 5.3 Hakkımızda (`/hakkimizda`)

- Misyon/vizyon kartları
- Kurucu profili ve görsel sunumu
- Veri kaynakları ve analiz yöntemleri içeriksel anlatımı
- Kurumsal güven inşası odaklı yapı

### 5.4 İletişim (`/iletisim`)

- İletişim bilgileri ve sosyal link ikonları
- Form gönderimi (şu an simüle edilmiş başarı akışı)
- Konum için gömülü Google Maps iframe

## 6) API ve Domain Modeli

### 6.1 Adres -> Koordinat Dönüşümü

- Input: Adres metni (FormData)
- Output: `latitude`, `longitude`

### 6.2 Risk Değerlendirmesi Gönderimi

Gönderilen payload (özet):

- `yearBuilt` (API contract canonical alanı)
- `floorCount`
- `address` (opsiyonel)
- `buildingType` (opsiyonel)
- `latitude` (opsiyonel, boşsa `null`)
- `longitude` (opsiyonel, boşsa `null`)

### 6.3 Beklenen Sonuç Alanları

UI tarafında kullanılan önemli alanlar:

- `safetyGrade` (A-F)
- `safetyGradePercentage`
- `evaluationNotes`
- `nearestAssemblyArea`

## 7) Tasarım Kararlarının Güçlü Yanları

- Öğrenmesi kolay kullanıcı akışı
- Harita ve adres girişinin birlikte sunulması
- Görsel olarak anlaşılır risk metrikleri
- Mobil uyumluluk ve yazdırma desteği
- Kapsamlı animasyonlarla modern kullanıcı hissi

## 8) Geliştirilebilir Alanlar (Teknik ve Tasarımsal)

### 8.1 Teknik

- `API_URL_DEV` için `.env` tabanlı ortam yönetimi (dev/stage/prod)
- API hata durumlarında daha detaylı kullanıcı geri bildirimi
- Form doğrulama katmanının güçlendirilmesi
- Test kapsamının kritik akışlar için artırılması

### 8.2 Tasarım/UX

- Erişilebilirlik (a11y) iyileştirmeleri:
  - klavye navigasyonu
  - ARIA etiketleri
  - kontrast kontrolleri
- Sonuç ekranında metriklerin açıklayıcı tooltip/yardım metinleri
- Sosyal medya linklerinin gerçek adreslerle doldurulması

## 9) Sonuç

Bu frontend, deprem risk değerlendirme gibi kritik bir kullanım senaryosunu sade ve etkili bir kullanıcı deneyimiyle sunan; modern React ekosistemi, harita teknolojileri ve animasyon odaklı bir tasarım diliyle inşa edilmiş bir projedir.

Mimari sade, genişlemeye uygun ve özellikle kullanıcıyı adım adım yönlendiren form kurgusu sayesinde ürün hedefiyle uyumludur.
