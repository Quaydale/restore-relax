import { useCallback, useEffect, useRef, useState } from "react";
import "./fonts/fonts.css";
import heroBg from "./assets/hero-bg.jpg";
import CoverageMap from "./CoverageMap";

const services = [
  {
    name: "Sports Massage",
    description: "Targeted therapy to aid recovery, prevent injury and enhance athletic performance.",
    prices: [{ duration: "60 min", price: "£70" }, { duration: "90 min", price: "£100" }],
    info: {
      origin: "Early 20th century, popularised during the 1970s running boom in the United States and Europe.",
      history: "Rooted in Swedish massage techniques, sports massage was refined by coaches and physiotherapists working alongside competitive athletes. It gained mainstream recognition at the 1984 Los Angeles Olympics, where it was offered to athletes for the first time at an official Games.",
      benefits: ["Reduces post-exercise muscle soreness", "Helps prevent soft tissue injuries", "Improves flexibility and range of motion", "Speeds recovery between training sessions", "Reduces anxiety and mental fatigue"],
    },
  },
  {
    name: "Deep Tissue",
    description: "Firm pressure reaching deeper muscle layers to release chronic tension and knots.",
    prices: [{ duration: "60 min", price: "£70" }, { duration: "90 min", price: "£100" }],
    info: {
      origin: "Formalised in North America during the 1970s, building on ancient deep-pressure healing traditions found across many cultures.",
      history: "Canadian physiotherapist Therese Pfrimmer is credited with developing one of the first structured deep tissue techniques after using it to recover from her own partial paralysis in the 1940s. The modern form draws on earlier practices from ancient Egypt, Greece and China where deep manual pressure was used to treat pain.",
      benefits: ["Breaks down scar tissue and adhesions", "Relieves chronic muscle tension and pain", "Lowers blood pressure and heart rate", "Reduces stress hormone levels", "Supports rehabilitation after injury"],
    },
  },
  {
    name: "Swedish Massage",
    description: "Classic full-body relaxation massage using long, flowing strokes to calm the nervous system.",
    prices: [{ duration: "60 min", price: "£70" }, { duration: "90 min", price: "£100" }],
    info: {
      origin: "Sweden, early 19th century.",
      history: "Developed by Swedish physiologist Pehr Henrik Ling in the 1820s, who synthesised techniques from Chinese, Egyptian, Greek and Roman healing traditions into a unified system. His 'Medical Gymnastics' laid the foundation for what became the most widely practised massage form in the Western world. It was introduced to the United States in the 1850s and has remained the cornerstone of modern massage therapy ever since.",
      benefits: ["Promotes deep relaxation and stress relief", "Improves blood and lymphatic circulation", "Eases muscle tension and stiffness", "Boosts mood by releasing endorphins", "Supports better sleep quality"],
    },
  },
  {
    name: "Pregnancy Massage",
    description: "Gentle, nurturing massage tailored to support mothers-to-be through every trimester.",
    prices: [{ duration: "60 min", price: "£70" }],
    info: {
      origin: "Ancient traditions across Egypt, China and India; formalised as a Western practice in the 1980s.",
      history: "Massage during pregnancy has been documented in ancient Egyptian and Chinese texts. In the West, therapist Carole Osborne pioneered dedicated prenatal massage training in the 1980s, establishing the safety protocols and positioning techniques still used today. Research over the past 30 years has confirmed meaningful benefits for both mother and baby.",
      benefits: ["Relieves lower back, hip and sciatic pain", "Reduces swelling in hands and feet", "Lowers levels of stress hormones", "Improves sleep quality", "May support shorter, easier labour"],
    },
  },
  {
    name: "Manual Lymphatic Drainage",
    description: "Light, rhythmic techniques to stimulate lymph flow, reduce swelling and support immunity.",
    prices: [{ duration: "60 min", price: "£70" }],
    info: {
      origin: "France, 1930s.",
      history: "Developed by Danish physiotherapist Emil Vodder and his wife Estrid while working in Cannes. Treating patients with chronic colds, Vodder noticed swollen lymph nodes and began experimenting with gentle, circular hand movements over them — contrary to the medical wisdom of the time. He presented his technique in Paris in 1936 to initial scepticism, but decades of clinical research have since established MLD as a cornerstone treatment in lymphoedema management and post-surgical care.",
      benefits: ["Reduces oedema and post-surgical swelling", "Supports the immune system", "Aids the body's natural detoxification", "Reduces fatigue and brain fog", "Beneficial after cosmetic surgery or cancer treatment"],
    },
  },
  {
    name: "Oncology Massage",
    description: "Specially adapted, gentle massage designed to safely support those living with or beyond cancer.",
    prices: [{ duration: "60 min", price: "£60" }],
    info: {
      origin: "Emerged as a formal discipline in the late 1990s and early 2000s in the United States and UK.",
      history: "For much of the 20th century, massage was contraindicated for cancer patients over fears of spreading disease — a concern now considered largely unfounded. Researcher and therapist Tracy Walton was instrumental in changing this, publishing studies demonstrating that carefully adapted massage is safe and beneficial. Oncology massage is now offered in leading cancer centres and hospices worldwide, with practitioners trained in specific modifications for those undergoing or recovering from treatment.",
      benefits: ["Reduces anxiety, pain and treatment-related fatigue", "Improves sleep and sense of wellbeing", "Eases nausea associated with chemotherapy", "Provides nurturing human connection during a difficult time", "Can be adapted for any stage of diagnosis or treatment"],
    },
  },
];

