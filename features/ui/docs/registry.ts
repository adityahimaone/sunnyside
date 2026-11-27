export type ComponentGroup =
  | 'Actions'
  | 'Forms'
  | 'Data display'
  | 'Navigation'
  | 'Overlays'
  | 'Feedback'

export type ComponentDoc = {
  slug: string
  name: string
  exportName: string
  group: ComponentGroup
  summary: string
  description: string
  importLine: string
  usage: string
  states: readonly string[]
  accessibility: string
}

const docs = [
  [
    'button',
    'Button',
    'Actions',
    'Triggers an action with clear hierarchy.',
    'Five visual variants, four sizes, tactile press feedback, and native disabled behavior.',
    'primary · accent · outline · ghost · danger',
    'Use a verb that names the result. One primary action per region.',
  ],
  [
    'input',
    'Input',
    'Forms',
    'Collects one line of text.',
    'A native input with Sunnyside borders, paper fill, focus ring, placeholder, and disabled states.',
    'default · invalid · disabled',
    'Always connect a visible label. Add autocomplete where the value has a known purpose.',
  ],
  [
    'textarea',
    'Textarea',
    'Forms',
    'Collects longer free-form text.',
    'A resizable native textarea using the same field contract as Input.',
    'default · invalid · disabled',
    'State what belongs in the field; keep the label visible after entry.',
  ],
  [
    'select',
    'Select',
    'Forms',
    'Chooses one option from a list.',
    'A Radix Select with keyboard typeahead, collision handling, origin-aware motion, and paper menu surface.',
    'closed · open · selected · disabled',
    'Prefer native radio choices when there are fewer than five options and comparison matters.',
  ],
  [
    'checkbox',
    'Checkbox',
    'Forms',
    'Toggles an independent choice.',
    'An accessible Radix checkbox with visible checked, unchecked, focused, and disabled states.',
    'checked · unchecked · disabled',
    'The label describes the selected state. Group related choices with a fieldset.',
  ],
  [
    'radio-group',
    'Radio group',
    'Forms',
    'Chooses one mutually exclusive option.',
    'A keyboard-navigable Radix radio group with a tactile selected mark.',
    'selected · unselected · disabled',
    'Use when all options should stay visible for comparison.',
  ],
  [
    'switch',
    'Switch',
    'Forms',
    'Changes an immediate setting.',
    'A Radix switch with direct state change, compact thumb travel, and readable label pairing.',
    'on · off · disabled',
    'Use for settings that take effect immediately; use Checkbox for form submission.',
  ],
  [
    'slider',
    'Slider',
    'Forms',
    'Selects a value from a range.',
    'A Radix slider with touch support, keyboard increments, strong track contrast, and a 44px interaction lane.',
    'default · focused · disabled',
    'Show the current value and provide an Input when precision matters.',
  ],
  [
    'card',
    'Card',
    'Data display',
    'Groups related content and actions.',
    'A paper sheet with header, content, footer, ink edge, and directional hard shadow.',
    'default · interactive',
    'Do not make the whole card clickable when it contains other controls.',
  ],
  [
    'badge',
    'Badge',
    'Data display',
    'Labels a compact status or category.',
    'Four semantic tones with text and outline so meaning never depends on hue alone.',
    'neutral · info · success · warning',
    'Use one or two words. Never use Badge as a button.',
  ],
  [
    'avatar',
    'Avatar',
    'Data display',
    'Represents a person or entity.',
    'A Radix avatar with image loading and deterministic text fallback.',
    'image · fallback',
    'Provide an accurate alt when the image adds information; use an empty alt beside a visible name.',
  ],
  [
    'table',
    'Table',
    'Data display',
    'Compares structured records.',
    'A semantic table with mono headers, paper rows, and contained horizontal overflow on narrow screens.',
    'default · empty',
    'Use proper headers and captions. Switch to cards only when row comparison is unimportant.',
  ],
  [
    'accordion',
    'Accordion',
    'Navigation',
    'Reveals optional sections in place.',
    'A Radix accordion with keyboard navigation, measured height transition, and reduced-motion fade.',
    'closed · open · disabled',
    'Keep the trigger meaningful without requiring the hidden content.',
  ],
  [
    'tabs',
    'Tabs',
    'Navigation',
    'Switches among peer views.',
    'A Radix tabs set with arrow-key navigation and a visible selected surface.',
    'active · inactive · disabled',
    'Tab labels are short nouns. Preserve state only when users expect it.',
  ],
  [
    'dropdown-menu',
    'Dropdown menu',
    'Navigation',
    'Groups secondary actions.',
    'A Radix menu with roving focus, collision handling, and origin-aware entry.',
    'closed · open · highlighted · disabled',
    'Keep primary actions visible. Menu items should be verbs.',
  ],
  [
    'tooltip',
    'Tooltip',
    'Overlays',
    'Adds short supporting text.',
    'A delayed Radix tooltip for mouse and keyboard, with no essential information hidden inside.',
    'closed · open',
    'Use for clarification, never instructions or interactive content.',
  ],
  [
    'popover',
    'Popover',
    'Overlays',
    'Shows compact interactive content near a trigger.',
    'A Radix popover with focus management, collision handling, and transform-origin motion.',
    'closed · open',
    'Use Dialog when the task needs sustained focus or multiple steps.',
  ],
  [
    'dialog',
    'Dialog',
    'Overlays',
    'Focuses a short blocking task.',
    'A Radix dialog with modal overlay, focus trap, Escape close, labelled title, and description.',
    'closed · open',
    'Give users a clear close path and keep the task brief.',
  ],
  [
    'alert',
    'Alert',
    'Feedback',
    'Communicates an important status inline.',
    'Three semantic tones pairing icon, title, and specific copy.',
    'info · success · warning',
    'Say what happened and what the person should do next.',
  ],
  [
    'progress',
    'Progress',
    'Feedback',
    'Reports determinate completion.',
    'A labelled Radix progress bar with numeric value and semantic progress state.',
    '0–100 · complete',
    'Use indeterminate loading copy when completion cannot be measured.',
  ],
] as const

const exportNames: Record<string, string> = {
  'radio-group': 'RadioGroup, RadioItem',
  'dropdown-menu': 'DropdownMenu, DropdownMenuItem',
}

export const componentDocs: readonly ComponentDoc[] = docs.map(
  ([slug, name, group, summary, description, states, accessibility]) => {
    const exportName = exportNames[slug] ?? name.replace(/\s/g, '')
    const usageName = exportName.split(',')[0]
    return {
      slug,
      name,
      exportName,
      group: group as ComponentGroup,
      summary,
      description,
      importLine: `import { ${exportName} } from '@/features/ui'`,
      usage: `<${usageName} />`,
      states: states.split(' · '),
      accessibility,
    }
  },
)

export const componentGroups: readonly ComponentGroup[] = [
  'Actions',
  'Forms',
  'Data display',
  'Navigation',
  'Overlays',
  'Feedback',
]

export function getComponentDoc(slug: string) {
  return componentDocs.find((component) => component.slug === slug)
}
