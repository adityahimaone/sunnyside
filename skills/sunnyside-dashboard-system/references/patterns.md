# Patterns

Copy these. Every number is from a shipped case, not a taste.

---

## 1 · Tokens, scoped

Three layers in one file. Never `:root` — the host app already owns the shadcn role
tokens and a dashboard case must not repaint the site.

```css
[data-<slug>] {
  /* primitive — the material, once */
  --lg-zinc-000: oklch(1 0 0);
  --lg-zinc-100: oklch(0.962 0.004 258);
  --lg-zinc-200: oklch(0.885 0.006 264);
  --lg-zinc-500: oklch(0.532 0.011 264);
  --lg-zinc-900: oklch(0.205 0.006 285.9);
  --lg-signal-500: oklch(0.548 0.216 262.4);

  /* semantic — the job */
  --radius: 0.75rem;
  --background: var(--lg-zinc-100);
  --foreground: var(--lg-zinc-900);
  --card: var(--lg-zinc-000);
  --muted-foreground: var(--lg-zinc-500);
  --border: var(--lg-zinc-200);
  --signal: var(--lg-signal-500);
  --signal-ink: oklch(0.472 0.19 262);
  --chart-1: oklch(0.272 0.007 264);
  --chart-2: oklch(0.442 0.010 264);
  --chart-3: oklch(0.612 0.009 264);
  --chart-4: oklch(0.762 0.008 264);
  --chart-5: oklch(0.885 0.006 264);

  font-family: var(--font-geist), ui-sans-serif, system-ui, sans-serif;
  background-color: var(--background);
  color: var(--foreground);
}

/* next-themes puts .dark on <html>; answer to both an ancestor and own class */
.dark [data-<slug>],
[data-<slug>].dark {
  --background: oklch(0.155 0.006 265);
  --card: oklch(0.215 0.006 265);
  --foreground: var(--lg-zinc-100);
  --muted-foreground: oklch(0.702 0.009 264);
  --border: oklch(1 0 0 / 10%);
  --chart-1: oklch(0.962 0.004 258);
  --chart-5: oklch(0.342 0.007 264);
  --signal-ink: oklch(0.74 0.15 262);
}
```

`--radius` is read by every primitive; set it once and delete per-component radii.

---

## 2 · The shell

Rail header and top bar are the same 56px with the same border token. The junction is
the design.

```tsx
<SidebarProvider className="relative">
  <CanvasBackdrop />                       {/* z-0 */}
  <AppSidebar />
  <SidebarInset className="relative min-w-0 bg-transparent">
    <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center justify-between
                       gap-3 border-b border-border/50 bg-background/70 px-4
                       backdrop-blur-md md:px-8">
      …
    </header>
    <div className="flex min-w-0 flex-1 flex-col gap-5 px-4 pb-10 md:px-8">{children}</div>
  </SidebarInset>
</SidebarProvider>
```

**The z-index trap.** The scoped wrapper carries the opaque canvas colour. A backdrop at
`-z-10` paints *under* that colour and disappears. The field is `z-0`, the shell
`relative z-10`.

```tsx
<div data-<slug> className="relative min-h-svh">
  <CanvasBackdrop />                       {/* fixed inset-0 z-0 bg-background */}
  <div className="relative z-10"><AppShell>…</AppShell></div>
</div>
```

**Never** give the header negative margins unless the shell has matching padding. A
`-mx-4` header inside an unpadded inset adds 24px of horizontal scroll at every width.

---

## 3 · The KPI

```tsx
<Card className="panel-hover gap-0 p-0 lg:col-span-3">
  <CardHeader className="gap-0 px-5 pt-5">
    <CardTitle className="font-mono text-[10px] font-normal uppercase tracking-[0.14em]
                          text-muted-foreground">
      Total revenue
    </CardTitle>
  </CardHeader>
  <CardContent className="flex items-end justify-between gap-3 px-5 pt-3">
    <p className="fig text-[26px] font-semibold leading-none tracking-tight">$284,920</p>
    <Sparkline className="mb-0.5 text-foreground/45" data={series} />
  </CardContent>
  <CardFooter className="gap-1.5 px-5 pt-4 pb-5 text-xs">
    <Delta value={8.2}><DeltaIcon /><DeltaValue /></Delta>
    <span className="text-muted-foreground">vs prior 30 days</span>
  </CardFooter>
</Card>
```

