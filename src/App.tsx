import { useEffect, useMemo, useState } from 'react'
import { ArrowRight, Check, ChevronDown, ChevronLeft, ChevronRight, Clock3, MapPin, Menu, PhoneCall, Ruler, X } from 'lucide-react'
import { cities, citiesForState, cityBySlug, cityPath, inventoryDetailBySlug, inventoryDetailPages, locationDescription, locationH1, refrigeratorPrices, restroomFamilyServices, serviceH1, services, site, slugify, stateBySlug, statePages, statePath, supportingServices, trailerOptions, type City, type InventoryDetailPage } from './data'

const money = (value: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value)
const currentPath = () => typeof window === 'undefined' ? '/' : window.location.pathname
const brandName = 'Mobile Restroom Trailer Rental'
const phoneDisplay = '1-888-385-9424'
const phoneHref = 'tel:+18883859424'

function Link({ href, children, className = '' }: { href: string; children: React.ReactNode; className?: string }) {
  const onClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    if (!href.startsWith('/') || event.metaKey || event.ctrlKey) return
    event.preventDefault(); history.pushState({}, '', href); window.dispatchEvent(new Event('popstate')); window.scrollTo(0, 0)
  }
  return <a href={href} onClick={onClick} className={className}>{children}</a>
}

function Header() {
  const [open, setOpen] = useState(false)
  const [inventoryOpen, setInventoryOpen] = useState(false)
  return <>
    <a className="skip" href="#main">Skip to content</a>
    <header className="header"><div className="shell nav-wrap">
      <Link href="/" className="brand wordmark" aria-label={`${brandName} home`}><span>Mobile Restroom</span><strong>Trailer Rental</strong></Link>
      <nav aria-label="Main navigation" className={open ? 'nav open' : 'nav'}>
        <Link href="/">Home</Link><div className={`inventory-menu ${inventoryOpen ? 'open' : ''}`}><button type="button" aria-expanded={inventoryOpen} aria-controls="inventory-dropdown" onClick={() => setInventoryOpen(!inventoryOpen)}>Inventory <ChevronDown/></button><div className="inventory-dropdown" id="inventory-dropdown"><div><span>Restroom Family</span>{restroomFamilyServices.map((service) => <Link href={`/services/${service.slug}/`} key={service.slug}>{service.name}</Link>)}</div><div><span>Supporting inventory</span>{supportingServices.map((service) => <Link href={`/services/${service.slug}/`} key={service.slug}>{service.name}</Link>)}</div><Link className="inventory-all" href="/services/">View all nine services <ArrowRight/></Link></div></div><Link href="/service-areas/">Service Areas</Link><Link href="/rental-calculator/">Calculator</Link><Link href="/about-us/">About Us</Link><Link href="/blog/">Articles</Link><Link href="/contact-us/">Contact Us</Link>
      </nav>
      <a className="call-card" href={phoneHref} aria-label={`Call the 24/7 emergency support line at ${phoneDisplay}`}><PhoneCall/><span>24/7 emergency support<strong>{phoneDisplay}</strong></span></a>
      <button className="menu" aria-label={open ? 'Close navigation' : 'Open navigation'} aria-expanded={open} onClick={() => setOpen(!open)}>{open ? <X/> : <Menu/>}</button>
    </div></header>
  </>
}

function FooterInventory() {
  const restroomParents = new Set<string>(restroomFamilyServices.map((service) => service.slug))
  const familyFor = (page: InventoryDetailPage) => restroomParents.has(page.parentService) ? 'Restroom Family' : 'Supporting inventory'
  const groups = ['Restroom Family', 'Supporting inventory']
  return <div className="shell footer-inventory"><div className="footer-inventory-heading"><span className="eyebrow">Exact-path rental inventory</span><h2>Browse trailers and temporary facilities.</h2></div><div className="footer-inventory-groups">{groups.map((group) => <section key={group}><h3>{group}</h3>{inventoryDetailPages.filter((page) => familyFor(page) === group).map((page) => <Link href={`/${page.slug}/`} key={page.slug}>{page.name}</Link>)}</section>)}</div></div>
}

function Footer() {
  return <footer><div className="shell footer-grid"><div><Link href="/" className="brand footer-brand" aria-label={`${brandName} home`}><span>Mobile Restroom</span><strong>Trailer Rental</strong></Link><p>The Restroom Family includes sleepers, restroom and shower, laundry, and handwashing trailers, with kitchen, dishwashing, and refrigeration available as supporting inventory.</p></div><div><h3>Explore</h3><Link href="/services/">All nine facilities</Link><Link href="/service-areas/">Service areas</Link><Link href="/rental-calculator/">Starting estimator</Link></div><div><h3>Plan</h3><Link href="/about-us/">Rental process</Link><Link href="/contact-us/">Request availability</Link><Link href="/privacy/">Privacy</Link></div><div><h3>Request a quote</h3><a className="footer-phone" href={phoneHref}>{phoneDisplay}</a><p>Pricing, route timing, site fit, configuration, and final availability are confirmed through the company quote.</p></div></div><FooterInventory/><div className="shell copyright">© 2026 Mobile Restroom Trailer Rental. All rights reserved.</div></footer>
}

