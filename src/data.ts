import raw from './data/site-39.json'

export type Article = { title: string; date: string; source_url: string }
export type City = {
  state: string
  representative_city: string
  city_slug: string
  availability_note: string
  prices_before_city_discount: Record<string, number>
  prices_after_city_discount: Record<string, number>
  page_layout_data: {
    slug: string
    title: string
    h1: string
    description: string
    breadcrumb_labels: string[]
    availability_label: string
    starting_price: number
    starting_price_basis: string
    delivery_time_range: { display: string }
    estimated_delivery_display: string
    delivery_distance: { display: string; basis: string }
    service_hours: string
    inventory_family: string
    related_incident_articles: Article[]
    nearby_service_areas: string[]
    rental_information: Record<string, string>
  }
}

export type StatePage = {
  state: string
  page_title: string
  h1: string
  description: string
  starting_price: number
  city_count: number
}

export const site = raw
export const cities = raw.service_area_data as City[]
export const statePages = raw.location_data.state_pages as StatePage[]
export const slugify = (value: string) => value.toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
export const stateBySlug = (slug: string) => statePages.find((item) => slugify(item.state) === slug)
export const cityBySlug = (slug: string) => cities.find((item) => item.page_layout_data.slug === slug)
export const citiesForState = (state: string) => cities.filter((item) => item.state === state)
export const cityPath = (city: City) => `/${slugify(city.state)}/${city.page_layout_data.slug}/`
export const statePath = (state: string) => `/service-areas/${slugify(state)}/`

export const services = [
  { slug: 'restroom-trailers', name: 'Restroom trailers', family: 'Restroom Family', image: '/images/restroom.webp', description: 'Temporary restroom facilities available by request, with configuration, site requirements, and current availability confirmed in the quote.' },
  { slug: 'shower-trailers', name: 'Shower trailers', family: 'Restroom Family', image: '/images/shower.webp', description: 'Temporary shower facilities available by request, with configuration and site requirements confirmed in the quote.' },
  { slug: 'shower-restroom-combinations', name: 'Restroom & shower combinations', family: 'Restroom Family', image: '/images/shower-restroom.webp', description: 'Combined restroom and shower facilities reviewed against the project site, access, utilities, and availability.' },
  { slug: 'sleeper-trailers', name: 'Sleeper trailers', family: 'Restroom Family', image: '/images/sleeper.webp', description: 'Temporary sleeping facilities in the Restroom Family; final fit and availability are quote-based.' },
  { slug: 'laundry-trailers', name: 'Laundry trailers', family: 'Restroom Family', image: '/images/laundry.webp', description: 'Mobile laundry facilities in the Restroom Family that can support longer projects, subject to site review and availability.' },
  { slug: 'handwashing-trailers', name: 'Handwashing trailers', family: 'Restroom Family', image: '/images/handwashing.webp', description: 'Handwashing capacity in the Restroom Family for approved site plans that call for a separate sanitation station.' },
  { slug: 'mobile-kitchen-trailers', name: 'Mobile kitchen trailers', family: 'Supporting inventory', image: '/images/mobile-kitchen.webp', description: 'A supporting commercial cooking workspace with a stove, oven, essential cooking utensils, preparation space, and an approved equipment package.' },
  { slug: 'dishwashing-trailers', name: 'Dishwashing trailers', family: 'Supporting inventory', image: '/images/dishwashing.webp', description: 'Supporting commercial dishwashing capacity with connections and drainage reviewed during site preparation.' },
  { slug: 'refrigeration-trailers', name: 'Refrigeration trailers', family: 'Supporting inventory', image: '/images/refrigeration.webp', description: 'Supporting temporary cold storage with site-wide pricing that is not reduced by city ETA discounts.' }
] as const

export const restroomFamilyServices = services.filter((service) => service.family === 'Restroom Family')
export const supportingServices = services.filter((service) => service.family !== 'Restroom Family')

