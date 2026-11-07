/**
 * @jest-environment node
 */
import { GET } from '@/app/resume/route'
import { CONTACT } from '@/features/landing-page/studio/studio-data'

describe('/resume route handler', () => {
  const originalFetch = global.fetch

  afterEach(() => {
    global.fetch = originalFetch
  })

  it('redirects to the local PDF when HEAD request succeeds', async () => {
    global.fetch = jest.fn().mockResolvedValue({ ok: true } as Response)

    const request = new Request('https://adityahimaone.space/resume')
    const response = await GET(request)

    expect(response.status).toBe(307)
    expect(response.headers.get('location')).toBe('https://adityahimaone.space/resume.pdf')
  })

  it('redirects to the Google Drive fallback when HEAD request returns non-200', async () => {
    global.fetch = jest.fn().mockResolvedValue({ ok: false, status: 404 } as Response)

    const request = new Request('https://adityahimaone.space/resume')
    const response = await GET(request)

    expect(response.status).toBe(307)
    expect(response.headers.get('location')).toBe(CONTACT.resumeFallback)
  })

  it('redirects to the Google Drive fallback when fetch throws a network error', async () => {
    global.fetch = jest.fn().mockRejectedValue(new Error('Network error'))

    const request = new Request('https://adityahimaone.space/resume')
    const response = await GET(request)

    expect(response.status).toBe(307)
    expect(response.headers.get('location')).toBe(CONTACT.resumeFallback)
  })
})