function AccreditationStrip() {
  return <section className="accreditation-strip" aria-labelledby="accreditation-title"><div className="shell"><h2 id="accreditation-title">We are accredited on:</h2><img src="/accreditation-logos.png" alt="Accreditation and registration logos: SAM.gov, U.S. Small Business Administration, Unique Entity Identifier, Dun & Bradstreet, and NAICS Association" width="1247" height="241" loading="lazy"/></div></section>
}

function LeadCaptureForm({ compact = false }: { compact?: boolean }) {
  const [stateName, setStateName] = useState('')
  const [citySlug, setCitySlug] = useState('')
  const [prepared, setPrepared] = useState(false)
  const availableCities = useMemo(() => stateName ? citiesForState(stateName) : [], [stateName])
  return <form className={compact ? 'lead-form compact' : 'lead-form'} onSubmit={(event) => { event.preventDefault(); setPrepared(true) }}><div className="lead-form-grid"><label>Full name<input name="name" autoComplete="name" required placeholder="Your name"/></label><label>Phone<input name="phone" type="tel" autoComplete="tel" required placeholder="Best callback number"/></label><label>Email<input name="email" type="email" autoComplete="email" required placeholder="name@company.com"/></label><label>State<select name="state" value={stateName} onChange={(event) => { setStateName(event.target.value); setCitySlug('') }} required><option value="">Choose a state</option>{statePages.map((state) => <option value={state.state} key={state.state}>{state.state}</option>)}</select></label><label>City<select name="city" value={citySlug} onChange={(event) => setCitySlug(event.target.value)} disabled={!stateName} required><option value="">Choose a city</option>{availableCities.map((city) => <option value={city.city_slug} key={city.city_slug}>{city.representative_city}</option>)}</select></label><label>Service needed<select name="service" required><option value="">Choose a service</option>{services.map((service) => <option value={service.slug} key={service.slug}>{service.name}</option>)}</select></label><label>Needed date<input name="needed_date" type="date"/></label><label>Rental term<select name="rental_term"><option value="">Choose a term</option><option>Short-term rental</option><option>Long-term rental</option><option>Emergency rental request</option><option>Not sure yet</option></select></label><label className="lead-wide">Project details<textarea name="details" rows={compact ? 3 : 5} required placeholder="Site access, dates, facility needs, utilities, and any urgent constraints"/></label></div><div className="lead-form-actions"><button className="button primary" type="submit">Prepare availability request <ArrowRight/></button><a href={phoneHref}><PhoneCall/> Call 24/7 emergency support: {phoneDisplay}</a></div>{prepared && <p className="form-note lead-status" role="status"><Check/> Your request details are ready. Form delivery is not configured yet, so no information was sent. Call {phoneDisplay} for 24/7 emergency support or connect Resend/Glide before enabling online delivery.</p>}</form>
}

function StickyLeadForm() {
  const [open, setOpen] = useState(false)
  return <aside className={`sticky-lead ${open ? 'open' : ''}`} aria-label="Quick rental availability request"><button className="sticky-lead-toggle" type="button" aria-expanded={open} aria-controls="sticky-lead-panel" onClick={() => setOpen(!open)}>{open ? <X/> : <PhoneCall/>}<span>{open ? 'Close request form' : 'Request availability'}</span></button><div id="sticky-lead-panel" className="sticky-lead-panel" aria-hidden={!open}><div className="sticky-lead-head"><span className="eyebrow">24/7 emergency contact support</span><h2>Tell us what the site needs.</h2><p>Prepare the location, service, and timing details for your rental request.</p></div><LeadCaptureForm compact/></div></aside>
}

function Layout({ children }: { children: React.ReactNode }) { return <><Header/><main id="main">{children}</main><AccreditationStrip/><Footer/><StickyLeadForm/></> }

function Breadcrumbs({ labels, hrefs }: { labels: string[]; hrefs: string[] }) {
  return <nav className="breadcrumbs shell" aria-label="Breadcrumb"><ol>{labels.map((label, index) => <li key={label}>{index < labels.length - 1 ? <Link href={hrefs[index]}>{label}</Link> : <span aria-current="page">{label}</span>}</li>)}</ol></nav>
}

function Carousel({ label = 'Restroom Family inventory' }: { label?: string }) {
  const images = restroomFamilyServices
  const [active, setActive] = useState(0)
  return <div className="carousel" aria-label={label}><img src={images[active].image} alt={`${images[active].name} available in the Restroom Family`} width="900" height="620"/><div className="carousel-caption"><span>{String(active + 1).padStart(2, '0')} / {String(images.length).padStart(2, '0')}</span><strong>{images[active].name}</strong><div><button aria-label="Previous inventory image" onClick={() => setActive((active + images.length - 1) % images.length)}><ChevronLeft/></button><button aria-label="Next inventory image" onClick={() => setActive((active + 1) % images.length)}><ChevronRight/></button></div></div></div>
}

