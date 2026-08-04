# ACD Hotels Chennai — website

A rebuild of the ACD Hotels (Advanced Comfort Dwelling) capsule-hotel site: same photography and
same copy as the live site, with a more responsive layout, more motion, and a WhatsApp booking
flow that sends reservations to **+91 7397 260 932**.

## Run it locally

There is no build step and no dependencies — it is plain HTML, CSS and JavaScript.

```bash
cd acd-hotels-website
python3 serve.py          # http://127.0.0.1:4174/
python3 serve.py 8080     # or pick a different port
```

Open the printed URL in a browser. Press `Ctrl+C` to stop.

Opening `index.html` directly with a `file://` path mostly works, but a local server is better —
some browsers block parts of the page over `file://`.

## Deploy to Hostinger

Hostinger shared hosting serves static files directly, so no Node, PHP or database is needed.

**1. Prepare the upload.** Zip the *contents* of this folder (not the folder itself), so that
`index.html` sits at the top level of the zip. Include the hidden `.htaccess` file. You can skip
`README.md` and `serve.py`.

**2. Upload.** In hPanel go to **Websites → your site → Dashboard → File Manager**, open
`public_html`, and delete Hostinger's placeholder `default.php` / `index.html` if present. Upload
your zip into `public_html`, then right-click it and choose **Extract**. Delete the zip afterwards.

`public_html/index.html` must exist — if the files end up inside `public_html/acd-hotels-website/`,
move them up one level or the domain will show a directory listing.

Prefer FTP? Create an FTP account under **Files → FTP Accounts**, connect with FileZilla, and drag
the contents into `public_html`.

**3. Point the domain.** If the domain was bought from Hostinger it is already connected. If it is
registered elsewhere, set its nameservers at the current registrar to:

```
ns1.dns-parking.com
ns2.dns-parking.com
```

DNS changes usually take a few hours to propagate, occasionally up to 24.

**4. Turn on HTTPS.** Go to **Security → SSL**, install the free Let's Encrypt certificate for the
domain, and wait for it to show as active. The included `.htaccess` then redirects all HTTP
traffic to HTTPS automatically — leave SSL off and that redirect will loop, so install the
certificate before relying on it.

**5. Check it.** Load the domain in a private window and confirm the padlock, the hero slideshow,
and the WhatsApp button. If you see an old version, clear the cache in
**Advanced → Cache Manager**.

**One edit worth making before launch:** in `index.html` the structured-data block near the top
has `"url": "https://acdhotels.in/"`. Change it to whatever domain you are actually launching on,
so Google associates the listing with the right site.

## Layout

```
index.html          single page, all sections
assets/css/style.css
assets/js/main.js   slider, reveals, lightbox, booking flow
assets/img/         photos from the live site; *-sm.jpg are 900px srcset variants
serve.py            local preview server
```

## Booking

"Book Now" opens a two-question chooser (who's travelling, how many rooms), then the booking
panel. The guest fills name, phone, dates, and one or more room rows; the summary prices it live
(₹900 single / ₹1500 double × rooms × nights). Submitting opens WhatsApp to
`wa.me/917397260932` with the whole reservation pre-written. Nothing is charged — the site
states "Pay at Hotel", matching the hotel's policy.

To change the number, edit `WA_NUMBER` at the top of `assets/js/main.js` and the `wa.me` and
`tel:` links in `index.html`.

## Notes

- Content is limited to what the live site publishes: two room types, six amenities, nine gallery
  images, six Google reviews, the 4.8 rating, and the 12:00 PM / 11:00 AM check-in times.
- Room cards show the pod counts from the live site (14 single, 4 double). The live site's
  "SOLD OUT" badges are deliberately not carried over — the rooms read as bookable.
- Motion respects `prefers-reduced-motion`; the marquee, Ken Burns pan, parallax, and cursor glow
  all switch off for users who ask for reduced motion.
- Verified at 320, 390, 768, 1440 px with no horizontal overflow and no console errors.