```css
[data-<slug>] .fig { font-variant-numeric: tabular-nums; letter-spacing: -0.01em; }
```

A number without a baseline is a decoration. The delta is the design.

---

## 4 · The area chart

No library. Real pixel widths, so the 10px mono ticks stay 10px.

```tsx
const PAD = { top: 14, right: 10, bottom: 26, left: 46 }

// 1/1.5/2/2.5/3/4/5/6/8/10 — a 1/2/5 ladder flattens a 4.8% series onto 0–10
function niceCeil(value: number) {
  if (value <= 0) return 1
  const exponent = Math.floor(Math.log10(value))
  const magnitude = 10 ** exponent
  const normalised = value / magnitude
  const ladder = [1, 1.5, 2, 2.5, 3, 4, 5, 6, 8, 10]
  return (ladder.find((c) => normalised <= c) ?? 10) * magnitude
}

// Monotone cubic (Fritsch–Carlson): cannot overshoot, so revenue never dips below 0
function monotonePath(pts: { x: number; y: number }[]) {
  const dx: number[] = [], slope: number[] = []
  for (let i = 0; i < pts.length - 1; i += 1) {
    dx[i] = pts[i + 1].x - pts[i].x
    slope[i] = (pts[i + 1].y - pts[i].y) / (dx[i] || 1)
  }
  const t: number[] = [slope[0]]
  for (let i = 1; i < pts.length - 1; i += 1) {
    t[i] = slope[i - 1] * slope[i] <= 0 ? 0 : (slope[i - 1] + slope[i]) / 2
  }
  t[pts.length - 1] = slope[pts.length - 2]
  let d = `M ${pts[0].x} ${pts[0].y}`
  for (let i = 0; i < pts.length - 1; i += 1) {
    const third = dx[i] / 3
    d += ` C ${pts[i].x + third} ${pts[i].y + t[i] * third},` +
         ` ${pts[i + 1].x - third} ${pts[i + 1].y - t[i + 1] * third},` +
         ` ${pts[i + 1].x} ${pts[i + 1].y}`
  }
  return d
}
```

Rules that matter more than the maths:

- **No grid lines.** One baseline at y=0 in `--border`.
- **Four y-ticks.** `[0, .25, .5, .75, 1] × ceiling`, 10px mono, `fill-muted-foreground`.
- **One hover state.** A dashed crosshair in `--border`, one 3.5px dot with a 2px card
  stroke, and a tooltip in the float glass.
- **Width from `ResizeObserver`, not a scaled viewBox.** Text in a stretched viewBox lies.
- **Reduced motion:** there is no animation to disable; the line is drawn, not tweened.

---

## 5 · The donut

One `<circle>` per slice. No arc maths.

```tsx
const radius = (size - thickness) / 2
const circumference = 2 * Math.PI * radius
const gap = 2
let cursor = 0

<g transform={`rotate(-90 ${size / 2} ${size / 2})`}>
  {data.map((slice) => {
    const length = (slice.share / total) * circumference
    const dash = Math.max(0, length - gap)
    const offset = cursor
    cursor += length
    return (
      <circle key={slice.key} r={radius} cx={size / 2} cy={size / 2} fill="none"
        stroke={slice.fill} strokeWidth={thickness}
        strokeDasharray={`${dash} ${circumference - dash}`}
        strokeDashoffset={-offset} />
    )
  })}
</g>
```

The legend is a **data list**, not a colour key: dot, label, share, right-aligned tabular.

---

## 6 · The table