function Hero({ h1, description, price, eta, availability, variation = 0, locationPage = false }: { h1: string; description: string; price: number; eta: string; availability: string; variation?: number; locationPage?: boolean }) {
  return <section className={`hero variation-${variation + 1}${locationPage ? ' location-hero' : ''}`}><div className="shell hero-grid"><div className="hero-copy"><span className="eyebrow">Restroom Family availability</span><h1>{h1}</h1><p>{description}</p><div className="hero-actions"><Link className="button primary" href="/contact-us/">Request availability <ArrowRight/></Link><Link className="text-link" href={locationPage ? '/services/restroom-trailers/' : '/rental-calculator/'}>{locationPage ? 'Explore restroom trailers' : 'Build a starting estimate'}</Link></div></div><div className="hero-side"><div className="status-row"><span className="status"><i/> {availability}</span></div><div className="metric-grid">{locationPage ? <div><small>Rental terms</small><strong>Short or long term</strong><span>quote-based availability</span></div> : <div><small>Starting at</small><strong>{money(price)}</strong><span>location estimate</span></div>}<div><small>Planning ETA</small><strong>{eta}</strong><span>route-dependent</span></div></div><Carousel/></div></div></section>
}

function HomeHero() {
  return <section className="home-hero"><div className="hero-rings"/><div className="shell home-hero-grid"><div className="home-hero-copy"><span className="hero-badge"><i/> Site-ready temporary facility planning</span><h1>Mobile Restroom Trailer Rental for Temporary Site Support</h1><p>Mobile restroom trailer rental gives project teams a temporary facility option while permanent spaces are unavailable or site needs change. The Restroom Family includes sleepers, restroom and shower, laundry, and handwashing trailers. Kitchen, dishwashing, and refrigeration remain available as supporting inventory. Request a quote to confirm current availability, configuration, delivery timing, setup, and site requirements.</p><div className="hero-actions"><Link className="button primary" href="/services/restroom-trailers/">Explore restroom rentals <ArrowRight/></Link><Link className="button ghost" href="#inventory">View all facilities</Link></div><small>Restroom-first planning, with the wider site inventory kept in view.</small></div><div className="home-hero-visual"><div className="visual-note"><span>Your project.</span><strong>Start with the restroom plan.</strong></div><div className="circle-image"><img src="/images/restroom.webp" alt="Mobile restroom trailer available for temporary site rental" width="900" height="620"/></div><div className="image-label"><span>Temporary facility planning</span><strong>Mobile restroom trailer rentals</strong></div><a className="hero-call" href={phoneHref}><span>24/7 emergency contact support</span><strong>{phoneDisplay}</strong></a></div></div><div className="shell hero-family-rail"><Link href="/services/restroom-trailers/"><strong>Restroom & shower</strong><span>Plan temporary hygiene facilities</span></Link><Link href="/services/sleeper-trailers/"><strong>Sleepers</strong><span>Support temporary accommodations</span></Link><Link href="/services/laundry-trailers/"><strong>Laundry</strong><span>Keep longer projects supplied</span></Link><Link href="/services/handwashing-trailers/"><strong>Handwashing</strong><span>Add dedicated sanitation capacity</span></Link></div></section>
}

function ServicesGrid() {
  const [filter, setFilter] = useState('all')
  const visible = services.filter((service) => filter === 'all' || (filter === 'restroom' ? service.family === 'Restroom Family' : service.family !== 'Restroom Family'))
  return <section className="section inventory" id="inventory"><div className="shell"><div className="section-head"><div><span className="eyebrow">Nine connected facility types</span><h2>Start with the restroom plan. Keep the whole site in view.</h2></div><p>Mobile restroom trailers lead the plan. The Restroom Family includes sleepers, restroom and shower, laundry, and handwashing trailers. Kitchen, dishwashing, and refrigeration remain visible as supporting inventory.</p></div><div className="filters" aria-label="Filter rental services"><button className={filter === 'all' ? 'active' : ''} onClick={() => setFilter('all')}>All facilities <span>9</span></button><button className={filter === 'restroom' ? 'active' : ''} onClick={() => setFilter('restroom')}>Restroom Family <span>6</span></button><button className={filter === 'support' ? 'active' : ''} onClick={() => setFilter('support')}>Supporting <span>3</span></button></div><div className="service-grid">{visible.map((service, index) => <article className={`service-card ${index === 0 ? 'featured' : ''}`} key={service.slug}><Link href={`/services/${service.slug}/`}><div className="image-wrap"><img src={service.image} alt={service.name} loading={index > 2 ? 'lazy' : undefined} width="700" height="500"/></div><span className="card-kicker">{service.family}</span><h3>{service.name}</h3><p>{service.description}</p><span className="card-link">Explore this facility <ArrowRight/></span></Link></article>)}</div></div></section>
}

