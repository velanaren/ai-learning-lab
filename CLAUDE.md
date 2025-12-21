# AI Learning Lab - Project Context

## Project Overview

AI Learning Lab is a hyper-personal daily learning system designed for DevOps and software engineering professionals. It solves the chronic problem of inconsistent technical learning by delivering structured, adaptive daily sessions that respect time constraints and build verifiable progress.

**Core Problem:** Technical professionals struggle with learning consistency due to unstructured sources, invisible progress, and unrealistic time demands.

**Core Solution:** Daily 10-60 minute learning sessions that adapt to individual backgrounds, goals, and accessibility needs, with built-in memory system and proof-of-work tracking.

**Design Constraint (Non-negotiable):** The default daily experience must fit into a real day. If it cannot realistically be used daily, it is not solving the problem.

---

## Tech Stack

### Frontend
- **Framework:** Next.js 14+ (App Router)
- **Language:** TypeScript (strict mode)
- **Styling:** Tailwind CSS
- **State:** React hooks (useState, useContext, custom hooks)
- **Validation:** Zod schemas

### Backend
- **Runtime:** Node.js
- **Database:** PostgreSQL
- **ORM:** Prisma (recommended) or pg client
- **API:** Next.js API routes

### AI Integration
- **Provider:** Anthropic Claude API (@anthropic-ai/sdk)
- **Use Cases:** Learning contract generation, concept explanations, reflection prompts

### Testing
- **Unit/Integration:** Jest + React Testing Library
- **E2E:** Playwright
- **Coverage Target:** >85% for components/services, >90% for validation logic

### Development
- **Package Manager:** npm
- **Linting:** ESLint
- **Formatting:** Prettier (optional)

---

## Architecture Overview

The system operates in **three reinforcing phases**:

### Phase 1: Onboarding & Learning Contract
- **8-section questionnaire** captures: background, goals, learning style, accessibility needs, time constraints, application preferences
- **Learning contract generation** uses Claude API to create personalized contract explaining all design decisions
- **Confirmation flow** allows user to correct before starting Day 1

### Phase 2: Course Design & Daily Learning
- **Topic Graph:** Curated concept library with prerequisites, difficulty levels, examples
- **Learning Strategy Engine:** Transforms user profile into concrete strategy (pace, depth, format)
- **Daily Learning Unit (DLU):** 4-part invariant structure
  - Concept (5-7 min) - "why it matters" + short explanation
  - Concrete Example (5 min) - minimal hands-on example
  - Reflection (2-3 min) - 1-2 prompts
  - Application (5-10 min) - optional, always skippable
- **Adaptation Engine:** Handles skipped days, confusion, overwhelm, fast progress

### Phase 3: Memory & Proof-of-Work
- **Memory Entry:** Auto-created for every completed DLU (concept + reflection + optional action)
- **Evidence Capture:** Low-friction prompt after application (GitHub link / paste output / skip)
- **Evidence Graph:** Internal structure linking Topic → Skill → Concept → Memory → Evidence
- **User Views:** Timeline, Applied filter, Proof-backed filter, Topic/Skill grouping
- **Weekly Digest:** Gentle review with adjustment suggestion (accept/override)

---

## Code Style Guidelines

### TypeScript
```typescript
// Strict mode always enabled in tsconfig.json
// Use interfaces for objects, types for unions/primitives
interface UserProfile {
  userId: string;
  role: Role;
  baselineSkills: Skill[];
  // ... explicit, descriptive names
}

// Zod schemas for runtime validation
const userProfileSchema = z.object({
  userId: z.string().uuid(),
  role: z.nativeEnum(Role),
  // ...
});
```

### React Components
```tsx
// Functional components with TypeScript
interface ConceptExplanationProps {
  concept: Concept;
  formatPreference: FormatPreference;
}

export const ConceptExplanation: React.FC<ConceptExplanationProps> = ({
  concept,
  formatPreference
}) => {
  // Hook-based state management
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Early returns for loading/error states
  if (!concept) return <LoadingSpinner />;
  
  return (
    <div className="concept-explanation">
      {/* Component JSX */}
    </div>
  );
};
```

