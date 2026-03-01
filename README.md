# Currency Converter

A web-based currency converter built with Express and vanilla JavaScript.

The app serves a static UI from `public/index.html`, fetches live exchange rates from public APIs, caches rate data in the browser, and uses a service worker to cache static assets for faster repeat loads.

## Features

- Convert between many fiat/crypto currency codes.
- Live conversion using current exchange rates.
- Automatic conversion when amount/from/to changes.
- Input validation and user-facing status/error messages.
- API fallback strategy:
  - Primary: `open.er-api.com`
  - Fallback: `api.frankfurter.app`
- Browser-side rate caching:
  - In-memory cache
  - `localStorage` cache with 30-minute TTL
- Static asset caching with service worker (`public/sw.js`).

## Tech Stack

- Node.js + Express 4
- Pug (default Express scaffold views)
- Vanilla JavaScript on the client
- Bootstrap 4 (UI styling)

## Project Structure

```text
.
├── app.js                         # Express app setup and middleware
├── server.js                      # Server entrypoint (used by npm start)
├── package.json
├── public/
│   ├── index.html                 # Main converter page
│   ├── js/
│   │   ├── currency-converter.js  # Main converter logic
│   │   └── index.js               # Legacy no-op file
│   ├── sw.js                      # Service worker for static asset caching
│   ├── css/landing-page.css
│   └── vendor/                    # Frontend dependencies
├── routes/                        # Express scaffold routes (mostly unused by UI)
└── views/                         # Express scaffold views/error templates
```

## Prerequisites

- Node.js (recommended: latest LTS)
- npm

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

3. Start the app:

```bash
npm start
```

4. Open in your browser:

```text
http://localhost:3000
```

## Available Scripts

- `npm start`: runs the Express server via `server.js`.

## Runtime Behavior

### Conversion Flow

1. User enters amount/selects currencies in `public/index.html`.
2. `public/js/currency-converter.js` validates input.
3. App reads rate cache (`inMemoryCache` then `localStorage`).
4. If cache is stale/missing, app fetches live rates:
   - First attempt: `https://open.er-api.com/v6/latest/{BASE}`
   - Fallback: `https://api.frankfurter.app/latest?from={BASE}`
5. Result is formatted with `Intl.NumberFormat` and displayed in `#result`.

### Client-Side Rate Cache

- Key: `currency-converter-rates-v1` in `localStorage`.
- TTL: 30 minutes per base currency.
- Also de-duplicates in-flight requests for the same base currency.

### Service Worker Cache

- File: `public/sw.js`
- Cache name: `currency-converter-static-v2`
- Caches app shell assets (HTML/CSS/JS/images/vendor files).
- Strategy: cache-first with background network refresh for same-origin GET requests.
- Old service worker caches are removed during activation.

## Notes for Developers

- Static files in `public/` are served by `express.static(...)` in `app.js`.
- Express routes under `routes/` are scaffold leftovers and not central to converter logic.
- Main converter implementation is browser-side (`public/js/currency-converter.js`).
- `node_modules/` and `bin/` are intentionally ignored and not tracked in Git.

## Troubleshooting

- App not loading dependencies:
  - Run `npm install` again.
- Conversion fails or shows network message:
  - Check internet connection.
  - Public exchange-rate APIs may be temporarily unavailable/rate-limited.
- UI appears stale after updates:
  - Clear site data or unregister the service worker in browser devtools, then hard refresh.
- Port already in use:
  - Start with a different port:
    - macOS/Linux: `PORT=4000 npm start`
    - Windows (PowerShell): `$env:PORT=4000; npm start`

## Deployment

- The app listens on `process.env.PORT` (default `3000`).
- Suitable for basic Node hosting (Render, Railway, Fly.io, Heroku-style platforms, VPS).
- Ensure outbound network access for currency APIs from client browsers.

## License

ISC
