# Currency Converter

A precision foreign exchange web utility built with vanilla JavaScript, modern layered CSS, and Express.

**Live Demo:** [https://azeezbello.github.io/currency_converter/](https://azeezbello.github.io/currency_converter/)

## Features

- Convert between 155+ world currencies with full currency names and ISO codes.
- Instant 1-click currency pair swap (`#swap-btn`), quick-amount presets, and popular corridor shortcuts.
- Live benchmark cross-rates reference board updated automatically from the active base currency.
- Direct and inverse unit spot rate breakdown in tabular numerals (`tabular-nums`).
- Dual-API fallback strategy:
  - Primary: `open.er-api.com`
  - Fallback: `api.frankfurter.app`
- Browser-side rate caching (`inMemoryCache` + `localStorage` with a 30-minute TTL).
- Offline app-shell caching with Service Worker (`sw.js` / `public/sw.js`).
- Adaptive light/dark theme (`prefers-color-scheme`) and Windows High Contrast (`forced-colors`) support.

## Project Structure

```text
.
├── index.html                     # Root entrypoint for GitHub Pages branch deployment
├── sw.js                          # Root service worker for GitHub Pages branch deployment
├── .nojekyll                      # Disables Jekyll processing on GitHub Pages
├── app.js                         # Express static server configuration
├── server.js                      # HTTP server entrypoint (used by npm start)
├── package.json
└── public/
    ├── index.html                 # Static entrypoint served by Express / GitHub Actions
    ├── sw.js                      # Service worker for static asset caching
    ├── manifest.json              # Web app manifest
    ├── favicon.png
    ├── css/
    │   └── landing-page.css       # Layered design tokens and Editorial Swiss FX styles
    └── js/
        └── currency-converter.js  # Core converter, cross-rates board, API fallback, and caching
```

## Getting Started

1. Clone the repository:

```bash
git clone https://github.com/AzeezBello/currency_converter.git
cd currency_converter
```

2. Install dependencies:

```bash
npm install
```

3. Start the local server:

```bash
npm start
```

4. Open in your browser:

```text
http://localhost:3000
```

## License

ISC