### File Organization
```
src/
├── components/
│   ├── onboarding/
│   │   ├── TopicSelection.tsx
│   │   ├── TopicSelection.test.tsx
│   │   └── Questionnaire.tsx
│   ├── daily/
│   └── memory/
├── services/
│   ├── topicGraph.ts
│   ├── topicGraph.test.ts
│   └── learningStrategyEngine.ts
├── types/
│   ├── userProfile.ts
│   ├── topicGraph.ts
│   └── memory.ts
├── api/routes/
├── hooks/
├── utils/
└── database/
```

### Naming Conventions
- **Components:** PascalCase (`TopicSelection.tsx`)
- **Services:** camelCase (`learningStrategyEngine.ts`)
- **Hooks:** camelCase with `use` prefix (`useAccessibility.ts`)
- **Types/Interfaces:** PascalCase (`UserProfile`, `DailyPlan`)
- **Enums:** PascalCase for enum name, SCREAMING_SNAKE_CASE for values

---

## Design System Principles

### Visual Aesthetic
**Inspiration:** Linear, Stripe, Notion  
**Mood:** Calm, professional, trustworthy, minimal

### Color Palette
```css
/* Primary */
--color-primary: #3B82F6;        /* Blue 500 - CTAs, links */
--color-primary-dark: #2563EB;   /* Blue 600 - hover states */

/* Neutrals */
--color-gray-50: #F9FAFB;        /* Backgrounds */
--color-gray-100: #F3F4F6;       /* Subtle backgrounds */
--color-gray-300: #D1D5DB;       /* Borders */
--color-gray-600: #4B5563;       /* Secondary text */
--color-gray-900: #111827;       /* Primary text */

/* Semantic */
--color-success: #10B981;        /* Green 500 */
--color-warning: #F59E0B;        /* Amber 500 */
--color-error: #EF4444;          /* Red 500 */
```

### Typography
- **Font:** System font stack (San Francisco, Segoe UI, Roboto)
- **Scale:** 14px base, 12px small, 16px body, 20px heading, 24px large heading
- **Weight:** 400 regular, 500 medium, 600 semibold
- **Line Height:** 1.5 for body, 1.2 for headings

### Spacing
- **Base unit:** 4px
- **Scale:** 4, 8, 12, 16, 24, 32, 48, 64px
- **Use Tailwind:** `space-y-4`, `gap-6`, `p-8`

### Components
- **Buttons:** Rounded corners (6px), clear focus states, loading indicators
- **Forms:** Labels above inputs, error messages below, required indicators
- **Cards:** Subtle shadows, hover states, clean padding
- **Navigation:** Clear active states, keyboard accessible

### Accessibility Requirements (WCAG AA minimum)
- **Contrast Ratios:** 4.5:1 for normal text, 3:1 for large text
- **Focus States:** Visible 2px outline on interactive elements
- **Keyboard Navigation:** Tab order logical, Enter/Space activate buttons
- **ARIA Labels:** All interactive elements properly labeled
- **Screen Reader:** Semantic HTML, aria-live regions for dynamic content
- **Focus Mode:** Optional reduced-distraction mode (R2.24)
- **Reduced Motion:** Respect `prefers-reduced-motion`
- **Text Scaling:** Support up to 200% zoom

---

## Important Constraints from PRD

### Hard Constraints
1. **One Concept Per Day:** Never multi-concept days (R7.3, R8.1)
2. **Time Budget Respect:** Daily sessions must fit user's stated time (R8.5)
3. **Optional Application:** Application moments always optional, never required (R9.6)
4. **Auto Memory Creation:** Every completed DLU creates MemoryEntry (R11.1)
5. **Proof-Backed Definition:** Entry is proof-backed ONLY with attached evidence (R14.1)
6. **No Invented Metrics:** Never create fake achievements or inflate progress (R14.3)

### Questionnaire Locked (v1.1)
- **8 sections, exact wording** defined in R2.1-R2.27
- **No changes** without PRD update
- **Must complete in 5-8 minutes**

### Daily Learning Unit (DLU) Invariant Structure
```
1. Concept (5-7 min)
   - "Why it matters" first
   - Short, targeted explanation
   
2. Concrete Example (5 min)
   - Minimal, hands-on example
   
3. Reflection (2-3 min)
   - 1-2 prompts
   
4. Application (5-10 min) - OPTIONAL
   - Small, finishable task
```

