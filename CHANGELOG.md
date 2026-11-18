# Changelog

## 2.2.0 · New glossy G logo everywhere (2026-11-17)

### Brand assets
- Replaced every logo image with the new glossy 3D blue/red "G" supplied by the client. The white background was removed with a corner flood-fill (interior highlights untouched — the pixels are the original artwork, nothing redrawn), then trimmed.
- Regenerated from that master: hero mark `logo-g-hero.{png,webp,avif}` (256×229), header/footer marks `logo-mark-96.{webp,avif}` and `logo-mark-192.{webp,avif}`, `logo-full-600.png` (used by the structured data), `favicon-32.png`, `icon-192.png`, `apple-touch-icon.png` (180×180 on white, as Apple requires), the social card `og-image.jpg` (new G composited over the old one), and the app icon `public/favicon.png`.
- The new mark is slightly wider than tall (1200×1072 master), so the `width`/`height` attributes on the hero and brand images were updated (256×229, 44×39) to keep layout shift at zero.
- The 3D rotation, sheen and glow on the hero mark are unchanged and now play over the new artwork.

### Verification
- Lighthouse mobile (light): Performance 100, Accessibility 100, Best Practices 100, SEO 100. LCP 0.9s, CLS 0, TBT 60ms.
- Checked at 1440px and 375px: the G stays centred on the star, header and footer brands render the new mark, no console errors, no horizontal scroll.

## 2.1.0 · G mark on the hero star (2026-11-17)

### Hero
- The brand "G" now sits in the centre of the twin-star visual, directly on the star. It is decorative (`alt=""`, inside the `aria-hidden` visual), so it adds no accessibility or SEO surface.
- New clean asset for that spot: `assets/images/logo-g-hero.{png,webp,avif}`, cropped from the original 600px logo and downscaled to 256px so the edges stay smooth. Nothing was redrawn.
- The star glow behind it was widened and re-tinted (white core, cool outer falloff) so the four star points read around the mark instead of being covered by it.
- A soft glow and a thin gradient ring frame the mark; the mark itself breathes gently (scale only). The ring is static on purpose: animating it measured ~100ms more main-thread time, and a drop-shadow filter on the animated mark cost more again, so both were dropped.
- At 375px the "Your team" and "Our AI" labels moved to the top corners so they no longer cross the circle strokes; the logo stays pixel-centred on the star at 375, 768 and 1440.
- The app's own icon is now the G (`public/favicon.png`), replacing the template default.

## 2.0.0 · Twin Star / Aurora redesign (2026-11-17)

