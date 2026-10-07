import { describe, expect, it } from 'vitest'
import { cities, citiesForState, cityPath, inventoryDetailPages, restroomFamilyServices, restroomPricing, restroomRentalPeriods, restroomSite, routes, services, site, statePages, supportingServices } from '../src/data'

describe('authoritative site data', () => {
  it('includes all states, cities, and nine services', () => {
    expect(statePages).toHaveLength(50)
    expect(cities).toHaveLength(246)
    expect(services).toHaveLength(9)
  })
  it('uses the corrected Restroom Family taxonomy', () => {
    expect(restroomFamilyServices.map((service) => service.slug)).toEqual([
      'restroom-trailers', 'shower-trailers', 'shower-restroom-combinations',
      'sleeper-trailers', 'laundry-trailers', 'handwashing-trailers'
    ])
    expect(supportingServices.map((service) => service.slug)).toEqual([
      'mobile-kitchen-trailers', 'dishwashing-trailers', 'refrigeration-trailers'
    ])
  })
  it('uses site-36 as the authoritative restroom location source', () => {
    expect(restroomSite.site_id).toBe('site-36')
    expect(restroomSite.company_profile.positioning).toBe('mobile restroom trailer rental and shower-restroom combination rentals')
    expect(statePages.every((state) => /Mobile Restroom Trailer Rental/.test(state.h1))).toBe(true)
    expect(cities.every((city) => /Mobile Restroom Trailer Rental/.test(city.page_layout_data.h1))).toBe(true)
    expect(cities.every((city) => /shower-restroom|restroom trailer/i.test(city.page_layout_data.description))).toBe(true)
  })
  it('preserves every supplied restroom calculator price and blank', () => {
    expect(restroomRentalPeriods.map((period) => period.label)).toEqual(['1–6 days', '8–14 days', '15 days–1 month', 'More than 3 months'])
    expect(restroomPricing).toHaveLength(5)
    expect(restroomPricing[0].prices).toEqual({ '1_6_days': 2995, '8_14_days': 2995, '15_days_1_month': 3995, 'more_than_3_months': { min: 2495, max: 3995 } })
    expect(restroomPricing[2].prices['15_days_1_month']).toEqual({ min: 3995, max: 5995 })
    expect(Object.values(restroomPricing[3].prices)).toEqual([null, null, null, null])
    expect(restroomPricing[4].prices).toEqual({ '1_6_days': 5995, '8_14_days': 6995, '15_days_1_month': 7995, 'more_than_3_months': { min: 5995, max: 6995 } })
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
      expect(city.page_layout_data.starting_price).toBe(city.prices_after_city_discount['13ft_3_stalls'])
      expect(city.page_layout_data.starting_price).toBe(2995)
    }
  })
  it('never applies city discounts to refrigerator pricing', () => {
    expect(site.service_profile.pricing.temporary_refrigerator_trailer.size_prices).toEqual({ '20_ft': 2452, '25_ft': 2952, '30_ft': 3452, '35_ft': 3952, '40_ft': 4452 })
  })
  it('contains no bracketed placeholders', () => {
    const text = JSON.stringify(restroomSite)
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
