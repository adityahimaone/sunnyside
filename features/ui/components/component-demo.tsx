'use client'

import * as React from 'react'
import { Bell, MoreHorizontal, Plus, Settings, Sparkles } from 'lucide-react'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Alert,
  Avatar,
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Checkbox,
  Dialog,
  DropdownMenu,
  DropdownMenuItem,
  IconButton,
  Input,
  Popover,
  Progress,
  RadioGroup,
  RadioItem,
  Select,
  SelectItem,
  Slider,
  Switch,
  Table,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Textarea,
  Tooltip,
} from './ui'
import styles from '../ui-docs.module.css'

function FieldLabel({
  children,
  htmlFor,
}: {
  children: React.ReactNode
  htmlFor?: string
}) {
  return (
    <label className={styles.fieldLabel} htmlFor={htmlFor}>
      {children}
    </label>
  )
}

function SliderDemo() {
  const [grain, setGrain] = React.useState(42)
  return (
    <div className={styles.demoStack}>
      <span className={styles.fieldLabel}>Paper grain · {grain}%</span>
      <Slider
        label="Paper grain"
        value={[grain]}
        onValueChange={(value) => setGrain(value[0])}
        max={100}
        step={1}
      />
    </div>
  )
}

export function ComponentDemo({
  slug,
  compact = false,
}: {
  slug: string
  compact?: boolean
}) {
  const [enabled, setEnabled] = React.useState(true)
  const [checked, setChecked] = React.useState(true)

  const content = (() => {
    switch (slug) {
      case 'button':
        return (
          <div className={styles.demoRow}>
            <Button>Save changes</Button>
            <Button variant="accent">
              <Sparkles size={15} />
              Create
            </Button>
            <Button variant="outline">Preview</Button>
            <Button variant="ghost">Cancel</Button>
            <Button disabled>Saving</Button>
          </div>
        )
      case 'input':
        return (
          <div className={styles.demoStack}>
            <FieldLabel htmlFor={`email-${compact}`}>Email address</FieldLabel>
            <Input
              id={`email-${compact}`}
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
            />
          </div>
        )
      case 'textarea':
        return (
          <div className={styles.demoStack}>
            <FieldLabel htmlFor={`note-${compact}`}>Project note</FieldLabel>
            <Textarea
              id={`note-${compact}`}
              placeholder="What should the team know?"
            />
          </div>
        )
      case 'select':
        return (
          <div className={styles.demoStack}>
            <FieldLabel htmlFor={`workspace-${compact}`}>Workspace</FieldLabel>
            <Select defaultValue="studio" id={`workspace-${compact}`}>
              <SelectItem value="studio">Sunnyside Studio</SelectItem>
              <SelectItem value="archive">Archive Room</SelectItem>
              <SelectItem value="lab">Motion Lab</SelectItem>
            </Select>
          </div>
        )
      case 'checkbox':
        return (
          <label className={styles.choiceRow}>
            <Checkbox
              checked={checked}
              onCheckedChange={(value) => setChecked(value === true)}
            />
            Send me release notes
          </label>
        )
      case 'radio-group':
        return (
          <RadioGroup
            defaultValue="paper"
            className={styles.demoStack}
            aria-label="Surface"
          >
            <label className={styles.choiceRow}>
              <RadioItem value="paper" />
              Warm paper
            </label>
            <label className={styles.choiceRow}>
              <RadioItem value="cobalt" />
              Cobalt field
            </label>
            <label className={styles.choiceRow}>
              <RadioItem value="ink" />
              Ink sheet
            </label>
          </RadioGroup>
        )
      case 'switch':
        return (
          <label className={styles.switchRow}>
            <span>
              <strong>Rich motion</strong>
              <small>Keep purposeful transitions on.</small>
            </span>
            <Switch
              checked={enabled}
              onCheckedChange={setEnabled}
              aria-label="Rich motion"
            />
          </label>
        )
      case 'slider':
        return <SliderDemo />
      case 'card':
        return (
          <Card className={styles.demoCard}>
            <CardHeader>
              <CardTitle>Paper, with purpose.</CardTitle>
              <CardDescription>
                A raised sheet for one related idea and its actions.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Badge tone="info">New specimen</Badge>
            </CardContent>
            <CardFooter>
              <Button size="sm">Open study</Button>
            </CardFooter>
          </Card>
        )
      case 'badge':
        return (
          <div className={styles.demoRow}>
            <Badge>Draft</Badge>
            <Badge tone="info">In review</Badge>
            <Badge tone="success">Published</Badge>
            <Badge tone="warning">Needs copy</Badge>
          </div>
        )
      case 'avatar':
        return (
          <div className={styles.demoRow}>
            <Avatar alt="Aditya Himawan" fallback="AH" />
            <Avatar alt="Sunnyside team" fallback="SS" />
          </div>
        )
      case 'table':
        return (
          <Table label="Component release status">
            <caption className={styles.srOnly}>
              Component release status
            </caption>
            <thead>
              <tr>
                <th>Component</th>
                <th>Status</th>
                <th>Version</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Button</td>
                <td>
                  <Badge tone="success">Ready</Badge>
                </td>
                <td>1.0</td>
              </tr>
              <tr>
                <td>Select</td>
                <td>
                  <Badge tone="info">Review</Badge>
                </td>
                <td>0.9</td>
              </tr>
              <tr>
                <td>Dialog</td>
                <td>
                  <Badge>Draft</Badge>
                </td>
                <td>0.8</td>
              </tr>
            </tbody>
          </Table>
        )
      case 'accordion':
        return (
          <Accordion type="single" collapsible defaultValue="item-1">
            <AccordionItem value="item-1">
              <AccordionTrigger>Why paper?</AccordionTrigger>
              <AccordionContent>
                It gives interfaces a warm ground and makes raised controls feel
                physical without fake realism.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>Why one cobalt field?</AccordionTrigger>
              <AccordionContent>
                Restraint gives the accent a job. Repeating it everywhere erases
                hierarchy.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        )
      case 'tabs':
        return (
          <Tabs defaultValue="preview">
            <TabsList>
              <TabsTrigger value="preview">Preview</TabsTrigger>
              <TabsTrigger value="code">Code</TabsTrigger>
              <TabsTrigger value="usage">Usage</TabsTrigger>
            </TabsList>
            <TabsContent value="preview">
              The component renders here.
            </TabsContent>
            <TabsContent value="code">
              Copy the source into your app.
            </TabsContent>
            <TabsContent value="usage">
              Import from the feature boundary.
            </TabsContent>
          </Tabs>
        )
      case 'dropdown-menu':
        return (
          <DropdownMenu
            trigger={
              <IconButton variant="outline" aria-label="Open actions">
                <MoreHorizontal size={18} />
              </IconButton>
            }
          >
            <DropdownMenuItem>Duplicate</DropdownMenuItem>
            <DropdownMenuItem>Move to archive</DropdownMenuItem>
            <DropdownMenuItem>Delete</DropdownMenuItem>
          </DropdownMenu>
        )
      case 'tooltip':
        return (
          <Tooltip content="Notification settings">
            <IconButton variant="outline" aria-label="Notification settings">
              <Bell size={18} />
            </IconButton>
          </Tooltip>
        )
      case 'popover':
        return (
          <Popover
            trigger={
              <Button variant="outline">
                <Settings size={15} />
                Preferences
              </Button>
            }
          >
            <div className={styles.demoStack}>
              <strong>Density</strong>
              <span className={styles.mutedCopy}>
                Use the compact rhythm for data-heavy screens.
              </span>
              <Switch aria-label="Compact density" />
            </div>
          </Popover>
        )
      case 'dialog':
        return (
          <Dialog
            trigger={
              <Button>
                <Plus size={15} />
                New project
              </Button>
            }
            title="Start a project"
            description="Name the project now. You can add the details after it exists."
          >
            <div className={styles.demoStack}>
              <FieldLabel htmlFor={`project-${compact}`}>
                Project name
              </FieldLabel>
              <Input id={`project-${compact}`} placeholder="A useful name" />
              <div className={styles.demoRow}>
                <Button>Create project</Button>
              </div>
            </div>
          </Dialog>
        )
      case 'alert':
        return (
          <div className={styles.demoStack}>
            <Alert title="Token export ready" tone="success">
              The CSS and JSON files match the current Sunnyside palette.
            </Alert>
            <Alert title="Review the label" tone="warning">
              The action still says “Submit”. Name the result instead.
            </Alert>
          </div>
        )
      case 'progress':
        return <Progress value={68} label="Component coverage" />
      default:
        return null
    }
  })()

  return (
    <div className={styles.demoStage} data-compact={compact || undefined}>
      {content}
    </div>
  )
}