### Design
- New "Twin Star / Aurora" theme: two minds, one product. It uses paired orbs, mirrored layouts and a twin-circle divider.
- Brand palette as CSS variables (`--bg-deep`, `--bg-navy`, `--surface`, `--blue`, `--cyan`, `--violet`, `--gold`, …) and the signature gradient.
- Rhythm: dark hero, light content sections, dark AI CRM showcase, dark footer.
- Two font families only, self-hosted and preloaded: Montserrat (headings) and Inter (body). Both use `font-display: swap` with metric-matched fallbacks, so the font swap causes no layout shift.
- Glass cards with a 1px gradient border and soft inner glow, pill badges, a gradient primary button with glow, and a ghost secondary button.
- Dark/light theme toggle. It follows `prefers-color-scheme`, is saved in localStorage (try/catch), and is applied before first paint, so there's no flash.
- Spacing on an 8px scale, fluid `clamp()` type, 1240px max width. Responsive from 320px to 1920px with no horizontal scroll.
- The red accent (#D9262C) from v1 is replaced by the new palette. The logo is unchanged.

### Content and sections (existing copy kept)
- New: hero trust line, stats strip, process timeline, tech-stack marquee, 6 FAQs, a richer footer (logo, links, both offices, contact, socials) and a styled 404 page.
- The stats use facts already on the site: 6 service lines, 4 steps, 30-minute consultation, 2 offices.
- FAQ answers are written only from statements already on the site.
- All inline icons are SVG (one sprite). No emoji and no icon fonts.
- All ~300 inline `style` attributes moved into CSS.

### Effects (transform/opacity only; all off under `prefers-reduced-motion`)
1. Hero aurora: 3 drifting radial-gradient orbs (no `filter: blur`), a grid overlay and an SVG noise texture. Static on screens under 640px.
2. Twin-star SVG: two orbiting stars and a pulsing centre spark. A small version is reused as the divider.
3. Scroll reveal with one IntersectionObserver for the whole page. Content stays visible without JS: it's only hidden when the `.js` class is present.
4. Card hover lift and a cursor-following spotlight (rAF-throttled, fine pointers only).
5. Button shine sweep and an opacity-only glow pulse on the main CTA.
6. Header is transparent over the hero, then turns to glass with a bottom border. The active nav link follows the current section.
7. Stats counters animate once when they come into view.
8. Process timeline line draws with a CSS scroll-driven animation, with an IntersectionObserver fallback.
9. CSS-only tech marquee that pauses on hover.
10. Slow opacity shimmer on the hero keyword "thinks".
11. Smooth scrolling, cross-document view transitions, a view transition on theme change, a custom scrollbar and `::selection` colour.

### SEO
- New title (59 chars) and meta description (156 chars) targeting "AI development company Trichy", "AI CRM", "web application development Chennai", "AI chatbot development" and "workflow automation".
- Added canonical, meta robots, theme-color for both schemes, Open Graph and Twitter Card tags with absolute URLs, and a new 1200×630 `og-image.jpg`.
- JSON-LD `@graph`: Organization, two ProfessionalService entries (Trichy and Chennai), WebSite and WebPage, plus a FAQPage matching the visible FAQs word for word.
- Visible NAP block matching the structured data, with Google Maps direction links for both offices.
- Added `robots.txt`, `sitemap.xml` and `404.html` (noindex).
- Exactly one `<h1>`, a logical h2/h3 order, and header/nav/main/section/footer landmarks.

### Performance and accessibility
- Above-the-fold CSS is inlined. The rest loads without blocking (`dist/style.min.css`). JS is deferred, under 8 KB minified, with no libraries.
- Logos converted from PNG (500 KB + 230 KB) to AVIF/WebP (about 4–6 KB) with fixed width and height. Removed the third-party Google Fonts request.
- Non-urgent JS runs when the browser is idle. Removed `mix-blend-mode` on the noise layer and `text-wrap: pretty` because they cost mobile main-thread time.
- Added a skip link, visible focus rings, labelled fields with inline errors (`aria-invalid`, `aria-describedby`), an Escape-to-close mobile menu with `aria-expanded`, and `aria-hidden` on decorative effects. Tap targets are at least 48px.
- Contact form: inline validation, spam honeypot, and Formspree or WhatsApp sending from `site.config.js`.

### Verification (headless Chromium, Lighthouse 13.6, 3 runs each)
| Mode | Perf | A11y | Best practices | SEO | LCP | CLS |
|---|---|---|---|---|---|---|
| Mobile · light | 99–100 | 100 | 100 | 100 | 0.9 s | 0 |
| Mobile · dark | 100 | 100 | 100 | 100 | 0.9 s | 0 |
| Mobile · reduced motion | 99–100 | 100 | 100 | 100 | 0.9 s | 0 |
| Desktop · light | 100 | 100 | 100 | 100 | 0.3 s | 0 |
| Desktop · dark | 100 | 100 | 100 | 100 | 0.3 s | 0 |
| Desktop · reduced motion | 100 | 100 | 100 | 100 | 0.3 s | 0 |

Mobile TBT was 33–143 ms across runs. Desktop TBT was 0–7 ms.
The W3C Nu validator and html-validate report 0 errors on index.html and 404.html. JSON-LD parses, every `@id` reference resolves, and the FAQ data matches the visible text.
There were no console errors and no broken internal links or asset paths.
