/* =====================================================================
   Gemini Digital Solution · site behaviour (no libraries)
   Source file. Minified copy: dist/main.min.js (run: node tools/build.mjs)
   Contact details & form endpoint live in /site.config.js.
   ===================================================================== */
(function () {
  "use strict";
  var d = document, root = d.documentElement, w = window;
  var CFG = w.SITE_CONFIG || {};
  var mq = function (q) { return w.matchMedia && w.matchMedia(q).matches; };
  var reduced = mq("(prefers-reduced-motion: reduce)");
  var $ = function (s, c) { return (c || d).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || d).querySelectorAll(s)); };

  /* ---------- 1. Fill contact details from site.config.js ---------- */
  function digits(v) { return String(v || "").replace(/[^\d+]/g, ""); }
  var social = CFG.social || {};
  $$("[data-site]").forEach(function (el) {
    var key = el.getAttribute("data-site"), val = "", href = "";
    if (key === "email") { val = CFG.email; href = "mailto:" + val; }
    else if (key === "phone") { val = CFG.phone; href = "tel:" + digits(val); }
    else if (key === "whatsapp") { val = CFG.whatsapp; href = "https://wa.me/" + digits(val).replace("+", ""); }
    else if (key.indexOf("social-") === 0) { val = social[key.slice(7)]; href = val; }
    var wrap = el.closest("[data-site-wrap]") || el;
    if (!val) { wrap.hidden = true; return; }
    wrap.hidden = false;
    if (el.tagName === "A") el.href = href;
    if (el.hasAttribute("data-site-text")) el.textContent = val;
  });
  // Keep structured data in step with the visible NAP block.
  var ld = d.getElementById("ld-org");
  if (ld && (CFG.email || CFG.phone || Object.keys(social).length)) {
    try {
      var data = JSON.parse(ld.textContent), same = [];
      Object.keys(social).forEach(function (k) { if (social[k]) same.push(social[k]); });
      (data["@graph"] || []).forEach(function (n) {
        if (!/Organization|ProfessionalService/.test(n["@type"])) return;
        if (CFG.phone) n.telephone = CFG.phone;
        if (CFG.email) n.email = CFG.email;
        if (same.length && n["@type"] === "Organization") n.sameAs = same;
      });
      ld.textContent = JSON.stringify(data);
    } catch (e) { /* leave original JSON-LD */ }
  }
  $$("[data-year]").forEach(function (el) { el.textContent = new Date().getFullYear(); });

  /* ---------- 2. Theme toggle (saved, no flash: initial theme set inline in <head>) ---------- */
  var toggle = $(".theme-toggle");
  function setTheme(t, save) {
    root.setAttribute("data-theme", t);
    if (toggle) toggle.setAttribute("aria-label", t === "dark" ? "Switch to light theme" : "Switch to dark theme");
    if (save) { try { localStorage.setItem("gds-theme", t); } catch (e) {} }
  }
  if (toggle && root.getAttribute("data-theme") === "dark") toggle.setAttribute("aria-label", "Switch to light theme");
  if (toggle) toggle.addEventListener("click", function () {
    var next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    if (d.startViewTransition && !reduced) d.startViewTransition(function () { setTheme(next, true); });
    else setTheme(next, true);
  });
  if (w.matchMedia) {
    var sys = w.matchMedia("(prefers-color-scheme: dark)");
    var onSys = function (e) {
      var saved = null; try { saved = localStorage.getItem("gds-theme"); } catch (er) {}
      if (!saved) setTheme(e.matches ? "dark" : "light", false);
    };
    sys.addEventListener ? sys.addEventListener("change", onSys) : sys.addListener(onSys);
  }

  /* ---------- 3. Header: glass after scroll + mobile menu ---------- */
  var header = $(".site-header"), menuBtn = $(".menu-toggle"), nav = $("#primary-nav");
  var hero = $(".hero");
  if (header && "IntersectionObserver" in w) {
    var sentinel = d.createElement("div");
    sentinel.setAttribute("aria-hidden", "true");
    sentinel.style.cssText = "position:absolute;top:0;left:0;width:1px;height:" + (hero ? 120 : 8) + "px;pointer-events:none";
    d.body.prepend(sentinel);
    new IntersectionObserver(function (en) {
      header.classList.toggle("is-scrolled", !en[0].isIntersecting);
    }).observe(sentinel);
    if (!hero) header.classList.add("is-scrolled");
  }
  function closeMenu(focusBtn) {
    if (!header.classList.contains("nav-open")) return;
    header.classList.remove("nav-open");
    menuBtn.setAttribute("aria-expanded", "false");
    menuBtn.setAttribute("aria-label", "Open menu");
    if (focusBtn) menuBtn.focus();
  }
  if (menuBtn && nav) {
    menuBtn.addEventListener("click", function () {
      var open = !header.classList.contains("nav-open");
      header.classList.toggle("nav-open", open);
      menuBtn.setAttribute("aria-expanded", String(open));
      menuBtn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
      if (open) { var f = $("a", nav); if (f) f.focus(); }
    });
    nav.addEventListener("click", function (e) { if (e.target.closest("a")) closeMenu(false); });
    d.addEventListener("keydown", function (e) { if (e.key === "Escape") closeMenu(true); });
    d.addEventListener("click", function (e) { if (!header.contains(e.target)) closeMenu(false); });
  }

  if (!("IntersectionObserver" in w)) { $$(".reveal").forEach(function (el) { el.classList.add("is-in"); }); return; }
  // Non-urgent enhancements run when the main thread is idle (keeps TBT near zero).
  (w.requestIdleCallback || function (f) { return setTimeout(f, 1); })(enhance, { timeout: 800 });
  function enhance() {

  /* ---------- 4. One observer for reveal, counters and the timeline ---------- */
  function runCounter(el) {
    var end = parseFloat(el.getAttribute("data-count")) || 0;
    if (reduced) { el.textContent = end; return; }
    var t0 = null, dur = 1400;
    el.textContent = "0";
    (function step(t) {
      if (t0 === null) t0 = t;
      var p = Math.min((t - t0) / dur, 1);
      el.textContent = Math.round(end * (1 - Math.pow(1 - p, 3)));
      if (p < 1) w.requestAnimationFrame(step);
    })(performance.now());
  }
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (!en.isIntersecting) return;
      var el = en.target;
      el.classList.add("is-in");
      if (el.hasAttribute("data-count")) runCounter(el);
      if (el.classList.contains("timeline")) el.classList.add("is-drawn");
      io.unobserve(el);
    });
  }, { rootMargin: "0px 0px -8% 0px", threshold: 0.12 });
  $$(".reveal, [data-count], .timeline").forEach(function (el) { io.observe(el); });

  /* ---------- 5. Active nav link follows the current section ---------- */
  var links = $$('.nav-list a[href^="#"]'), map = {};
  links.forEach(function (a) { var s = d.getElementById(a.getAttribute("href").slice(1)); if (s) map[s.id] = a; });
  var navIo = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      var a = map[en.target.id]; if (!a) return;
      if (en.isIntersecting) {
        links.forEach(function (l) { l.removeAttribute("aria-current"); });
        a.setAttribute("aria-current", "true");
      } else if (a.getAttribute("aria-current")) a.removeAttribute("aria-current");
    });
  }, { rootMargin: "-45% 0px -50% 0px" });
  Object.keys(map).forEach(function (id) { navIo.observe(d.getElementById(id)); });

  /* ---------- 6. Card spotlight (fine pointers only, rAF-throttled) ---------- */
  if (!reduced && mq("(hover: hover) and (pointer: fine)")) {
    var pending = null, frame = 0;
    d.addEventListener("pointermove", function (e) {
      var card = e.target.closest && e.target.closest(".card");
      if (!card) return;
      pending = { c: card, x: e.clientX, y: e.clientY };
      if (!frame) frame = w.requestAnimationFrame(function () {
        frame = 0;
        var r = pending.c.getBoundingClientRect();
        pending.c.style.setProperty("--mx", (pending.x - r.left) + "px");
        pending.c.style.setProperty("--my", (pending.y - r.top) + "px");
      });
    }, { passive: true });
  }
  }
})();

