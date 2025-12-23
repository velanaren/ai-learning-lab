# Design Tokens - AI Learning Lab

> A calm, accessible design system inspired by Linear and Stripe

---

## Color System

### Primary Colors (Blue)
**When to use:**
- Primary CTAs (Start Learning, Continue, Confirm)
- Interactive links
- Active states in navigation
- Progress indicators
- Focus rings

**Palette:**
```
primary-50  → Hover backgrounds for subtle interactions
primary-100 → Very light backgrounds for selected states
primary-500 → Main CTAs, links (4.5:1 contrast on white)
primary-600 → Hover state for primary buttons
primary-700 → Active/pressed state
primary-800 → Text on light backgrounds
```

**Accessibility:**
- `primary-500` meets WCAG AA (4.5:1) on white backgrounds
- Use `primary-800` for text to meet AAA standards (7:1)

---

### Neutral Colors (Gray)
**When to use:**
- Text hierarchy (900 → 500)
- Backgrounds (50 → 200)
- Borders and dividers (200 → 400)
- Disabled states (400)

**Palette & Usage:**
```
gray-50  → Main page background (almost white)
gray-100 → Card backgrounds, subtle sections
gray-200 → Light borders, hover states on white
gray-300 → Standard borders, dividers
gray-400 → Disabled text, placeholder text
gray-500 → Secondary text, icons
gray-600 → Body text (7:1 contrast on white) ✓ WCAG AA
gray-700 → Strong emphasis text
gray-800 → Headings, important text
gray-900 → Primary text, hero text (16:1 on white) ✓ WCAG AAA
```

**Text Hierarchy Guidelines:**
- **Hero/Page titles:** `text-gray-900` + `font-semibold`
- **Section headings:** `text-gray-800` + `font-semibold`
- **Body text:** `text-gray-600` + `font-normal`
- **Secondary text:** `text-gray-500` + `font-normal`
- **Captions/timestamps:** `text-gray-400` + `text-sm`

---

### Semantic Colors

#### Success (Green)
**When to use:**
- Completion states ("Day completed!")
- Success messages
- Positive feedback
- Proof-backed badges

```jsx
<div className="bg-success-50 border border-success-500 text-success-700">
  Memory entry saved with evidence!
</div>
```

#### Warning (Amber)
**When to use:**
- Gentle reminders ("You haven't learned in 3 days")
- Skip confirmations
- Non-critical alerts

```jsx
<div className="bg-warning-50 border border-warning-500 text-warning-700">
  This concept builds on yesterday's learning
</div>
```

#### Error (Red)
**When to use:**
- Form validation errors
- Failed operations
- Destructive action warnings

```jsx
<div className="bg-error-50 border border-error-500 text-error-700">
  Please complete all required fields
</div>
```

---

### Focus Mode Colors
**When to use:** When user enables "Focus Mode" toggle (R2.24)

```
focus-bg     → #FAFAFA (warmer than gray-50)
focus-border → #E0E0E0 (softer than gray-300)
```

**Purpose:** Reduce visual noise, create calmer environment

---

## Typography System

### Font Families
```css
font-sans  → System fonts (SF Pro, Segoe UI, Roboto)
font-mono  → Code snippets (SF Mono, Monaco, Consolas)
```

### Font Sizes & Usage

| Class | Size | Line Height | Use Case | Example |
|-------|------|-------------|----------|---------|
| `text-xs` | 12px | 16px | Timestamps, captions | "Updated 2 hours ago" |
| `text-sm` | 14px | 20px | Labels, secondary text | Form labels, navigation |
| `text-base` | 16px | 24px | Body text | Concept explanations |
| `text-lg` | 18px | 28px | Emphasized body | Pull quotes, callouts |
| `text-xl` | 20px | 28px | Small headings | DLU section titles |
| `text-2xl` | 24px | 32px | Section headings | "Today's Learning" |
| `text-3xl` | 30px | 36px | Page headings | "Learning Contract" |
| `text-4xl` | 36px | 40px | Hero text | Welcome screen |

