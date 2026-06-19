import { useEffect, useRef } from "react";

export default function PrivacyPolicy({ onClose }: { onClose: () => void }) {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    closeRef.current?.focus();
    document.body.style.overflow = "hidden";
    const handler = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", handler);
    return () => { document.removeEventListener("keydown", handler); document.body.style.overflow = ""; };
  }, []);

  const section = (title: string, children: React.ReactNode) => (
    <div style={{ marginBottom: "28px" }}>
      <p style={{ fontSize: "0.7rem", letterSpacing: "3px", color: "#8B6914", fontFamily: "'Playfair Display', serif", textTransform: "uppercase", marginBottom: "8px" }}>{title}</p>
      <div style={{ fontSize: "1rem", color: "#5C3D1E", lineHeight: 1.8, fontFamily: "'Cormorant Garamond', serif", fontWeight: 300 }}>{children}</div>
    </div>
  );

  return (
    <div
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="privacy-title"
      style={{ position: "fixed", inset: 0, zIndex: 600, background: "rgba(10,25,5,0.7)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{ background: "#fff", maxWidth: "600px", width: "100%", maxHeight: "88vh", overflowY: "auto", borderRadius: "3px", padding: "48px 40px", position: "relative", boxShadow: "0 24px 80px rgba(0,0,0,0.25)" }}
      >
        <button ref={closeRef} onClick={onClose} aria-label="Close privacy policy" style={{ position: "absolute", top: "12px", right: "12px", background: "none", border: "none", cursor: "pointer", color: "#7A6B58", fontSize: "1.4rem", padding: "8px 12px", minWidth: "44px", minHeight: "44px" }}>×</button>

        <div style={{ width: "24px", height: "1px", background: "#C4A45A", marginBottom: "16px" }} />
        <h2 id="privacy-title" style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.5rem", color: "#1E3D0E", fontWeight: 500, marginBottom: "6px" }}>Privacy Policy</h2>
        <p style={{ fontSize: "0.85rem", color: "#aaa", fontFamily: "'Playfair Display', serif", marginBottom: "32px" }}>Restore & Relax by Iulia · Last updated June 2026</p>

        {section("Who we are", <p>Restore & Relax is a sole-trader mobile massage therapy business operated by Iulia, based in Woking, Surrey. This policy explains what personal data we collect through this website and how we use it.</p>)}

        {section("What data we collect", <>
          <p style={{ marginBottom: "10px" }}>When you submit a review through this website we collect:</p>
          <ul style={{ paddingLeft: "20px", display: "flex", flexDirection: "column", gap: "6px" }}>
            <li>Your <strong>name</strong> (as you choose to provide it — a first name or initials is fine)</li>
            <li>Your <strong>star rating</strong> (1–5 stars)</li>
            <li>Your <strong>review text</strong></li>
            <li>The <strong>date and time</strong> of submission</li>
          </ul>
          <p style={{ marginTop: "10px" }}>We do not collect your email address, phone number, IP address or any other identifying information through the review form.</p>
        </>)}

        {section("How we use it", <p>Your review and name are displayed publicly on this website so that other visitors can read about client experiences. We do not use your data for marketing, share it with third parties, or use it for any purpose beyond displaying it on this site.</p>)}

        {section("Where it is stored", <p>Review data is stored securely in a database provided by <strong>Supabase</strong> (Supabase Inc.), hosted in the <strong>United Kingdom</strong> (London, eu-west-2 region). Supabase is GDPR-compliant and does not use your data for its own purposes. You can read their privacy policy at <a href="https://supabase.com/privacy" target="_blank" rel="noopener noreferrer" style={{ color: "#4A6741" }}>supabase.com/privacy</a>.</p>)}

        {section("How long we keep it", <p>Reviews are kept for as long as this website is active. If you would like your review removed, please contact us via WhatsApp and we will delete it within 5 working days.</p>)}

        {section("Your rights", <>
          <p style={{ marginBottom: "10px" }}>Under UK GDPR you have the right to:</p>
          <ul style={{ paddingLeft: "20px", display: "flex", flexDirection: "column", gap: "6px" }}>
            <li><strong>Access</strong> the personal data we hold about you</li>
            <li><strong>Rectify</strong> inaccurate data</li>
            <li><strong>Erase</strong> your data ("right to be forgotten")</li>
            <li><strong>Object</strong> to processing</li>
          </ul>
          <p style={{ marginTop: "10px" }}>To exercise any of these rights, please message us on WhatsApp.</p>
        </>)}

        {section("Legal basis", <p>We process your review data on the basis of your <strong>consent</strong>, given when you tick the consent checkbox and submit the review form. You may withdraw consent at any time by requesting removal of your review.</p>)}

        {section("Contact", <p>If you have any questions about this policy or how your data is handled, please get in touch via WhatsApp. You also have the right to lodge a complaint with the <a href="https://ico.org.uk" target="_blank" rel="noopener noreferrer" style={{ color: "#4A6741" }}>Information Commissioner's Office (ICO)</a>.</p>)}
      </div>
    </div>
  );
}