### Adaptation Rules (R10)
- **Skipped days:** 1-3 min recap, respect user's "ask before adjusting" preference
- **Fast progress:** Unlock stretch concepts, never skip foundations
- **Repeated confusion:** Alternate explanation + micro-lab
- **Overwhelm:** Reduce links, enforce Focus Mode, split concepts
- **Low application:** Gently increase if opted in, never force

### Evidence Types (R12.3)
- **GitHub:** Repo/PR/commit/file links (verifiable)
- **Execution:** Screenshot/pasted output (user-provided)
- **Artifacts:** Code/config snippets (user-provided)
- **Links:** Demo URL, gist, diagram (user-provided)

---

## Current Phase & Next Steps

### ✅ Completed
- **Task 0.1:** Project initialized with Next.js, TypeScript, Tailwind CSS
- **Task 0.0:** Feature branch created (`feature/ai-learning-lab-foundation`)

### 🚧 Current
- **Task 0.2:** Set up database (PostgreSQL + Prisma/pg)
- **Task 0.3:** Configure testing infrastructure (Jest + Playwright)

### 🔜 Next Up
- **Task 1:** Define core type system (TypeScript types + Zod schemas)
- **Task 2:** Build onboarding UI (Topic Selection + 8-section Questionnaire)

### Progress Tracking
Update `tasks-ai-learning-lab.md` by changing `- [ ]` to `- [x]` after completing each subtask.

---

## File Organization Conventions

### Component Files
```
src/components/onboarding/
├── TopicSelection.tsx              # Component
├── TopicSelection.test.tsx         # Co-located tests
├── TopicCard.tsx                   # Sub-component
├── Questionnaire.tsx
└── QuestionnaireSection.tsx
```

### Service Files
```
src/services/
├── topicGraph.ts                   # Service implementation
├── topicGraph.test.ts              # Co-located tests
├── learningStrategyEngine.ts
└── claudeClient.ts
```

### Type Files
```
src/types/
├── userProfile.ts                  # All questionnaire types
├── topicGraph.ts                   # Topic, Concept, DailyPlan
├── memory.ts                       # MemoryEntry, EvidenceItem
└── index.ts                        # Re-export all types
```

### Naming Patterns
- **React Components:** `ComponentName.tsx` (PascalCase)
- **Services:** `serviceName.ts` (camelCase)
- **Utilities:** `utilityName.ts` (camelCase)
- **Hooks:** `useHookName.ts` (camelCase with `use` prefix)
- **Tests:** `*.test.ts` or `*.test.tsx` (co-located)

---

## Testing Expectations

### Unit Tests (Jest + React Testing Library)
```typescript
// Component test example
describe('TopicSelection', () => {
  it('enables Continue button only when topic selected', () => {
    render(<TopicSelection />);
    const continueBtn = screen.getByRole('button', { name: /continue/i });
    
    expect(continueBtn).toBeDisabled();
    
    fireEvent.click(screen.getByRole('radio', { name: /docker/i }));
    
    expect(continueBtn).toBeEnabled();
  });
});

// Service test example
describe('topicGraph', () => {
  it('loads Docker topic graph correctly', () => {
    const graph = loadTopicGraph('docker');
    
    expect(graph.concepts).toHaveLength(30);
    expect(graph.concepts[0]).toHaveProperty('why_it_matters');
  });
});
```

### E2E Tests (Playwright)
```typescript
// E2E test example
test('complete onboarding flow', async ({ page }) => {
  await page.goto('/onboarding');
  
  // Select topic
  await page.click('text=Docker');
  await page.click('text=Continue');
  
  // Complete questionnaire (abbreviated)
  // ... fill all 8 sections
  
  // Confirm contract
  await page.click('text=Confirm');
  
  // Should redirect to Day 1
  await expect(page).toHaveURL('/today');
});
```

### Coverage Targets
- **Components:** >85%
- **Services:** >85%
- **Validation Logic:** >90%
- **API Routes:** >85%

### Test Commands
```bash
npm test                    # Run all unit tests
npm test -- --watch        # Watch mode
npx playwright test        # Run E2E tests
npm test -- path/to/file   # Run specific test
```

---

## Git Workflow

### Branch Naming
```
feature/ai-learning-lab-foundation     # Main feature branch
feature/ai-learning-lab-memory-system  # Sub-branch for large tasks
bugfix/questionnaire-validation        # Bug fixes
```