### Font Weights

```
font-normal   → 400 (Body text, paragraphs)
font-medium   → 500 (Subtle emphasis, labels)
font-semibold → 600 (Headings, CTAs)
font-bold     → 700 (Rare - only for strong emphasis)
```

### Typography Patterns

**Page Title:**
```jsx
<h1 className="text-3xl font-semibold text-gray-900">
  Welcome to Docker Learning
</h1>
```

**Section Heading:**
```jsx
<h2 className="text-2xl font-semibold text-gray-800">
  Today's Concept
</h2>
```

**Body Text:**
```jsx
<p className="text-base text-gray-600 leading-relaxed">
  Containers are lightweight, isolated environments...
</p>
```

**Secondary Text:**
```jsx
<span className="text-sm text-gray-500">
  5-7 minutes
</span>
```

**Code:**
```jsx
<code className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
  docker run -d nginx
</code>
```

---

## Spacing System

### Base Unit: 4px
Tailwind's default spacing scale uses 4px as base unit.

### Common Spacing Patterns

**Component Padding:**
```
Buttons:      px-4 py-2    (16px × 8px)
Cards:        p-6          (24px all sides)
Sections:     py-8 px-6    (32px vertical, 24px horizontal)
Page margins: px-4 md:px-8 (16px mobile, 32px desktop)
```

**Vertical Spacing (Stack):**
```
Tight:   space-y-2  (8px)  → List items, form fields
Normal:  space-y-4  (16px) → Paragraphs, sections within component
Relaxed: space-y-6  (24px) → Major sections, DLU parts
Loose:   space-y-8  (32px) → Page sections
```

**Horizontal Spacing (Inline):**
```
Tight:   space-x-2  (8px)  → Icon + label
Normal:  space-x-4  (16px) → Button groups
Relaxed: space-x-6  (24px) → Navigation items
```

**Gap (Grid/Flex):**
```
gap-2  → Tight layouts (8px)
gap-4  → Standard (16px)
gap-6  → Comfortable (24px)
gap-8  → Loose (32px)
```

---

## Component Patterns

### Buttons

#### Primary Button
```jsx
<button className="
  px-4 py-2 
  bg-primary-500 hover:bg-primary-600 active:bg-primary-700
  text-white font-medium text-sm
  rounded
  focus-ring
  transition-colors duration-200
  disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed
">
  Continue to Day 1
</button>
```

#### Secondary Button
```jsx
<button className="
  px-4 py-2
  bg-white hover:bg-gray-50 active:bg-gray-100
  text-gray-700 font-medium text-sm
  border border-gray-300
  rounded
  focus-ring
  transition-colors duration-200
">
  Skip for Today
</button>
```

#### Ghost Button (minimal)
```jsx
<button className="
  px-3 py-1.5
  text-gray-600 hover:text-gray-900 hover:bg-gray-100
  font-medium text-sm
  rounded
  focus-ring
  transition-colors duration-200
">
  View Details
</button>
```

---

### Cards

#### Standard Card
```jsx
<div className="
  bg-white
  border border-gray-200
  rounded-md
  p-6
  shadow-sm hover:shadow-md
  transition-shadow duration-200
">
  {/* Card content */}
</div>
```

#### Interactive Card (clickable)
```jsx
<button className="
  w-full text-left
  bg-white hover:bg-gray-50
  border border-gray-200 hover:border-primary-300
  rounded-md
  p-6
  shadow-sm hover:shadow
  transition-all duration-200
  focus-ring
">
  {/* Card content */}
</button>
```

#### Highlighted Card (success/completion)
```jsx
<div className="
  bg-success-50
  border border-success-500
  rounded-md
  p-6
">
  {/* Success content */}
</div>
```

---

### Form Elements

#### Text Input
```jsx
<input
  type="text"
  className="
    w-full
    px-3 py-2
    bg-white
    border border-gray-300
    rounded
    text-gray-900 placeholder:text-gray-400
    focus-ring
    transition-colors duration-200
    disabled:bg-gray-50 disabled:text-gray-500
  "
  placeholder="Enter your response..."
/>
```

