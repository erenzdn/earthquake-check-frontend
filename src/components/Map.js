import React, { useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Leaflet'in varsayılan ikon sorunu için düzeltme
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// Türkiye'nin ortalama koordinatları,
//41.052228, 28.929618
const defaultCenter = { lat: 41.052228, lng: 28.929618 }; 

function LocationMarker({ position, setPosition }) {
  const map = useMapEvents({
    click: (e) => {
      setPosition(e.latlng);
      map.flyTo(e.latlng, map.getZoom());
    },
  });

  return position === null ? null : (
    <Marker 
      position={position}
      interactive={false}
    />
  );
}

function Map({ selectedPosition, setSelectedPosition }) {
  // Eğer kullanıcının konumu kullanılabilirse, haritayı oraya odakla
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          // Sadece başlangıçta konumu ayarlamak için, seçilen bir konum yoksa
          if (!selectedPosition) {
            setSelectedPosition({ lat: latitude, lng: longitude });
          }
        },
        (error) => {
          console.error("Konum erişimi hatası:", error);
        }
      );
    }
  }, []);

  return (
    <MapContainer
      center={selectedPosition || defaultCenter}
      zoom={13}
      scrollWheelZoom={true}
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <LocationMarker position={selectedPosition} setPosition={setSelectedPosition} />
    </MapContainer>
  );
}

export default Map; 