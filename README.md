# Restore & Relax by Iulia

Website for **Restore & Relax**, a mobile massage therapy business based in Woking, Surrey, UK.

**Live site:** https://quaydale.github.io/restore-relax/

---

## Services

| Treatment | 60 min | 90 min |
|---|---|---|
| Sports Massage | £70 | £100 |
| Deep Tissue Massage | £70 | £100 |
| Swedish Massage | £70 | £100 |
| Pregnancy Massage | £70 | £100 |
| Manual Lymphatic Drainage | £70 | £100 |
| Oncology Massage | £60 | — |

Covers a 10-mile radius from Woking including Guildford, Camberley, Weybridge, Cobham, Leatherhead, Byfleet, Farnborough and Aldershot.

---

## Tech stack

- **React 18 + TypeScript + Vite** — development
- **Parcel** — production bundle (single self-contained output in `docs/`)
- **Tailwind CSS** — utility classes
- **Leaflet + react-leaflet** — interactive coverage map (OpenStreetMap tiles)
- **Supabase** — reviews database (London region, public read/insert)
- **GitHub Pages** — hosting from `docs/` on `main` branch
- **Self-hosted fonts** — Cormorant Garamond + Playfair Display (no Google CDN)

---

## Local development

```bash
pnpm install
pnpm dev          # Vite dev server at http://localhost:5173
```

## Building for production

```bash
npx parcel build index.html --dist-dir bundle-out --public-url "./"
cp bundle-out/* docs/
```

Then commit and push `docs/` — GitHub Pages deploys automatically.

---

## Git workflow

- `main` — production branch, GitHub Pages serves from `docs/`
- `dev` — development branch; open a PR to merge into `main`

---

## Things to personalise

- **WhatsApp number** — replace `[PHONE]` in `src/App.tsx` (3 occurrences) with Iulia's number in international format, e.g. `447911123456`
- **Hero image** — swap `src/assets/hero-bg.jpg` with Iulia's own photography (rebuild after replacing)
- **About copy** — update the bio text in `src/App.tsx` (About section)
- **Opening hours** — update the `openingHoursSpecification` in `index.html` JSON-LD if hours differ from 08:00–20:00
- **Phone in structured data** — fill in `"telephone": ""` in `index.html` once the number is confirmed