#### Textarea
```jsx
<textarea
  rows={4}
  className="
    w-full
    px-3 py-2
    bg-white
    border border-gray-300
    rounded
    text-gray-900 placeholder:text-gray-400
    focus-ring
    resize-y
  "
  placeholder="What did you learn today?"
/>
```

#### Radio Button
```jsx
<label className="flex items-center space-x-3 cursor-pointer group">
  <input
    type="radio"
    className="
      w-4 h-4
      text-primary-500
      focus:ring-primary-500 focus:ring-2 focus:ring-offset-2
      cursor-pointer
    "
  />
  <span className="text-gray-700 group-hover:text-gray-900">
    Option label
  </span>
</label>
```

#### Checkbox
```jsx
<label className="flex items-center space-x-3 cursor-pointer group">
  <input
    type="checkbox"
    className="
      w-4 h-4
      text-primary-500 rounded
      focus:ring-primary-500 focus:ring-2 focus:ring-offset-2
      cursor-pointer
    "
  />
  <span className="text-gray-700 group-hover:text-gray-900">
    I understand
  </span>
</label>
```

---

### Badges

#### Status Badge
```jsx
<span className="
  inline-flex items-center
  px-2.5 py-0.5
  bg-primary-100 text-primary-800
  text-xs font-medium
  rounded-full
">
  Proof-backed
</span>
```

#### Count Badge
```jsx
<span className="
  inline-flex items-center justify-center
  w-5 h-5
  bg-gray-200 text-gray-700
  text-xs font-medium
  rounded-full
">
  3
</span>
```

---

### Loading States

#### Spinner
```jsx
<div className="
  animate-spin
  w-5 h-5
  border-2 border-gray-300 border-t-primary-500
  rounded-full
" />
```

#### Skeleton
```jsx
<div className="animate-pulse space-y-4">
  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
</div>
```

---

### Alerts/Banners

#### Info Alert
```jsx
<div className="
  bg-primary-50
  border-l-4 border-primary-500
  p-4
  rounded
">
  <p className="text-sm text-primary-700">
    Your daily learning session is ready!
  </p>
</div>
```

#### Warning Alert
```jsx
<div className="
  bg-warning-50
  border-l-4 border-warning-500
  p-4
  rounded
">
  <p className="text-sm text-warning-700">
    You've skipped 2 days. Want a quick recap?
  </p>
</div>
```

---

## Accessibility Guidelines

### Focus States
**Always use:** `.focus-ring` utility or equivalent:
```css
focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
```

**Why:** Makes keyboard navigation visible and clear

**Test:** Tab through entire page - all interactive elements should show focus ring

---

### Keyboard Navigation
**Required patterns:**
- Tab: Next element
- Shift+Tab: Previous element
- Enter/Space: Activate buttons, toggle checkboxes
- Arrow keys: Radio groups, select options
- Escape: Close modals, cancel actions

**Implementation:**
```jsx
// Make divs keyboard accessible
<div
  role="button"
  tabIndex={0}
  onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      handleClick()
    }
  }}
/>
```

---

### ARIA Labels
**Required:**
- All form inputs must have labels (visible or `aria-label`)
- Icons need `aria-label` if no text
- Loading states need `aria-live="polite"`

```jsx
// Icon button
<button aria-label="Close dialog">
  <XIcon className="w-5 h-5" />
</button>

// Loading state
<div aria-live="polite" aria-busy="true">
  Loading your learning session...
</div>
```

---

### Color Contrast
**All text must meet WCAG AA:**
- Normal text: 4.5:1 contrast ratio ✓
- Large text (18px+): 3:1 contrast ratio ✓

**Verified combinations:**
- `text-gray-600` on white → 7:1 ✓✓
- `text-gray-900` on white → 16:1 ✓✓✓
- `text-primary-500` on white → 4.5:1 ✓
- `text-white` on `bg-primary-500` → 4.6:1 ✓

