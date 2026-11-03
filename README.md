# Fabulous Bakery (Fab Baker Boy) – concept mockup, React + Vite + GSAP + Lenis

## Run it
    npm install
    npm run dev        # http://localhost:5173
    npm run build      # creates /dist

## Deploy
- Cloudflare Pages: build command `npm run build`, output directory `dist`.
- GitHub Pages: upload the contents of `dist` (the build uses relative paths, so sub-folders work).

## Edit content
Menu, prices, reviews and photos are the arrays at the top of `src/App.jsx`. Photos live in `public/photos`.
Effects (SplitText, Magnet, SpotlightCard+tilt, Lenis) are in `src/fx.jsx`.
To use the official React Bits versions, install them from reactbits.dev and swap the imports in `App.jsx`.
