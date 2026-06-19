import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Surrey centre approx lat/lng
const SURREY_CENTER: [number, number] = [51.235, -0.45];

// Key towns to label in the coverage area
const TOWNS: { name: string; pos: [number, number] }[] = [
  { name: "Guildford", pos: [51.2362, -0.5704] },
  { name: "Woking", pos: [51.3193, -0.5566] },
  { name: "Reigate", pos: [51.2365, -0.2049] },
  { name: "Dorking", pos: [51.2327, -0.3299] },
  { name: "Leatherhead", pos: [51.2959, -0.3314] },
  { name: "Epsom", pos: [51.3354, -0.2689] },
  { name: "Farnham", pos: [51.2144, -0.7998] },
  { name: "Camberley", pos: [51.3367, -0.7441] },
  { name: "Redhill", pos: [51.2403, -0.1709] },
  { name: "Kingston", pos: [51.4085, -0.2995] },
];

export default function CoverageMap() {
  const mapRef = useRef<HTMLDivElement>(null);
  const instanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current || instanceRef.current) return;

    const map = L.map(mapRef.current, {
      center: SURREY_CENTER,
      zoom: 10,
      zoomControl: true,
      scrollWheelZoom: false,
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 14,
    }).addTo(map);

    // Coverage circle — roughly 20 mile radius from Guildford
    L.circle(SURREY_CENTER, {
      radius: 32000,
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