/* ---------- 7. Contact form: inline validation + sending ---------- */
(function () {
  "use strict";
  var d = document, form = d.getElementById("contact-form");
  if (!form) return;
  var CFG = window.SITE_CONFIG || {};
  var thanks = d.getElementById("form-thanks"), nameOut = d.getElementById("thanks-name");
  var status = d.getElementById("form-status"), btn = form.querySelector('button[type="submit"]');
  var btnLabel = btn ? btn.innerHTML : "";
  form.setAttribute("novalidate", "");

  var rules = {
    name: function (v) { return v.length >= 2 ? "" : "Please enter your name."; },
    email: function (v) { return !v ? "Please enter your email address." : /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v) ? "" : "That email address doesn't look right. Example: name@company.com"; },
    phone: function (v) { return !v || /^[+\d][\d\s()-]{6,}$/.test(v) ? "" : "Please enter a valid phone number, or leave it empty."; },
    message: function (v) { return v.length >= 10 ? "" : "Please tell us a little about your project (at least 10 characters)."; }
  };
  function check(input, show) {
    var fn = rules[input.name]; if (!fn) return true;
    var msg = fn(input.value.trim()), err = d.getElementById(input.id + "-error"), field = input.closest(".field");
    if (show) {
      input.setAttribute("aria-invalid", msg ? "true" : "false");
      if (err) err.textContent = msg;
      field.classList.toggle("is-valid", !msg && !!input.value.trim());
    }
    return !msg;
  }
  Object.keys(rules).forEach(function (n) {
    var input = form.elements[n]; if (!input) return;
    input.addEventListener("blur", function () { if (input.value.trim() || input.getAttribute("aria-invalid")) check(input, true); });
    input.addEventListener("input", function () { if (input.getAttribute("aria-invalid") === "true") check(input, true); });
  });

  function showThanks(name) {
    nameOut.textContent = (name || "there").split(" ")[0];
    form.hidden = true; thanks.hidden = false;
    thanks.focus();
  }
  function busy(on) { btn.disabled = on; btn.innerHTML = on ? "Sending…" : btnLabel; }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    status.textContent = "";
    var firstBad = null;
    Object.keys(rules).forEach(function (n) {
      var input = form.elements[n];
      if (input && !check(input, true) && !firstBad) firstBad = input;
    });
    if (firstBad) { firstBad.focus(); status.textContent = "Please fix the highlighted fields."; return; }

    var data = new FormData(form), name = String(data.get("name") || "").trim();
    if (String(data.get("website") || "")) { showThanks(name); return; } // spam trap
    data.delete("website");

    if (CFG.formEndpoint) {
      busy(true);
      fetch(CFG.formEndpoint, { method: "POST", body: data, headers: { Accept: "application/json" } })
        .then(function (r) { if (!r.ok) throw new Error(r.status); showThanks(name); form.reset(); })
        .catch(function () { status.textContent = "Sorry, your message could not be sent. Please call or email us instead."; })
        .then(function () { busy(false); });
      return;
    }
    if (CFG.whatsapp) {
      var text = "New enquiry – Gemini Digital Solution\nName: " + name + "\nCompany: " + data.get("company") +
        "\nEmail: " + data.get("email") + "\nPhone: " + data.get("phone") + "\nNeed: " + data.get("type") +
        "\nMessage: " + data.get("message");
      window.open("https://wa.me/" + String(CFG.whatsapp).replace(/\D/g, "") + "?text=" + encodeURIComponent(text), "_blank", "noopener");
    }
    showThanks(name);
  });

  d.getElementById("form-reset").addEventListener("click", function () {
    form.reset();
    Array.prototype.forEach.call(form.querySelectorAll("[aria-invalid]"), function (i) { i.removeAttribute("aria-invalid"); });
    Array.prototype.forEach.call(form.querySelectorAll(".is-valid"), function (f) { f.classList.remove("is-valid"); });
    Array.prototype.forEach.call(form.querySelectorAll(".field-error"), function (f) { f.textContent = ""; });
    thanks.hidden = true; form.hidden = false;
    form.elements.name.focus();
  });
})();
