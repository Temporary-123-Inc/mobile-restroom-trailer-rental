import { afterEach, describe, expect, it, vi } from 'vitest'
import handler, { validateLead } from '../api/contact'

const validBody = {
  data: {
    url: '/contact-us/', name: 'Test Visitor', email: 'test@example.com', phone: '5551234567',
    message: 'Webhook integration test', service: 'restroom-trailers', duration: 'under-1-month',
    industry: 'other', location: 'Austin, Texas', startDate: '2026-10-25', consent: true,
  },
}

function responseMock() {
  let body = ''
  const headers = new Map<string, string>()
  return {
    response: {
      statusCode: 200,
      setHeader(name: string, value: string) { headers.set(name, value) },
      end(value: string) { body = value },
    },
    result: () => ({ body: JSON.parse(body), headers }),
  }
}

afterEach(() => {
  vi.restoreAllMocks()
  delete process.env.GLIDE_WEBHOOK_URL
  delete process.env.GLIDE_WEBHOOK_TOKEN
})

describe('contact API', () => {
  it('validates and canonicalizes the source URL', () => {
    const result = validateLead(validBody)
    expect(result.error).toBeUndefined()
    expect(result.data?.url).toBe('https://mobile-restroom-trailer-rental.com/contact-us/')
  })

  it('rejects submissions without consent', () => {
    const result = validateLead({ data: { ...validBody.data, consent: false } })
    expect(result.error).toMatch(/consent/i)
  })

  it('rejects an untrusted browser origin', async () => {
    const mocked = responseMock()
    await handler({ method: 'POST', headers: { origin: 'https://attacker.example' }, socket: { remoteAddress: 'test-1' }, body: validBody } as never, mocked.response as never)
    expect(mocked.response.statusCode).toBe(403)
  })

  it('forwards the validated schema with server-side bearer authentication', async () => {
    process.env.GLIDE_WEBHOOK_URL = 'https://glide.example/webhook'
    process.env.GLIDE_WEBHOOK_TOKEN = 'test-secret'
    const outbound = vi.fn().mockResolvedValue({ ok: true })
    vi.stubGlobal('fetch', outbound)
    const mocked = responseMock()
    await handler({ method: 'POST', headers: { origin: 'https://mobile-restroom-trailer-rental.com' }, socket: { remoteAddress: 'test-2' }, body: validBody } as never, mocked.response as never)
    expect(mocked.response.statusCode).toBe(200)
    expect(outbound).toHaveBeenCalledOnce()
    const [, options] = outbound.mock.calls[0]
    expect(options.headers.Authorization).toBe('Bearer test-secret')
    expect(JSON.parse(options.body)).toEqual({ data: { ...validBody.data, url: 'https://mobile-restroom-trailer-rental.com/contact-us/', website: '' } })
  })
})