export const serviceH1: Record<string, string> = {
  'mobile-kitchen-trailers': 'Mobile Kitchen Trailer Rentals for Temporary Commercial Food Service',
  'dishwashing-trailers': 'Commercial Dishwashing Trailer Rentals for Temporary Kitchen Operations',
  'refrigeration-trailers': 'Refrigerated Trailer Rentals for Temporary Commercial Cold Storage',
  'shower-trailers': 'Portable Shower Trailer Rentals for Temporary Site Facilities',
  'restroom-trailers': 'Mobile Restroom Trailer Rentals for Temporary Site Facilities',
  'shower-restroom-combinations': 'Shower and Restroom Combination Trailer Rentals for Temporary Sites',
  'sleeper-trailers': 'Sleeper and Bunkbed Trailer Rentals for Temporary Workforce Housing',
  'laundry-trailers': 'Mobile Laundry Trailer Rentals for Temporary Workforce Facilities',
  'handwashing-trailers': 'Portable Handwashing Trailer Rentals for Temporary Sanitation Stations'
}

export const trailerOptions: Record<string, { name: string; image: string }[]> = {
  'mobile-kitchen-trailers': [
    ['24ft Mobile Kitchen', '24ft-mobile-kitchen'], ['26ft Baby Bulk Kitchen', '26ft-baby-bulk-kitchen'], ['28ft Mobile Kitchen', '28ft-mobile-kitchen'], ['38ft Mobile Kitchen', '38ft-mobile-kitchen'], ['40ft Mobile Kitchen', '40ft-mobile-kitchen'], ['40ft Mobile Combo Kitchen', '40ft-mobile-combo-kitchen'], ['40ft Bulk Kitchen', '40ft-bulk-kitchen'], ['40ft Bulk Combo Kitchen', '40ft-bulk-combo-kitchen']
  ].map(([name, image]) => ({ name, image: `/images/trailers/${image}.webp` })),
  'dishwashing-trailers': [
    ['22–26ft Low Temp Dish Trailer (Tier 1–4)', '22-26ft-low-temp-dish'], ['30ft Conveyor Dishwashing Trailer', '30ft-conveyor-dish'], ['38ft Low Temp Dish Trailer (Tier 1–4)', '38ft-low-temp-dish'], ['38ft High Temp Conveyor Dishwashing Trailer', '38ft-high-temp-dish']
  ].map(([name, image]) => ({ name, image: `/images/trailers/${image}.webp` })),
  'refrigeration-trailers': [
    ['12ft Refrigerated Trailer (Tier 1–4)', '12ft-refrigerated-trailer'], ['20ft Refrigerated Trailer (Tier 1–4)', '20ft-refrigerated-trailer'], ['20ft Refrigerated Container (Tier 1–4)', '20ft-refrigerated-container'], ['40ft Refrigerated Container (Tier 1–4)', '40ft-refrigerated-container']
  ].map(([name, image]) => ({ name, image: `/images/trailers/${image}.webp` })),
  'shower-trailers': [
    ['20ft Shower Container (5 Stalls)', '20ft-shower-container-5'], ['20ft Shower Trailer (10 Stalls) with Handwashing Sink', '20ft-shower-trailer-10']
  ].map(([name, image]) => ({ name, image: `/images/trailers/${image}.webp` })),
  'restroom-trailers': [{ name: 'Restroom Trailer', image: '/images/trailers/restroom-trailer.webp' }],
  'shower-restroom-combinations': [
    ['13ft Luxury Shower–Restroom Combination Trailer (3 Stalls)', '13ft-combo-3'], ['22ft Luxury Shower–Restroom Combination Trailer (6 Stalls)', '22ft-combo-6'], ['30ft Luxury Shower–Restroom Combination Trailer (8 Stalls)', '30ft-combo-8'], ['30ft Luxury Shower–Restroom Combination Trailer (10 Stalls)', '30ft-combo-10'], ['Luxury Combination Trailer (3 Stalls + 1 ADA)', 'combo-3-ada'], ['Luxury Combination Trailer (8 Stalls + 1 ADA)', 'combo-8-ada']
  ].map(([name, image]) => ({ name, image: `/images/trailers/${image}.webp` })),
  'sleeper-trailers': [
    ['Sleeper Trailer (2 Stalls)', 'sleeper-2-stalls'], ['20ft Contractor Accommodation', '20ft-contractor-accommodation'], ['20ft VIP Accommodation', '20ft-vip-accommodation']
  ].map(([name, image]) => ({ name, image: `/images/trailers/${image}.webp` })),
  'laundry-trailers': [
    ['30ft Laundry Trailer (10 Washer/Dryer)', '30ft-laundry-10'], ['24ft Laundry Trailer', '24ft-laundry'], ['26–27ft Laundry Trailer (8 Washer/Dryer)', '26-27ft-laundry-8'], ['20ft Laundry Container', '20ft-laundry-container']
  ].map(([name, image]) => ({ name, image: `/images/trailers/${image}.webp` })),
  'handwashing-trailers': [{ name: 'Handwashing Sink Trailer', image: '/images/trailers/handwashing-sink-trailer.webp' }]
}

