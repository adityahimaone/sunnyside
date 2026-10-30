import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Badge } from "@/features/ledger/ui/badge";
import { Button } from "@/features/ledger/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/features/ledger/ui/card";
import { Checkbox } from "@/features/ledger/ui/checkbox";
import { Input } from "@/features/ledger/ui/input";
import { Kbd, KbdGroup } from "@/features/ledger/ui/kbd";
import { Label } from "@/features/ledger/ui/label";
import { RadioGroup, RadioGroupItem } from "@/features/ledger/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/features/ledger/ui/select";
import { Separator } from "@/features/ledger/ui/separator";
import { Switch } from "@/features/ledger/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/features/ledger/ui/table";
import { Textarea } from "@/features/ledger/ui/textarea";
import { LedgerMark } from "@/features/ledger/brand/ledger-mark";
import { ThemeToggle } from "@/features/ledger/dashboard/shell/theme-toggle";
import { CanvasBackdrop } from "@/features/ledger/dashboard/shell/canvas-backdrop";
import { CaseChrome } from "@/features/ledger/case/case-chrome";

const sections = [
  ["overview", "Overview"],
  ["context", "In context"],
  ["foundation", "Foundation"],
  ["surfaces", "Surfaces"],
  ["forms", "Form kit"],
  ["data", "Data display"],
  ["motion", "Motion"],
  ["audit", "Audit"],
] as const;

const ramp = [
  ["--zinc-050", "0.977", "App background (light)"],
  ["--zinc-100", "0.962", "Canvas"],
  ["--zinc-150", "0.944", "Muted / accent fill"],
  ["--zinc-200", "0.885", "Border"],
  ["--zinc-300", "0.812", "Disabled ink"],
  ["--zinc-400", "0.705", "Ring"],
  ["--zinc-500", "0.552", "Muted ink"],
  ["--zinc-700", "0.372", "Body ink"],
  ["--zinc-900", "0.205", "Primary ink"],
  ["--zinc-950", "0.145", "Deep surface"],
] as const;

const typeScale = [
  ["Display", "30 / 1.0", "−0.025em", "Commerce overview", "text-[30px] font-semibold leading-none tracking-[-0.025em]"],
  ["Title", "18 / 1.2", "−0.02em", "Revenue by category", "text-lg font-semibold leading-tight tracking-[-0.02em]"],
  ["Body", "14 / 1.5", "0", "Gross sales, net of refunds.", "text-sm"],
  ["Small", "13 / 1.45", "0", "Last 24 hours · 18 orders", "text-[13px]"],
  ["Micro", "10 / 1.4", "+0.14em", "TOTAL REVENUE", "font-mono text-[10px] uppercase tracking-[0.14em]"],
  ["Figure", "26 / 1.0", "−0.01em", "$284,920", "fig text-[26px] font-semibold"],
] as const;

const states = [
  ["Default", "border-input bg-foreground/[0.02]", "Resting. A recess, not a pane."],
  ["Hover", "border-foreground/20", "The border warms by 12% — never a fill change."],
  ["Focus", "border-foreground/60 bg-background/60 ring-[3px] ring-foreground/15", "Border to 60% ink, plus a 3px ring. No colour."],
  ["Filled", "border-foreground/25", "Value present; the label stays visible."],
  ["Invalid", "border-destructive ring-[3px] ring-destructive/15", "Error is a state, not a red box."],
  ["Disabled", "bg-muted/40 opacity-60", "Readable, never hidden."],
] as const;

