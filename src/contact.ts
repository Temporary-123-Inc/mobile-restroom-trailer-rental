export type LeadSubmission = {
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

export async function submitLead(data: LeadSubmission) {
  const response = await fetch('/api/contact', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ data }),
  })

  const result = await response.json().catch(() => ({ error: 'Unable to read the server response.' })) as { error?: string }
  if (!response.ok) throw new Error(result.error || 'Unable to send your request. Please try again.')
}