```tsx
<TableHead className="h-9 px-3 text-left font-mono text-[10px] font-normal uppercase
                      tracking-[0.14em] text-muted-foreground">Order</TableHead>

<TableRow className="border-b border-border/50 transition-colors duration-200
                     hover:bg-foreground/[0.02] dark:hover:bg-white/[0.03]">
  <TableCell className="px-3 py-3 tabular-nums tracking-tight">$418.00</TableCell>
</TableRow>
```

- Header is an eyebrow, never bold body text.
- Money is right-aligned and tabular; the column must read as a column.
- Last row has no border (`[&_tr:last-child]:border-0`).
- Hover is a 2% ink wash — the panel keeps its glass.
- On mobile the table scrolls inside its own container; the document does not.

---

## 7 · The form kit

A field is a recess: the one place the glass goes in.

```css
[data-<slug>] .field {
  height: 36px;
  border-radius: var(--radius);
  border: 1px solid var(--input);
  background-color: color-mix(in oklab, var(--foreground) 2%, transparent);
  box-shadow: inset 0 1px 2px 0 rgb(0 0 0 / 0.04);
  transition: border-color 200ms, background-color 200ms, box-shadow 200ms;
}
[data-<slug>] .field:hover { border-color: color-mix(in oklab, var(--foreground) 20%, transparent); }
[data-<slug>] .field:focus-visible {
  border-color: color-mix(in oklab, var(--foreground) 60%, transparent);
  box-shadow: 0 0 0 3px color-mix(in oklab, var(--foreground) 15%, transparent);
  outline: none;
}
[data-<slug>] .field[aria-invalid='true'] {
  border-color: var(--destructive);
  box-shadow: 0 0 0 3px color-mix(in oklab, var(--destructive) 15%, transparent);
}
```

Six states, all rendered on the proof page: default, hover, focus, filled, invalid,
disabled. A 10% ink ring is invisible on glass — 15% plus a 60% border is the floor.

---

## 8 · The four states

Every panel ships with all four, in the same commit as the data.

| State | What it is | The tell |
| --- | --- | --- |
| Default | real data, real copy | figures are tabular |
| Loading | a skeleton with the same box model | the panel never changes height |
| Empty | one sentence, one action | no illustration, no grey circle |
| Error | what failed, what to do | destructive ink, not a red box |

```tsx
{state === 'loading' ? <div className="h-[264px] animate-pulse rounded-lg bg-foreground/[0.03]" />
 : state === 'empty' ? (
   <div className="flex h-[264px] flex-col items-center justify-center gap-2 text-center">
     <p className="text-sm">No orders in this range.</p>
     <Button size="sm" variant="ghost">Clear the filter</Button>
   </div>
 ) : <AreaChart … />}
```

---

## 9 · The proof page

Seven sections, in this order. It is the deliverable that gets linked.

1. **Overview** — the idea in one sentence, three rules, the stack badges.
2. **In context** — a real full-page capture of the dashboard, 2× DPR, swapped by theme.
   Caption it with the measured height. Re-shoot it whenever the dashboard changes.
3. **Foundation** — the ramp with OKLCh L values, semantic roles, radius, type scale.
4. **Surfaces** — panel / float / solid side by side, then the recipe as code.
5. **Form kit** — the six states, the anatomy (label, hint, error, required), a composed form.
6. **Data** — a KPI, a table, a tooltip specimen.
7. **Motion + audit** — 200ms hovers, the reduced-motion rule, the measured table, and the gaps.

---

## 10 · The board

1500 × 1125, rendered at 2× and downscaled. It is the thumbnail; a case without a board
is a logo.

- Header: mark at 44px + wordmark + system name and version.
- Statement: one line, 58px, −0.035em, the second clause in muted ink.
- Left: the dashboard crop in a panel, `object-fit: cover; object-position: top`.
- Right: mark at 64/24/16, the ramp with labels, `Aa` + the type spec, the glass recipe.
- Footer: case number, one line of method, the URL.
