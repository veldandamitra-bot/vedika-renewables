# Vedika Renewables — Website

**Energy for Generations.**

Official website for Vedika Renewables — a Hyderabad-based renewable energy company delivering solar panels, wind mills and BESS (battery energy storage) for homes, businesses, industries and organizations.

---

## Quick start

1. Upload all files inside this folder to the `public_html` directory of your Hostinger hosting account via the File Manager.
2. Your site is live immediately — no build step required.

---

## File structure

```
vedika-renewables/
├── index.html              ← Complete single-page website
├── assets/
│   ├── css/
│   │   ├── style.css       ← Main stylesheet
│   │   └── swiper-bundle.css
│   ├── js/
│   │   ├── main.js         ← Interactions, counter, filter, form
│   │   └── swiper-bundle.js
│   └── images/
│       ├── logo.png        ← Company logo (fallback)
│       ├── banner.png      ← Hero fallback image
│       └── project01-06.png, about01-03.png …
└── README.md
```

Primary images are loaded from Hostinger CDN (already hosted); local images are used as fallback via `onerror`.

---

## What to fill in before publishing

Search for these placeholders in `index.html` and replace:

| Placeholder | Replace with |
|---|---|
| `[Add phone number]` | Your actual phone number |
| `[Add email address]` | Your actual email address |
| `[Add working hours]` | e.g. Mon–Sat 9 AM – 6 PM |
| `[Project name — add your project]` | Real project names |
| `[Add system size]` | e.g. 500 kWp |
| `[Add location]` | Project location |
| `[Add figure]` | CO₂ reduction figure |
| `[Client name]` | Approved testimonial details |
| Social `href="#"` | Your LinkedIn, Instagram, X, YouTube URLs |

---

## Contact form

The form currently shows a simulated success state. To make it actually send emails, connect it to one of:

- **Formspree** (free tier): Change the form `action` attribute to your Formspree endpoint.
- **EmailJS**: Add EmailJS SDK and update `main.js` `onSubmit` handler.
- **Custom backend**: POST to your own API endpoint.

---

## Company details

- **Name:** Vedika Renewables
- **Tagline:** Energy for Generations.
- **Managing Director:** Krishna Karwa
- **Address:** 1-2-19,20 Domalguda, HimayatNagar, Hyderabad, Telangana – 500029
- **Domain:** vedikarenewables.in

---

## Technology

- Plain HTML5 / CSS3 / Vanilla JS — no framework, no build tool
- Fonts: Sora + Inter via Google Fonts CDN
- Icons: Font Awesome 6 via CDN
- Animations: AOS (Animate On Scroll) via CDN
- Images: Hostinger CDN + local fallback

&copy; 2026 Vedika Renewables. All rights reserved.
