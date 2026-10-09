import type { IncomingMessage, ServerResponse } from 'node:http'

type LeadData = {
  url: string
  name: string
  email: string
  phone: string
  message: string
  service: string
  duration: string
  industry: string
  location: string
  startDate: string
  consent: boolean
  website?: string
}

type RequestWithBody = IncomingMessage & { body?: unknown }
const allowedOrigins = new Set([
  'https://mobile-restroom-trailer-rental.com',
  'https://www.mobile-restroom-trailer-rental.com',
  'https://mobile-restroom-trailer-rental.vercel.app',
])
const requestBuckets = new Map<string, { count: number; resetAt: number }>()
const maxString = (value: unknown, length: number) => typeof value === 'string' ? value.trim().slice(0, length) : ''
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function validateLead(input: unknown): { data?: LeadData; error?: string } {
  if (!input || typeof input !== 'object' || !('data' in input)) return { error: 'Invalid request.' }
  const raw = (input as { data?: unknown }).data
  if (!raw || typeof raw !== 'object') return { error: 'Invalid request.' }
  const values = raw as Record<string, unknown>
  const data: LeadData = {
    url: maxString(values.url, 500),
    name: maxString(values.name, 120),
    email: maxString(values.email, 254).toLowerCase(),
    phone: maxString(values.phone, 40),
    message: maxString(values.message, 3000),
    service: maxString(values.service, 120),
    duration: maxString(values.duration, 80),
    industry: maxString(values.industry, 80),
    location: maxString(values.location, 180),
    startDate: maxString(values.startDate, 20),
    consent: values.consent === true,
    website: maxString(values.website, 200),
  }
  if (data.website) return { data }
  if (!data.name || !emailPattern.test(data.email) || !data.phone || !data.message || !data.service || !data.location || !data.consent) {
    return { error: 'Complete all required fields and confirm consent.' }
  }
  const path = data.url.startsWith('/') && !data.url.startsWith('//') ? data.url : '/contact-us/'
  data.url = `https://mobile-restroom-trailer-rental.com${path}`
  return { data }
}

function clientAddress(req: IncomingMessage) {
  const forwarded = req.headers['x-vercel-forwarded-for'] || req.headers['x-forwarded-for']
  return (Array.isArray(forwarded) ? forwarded[0] : forwarded?.split(',')[0])?.trim() || req.socket.remoteAddress || 'unknown'
}

function isRateLimited(key: string) {
  const now = Date.now()
  const current = requestBuckets.get(key)
  if (!current || current.resetAt <= now) {
    requestBuckets.set(key, { count: 1, resetAt: now + 60_000 })
    return false
  }
  current.count += 1
  return current.count > 5
}

function send(res: ServerResponse, status: number, body: Record<string, unknown>) {
  res.statusCode = status
  res.setHeader('Content-Type', 'application/json; charset=utf-8')
  res.setHeader('Cache-Control', 'no-store')
  res.setHeader('X-Content-Type-Options', 'nosniff')
  res.end(JSON.stringify(body))
}

export default async function handler(req: RequestWithBody, res: ServerResponse) {
  if (req.method !== 'POST') return send(res, 405, { error: 'Method not allowed.' })
  const origin = typeof req.headers.origin === 'string' ? req.headers.origin : ''
  const deploymentOrigin = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : ''
  if (!allowedOrigins.has(origin) && origin !== deploymentOrigin) return send(res, 403, { error: 'Request origin is not allowed.' })
  if (isRateLimited(clientAddress(req))) {
    res.setHeader('Retry-After', '60')
    return send(res, 429, { error: 'Too many requests. Please wait and try again.' })
  }
  const serializedLength = JSON.stringify(req.body ?? {}).length
  if (serializedLength > 12_000) return send(res, 413, { error: 'Request is too large.' })
  const validated = validateLead(req.body)
  if (validated.error || !validated.data) return send(res, 400, { error: validated.error || 'Invalid request.' })
  if (validated.data.website) return send(res, 200, { ok: true })

  const webhookUrl = process.env.GLIDE_WEBHOOK_URL
  const token = process.env.GLIDE_WEBHOOK_TOKEN
  if (!webhookUrl || !token) return send(res, 503, { error: 'Contact delivery is temporarily unavailable.' })

  try {
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), 8_000)
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ data: validated.data }),
      signal: controller.signal,
    }).finally(() => clearTimeout(timer))
    if (!response.ok) return send(res, 502, { error: 'The request could not be delivered. Please call for immediate help.' })
    return send(res, 200, { ok: true })
  } catch {
    return send(res, 502, { error: 'The request could not be delivered. Please call for immediate help.' })
  }
}
