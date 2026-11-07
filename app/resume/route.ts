import { NextResponse } from 'next/server'
import { CONTACT } from '@/features/landing-page/studio/studio-data'

export async function GET(request: Request) {
  try {
    const origin = new URL(request.url).origin
    const pdfUrl = `${origin}${CONTACT.resume}`
    const res = await fetch(pdfUrl, { method: 'HEAD' })
    if (res.ok) {
      return NextResponse.redirect(pdfUrl, 307)
    }
  } catch {
    // If checking the local PDF fails, fall back to Google Drive
  }

  return NextResponse.redirect(CONTACT.resumeFallback, 307)
}