function Process() {
  return <section className="section process"><div className="shell process-grid"><div className="sticky-title"><span className="eyebrow">A phased renovation plan</span><h2>Keep service moving while the permanent kitchen changes.</h2><p>{site.company_profile.description}</p><Link className="button dark" href="/contact-us/">Plan kitchen capacity</Link></div><ol>{site.rental_process.map((step) => <li key={step.step}><span>{String(step.step).padStart(2, '0')}</span><div><h3>{step.title}</h3><p>{step.description}</p></div></li>)}</ol></div></section>
}

function PriceTable({ city }: { city?: City }) {
  const kitchen = city?.prices_after_city_discount ?? Object.fromEntries(Object.entries(site.service_profile.pricing.size_surcharges).map(([size, surcharge]) => [size, site.service_profile.pricing.fixed_base_price + surcharge]))
  return <section className="section pricing"><div className="shell"><div className="section-head"><div><span className="eyebrow">Published starting estimates</span><h2>Size the kitchen, then add cold storage if needed.</h2></div><p>Kitchen prices below use {city ? `${city.representative_city}'s city-specific discount` : 'site-wide pricing before city-specific adjustments'}. Refrigerator pricing remains site-wide and does not receive a city ETA discount.</p></div><div className="price-table" role="table" aria-label="Kitchen and refrigerator starting prices"><div className="price-row head" role="row"><span>Length</span><span>Kitchen</span><span>Refrigerator</span></div>{Object.keys(kitchen).map((size) => <div className="price-row" role="row" key={size}><strong>{size.replace('_', ' ')}</strong><span>{money(kitchen[size])}</span><span>{money((refrigeratorPrices as Record<string, number>)[size])}</span></div>)}</div><p className="fine-print">{site.service_profile.pricing.delivery_fee}</p></div></section>
}

function CoveragePreview() {
  return <section className="section coverage" id="service-area-map"><div className="shell"><div className="coverage-heading"><div><span className="eyebrow">Nationwide service areas</span><h2>Find rentals in your area.</h2></div><p>Choose a state to explore regional and city rental guides. Confirm availability and delivery timing for your exact project location with our team.</p></div><div className="coverage-map-card"><div className="map-copy"><span>Find your state</span><strong>50 states</strong><p>Every state guide connects to its assigned cities, local starting price, and delivery planning information.</p><Link className="button dark" href="/service-areas/">Browse all service areas</Link></div><img src="/us-service-map.png" alt="Map showing nationwide temporary kitchen rental coverage across the United States" width="900" height="560"/></div><div className="state-cloud">{statePages.slice(0, 12).map((state) => <Link href={statePath(state.state)} key={state.state}>{state.state}<span>{state.city_count} {state.city_count === 1 ? 'city' : 'cities'}</span></Link>)}</div></div></section>
}

function SupportingFacilities() {
  const supporting = supportingServices
  return <section className="section supporting"><div className="shell supporting-grid"><div><span className="eyebrow">Supporting inventory</span><h2>Complete the wider site plan.</h2><p>The Restroom Family leads the plan. Kitchen, dishwashing, and refrigeration remain available when the site also needs temporary food-service capacity.</p><Link className="text-link" href="/services/">Browse all rental families</Link></div><div className="support-list">{supporting.map((service) => <Link href={`/services/${service.slug}/`} key={service.slug}><img src={service.image} alt="" width="180" height="130" loading="lazy"/><span><strong>{service.name}</strong><small>{service.description}</small></span><ArrowRight/></Link>)}</div></div></section>
}

function FAQ({ items = site.faqs }: { items?: { question: string; answer: string }[] }) {
  return <section className="section faq"><div className="shell faq-grid"><div><span className="eyebrow">Planning questions</span><h2>Make the first request more useful.</h2><p>Final fit depends on the project timeline, utility plan, placement, access, approvals, and current availability.</p></div><div>{items.map((item) => <details key={item.question}><summary>{item.question}<ChevronDown/></summary><p>{item.answer}</p></details>)}</div></div></section>
}

function FinalCTA() { return <section className="final-cta"><div className="shell"><span className="eyebrow">Let’s get your project moving</span><h2>One request. A clearer facility plan.</h2><p>Tell us where, when, and which temporary facilities need to stay available. The quote process confirms configuration, pricing, delivery, setup, and current availability.</p><a className="button light" href={phoneHref}>Call {phoneDisplay} <ArrowRight/></a></div></section> }

function Home() {
  return <Layout><HomeHero/><ServicesGrid/><Calculator compact/><Process/><SupportingFacilities/><CoveragePreview/><FAQ/><FinalCTA/></Layout>
}

