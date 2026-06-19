import { useEffect } from "react";

const SITE_URL = "https://quaydale.github.io/restore-relax/";

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "HealthAndBeautyBusiness",
      "@id": `${SITE_URL}#business`,
      "name": "Restore & Relax",
      "alternateName": "Restore & Relax by Iulia",
      "description": "Professional mobile massage therapy delivered to your home across Woking and Surrey. Specialising in Sports, Deep Tissue, Swedish, Pregnancy, Manual Lymphatic Drainage and Oncology massage.",
      "url": SITE_URL,
      "priceRange": "££",
      "currenciesAccepted": "GBP",
      "areaServed": {
        "@type": "GeoCircle",
        "geoMidpoint": { "@type": "GeoCoordinates", "latitude": 51.3193, "longitude": -0.5566 },
        "geoRadius": "16093"
      },
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Woking",
        "addressRegion": "Surrey",
        "addressCountry": "GB"
      },
      "geo": { "@type": "GeoCoordinates", "latitude": 51.3193, "longitude": -0.5566 },
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": "Massage Therapy Services",
        "itemListElement": [
          { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Sports Massage" }, "price": "70", "priceCurrency": "GBP" },
          { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Deep Tissue Massage" }, "price": "70", "priceCurrency": "GBP" },
          { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Swedish Massage" }, "price": "70", "priceCurrency": "GBP" },
          { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Pregnancy Massage" }, "price": "70", "priceCurrency": "GBP" },
          { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Manual Lymphatic Drainage" }, "price": "70", "priceCurrency": "GBP" },
          { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Oncology Massage" }, "price": "60", "priceCurrency": "GBP" }
        ]
      }
    },
    {
      "@type": "FAQPage",
      "@id": `${SITE_URL}#faq`,
      "mainEntity": [
        { "@type": "Question", "name": "Where does Restore & Relax provide massage therapy?", "acceptedAnswer": { "@type": "Answer", "text": "Restore & Relax is a mobile massage service based in Woking, Surrey, covering a 10 mile radius including Guildford, Camberley, Weybridge, Cobham, Leatherhead, Byfleet and surrounding villages." } },
        { "@type": "Question", "name": "How much does a massage cost?", "acceptedAnswer": { "@type": "Answer", "text": "Prices start from £60 for a 60-minute Oncology Massage. Most treatments are £70 for 60 minutes and £100 for 90 minutes. All prices include travel fees." } },
        { "@type": "Question", "name": "How do I book a massage?", "acceptedAnswer": { "@type": "Answer", "text": "The easiest way to book is via WhatsApp. Simply message Iulia to check availability and arrange a convenient time. She will come to your home." } },
        { "@type": "Question", "name": "What types of massage are available?", "acceptedAnswer": { "@type": "Answer", "text": "Iulia offers Sports Massage, Deep Tissue Massage, Swedish Massage, Pregnancy Massage, Manual Lymphatic Drainage and Oncology Massage. All sessions are tailored to your individual needs." } },
        { "@type": "Question", "name": "Do I need to travel to a clinic?", "acceptedAnswer": { "@type": "Answer", "text": "No. Restore & Relax is a fully mobile service. Iulia comes to your home with all the equipment needed. Travel fees are included in the treatment price." } },
        { "@type": "Question", "name": "Is pregnancy massage safe?", "acceptedAnswer": { "@type": "Answer", "text": "Yes. Iulia is trained in prenatal massage and uses specially adapted techniques and positioning that are safe throughout all trimesters." } }
      ]
    }
  ]
};

export default function SeoHead() {
  useEffect(() => {
    // Canonical
    if (!document.querySelector('link[rel="canonical"]')) {
      const link = document.createElement("link");
      link.rel = "canonical";
      link.href = SITE_URL;
      document.head.appendChild(link);
    }

    // JSON-LD
    if (!document.querySelector('script[data-seo="restore-relax"]')) {
      const script = document.createElement("script");
      script.type = "application/ld+json";
      script.setAttribute("data-seo", "restore-relax");
      script.textContent = JSON.stringify(jsonLd);
      document.head.appendChild(script);
    }
  }, []);

  return null;
}
