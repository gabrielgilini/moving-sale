# Moving Sale Static Site

A production-ready static site for listing items for sale, built with Astro, Tailwind CSS, and Fuse.js. Optimized for self-managed Ubuntu + Nginx deployment.

## Features
- Static output, no server runtime required
- Sleek, modern, minimalistic UI
- Home page: sticky search bar, responsive image-first grid
- Client-side fuzzy search (Fuse.js)
- Category filter
- Sort by price (ascending/descending)
- Item detail pages with gallery
- Dark mode (class-based)
- Accessible markup
- Deterministic build, easy to deploy

## Project Structure
```
/src/
  /pages/
    index.astro
    item/[id].astro
  /components/
    SearchBar.astro
    ItemCard.astro
    Filters.astro
  /lib/
    items.ts
    searchIndex.ts
/data/items.csv
/public/images/items/ (SVG placeholders)
/public/search-index.json
/public/search.js
astro.config.mjs, tailwind.config.js, postcss.config.js, tsconfig.json
```

## Setup
1. Install Node.js (v18+ recommended)
2. Clone repo and run:
   ```bash
   npm install
   npm run build
   npm run preview
   ```
3. Edit `/data/items.csv` to add your items. See sample for format.
4. Add images to `/public/images/items/` (SVG, PNG, JPG supported).

## CSV Format
Required columns:
- id (string, unique, url-safe)
- title
- price (number; blank = "Make offer")
- currency (e.g., CZK, EUR)
- category
- condition
- description
- image (path to primary image in /public)

Optional columns:
- images (semicolon-separated list)
- location
- reserved (true/false)
- sold (true/false)
- featured (true/false)
- updatedAt (ISO date)
- tags (semicolon-separated)

Items with `sold=true` are excluded from the main list. Reserved items show a badge.

## Build & Deploy
- Build: `npm ci && npm run build`
- Output: `/dist` (static)
- Deploy: copy `/dist` to `/var/www/<site>`

### Nginx Example
```
server {
  listen 80;
  server_name yourdomain.com;
  root /var/www/<site>/dist;

  location / {
    try_files $uri $uri/ =404;
  }

  location ~* \.(?:jpg|jpeg|gif|png|svg|ico|webp)$ {
    expires 30d;
    add_header Cache-Control "public, immutable";
  }

  gzip on;
  gzip_types text/css application/javascript image/svg+xml;
}
```

- For HTTPS: use [Let’s Encrypt](https://letsencrypt.org/) (see their docs)
- For optimal performance, enable gzip/brotli and set cache headers for images/assets

## Accessibility & Best Practices
- All inputs have labels
- Responsive images
- Dark mode toggle via Tailwind class
- Error messages for malformed CSV

## Scripts
- `dev`: Start local dev server
- `build`: Build static site & search index
- `preview`: Preview production build
- `lint`: Lint code (optional)
- `format`: Format code (optional)

## License
MIT