function Calculator({ compact = false }: { compact?: boolean }) {
  const [stateName, setStateName] = useState('')
  const stateCities = useMemo(() => stateName ? citiesForState(stateName) : [], [stateName])
  const [citySlug, setCitySlug] = useState('')
  const [size, setSize] = useState('20_ft')
  const selected = cityBySlug(citySlug)
  const kitchenPrice = selected ? selected.prices_after_city_discount[size] : site.service_profile.pricing.fixed_base_price + (site.service_profile.pricing.size_surcharges as Record<string, number>)[size]
  const content = <section className={compact ? 'section calculator compact' : 'section calculator'}><div className="shell calculator-grid"><div><span className="eyebrow">Starting estimate</span><h2>Build a location-aware kitchen estimate.</h2><p>Select a state, city, and trailer length to view the JSON-backed starting kitchen price. Final quotes include route, setup, site, and availability review.</p><div className="form-grid"><label>State<select value={stateName} onChange={(event) => { setStateName(event.target.value); setCitySlug('') }}><option value="">Choose a state</option>{statePages.map((state) => <option key={state.state}>{state.state}</option>)}</select></label><label>City<select disabled={!stateName} value={citySlug} onChange={(event) => setCitySlug(event.target.value)}><option value="">Choose a city</option>{stateCities.map((city) => <option key={city.city_slug} value={city.city_slug}>{city.representative_city}</option>)}</select></label><label>Kitchen length<select value={size} onChange={(event) => setSize(event.target.value)}>{Object.keys(site.service_profile.pricing.size_surcharges).map((key) => <option value={key} key={key}>{key.replace('_', ' ')}</option>)}</select></label></div></div><aside className="estimate"><small>Preliminary kitchen total</small><strong>{money(kitchenPrice)}</strong><dl><div><dt>Location</dt><dd>{selected ? `${selected.representative_city}, ${selected.state}` : 'Site-wide starting estimate'}</dd></div><div><dt>Planning ETA</dt><dd>{selected?.page_layout_data.delivery_time_range.display ?? 'Select a city'}</dd></div><div><dt>Availability</dt><dd>{selected?.page_layout_data.availability_label ?? 'Confirmed with quote'}</dd></div></dl><Link className="button primary" href="/contact-us/">Request an exact quote</Link></aside></div></section>
  return compact ? content : <Layout><PageIntro eyebrow="Rental estimator" title="Start with the published numbers." text="Use city-specific data for a preliminary kitchen estimate, then request a quote for final delivery, setup, configuration, and availability."/>{content}<PriceTable/><FinalCTA/></Layout>
}

function PageIntro({ eyebrow, title, text }: { eyebrow: string; title: string; text: string }) { return <section className="page-intro"><div className="shell"><span className="eyebrow">{eyebrow}</span><h1>{title}</h1><p>{text}</p></div></section> }

function ServiceAreas() {
  return <Layout><PageIntro eyebrow="50 state guides · 246 city guides" title="Mobile restroom trailer rental service areas." text="Find short-term and long-term Restroom Family rentals, including sleepers, restroom and shower trailers, laundry trailers, and handwashing trailers."/><section className="section"><div className="shell all-states">{statePages.map((state) => <article key={state.state}><Link href={statePath(state.state)}><span>{String(state.city_count).padStart(2, '0')} cities</span><h2>{state.state}</h2><p>Mobile restroom trailer rentals</p><b>Open state guide <ArrowRight/></b></Link></article>)}</div></section><FinalCTA/></Layout>
}

function RestroomFamilyOverview({ location }: { location: string }) {
  const family = [
    { name: 'Sleepers', slug: 'sleeper-trailers', text: 'Temporary sleeper trailers for short-term or long-term workforce accommodation needs.' },
    { name: 'Restroom & shower', slug: 'shower-restroom-combinations', text: 'Restroom, shower, and combination trailers for temporary hygiene capacity.' },
    { name: 'Laundry', slug: 'laundry-trailers', text: 'Laundry trailers for extended projects and temporary facilities.' },
    { name: 'Handwashing', slug: 'handwashing-trailers', text: 'Dedicated handwashing trailers for temporary sanitation needs.' }
  ]
  return <section className="section equipment-plan"><div className="shell"><div className="section-head"><div><span className="eyebrow">Restroom Family rentals in {location}</span><h2>Four facility types for one temporary site plan.</h2></div><p>Choose the Restroom Family equipment that fits the project duration, occupancy, placement, utility access, and sanitation requirements.</p></div><div className="plan-grid">{family.map((item) => <article key={item.slug}><h3>{item.name}</h3><p>{item.text}</p><Link className="text-link" href={`/services/${item.slug}/`}>Explore {item.name.toLowerCase()} <ArrowRight/></Link></article>)}</div></div></section>
}

