# ACD Hotels Chennai — website

A rebuild of the ACD Hotels (Advanced Comfort Dwelling) capsule-hotel site: same photography and
same copy as the live site, with a more responsive layout, more motion, and a WhatsApp booking
flow that sends reservations to **+91 7397 260 932**.

## Run it

```bash
python3 serve.py          # http://127.0.0.1:4174/
python3 serve.py 8080     # or pick a port
```

Any static host works — there is no build step and no server-side code. Upload the folder
contents as-is to Netlify, Vercel, GitHub Pages, or ordinary shared hosting.

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
(₹800 single / ₹1500 double × rooms × nights). Submitting opens WhatsApp to
`wa.me/917397260932` with the whole reservation pre-written. Nothing is charged — the site
states "Pay at Hotel", matching the hotel's policy.

To change the number, edit `WA_NUMBER` at the top of `assets/js/main.js` and the `wa.me` and
`tel:` links in `index.html`.

## Notes

- Content is limited to what the live site publishes: two room types, six amenities, nine gallery
  images, six Google reviews, the 4.8 rating, and the 12:00 PM / 11:00 AM check-in times.
- Room "SOLD OUT" badges and pod counts (14 single, 4 double) mirror the live site. Remove the
  `badge-sold` spans in `index.html` when availability returns.
- Motion respects `prefers-reduced-motion`; the marquee, Ken Burns pan, parallax, and cursor glow
  all switch off for users who ask for reduced motion.
- Verified at 320, 390, 768, 1440 px with no horizontal overflow and no console errors.