export function LedgerCase() {
  return (
    <div data-ledger className="relative min-h-svh">
      <CaseChrome />
      <CanvasBackdrop mode="page" />

      {/* ── Shell ─────────────────────────────────────────────── */}
      <header className="sticky top-0 z-30 border-border/50 border-b bg-background/70 backdrop-blur-md">
        <div className="mx-auto flex h-14 w-full max-w-[1320px] items-center justify-between gap-4 px-5 md:px-8">
          <div className="flex items-center gap-3">
            <span className="flex size-7 items-center justify-center rounded-md bg-foreground text-background">
              <LedgerMark size={15} />
            </span>
            <span className="font-medium tracking-tight">Ledger</span>
            <Separator className="h-4 bg-border/70" orientation="vertical" />
            <span className="hidden font-mono text-[10px] text-muted-foreground uppercase tracking-[0.14em] sm:inline">
              Tactile · v1.0
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Button
              asChild
              className="hidden h-8 gap-1.5 text-muted-foreground text-xs sm:inline-flex"
              size="sm"
              variant="ghost"
            >
              <Link href="/design-system">All systems</Link>
            </Button>
            <Button asChild className="h-8 gap-1.5 text-xs" size="sm" variant="ghost">
              <Link href="/design-system/ledger/dashboard">
                Dashboard
                <ArrowUpRight className="size-3.5" />
              </Link>
            </Button>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <div className="relative z-10 mx-auto flex w-full max-w-[1320px] gap-12 px-5 md:px-8">
        {/* ── Index ───────────────────────────────────────────── */}
        <aside className="sticky top-14 hidden h-fit w-44 shrink-0 py-12 lg:block">
          <p className="mb-4 font-mono text-[10px] text-muted-foreground uppercase tracking-[0.14em]">
            Contents
          </p>
          <nav className="flex flex-col">
            {sections.map(([id, label], index) => (
              <a
                className="group flex items-baseline gap-3 border-border/40 border-l py-1.5 pl-3 text-[13px] text-muted-foreground transition-colors duration-200 hover:border-foreground/40 hover:text-foreground"
                href={`#${id}`}
                key={id}
              >
                <span className="font-mono text-[10px] tabular-nums opacity-50">
                  {String(index + 1).padStart(2, "0")}
                </span>
                {label}
              </a>
            ))}
          </nav>

          <div className="mt-8 rounded-lg border border-border/50 p-3">
            <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-[0.14em]">
              One command
            </p>
            <p className="mt-2 text-[11px] leading-relaxed text-muted-foreground">
              <span className="text-foreground">npx shadcn add</span> then apply
              the tokens. No CSS framework beyond Tailwind v4.
            </p>
          </div>
        </aside>

        {/* ── Body ────────────────────────────────────────────── */}
        <main className="min-w-0 flex-1 pb-24">
          {/* Overview */}
          <section className="scroll-mt-20 pt-12" id="overview">
            <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-[0.16em]">
              Design system · shadcn/ui base
            </p>
            <h1 className="mt-3 max-w-3xl text-balance text-[38px] font-semibold leading-[1.02] tracking-[-0.03em] md:text-[52px]">
              Tactile Glass
              <span className="text-muted-foreground"> &amp; </span>
              Crisp Grid
            </h1>
            <p className="mt-5 max-w-xl text-pretty text-[15px] leading-relaxed text-muted-foreground">
              A dashboard system where the surface is the only decoration. One
              frosted plane, one hairline grid, one signal colour — and every
              number set in tabular figures so columns of money line up.
            </p>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              {[
                ["One surface", "Cards are 65% card + 24px blur. There is no second card style."],
                ["One grid", "12 columns, 16px gutters, 1px rules at 50% border."],
                ["One signal", "Blue is state only: live, pending, focus. Never decoration."],
              ].map(([title, body]) => (
                <div className="rounded-xl border border-border/50 p-4" key={title}>
                  <p className="text-[13px] font-medium tracking-tight">{title}</p>
                  <p className="mt-1.5 text-[12px] leading-relaxed text-muted-foreground">
                    {body}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-2">
              <Badge className="border-border/60 bg-background/50" variant="outline">
                Tailwind v4
              </Badge>
              <Badge className="border-border/60 bg-background/50" variant="outline">
                shadcn/ui · radix
              </Badge>
              <Badge className="border-border/60 bg-background/50" variant="outline">
                Geist Sans / Mono
              </Badge>
              <Badge className="border-border/60 bg-background/50" variant="outline">
                radius 0.75rem
              </Badge>
            </div>
          </section>

          <Divider />

          {/* In context */}
          <section className="scroll-mt-20" id="context">
            <SectionHead
              index="01"
              kicker="In context"
              title="The system, assembled"
              description="Commerce overview at 1440. The rail, the 56px line, four glass KPIs, one chart, one table. The plate follows the page theme — switch to dark and the screenshot switches with it."
            />

            <figure className="mt-8 overflow-hidden rounded-xl border border-border/60 bg-card/40">
              <Image
                alt="The Ledger dashboard in light theme: a 255px rail with the Ledger mark, a 56px top bar, four glass KPI cards, a revenue area chart, a category donut, a recent-orders table and a return-rate card."
                className="block w-full dark:hidden"
                height={1800}
                priority={false}
                sizes="(max-width: 1024px) 100vw, 1096px"
                src="/ledger/dashboard-light.png"
                width={1524}
              />
              <Image
                alt="The same dashboard in dark theme: the mesh-drift field reads through the top-right cards as a deep blue glow."
                className="hidden w-full dark:block"
                height={1800}
                priority={false}
                sizes="(max-width: 1024px) 100vw, 1096px"
                src="/ledger/dashboard-dark.png"
                width={1524}
              />
              <figcaption className="flex flex-wrap items-center justify-between gap-3 border-border/50 border-t px-4 py-3">
                <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-[0.12em]">
                  fig. 01 · commerce overview · 1440 × 1701
                </span>
                <div className="flex items-center gap-2">
                  <span className="mr-1 font-mono text-[10px] text-muted-foreground/70">
                    light / dark
                  </span>
                  <Button
                    asChild
                    className="h-7 gap-1 text-muted-foreground transition-colors duration-200 hover:text-foreground"
                    size="xs"
                    variant="ghost"
                  >
                    <Link href="/design-system/ledger/dashboard">
                      Open the dashboard
                      <ArrowUpRight className="size-3.5" />
                    </Link>
                  </Button>
                </div>
              </figcaption>
            </figure>

            <div className="mt-6 grid gap-5 sm:grid-cols-3">
              {[
                [
                  "The 56px line",
                  "The rail header and the top bar are the same height with the same 1px border, so they meet at a T instead of two floating edges.",
                ],
                [
                  "Glass over a field",
                  "Four KPIs at 65% card. The shader reads through them as a tint and never sits behind a word of type.",
                ],
                [
                  "Figures on the decimal",
                  "Tabular numerals right-align the money column; the table header is a mono eyebrow, not bold body text.",
                ],
              ].map(([title, body], index) => (
                <div className="border-border/50 border-t pt-3" key={title}>
                  <p className="flex items-baseline gap-2">
                    <span className="font-mono text-[10px] text-foreground/35 tabular-nums">
                      0{index + 1}
                    </span>
                    <span className="text-[13px] font-medium tracking-tight">
                      {title}
                    </span>
                  </p>
                  <p className="mt-1.5 text-[12px] leading-relaxed text-muted-foreground">
                    {body}
                  </p>
                </div>
              ))}
            </div>

            <p className="mt-5 max-w-2xl text-[11px] leading-relaxed text-muted-foreground">
              <span className="font-mono text-foreground/50 uppercase tracking-[0.12em]">
                Capture
              </span>{" "}
              — full page at 1440, 2× device pixels, taken from this build. No
              mockup, no retouching; the only thing removed is the browser.
            </p>
          </section>

          <Divider />

          {/* Foundation */}
          <section className="scroll-mt-20" id="foundation">
            <SectionHead
              index="02"
              kicker="Foundation"
              title="A cool zinc ramp, nothing else"
              description="Primitives name the material once. The semantic layer names the job. A theme flip swaps only the second."
            />

            <div className="mt-8 grid grid-cols-5 gap-2 md:grid-cols-10">
              {ramp.map(([token, l, use]) => (
                <div key={token}>
                  <div
                    className="h-14 rounded-lg border border-border/70"
                    style={{ backgroundColor: `var(${token})` }}
                  />
                  <p className="mt-2 font-mono text-[10px] text-foreground">
                    {token.replace("--zinc-", "")}
                  </p>
                  <p className="font-mono text-[9px] text-muted-foreground">
                    L {l}
                  </p>
                  <p className="mt-1 text-[10px] leading-tight text-muted-foreground">
                    {use}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-10 grid gap-4 md:grid-cols-2">
              <div className="rounded-xl border border-border/50 p-5">
                <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-[0.14em]">
                  Semantic roles
                </p>
                <dl className="mt-3 divide-y divide-border/50">
                  {[
                    ["--background", "the canvas", "var(--zinc-100)"],
                    ["--card", "the glass", "var(--zinc-000)"],
                    ["--foreground", "the ink", "var(--zinc-900)"],
                    ["--muted-foreground", "second ink", "var(--zinc-500)"],
                    ["--border", "the hairline", "var(--zinc-200)"],
                    ["--signal", "state only", "oklch(0.548 0.216 262)"],
                  ].map(([token, job, value]) => (
                    <div className="flex items-baseline justify-between gap-4 py-2" key={token}>
                      <dt className="font-mono text-[11px]">{token}</dt>
                      <dd className="text-right text-[11px] text-muted-foreground">
                        {job}
                        <span className="ml-2 font-mono text-[10px] opacity-60">
                          {value}
                        </span>
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>

              <div className="rounded-xl border border-border/50 p-5">
                <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-[0.14em]">
                  Radius
                </p>
                <div className="mt-4 flex items-end gap-3">
                  {[
                    ["sm", "8"],
                    ["md", "10"],
                    ["lg", "12"],
                    ["xl", "16"],
                  ].map(([name, px]) => (
                    <div className="flex-1" key={name}>
                      <div
                        className="h-16 border border-border/70 bg-foreground/[0.03]"
                        style={{ borderRadius: `${px}px` }}
                      />
                      <p className="mt-2 font-mono text-[10px]">
                        {name} · {px}px
                      </p>
                    </div>
                  ))}
                </div>
                <p className="mt-4 text-[11px] leading-relaxed text-muted-foreground">
                  <span className="text-foreground">--radius: 0.75rem</span>.
                  Fields and cards share <span className="font-mono">lg</span>;
                  nothing in the system is square.
                </p>
              </div>
            </div>

            <div className="mt-4 rounded-xl border border-border/50">
              <div className="border-border/50 border-b px-5 py-3">
                <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-[0.14em]">
                  Type scale
                </p>
              </div>
              <div className="divide-y divide-border/40">
                {typeScale.map(([name, size, tracking, sample, className]) => (
                  <div
                    className="flex flex-col gap-2 px-5 py-4 sm:flex-row sm:items-baseline sm:justify-between"
                    key={name}
                  >
                    <div className="min-w-0">
                      <p className="mb-1 font-mono text-[10px] text-muted-foreground">
                        {name} · {size} · {tracking}
                      </p>
                      <p className={`truncate ${className}`}>{sample}</p>
                    </div>
                    <code className="shrink-0 font-mono text-[10px] text-muted-foreground">
                      {className}
                    </code>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <Divider />

          {/* Surfaces */}
          <section className="scroll-mt-20" id="surfaces">
            <SectionHead
              index="03"
              kicker="Surfaces"
              title="Two panes and a float"
              description="A panel sits on the canvas. A float sits on a panel. Nothing sits on three levels — that is how glass turns into mud."
            />

            <div className="mt-8 grid gap-4 md:grid-cols-3">
              <div className="relative overflow-hidden rounded-xl border border-border/50 p-6">
                <div className="grid-field absolute inset-0 opacity-60" />
                <div className="glass-panel relative rounded-xl p-5">
                  <p className="text-[13px] font-medium tracking-tight">
                    .glass-panel
                  </p>
                  <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">
                    card at 65%, 24px blur, 1px hairline, inset top highlight.
                  </p>
                </div>
              </div>

              <div className="relative overflow-hidden rounded-xl border border-border/50 p-6">
                <div className="ambient-field absolute inset-0" />
                <div className="glass-float relative rounded-xl p-5">
                  <p className="text-[13px] font-medium tracking-tight">
                    .glass-float
                  </p>
                  <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">
                    Popover, menu, tooltip. 82% popover, plus a 24px drop.
                  </p>
                </div>
              </div>

              <div className="rounded-xl border border-border/50 bg-muted/40 p-6">
                <div className="rounded-xl border border-border/60 bg-background p-5">
                  <p className="text-[13px] font-medium tracking-tight">Solid</p>
                  <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">
                    Reserved for sheets and mobile drawers, where blur costs more
                    than it gives.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-4 overflow-hidden rounded-xl border border-border/50">
              <div className="border-border/50 border-b px-5 py-3">
                <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-[0.14em]">
                  Anatomy · .glass-panel
                </p>
              </div>
              <pre className="overflow-x-auto px-5 py-4 font-mono text-[11px] leading-relaxed text-muted-foreground">
{`background-color: color-mix(in oklab, var(--card) 65%, transparent);
backdrop-filter: blur(24px) saturate(140%);
border: 1px solid rgb(0 0 0 / 0.06);   /* dark: white / 0.08 */
box-shadow: inset 0 1px 0 0 rgb(255 255 255 / 0.15);`}
              </pre>
            </div>
          </section>

          <Divider />

          {/* Forms */}
          <section className="scroll-mt-20" id="forms">
            <SectionHead
              index="04"
              kicker="Form kit"
              title="Fields are recesses, not panes"
              description="A field is the one place the glass goes in instead of up: a 2% ink fill, a 1px border, and a 2px inner shadow. Focus lifts the border to 60% ink and adds a 3px ring at 15% — no colour, no glow."
            />

            {/* States */}
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {states.map(([name, cls, note]) => (
                <div key={name}>
                  <div className="mb-2 flex items-baseline justify-between">
                    <Label className="text-[12px] text-muted-foreground">
                      {name}
                    </Label>
                    <code className="font-mono text-[9px] text-muted-foreground/70">
                      {name.toLowerCase()}
                    </code>
                  </div>
                  <Input
                    aria-invalid={name === "Invalid"}
                    className={cls}
                    defaultValue={
                      name === "Filled" ? "SKU-4410-LINEN" : undefined
                    }
                    disabled={name === "Disabled"}
                    placeholder={name === "Filled" ? "" : "e.g. Linen overshirt"}
                    readOnly={name !== "Default"}
                  />
                  <p className="mt-2 text-[11px] leading-relaxed text-muted-foreground">
                    {note}
                  </p>
                </div>
              ))}
            </div>

            {/* Anatomy */}
            <div className="mt-8 grid gap-4 lg:grid-cols-[1.15fr_1fr]">
              <div className="glass-panel rounded-xl p-5">
                <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-[0.14em]">
                  Field anatomy
                </p>

                <div className="mt-5 space-y-2">
                  <div className="flex items-baseline justify-between">
                    <Label htmlFor="ds-product-name">
                      Product name
                      <span className="text-destructive">*</span>
                    </Label>
                    <span className="font-mono text-[10px] text-muted-foreground">
                      required
                    </span>
                  </div>
                  <Input
                    defaultValue="Linen overshirt"
                    id="ds-product-name"
                  />
                  <p className="text-[11px] text-muted-foreground">
                    Shown on the product card and the order line.
                  </p>
                </div>

                <div className="mt-5 space-y-2">
                  <Label htmlFor="ds-sku">SKU</Label>
                  <Input
                    aria-invalid
                    className="font-mono text-[13px]"
                    defaultValue="LINEN-OS-XS"
                    id="ds-sku"
                  />
                  <p className="flex items-center gap-1.5 text-[11px] text-destructive">
                    <span className="size-1 rounded-full bg-destructive" />
                    Already used by another variant.
                  </p>
                </div>

                <div className="mt-5 space-y-2">
                  <Label htmlFor="ds-notes">Internal notes</Label>
                  <Textarea
                    id="ds-notes"
                    placeholder="Fit runs one size large. Restock in November."
                  />
                  <p className="text-right font-mono text-[10px] tabular-nums text-muted-foreground">
                    0 / 280
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <div className="rounded-xl border border-border/50 p-5">
                  <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-[0.14em]">
                    Rules
                  </p>
                  <ol className="mt-3 space-y-2.5 text-[12px] leading-relaxed text-muted-foreground">
                    {[
                      "Label sits above the field, 8px gap, 13px medium.",
                      "Hint sits below, 11px, muted. It never replaces the label.",
                      "Error replaces the hint and sets aria-invalid — the border and the ring both change.",
                      "The required mark is a single asterisk in destructive ink, not a legend.",
                      "Height is 36px, 40px for the primary field of a form.",
                    ].map((rule, i) => (
                      <li className="flex gap-2.5" key={rule}>
                        <span className="font-mono text-[10px] text-foreground/40 tabular-nums">
                          0{i + 1}
                        </span>
                        <span>{rule}</span>
                      </li>
                    ))}
                  </ol>
                </div>

                <div className="rounded-xl border border-border/50 p-5">
                  <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-[0.14em]">
                    Controls
                  </p>
                  <div className="mt-4 space-y-4">
                    <div className="flex items-center gap-2.5">
                      <Checkbox defaultChecked id="ds-check" />
                      <Label htmlFor="ds-check">Charge tax on this product</Label>
                    </div>
                    <div className="flex items-center justify-between gap-3">
                      <Label htmlFor="ds-switch">Track inventory</Label>
                      <Switch defaultChecked id="ds-switch" />
                    </div>
                    <RadioGroup defaultValue="draft">
                      {[
                        ["draft", "Draft"],
                        ["active", "Active"],
                        ["archived", "Archived"],
                      ].map(([value, label]) => (
                        <div className="flex items-center gap-2.5" key={value}>
                          <RadioGroupItem id={`ds-${value}`} value={value} />
                          <Label htmlFor={`ds-${value}`}>{label}</Label>
                        </div>
                      ))}
                    </RadioGroup>
                    <div className="space-y-2">
                      <Label>Category</Label>
                      <Select defaultValue="apparel">
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="glass-float">
                          <SelectItem value="apparel">Apparel</SelectItem>
                          <SelectItem value="footwear">Footwear</SelectItem>
                          <SelectItem value="home">Home &amp; living</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Composed form */}
            <Card className="mt-4 overflow-hidden p-0">
              <CardHeader className="border-border/50 border-b px-5 py-4">
                <CardTitle>Add product</CardTitle>
                <CardDescription>
                  The kit assembled. Nothing here is a one-off component.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-5 px-5 py-5 md:grid-cols-2">
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="f-name">Product name</Label>
                  <Input id="f-name" placeholder="Linen overshirt" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="f-sku">SKU</Label>
                  <Input className="font-mono" id="f-sku" placeholder="LINEN-OS-M" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="f-price">Price</Label>
                  <div className="relative">
                    <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-[13px] text-muted-foreground">
                      $
                    </span>
                    <Input
                      className="pl-6 tabular-nums"
                      defaultValue="129.00"
                      id="f-price"
                      inputMode="decimal"
                    />
                  </div>
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="f-desc">Description</Label>
                  <Textarea id="f-desc" placeholder="Heavyweight linen, boxy fit." />
                </div>
                <div className="flex items-center justify-between gap-3 rounded-lg border border-border/50 px-3 py-2.5 md:col-span-2">
                  <div>
                    <p className="text-[13px] font-medium tracking-tight">
                      Publish immediately
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      Otherwise it lands as a draft.
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </CardContent>
              <CardFooter className="flex items-center justify-between border-border/50 border-t bg-foreground/[0.015] px-5 py-3">
                <p className="font-mono text-[10px] text-muted-foreground">
                  <KbdGroup>
                    <Kbd>⌘</Kbd>
                    <Kbd>↵</Kbd>
                  </KbdGroup>
                  <span className="ml-2">to save</span>
                </p>
                <div className="flex items-center gap-2">
                  <Button size="sm" variant="ghost">
                    Cancel
                  </Button>
                  <Button className="cursor-pointer" size="sm">
                    Save product
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </section>

          <Divider />

          {/* Data */}
          <section className="scroll-mt-20" id="data">
            <SectionHead
              index="05"
              kicker="Data display"
              title="Figures line up or they are wrong"
              description="Every number uses tabular figures and −0.01em tracking. Every table cell is right-aligned on the decimal, and the header is a mono eyebrow, not bold body text."
            />

            <div className="mt-8 grid gap-4 lg:grid-cols-[1fr_1.4fr]">
              <Card className="panel-hover p-0">
                <CardHeader className="gap-0 px-5 pt-5">
                  <CardTitle className="font-mono font-normal text-[10px] text-muted-foreground uppercase tracking-[0.14em]">
                    Total revenue
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-5 pt-3">
                  <p className="fig text-[26px] font-semibold leading-none tracking-tight">
                    $284,920
                  </p>
                  <p className="mt-3 flex items-center gap-1.5 text-xs">
                    <Badge className="border-transparent bg-foreground/[0.06] text-foreground tabular-nums">
                      +8.2%
                    </Badge>
                    <span className="text-muted-foreground">vs prior 30 days</span>
                  </p>
                </CardContent>
                <CardFooter className="mt-auto px-5 pb-5">
                  <p className="font-mono text-[10px] text-muted-foreground">
                    .fig · .panel-hover
                  </p>
                </CardFooter>
              </Card>

              <Card className="overflow-hidden p-0">
                <CardHeader className="px-5 pt-5">
                  <CardTitle>Recent orders</CardTitle>
                  <CardDescription>Row hover is a 2% ink wash.</CardDescription>
                </CardHeader>
                <CardContent className="px-2 pb-2">
                  <Table>
                    <TableHeader>
                      <TableRow className="hover:bg-transparent">
                        <TableHead className="pl-3">Order</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Total</TableHead>
                        <TableHead className="pr-3 text-right">Placed</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {[
                        ["LDG-10428", "Paid", "$418.00", "09:42"],
                        ["LDG-10427", "Fulfilled", "$129.00", "09:18"],
                        ["LDG-10426", "Pending", "$246.50", "08:57"],
                      ].map(([id, status, total, time]) => (
                        <TableRow key={id}>
                          <TableCell className="pl-3 font-mono text-[11px] text-muted-foreground">
                            {id}
                          </TableCell>
                          <TableCell>
                            <Badge
                              className={
                                status === "Pending"
                                  ? "border-transparent bg-signal/10 text-signal-ink"
                                  : "border-border/70 bg-transparent text-muted-foreground"
                              }
                              variant="outline"
                            >
                              {status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right font-medium">
                            {total}
                          </TableCell>
                          <TableCell className="pr-3 text-right text-muted-foreground">
                            {time}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-6 rounded-xl border border-border/50 p-5">
              <div>
                <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-[0.14em]">
                  Chart tooltip
                </p>
                <p className="mt-2 text-[11px] text-muted-foreground">
                  The same glass, floated. Never a black box.
                </p>
              </div>
              <div className="glass-float min-w-40 rounded-lg px-3 py-2">
                <p className="font-medium text-xs">Thu, 29 Oct</p>
                <div className="mt-1 flex items-center justify-between gap-6">
                  <span className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                    <span className="h-0.5 w-3 rounded-full bg-foreground" />
                    Revenue
                  </span>
                  <span className="fig text-[11px] font-medium">$17,785</span>
                </div>
              </div>
            </div>
          </section>

          <Divider />

          {/* Motion */}
          <section className="scroll-mt-20" id="motion">
            <SectionHead
              index="06"
              kicker="Motion"
              title="200ms, and only what you touched"
              description="Hover and focus move colour, never geometry. Nothing in the shell animates on load, so the first paint is already the design."
            />
            <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {[
                ["Hover", "200ms", "bg-foreground/[0.02]", "Cards, rows, menu items."],
                ["Focus", "0ms", "3px ring", "Immediate. A ring is not an animation."],
                ["Sidebar", "200ms", "ease-linear", "Width only. No fade on the rail."],
                ["Field", "200ms", "border + ring", "Colour and shadow, never height."],
              ].map(([name, time, what, where]) => (
                <div className="rounded-xl border border-border/50 p-4" key={name}>
                  <div className="flex items-baseline justify-between">
                    <p className="text-[13px] font-medium tracking-tight">{name}</p>
                    <span className="font-mono text-[10px] tabular-nums text-muted-foreground">
                      {time}
                    </span>
                  </div>
                  <p className="mt-2 font-mono text-[10px] text-muted-foreground">
                    {what}
                  </p>
                  <p className="mt-1.5 text-[11px] leading-relaxed text-muted-foreground">
                    {where}
                  </p>
                </div>
              ))}
            </div>
            <p className="mt-4 text-[11px] leading-relaxed text-muted-foreground">
              Under <span className="font-mono text-foreground">prefers-reduced-motion</span>{" "}
              transitions collapse to 0.01ms and the WebGL field renders one
              still frame instead of a loop.
            </p>
          </section>

          <Divider />

          {/* Audit */}
          <section className="scroll-mt-20" id="audit">
            <SectionHead
              index="07"
              kicker="Audit"
              title="What is checked, and what is not"
              description="A system that only lists its passes is a moodboard. These are the measurements behind the claims on this page."
            />
            <div className="mt-8 overflow-hidden rounded-xl border border-border/50">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="pl-4">Claim</TableHead>
                    <TableHead>How</TableHead>
                    <TableHead className="pr-4 text-right">Result</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[
                    ["No horizontal overflow", "documentElement.scrollWidth at 1440 / 1024 / 390", "0 / 0 / 0"],
                    ["Rail meets top bar", "both 56px; borders meet at x=255", "pass"],
                    ["Body ink on canvas", "oklch → sRGB → WCAG, light / dark", "16.05 / 17.51"],
                    ["Muted ink on canvas", "same method, light / dark", "4.69 / 7.37"],
                    ["Muted ink on glass", "composited 65% card, light / dark", "5.04 / 6.90"],
                    ["Signal ink on glass", "pending badge, light / dark", "6.79 / 7.74"],
                    ["Field focus visible", "3px ring + border shift, no colour", "pass"],
                    ["Reduced motion", "still frame drawn, loop skipped", "pass"],
                    ["Chart axis ink", "10px mono, muted on glass", "5.04"],
                  ].map(([claim, how, result]) => (
                    <TableRow key={claim}>
                      <TableCell className="pl-4 font-medium">{claim}</TableCell>
                      <TableCell className="text-muted-foreground">{how}</TableCell>
                      <TableCell className="pr-4 text-right font-mono text-[11px]">
                        {result}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-destructive/25 bg-destructive/[0.04] p-4">
                <p className="font-mono text-[10px] text-destructive uppercase tracking-[0.14em]">
                  Not verified
                </p>
                <p className="mt-2 text-[12px] leading-relaxed text-muted-foreground">
                  Contrast is computed against the canvas and the card, not
                  against the moving field. A bright frame of the shader can
                  lower it behind the top-right cards — those panels stay at 65%
                  opacity precisely so the text never sits directly on it.
                </p>
              </div>
              <div className="rounded-xl border border-border/50 p-4">
                <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-[0.14em]">
                  Known gap
                </p>
                <p className="mt-2 text-[12px] leading-relaxed text-muted-foreground">
                  There is no drawn wordmark. The name is set in Geist, which
                  means a font failure changes it. The mark is the only fixed
                  signature, so it carries the favicon and the lockup.
                </p>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

function SectionHead({
  index,
  kicker,
  title,
  description,
}: {
  index: string;
  kicker: string;
  title: string;
  description: string;
}) {
  return (
    <div className="max-w-2xl">
      <p className="flex items-center gap-2 font-mono text-[10px] text-muted-foreground uppercase tracking-[0.16em]">
        <span className="text-foreground/40">{index}</span>
        <span className="h-px w-6 bg-border" />
        {kicker}
      </p>
      <h2 className="mt-3 text-balance text-[24px] font-semibold leading-tight tracking-[-0.02em] md:text-[28px]">
        {title}
      </h2>
      <p className="mt-3 text-pretty text-[13px] leading-relaxed text-muted-foreground">
        {description}
      </p>
    </div>
  );
}

function Divider() {
  return <hr className="my-14 border-border/50" />;
}