function StatePage({ stateSlug }: { stateSlug: string }) {
  const state = stateBySlug(stateSlug)
  if (!state) return <NotFound/>
  const stateCities = citiesForState(state.state)
  return <Layout><Breadcrumbs labels={['Home', 'Service Area Pages', state.state]} hrefs={['/', '/service-areas/', statePath(state.state)]}/><Hero h1={locationH1(state.state)} description={locationDescription(state.state)} price={state.starting_price} eta="City-specific" availability="Available by request" variation={statePages.findIndex((item) => item.state === state.state) % 4} locationPage/><RestroomFamilyOverview location={state.state}/><section className="section"><div className="shell"><div className="section-head"><div><span className="eyebrow">Mobile restroom rentals across {state.state}</span><h2>Choose a local Restroom Family rental guide.</h2></div><p>{stateCities.length} city {stateCities.length === 1 ? 'page is' : 'pages are'} available with location-specific availability and delivery planning ranges.</p></div><div className="city-grid">{stateCities.map((city) => <Link href={cityPath(city)} key={city.city_slug}><span><MapPin/> {city.representative_city}, {city.state}</span><strong>Restroom Family rentals</strong><small>{city.page_layout_data.delivery_time_range.display} planning ETA</small><ArrowRight/></Link>)}</div></div></section><FinalCTA/></Layout>
}

function CityPage({ city }: { city: City }) {
  const p = city.page_layout_data
  const stateSlug = slugify(city.state)
  const index = cities.findIndex((item) => item.city_slug === city.city_slug)
  const location = `${city.representative_city}, ${city.state}`
  return <Layout><Breadcrumbs labels={p.breadcrumb_labels} hrefs={['/', '/service-areas/', `/service-areas/${stateSlug}/`, cityPath(city)]}/><Hero h1={locationH1(location)} description={locationDescription(location)} price={p.starting_price} eta={p.delivery_time_range.display} availability={p.availability_label} variation={index % 4} locationPage/><section className="section location-facts"><div className="shell facts"><div><Clock3/><small>Service hours</small><strong>{p.service_hours}</strong></div><div><Ruler/><small>Planning distance</small><strong>{p.delivery_distance.display}</strong></div><div><MapPin/><small>Restroom Family</small><strong>Sleepers, restroom &amp; shower, laundry, and handwashing trailers</strong></div></div></section><RestroomFamilyOverview location={location}/><Nearby city={city}/><FinalCTA/></Layout>
}

function EquipmentPlan() {
  const e = site.service_profile.equipment
  return <section className="section equipment-plan"><div className="shell"><div className="section-head"><div><span className="eyebrow">Preparation · cooking · utilities</span><h2>The kitchen is a working system, not just a trailer.</h2></div><p>{site.inventory.family_definition}</p></div><div className="plan-grid"><article><h3>Cooking & preparation</h3><p>{e.cooking[0]}</p><p>{e.preparation[0]}</p></article><article><h3>Sanitation & dishwashing</h3><p>{e.sanitation[0]}</p><p>{site.service_profile.sanitation_plan.confirmation_note}</p></article><article><h3>Utilities & site access</h3><p>{e.utilities[0]}</p></article><article><h3>Refrigeration & storage</h3><p>{e.refrigeration[0]}</p><p>{e.storage[0]}</p></article></div></div></section>
}

function Nearby({ city }: { city: City }) {
  return <section className="section nearby"><div className="shell"><span className="eyebrow">Related service-area guides</span><h2>Continue planning nearby.</h2><div className="nearby-links">{city.page_layout_data.nearby_service_areas.map((label) => { const linked = cities.find((item) => `${item.representative_city}, ${item.state}` === label); return linked ? <Link href={cityPath(linked)} key={label}>{label}<ArrowRight/></Link> : null })}</div></div></section>
}

function ServicesPage() { return <Layout><PageIntro eyebrow="Shared facility inventory" title="Nine facilities. One Restroom Family plan." text="Begin with sleepers, restroom and shower, laundry, and handwashing trailers, then review kitchen, dishwashing, and refrigeration as supporting inventory."/><ServicesGrid/><EquipmentPlan/><PriceTable/><FinalCTA/></Layout> }

function TrailerGrid({ service }: { service: (typeof services)[number] }) {
  const options = trailerOptions[service.slug] ?? []
  return <section className="section trailer-catalog"><div className="shell service-content-layout"><div><div className="section-head trailer-heading"><div><span className="eyebrow">Available configurations</span><h2>Explore {service.name.toLowerCase()}.</h2></div><p>These trailer names and photos come directly from the supplied inventory spreadsheet and its linked Google Drive folders. Exact configuration, tier, capacity, site fit, and current availability are confirmed during the quote.</p></div><div className="trailer-grid">{options.map((option, index) => <article className="trailer-card" key={option.name}><img src={option.image} alt={option.name} width="700" height="460" loading={index > 2 ? 'lazy' : undefined}/><div><span>{String(index + 1).padStart(2, '0')} · {service.family}</span><h3>{option.name}</h3><p>Request current availability and confirm the equipment package for your project location.</p><Link href="/contact-us/">Check this trailer <ArrowRight/></Link></div></article>)}</div></div><StickyQuoteForm serviceName={service.name}/></div></section>
}

