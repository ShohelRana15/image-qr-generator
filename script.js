// QR Hub v7 — real QR engine, scanner, history, templates, settings, i18n, notifications, voice search.
const CFG = { url: "https://vbufbeaktxvcxfcskyhr.supabase.co", key: "sb_publishable_HD8afj98r3io1rI-qRNVOw__JgSxR87", bucket: "images" };
const $ = (s) => document.querySelector(s), $$ = (s) => document.querySelectorAll(s);
const store = {
  get: (k, d) => { try { return JSON.parse(localStorage.getItem("qrhub." + k)) ?? d; } catch { return d; } },
  set: (k, v) => { try { localStorage.setItem("qrhub." + k, JSON.stringify(v)); } catch {} }
};
const esc = (s) => String(s).replace(/([\\;,:"])/g, "\\$1");
const el = (tag, txt, cls) => { const e = document.createElement(tag); if (txt != null) e.textContent = txt; if (cls) e.className = cls; return e; };
const btn = (label, fn, cls) => { const b = el("button", null, cls || "sec"); b.type = "button"; b.innerHTML = withIcons(label); b.onclick = fn; return b; };
// ---------- icons (inline SVG — no emoji fonts needed) ----------
const IC = {
  home: '<path d="M3 11l9-8 9 8"/><path d="M5 10v10h14V10"/><path d="M10 20v-6h4v6"/>',
  scan: '<path d="M4 8V5a1 1 0 011-1h3M16 4h3a1 1 0 011 1v3M20 16v3a1 1 0 01-1 1h-3M8 20H5a1 1 0 01-1-1v-3M4 12h16"/>',
  qr: '<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><path d="M14 14h3v3h-3zM20 14v.01M14 20h3M20 17v4"/>',
  image: '<rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="10" r="1.6"/><path d="M21 16l-5-5-9 9"/>',
  type: '<path d="M5 6V4h14v2M12 4v16M9 20h6"/>',
  link: '<path d="M10 14a4 4 0 005.7 0l3-3a4 4 0 00-5.7-5.7l-1 1"/><path d="M14 10a4 4 0 00-5.7 0l-3 3a4 4 0 005.7 5.7l1-1"/>',
  wifi: '<path d="M2 9a15 15 0 0120 0M5 12.5a10.5 10.5 0 0114 0M8.5 16a5.5 5.5 0 017 0"/><path d="M12 19.5v.01"/>',
  contact: '<rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="9" cy="11" r="2"/><path d="M5.5 16c.6-1.6 2-2.4 3.5-2.4s2.9.8 3.5 2.4M14 10h4M14 14h3"/>',
  pin: '<path d="M12 21s7-6.2 7-11.5A7 7 0 005 9.5C5 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/>',
  chat: '<path d="M4 20l1.3-4.2A8 8 0 1112 20a8 8 0 01-3.8-1z"/><path d="M9 9.5c0 3 2.5 5.5 5.5 5.5l1-1.5-2-1-1 .8a4 4 0 01-1.8-1.8l.8-1-1-2z"/>',
  mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/>',
  phone: '<path d="M5 4h4l2 5-2.5 1.5a11 11 0 005 5L15 13l5 2v4a2 2 0 01-2 2A16 16 0 013 6a2 2 0 012-2z"/>',
  sms: '<path d="M4 5h16v11H9l-5 4z"/><path d="M8 9.5h8M8 12.5h5"/>',
  share: '<circle cx="6" cy="12" r="2.5"/><circle cx="18" cy="6" r="2.5"/><circle cx="18" cy="18" r="2.5"/><path d="M8.2 10.8l7.6-3.6M8.2 13.2l7.6 3.6"/>',
  folder: '<path d="M3 7a2 2 0 012-2h4l2 2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>',
  heart: '<path d="M12 20s-8-5-8-11a4.5 4.5 0 018-2.8A4.5 4.5 0 0120 9c0 6-8 11-8 11z"/>',
  grid: '<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>',
  chart: '<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>',
  gear: '<circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9L7 7M17 17l2.1 2.1M19.1 4.9L17 7M7 17l-2.1 2.1"/>',
  bell: '<path d="M6 16v-5a6 6 0 0112 0v5l2 2H4z"/><path d="M10 21h4"/>',
  mic: '<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0014 0M12 18v3"/>',
  globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 010 18M12 3a14 14 0 000 18"/>',
  download: '<path d="M12 4v11M7 11l5 5 5-5M5 20h14"/>',
  upload: '<path d="M12 16V5M7 9l5-5 5 5M5 20h14"/>',
  search: '<circle cx="11" cy="11" r="6.5"/><path d="M16 16l4.5 4.5"/>',
  trash: '<path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13"/>',
  copy: '<rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V6a2 2 0 00-2-2H6a2 2 0 00-2 2v8a2 2 0 002 2h2"/>',
  check: '<path d="M4 12.5l5 5L20 6.5"/>', x: '<path d="M6 6l12 12M18 6L6 18"/>',
  alert: '<path d="M12 3L2 20h20z"/><path d="M12 10v4M12 17v.01"/>', menu: '<path d="M4 6h16M4 12h16M4 18h16"/>',
  flip: '<path d="M20 8a8 8 0 00-14-2M4 4v4h4M4 16a8 8 0 0014 2M20 20v-4h-4"/>', zap: '<path d="M13 2L4 14h7l-1 8 9-12h-7z"/>',
  camera: '<path d="M4 8h3l2-3h6l2 3h3v11H4z"/><circle cx="12" cy="13" r="3.5"/>', stop: '<rect x="6" y="6" width="12" height="12" rx="2"/>',
  shapes: '<path d="M12 3l5 9H7z"/><circle cx="17" cy="17" r="4"/><rect x="3" y="14" width="7" height="7" rx="1"/>',
  palette: '<path d="M12 3a9 9 0 000 18c1.4 0 2-1 1.5-2.2-.5-1.2.2-2.3 1.5-2.3H17a4 4 0 004-4A9 9 0 0012 3z"/><circle cx="7.5" cy="11" r="1"/><circle cx="10" cy="7.5" r="1"/><circle cx="15" cy="7.5" r="1"/>',
  frame: '<rect x="3" y="3" width="18" height="18" rx="3"/><rect x="7.5" y="7.5" width="9" height="9" rx="1.5"/>',
  tag: '<path d="M3 12V4h8l10 10-8 8z"/><circle cx="7.5" cy="8.5" r="1.3"/>',
  sparkles: '<path d="M12 3l2 5 5 2-5 2-2 5-2-5-5-2 5-2zM19 15l.8 2 2 .8-2 .8-.8 2-.8-2-2-.8 2-.8z"/>',
  shield: '<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/><path d="M8.5 12l2.5 2.5 4.5-5"/>',
  info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.5v.01"/>',
  save: '<ellipse cx="12" cy="6" rx="8" ry="3"/><path d="M4 6v6c0 1.7 3.6 3 8 3s8-1.3 8-3V6M4 12v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6"/>',
  moon: '<path d="M20 14.5A8.5 8.5 0 019.5 4 8.5 8.5 0 1020 14.5z"/>', ext: '<path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 01-1 1H5a1 1 0 01-1-1V7a1 1 0 011-1h5"/>'
};
const ico = (n) => `<svg class="sv" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${IC[n] || ""}</svg>`;
const EMAP = { "📷": "camera", "🖼": "image", "🔄": "flip", "🔦": "zap", "⏹": "stop", "⬇": "download", "⬆": "upload", "🗑": "trash", "📋": "copy", "🌐": "globe", "💾": "save", "✉": "mail", "📞": "phone", "💬": "sms", "📍": "pin", "▦": "qr", "🛡": "shield", "🎨": "palette", "🔷": "shapes", "▣": "frame", "🏷": "tag", "✨": "sparkles", "ℹ": "info", "⚠": "alert", "✅": "check", "❌": "x", "🔍": "search", "🎤": "mic", "🔔": "bell", "☰": "menu", "🌙": "moon" };
const strip = (x) => String(x).replace(/[\p{Extended_Pictographic}\uFE0F\u200D]/gu, "").replace(/\s{2,}/g, " ").trim();
const escH = (x) => String(x).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const withIcons = (label) => { const a = [...String(label)], n = EMAP[a[0]], rest = strip(a.slice(1).join("")); return n ? ico(n) + (rest ? " " + escH(rest) : "") : escH(strip(label)); };
const ih = (tag, label) => { const e = document.createElement(tag); e.innerHTML = withIcons(label); return e; };
$$("[data-ic]").forEach(e => e.innerHTML = ico(e.dataset.ic));
$$("img[data-img]").forEach(i => { i.src = IMG[i.dataset.img]; });
const LIBMSG = "Scanner engine failed to load. Check your internet connection and reload the page.";
const ensureJsQR = () => typeof jsQR !== "undefined" ? Promise.resolve() : new Promise(r => { const t = document.createElement("script"); t.src = "https://cdn.jsdelivr.net/npm/jsqr@1.4.0/dist/jsQR.js"; t.onload = t.onerror = r; document.head.append(t); });
ensureJsQR();


// ---------- language (EN / বাংলা) ----------
let lang = store.get("lang", "en");
const L = {
  nlc: ["Create", "তৈরি"], nll: ["Library", "লাইব্রেরি"], nlt: ["Tools", "টুলস"], dash: ["Dashboard", "ড্যাশবোর্ড"], mycodes: ["My QR Codes", "আমার QR কোড"], history: ["History", "হিস্ট্রি"], fav: ["Favorites", "ফেভারিট"], tpl: ["Templates", "টেমপ্লেট"],
  ana: ["Analytics", "অ্যানালিটিক্স"], set: ["Settings", "সেটিংস"], dark: ["Dark Mode", "ডার্ক মোড"], create: ["Create QR Code", "QR কোড তৈরি করুন"],
  your: ["Create Your QR Code", "আপনার QR কোড তৈরি করুন"], prev: ["Preview", "প্রিভিউ"], gen: ["Generate QR", "QR তৈরি করুন"], dl: ["Download", "ডাউনলোড"], sh: ["Share", "শেয়ার"],
  recent: ["Recent Activity", "সাম্প্রতিক কার্যক্রম"], va: ["View All", "সব দেখুন"], quick: ["Quick Stats", "দ্রুত পরিসংখ্যান"], tot: ["Total QR", "মোট QR"], month: ["This Month", "এই মাস"],
  scans: ["Total Scans", "মোট স্ক্যান"], today: ["Today's QR", "আজকের QR"], succ: ["Scan Success", "স্ক্যান সফলতা"], searchph: ["Search your QR codes...", "আপনার QR খুঁজুন..."],
  res: ["results", "ফলাফল"], h1: ["Create Professional<br>QR Codes in Seconds", "মাত্র কয়েক সেকেন্ডে<br>প্রফেশনাল QR কোড বানান"],
  hp: ["Generate beautiful, secure and customizable QR codes for business, marketing and personal use.", "ব্যবসা, মার্কেটিং ও ব্যক্তিগত কাজের জন্য সুন্দর, নিরাপদ ও কাস্টমাইজযোগ্য QR কোড তৈরি করুন।"],
  scanbtn: ["Scan QR Code", "QR স্ক্যান করুন"], phold: ["Your QR code will appear here", "আপনার QR কোড এখানে দেখা যাবে"], all: ["All", "সব"], clr: ["Clear all", "সব মুছুন"],
  tpld: ["Pick a style — it is applied to the generator instantly.", "একটি স্টাইল বেছে নিন — সাথে সাথে জেনারেটরে প্রয়োগ হবে।"], sdrop: ["Drop a QR image here to scan", "স্ক্যানের জন্য QR ছবি এখানে ফেলুন"],
  gal: ["Gallery", "গ্যালারি"], shist: ["Scan History", "স্ক্যান হিস্ট্রি"], start: ["Start Camera", "ক্যামেরা চালু"], stop: ["Stop Camera", "ক্যামেরা বন্ধ"], scanner: ["QR Scanner", "কিউআর স্ক্যানার"],
  upg: ["Upgrade to Pro", "প্রো-তে আপগ্রেড"], upd: ["Unlock powerful features and enhance your productivity.", "শক্তিশালী ফিচার আনলক করুন ও কাজের গতি বাড়ান।"], upn: ["Upgrade Now", "এখনই আপগ্রেড"],
  pact: ["Pro Active", "প্রো সক্রিয়"], manage: ["Manage", "ম্যানেজ"], nonote: ["No notifications yet.", "কোনো নোটিফিকেশন নেই।"], readall: ["Mark all read", "সব পঠিত"],
  nores: ["Nothing found.", "কিছু পাওয়া যায়নি।"], noact: ["No activity yet — create your first QR.", "এখনো কিছু নেই — প্রথম QR বানান।"]
};
const NB = { scan: "কিউআর স্ক্যানার", image: "ইমেজ QR", text: "টেক্সট QR", url: "URL QR", wifi: "ওয়াইফাই QR", contact: "কন্টাক্ট QR", geo: "লোকেশন QR", wa: "হোয়াটসঅ্যাপ QR", email: "ইমেইল QR", phone: "ফোন QR", sms: "এসএমএস QR", social: "সোশ্যাল মিডিয়া QR" };
const t = (k) => L[k] ? L[k][lang === "bn" ? 1 : 0] : k;
const nm = (k) => lang === "bn" && NB[k] ? NB[k] : ALL[k].n;
function applyLang() {
  document.documentElement.lang = lang; $("#lg").textContent = lang === "bn" ? "বাং" : "EN";
  $$("[data-i]").forEach(e => e.innerHTML = t(e.dataset.i)); $$("[data-p]").forEach(e => e.placeholder = t(e.dataset.p));
  $("#role").textContent = lang === "bn" ? "প্রতিষ্ঠাতা" : "Founder"; $("#q").placeholder = t("searchph");
}

// ---------- toast & notifications ----------
let tt; const toast = (m) => { const e = $("#toast"); e.textContent = strip(m); e.hidden = false; clearTimeout(tt); tt = setTimeout(() => e.hidden = true, 2600); };
function notify(txt) {
  const n = store.get("notes", []); n.unshift({ id: Date.now(), ts: Date.now(), txt: strip(txt), r: 0 }); store.set("notes", n.slice(0, 30)); drawNotes();
  if (store.get("bn", false) && "Notification" in window && Notification.permission === "granted") try { new Notification("QR Hub", { body: txt, icon: "icon-192.png" }); } catch {}
}
function drawNotes() {
  const n = store.get("notes", []), u = n.filter(x => !x.r).length; $("#bd").hidden = !u; $("#bd").textContent = u;
  const np = $("#np"); np.innerHTML = "";
  if (!n.length) np.append(el("p", t("nonote")));
  n.forEach(x => { const p = el("p", x.txt, x.r ? "" : "u"); p.append(el("small", ago(x.ts))); np.append(p); });
  if (n.length) { const r = el("div", null, "row"); r.append(btn(t("readall"), () => { store.set("notes", n.map(x => ({ ...x, r: 1 }))); drawNotes(); }), btn(t("clr"), () => { store.set("notes", []); drawNotes(); })); np.append(r); }
}
$("#bell").onclick = (e) => { e.stopPropagation(); $("#np").hidden = !$("#np").hidden; };
document.addEventListener("click", (e) => { if (!e.target.closest(".nw")) $("#np").hidden = true; });
function ago(ts) { const m = Math.round((Date.now() - ts) / 6e4); return lang === "bn" ? (m < 1 ? "এইমাত্র" : m < 60 ? m + " মিনিট আগে" : m < 1440 ? Math.round(m / 60) + " ঘণ্টা আগে" : Math.round(m / 1440) + " দিন আগে") : (m < 1 ? "just now" : m < 60 ? m + " mins ago" : m < 1440 ? Math.round(m / 60) + " hours ago" : Math.round(m / 1440) + " days ago"); }

// ---------- all features are free ----------
const pro = () => true, needPro = () => false;
$("#modal").onclick = (e) => { if (e.target.id === "modal") e.target.hidden = true; };

// ---------- QR types ----------
const SOC = { facebook: "https://facebook.com/", instagram: "https://instagram.com/", x: "https://x.com/", youtube: "https://youtube.com/@", tiktok: "https://tiktok.com/@", linkedin: "https://linkedin.com/in/", telegram: "https://t.me/" };
const TYPES = {
  text: { i: "🔤", c: "#ede9fe", n: "Text QR", d: "Create QR from plain text", f: [["text", "Text", "textarea"]], b: v => v.text },
  url: { i: "🔗", c: "#cffafe", n: "URL QR", d: "Create QR for website link", f: [["url", "Website link", "url", "example.com"]], b: v => /^[a-z][a-z0-9+.-]*:/i.test(v.url) ? v.url : "https://" + v.url },
  wifi: { i: "📶", c: "#d1fae5", n: "WiFi QR", d: "Share WiFi network", f: [["ssid", "Network name"], ["pass", "Password", "text", "", 1], ["enc", "Security", "select", ["WPA", "WEP", "nopass"]]], b: v => `WIFI:T:${v.enc};S:${esc(v.ssid)};P:${esc(v.pass || "")};;` },
  contact: { i: "🪪", c: "#ffedd5", n: "Contact QR", d: "Share contact information", f: [["name", "Name"], ["tel", "Phone", "tel", "", 1], ["mail", "Email", "email", "", 1], ["org", "Organization", "text", "", 1]], b: v => `BEGIN:VCARD\nVERSION:3.0\nFN:${v.name}\n${v.tel ? "TEL:" + v.tel + "\n" : ""}${v.mail ? "EMAIL:" + v.mail + "\n" : ""}${v.org ? "ORG:" + v.org + "\n" : ""}END:VCARD` },
  geo: { i: "📍", c: "#dbeafe", n: "Location QR", d: "Share a location using Google Maps", f: [["lat", "Latitude", "number"], ["lng", "Longitude", "number"]], b: v => `https://www.google.com/maps?q=${v.lat},${v.lng}`, geo: 1 },
  wa: { i: "🟢", c: "#dcfce7", n: "WhatsApp QR", d: "Start a WhatsApp chat instantly", f: [["tel", "Number with country code", "tel", "8801XXXXXXXXX"], ["msg", "Message", "textarea", "", 1]], b: v => `https://wa.me/${v.tel.replace(/\D/g, "")}${v.msg ? "?text=" + encodeURIComponent(v.msg) : ""}` },
  email: { i: "✉️", c: "#e0e7ff", n: "Email QR", d: "Share an email address instantly", f: [["to", "Email", "email"], ["sub", "Subject", "text", "", 1], ["body", "Message", "textarea", "", 1]], b: v => `mailto:${v.to}?subject=${encodeURIComponent(v.sub || "")}&body=${encodeURIComponent(v.body || "")}` },
  phone: { i: "📞", c: "#dbeafe", n: "Phone QR", d: "Make a phone call instantly", f: [["tel", "Phone number", "tel", "+8801XXXXXXXXX"]], b: v => "tel:" + v.tel.replace(/[^\d+]/g, "") },
  sms: { i: "💬", c: "#e0f2fe", n: "SMS QR", d: "Send an SMS instantly", f: [["tel", "Phone number", "tel"], ["msg", "Message", "textarea", "", 1]], b: v => `SMSTO:${v.tel.replace(/[^\d+]/g, "")}:${v.msg || ""}` },
  social: { i: "🌐", c: "#fce7f3", n: "Social Media QR", d: "Share your social media profiles", f: [["net", "Platform", "select", Object.keys(SOC)], ["user", "Username", "text", "yourname"]], b: v => SOC[v.net] + v.user.replace(/^@/, "") },
  image: { i: "🖼️", c: "#ffe4e6", n: "Image QR", d: "Create QR from an image", f: [["file", "Image", "file"]], img: 1 }
};
const ALL = { scan: { i: "📷", c: "#dbeafe", n: "QR Scanner", d: "Scan QR code using camera or gallery" }, ...TYPES };
const TICON = { scan: "scan", image: "image", text: "type", url: "link", wifi: "wifi", contact: "contact", geo: "pin", wa: "chat", email: "mail", phone: "phone", sms: "sms", social: "share" };
const TCOL = { scan: "#2563eb", image: "#e11d48", text: "#7c3aed", url: "#0891b2", wifi: "#059669", contact: "#ea580c", geo: "#2563eb", wa: "#16a34a", email: "#4f46e5", phone: "#2563eb", sms: "#0284c7", social: "#db2777" };
const ORDER = ["scan", "image", "text", "url", "wifi", "contact", "geo", "wa", "email", "phone", "sms", "social"];
let cur = store.get("deftype", "text"), last = null, scanning = false;
const msg = (m, err) => { const e = $("#msg"); e.textContent = strip(m || ""); e.className = err ? "err" : ""; };

function renderUI() {
  $("#cards").innerHTML = ORDER.map(k => `<button data-k="${k}"><i style="--c:${ALL[k].c};--ic:${TCOL[k]}">${ico(TICON[k])}</i><b>${nm(k)}</b><small>${ALL[k].d}</small></button>`).join("");
  const it = (a, i, l) => `<a ${a}><i>${ico(i)}</i><span>${l}</span></a>`;
  $("#nav").innerHTML = it('data-go="dash"', "home", t("dash")) + `<div class="nl">${t("nlc")}</div>` + ORDER.map(k => it(`data-k="${k}"`, TICON[k], nm(k))).join("") +
    `<div class="nl">${t("nll")}</div>` + it('data-go="hist"', "folder", t("mycodes")) + it('data-go="fav"', "heart", t("fav")) +
    `<div class="nl">${t("nlt")}</div>` + it('data-go="tpl"', "grid", t("tpl")) + it('data-go="ana"', "chart", t("ana")) + it('data-go="set"', "gear", t("set"));
  setActive();
}
function setActive() {
  const k = scanning ? "scan" : cur, vv = ["dash", "hist", "tpl", "set"].find(x => !$("#v-" + x).hidden), fav = $("#filt")?.value === "fav";
  $$("#cards [data-k],#nav [data-k]").forEach(b => b.classList.toggle("active", b.dataset.k === k && vv === "dash"));
  $$("#nav [data-go]").forEach(a => { const g = a.dataset.go; a.classList.toggle("active", (g === "hist" && vv === "hist" && !fav) || (g === "fav" && vv === "hist" && fav) || (g === "tpl" && vv === "tpl") || (g === "set" && vv === "set")); });
}
function renderForm() {
  const ty = TYPES[cur]; $("#wt").textContent = scanning ? t("scanner") : t("your"); $("#wd").textContent = scanning ? "" : ty.d + " — " + nm(cur);
  $("#form").innerHTML = ty.f.map(([id, label, type = "text", ph = "", opt]) => {
    const req = opt ? "" : "required";
    if (type === "textarea") return `<label>${label}<textarea id="f_${id}" rows="4" ${req}></textarea></label>`;
    if (type === "select") return `<label>${label}<select id="f_${id}">${ph.map(o => `<option>${o}</option>`).join("")}</select></label>`;
    if (type === "file") return `<label class="dz" id="dz"><b>${ico("upload")}</b>Drag &amp; Drop an image here<span>or click to choose</span><span class="pr btn">Choose File</span><small id="fn">JPG • PNG • WEBP • Max 10MB</small><input id="f_${id}" type="file" accept="image/jpeg,image/png,image/webp" ${req}></label>`;
    return `<label>${label}<input id="f_${id}" type="${type}" ${type === "number" ? 'step="any"' : ""} placeholder="${ph}" ${req}></label>`;
  }).join("") + (ty.geo ? `<button type="button" id="gps" class="sec">${ico("pin")} Use my location</button> ` : "") + `<button id="gen" class="pr">${t("gen")}</button>`;
  const dz = $("#dz");
  if (dz) {
    const inp = $("#f_file"), nf = () => $("#fn").textContent = inp.files[0] ? inp.files[0].name : "JPG • PNG • WEBP • Max 10MB"; inp.onchange = nf;
    ["dragover", "dragenter"].forEach(ev => dz.addEventListener(ev, e => { e.preventDefault(); dz.classList.add("on"); }));
    ["dragleave", "drop"].forEach(ev => dz.addEventListener(ev, () => dz.classList.remove("on")));
    dz.addEventListener("drop", e => { e.preventDefault(); if (e.dataTransfer.files.length) { inp.files = e.dataTransfer.files; nf(); } });
  }
}

// ---------- QR design engine ----------
try { qrcode.stringToBytes = qrcode.stringToBytesFuncs["UTF-8"]; } catch {}
const DEF = { body: "liq", eye: "rd", pupil: "rd", fg: "#0f172a", fg2: "#0f172a", grad: "none", ang: 45, eyeC: "", bg: "#ffffff", bg2: "#e0f2fe", bgm: "solid", frame: "none", ft: "SCAN ME", fc: "#2563eb", logo: "none", ls: 20, size: 512 };
let D = { ...DEF, ...store.get("design", {}) }, custom = null, stab = null;
const logoImg = new Image(); logoImg.src = IMG.logo;
const cs = store.get("clogo", null); if (cs) { custom = new Image(); custom.src = cs; }
const proUsed = (d) => d.grad !== "none" || d.bgm === "grad" || d.frame !== "none" || d.logo !== "none" || d.size > 512;
if (!pro() && proUsed(D)) D = { ...D, grad: "none", bgm: D.bgm === "grad" ? "solid" : D.bgm, frame: "none", logo: "none", size: Math.min(512, D.size) };
const BODY = [["sq", "Square"], ["rd", "Rounded"], ["liq", "Liquid"], ["dot", "Dots"], ["dia", "Diamond"], ["cls", "Classy"], ["vb", "V-Bars"], ["hb", "H-Bars"], ["star", "Star"]];
const EYE = [["sq", "Square"], ["rd", "Rounded"], ["ci", "Circle"], ["lf", "Leaf"], ["di", "Diamond"]];
function sp(p, x, y, s, t) {
  if (t === "sq") p.rect(x, y, s, s); else if (t === "rd") p.roundRect(x, y, s, s, s * .3);
  else if (t === "ci") { p.moveTo(x + s, y + s / 2); p.arc(x + s / 2, y + s / 2, s / 2, 0, Math.PI * 2); }
  else if (t === "lf") p.roundRect(x, y, s, s, [s * .5, 0, s * .5, 0]);
  else if (t === "di") { p.moveTo(x + s / 2, y); p.lineTo(x + s, y + s / 2); p.lineTo(x + s / 2, y + s); p.lineTo(x, y + s / 2); p.closePath(); }
}
function lin(x, px, a, c1, c2) { const r = a * Math.PI / 180, h = px / 2, g = x.createLinearGradient(h - Math.cos(r) * h, h - Math.sin(r) * h, h + Math.cos(r) * h, h + Math.sin(r) * h); g.addColorStop(0, c1); g.addColorStop(1, c2); return g; }
function renderQR(text, d, size) {
  const qr = qrcode(0, d.logo !== "none" ? "H" : store.get("ecc", "Q")); qr.addData(text, "Byte"); qr.make();
  const n = qr.getModuleCount(), q = store.get("qz", 4), cell = Math.max(2, Math.floor((size || d.size) / (n + q * 2))), px = cell * (n + q * 2);
  const c = document.createElement("canvas"); c.width = c.height = px; const x = c.getContext("2d");
  if (d.bgm === "solid") { x.fillStyle = d.bg; x.fillRect(0, 0, px, px); } else if (d.bgm === "grad") { x.fillStyle = lin(x, px, 45, d.bg, d.bg2); x.fillRect(0, 0, px, px); }
  const fill = d.grad === "lin" ? lin(x, px, d.ang, d.fg, d.fg2) : d.grad === "rad" ? (() => { const g = x.createRadialGradient(px / 2, px / 2, 0, px / 2, px / 2, px * .7); g.addColorStop(0, d.fg); g.addColorStop(1, d.fg2); return g; })() : d.fg;
  const inEye = (r, k) => (r < 7 && k < 7) || (r < 7 && k >= n - 7) || (r >= n - 7 && k < 7);
  const dk = (r, k) => r >= 0 && k >= 0 && r < n && k < n && qr.isDark(r, k) && !inEye(r, k);
  const P = new Path2D(), s = cell;
  for (let r = 0; r < n; r++) for (let k = 0; k < n; k++) {
    if (!dk(r, k)) continue; const X = (k + q) * s, Y = (r + q) * s, U = dk(r - 1, k), Dn = dk(r + 1, k), Lf = dk(r, k - 1), R = dk(r, k + 1), b = d.body;
    if (b === "sq") P.rect(X, Y, s, s); else if (b === "rd") P.roundRect(X + s * .04, Y + s * .04, s * .92, s * .92, s * .3);
    else if (b === "liq") { const m = s * .5; P.roundRect(X, Y, s, s, [!U && !Lf ? m : 0, !U && !R ? m : 0, !Dn && !R ? m : 0, !Dn && !Lf ? m : 0]); }
    else if (b === "dot") { P.moveTo(X + s * .94, Y + s / 2); P.arc(X + s / 2, Y + s / 2, s * .44, 0, Math.PI * 2); }
    else if (b === "dia") sp(P, X + s * .02, Y + s * .02, s * .96, "di");
    else if (b === "cls") P.roundRect(X, Y, s, s, [s * .5, 0, s * .5, 0]);
    else if (b === "vb") { const m = s * .4; P.roundRect(X + s * .1, Y, s * .8, s, [U ? 0 : m, U ? 0 : m, Dn ? 0 : m, Dn ? 0 : m]); }
    else if (b === "hb") { const m = s * .4; P.roundRect(X, Y + s * .1, s, s * .8, [Lf ? 0 : m, R ? 0 : m, R ? 0 : m, Lf ? 0 : m]); }
    else { const cx = X + s / 2, cy = Y + s / 2; for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, rr = i % 2 ? s * .22 : s * .52; i ? P.lineTo(cx + Math.cos(a) * rr, cy + Math.sin(a) * rr) : P.moveTo(cx + Math.cos(a) * rr, cy + Math.sin(a) * rr); } P.closePath(); }
  }
  x.fillStyle = fill; x.fill(P);
  const E = new Path2D(), E2 = new Path2D();
  [[0, 0], [0, n - 7], [n - 7, 0]].forEach(([r, k]) => { const X = (k + q) * s, Y = (r + q) * s; sp(E, X, Y, 7 * s, d.eye); sp(E, X + s, Y + s, 5 * s, d.eye); sp(E2, X + 2 * s, Y + 2 * s, 3 * s, d.pupil); });
  x.fillStyle = d.eyeC || fill; x.fill(E, "evenodd"); x.fill(E2);
  const raw = document.createElement("canvas"); raw.width = raw.height = px; raw.getContext("2d").drawImage(c, 0, 0);
  const li = d.logo === "app" ? logoImg : d.logo === "custom" ? custom : null;
  if (li && li.complete && li.naturalWidth) { const L = px * d.ls / 100, o = (px - L) / 2, pl = L * 1.14, po = (px - pl) / 2; x.fillStyle = d.bgm === "clear" ? "#fff" : d.bg; x.beginPath(); x.roundRect(po, po, pl, pl, pl * .25); x.fill(); x.save(); x.beginPath(); x.roundRect(o, o, L, L, L * .2); x.clip(); x.drawImage(li, o, o, L, L); x.restore(); raw.getContext("2d").drawImage(c, 0, 0); }
  return { c: frameIt(c, d), raw };
}
function frameIt(c, d) {
  if (d.frame === "none") return c;
  const s = c.width, pad = s * .07, lh = s * .17, W = s + pad * 2, H = W + lh, o = document.createElement("canvas"); o.width = W; o.height = H; const x = o.getContext("2d");
  const rr = (X, Y, w, h, r, col) => { x.fillStyle = col; x.beginPath(); x.roundRect(X, Y, w, h, r); x.fill(); };
  const txt = (cy) => { x.fillStyle = "#fff"; x.font = `700 ${lh * .46}px system-ui,sans-serif`; x.textAlign = "center"; x.textBaseline = "middle"; x.fillText(d.ft || "SCAN ME", W / 2, cy); };
  if (d.frame === "box") { rr(0, 0, W, H, s * .08, d.fc); rr(pad, pad, s, s, s * .04, "#fff"); x.drawImage(c, pad, pad); txt(pad + s + (H - pad - s) / 2); }
  else if (d.frame === "top") { rr(0, 0, W, H, s * .08, d.fc); txt(lh * .62); rr(pad, lh, s, s, s * .04, "#fff"); x.drawImage(c, pad, lh); }
  else { rr(0, 0, W, W, s * .08, d.fc); rr(pad * .5, pad * .5, W - pad, W - pad, s * .06, "#fff"); x.drawImage(c, pad, pad); rr(W * .18, W + lh * .1, W * .64, lh * .75, lh, d.fc); txt(W + lh * .48); }
  return o;
}
const lum = (h) => { const [r, g, b] = [1, 3, 5].map(i => parseInt(h.substr(i, 2), 16) / 255).map(v => v <= .03928 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4); return .2126 * r + .7152 * g + .0722 * b; };
const cr = (a, b) => { const x = lum(a), y = lum(b); return (Math.max(x, y) + .05) / (Math.min(x, y) + .05); };
function analyze(d) {
  const w = [], fgs = [d.fg, d.grad !== "none" ? d.fg2 : null, d.eyeC || null].filter(Boolean), bgs = [d.bgm === "clear" ? "#ffffff" : d.bg, d.bgm === "grad" ? d.bg2 : null].filter(Boolean);
  let min = 99, inv = false; fgs.forEach(f => bgs.forEach(b => { min = Math.min(min, cr(f, b)); if (lum(f) > lum(b)) inv = true; }));
  if (min < 3) w.push(`Low contrast (${min.toFixed(1)}:1) — use a darker QR on a lighter background.`); else if (min < 4.5) w.push(`Contrast is borderline (${min.toFixed(1)}:1).`);
  if (inv) w.push("Light-on-dark (inverted) QR codes fail on many scanner apps.");
  if (d.logo !== "none" && d.ls > 25) w.push("Logo covers more than 25% — may hurt scanning.");
  if (d.bgm === "clear") w.push("Transparent background — place it on a light surface.");
  return w;
}
function verify(raw, text) {
  if (typeof jsQR === "undefined") throw new Error("lib");
  const s = Math.min(420, raw.width), t = document.createElement("canvas"); t.width = t.height = s; const x = t.getContext("2d", { willReadFrequently: true });
  x.fillStyle = "#fff"; x.fillRect(0, 0, s, s); x.drawImage(raw, 0, 0, s, s);
  const r = jsQR(x.getImageData(0, 0, s, s).data, s, s, { inversionAttempts: "dontInvert" }); return !!r && r.data === text;
}
function show(payload) {
  let r; try { r = renderQR(payload, D); } catch { msg("Data too large for a QR code — shorten it.", 1); return false; }
  const c = r.c, cv = $("#cv"); cv.width = c.width; cv.height = c.height; const x = cv.getContext("2d"); x.clearRect(0, 0, c.width, c.height); x.drawImage(c, 0, 0);
  cv.hidden = false; $("#ph").hidden = true; $("#studioWrap").hidden = false; $("#dl").disabled = $("#sh").disabled = false;
  const sf = $("#safe"); sf.innerHTML = ""; const add = (ic, txt, cls) => { const e = el("span", null, cls); e.innerHTML = ico(ic) + " " + escH(txt); sf.append(e); };
  let ok = null; try { ok = verify(r.raw, payload); } catch {}
  if (ok === true) add("check", "Scan test passed — this design was decoded successfully", "ok");
  else if (ok === false) add("x", "Scan test failed — this design may not scan. Tap Auto-fix.", "bad");
  else add("info", "Scan test unavailable (scanner engine not loaded)", "wn");
  const w = analyze(D); w.forEach(m => add("alert", m, "wn"));
  if (ok === false || w.length) sf.append(btn("🛡 Auto-fix for safe scanning", () => { D = { ...D, fg: "#0f172a", fg2: "#0f172a", grad: "none", eyeC: "", bg: "#ffffff", bgm: "solid", ls: Math.min(D.ls, 22) }; store.set("design", D); drawStudio(); show(payload); }));
  return true;
}
function resetPreview() {
  last = null; stab = null; const cv = $("#cv"); cv.getContext("2d").clearRect(0, 0, cv.width, cv.height); cv.hidden = true; $("#ph").hidden = false;
  $("#studioWrap").hidden = true; $("#dl").disabled = $("#sh").disabled = true; $("#safe").innerHTML = ""; msg(""); drawStudio();
}
function setD(p) {
  const nd = { ...D, ...p }; if (!pro() && proUsed(nd)) { needPro(); drawStudio(); return; }
  D = nd; store.set("design", D); drawStudio(); if (last) show(last.data);
}
const thumb = (p) => { try { const c = renderQR("QR HUB", { ...D, ...p, frame: "none", logo: "none", grad: "none", fg: "#0f172a", eyeC: "", bg: "#ffffff", bgm: "solid" }, 90).c; c.className = "th"; return c; } catch { return el("span"); } };
function picker(label, key, list) {
  const w = el("div"); w.append(el("h4", label)); const r = el("div", null, "pks");
  list.forEach(([v, n]) => { const b = el("button", null, "pk" + (D[key] === v ? " on" : "")); b.type = "button"; b.append(thumb({ [key]: v }), el("span", n)); b.onclick = () => setD({ [key]: v }); r.append(b); }); w.append(r); return w;
}
function fld(label, type, key, extra) {
  const l = el("label", label), i = type === "select" ? el("select") : el("input");
  if (type === "select") extra.forEach(([v, n]) => { const o = el("option", n); o.value = v; i.append(o); }); else { i.type = type; if (extra) Object.assign(i, extra); }
  i.value = D[key]; const val = () => (type === "range" || key === "size") ? +i.value : i.value;
  if (type === "color" || type === "range" || type === "text") i.oninput = () => { D = { ...D, [key]: val() }; store.set("design", D); if (last) show(last.data); };
  i.onchange = () => setD({ [key]: val() }); l.append(i); return l;
}
const PRESETS = [
  { n: "Classic", p: { body: "sq", eye: "sq", pupil: "sq", fg: "#000000", fg2: "#000000", grad: "none", bg: "#ffffff", bgm: "solid" } },
  { n: "Ink Rounded", p: { body: "rd", eye: "rd", pupil: "ci", fg: "#111827", grad: "none", bg: "#ffffff" } },
  { n: "Midnight Bars", p: { body: "vb", eye: "rd", pupil: "rd", fg: "#0f172a", grad: "none", bg: "#e2e8f0" } },
  { n: "Royal Classy", p: { body: "cls", eye: "lf", pupil: "rd", fg: "#4338ca", grad: "none", bg: "#eef2ff" } },
  { n: "Liquid Ocean", pro: 1, p: { body: "liq", eye: "rd", pupil: "ci", fg: "#1d4ed8", fg2: "#0891b2", grad: "lin", bg: "#ffffff" } },
  { n: "Candy Dots", pro: 1, p: { body: "dot", eye: "ci", pupil: "ci", fg: "#7c3aed", fg2: "#db2777", grad: "lin", bg: "#fdf2f8" } },
  { n: "Sunset Diamond", pro: 1, p: { body: "dia", eye: "di", pupil: "di", fg: "#c2410c", fg2: "#b45309", grad: "lin", bg: "#fff7ed" } },
  { n: "Forest Leaf", pro: 1, p: { body: "cls", eye: "lf", pupil: "lf", fg: "#047857", fg2: "#064e3b", grad: "lin", bg: "#ecfdf5" } },
  { n: "Horizon Lines", pro: 1, p: { body: "hb", eye: "sq", pupil: "sq", fg: "#be123c", fg2: "#c2410c", grad: "lin", bg: "#ffffff" } },
  { n: "Brand Frame", pro: 1, p: { body: "liq", eye: "rd", pupil: "ci", fg: "#1e3a8a", grad: "none", bg: "#ffffff", frame: "box", fc: "#2563eb", ft: "SCAN ME", logo: "app", ls: 20 } },
  { n: "Pill Scan", pro: 1, p: { body: "rd", eye: "ci", pupil: "ci", fg: "#0f766e", grad: "none", bg: "#ffffff", frame: "pill", fc: "#0f766e", ft: "SCAN ME" } },
  { n: "Star Spark", p: { body: "star", eye: "di", pupil: "di", fg: "#1e1b4b", grad: "none", bg: "#ffffff" } }
];
function applyPreset(x) { const nd = { ...DEF, ...x.p }; if (!pro() && proUsed(nd)) return needPro(); D = nd; store.set("design", D); drawStudio(); if (last) show(last.data); toast("Design applied: " + x.n); }
function presetCard(x, big) {
  const c = el("div", null, big ? "tc" : "pk"); let cv; try { cv = renderQR("https://qrhub.app", { ...DEF, ...x.p }, big ? 200 : 90).c; } catch { cv = el("canvas"); }
  if (!big) cv.className = "th"; c.append(cv, big ? el("b", x.n + (x.pro ? "" : "")) : el("span", x.n + (x.pro ? "" : "")));
  if (big) c.append(btn("Use", () => { applyPreset(x); if (!$("#v-dash").hidden === false) { view("dash"); mode(false); renderForm(); $("#work").scrollIntoView({ behavior: "smooth" }); } }, "pr")); else c.onclick = () => applyPreset(x); return c;
}
function drawStudio() {
  const bar = $("#studioBar"), s = $("#studioPane"); if (!bar) return; bar.innerHTML = ""; s.innerHTML = ""; s.hidden = !stab;
  [["shapes", "🔷 Shapes"], ["colors", "🎨 Colors"], ["frame", "▣ Frame"], ["logo", "🏷 Logo"], ["presets", "✨ Presets"]].forEach(([k, n]) => bar.append(btn(n, () => { stab = stab === k ? null : k; drawStudio(); }, "sec" + (stab === k ? " on" : ""))));
  if (stab === "shapes") s.append(picker("Body shape", "body", BODY), picker("Eye frame", "eye", EYE), picker("Eye center", "pupil", EYE));
  if (stab === "colors") {
    s.append(el("h4", "Color palettes")); const w = el("div", null, "sws");
    [["#0f172a", "#0f172a"], ["#1d4ed8", "#0891b2"], ["#7c3aed", "#db2777"], ["#c2410c", "#b45309"], ["#047857", "#064e3b"], ["#be123c", "#c2410c"], ["#4338ca", "#7c3aed"], ["#0f766e", "#1d4ed8"]].forEach(([a, b]) => { const k = el("button", null, "swc"); k.style.background = a === b ? a : `linear-gradient(135deg,${a},${b})`; k.onclick = () => setD({ fg: a, fg2: b, grad: a === b ? "none" : "lin" }); w.append(k); }); s.append(w);
    const g = el("div", null, "fg2");
    g.append(fld("QR color", "color", "fg"), fld("Gradient end", "color", "fg2"), fld("Gradient", "select", "grad", [["none", "Solid"], ["lin", "Linear"], ["rad", "Radial"]]), fld("Angle", "range", "ang", { min: 0, max: 360 }), fld("Eye color (blank=same)", "color", "eyeC"), fld("Background", "color", "bg"), fld("Background end", "color", "bg2"), fld("Background mode", "select", "bgm", [["solid", "Solid"], ["grad", "Gradient"], ["clear", "Transparent"]]), fld("Export size", "select", "size", [[256, "256 px"], [512, "512 px"], [1024, "1024 px"]]));
    s.append(g); if (D.eyeC) s.append(btn("Reset eye color", () => setD({ eyeC: "" })));
  }
  if (stab === "frame") { s.append(picker2("Frame", "frame", [["none", "None"], ["box", "Box"], ["top", "Top label"], ["pill", "Pill"]])); const g = el("div", null, "fg2"); g.append(fld("Label text", "text", "ft", { maxLength: 18 }), fld("Frame color", "color", "fc")); s.append(g); }
  if (stab === "logo") {
    s.append(picker2("Center logo", "logo", [["none", "None"], ["app", "QR Hub"], ["custom", "My logo"]]));
    const f = el("input"); f.type = "file"; f.accept = "image/*"; f.hidden = true;
    f.onchange = async () => { const b = await createImageBitmap(f.files[0]), c = document.createElement("canvas"); c.width = c.height = 160; c.getContext("2d").drawImage(b, 0, 0, 160, 160); const u = c.toDataURL("image/png"); store.set("clogo", u); custom = new Image(); custom.onload = () => setD({ logo: "custom" }); custom.src = u; };
    s.append(btn("⬆ Upload your logo", () => f.click(), "sec"), f); const g = el("div", null, "fg2"); g.append(fld("Logo size %", "range", "ls", { min: 10, max: 30 })); s.append(g, el("small", "Logos force the highest error-correction (H). Keep size ≤ 25%."));
  }
  if (stab === "presets") { const r = el("div", null, "pks"); PRESETS.forEach(x => r.append(presetCard(x))); s.append(r); }
}
function picker2(label, key, list) { const w = el("div"); w.append(el("h4", label)); const r = el("div", null, "tabs2"); list.forEach(([v, n]) => r.append(btn(n, () => setD({ [key]: v }), "sec" + (D[key] === v ? " on" : "")))); w.append(r); return w; }

// ---------- image upload (Supabase Storage REST) ----------
async function uploadImage(file) {
  if (!/^image\/(jpeg|png|webp)$/.test(file.type)) throw new Error("Only JPG, PNG or WEBP");
  if (file.size > 10 * 1024 * 1024) throw new Error("Image is larger than 10MB");
  const bmp = await createImageBitmap(file), sc = Math.min(1, 1600 / Math.max(bmp.width, bmp.height));
  const c = document.createElement("canvas"); c.width = Math.round(bmp.width * sc); c.height = Math.round(bmp.height * sc);
  c.getContext("2d").drawImage(bmp, 0, 0, c.width, c.height);
  const blob = await new Promise(r => c.toBlob(r, "image/webp", .85)), name = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.webp`;
  const res = await fetch(`${CFG.url}/storage/v1/object/${CFG.bucket}/${name}`, { method: "POST", headers: { apikey: CFG.key, Authorization: "Bearer " + CFG.key, "Content-Type": "image/webp" }, body: blob });
  if (!res.ok) throw new Error("Upload failed (" + res.status + "). Check Supabase bucket is public with an INSERT policy.");
  return { url: `${CFG.url}/storage/v1/object/public/${CFG.bucket}/${name}`, size: blob.size };
}

// ---------- generate ----------
$("#form").addEventListener("submit", async (e) => {
  e.preventDefault(); msg("");
  const ty = TYPES[cur], v = {}; ty.f.forEach(([id]) => { const x = $("#f_" + id); v[id] = x.type === "file" ? x.files[0] : x.value.trim(); });
  const b = $("#gen"); b.disabled = true;
  try {
    let data, label, sz = 0;
    if (ty.img) { if (!v.file) throw new Error("Choose an image first"); msg("Uploading image..."); const u = await uploadImage(v.file); data = u.url; sz = u.size; label = v.file.name; }
    else { data = ty.b(v); label = v[ty.f[0][0]] || data; }
    if (show(data)) {
      last = { type: cur, label: String(label).slice(0, 80), data, sz, d: { ...D } };
      if (store.get("auto", true)) {
        const h = store.get("hist", []); h.unshift({ id: Date.now(), ...last, ts: Date.now(), fav: 0 }); store.set("hist", h.slice(0, store.get("hlimit", 200)));
        msg("✅ QR generated & saved to history.");
      } else msg("✅ QR generated (auto-save is off).");
      notify("QR created: " + last.label); refresh(); if (store.get("autodl", false)) doDownload();
    }
  } catch (err) { msg(err.message || "Something went wrong", 1); }
  b.disabled = false;
});
$("#form").addEventListener("click", (e) => {
  if (!e.target.closest("#gps")) return;
  if (!navigator.geolocation) return msg("Geolocation not supported", 1);
  navigator.geolocation.getCurrentPosition(p => { $("#f_lat").value = p.coords.latitude.toFixed(6); $("#f_lng").value = p.coords.longitude.toFixed(6); }, () => msg("Location permission denied", 1));
});
function doDownload() {
  const f = store.get("fmt", "png"), src = $("#cv"); let c = src;
  if (f === "jpeg") { c = document.createElement("canvas"); c.width = src.width; c.height = src.height; const x = c.getContext("2d"); x.fillStyle = "#fff"; x.fillRect(0, 0, c.width, c.height); x.drawImage(src, 0, 0); }
  c.toBlob(b => { const a = document.createElement("a"); a.href = URL.createObjectURL(b); a.download = `${store.get("prefix", "qrhub")}-${cur}-${Date.now()}.${f === "jpeg" ? "jpg" : f}`; a.click(); URL.revokeObjectURL(a.href); store.set("dl", store.get("dl", 0) + 1); refresh(); }, "image/" + f, .95);
}
$("#dl").onclick = doDownload;
$("#sh").onclick = () => $("#cv").toBlob(async b => {
  const f = new File([b], "qr.png", { type: "image/png" });
  try { if (navigator.canShare?.({ files: [f] })) await navigator.share({ files: [f], title: "QR Hub" }); else if (navigator.share) await navigator.share({ text: last.data }); else { await navigator.clipboard.writeText(last.data); toast("Copied (sharing not supported here)"); } } catch {}
});

// ---------- scanner ----------
const setCam = (on) => { $("#cam").innerHTML = ico(on ? "stop" : "camera") + " " + t(on ? "stop" : "start"); };
let stream = null, track = null, raf = 0, face = store.get("cam", "environment"), busy = 0, torch = false, det = null;
try { if ("BarcodeDetector" in window) det = new BarcodeDetector({ formats: ["qr_code"] }); } catch {}
const note = (m) => { const b = $("#sres"); b.hidden = false; b.textContent = m; };
function stopCam() { cancelAnimationFrame(raf); stream?.getTracks().forEach(x => x.stop()); stream = track = null; busy = 0; torch = false; $("#vw").hidden = true; $("#tor").hidden = true; $("#zoom").hidden = true; setCam(false); }
async function loadBmp(f) { try { return await createImageBitmap(f); } catch { return await new Promise((res, rej) => { const im = new Image(); im.onload = () => res(im); im.onerror = rej; im.src = URL.createObjectURL(f); }); } }
async function readImage(src, w, h, multi) { // returns text or null; src = canvas/bitmap/video/img
  if (det) { try { const r = await det.detect(src); if (r[0]) return r[0].rawValue; } catch {} }
  if (typeof jsQR === "undefined") await ensureJsQR(); if (typeof jsQR === "undefined") throw new Error("lib");
  for (const mx of multi ? [1000, 500, 1600] : [800]) {
    const c = document.createElement("canvas"), sc = Math.min(1, mx / Math.max(w, h)); c.width = Math.max(1, Math.round(w * sc)); c.height = Math.max(1, Math.round(h * sc));
    const x = c.getContext("2d", { willReadFrequently: true }); x.fillStyle = "#fff"; x.fillRect(0, 0, c.width, c.height); x.drawImage(src, 0, 0, c.width, c.height);
    const r = jsQR(x.getImageData(0, 0, c.width, c.height).data, c.width, c.height, { inversionAttempts: "attemptBoth" }); if (r && r.data) return r.data;
  }
  return null;
}
let lastTxt = "", lastT = 0;
const beep = () => { if (!$("#snd").checked) return; try { const a = new (window.AudioContext || window.webkitAudioContext)(), o = a.createOscillator(), g = a.createGain(); o.frequency.value = 880; g.gain.value = .08; o.connect(g); g.connect(a.destination); o.start(); setTimeout(() => { o.stop(); a.close(); }, 120); } catch {} };
async function startCam() {
  stopCam();
  if (!navigator.mediaDevices?.getUserMedia) return note("Camera not supported here (HTTPS required).");
  try { stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: face, width: { ideal: 1280 } } }); }
  catch (e) { return note(e.name === "NotAllowedError" ? "Camera permission denied. Allow camera access and retry." : "No camera available."); }
  track = stream.getVideoTracks()[0]; const v = $("#vid"); v.srcObject = stream; await v.play();
  $("#vw").hidden = false; $("#sres").hidden = true; setCam(true);
  const caps = track.getCapabilities?.() || {}, z = $("#zoom"); $("#tor").hidden = !caps.torch; z.hidden = !caps.zoom;
  if (caps.zoom) { z.min = caps.zoom.min; z.max = caps.zoom.max; z.step = caps.zoom.step || .1; z.value = caps.zoom.min; }
  (async function loop() {
    if (!stream) return;
    if (v.videoWidth && !busy) {
      busy = 1; let txt = null; try { txt = await readImage(v, v.videoWidth, v.videoHeight); } catch { stopCam(); return note(LIBMSG); }
      if (txt) { if (!$("#cont").checked) { stopCam(); return result(txt); } if (txt !== lastTxt || Date.now() - lastT > 3000) { lastTxt = txt; lastT = Date.now(); result(txt); } await new Promise(r => setTimeout(r, 200)); }
      busy = 0;
    }
    raf = requestAnimationFrame(loop);
  })();
}
$("#zoom").oninput = () => track?.applyConstraints({ advanced: [{ zoom: +$("#zoom").value }] }).catch(() => {});
$("#cam").onclick = () => stream ? stopCam() : startCam();
$("#flip").onclick = () => { face = face === "environment" ? "user" : "environment"; if (stream) startCam(); };
$("#tor").onclick = async () => { torch = !torch; try { await track.applyConstraints({ advanced: [{ torch }] }); } catch { toast("Torch not available"); } };
async function scanFile(f) {
  if (!f || !f.type.startsWith("image/")) return; stopCam();
  try { const b = await loadBmp(f), txt = await readImage(b, b.width || b.naturalWidth, b.height || b.naturalHeight, 1); if (txt) result(txt); else { store.set("scanFail", store.get("scanFail", 0) + 1); refresh(); note("No QR code found in this image."); } }
  catch (e) { note(e && e.message === "lib" ? LIBMSG : "Could not read this image."); }
}
$("#sfile").onchange = (e) => { scanFile(e.target.files[0]); e.target.value = ""; };
const dz2 = $("#dz2"); dz2.onclick = () => $("#sfile").click();
["dragover", "dragenter"].forEach(ev => dz2.addEventListener(ev, e => { e.preventDefault(); dz2.classList.add("on"); }));
["dragleave", "drop"].forEach(ev => dz2.addEventListener(ev, () => dz2.classList.remove("on")));
dz2.addEventListener("drop", e => { e.preventDefault(); scanFile(e.dataTransfer.files[0]); });
const un = (s) => s.replace(/\\(.)/g, "$1");
function parse(s) {
  let m;
  if (/^https?:\/\//i.test(s)) return { k: "URL", rows: [["Link", s]], acts: [["🌐 Open", () => window.open(s, "_blank", "noopener,noreferrer")]], warn: /^http:\/\//i.test(s) ? "⚠ Not HTTPS — open with care" : "" };
  if (/^WIFI:/i.test(s)) { const g = (k) => (s.match(new RegExp("(?:^|;|:)" + k + ":((?:\\\\.|[^;])*)", "i")) || [])[1]; const ss = un(g("S") || ""), pw = un(g("P") || ""); return { k: "WiFi", rows: [["Network", ss], ["Password", pw || "—"], ["Security", g("T") || "—"]], acts: pw ? [["📋 Copy password", () => navigator.clipboard.writeText(pw).then(() => toast("Password copied"))]] : [] }; }
  if (/^BEGIN:VCARD/i.test(s)) { const g = (k) => (s.match(new RegExp("^" + k + "[^:]*:(.*)$", "im")) || [])[1] || "—"; return { k: "Contact", rows: [["Name", g("FN")], ["Phone", g("TEL")], ["Email", g("EMAIL")], ["Org", g("ORG")]], acts: [["💾 Save contact", () => { const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([s], { type: "text/vcard" })); a.download = "contact.vcf"; a.click(); }]] }; }
  if (/^mailto:/i.test(s)) return { k: "Email", rows: [["To", s.slice(7).split("?")[0]]], acts: [["✉️ Compose", () => location.href = s]] };
  if (/^tel:/i.test(s)) return { k: "Phone", rows: [["Number", s.slice(4)]], acts: [["📞 Call", () => location.href = s]] };
  if (m = s.match(/^(?:SMSTO|SMS):([^:]*):?(.*)$/i)) return { k: "SMS", rows: [["To", m[1]], ["Message", m[2] || "—"]], acts: [["💬 Send SMS", () => location.href = "sms:" + m[1] + (m[2] ? "?body=" + encodeURIComponent(m[2]) : "")]] };
  if (m = s.match(/^geo:(-?[\d.]+),(-?[\d.]+)/i)) return { k: "Location", rows: [["Lat,Lng", m[1] + "," + m[2]]], acts: [["📍 Open map", () => window.open(`https://www.google.com/maps?q=${m[1]},${m[2]}`, "_blank", "noopener")]] };
  return { k: "Text", rows: [["Content", s]], acts: [] };
}
function result(s, old) {
  const p = parse(s);
  if (!old) {
    if (store.get("ssave", true)) { const sc = store.get("scans", []); sc.unshift({ id: Date.now(), ts: Date.now(), data: s, k: p.k }); store.set("scans", sc.slice(0, 100)); }
    store.set("scanOk", store.get("scanOk", 0) + 1); if (store.get("vib", true)) navigator.vibrate?.(80); beep(); notify("Scanned " + p.k + ": " + s.slice(0, 40)); refresh();
  }
  const b = $("#sres"); b.hidden = false; b.innerHTML = ""; b.append(el("span", p.k, "tag"));
  p.rows.forEach(([a, v]) => { const r = el("p"); r.append(el("b", a + ": "), document.createTextNode(v)); b.append(r); });
  if (p.warn) b.append(el("p", p.warn));
  const row = el("div", null, "row");
  row.append(btn("📋 Copy", () => navigator.clipboard.writeText(s).then(() => toast("Copied"))));
  p.acts.forEach(([l, f]) => row.append(btn(l, f, "pr")));
  row.append(btn("▦ Make QR", () => { if (cur !== "text") resetPreview(); cur = "text"; scanning = false; view("dash"); mode(false); renderForm(); $("#f_text").value = s; })); b.append(row);
}
function drawScans() {
  const sc = store.get("scans", []), ul = $("#slist"); ul.innerHTML = sc.length ? "" : `<li><small>${t("nores")}</small></li>`;
  sc.slice(0, 8).forEach(i => {
    const li = el("li"), d = el("div", null, "t"); d.append(el("b", i.data), el("small", i.k + " • " + ago(i.ts)));
    li.append(d, btn("View", () => result(i.data, 1)), btn("🗑", () => { store.set("scans", store.get("scans", []).filter(z => z.id !== i.id)); refresh(); })); ul.append(li);
  });
}
$("#sclr").onclick = () => { store.set("scans", []); refresh(); };

// ---------- stats / activity / chart ----------
const bytes = (n) => n < 1024 ? n + " B" : n < 1048576 ? (n / 1024).toFixed(1) + " KB" : (n / 1048576).toFixed(1) + " MB";
const COL = ["#2563eb", "#ec4899", "#8b5cf6", "#06b6d4", "#10b981", "#f97316", "#eab308", "#14b8a6", "#ef4444", "#64748b"];
function refresh() {
  const h = store.get("hist", []), day = Date.now() - 864e5, today = h.filter(i => i.ts > day).length, bn = lang === "bn";
  const card = (i, l, n, s) => `<div class="stat"><i>${ico(i)}</i><div><small>${l}</small><h2>${n}</h2><span>${s}</span></div></div>`;
  $("#stats").innerHTML = card("qr", bn ? "মোট QR কোড" : "Total QR Codes", h.length, "+" + today + (bn ? " আজ" : " today")) + card("image", bn ? "আপলোড করা ছবি" : "Images Uploaded", h.filter(i => i.type === "image").length, "Image QR") +
    card("type", bn ? "টেক্সট QR" : "Text QR Created", h.filter(i => i.type === "text").length, "text") + card("download", bn ? "মোট ডাউনলোড" : "Total Downloads", store.get("dl", 0), "PNG") + card("folder", bn ? "স্টোরেজ" : "Storage Used", bytes(h.reduce((a, i) => a + (i.sz || 0), 0)), bn ? "আপলোডকৃত ছবি" : "uploaded images");
  const rc = $("#recent"); rc.innerHTML = h.length ? "" : `<li><small>${t("noact")}</small></li>`;
  h.slice(0, 5).forEach(i => { const li = el("li"), d = el("div"); d.append(el("b", i.label), el("span", TYPES[i.type] ? nm(i.type) : i.type)); li.append(d, el("small", ago(i.ts))); rc.append(li); });
  const by = {}; h.forEach(i => by[i.type] = (by[i.type] || 0) + 1); const ent = Object.entries(by).sort((a, b) => b[1] - a[1]); let acc = 0;
  $("#donut").style.background = ent.length ? `conic-gradient(${ent.map(([k, n], j) => { const a = acc; acc += n / h.length * 100; return `${COL[j % 10]} ${a}% ${acc}%`; }).join(",")})` : "var(--in)";
  $("#dtot").textContent = h.length; $("#legend").innerHTML = ent.map(([k, n], j) => `<span><i style="background:${COL[j % 10]}"></i>${nm(k).replace(" QR", "")} ${n}</span>`).join("");
  $("#qm").textContent = store.get("scans", []).filter(s => s.ts > Date.now() - 30 * 864e5).length; $("#qt").textContent = today;
  const ok = store.get("scanOk", 0), bad = store.get("scanFail", 0); $("#qs").textContent = ok + bad ? Math.round(ok / (ok + bad) * 100) + "%" : "–";
  drawScans(); gsearch();
}
const matches = (q) => store.get("hist", []).filter(i => (i.label + i.data + i.type).toLowerCase().includes(q));
const goK = (k) => { view("dash"); if (k === "scan") mode(true); else { if (k !== cur) resetPreview(); cur = k; mode(false); renderForm(); } setActive(); $("#work").scrollIntoView({ behavior: "smooth" }); };
const viewItem = (i) => { cur = i.type; last = i; scanning = false; view("dash"); mode(false); renderForm(); if (i.d) { D = { ...DEF, ...i.d }; drawStudio(); } show(i.data); $("#work").scrollIntoView({ behavior: "smooth" }); };
const goNav = (g) => { if (g === "hist") { $("#filt").value = ""; view("hist"); } else if (g === "fav") { $("#filt").value = "fav"; view("hist", t("fav")); } else if (g === "ana") { view("dash"); $("#quick").scrollIntoView({ behavior: "smooth" }); } else view(g); };
function searchAll(q) {
  const out = [], has = (...a) => a.join(" ").toLowerCase().includes(q);
  ORDER.forEach(k => { if (has(nm(k), ALL[k].n, ALL[k].d, NB[k] || "")) out.push({ ic: TICON[k], t: nm(k), s: "Tool", go: () => goK(k) }); });
  [["hist", t("mycodes"), "folder"], ["fav", t("fav"), "heart"], ["tpl", t("tpl"), "grid"], ["set", t("set"), "gear"], ["ana", t("ana"), "chart"]].forEach(([g, n, ic]) => { if (has(n, g)) out.push({ ic, t: n, s: "Page", go: () => goNav(g) }); });
  matches(q).slice(0, 6).forEach(i => out.push({ ic: TICON[i.type] || "qr", t: i.label, s: (TYPES[i.type] ? nm(i.type) : i.type) + " • " + ago(i.ts), go: () => viewItem(i) }));
  store.get("scans", []).filter(z => z.data.toLowerCase().includes(q)).slice(0, 3).forEach(z => out.push({ ic: "scan", t: z.data, s: "Scan • " + ago(z.ts), go: () => { goK("scan"); result(z.data, 1); } }));
  return out;
}
function gsearch() {
  const q = $("#gs").value.trim().toLowerCase(), box = $("#sr"); if (!q) { box.hidden = true; $("#cnt").textContent = ""; return; }
  const r = searchAll(q); $("#cnt").textContent = r.length + " " + t("res"); box.innerHTML = ""; box.hidden = false;
  if (!r.length) box.append(el("div", "No results for “" + $("#gs").value.trim() + "”", "si"));
  r.forEach(x => { const d = el("div", null, "si"), ic = el("i"); ic.innerHTML = ico(x.ic); const tx = el("div"); tx.append(el("b", x.t), el("small", x.s)); d.append(ic, tx); d.onclick = () => { box.hidden = true; x.go(); }; box.append(d); });
  if (r.length) { const all = el("div", "See all in " + t("mycodes"), "si all"); all.onclick = () => { box.hidden = true; $("#q").value = $("#gs").value; $("#filt").value = ""; view("hist"); }; box.append(all); }
}
const goSearch = () => { const r = searchAll($("#gs").value.trim().toLowerCase()); if (r[0]) { $("#sr").hidden = true; r[0].go(); } };
$("#gs").oninput = $("#gs").onfocus = gsearch; $("#gs").onkeydown = (e) => { if (e.key === "Enter") goSearch(); if (e.key === "Escape") $("#sr").hidden = true; };
document.addEventListener("click", (e) => { if (!e.target.closest(".search")) $("#sr").hidden = true; });

// ---------- voice search (Web Speech API) ----------
const SR = window.SpeechRecognition || window.webkitSpeechRecognition; let rec = null;
$("#mic").onclick = () => {
  if (!SR) return toast("Voice search is not supported in this browser (try Chrome).");
  if (rec) { rec.stop(); return; }
  rec = new SR(); rec.lang = lang === "bn" ? "bn-BD" : "en-US"; $("#mic").classList.add("on");
  rec.onresult = (e) => { $("#gs").value = e.results[0][0].transcript; gsearch(); $("#gs").focus(); };
  rec.onerror = (e) => toast(e.error === "not-allowed" ? "Microphone permission denied" : "Voice error: " + e.error);
  rec.onend = () => { rec = null; $("#mic").classList.remove("on"); };
  try { rec.start(); toast("🎤 Listening..."); } catch { rec = null; }
};

// ---------- history ----------
function hist() {
  const q = $("#q").value.toLowerCase(), f = $("#filt").value, h = matches(q).filter(i => !f || i.fav), ul = $("#list");
  ul.innerHTML = h.length ? "" : `<li><small>${t("nores")}</small></li>`;
  h.forEach(i => {
    const li = el("li"), d = el("div", null, "t"); d.append(el("b", i.label), el("small", (TYPES[i.type] ? nm(i.type) : i.type) + " • " + ago(i.ts)));
    const act = (fn) => () => { const all = store.get("hist", []); fn(all, all.find(z => z.id === i.id)); refresh(); hist(); };
    li.append(d, btn("View", () => { cur = i.type; last = i; scanning = false; view("dash"); mode(false); renderForm(); if (i.d) { D = { ...DEF, ...i.d }; drawStudio(); } show(i.data); $("#work").scrollIntoView({ behavior: "smooth" }); }),
      btn(i.fav ? "★" : "☆", act((a, it) => { it.fav = it.fav ? 0 : 1; store.set("hist", a); })), btn("🗑", act((a) => store.set("hist", a.filter(z => z.id !== i.id))))); ul.append(li);
  });
}
$("#q").oninput = $("#filt").onchange = hist;
$("#clr").onclick = () => { if (confirm("Delete all history?")) { store.set("hist", []); refresh(); hist(); } };

// ---------- templates (real design presets) ----------
function drawTpl() { const g = $("#tgrid"); g.innerHTML = ""; PRESETS.forEach(x => g.append(presetCard(x, true))); }

// ---------- settings ----------
const ACC = [["#2563eb", "#7c3aed"], ["#059669", "#0891b2"], ["#e11d48", "#f97316"], ["#7c3aed", "#db2777"], ["#d97706", "#ea580c"], ["#0f766e", "#2563eb"]];
function themeDark() { const m = store.get("theme", "dark"); return m === "auto" ? matchMedia("(prefers-color-scheme: dark)").matches : m === "dark"; }
function applySettings() {
  const r = document.documentElement, A = ACC[store.get("accent", 0)] || ACC[0];
  r.style.setProperty("--pr", A[0]); r.style.setProperty("--g", `linear-gradient(135deg,${A[0]},${A[1]})`); r.style.setProperty("--bl", store.get("blur", 26) + "px");
  r.classList.toggle("noanim", !store.get("anim", true)); r.style.fontSize = ["14px", "16px", "18px"][store.get("fsz", 1)];
  const m = $(".marq"); if (m) m.hidden = !store.get("banner", true);
}
function drawSettings() {
  const b = $("#sbody"); b.innerHTML = ""; const g = el("div", null, "sg2");
  const sec = (title, sub) => { const c = el("div", null, "sc"); c.append(ih("h3", title)); if (sub) c.append(el("small", sub)); g.append(c); return c; };
  const row = (c, label, ctl, hint) => { const r = el("div", null, "sr"), d = el("div"); d.append(el("span", label)); if (hint) d.append(el("small", hint)); r.append(d, ctl); c.append(r); };
  const sel = (arr, val, fn) => { const s = el("select"); arr.forEach(([v, n]) => { const o = el("option", n); o.value = v; s.append(o); }); s.value = val; s.onchange = () => fn(s.value); return s; };
  const chk = (val, fn) => { const l = el("label", null, "sw"), i = el("input"); i.type = "checkbox"; i.checked = val; i.onchange = () => fn(i.checked); l.append(i, el("i")); return l; };
  const inp = (type, val, fn, ex) => { const i = el("input"); i.type = type; Object.assign(i, ex || {}); i.value = val; i.onchange = () => fn(i.value); i.style.width = type === "text" ? "150px" : "auto"; return i; };

  let c = sec("🎨 Appearance", "Make QR Hub look the way you like");
  row(c, "Theme", sel([["dark", "Dark"], ["light", "Light"], ["auto", "Auto (system)"]], store.get("theme", "dark"), v => { store.set("theme", v); setDark(themeDark()); }));
  const sw = el("div", null, "sws"); ACC.forEach(([a, z], i) => { const k = el("button", null, "swc"); k.style.background = `linear-gradient(135deg,${a},${z})`; if (store.get("accent", 0) === i) k.style.outline = "3px solid var(--tx)"; k.onclick = () => { store.set("accent", i); applySettings(); drawSettings(); }; sw.append(k); });
  row(c, "Accent color", sw);
  row(c, "Glass blur", inp("range", store.get("blur", 26), v => { store.set("blur", +v); applySettings(); }, { min: 6, max: 44 }), "Liquid-glass intensity");
  row(c, "Text size", sel([[0, "Small"], [1, "Normal"], [2, "Large"]], store.get("fsz", 1), v => { store.set("fsz", +v); applySettings(); }));
  row(c, "Animations", chk(store.get("anim", true), v => { store.set("anim", v); applySettings(); }), "Turn off for a faster, calmer UI");
  row(c, "Top banner", chk(store.get("banner", true), v => { store.set("banner", v); applySettings(); }));

  c = sec("🌐 General");
  row(c, "Language / ভাষা", sel([["en", "English"], ["bn", "বাংলা"]], lang, setLang));
  row(c, "Start with", sel(Object.keys(TYPES).map(k => [k, TYPES[k].n]), store.get("deftype", "text"), v => store.set("deftype", v)), "Default QR type");
  row(c, "Browser notifications", chk(store.get("bn", false), async v => {
    if (v && !("Notification" in window)) { toast("Notifications not supported here"); return drawSettings(); }
    if (v && Notification.permission !== "granted" && await Notification.requestPermission() !== "granted") { toast("Permission denied"); return drawSettings(); }
    store.set("bn", v); if (v) notify("Notifications enabled ✅");
  }), "Alerts when a QR is created or scanned");

  c = sec("▦ QR defaults");
  row(c, "Error correction", sel([["L", "L — 7%"], ["M", "M — 15%"], ["Q", "Q — 25%"], ["H", "H — 30%"]], store.get("ecc", "Q"), v => { store.set("ecc", v); if (last) show(last.data); }), "Higher = more damage-tolerant");
  row(c, "Quiet zone", inp("number", store.get("qz", 4), v => { store.set("qz", Math.min(8, Math.max(1, +v || 4))); if (last) show(last.data); }, { min: 1, max: 8 }), "Margin in modules");
  row(c, "Export size", sel([[256, "256 px"], [512, "512 px"], [1024, "1024 px"]], D.size, v => { D = { ...D, size: +v }; store.set("design", D); if (last) show(last.data); }));
  row(c, "Download format", sel([["png", "PNG"], ["jpeg", "JPG"], ["webp", "WEBP"]], store.get("fmt", "png"), v => store.set("fmt", v)));
  row(c, "File name prefix", inp("text", store.get("prefix", "qrhub"), v => store.set("prefix", v.replace(/[^\w-]/g, "") || "qrhub")));
  row(c, "Auto-download", chk(store.get("autodl", false), v => store.set("autodl", v)), "Save the image right after generating");
  row(c, "Design", btn("Reset to default", () => { D = { ...DEF }; store.set("design", D); drawStudio(); if (last) show(last.data); toast("Design reset"); }), "Back to the default QR design");

  c = sec("📷 Scanner");
  row(c, "Default camera", sel([["environment", "Back"], ["user", "Front"]], store.get("cam", "environment"), v => { store.set("cam", v); face = v; }));
  row(c, "Continuous scan", chk(store.get("cont", false), v => { store.set("cont", v); $("#cont").checked = v; }));
  row(c, "Beep sound", chk(store.get("snd", true), v => { store.set("snd", v); $("#snd").checked = v; }));
  row(c, "Vibration", chk(store.get("vib", true), v => store.set("vib", v)));
  row(c, "Save scans to history", chk(store.get("ssave", true), v => store.set("ssave", v)));
  row(c, "Scan history", btn("Clear", () => { store.set("scans", []); refresh(); toast("Scan history cleared"); }));

  c = sec("💾 History & data");
  row(c, "Auto-save QR to history", chk(store.get("auto", true), v => store.set("auto", v)));
  row(c, "History limit", sel([[50, "50"], [200, "200"], [500, "500"], [1000, "1000"]], store.get("hlimit", 200), v => store.set("hlimit", +v)));
  const used = Object.keys(localStorage).filter(k => k.startsWith("qrhub.")).reduce((a, k) => a + k.length + (localStorage.getItem(k) || "").length, 0);
  row(c, "Data on this device", el("b", bytes(used * 2)), "Everything stays in your browser");
  const imp = el("input"); imp.type = "file"; imp.accept = "application/json"; imp.hidden = true;
  imp.onchange = async () => { try { const d = JSON.parse(await imp.files[0].text()); if (!Array.isArray(d.hist)) throw 0; store.set("hist", d.hist.slice(0, store.get("hlimit", 200))); store.set("scans", d.scans || []); refresh(); toast("Imported " + d.hist.length + " items"); } catch { toast("Invalid backup file"); } };
  const dr = el("div", null, "row"); dr.append(
    btn("⬇ Export", () => { const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([JSON.stringify({ hist: store.get("hist", []), scans: store.get("scans", []) }, null, 1)], { type: "application/json" })); a.download = "qrhub-backup.json"; a.click(); }),
    btn("⬆ Import", () => imp.click()), btn("🗑 QR history", () => { if (confirm("Delete all QR history?")) { store.set("hist", []); refresh(); drawSettings(); } }),
    btn("⚠ Reset all", () => { if (confirm("Erase ALL QR Hub data and settings on this device?")) { Object.keys(localStorage).filter(k => k.startsWith("qrhub.")).forEach(k => localStorage.removeItem(k)); location.reload(); } }), imp); c.append(dr);

  c = sec("ℹ️ App");
  row(c, "Install QR Hub", btn("⬇ Install / Details", doInstall, "pr"), standalone() ? "Installed on this device" : "Works offline, opens full-screen");
  row(c, "Version", el("b", "QR Hub v8"), "Developed by SR Infinity • Free forever");
  b.append(g);
}

// ---------- navigation ----------
function view(v, title) {
  ["dash", "hist", "tpl", "set"].forEach(x => $("#v-" + x).hidden = x !== v);
  if (v === "hist") { $("#ht").textContent = title || t("mycodes"); hist(); } if (v === "tpl") drawTpl(); if (v === "set") drawSettings();
  $("#side").classList.remove("open"); if (v !== "dash") stopCam(); setActive();
}
function mode(sc) { scanning = sc; $("#m-create").hidden = sc; $("#m-scan").hidden = !sc; $("#wt").textContent = sc ? t("scanner") : t("your"); $("#wd").textContent = sc ? "" : TYPES[cur].d + " — " + nm(cur); if (!sc) stopCam(); else setCam(false); setActive(); }
document.addEventListener("click", (e) => {
  const k = e.target.closest("[data-k]")?.dataset.k, g = e.target.closest("[data-go]")?.dataset.go;
  if (k) { view("dash"); if (k === "scan") mode(true); else { if (k !== cur) resetPreview(); cur = k; mode(false); renderForm(); } $("#work").scrollIntoView({ behavior: "smooth" }); }
  else if (g) {
    if (g === "dash") { view("dash"); mode(false); scrollTo({ top: 0, behavior: "smooth" }); }
    else if (g === "hist") { $("#filt").value = ""; view("hist"); } else if (g === "fav") { $("#filt").value = "fav"; view("hist", t("fav")); }
    else if (g === "ana") { view("dash"); $("#quick").scrollIntoView({ behavior: "smooth" }); } else view(g);
  }
  if (e.target.closest("#va")) { $("#filt").value = ""; view("hist"); }
  if (e.target.closest("#menu")) $("#side").classList.toggle("open");
});
$("#ov").onclick = () => $("#side").classList.remove("open");
function setDark(d) { document.documentElement.dataset.t = d ? "dark" : ""; $("#dark").checked = d; if (!$("#v-set").hidden) drawSettings(); }
$("#dark").onchange = () => { store.set("theme", $("#dark").checked ? "dark" : "light"); setDark($("#dark").checked); };
function setLang(l) { lang = l; store.set("lang", l); applyLang(); renderUI(); renderForm(); mode(scanning); drawNotes(); refresh(); if (!$("#v-set").hidden) drawSettings(); if (!$("#v-tpl").hidden) drawTpl(); }
$("#lg").onclick = () => setLang(lang === "en" ? "bn" : "en");
let ip = null;
const standalone = () => matchMedia("(display-mode: standalone)").matches || navigator.standalone;
function drawInst() { $("#inst small").textContent = standalone() ? "Installed ✓" : ip ? "Ready • 1 click" : "Free • Offline • Fast"; }
addEventListener("beforeinstallprompt", (e) => { e.preventDefault(); ip = e; drawInst(); });
addEventListener("appinstalled", () => { ip = null; notify("QR Hub installed 🎉"); toast("🎉 QR Hub installed!"); drawInst(); });
function instDetails() {
  const m = $("#mc"), ua = navigator.userAgent, ios = /iphone|ipad|ipod/i.test(ua), and = /android/i.test(ua), ff = /firefox/i.test(ua), edge = /edg/i.test(ua); m.innerHTML = ""; $("#modal").hidden = false;
  const h = el("div", null, "ih"), hi = el("img"); hi.src = logoImg.src; const hd = el("div"); hd.append(el("h2", "Install QR Hub"), el("small", "Progressive Web App • no app store needed")); h.append(hi, hd); m.append(h);
  const t2 = el("table", null, "it"); [["Version", "v8"], ["Size", "< 1 MB (cached for offline)"], ["Price", "Free forever"], ["Works offline", "Yes — generator, designs, scanner & history"], ["Permissions", "Camera (scanner), optional notifications"], ["Status", standalone() ? "Already installed on this device" : "Not installed"]].forEach(([a, b]) => { const r = el("tr"); r.append(el("td", a), el("td", b)); t2.append(r); }); m.append(t2);
  const ul = el("ul"); ["Opens in its own window — no browser bar", "Home-screen / desktop icon", "Faster launch & offline use", "Updates automatically"].forEach(x => ul.append(el("li", x))); m.append(ul);
  m.append(el("h4", "How to install on this device"));
  const ol = el("ol"); (ios ? ["Open this site in Safari", "Tap the Share button", "Choose “Add to Home Screen”, then Add"] : and ? ["Open this site in Chrome", "Tap the ⋮ menu", "Choose “Install app” (or “Add to Home screen”)"] : ff ? ["Firefox desktop can’t install web apps — open this site in Chrome or Edge", "Firefox on Android: menu ⋮ → Install"] : [edge ? "Open the ⋯ menu → Apps → Install this site as an app" : "Click the install icon ⊕ at the right of the address bar", "Or open menu ⋮ → “Install QR Hub…”", "Confirm Install"]).forEach(x => ol.append(el("li", x))); m.append(ol);
  m.append(el("small", "The one-click install button appears only on HTTPS sites in supported browsers (Chrome/Edge/Android). If it is missing, follow the steps above."));
  const r = el("div", null, "row"); if (ip) r.append(btn("⬇ Install now", () => { $("#modal").hidden = true; doInstall(); }, "pr")); r.append(btn("Close", () => $("#modal").hidden = true)); m.append(r);
}
async function doInstall() {
  if (standalone()) return instDetails();
  if (ip) { ip.prompt(); const r = await ip.userChoice; ip = null; drawInst(); if (r.outcome === "accepted") toast("Installing..."); return; }
  instDetails();
}
$("#inst").onclick = doInstall;
if ("serviceWorker" in navigator && location.protocol.startsWith("http")) navigator.serviceWorker.register("./sw.js").catch(() => {});
(function () { let p = 0; const x = setInterval(() => { p += 5; $("#bar").style.width = p + "%"; if (p >= 100) { clearInterval(x); const s = $("#splash"); s.style.opacity = 0; setTimeout(() => s.remove(), 400); } }, 30); })();

applySettings(); setDark(themeDark()); applyLang(); renderUI(); renderForm(); drawNotes(); refresh(); setCam(false);
drawStudio(); drawInst();
$("#cont").checked = store.get("cont", false); $("#snd").checked = store.get("snd", true);
$("#cont").onchange = () => store.set("cont", $("#cont").checked); $("#snd").onchange = () => store.set("snd", $("#snd").checked);
matchMedia("(prefers-color-scheme: dark)").addEventListener?.("change", () => store.get("theme", "dark") === "auto" && setDark(themeDark()));
function drawHero() { try { const c = renderQR(location.href.split("#")[0], { ...DEF, body: "liq", eye: "rd", pupil: "ci", fg: "#1e1b4b", bg: "#ffffff" }, 240).c, h = $("#hqc"); h.width = c.width; h.height = c.height; h.getContext("2d").drawImage(c, 0, 0); } catch {} }
drawHero();
