# Currency Converter

A fast, lightweight currency converter built with vanilla JavaScript and Express.

**Live Demo:** [https://azeezbello.github.io/currency_converter/](https://azeezbello.github.io/currency_converter/)

## Features

- Convert between 155+ world currencies.
- Live conversion with automatic debounce on input/currency selection.
- Dual-API fallback strategy:
  - Primary: `open.er-api.com`
  - Fallback: `api.frankfurter.app`
- Browser-side rate caching (`inMemoryCache` + `localStorage` with a 30-minute TTL).
- Offline app-shell caching with Service Worker (`sw.js` / `public/sw.js`).

## Tech Stack

- Vanilla JavaScript (ES2017+)
- Bootstrap 4 & Font Awesome 4 (CSS only)
- Node.js + Express 4 (for local development/Node hosting)

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
    ├── css/
    │   └── landing-page.css       # Custom layout styles
    ├── img/
    │   ├── bg-masthead.jpg        # Masthead background image
    │   └── favicon.png
    ├── js/
    │   └── currency-converter.js  # Core converter, API fallback, and caching logic
    └── vendor/                    # Minified Bootstrap and Font Awesome CSS/fonts
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
