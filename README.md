# QR Hub

Free QR code generator and scanner that runs in the browser and installs as an app (PWA).

**Live site:** https://shohelrana15.github.io/image-qr-generator/

## Features

- Create QR codes from an image (crop, upload, generate), text, URL, WiFi, contact (vCard), location, WhatsApp, email, phone, SMS and social media links
- Scan QR codes with the camera or from a gallery image
- Download or share the generated QR code as PNG
- Dark mode, English / Bengali interface, in-page search
- Installable PWA with offline support and automatic updates

## Project structure

| File | Purpose |
| --- | --- |
| `index.html` | Page markup |
| `style.css` | Styles |
| `script.js` | App logic |
| `sw.js` | Service worker (caching and updates) |
| `manifest.json` | PWA manifest |
| `icon-192.png`, `icon-512.png` | App icons |
| `welcome-photo.webp`, `qr-sample.png` | Images |

## Libraries (pinned versions)

Supabase JS 2.45.4, qrcode 1.5.4, html5-qrcode 2.3.8, Cropper.js 1.6.2, Font Awesome 6.7.2

## Releasing an update

1. Edit the files.
2. Change `APP_VERSION` at the top of `sw.js` (for example `"5.8"`). This clears old caches on every user's device.
3. Commit and push. GitHub Pages deploys automatically, and installed apps update themselves.

## Supabase setup (Image QR)

Image QR uploads to a public Storage bucket named `images`. In Supabase, make sure that:

- the bucket is public (so the QR link opens for everyone),
- the Storage policy allows only `INSERT` for the `anon` role (no `UPDATE`/`DELETE`),
- a file size limit (10 MB) and allowed types (`image/png`, `image/jpeg`, `image/webp`) are set on the bucket.

The key in `script.js` is a publishable (public) key, which is safe in browser code only when these policies are in place.

## License

All rights reserved. Developed by Shohel Rana, SR Infinity.
