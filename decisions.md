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