function StickyQuoteForm({ serviceName }: { serviceName: string }) {
  const [ready, setReady] = useState(false)
  return <aside className="sticky-quote" aria-label={`Request ${serviceName} availability`}><span className="eyebrow">Quick availability request</span><h2>Need a trailer fast?</h2><p>Share the project basics, then request current availability and configuration details.</p><form onSubmit={(event) => { event.preventDefault(); setReady(true) }}><label>Name<input name="name" autoComplete="name" required/></label><label>Phone<input name="phone" type="tel" autoComplete="tel" required/></label><label>Project location<input name="location" required/></label><label>Needed date<input name="date" type="date"/></label><label>Service<input name="service" value={serviceName} readOnly/></label><button className="button primary" type="submit">Prepare request <ArrowRight/></button>{ready && <p className="form-note" role="status">Your details are ready. This preview does not transmit forms yet; use the contact page to continue.</p>}</form></aside>
}

function InventoryDetail({ page }: { page: InventoryDetailPage }) {
  const parent = services.find((service) => service.slug === page.parentService)
  const displayFamily = parent?.family ?? 'Supporting inventory'
  const hasKitchenPricing = ['mobile-kitchen-trailers', 'dishwashing-trailers', 'refrigeration-trailers'].includes(page.parentService)
  return <Layout><Breadcrumbs labels={['Home', 'Inventory', page.name]} hrefs={['/', '/services/', `/${page.slug}/`]}/><section className="service-hero inventory-detail-hero"><div className="shell service-hero-grid"><div><span className="eyebrow">{displayFamily} · temporary rental inventory</span><h1>{page.name}</h1><p>{page.description}</p><div className="hero-actions"><Link className="button primary" href="/contact-us/">Request current availability <ArrowRight/></Link>{parent && <Link className="text-link" href={`/services/${parent.slug}/`}>View {parent.name.toLowerCase()}</Link>}</div></div><img src={page.image} alt={`${page.name} inventory reference`} width="900" height="620"/></div></section><section className="section equipment-detail"><div className="shell two-col"><div><span className="eyebrow">Plan the full rental</span><h2>Confirm site fit before dispatch.</h2><p>This page preserves the requested equipment URL and uses the rebuild’s shared inventory template. Final equipment details come from the approved quote rather than assumptions based on the page name or reference image.</p></div><dl><div><dt>Configuration</dt><dd>Confirmed for the selected rental unit and project requirements.</dd></div><div><dt>Utilities</dt><dd>Power, water, drainage, fuel, and ventilation requirements are reviewed where applicable.</dd></div><div><dt>Placement</dt><dd>Delivery access, clearances, level conditions, stairs, ramps, and setup needs are reviewed before dispatch.</dd></div><div><dt>Availability</dt><dd>Current unit availability, schedule, delivery timing, and final pricing are quote-based.</dd></div></dl></div></section>{hasKitchenPricing ? <PriceTable/> : <Process/>}<FAQ/><FinalCTA/></Layout>
}

function ServicePage({ slug }: { slug: string }) {
  const service = services.find((item) => item.slug === slug)
  if (!service) return <NotFound/>
  const hasKitchenPricing = ['mobile-kitchen-trailers', 'dishwashing-trailers', 'refrigeration-trailers'].includes(service.slug)
  return <Layout><Breadcrumbs labels={['Home', 'Inventory', service.name]} hrefs={['/', '/services/', `/services/${service.slug}/`]}/><section className="service-hero"><div className="shell service-hero-grid"><div><span className="eyebrow">{service.family} · nationwide rentals</span><h1>{serviceH1[service.slug]}</h1><p>{service.description}</p><Link className="button primary" href="#trailer-options">View trailer options <ArrowRight/></Link></div><img src={service.image} alt={service.name} width="900" height="620"/></div></section><div id="trailer-options"><TrailerGrid service={service}/></div>{hasKitchenPricing ? <><EquipmentPlan/><PriceTable/></> : <section className="section"><div className="shell narrow"><h2>Plan this facility around the whole site.</h2><p>Configuration, utilities, placement, access, rental term, and availability are reviewed with the company quote. The Restroom Family includes sleepers, restroom and shower, laundry, and handwashing trailers; this supporting inventory is planned around those primary site needs.</p></div></section>}<ServicesGrid/><FinalCTA/></Layout>
}