export const kitchenPrices = raw.service_profile.pricing.size_surcharges
export const refrigeratorPrices = raw.service_profile.pricing.temporary_refrigerator_trailer.size_prices

export type InventoryDetailPage = {
  slug: string
  name: string
  family: string
  parentService: string
  image: string
  description: string
}

const inventoryPage = (slug: string, name: string, family: string, parentService: string, image: string): InventoryDetailPage => ({
  slug, name, family, parentService, image,
  description: `${name} is presented as a temporary rental option. Configuration, utilities, placement, access, rental term, delivery, setup, and current availability are confirmed through the project quote.`
})

export const inventoryDetailPages: InventoryDetailPage[] = [
  inventoryPage('12ft-restroom-shower-combo-trailers', '12ft Restroom and Shower Combination Trailer Rentals', 'Shower and restroom combination family', 'shower-restroom-combinations', '/images/trailers/13ft-combo-3.webp'),
  inventoryPage('12ft-shower-trailer-rental', '12ft Portable Shower Trailer Rental', 'Shower family', 'shower-trailers', '/images/shower.webp'),
  inventoryPage('14ft-restroom-shower-combo-trailer', '14ft Restroom and Shower Combination Trailer Rental', 'Shower and restroom combination family', 'shower-restroom-combinations', '/images/trailers/13ft-combo-3.webp'),
  inventoryPage('14ft-shower-trailer-rental', '14ft Portable Shower Trailer Rental', 'Shower family', 'shower-trailers', '/images/shower.webp'),
  inventoryPage('20ft-mobile-sleeper-123-contractors-trailer-rental', '20ft Contractor Mobile Sleeper Trailer Rental', 'Sleeper and bunkbed family', 'sleeper-trailers', '/images/trailers/20ft-contractor-accommodation.webp'),
  inventoryPage('20ft-mobile-sleeper-123-shared-trailer-rental', '20ft Shared Mobile Sleeper Trailer Rental', 'Sleeper and bunkbed family', 'sleeper-trailers', '/images/sleeper.webp'),
  inventoryPage('20ft-mobile-sleeper-123-vip-trailer-rental', '20ft VIP Mobile Sleeper Trailer Rental', 'Sleeper and bunkbed family', 'sleeper-trailers', '/images/trailers/20ft-vip-accommodation.webp'),
  inventoryPage('22ft-dishwashing-trailer-rental', '22ft Commercial Dishwashing Trailer Rental', 'Dishwashing family', 'dishwashing-trailers', '/images/trailers/22-26ft-low-temp-dish.webp'),
  inventoryPage('24ft-dishwashing-trailer-rental', '24ft Commercial Dishwashing Trailer Rental', 'Dishwashing family', 'dishwashing-trailers', '/images/dishwashing.webp'),
  inventoryPage('24ft-mobile-kitchen-trailer-rental', '24ft Mobile Commercial Kitchen Trailer Rental', 'Kitchen family', 'mobile-kitchen-trailers', '/images/trailers/24ft-mobile-kitchen.webp'),
  inventoryPage('26ft-dishwashing-trailer-rental', '26ft Commercial Dishwashing Trailer Rental', 'Dishwashing family', 'dishwashing-trailers', '/images/trailers/22-26ft-low-temp-dish.webp'),
  inventoryPage('26ft-mobile-kitchen-trailer-rental', '26ft Mobile Commercial Kitchen Trailer Rental', 'Kitchen family', 'mobile-kitchen-trailers', '/images/trailers/26ft-baby-bulk-kitchen.webp'),
  inventoryPage('28ft-mobile-kitchen-trailer-rental', '28ft Mobile Commercial Kitchen Trailer Rental', 'Kitchen family', 'mobile-kitchen-trailers', '/images/trailers/28ft-mobile-kitchen.webp'),
  inventoryPage('30ft-shower-trailer-rental', '30ft Portable Shower Trailer Rental', 'Shower family', 'shower-trailers', '/images/shower.webp'),
  inventoryPage('38ft-conveyor-dishwashing-trailer-rental', '38ft Conveyor Dishwashing Trailer Rental', 'Dishwashing family', 'dishwashing-trailers', '/images/trailers/38ft-high-temp-dish.webp'),
  inventoryPage('38ft-mobile-kitchen-trailer-rental', '38ft Mobile Commercial Kitchen Trailer Rental', 'Kitchen family', 'mobile-kitchen-trailers', '/images/trailers/38ft-mobile-kitchen.webp'),
  inventoryPage('40ft-bulk-combo-kitchen-trailer-rental', '40ft Bulk Combination Kitchen Trailer Rental', 'Kitchen family', 'mobile-kitchen-trailers', '/images/trailers/40ft-bulk-combo-kitchen.webp'),
  inventoryPage('40ft-bulk-kitchen-trailer-rental', '40ft Bulk Commercial Kitchen Trailer Rental', 'Kitchen family', 'mobile-kitchen-trailers', '/images/trailers/40ft-bulk-kitchen.webp'),
  inventoryPage('40ft-combo-kitchen-trailer-rental', '40ft Combination Kitchen Trailer Rental', 'Kitchen family', 'mobile-kitchen-trailers', '/images/trailers/40ft-mobile-combo-kitchen.webp'),
  inventoryPage('40ft-mobile-kitchen-trailer-rental', '40ft Mobile Commercial Kitchen Trailer Rental', 'Kitchen family', 'mobile-kitchen-trailers', '/images/trailers/40ft-mobile-kitchen.webp'),
  inventoryPage('containerized-shower-unit-rental', 'Containerized Portable Shower Unit Rental', 'Shower family', 'shower-trailers', '/images/trailers/20ft-shower-container-5.webp'),
  inventoryPage('containerized-sleeper-rental', 'Containerized Sleeper and Bunkbed Rental', 'Sleeper and bunkbed family', 'sleeper-trailers', '/images/sleeper.png'),
  inventoryPage('customized-combo-trailer-rental', 'Customized Multiple-Use Combination Trailer Rental', 'Combination facility family', 'shower-restroom-combinations', '/images/shower-restroom.webp'),
  inventoryPage('kitchen-office-combo-trailer-rental', 'Kitchen and Office Combination Trailer Rental', 'Combination facility family', 'mobile-kitchen-trailers', '/images/mobile-kitchen.webp'),
  inventoryPage('kitchen-sleeper-combo-trailer-rental', 'Kitchen and Sleeper Combination Trailer Rental', 'Combination facility family', 'mobile-kitchen-trailers', '/images/trailers/40ft-mobile-combo-kitchen.webp'),
  inventoryPage('production-center-office-combo-trailer-rental', 'Production Center and Office Combination Trailer Rental', 'Combination facility family', 'mobile-kitchen-trailers', '/images/mobile-kitchen.webp'),
  inventoryPage('shower-restroom-combo-trailer-rental', 'Shower and Restroom Combination Trailer Rental', 'Shower and restroom combination family', 'shower-restroom-combinations', '/images/shower-restroom.webp'),
  inventoryPage('shower-restroom-office-combo-trailer-rental', 'Shower, Restroom, and Office Combination Trailer Rental', 'Shower and restroom combination family', 'shower-restroom-combinations', '/images/trailers/combo-8-ada.webp'),
  inventoryPage('12ft-restroom-trailer-rental', '12ft Mobile Restroom Trailer Rental', 'Restroom family', 'restroom-trailers', '/images/trailers/restroom-trailer.webp'),
  inventoryPage('14ft-restroom-trailer-rental', '14ft Mobile Restroom Trailer Rental', 'Restroom family', 'restroom-trailers', '/images/restroom.webp'),
  inventoryPage('24ft-laundry-trailer', '24ft Mobile Laundry Trailer Rental', 'Laundry family', 'laundry-trailers', '/images/trailers/24ft-laundry.webp'),
  inventoryPage('30ft-laundry-trailer-rental', '30ft Mobile Laundry Trailer Rental', 'Laundry family', 'laundry-trailers', '/images/trailers/30ft-laundry-10.webp'),
  inventoryPage('containerized-units', 'Containerized Temporary Facility Rentals', 'Containerized facility family', 'sleeper-trailers', '/images/sleeper.png'),
  inventoryPage('deluxe-multiple-use-trailers', 'Deluxe Multiple-Use Trailer Rentals', 'Combination facility family', 'shower-restroom-combinations', '/images/shower-restroom.webp'),
  inventoryPage('dishwashing-trailer-rental', 'Commercial Dishwashing Trailer Rentals', 'Dishwashing family', 'dishwashing-trailers', '/images/dishwashing.webp'),
  inventoryPage('laundry-trailers', 'Mobile Laundry Trailer Rentals', 'Laundry family', 'laundry-trailers', '/images/laundry.webp'),
  inventoryPage('mobile-kitchen-trailer', 'Mobile Commercial Kitchen Trailer Rentals', 'Kitchen family', 'mobile-kitchen-trailers', '/images/mobile-kitchen.webp'),
  inventoryPage('office-trailer', 'Temporary Mobile Office Trailer Rental', 'Office facility family', 'mobile-kitchen-trailers', '/images/trailers/40ft-mobile-combo-kitchen.webp'),
  inventoryPage('refrigeration-trailers', 'Refrigerated Trailer Rentals for Temporary Cold Storage', 'Refrigerator family', 'refrigeration-trailers', '/images/refrigeration.webp'),
  inventoryPage('restroom-shower', 'Restroom and Shower Combination Trailer Rentals', 'Shower and restroom combination family', 'shower-restroom-combinations', '/images/shower-restroom.webp'),
  inventoryPage('restroom-trailers', 'Mobile Restroom Trailer Rentals', 'Restroom family', 'restroom-trailers', '/images/restroom.webp'),
  inventoryPage('shower-trailers', 'Portable Shower Trailer Rentals', 'Shower family', 'shower-trailers', '/images/shower.webp'),
  inventoryPage('sleeper-trailer', 'Sleeper and Bunkbed Trailer Rentals', 'Sleeper and bunkbed family', 'sleeper-trailers', '/images/sleeper.webp'),
  inventoryPage('stairs-and-ramps-rental-2', 'Temporary Trailer Stairs and Ramps Rental', 'Site access equipment family', 'restroom-trailers', '/images/restroom.webp')
]

export const inventoryDetailBySlug = (slug: string) => inventoryDetailPages.find((page) => page.slug === slug)

export const coreRoutes = ['/', '/services/', '/service-areas/', '/rental-calculator/', '/about-us/', '/contact-us/', '/blog/', '/privacy/']
export const serviceRoutes = services.map((service) => `/services/${service.slug}/`)
export const inventoryDetailRoutes = inventoryDetailPages.map((page) => `/${page.slug}/`)
export const stateRoutes = statePages.map((state) => statePath(state.state))
export const cityRoutes = cities.map(cityPath)
export const legacyRoutes = [
  '/Locations.html', '/equipment-rental/mobile-kitchen-trailers/', '/portable-dishwashing-trailer-rental/',
  '/equipment-rental/refrigeration/', '/equipment-rental/shower-trailer/', '/equipment-rental/restroom-trailers/',
  '/services/shower-restroom-combination-trailers/', '/equipment-rental/mobile-sleep-trailers/',
  '/equipment-rental/laundry-trailers/', '/equipment-rental/handwashing-stations/'
]
export const routes = [...coreRoutes, ...serviceRoutes, ...inventoryDetailRoutes, ...stateRoutes, ...cityRoutes, ...legacyRoutes]
