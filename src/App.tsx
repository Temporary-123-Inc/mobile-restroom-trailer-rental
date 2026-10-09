import { useEffect, useMemo, useState } from 'react'
import { ArrowRight, Check, ChevronDown, ChevronLeft, ChevronRight, Clock3, MapPin, Menu, PhoneCall, Ruler, X } from 'lucide-react'
import { cities, citiesForState, cityBySlug, cityPath, inventoryDetailBySlug, inventoryDetailPages, refrigeratorPrices, restroomFamilyServices, restroomPricing, restroomRentalPeriods, restroomSite, serviceH1, services, site, slugify, stateBySlug, statePages, statePath, supportingServices, trailerOptions, type City, type InventoryDetailPage, type RestroomPrice, type RestroomRentalPeriod } from './data'
import { submitLead } from './contact'

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
      <Link href="/" className="brand logo-brand" aria-label={`${brandName} home`}><img src="/mobile-restroom-trailer-rental.webp" alt="Mobile Restroom Trailer Rental" width="1024" height="1024" /></Link>
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
  return <footer><div className="shell footer-grid"><div><Link href="/" className="brand logo-brand footer-brand" aria-label={`${brandName} home`}><img src="/mobile-restroom-trailer-rental.webp" alt="Mobile Restroom Trailer Rental" width="1024" height="1024" loading="lazy" /></Link><p>The Restroom Family includes sleepers, restroom and shower, laundry, and handwashing trailers, with kitchen, dishwashing, and refrigeration available as supporting inventory.</p></div><div><h3>Explore</h3><Link href="/services/">All nine facilities</Link><Link href="/service-areas/">Service areas</Link><Link href="/rental-calculator/">Starting estimator</Link></div><div><h3>Plan</h3><Link href="/about-us/">Rental process</Link><Link href="/contact-us/">Request availability</Link><Link href="/privacy/">Privacy</Link></div><div><h3>Request a quote</h3><a className="footer-phone" href={phoneHref}>{phoneDisplay}</a><p>Pricing, route timing, site fit, configuration, and final availability are confirmed through the company quote.</p></div></div><FooterInventory/><div className="shell copyright">© 2026 Mobile Restroom Trailer Rental. All rights reserved.</div></footer>
}

function AccreditationStrip() {
  return <section className="accreditation-strip" aria-labelledby="accreditation-title"><div className="shell"><h2 id="accreditation-title">We are accredited on:</h2><img src="/accreditation-logos.png" alt="Accreditation and registration logos: SAM.gov, U.S. Small Business Administration, Unique Entity Identifier, Dun & Bradstreet, and NAICS Association" width="1247" height="241" loading="lazy"/></div></section>
}

