import { describe, expect, it } from 'vitest'
import { cities, citiesForState, cityPath, inventoryDetailPages, routes, services, site, statePages } from '../src/data'

describe('authoritative site data', () => {
  it('includes all states, cities, and nine services', () => {
    expect(statePages).toHaveLength(50)
    expect(cities).toHaveLength(246)
    expect(services).toHaveLength(9)
  })
  it('links every state to every matching city slug', () => {
    for (const state of statePages) {
      const matching = citiesForState(state.state)
      expect(matching).toHaveLength(state.city_count)
      for (const city of matching) expect(routes).toContain(cityPath(city))
    }
  })
  it('keeps exact breadcrumb labels and city-specific facts', () => {
    for (const city of cities) {
      expect(city.page_layout_data.breadcrumb_labels).toEqual(['Home', 'Service Area Pages', city.state, city.representative_city])
      expect(city.page_layout_data.h1).toContain(city.representative_city)
      expect(city.page_layout_data.description.toLowerCase()).toContain(city.page_layout_data.delivery_time_range.display.toLowerCase())
      expect(city.page_layout_data.starting_price).toBe(city.prices_after_city_discount['20_ft'])
    }
  })
  it('never applies city discounts to refrigerator pricing', () => {
    expect(site.service_profile.pricing.temporary_refrigerator_trailer.size_prices).toEqual({ '20_ft': 2452, '25_ft': 2952, '30_ft': 3452, '35_ft': 3952, '40_ft': 4452 })
  })
  it('contains no bracketed placeholders', () => {
    const text = JSON.stringify(site)
    expect(text).not.toMatch(/\[(?:CONFIRM|DELIVERY|MINIMUM|SERVICE|EMERGENCY)[^\]]*\]/i)
  })
  it('assigns no incident source URL to two cities', () => {
    const urls = cities.flatMap((city) => city.page_layout_data.related_incident_articles.map((article) => article.source_url))
    expect(new Set(urls).size).toBe(urls.length)
  })
  it('publishes every requested exact-path inventory page', () => {
    const expected = [
      '12ft-restroom-shower-combo-trailers','12ft-shower-trailer-rental','14ft-restroom-shower-combo-trailer','14ft-shower-trailer-rental','20ft-mobile-sleeper-123-contractors-trailer-rental','20ft-mobile-sleeper-123-shared-trailer-rental','20ft-mobile-sleeper-123-vip-trailer-rental','22ft-dishwashing-trailer-rental','24ft-dishwashing-trailer-rental','24ft-mobile-kitchen-trailer-rental','26ft-dishwashing-trailer-rental','26ft-mobile-kitchen-trailer-rental','28ft-mobile-kitchen-trailer-rental','30ft-shower-trailer-rental','38ft-conveyor-dishwashing-trailer-rental','38ft-mobile-kitchen-trailer-rental','40ft-bulk-combo-kitchen-trailer-rental','40ft-bulk-kitchen-trailer-rental','40ft-combo-kitchen-trailer-rental','40ft-mobile-kitchen-trailer-rental','containerized-shower-unit-rental','containerized-sleeper-rental','customized-combo-trailer-rental','kitchen-office-combo-trailer-rental','kitchen-sleeper-combo-trailer-rental','production-center-office-combo-trailer-rental','shower-restroom-combo-trailer-rental','shower-restroom-office-combo-trailer-rental','12ft-restroom-trailer-rental','14ft-restroom-trailer-rental','24ft-laundry-trailer','30ft-laundry-trailer-rental','containerized-units','deluxe-multiple-use-trailers','dishwashing-trailer-rental','laundry-trailers','mobile-kitchen-trailer','office-trailer','refrigeration-trailers','restroom-shower','restroom-trailers','shower-trailers','sleeper-trailer','stairs-and-ramps-rental-2'
    ]
    expect(inventoryDetailPages.map((page) => page.slug)).toEqual(expected)
    for (const slug of expected) expect(routes).toContain(`/${slug}/`)
  })
})
