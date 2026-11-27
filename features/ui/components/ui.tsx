'use client'

import * as React from 'react'
import {
  Accordion as AccordionPrimitive,
  Avatar as AvatarPrimitive,
  Checkbox as CheckboxPrimitive,
  Dialog as DialogPrimitive,
  DropdownMenu as DropdownMenuPrimitive,
  Popover as PopoverPrimitive,
  Progress as ProgressPrimitive,
  RadioGroup as RadioGroupPrimitive,
  Select as SelectPrimitive,
  Slider as SliderPrimitive,
  Switch as SwitchPrimitive,
  Tabs as TabsPrimitive,
  Tooltip as TooltipPrimitive,
} from 'radix-ui'
import { Check, ChevronDown, Circle, Info, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import styles from './ui.module.css'

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'accent' | 'outline' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg' | 'icon'
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant = 'primary', size = 'md', type = 'button', ...props },
    ref,
  ) => (
    <button
      ref={ref}
      type={type}
      className={cn(
        styles.button,
        styles[`button_${variant}`],
        styles[`button_${size}`],
        className,
      )}
      {...props}
    />
  ),
)
Button.displayName = 'Button'

export const IconButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 'aria-label': ariaLabel, children, size = 'icon', ...props }, ref) => (
    <Button ref={ref} size={size} aria-label={ariaLabel} {...props}>
      {children}
    </Button>
  ),
)
IconButton.displayName = 'IconButton'

export const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => (
  <input ref={ref} className={cn(styles.input, className)} {...props} />
))
Input.displayName = 'Input'

export const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => (
  <textarea ref={ref} className={cn(styles.textarea, className)} {...props} />
))
Textarea.displayName = 'Textarea'

export function Select({
  children,
  placeholder = 'Choose an option',
  label,
  className,
  id,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Root> & {
  placeholder?: string
  label?: string
  className?: string
  id?: string
}) {
  return (
    <SelectPrimitive.Root {...props}>
      <SelectPrimitive.Trigger
        id={id}
        className={cn(styles.selectTrigger, className)}
        aria-label={label}
      >
        <SelectPrimitive.Value placeholder={placeholder} />
        <SelectPrimitive.Icon>
          <ChevronDown aria-hidden="true" size={16} />
        </SelectPrimitive.Icon>
      </SelectPrimitive.Trigger>
      <SelectPrimitive.Portal>
        <SelectPrimitive.Content
          className={styles.popoverSurface}
          position="popper"
          sideOffset={8}
        >
          <SelectPrimitive.Viewport className={styles.selectViewport}>
            {children}
          </SelectPrimitive.Viewport>
        </SelectPrimitive.Content>
      </SelectPrimitive.Portal>
    </SelectPrimitive.Root>
  )
}

export function SelectItem({
  children,
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Item>) {
  return (
    <SelectPrimitive.Item
      className={cn(styles.selectItem, className)}
      {...props}
    >
      <SelectPrimitive.ItemIndicator className={styles.itemIndicator}>
        <Check size={14} />
      </SelectPrimitive.ItemIndicator>
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    </SelectPrimitive.Item>
  )
}

export const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(styles.checkbox, className)}
    {...props}
  >
    <CheckboxPrimitive.Indicator>
      <Check size={15} strokeWidth={3} />
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
))
Checkbox.displayName = 'Checkbox'

export const RadioGroup = RadioGroupPrimitive.Root
export const RadioItem = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>
>(({ className, ...props }, ref) => (
  <RadioGroupPrimitive.Item
    ref={ref}
    className={cn(styles.radio, className)}
    {...props}
  >
    <RadioGroupPrimitive.Indicator className={styles.radioIndicator}>
      <Circle size={9} fill="currentColor" />
    </RadioGroupPrimitive.Indicator>
  </RadioGroupPrimitive.Item>
))
RadioItem.displayName = 'RadioItem'

