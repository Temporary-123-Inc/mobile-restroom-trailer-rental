# Decisions

## 2026-10-07

- Preserved the Portable Food Bank React/Vite architecture, static prerendering, route data model, four hero variations, and responsive component system.
- Removed the reference company phone number because it is not present in the authoritative target JSON.
- Replaced phone-first CTAs with quote/availability links and retained honest static-form disclosure.
- Used the JSON H1 and description verbatim on state and city pages instead of hardcoded location headings.
- Retained all 50 state and 246 city records because the owner explicitly requested exact JSON page coverage.
- Restroom imagery leads the homepage; kitchen/dishwasher/refrigerator pricing remains JSON-backed and city discounts apply only where supplied.
- Added the 44 owner-supplied equipment/category URLs as direct pages using one shared inventory-detail shell. Unsupported dimensions, capacities, amenities, and guarantees were not inferred from slugs or images; those details remain quote-based.
- Added every requested inventory page to a family-grouped footer directory, the prerender route list, metadata generation, and XML sitemap.
- Added the supplied accreditation artwork as a responsive, lazy-loaded trust strip immediately above the shared footer.
- Added a reusable state/city/service lead form in a sticky global panel and on the contact page.
- Added `1-888-385-9424` to header, homepage, contact, footer, sticky-form, and final CTA surfaces. “24/7” is limited to emergency contact support; the site still requires confirmation for inventory, delivery, dispatch, setup, and response timing.

## 2026-10-08

- Applied the owner’s corrected taxonomy site-wide: the Restroom Family is sleepers, restroom and shower, laundry, and handwashing trailers. Kitchen, dishwashing, and refrigeration are displayed as supporting inventory without altering the supplied location JSON or its pricing and ETA facts.
- Replaced JSON-provided kitchen-led state and city H1/description presentation with deterministic location-specific restroom copy. Removed kitchen equipment, kitchen pricing tables, kitchen rental information, and general FAQs from state/city templates while preserving their URL slugs, breadcrumbs, location facts, ETA, availability, articles, and nearby-area links.
- Rebuilt the calculator around the attached restroom workbook: five shower-restroom configurations and four workbook-defined rental periods. Numeric cells render as prices, textual ranges render as normalized currency ranges, and the fully blank 3-stall + 1 ADA row renders as “Quote required.” Location remains a planning input but does not alter the workbook price.
- Replaced the location data source with `site-36-restroom.json` after confirming an exact 246/246 city-slug match, 50 states, no duplicate slugs, no reused incident URLs, and no prohibited placeholders. State/city pages now display the JSON restroom H1/description, $2,995 starting price, restroom inventory wording, ETA/distance, service hours, rental terms, restroom process, FAQs, assigned article, and nearby areas. The earlier short-/long-term H1 requirement is retained as a suffix.
- Differentiated the site from its base template through a CSS-only field-operations visual system: deep-pine and signal-amber colors, condensed display typography, technical grid texture, clipped-corner panels, squared controls, asymmetric hero composition, and a structured dark footer. Page content, routing, and data remained unchanged.

## 2026-10-10

- Replaced the text wordmark in the shared header and footer with the owner-supplied WebP logo. The same local asset now supplies the standard favicon and Apple touch icon, avoiding a runtime dependency on the WordPress source URL.
- Routed the shared lead form and service-page quick form through a same-origin Vercel function to the supplied Glide webhook. The Glide token and endpoint are server-only environment variables; the API validates the payload, canonicalizes source URLs to the production domain, checks browser origin and consent, uses a honeypot, and applies a bounded per-instance request limit. The calculator remains browser-only and does not submit data.
- Capped every H1 variant at 47px for viewport widths of 901px and above. Existing responsive H1 rules remain active for tablet and mobile widths.
- Added an explicit `index, follow` robots directive to every prerendered canonical page and a `noindex, follow` directive to the generated 404 document. Removed the SPA catch-all rewrite because every published route is statically prerendered; this lets unknown paths return the generated 404 response instead of a soft-404 homepage response.
- Consolidated 10 legacy/alternate routes into direct permanent redirects to their preferred service or directory URL. These aliases are no longer emitted as indexable HTML or included in the sitemap, keeping the indexable HTML inventory aligned one-to-one with the canonical sitemap.