function Contact() {
  return <Layout><PageIntro eyebrow="Rental availability request" title="Tell us where, when, and what your site needs." text={`Prepare a location-specific request for mobile restroom trailers or any of the nine rental services. Online delivery is ready for a future Resend or Glide connection but is not transmitting yet. For 24/7 emergency contact support, call ${phoneDisplay} to confirm current availability, configuration, delivery, setup, and response timing.`}/><section className="section contact-section"><div className="shell contact-grid"><div className="contact-form-panel"><span className="eyebrow">Project details</span><h2>Build a complete rental request.</h2><p>Choose the state, city, service, and expected timing so the future lead integration receives a useful planning record.</p><LeadCaptureForm/></div><aside><span className="eyebrow">24/7 emergency support</span><a className="contact-phone" href={phoneHref}><PhoneCall/> {phoneDisplay}</a><h2>A clearer first conversation.</h2><ul>{['State, city, and exact project location','Required temporary facility service','Expected start date and rental term','Placement and delivery access','Power, water, drainage, and fuel where applicable','Current availability and response timing confirmation'].map((item) => <li key={item}><Check/> {item}</li>)}</ul><p className="contact-disclaimer">The 24/7 wording describes emergency contact support. Inventory, delivery, dispatch, setup, and arrival timing remain subject to confirmation.</p></aside></div></section></Layout>
}

function About() { return <Layout><PageIntro eyebrow="Restaurant continuity during phased renovation" title="Temporary capacity that follows the work plan." text={site.company_profile.description}/><Process/><EquipmentPlan/><FAQ/><FinalCTA/></Layout> }
function Privacy() { return <Layout><PageIntro eyebrow="Privacy" title="Privacy notice" text="This website does not transmit quote details in the static build. If online request handling is added, the live policy should be updated before collection begins."/><section className="section"><div className="shell narrow"><h2>Information handling</h2><p>The planning estimator operates in the browser. It does not create an account or send the entered selection to a server. External article links open their original publisher sites, whose own privacy terms apply.</p></div></section></Layout> }
function Blog() { const article = site.site_identity_articles[0]; return <Layout><PageIntro eyebrow="Planning context" title="Kitchen continuity notes." text="Use case guidance for operators coordinating temporary food-service capacity around phased renovations and unexpected interruptions."/><section className="section"><div className="shell article-feature"><time dateTime={article.date}>{article.date}</time><h2>{article.title}</h2><p>{article.rental_relevance}</p><a href={article.source_url} target="_blank" rel="noreferrer">Read the source article <ArrowRight/></a></div></section><FinalCTA/></Layout> }
function NotFound() { return <Layout><PageIntro eyebrow="404" title="This route is not in the published plan." text="Return to the service area directory or browse the current rental inventory."/><section className="section"><div className="shell"><Link className="button primary" href="/service-areas/">Browse service areas</Link></div></section></Layout> }

const aliases: Record<string, string> = {
  '/mobile-kitchen-trailer/': 'mobile-kitchen-trailers', '/equipment-rental/mobile-kitchen-trailers/': 'mobile-kitchen-trailers', '/portable-dishwashing-trailer-rental/': 'dishwashing-trailers', '/equipment-rental/refrigeration/': 'refrigeration-trailers', '/equipment-rental/shower-trailer/': 'shower-trailers', '/equipment-rental/restroom-trailers/': 'restroom-trailers', '/services/shower-restroom-combination-trailers/': 'shower-restroom-combinations', '/equipment-rental/mobile-sleep-trailers/': 'sleeper-trailers', '/equipment-rental/laundry-trailers/': 'laundry-trailers', '/equipment-rental/handwashing-stations/': 'handwashing-trailers'
}

export function App() {
  const [path, setPath] = useState(currentPath)
  useEffect(() => { const update = () => setPath(currentPath()); addEventListener('popstate', update); return () => removeEventListener('popstate', update) }, [])
  const normalized = path.endsWith('/') || path.endsWith('.html') ? path : `${path}/`
  if (normalized === '/') return <Home/>
  if (normalized === '/Locations.html' || normalized === '/service-areas/') return <ServiceAreas/>
  if (normalized === '/services/') return <ServicesPage/>
  if (normalized === '/rental-calculator/') return <Calculator/>
  if (normalized === '/contact-us/') return <Contact/>
  if (normalized === '/about-us/') return <About/>
  if (normalized === '/privacy/') return <Privacy/>
  if (normalized === '/blog/') return <Blog/>
  const inventoryMatch = normalized.match(/^\/([^/]+)\/$/)
  if (inventoryMatch) { const inventoryPage = inventoryDetailBySlug(inventoryMatch[1]); if (inventoryPage) return <InventoryDetail page={inventoryPage}/> }
  if (aliases[normalized]) return <ServicePage slug={aliases[normalized]}/>
  const serviceMatch = normalized.match(/^\/services\/([^/]+)\/$/)
  if (serviceMatch) return <ServicePage slug={serviceMatch[1]}/>
  const stateMatch = normalized.match(/^\/service-areas\/([^/]+)\/$/)
  if (stateMatch) return <StatePage stateSlug={stateMatch[1]}/>
  const cityMatch = normalized.match(/^\/[^/]+\/([^/]+)\/$/)
  if (cityMatch) { const city = cityBySlug(cityMatch[1]); if (city) return <CityPage city={city}/> }
  return <NotFound/>
}