type ServiceInfo = { origin: string; history: string; benefits: string[] };

const InfoModal = ({ service, onClose }: { service: { name: string; info: ServiceInfo }; onClose: () => void }) => {
  const headingId = `modal-title-${service.name.replace(/\s+/g, "-").toLowerCase()}`;
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    // Move focus into modal and lock body scroll
    closeRef.current?.focus();
    document.body.style.overflow = "hidden";
    const handler = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", handler);
    return () => {
      document.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  }, []); // onClose is stable via useCallback in parent

  return (
    <div
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby={headingId}
      style={{ position: "fixed", inset: 0, zIndex: 500, background: "rgba(10,25,5,0.7)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}
    >
      <div onClick={e => e.stopPropagation()} style={{ background: "#fff", maxWidth: "560px", width: "100%", maxHeight: "85vh", overflowY: "auto", borderRadius: "3px", padding: "44px 40px", position: "relative", boxShadow: "0 24px 80px rgba(0,0,0,0.25)" }}>
        <button ref={closeRef} onClick={onClose} style={{ position: "absolute", top: "12px", right: "12px", background: "none", border: "none", cursor: "pointer", color: "#7A6B58", fontSize: "1.4rem", lineHeight: 1, padding: "8px 12px", minWidth: "44px", minHeight: "44px" }} aria-label="Close dialog">×</button>

        <div style={{ width: "24px", height: "1px", background: "#C4A45A", marginBottom: "16px" }} />
        <h3 id={headingId} style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.4rem", color: "#1E3D0E", fontWeight: 500, marginBottom: "24px" }}>{service.name}</h3>

        <p style={{ fontSize: "0.7rem", letterSpacing: "3px", color: "#8B6914", fontFamily: "'Playfair Display', serif", textTransform: "uppercase", marginBottom: "8px" }}>Origin</p>
        <p style={{ fontSize: "1rem", color: "#5C3D1E", lineHeight: 1.75, fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, marginBottom: "24px" }}>{service.info.origin}</p>

        <p style={{ fontSize: "0.7rem", letterSpacing: "3px", color: "#8B6914", fontFamily: "'Playfair Display', serif", textTransform: "uppercase", marginBottom: "8px" }}>History</p>
        <p style={{ fontSize: "1rem", color: "#5C3D1E", lineHeight: 1.75, fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, marginBottom: "24px" }}>{service.info.history}</p>

        <p style={{ fontSize: "0.7rem", letterSpacing: "3px", color: "#8B6914", fontFamily: "'Playfair Display', serif", textTransform: "uppercase", marginBottom: "12px" }}>Benefits</p>
        <ul style={{ paddingLeft: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: "8px" }}>
          {service.info.benefits.map((b, i) => (
            <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: "10px", fontSize: "1rem", color: "#5C3D1E", lineHeight: 1.7, fontFamily: "'Cormorant Garamond', serif", fontWeight: 300 }}>
              <span style={{ color: "#C4A45A", marginTop: "2px", flexShrink: 0 }}>—</span>{b}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

const LotusIcon = ({ size = 112, color = "#1E3D0E" }: { size?: number; color?: string }) => (
  <svg viewBox="0 0 120 90" fill="none" xmlns="http://www.w3.org/2000/svg" width={size} height={size * 0.75} style={{ display: "block", margin: "0 auto" }}>
    <path d="M60 80 C60 80 40 55 40 35 C40 20 50 10 60 10 C70 10 80 20 80 35 C80 55 60 80 60 80Z" stroke={color} strokeWidth="2" fill="none"/>
    <path d="M60 78 C60 78 30 60 25 42 C20 28 30 15 42 18 C52 21 58 40 60 78Z" stroke={color} strokeWidth="2" fill="none"/>
    <path d="M60 78 C60 78 90 60 95 42 C100 28 90 15 78 18 C68 21 62 40 60 78Z" stroke={color} strokeWidth="2" fill="none"/>
    <path d="M45 72 C45 72 10 62 5 45 C0 30 12 18 25 22 C38 26 44 52 45 72Z" stroke={color} strokeWidth="1.5" fill="none" opacity="0.65"/>
    <path d="M75 72 C75 72 110 62 115 45 C120 30 108 18 95 22 C82 26 76 52 75 72Z" stroke={color} strokeWidth="1.5" fill="none" opacity="0.65"/>
    <path d="M50 82 Q60 78 70 82" stroke={color} strokeWidth="1.5" fill="none"/>
  </svg>
);

const LeafDecor = ({ style }: { style?: React.CSSProperties }) => (
  <svg viewBox="0 0 80 120" fill="none" xmlns="http://www.w3.org/2000/svg" style={style}>
    <path d="M40 110 C40 110 5 80 8 45 C10 20 25 5 40 10 C55 5 70 20 72 45 C75 80 40 110 40 110Z" stroke="currentColor" strokeWidth="1.5" fill="none" opacity="0.5"/>
    <line x1="40" y1="110" x2="40" y2="10" stroke="currentColor" strokeWidth="1" opacity="0.3"/>
    <line x1="40" y1="85" x2="15" y2="55" stroke="currentColor" strokeWidth="0.8" opacity="0.25"/>
    <line x1="40" y1="75" x2="65" y2="48" stroke="currentColor" strokeWidth="0.8" opacity="0.25"/>
    <line x1="40" y1="60" x2="18" y2="38" stroke="currentColor" strokeWidth="0.8" opacity="0.2"/>
    <line x1="40" y1="50" x2="62" y2="30" stroke="currentColor" strokeWidth="0.8" opacity="0.2"/>
  </svg>
);

const WaIcon = ({ size = 22 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="white">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

function useScrollAnimation() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("visible");
        });
      },
      { threshold: 0.1 }
    );
    document.querySelectorAll(".fade-up").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}

export default function App() {
  useScrollAnimation();
  const [activeInfo, setActiveInfo] = useState<typeof services[0] | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const closeModal = useCallback(() => setActiveInfo(null), []);

  useEffect(() => {
    const onScroll = () => {
      const next = window.scrollY > window.innerHeight * 0.6;
      setScrolled(prev => prev === next ? prev : next);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", backgroundColor: "#F5F0E8", minHeight: "100vh" }}>
      {activeInfo && <InfoModal service={activeInfo} onClose={closeModal} />}
      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }

        .fade-up { opacity: 0; transform: translateY(28px); transition: opacity 0.7s ease, transform 0.7s ease; }
        .fade-up.visible { opacity: 1; transform: translateY(0); }

        .service-card { background: #fff; border: 1px solid rgba(74,103,65,0.15); transition: transform 0.3s ease, box-shadow 0.3s ease; }
        .service-card:hover { transform: translateY(-5px); box-shadow: 0 16px 48px rgba(30,61,14,0.13); }

        .wa-btn { background: #25D366; color: #fff; display: inline-flex; align-items: center; gap: 10px; padding: 16px 36px; border-radius: 50px; font-size: 1.1rem; font-family: 'Playfair Display', serif; font-weight: 500; letter-spacing: 0.5px; text-decoration: none; transition: background 0.2s, transform 0.2s, box-shadow 0.2s; box-shadow: 0 4px 20px rgba(37,211,102,0.35); }
        .wa-btn:hover { background: #1da851; transform: translateY(-2px); box-shadow: 0 8px 28px rgba(37,211,102,0.45); }

        .sticky-wa { position: fixed; bottom: 20px; right: 16px; z-index: 200; display: none; }
        @media (max-width: 768px) { .sticky-wa { display: flex; } }

        nav a { text-decoration: none; font-family: 'Playfair Display', serif; font-size: 0.85rem; letter-spacing: 1.5px; text-transform: uppercase; opacity: 0.85; transition: opacity 0.2s, color 0.4s; }
        nav a:hover { opacity: 1; }

        .price-pill { background: #EDE6D4; border: 1px solid rgba(139,105,20,0.2); padding: 6px 14px; border-radius: 50px; font-size: 0.9rem; color: #5C3D1E; font-family: 'Playfair Display', serif; }

        .grid-services { display: grid; grid-template-columns: repeat(auto-fill, minmax(290px, 1fr)); gap: 24px; }

        .info-btn { background: none; border: 1.5px solid #C4A45A; color: #C4A45A; border-radius: 50%; width: 20px; height: 20px; font-size: 0.7rem; font-family: 'Playfair Display', serif; font-style: italic; font-weight: 600; cursor: pointer; display: inline-flex; align-items: center; justify-content: center; flex-shrink: 0; transition: background 0.2s, color 0.2s; vertical-align: middle; padding: 0; line-height: 1; position: relative; }
        .info-btn::before { content: ''; position: absolute; inset: -12px; border-radius: 50%; }
        .info-btn:hover { background: #C4A45A; color: #fff; }

        @media (max-width: 600px) {
          .grid-services { grid-template-columns: 1fr; }
          .hero-name { font-size: 3rem !important; }
        }
      `}</style>

      {/* Sticky WhatsApp (mobile) */}
      <a href="https://wa.me/[PHONE]" className="sticky-wa wa-btn" style={{ padding: "13px 18px", fontSize: "0.9rem" }} target="_blank" rel="noopener noreferrer">
        <WaIcon size={20} /> Book Now
      </a>

      {/* Navigation */}
      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, background: scrolled ? "rgba(245,240,232,0.96)" : "rgba(20,40,10,0.55)", backdropFilter: "blur(10px)", borderBottom: scrolled ? "1px solid rgba(74,103,65,0.12)" : "1px solid rgba(255,255,255,0.1)", padding: "15px 32px", display: "flex", justifyContent: "space-between", alignItems: "center", transition: "background 0.4s, border-color 0.4s" }}>
        <span style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontWeight: 500, color: scrolled ? "#1E3D0E" : "#fff", fontSize: "1.1rem", letterSpacing: "0.5px", transition: "color 0.4s" }}>Restore & Relax</span>
        <div style={{ display: "flex", gap: "24px" }}>
          <a href="#services" style={{ color: scrolled ? "#1E3D0E" : "#fff" }}>Services</a>
          <a href="#coverage" style={{ color: scrolled ? "#1E3D0E" : "#fff" }}>Area</a>
          <a href="#about" style={{ color: scrolled ? "#1E3D0E" : "#fff" }}>About</a>
          <a href="#book" style={{ color: scrolled ? "#1E3D0E" : "#fff" }}>Book</a>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden", paddingTop: "80px", paddingBottom: "60px", backgroundImage: `url(${heroBg})`, backgroundSize: "cover", backgroundPosition: "center 30%" }}>
        {/* Dark green overlay */}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(160deg, rgba(20,45,10,0.72) 0%, rgba(30,61,14,0.65) 50%, rgba(45,80,20,0.60) 100%)", zIndex: 0 }} />
        <LeafDecor style={{ position: "absolute", top: "60px", left: "12px", width: "80px", color: "#fff", opacity: 0.18, zIndex: 1 }} />
        <LeafDecor style={{ position: "absolute", bottom: "60px", right: "12px", width: "80px", color: "#fff", opacity: 0.18, transform: "scaleX(-1) rotate(15deg)", zIndex: 1 }} />
        <LeafDecor style={{ position: "absolute", top: "25%", right: "6%", width: "52px", color: "#fff", opacity: 0.12, transform: "rotate(25deg)", zIndex: 1 }} />
        <LeafDecor style={{ position: "absolute", bottom: "25%", left: "6%", width: "52px", color: "#fff", opacity: 0.12, transform: "scaleX(-1) rotate(-15deg)", zIndex: 1 }} />

        <div style={{ textAlign: "center", position: "relative", padding: "0 20px", zIndex: 2 }}>
          {/* Arc "MASSAGE THERAPY" */}
          <svg viewBox="0 0 300 75" style={{ width: "270px", display: "block", margin: "0 auto -4px" }}>
            <defs>
              <path id="topArc" d="M 28,68 A 122,122 0 0,1 272,68" />
            </defs>
            <text>
              <textPath href="#topArc" startOffset="50%" textAnchor="middle" style={{ fontFamily: "'Playfair Display', serif", fontSize: "11.5px", letterSpacing: "7px", fill: "#E8F0E4" }}>
                MASSAGE THERAPY
              </textPath>
            </text>
          </svg>

          {/* Lotus */}
          <LotusIcon size={116} color="#C4A45A" />

          {/* Brand name */}
          <h1 className="hero-name" style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontWeight: 300, fontSize: "3.8rem", color: "#fff", lineHeight: 1.1, marginTop: "2px" }}>
            Restore & Relax
          </h1>

          {/* by Iulia */}
          <p style={{ marginTop: "14px", fontFamily: "'Playfair Display', serif", fontSize: "0.9rem", letterSpacing: "3px", color: "#C4A45A" }}>
            <svg viewBox="0 0 40 4" width="40" height="4" style={{ display: "inline-block", verticalAlign: "middle", marginRight: "12px" }}><line x1="0" y1="2" x2="40" y2="2" stroke="#C4A45A" strokeWidth="1"/></svg>
            by Iulia
            <svg viewBox="0 0 40 4" width="40" height="4" style={{ display: "inline-block", verticalAlign: "middle", marginLeft: "12px" }}><line x1="0" y1="2" x2="40" y2="2" stroke="#C4A45A" strokeWidth="1"/></svg>
          </p>

          {/* Tagline */}
          <p style={{ marginTop: "28px", fontSize: "1.15rem", color: "rgba(255,255,255,0.82)", fontStyle: "italic", maxWidth: "360px", margin: "28px auto 0", lineHeight: 1.75 }}>
            Professional massage therapy, delivered to your door.
          </p>

          {/* CTA */}
          <div style={{ marginTop: "38px" }}>
            <a href="#book" className="wa-btn" style={{ fontSize: "1.05rem" }}>
              <WaIcon size={22} /> Book via WhatsApp
            </a>
          </div>
        </div>

        {/* Scroll indicator */}
        <div style={{ position: "absolute", bottom: "28px", left: "50%", transform: "translateX(-50%)", textAlign: "center", opacity: 0.55, zIndex: 2 }}>
          <p style={{ fontSize: "0.65rem", letterSpacing: "3px", color: "#fff", fontFamily: "'Playfair Display', serif", marginBottom: "8px" }}>SCROLL</p>
          <svg width="18" height="10" viewBox="0 0 18 10" fill="none" xmlns="http://www.w3.org/2000/svg">
            <polyline points="1,1 9,9 17,1" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
          </svg>
        </div>
      </section>

      {/* ── ABOUT ── */}
      <section id="about" style={{ padding: "88px 24px", background: "#fff", textAlign: "center" }}>
        <div style={{ maxWidth: "660px", margin: "0 auto" }} className="fade-up">
          <p style={{ fontSize: "0.7rem", letterSpacing: "4px", color: "#8B6914", fontFamily: "'Playfair Display', serif", marginBottom: "18px", textTransform: "uppercase" }}>Welcome</p>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontWeight: 300, fontSize: "clamp(1.9rem, 5vw, 2.7rem)", color: "#1E3D0E", lineHeight: 1.3, marginBottom: "24px" }}>
            Healing hands, brought to you
          </h2>
          <div style={{ width: "36px", height: "1px", background: "#C4A45A", margin: "0 auto 28px" }} />
          <p style={{ fontSize: "1.1rem", color: "#5C3D1E", lineHeight: 1.95, fontWeight: 300 }}>
            I'm Iulia, a fully qualified massage therapist with a passion for restoring balance to body and mind. Whether you're recovering from sport, managing chronic tension, or simply craving deep relaxation — I bring a personalised, professional treatment directly to your home.
          </p>
          <p style={{ fontSize: "1.1rem", color: "#5C3D1E", lineHeight: 1.95, fontWeight: 300, marginTop: "18px" }}>
            Every session is tailored to your specific needs, delivered in the comfort and privacy of your own space — no travel, no waiting rooms, just pure restoration.
          </p>
        </div>
      </section>

      {/* ── SERVICES ── */}
      <section id="services" style={{ padding: "88px 24px", background: "#F5F0E8" }}>
        <div style={{ maxWidth: "1080px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "56px" }} className="fade-up">
            <p style={{ fontSize: "0.7rem", letterSpacing: "4px", color: "#8B6914", fontFamily: "'Playfair Display', serif", marginBottom: "16px", textTransform: "uppercase" }}>Treatments</p>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontWeight: 300, fontSize: "clamp(1.9rem, 5vw, 2.7rem)", color: "#1E3D0E" }}>
              Services & Pricing
            </h2>
            <div style={{ width: "36px", height: "1px", background: "#C4A45A", margin: "18px auto 0" }} />
          </div>

          <div className="grid-services">
            {services.map((service, i) => (
              <div
                key={service.name}
                className="service-card fade-up"
                style={{ padding: "30px 26px", borderRadius: "3px", transitionDelay: `${i * 70}ms` }}
              >
                <div style={{ width: "24px", height: "1px", background: "#C4A45A", marginBottom: "18px" }} />
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
                  <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.15rem", color: "#1E3D0E", fontWeight: 500 }}>
                    {service.name}
                  </h3>
                  <button className="info-btn" onClick={() => setActiveInfo(service)} aria-label={`About ${service.name}`} title="History & benefits">i</button>
                </div>
                <p style={{ fontSize: "0.95rem", color: "#7A6B58", lineHeight: 1.75, marginBottom: "18px", fontStyle: "italic", fontWeight: 300 }}>
                  {service.description}
                </p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                  {service.prices.map((p) => (
                    <span key={p.duration} className="price-pill">
                      {p.duration} — <strong style={{ color: "#1E3D0E", fontWeight: 600 }}>{p.price}</strong>
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Travel note */}
          <div className="fade-up" style={{ marginTop: "44px", padding: "22px 28px", background: "#EDE6D4", border: "1px solid rgba(139,105,20,0.18)", borderRadius: "3px", textAlign: "center" }}>
            <p style={{ fontSize: "1rem", color: "#5C3D1E", fontStyle: "italic" }}>
              <strong style={{ fontStyle: "normal", fontFamily: "'Playfair Display', serif", color: "#1E3D0E" }}>Mobile / Home Visits</strong> — Travel fees are included in all treatment prices.
            </p>
          </div>
        </div>
      </section>

      {/* ── COVERAGE AREA ── */}
      <section id="coverage" style={{ padding: "88px 24px", background: "#fff" }}>
        <div style={{ maxWidth: "1080px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "48px" }} className="fade-up">
            <p style={{ fontSize: "0.7rem", letterSpacing: "4px", color: "#8B6914", fontFamily: "'Playfair Display', serif", marginBottom: "16px", textTransform: "uppercase" }}>Where I Work</p>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontWeight: 300, fontSize: "clamp(1.9rem, 5vw, 2.7rem)", color: "#1E3D0E" }}>
              Coverage Area
            </h2>
            <div style={{ width: "36px", height: "1px", background: "#C4A45A", margin: "18px auto 24px" }} />
            <p style={{ fontSize: "1.1rem", color: "#5C3D1E", lineHeight: 1.85, fontWeight: 300, maxWidth: "620px", margin: "0 auto" }}>
              Based in <strong style={{ fontWeight: 500, color: "#1E3D0E" }}>Woking</strong>, I cover a 10 mile radius bringing professional massage therapy directly to your home. Whether you're in Guildford, Camberley, Weybridge, Cobham, Leatherhead, Byfleet or the surrounding villages — I come to you.
            </p>
            <p style={{ fontSize: "1rem", color: "#7A6B58", lineHeight: 1.8, fontWeight: 300, maxWidth: "560px", margin: "16px auto 0", fontStyle: "italic" }}>
              Not sure if you're in range? Just send me a message on WhatsApp and I'll confirm.
            </p>
          </div>

          <div className="fade-up" style={{ borderRadius: "3px", overflow: "hidden", border: "1px solid rgba(74,103,65,0.15)", boxShadow: "0 4px 24px rgba(30,61,14,0.08)" }}>
            <CoverageMap />
          </div>

          {/* Town chips */}
          <div className="fade-up" style={{ marginTop: "32px", display: "flex", flexWrap: "wrap", gap: "10px", justifyContent: "center" }}>
            {["Woking", "Guildford", "Camberley", "Weybridge", "Cobham", "Leatherhead", "Byfleet", "West Byfleet", "Farnborough", "Aldershot", "Fleet", "Send", "Ripley", "Pyrford"].map(town => (
              <span key={town} style={{ background: "#EDE6D4", border: "1px solid rgba(139,105,20,0.2)", padding: "6px 16px", borderRadius: "50px", fontSize: "0.85rem", color: "#5C3D1E", fontFamily: "'Playfair Display', serif" }}>
                {town}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── BOOKING CTA ── */}
      <section id="book" style={{ padding: "96px 24px", background: "linear-gradient(140deg, #1E3D0E 0%, #2D5A1A 55%, #3A7022 100%)", textAlign: "center", position: "relative", overflow: "hidden" }}>
        <LeafDecor style={{ position: "absolute", top: "-10px", left: "-8px", width: "110px", color: "#fff", opacity: 0.06, transform: "rotate(-5deg)" }} />
        <LeafDecor style={{ position: "absolute", bottom: "-10px", right: "-8px", width: "110px", color: "#fff", opacity: 0.06, transform: "scaleX(-1) rotate(-5deg)" }} />

        <div className="fade-up" style={{ position: "relative" }}>
          <LotusIcon size={80} color="#C4A45A" />
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontWeight: 300, fontSize: "clamp(2rem, 5vw, 3rem)", color: "#fff", marginTop: "8px", marginBottom: "16px" }}>
            Ready to restore & relax?
          </h2>
          <p style={{ fontSize: "1.1rem", color: "rgba(255,255,255,0.72)", maxWidth: "460px", margin: "0 auto 40px", lineHeight: 1.8, fontStyle: "italic" }}>
            Message me on WhatsApp to check availability and arrange your session. I'll come to you.
          </p>
          <a href="https://wa.me/[PHONE]" className="wa-btn" target="_blank" rel="noopener noreferrer" style={{ fontSize: "1.15rem", padding: "18px 44px" }}>
            <WaIcon size={26} /> Message on WhatsApp
          </a>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ background: "#111", padding: "40px 24px", textAlign: "center" }}>
        <LotusIcon size={44} color="#C4A45A" />
        <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontSize: "1.3rem", color: "#EDE6D4", marginTop: "10px", marginBottom: "6px" }}>
          Restore & Relax
        </p>
        <p style={{ fontSize: "0.7rem", letterSpacing: "3px", color: "#7A6B58", fontFamily: "'Playfair Display', serif", textTransform: "uppercase" }}>
          Massage Therapy by Iulia
        </p>
        <p style={{ marginTop: "22px", fontSize: "0.78rem", color: "#444", fontFamily: "'Playfair Display', serif" }}>
          Mobile / Home Visits · Travel fees included
        </p>
      </footer>
    </div>
  );
}
