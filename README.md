# Gemini Digital Solution · Website

A static website in plain HTML, CSS and JavaScript. You don't need a build step or any installs to run it.
Theme: **Twin Star / Aurora**: two minds, one product (your team + AI).

## Files
| Path | What it is |
|---|---|
| `index.html` | The home page. Above-the-fold CSS is inlined in `<style id="critical">`. |
| `404.html` | Styled "page not found" page (`noindex`). |
| `site.config.js` | **The one place for email, phone, WhatsApp, form endpoint and social links.** |
| `css/critical.css` | Source for the inlined above-the-fold CSS (tokens, header, hero, stats). |
| `css/style.css` | Source for the rest of the styles. |
| `js/main.js` | Source for all behaviour (theme, menu, reveal, counters, form). |
| `dist/style.min.css`, `dist/main.min.js` | Minified files the pages actually load. |
| `assets/fonts/` | Self-hosted Montserrat and Inter (variable, latin, WOFF2). |
| `assets/images/` | Logo (AVIF/WebP), favicons, `og-image.jpg` (1200×630), `logo-full-600.png` (for Google). |
| `robots.txt`, `sitemap.xml` | Crawling files. |
| `tools/build.mjs` | Optional: re-minifies after you edit `css/` or `js/`. |
| `tools/og-template.html` | Source used to render `og-image.jpg`. |

## Preview
Open `index.html` in a browser, or for a production-like preview run `python3 -m http.server` in this folder and open http://localhost:8000.

## Contact details (single config location)
Open **`site.config.js`** and fill in:
- `email`, `phone`, `whatsapp`
- `formEndpoint` (e.g. a Formspree URL) to receive enquiries by email
- `social.linkedin`, `instagram`, `facebook`, `x`, `youtube`

Empty values stay hidden on the site. When you fill them in, they appear in the contact block and footer, and the structured data (JSON-LD) is updated with the same phone, email and social links.

**Contact form behaviour:** with `formEndpoint` set, the form posts there. With only `whatsapp` set, the enquiry opens in WhatsApp. With neither set, the visitor only sees a thank-you message and **nothing is sent**.

## Go-live
See GO-LIVE.md for the full checklist (domain, email/phone, form, Search Console, Google Business Profile).

## Domain: every place to change `https://www.example.com`
Search and replace `https://www.example.com` with your real domain (no trailing slash) in:
1. `index.html`: `<link rel="canonical">`
2. `index.html`: `og:url`
3. `index.html`: `og:image`
4. `index.html`: `twitter:image`
5. `index.html`: JSON-LD `@graph` (all `@id`, `url`, `logo` and `image` values). index.html has 27 occurrences in total.
6. `robots.txt`: `Sitemap:` line
7. `sitemap.xml`: `<loc>`

Check with: `grep -rn "example.com" --include=*.html --include=*.txt --include=*.xml .` (should return nothing afterwards).

## Editing styles or scripts
The pages load the minified files in `dist/`. After you edit `css/*.css` or `js/main.js`:
```
npm install      # once, installs esbuild
npm run build    # refreshes dist/ and re-inlines css/critical.css into index.html and 404.html
```
`site.config.js` is never minified, so you can edit it without rebuilding.

## Hosting
Upload the whole folder (keep the structure) to the web root of any static host: Hostinger, GoDaddy or cPanel (`public_html`), Netlify, Vercel, Cloudflare Pages or GitHub Pages.
- Set `404.html` as the custom error page. Netlify, Cloudflare Pages and GitHub Pages do this automatically. On Apache, add `ErrorDocument 404 /404.html` to `.htaccess`.
- 404.html uses root-relative paths (`/assets/...`), so the site must sit at the domain root.
- Optional: enable gzip/brotli and long cache headers for `/assets/` and `/dist/`.
