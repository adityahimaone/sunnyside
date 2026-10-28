import localFont from 'next/font/local'

/* Loaded only on the Cove route. Instrument Serif ships one weight (400) plus
   an italic; Instrument Sans is the variable UI face. Preload is off so the
   case does not compete with the site's own body face. */
const display = localFont({
  src: [
    {
      path: './fonts/InstrumentSerif-Regular.ttf',
      weight: '400',
      style: 'normal',
    },
    {
      path: './fonts/InstrumentSerif-Italic.ttf',
      weight: '400',
      style: 'italic',
    },
  ],
  variable: '--font-cove-display',
  display: 'swap',
  preload: false,
})

const reading = localFont({
  src: [
    {
      path: './fonts/InstrumentSans.ttf',
      weight: '400 700',
      style: 'normal',
    },
  ],
  variable: '--font-cove-reading',
  display: 'swap',
  preload: false,
})

export default function CoveLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className={`${display.variable} ${reading.variable}`}>{children}</div>
  )
}
