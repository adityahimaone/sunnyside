import type { Metadata } from 'next'
import localFont from 'next/font/local'

// Three voices, declared once. A font named in the token sheet and not registered
// here falls back silently, which is the failure the font gate catches.
const display = localFont({
  src: '../../assets/fonts/InstrumentSerif-400-normal.woff2',
  variable: '--font-display',
  weight: '400',
  display: 'swap',
})

const reading = localFont({
  src: '../../assets/fonts/InstrumentSans-Variable.woff2',
  variable: '--font-reading',
  weight: '400 700',
  display: 'swap',
})

const mono = localFont({
  src: '../../assets/fonts/IBMPlexMono-400-normal.woff2',
  variable: '--font-mono',
  weight: '400',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Wildflower Wind — seed house | Design system',
  description:
    'Wildflower Wind is a seed house: sun-bleached stock, three plate inks, one cosmos accent, and a mark that is a record of a gust rather than a bouquet.',
  alternates: { canonical: '/design-system/wildflower-wind' },
}

export default function WildflowerWindLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className={`wi-scope ${display.variable} ${reading.variable} ${mono.variable}`}>
      {children}
    </div>
  )
}
