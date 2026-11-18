# Go-live checklist

## 1. Domain
- [ ] Replace `https://www.example.com` in `index.html`, `robots.txt` and `sitemap.xml` (README lists every spot).
- [ ] Pick one version (www or non-www, always https) and redirect the others to it at your host.
- [ ] Upload the folder to the domain root and set `404.html` as the error page.
- [ ] Open `https://yourdomain/robots.txt`, `/sitemap.xml` and a made-up URL, and check that the 404 page appears.

## 2. Email and phone (`site.config.js`)
These are still empty:
- [ ] `email`
- [ ] `phone`
- [ ] `whatsapp`
- [ ] `social.linkedin`, `social.instagram`, `social.facebook`, `social.x`, `social.youtube` (only the ones you use)

## 3. Contact form endpoint
- [ ] Create a form at formspree.io (or similar) and paste its URL into `formEndpoint`.
- [ ] Send a test enquiry and confirm it reaches your inbox.
- [ ] Until this is set, the form only shows a thank-you message and **sends nothing** (or opens WhatsApp if `whatsapp` is set).

## 4. Google Search Console
- [ ] Add the domain property and verify it with a DNS TXT record.
- [ ] Submit `https://yourdomain/sitemap.xml`.
- [ ] Use URL Inspection on the home page and click Request indexing.
- [ ] Run the home page through the Rich Results Test (search.google.com/test/rich-results) to check the Organization and LocalBusiness data.

## 5. Google Business Profile
- [ ] Create or claim one profile for each office: Trichy and Chennai.
- [ ] Use exactly the same name, address and phone as the website (NAP must match character for character).
- [ ] Set the category (e.g. "Software company"), hours, website URL, and photos of each office.
- [ ] Add the profile URLs to `social` in `site.config.js` if you want them linked.

## 6. Final checks
- [ ] Share the URL in WhatsApp or LinkedIn and check that the preview image appears (after changing the domain).
- [ ] Run PageSpeed Insights (pagespeed.web.dev) on the live URL.
- [ ] Optional: turn on gzip/brotli and long cache headers for `/assets/` and `/dist/` at your host.
