import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Centred on Woking, 10 mile radius
const WOKING_CENTER: [number, number] = [51.3193, -0.5566];

// Towns within ~10 miles of Woking
const TOWNS: { name: string; pos: [number, number] }[] = [
  { name: "Woking", pos: [51.3193, -0.5566] },
  { name: "Guildford", pos: [51.2362, -0.5704] },
  { name: "Camberley", pos: [51.3367, -0.7441] },
  { name: "Leatherhead", pos: [51.2959, -0.3314] },
  { name: "Byfleet", pos: [51.3396, -0.4804] },
  { name: "Weybridge", pos: [51.3700, -0.4557] },
  { name: "Cobham", pos: [51.3307, -0.4097] },
  { name: "Farnborough", pos: [51.2979, -0.7472] },
  { name: "Aldershot", pos: [51.2481, -0.7617] },
];

export default function CoverageMap() {
  const mapRef = useRef<HTMLDivElement>(null);
  const instanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current || instanceRef.current) return;

    const map = L.map(mapRef.current, {
      center: WOKING_CENTER,
      zoom: 11,
      zoomControl: true,
      scrollWheelZoom: false,
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 14,
    }).addTo(map);

    // Coverage circle — roughly 20 mile radius from Guildford
    L.circle(WOKING_CENTER, {
      radius: 16093,
      color: "#1E3D0E",
      weight: 2,
      fillColor: "#4A6741",
      fillOpacity: 0.15,
    }).addTo(map);

    // Town markers (small dot + label)
    const dotIcon = L.divIcon({
      className: "",
      html: `<div style="width:8px;height:8px;border-radius:50%;background:#C4A45A;border:1.5px solid #1E3D0E;"></div>`,
      iconSize: [8, 8],
      iconAnchor: [4, 4],
    });

    TOWNS.forEach(({ name, pos }) => {
      L.marker(pos, { icon: dotIcon })
        .addTo(map)
        .bindTooltip(name, {
          permanent: true,
          direction: "top",
          offset: [0, -6],
          className: "coverage-label",
        });
    });

    instanceRef.current = map;
    return () => { map.remove(); instanceRef.current = null; };
  }, []);

  return (
    <>
      <style>{`
        .leaflet-container { font-family: 'Playfair Display', serif; }
        .coverage-label {
          background: transparent !important;
          border: none !important;
          box-shadow: none !important;
          font-family: 'Playfair Display', serif !important;
          font-size: 0.7rem !important;
          color: #1E3D0E !important;
          font-weight: 500 !important;
          letter-spacing: 0.5px !important;
          white-space: nowrap !important;
        }
        .coverage-label::before { display: none !important; }
        .leaflet-attribution-flag { display: none !important; }
      `}</style>
      <div ref={mapRef} style={{ height: "420px", width: "100%", borderRadius: "3px", overflow: "hidden" }} />
    </>
  );
}