---

### Reduced Motion
**Always respect:** `prefers-reduced-motion` media query

**Implementation:**
```jsx
<div className="
  motion-safe:animate-fade-in
  motion-safe:transition-all
">
  Content
</div>
```

**What this does:**
- Animations disabled for users who prefer reduced motion
- Transitions still work, just instant (0ms duration)

---

## Layout Patterns

### Container Widths
```jsx
// Max width containers
<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
  {/* Full app width */}
</div>

<div className="max-w-3xl mx-auto px-4">
  {/* Reading width (DLU content) */}
</div>

<div className="max-w-md mx-auto px-4">
  {/* Narrow (forms, onboarding) */}
</div>
```

### Responsive Grid
```jsx
// Topic selection cards
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {topics.map(topic => <TopicCard />)}
</div>
```

### Sidebar Layout
```jsx
<div className="flex h-screen">
  {/* Sidebar */}
  <aside className="w-64 bg-gray-50 border-r border-gray-200">
    <nav>{/* Navigation */}</nav>
  </aside>
  
  {/* Main content */}
  <main className="flex-1 overflow-y-auto">
    <div className="max-w-3xl mx-auto py-8 px-6">
      {children}
    </div>
  </main>
</div>
```

---

## Focus Mode Overrides

When user enables Focus Mode (R2.24):

```jsx
// Add to root element
<div className={focusModeEnabled ? 'focus-mode' : ''}>
  {/* App */}
</div>
```

**CSS overrides:**
```css
.focus-mode {
  /* Softer backgrounds */
  --tw-bg-opacity: 0.5;
  
  /* Hide external links by default */
  a[target="_blank"] {
    display: none;
  }
  
  /* Larger text */
  font-size: 110%;
  
  /* Reduced navigation */
  nav .secondary-items {
    display: none;
  }
}
```

---

## Animation Guidelines

### When to Animate
✅ **Do animate:**
- Feedback (button clicks, form submission)
- State changes (card expansion, modal open)
- Loading states (spinners, skeletons)
- Success confirmations

❌ **Don't animate:**
- Critical information display
- Reading content (body text)
- Forms (distracting)

### Duration Rules
- **Fast (150ms):** Button hover, focus states
- **Standard (200ms):** Default for most transitions
- **Smooth (300ms):** Modals, drawers, large movements

### Easing
- `ease-in`: Starting an action
- `ease-out`: Finishing an action (most common)
- `ease-in-out`: Smooth both ways (modals)

---

## Dark Mode (Future Consideration)

Currently out of scope for v1, but palette is designed for easy dark mode addition:

**Strategy:**
1. Add `dark:` variants to all components
2. Use semantic color names (not specific grays)
3. Test contrast ratios in dark mode

**Example future implementation:**
```jsx
<div className="
  bg-white dark:bg-gray-900
  text-gray-900 dark:text-gray-100
  border-gray-200 dark:border-gray-700
">
  Content
</div>
```

---

## Quick Reference Cheatsheet

### Text Hierarchy
```
Page title:    text-3xl font-semibold text-gray-900
Section:       text-2xl font-semibold text-gray-800
Heading:       text-xl font-semibold text-gray-800
Body:          text-base text-gray-600
Secondary:     text-sm text-gray-500
Caption:       text-xs text-gray-400
```

### Common Spacing
```
Card padding:     p-6
Section gap:      space-y-8
Paragraph gap:    space-y-4
Button padding:   px-4 py-2
Input padding:    px-3 py-2
```

### Interactive States
```
Hover:   hover:bg-gray-50
Active:  active:bg-gray-100
Focus:   focus-ring (custom utility)
Disabled: disabled:opacity-50 disabled:cursor-not-allowed
```

### Borders & Shadows
```
Card border:   border border-gray-200
Card shadow:   shadow-sm hover:shadow-md
Divider:       border-b border-gray-200
```

---

**Version:** 1.0  
**Last Updated:** 2025-12-21  
**Design System Status:** Foundation Complete