function LeadCaptureForm({ compact = false }: { compact?: boolean }) {
  const [stateName, setStateName] = useState('')
  const [citySlug, setCitySlug] = useState('')
  const [submission, setSubmission] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [error, setError] = useState('')
  const availableCities = useMemo(() => stateName ? citiesForState(stateName) : [], [stateName])
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSubmission('submitting'); setError('')
    const fields = new FormData(event.currentTarget)
    const selectedCity = cityBySlug(citySlug)
    try {
      await submitLead({
        url: window.location.pathname,
        name: String(fields.get('name') || ''), email: String(fields.get('email') || ''), phone: String(fields.get('phone') || ''),
        message: String(fields.get('details') || ''), service: String(fields.get('service') || ''), duration: String(fields.get('rental_term') || ''),
        industry: String(fields.get('industry') || 'other'), location: selectedCity ? `${selectedCity.representative_city}, ${selectedCity.state}` : stateName,
        startDate: String(fields.get('needed_date') || ''), consent: fields.get('consent') === 'on', website: String(fields.get('website') || ''),
      })
      setSubmission('success')
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Unable to send your request. Please try again.')
      setSubmission('error')
    }
  }
  return <form className={compact ? 'lead-form compact' : 'lead-form'} onSubmit={handleSubmit}><div className="lead-form-grid"><label>Full name<input name="name" autoComplete="name" required placeholder="Your name"/></label><label>Phone<input name="phone" type="tel" autoComplete="tel" required placeholder="Best callback number"/></label><label>Email<input name="email" type="email" autoComplete="email" required placeholder="name@company.com"/></label><label>State<select name="state" value={stateName} onChange={(event) => { setStateName(event.target.value); setCitySlug('') }} required><option value="">Choose a state</option>{statePages.map((state) => <option value={state.state} key={state.state}>{state.state}</option>)}</select></label><label>City<select name="city" value={citySlug} onChange={(event) => setCitySlug(event.target.value)} disabled={!stateName} required><option value="">Choose a city</option>{availableCities.map((city) => <option value={city.city_slug} key={city.city_slug}>{city.representative_city}</option>)}</select></label><label>Service needed<select name="service" required><option value="">Choose a service</option>{services.map((service) => <option value={service.slug} key={service.slug}>{service.name}</option>)}</select></label><label>Needed date<input name="needed_date" type="date"/></label><label>Rental term<select name="rental_term" required><option value="">Choose a term</option><option value="under-1-month">Under 1 month</option><option value="1-to-3-months">1–3 months</option><option value="over-3-months">Over 3 months</option><option value="emergency">Emergency request</option><option value="not-sure">Not sure yet</option></select></label><label>Industry<select name="industry" required><option value="">Choose an industry</option><option value="construction">Construction</option><option value="events">Events</option><option value="hospitality">Hospitality</option><option value="government">Government</option><option value="healthcare">Healthcare</option><option value="education">Education</option><option value="disaster-relief">Disaster relief</option><option value="other">Other</option></select></label><label className="lead-wide">Project details<textarea name="details" rows={compact ? 3 : 5} required placeholder="Site access, dates, facility needs, utilities, and any urgent constraints"/></label><label className="form-honeypot" aria-hidden="true">Website<input name="website" tabIndex={-1} autoComplete="off"/></label><label className="lead-wide consent-field"><input name="consent" type="checkbox" required/> I consent to having my information used to respond to this rental request.</label></div><div className="lead-form-actions"><button className="button primary" type="submit" disabled={submission === 'submitting'}>{submission === 'submitting' ? 'Sending request…' : 'Send availability request'} <ArrowRight/></button><a href={phoneHref}><PhoneCall/> Call 24/7 emergency support: {phoneDisplay}</a></div><div aria-live="polite">{submission === 'success' && <p className="form-note lead-status success"><Check/> Your request was sent successfully. Our team will follow up using the contact details provided.</p>}{submission === 'error' && <p className="form-note lead-status form-error" role="alert">{error} Call {phoneDisplay} for immediate assistance.</p>}</div></form>
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
  return <section className={`hero variation-${variation + 1}${locationPage ? ' location-hero' : ''}`}><div className="shell hero-grid"><div className="hero-copy"><span className="eyebrow">Restroom Family availability</span><h1>{h1}</h1><p>{description}</p><div className="hero-actions"><Link className="button primary" href="/contact-us/">Request availability <ArrowRight/></Link><Link className="text-link" href={locationPage ? '/rental-calculator/' : '/rental-calculator/'}>{locationPage ? 'Calculate a restroom rental' : 'Build a starting estimate'}</Link></div></div><div className="hero-side"><div className="status-row"><span className="status"><i/> {availability}</span></div><div className="metric-grid"><div><small>Starting at</small><strong>{money(price)}</strong><span>{locationPage ? '13ft 3-stall restroom rental' : 'location estimate'}</span></div><div><small>Planning ETA</small><strong>{eta}</strong><span>route-dependent</span></div></div><Carousel/></div></div></section>
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
  return <section className="section pricing"><div className="shell"><div className="section-head"><div><span className="eyebrow">Published starting estimates</span><h2>Size the kitchen, then add cold storage if needed.</h2></div><p>Kitchen prices below use {city ? `${city.representative_city}'s city-specific discount` : 'site-wide pricing before city-specific adjustments'}. Refrigerator pricing remains site-wide and does not receive a city ETA discount.</p></div><div className="price-table" role="table" aria-label="Kitchen and refrigerator starting prices"><div className="price-row head" role="row"><span>Length</span><span>Kitchen</span><span>Refrigerator</span></div>{Object.keys(kitchen).map((size) => <div className="price-row" role="row" key={size}><strong>{size.replace('_', ' ')}</strong><span>{kitchen[size] === null ? 'Quote required' : money(kitchen[size])}</span><span>{money((refrigeratorPrices as Record<string, number>)[size])}</span></div>)}</div><p className="fine-print">{site.service_profile.pricing.delivery_fee}</p></div></section>
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
  const [trailerId, setTrailerId] = useState(restroomPricing[0].id)
  const [rentalPeriod, setRentalPeriod] = useState<RestroomRentalPeriod>('1_6_days')
  const selected = cityBySlug(citySlug)
  const trailer = restroomPricing.find((item) => item.id === trailerId) ?? restroomPricing[0]
  const price = trailer.prices[rentalPeriod]
  const displayPrice = (value: RestroomPrice) => value === null ? 'Quote required' : typeof value === 'number' ? money(value) : `${money(value.min)}–${money(value.max)}`
  const content = <section className={compact ? 'section calculator compact' : 'section calculator'}><div className="shell calculator-grid"><div><span className="eyebrow">Restroom rental calculator</span><h2>Estimate a shower-restroom combination trailer.</h2><p>Select the project location, trailer configuration, and rental period to view the supplied restroom price. Final pricing, delivery, setup, availability, and site requirements are confirmed in the quote.</p><div className="form-grid"><label>State<select value={stateName} onChange={(event) => { setStateName(event.target.value); setCitySlug('') }}><option value="">Choose a state</option>{statePages.map((state) => <option key={state.state}>{state.state}</option>)}</select></label><label>City<select disabled={!stateName} value={citySlug} onChange={(event) => setCitySlug(event.target.value)}><option value="">Choose a city</option>{stateCities.map((city) => <option key={city.city_slug} value={city.city_slug}>{city.representative_city}</option>)}</select></label><label>Trailer configuration<select value={trailerId} onChange={(event) => setTrailerId(event.target.value)}>{restroomPricing.map((item) => <option value={item.id} key={item.id}>{item.name}</option>)}</select></label><label>Rental period<select value={rentalPeriod} onChange={(event) => setRentalPeriod(event.target.value as RestroomRentalPeriod)}>{restroomRentalPeriods.map((period) => <option value={period.key} key={period.key}>{period.label}</option>)}</select></label></div></div><aside className="estimate"><small>Published restroom price</small><strong>{displayPrice(price)}</strong><dl><div><dt>Configuration</dt><dd>{trailer.name}</dd></div><div><dt>Rental period</dt><dd>{restroomRentalPeriods.find((period) => period.key === rentalPeriod)?.label}</dd></div><div><dt>Project location</dt><dd>{selected ? `${selected.representative_city}, ${selected.state}` : 'Select a state and city'}</dd></div><div><dt>Planning ETA</dt><dd>{selected?.page_layout_data.delivery_time_range.display ?? 'Confirmed with location'}</dd></div></dl>{price === null && <p className="fine-print">The supplied pricing workbook leaves this configuration blank. Request a quote for current pricing.</p>}<Link className="button primary" href="/contact-us/">Request an exact quote</Link></aside></div></section>
  return compact ? content : <Layout><PageIntro eyebrow="Restroom rental estimator" title="Calculate a restroom trailer rental price." text="Choose a shower-restroom trailer configuration and rental period using the pricing supplied for this website, then request a quote for final delivery, setup, and availability."/>{content}<FinalCTA/></Layout>
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