export const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitive.Root>
>(({ className, ...props }, ref) => (
  <SwitchPrimitive.Root
    ref={ref}
    className={cn(styles.switch, className)}
    {...props}
  >
    <SwitchPrimitive.Thumb className={styles.switchThumb} />
  </SwitchPrimitive.Root>
))
Switch.displayName = 'Switch'

export const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root> & {
    label?: string
  }
>(({ className, label = 'Value', ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    className={cn(styles.slider, className)}
    {...props}
  >
    <SliderPrimitive.Track className={styles.sliderTrack}>
      <SliderPrimitive.Range className={styles.sliderRange} />
    </SliderPrimitive.Track>
    <SliderPrimitive.Thumb className={styles.sliderThumb} aria-label={label} />
  </SliderPrimitive.Root>
))
Slider.displayName = 'Slider'

export function Card({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn(styles.card, className)} {...props} />
}
export function CardHeader({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn(styles.cardHeader, className)} {...props} />
}
export function CardTitle({
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h3 className={cn(styles.cardTitle, className)} {...props} />
}
export function CardDescription({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn(styles.cardDescription, className)} {...props} />
}
export function CardContent({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn(styles.cardContent, className)} {...props} />
}
export function CardFooter({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn(styles.cardFooter, className)} {...props} />
}

export function Badge({
  className,
  tone = 'neutral',
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & {
  tone?: 'neutral' | 'info' | 'success' | 'warning'
}) {
  return (
    <span
      className={cn(styles.badge, styles[`badge_${tone}`], className)}
      {...props}
    />
  )
}

export function Avatar({
  src,
  alt,
  fallback,
  className,
}: {
  src?: string
  alt: string
  fallback: string
  className?: string
}) {
  return (
    <AvatarPrimitive.Root className={cn(styles.avatar, className)}>
      {src ? (
        <AvatarPrimitive.Image
          className={styles.avatarImage}
          src={src}
          alt={alt}
        />
      ) : null}
      <AvatarPrimitive.Fallback className={styles.avatarFallback} delayMs={200}>
        {fallback}
      </AvatarPrimitive.Fallback>
    </AvatarPrimitive.Root>
  )
}

export const Accordion = AccordionPrimitive.Root
export function AccordionItem({
  className,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Item>) {
  return (
    <AccordionPrimitive.Item
      className={cn(styles.accordionItem, className)}
      {...props}
    />
  )
}
export function AccordionTrigger({
  children,
  className,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Trigger>) {
  return (
    <AccordionPrimitive.Header>
      <AccordionPrimitive.Trigger
        className={cn(styles.accordionTrigger, className)}
        {...props}
      >
        {children}
        <ChevronDown aria-hidden="true" size={17} />
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  )
}
export function AccordionContent({
  children,
  className,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Content>) {
  return (
    <AccordionPrimitive.Content
      className={cn(styles.accordionContent, className)}
      {...props}
    >
      <div>{children}</div>
    </AccordionPrimitive.Content>
  )
}

export const Tabs = TabsPrimitive.Root
export function TabsList({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.List>) {
  return (
    <TabsPrimitive.List className={cn(styles.tabsList, className)} {...props} />
  )
}
export function TabsTrigger({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
  return (
    <TabsPrimitive.Trigger
      className={cn(styles.tabsTrigger, className)}
      {...props}
    />
  )
}
export function TabsContent({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
      className={cn(styles.tabsContent, className)}
      {...props}
    />
  )
}

export function Tooltip({
  children,
  content,
}: {
  children: React.ReactNode
  content: React.ReactNode
}) {
  return (
    <TooltipPrimitive.Provider delayDuration={350}>
      <TooltipPrimitive.Root>
        <TooltipPrimitive.Trigger asChild>{children}</TooltipPrimitive.Trigger>
        <TooltipPrimitive.Portal>
          <TooltipPrimitive.Content className={styles.tooltip} sideOffset={8}>
            {content}
            <TooltipPrimitive.Arrow className={styles.tooltipArrow} />
          </TooltipPrimitive.Content>
        </TooltipPrimitive.Portal>
      </TooltipPrimitive.Root>
    </TooltipPrimitive.Provider>
  )
}

export function Popover({
  trigger,
  children,
}: {
  trigger: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <PopoverPrimitive.Root>
      <PopoverPrimitive.Trigger asChild>{trigger}</PopoverPrimitive.Trigger>
      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Content
          className={cn(styles.popoverSurface, styles.popoverContent)}
          sideOffset={10}
          align="start"
        >
          {children}
          <PopoverPrimitive.Arrow className={styles.popoverArrow} />
        </PopoverPrimitive.Content>
      </PopoverPrimitive.Portal>
    </PopoverPrimitive.Root>
  )
}

export function Dialog({
  trigger,
  title,
  description,
  children,
}: {
  trigger: React.ReactNode
  title: string
  description: string
  children?: React.ReactNode
}) {
  return (
    <DialogPrimitive.Root>
      <DialogPrimitive.Trigger asChild>{trigger}</DialogPrimitive.Trigger>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className={styles.dialogOverlay} />
        <DialogPrimitive.Content className={styles.dialogContent}>
          <DialogPrimitive.Title className={styles.dialogTitle}>
            {title}
          </DialogPrimitive.Title>
          <DialogPrimitive.Description className={styles.dialogDescription}>
            {description}
          </DialogPrimitive.Description>
          {children}
          <DialogPrimitive.Close asChild>
            <IconButton
              className={styles.dialogClose}
              variant="ghost"
              aria-label="Close dialog"
            >
              <X size={18} />
            </IconButton>
          </DialogPrimitive.Close>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  )
}

export function DropdownMenu({
  trigger,
  children,
}: {
  trigger: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <DropdownMenuPrimitive.Root>
      <DropdownMenuPrimitive.Trigger asChild>
        {trigger}
      </DropdownMenuPrimitive.Trigger>
      <DropdownMenuPrimitive.Portal>
        <DropdownMenuPrimitive.Content
          className={cn(styles.popoverSurface, styles.menuContent)}
          sideOffset={8}
          align="end"
        >
          {children}
        </DropdownMenuPrimitive.Content>
      </DropdownMenuPrimitive.Portal>
    </DropdownMenuPrimitive.Root>
  )
}
export function DropdownMenuItem({
  className,
  children,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Item>) {
  return (
    <DropdownMenuPrimitive.Item
      className={cn(styles.menuItem, className)}
      {...props}
    >
      {children}
    </DropdownMenuPrimitive.Item>
  )
}

export function Alert({
  title,
  children,
  tone = 'info',
}: {
  title: string
  children: React.ReactNode
  tone?: 'info' | 'success' | 'warning'
}) {
  const assertive = tone === 'warning'
  return (
    <div
      role={assertive ? 'alert' : 'status'}
      className={cn(styles.alert, styles[`alert_${tone}`])}
    >
      <Info aria-hidden="true" size={19} />
      <div>
        <strong>{title}</strong>
        <p>{children}</p>
      </div>
    </div>
  )
}

export function Progress({ value, label }: { value: number; label: string }) {
  const clamped = Math.min(100, Math.max(0, Math.round(value)))
  return (
    <div className={styles.progressWrap}>
      <div className={styles.progressLabel}>
        <span>{label}</span>
        <span>{clamped}%</span>
      </div>
      <ProgressPrimitive.Root
        className={styles.progress}
        value={clamped}
        aria-label={label}
      >
        <ProgressPrimitive.Indicator
          className={styles.progressIndicator}
          style={{ transform: `translateX(-${100 - clamped}%)` }}
        />
      </ProgressPrimitive.Root>
    </div>
  )
}

export function Table({
  className,
  label = 'Data table',
  ...props
}: React.TableHTMLAttributes<HTMLTableElement> & { label?: string }) {
  return (
    <div
      className={styles.tableWrap}
      role="region"
      aria-label={label}
      tabIndex={0}
    >
      <table className={cn(styles.table, className)} {...props} />
    </div>
  )
}