### Commit Conventions
Use conventional commits for clarity:
```
feat: Add Topic Selection component
fix: Correct questionnaire validation for Section 3
test: Add E2E test for onboarding flow
docs: Update architecture documentation
refactor: Simplify learning strategy engine
style: Format code with Prettier
chore: Update dependencies
```

### Commit Message Format
```
<type>: <subject>

[optional body]

[optional footer]
```

**Types:** `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

### Merge Strategy
- Complete and test each **parent task** before moving to next
- Merge to `main` after each **major phase** (1, 2, 3) is complete
- Create PR with description and test evidence

---

## Development Commands

### Local Development
```bash
npm run dev                # Start dev server (http://localhost:3000)
npm run build              # Build for production
npm start                  # Start production server
npm run lint               # Run ESLint
```

### Database
```bash
npm run migrate            # Run database migrations
npm run migrate:rollback   # Rollback last migration
npm run seed               # Seed database with test data
```

### Testing
```bash
npm test                   # Run unit tests
npx playwright test        # Run E2E tests
npm test -- --coverage     # Generate coverage report
```

---

## Key Design Decisions

### Why Next.js App Router?
- Server components for better performance
- Built-in API routes eliminate separate backend
- TypeScript integration out of the box
- Excellent developer experience

### Why PostgreSQL?
- Relational data with foreign keys (UserProfile → MemoryEntry → EvidenceItem)
- JSON support for flexible fields (tags, preferences)
- Robust, proven, free
- Prisma ORM provides type-safe queries

### Why Claude API for Contract Generation?
- Generates personalized, natural language summaries
- Connects questionnaire answers to design decisions
- Higher quality than template-based generation
- Cache generated content to reduce API costs

### Why No Video Execution Sandbox (v1)?
- Out of scope (NG4) - users run code locally
- Evidence captured via screenshots/paste
- Future enhancement possible

### Why Curated Topic Graph?
- Quality control prevents AI hallucinations (P1)
- Subject matter expert validation
- Enables prerequisite-based sequencing
- Single source of truth for concepts

---

## Success Criteria (From PRD)

### Phase 1 Complete When:
- Questionnaire implements all 8 sections with exact locked wording
- Learning contract summary connects answers → decisions
- User can confirm/correct summary before Day 1
- Profile persists and is used for plan generation

### Phase 2 Complete When:
- DLU follows invariant 4-part structure
- One concept per day enforced
- Daily session respects user's time budget
- Adaptation handles all 5 signals (skip, fast, confusion, overwhelm, low application)
- Content format adapts to accessibility preferences

### Phase 3 Complete When:
- Every completed DLU creates MemoryEntry automatically
- Evidence capture is optional and low-friction
- Evidence attaches with source type labels
- Memory timeline supports all filters
- Topic/Skill view groups proof-backed entries
- Weekly digest generates with gentle tone and adjustment suggestion

### Overall v1.1 Complete When:
- All functional requirements (R1-R20) implemented
- All non-goals respected (no scope creep)
- Core user flows work end-to-end
- Data model supports all three phases
- System can be used daily by real learner for 30+ days
- First user can show proof-backed evidence of learning journey

---

## Quick Reference

### Most Important Files to Review
1. `prd-ai-learning-lab.md` - Complete product requirements
2. `tasks-ai-learning-lab.md` - Task breakdown with checklist
3. `src/types/userProfile.ts` - Questionnaire response types (once created)
4. `src/config/topicGraphs/docker.json` - Example topic graph (once created)

### Key Principles to Remember
1. **Accessibility first** - Never compromise on a11y
2. **One concept per day** - Hard constraint
3. **Optional application** - Never force
4. **Evidence = proof** - No evidence, no proof-backed claim
5. **Gentle tone** - Weekly digest, recaps, adaptation suggestions
6. **Curated content** - No AI hallucinations in core learning

### When in Doubt
- Check PRD for requirements (R1-R20)
- Verify against design constraints (hard limits)
- Prioritize accessibility over aesthetics
- Keep UI minimal and calm
- Test with keyboard and screen reader

---

**Version:** 1.0  
**Last Updated:** 2025-12-21  
**Current Phase:** Task 0 - Project Setup  
**Next Milestone:** Phase 1 - Onboarding & Learning Contract