function RestroomProcess() {
  return <section className="section process"><div className="shell process-grid"><div className="sticky-title"><span className="eyebrow">Restroom rental process</span><h2>Plan delivery, utilities, service, and pickup.</h2><p>{restroomSite.company_profile.description}</p><Link className="button dark" href="/contact-us/">Request restroom availability</Link></div><ol>{restroomSite.rental_process.map((step) => <li key={step.step}><span>{String(step.step).padStart(2, '0')}</span><div><h3>{step.title}</h3><p>{step.description}</p></div></li>)}</ol></div></section>
}

function RestroomRentalInfo({ city }: { city: City }) {
  const info = city.page_layout_data.rental_information
  return <section className="section rental-info"><div className="shell two-col"><div><span className="eyebrow">Restroom rental pricing</span><h2>What the location-specific quote confirms.</h2><p>{info.minimum_rental}</p><Link className="button dark" href="/rental-calculator/">Calculate restroom pricing</Link></div><dl><div><dt>Pricing</dt><dd>{info.pricing_note}</dd></div><div><dt>Delivery fee</dt><dd>{info.delivery_fee}</dd></div><div><dt>Setup</dt><dd>{info.setup}</dd></div><div><dt>Servicing</dt><dd>{info.servicing}</dd></div><div><dt>Extensions</dt><dd>{info.extensions}</dd></div><div><dt>Long-term rental</dt><dd>{info.long_term_rental}</dd></div></dl></div></section>
}

function LocationIncident({ city }: { city: City }) {
  const article = city.page_layout_data.related_incident_articles[0]
  if (!article) return null
  return <section className="section incident"><div className="shell incident-inner"><div><span className="eyebrow">Local planning context</span><h2>Temporary restroom capacity for changing site needs.</h2><p>This city-specific source is included as local context only. It does not establish that a restroom trailer was used.</p></div><article><time dateTime={article.date}>{new Date(`${article.date}T00:00:00`).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</time><h3>{article.title}</h3><a href={article.source_url} target="_blank" rel="noreferrer">Read the assigned source <ArrowRight/></a></article></div></section>
}

function StatePage({ stateSlug }: { stateSlug: string }) {
  const state = stateBySlug(stateSlug)
  if (!state) return <NotFound/>
  const stateCities = citiesForState(state.state)
  return <Layout><Breadcrumbs labels={['Home', 'Service Area Pages', state.state]} hrefs={['/', '/service-areas/', statePath(state.state)]}/><Hero h1={`${state.h1} for Short-Term or Long-Term Rentals`} description={state.description} price={state.starting_price} eta="City-specific" availability="Available by request" variation={statePages.findIndex((item) => item.state === state.state) % 4} locationPage/><RestroomFamilyOverview location={state.state}/><section className="section"><div className="shell"><div className="section-head"><div><span className="eyebrow">Mobile restroom rentals across {state.state}</span><h2>Choose a local restroom trailer rental guide.</h2></div><p>{stateCities.length} city {stateCities.length === 1 ? 'page is' : 'pages are'} available with JSON-backed restroom pricing, availability, and delivery planning ranges.</p></div><div className="city-grid">{stateCities.map((city) => <Link href={cityPath(city)} key={city.city_slug}><span><MapPin/> {city.representative_city}, {city.state}</span><strong>{money(city.page_layout_data.starting_price)} restroom start</strong><small>{city.page_layout_data.delivery_time_range.display} planning ETA</small><ArrowRight/></Link>)}</div></div></section><RestroomProcess/><FAQ items={restroomSite.faqs}/><FinalCTA/></Layout>
}

function CityPage({ city }: { city: City }) {
  const p = city.page_layout_data
  const stateSlug = slugify(city.state)
  const index = cities.findIndex((item) => item.city_slug === city.city_slug)
  const location = `${city.representative_city}, ${city.state}`
  return <Layout><Breadcrumbs labels={p.breadcrumb_labels} hrefs={['/', '/service-areas/', `/service-areas/${stateSlug}/`, cityPath(city)]}/><Hero h1={`${p.h1} for Short-Term or Long-Term Rentals`} description={p.description} price={p.starting_price} eta={p.delivery_time_range.display} availability={p.availability_label} variation={index % 4} locationPage/><section className="section location-facts"><div className="shell facts"><div><Clock3/><small>Service hours</small><strong>{p.service_hours}</strong></div><div><Ruler/><small>Planning distance</small><strong>{p.delivery_distance.display}</strong></div><div><MapPin/><small>Restroom inventory</small><strong>{p.inventory_family}</strong></div></div></section><RestroomFamilyOverview location={location}/><RestroomRentalInfo city={city}/><RestroomProcess/><LocationIncident city={city}/><Nearby city={city}/><FAQ items={restroomSite.faqs}/><FinalCTA/></Layout>
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
  const [submission, setSubmission] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [error, setError] = useState('')
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); setSubmission('submitting'); setError('')
    const fields = new FormData(event.currentTarget)
    try {
      await submitLead({ url: window.location.pathname, name: String(fields.get('name') || ''), email: String(fields.get('email') || ''), phone: String(fields.get('phone') || ''), message: String(fields.get('message') || ''), service: serviceName, duration: String(fields.get('duration') || ''), industry: 'other', location: String(fields.get('location') || ''), startDate: String(fields.get('date') || ''), consent: fields.get('consent') === 'on', website: String(fields.get('website') || '') })
      setSubmission('success')
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Unable to send your request. Please try again.'); setSubmission('error')
    }
  }
  return <aside className="sticky-quote" aria-label={`Request ${serviceName} availability`}><span className="eyebrow">Quick availability request</span><h2>Need a trailer fast?</h2><p>Share the project basics, then request current availability and configuration details.</p><form onSubmit={handleSubmit}><label>Name<input name="name" autoComplete="name" required/></label><label>Email<input name="email" type="email" autoComplete="email" required/></label><label>Phone<input name="phone" type="tel" autoComplete="tel" required/></label><label>Project location<input name="location" required/></label><label>Needed date<input name="date" type="date"/></label><label>Rental term<select name="duration" required><option value="">Choose a term</option><option value="under-1-month">Under 1 month</option><option value="1-to-3-months">1–3 months</option><option value="over-3-months">Over 3 months</option><option value="emergency">Emergency request</option></select></label><label>Service<input name="service" value={serviceName} readOnly/></label><label>Project details<textarea name="message" rows={4} required/></label><label className="form-honeypot" aria-hidden="true">Website<input name="website" tabIndex={-1} autoComplete="off"/></label><label className="consent-field"><input name="consent" type="checkbox" required/> I consent to having my information used to respond to this rental request.</label><button className="button primary" type="submit" disabled={submission === 'submitting'}>{submission === 'submitting' ? 'Sending request…' : 'Send request'} <ArrowRight/></button><div aria-live="polite">{submission === 'success' && <p className="form-note success" role="status"><Check/> Your request was sent successfully.</p>}{submission === 'error' && <p className="form-note form-error" role="alert">{error}</p>}</div></form></aside>
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
  return <Layout><PageIntro eyebrow="Rental availability request" title="Tell us where, when, and what your site needs." text={`Send a location-specific request for mobile restroom trailers or any of the nine rental services. For 24/7 emergency contact support, call ${phoneDisplay} to confirm current availability, configuration, delivery, setup, and response timing.`}/><section className="section contact-section"><div className="shell contact-grid"><div className="contact-form-panel"><span className="eyebrow">Project details</span><h2>Build a complete rental request.</h2><p>Choose the state, city, service, industry, and expected timing so our team receives a useful planning record.</p><LeadCaptureForm/></div><aside><span className="eyebrow">24/7 emergency support</span><a className="contact-phone" href={phoneHref}><PhoneCall/> {phoneDisplay}</a><h2>A clearer first conversation.</h2><ul>{['State, city, and exact project location','Required temporary facility service','Expected start date and rental term','Placement and delivery access','Power, water, drainage, and fuel where applicable','Current availability and response timing confirmation'].map((item) => <li key={item}><Check/> {item}</li>)}</ul><p className="contact-disclaimer">The 24/7 wording describes emergency contact support. Inventory, delivery, dispatch, setup, and arrival timing remain subject to confirmation.</p></aside></div></section></Layout>
}

function About() { return <Layout><PageIntro eyebrow="Restaurant continuity during phased renovation" title="Temporary capacity that follows the work plan." text={site.company_profile.description}/><Process/><EquipmentPlan/><FAQ/><FinalCTA/></Layout> }
function Privacy() { return <Layout><PageIntro eyebrow="Privacy" title="Privacy notice" text="Contact and availability forms transmit the details you submit to the company’s lead-management workflow so the team can respond to your rental request."/><section className="section"><div className="shell narrow"><h2>Information handling</h2><p>The restroom pricing calculator operates in the browser and does not send its selections. Contact forms send the submitted name, email, phone, message, service, rental duration, industry, location, requested start date, source page, and consent status to the company’s Glide workflow. External article links open their original publisher sites, whose own privacy terms apply.</p></div></section></Layout> }
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

