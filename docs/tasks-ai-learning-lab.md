# Tasks: AI Learning Lab

## Relevant Files

### Phase 1 - Onboarding & Learning Contract
- `src/components/onboarding/TopicSelection.tsx` - Topic selection screen component
- `src/components/onboarding/Questionnaire.tsx` - Main questionnaire component with 8 sections
- `src/components/onboarding/LearningContractSummary.tsx` - Displays generated learning contract for user confirmation
- `src/services/learningContractGenerator.ts` - Service that generates learning contract summary using Claude API
- `src/types/userProfile.ts` - TypeScript interfaces for user profile data
- `src/api/routes/onboarding.ts` - API routes for saving questionnaire responses and generating contract

### Phase 2 - Course Design & Daily Learning
- `src/components/daily/DailyLearningUnit.tsx` - Main daily learning interface component
- `src/components/daily/ConceptExplanation.tsx` - Displays concept with "why it matters"
- `src/components/daily/MinimalExample.tsx` - Shows concrete example for the concept
- `src/components/daily/ReflectionPrompts.tsx` - Displays reflection questions
- `src/components/daily/ApplicationMoment.tsx` - Optional application activity component
- `src/services/topicGraph.ts` - Service for managing curated topic graph and concept nodes
- `src/services/learningStrategyEngine.ts` - Transforms user profile into learning strategy
- `src/services/dailyPlanGenerator.ts` - Generates daily plan from learning strategy + topic graph
- `src/services/adaptationEngine.ts` - Handles adaptation rules (skipped days, confusion, etc.)
- `src/types/topicGraph.ts` - TypeScript interfaces for Topic, Concept, DailyPlan
- `src/api/routes/learning.ts` - API routes for fetching daily learning units

### Phase 3 - Memory & Proof-of-Work
- `src/components/memory/MemoryTimeline.tsx` - Chronological view of all memory entries
- `src/components/memory/MemoryFilters.tsx` - Filter controls (Applied, Proof-backed, Topic/Skill)
- `src/components/memory/EvidenceCapture.tsx` - Low-friction evidence capture prompt
- `src/components/memory/WeeklyDigest.tsx` - Weekly review and adjustment suggestion
- `src/services/memoryService.ts` - Service for creating and querying memory entries
- `src/services/evidenceService.ts` - Service for attaching and managing evidence items
- `src/services/evidenceGraph.ts` - Internal graph for intelligent memory queries
- `src/types/memory.ts` - TypeScript interfaces for MemoryEntry, EvidenceItem
- `src/api/routes/memory.ts` - API routes for memory and evidence operations

### Shared/Core Infrastructure
- `src/components/layout/MainLayout.tsx` - Main app layout with navigation
- `src/components/common/FocusMode.tsx` - Accessibility focus mode wrapper
- `src/components/settings/SettingsPanel.tsx` - User settings and preferences
- `src/hooks/useAccessibility.ts` - Custom hook for accessibility preferences
- `src/utils/timeEstimator.ts` - Utility for estimating session durations
- `src/database/schema.sql` - Database schema for all entities
- `src/database/migrations/` - Database migration files
- `src/config/topicGraphs/docker.json` - Example curated topic graph for Docker
- `.env.example` - Environment variables template including Claude API key

### Testing
- `src/components/**/*.test.tsx` - Component unit tests
- `src/services/**/*.test.ts` - Service unit tests
- `src/api/**/*.test.ts` - API route tests
- `tests/e2e/onboarding.spec.ts` - E2E test for onboarding flow
- `tests/e2e/dailyLearning.spec.ts` - E2E test for daily learning flow
- `tests/e2e/memory.spec.ts` - E2E test for memory system

### Documentation
- `README.md` - Project overview and setup instructions
- `docs/ARCHITECTURE.md` - System architecture documentation
- `docs/TOPIC_GRAPH_GUIDE.md` - Guide for creating curated topic graphs
- `docs/API.md` - API documentation
- `docs/DEPLOYMENT.md` - Deployment instructions

---

## Task Organization

**IMPORTANT:** Tasks are organized so that each completed parent task produces a visible, testable outcome. This allows for early validation and course correction.

---

## Instructions for Completing Tasks

**IMPORTANT:** As you complete each task, you must check it off in this markdown file by changing `- [ ]` to `- [x]`. This helps track progress and ensures you don't skip any steps.

Example:
- `- [ ] 1.1 Read file` → `- [x] 1.1 Read file` (after completing)

Update the file after completing each sub-task, not just after completing an entire parent task.

---

## Tasks

### 0. Project Setup & Infrastructure

- [ ] **0.0 Create feature branch**
  - [ ] 0.0.1 Create new branch `feature/ai-learning-lab-foundation`
  - [ ] 0.0.2 Set up initial commit with branch

- [ ] **0.1 Initialize project structure**
  - [ ] 0.1.1 Create Next.js project with TypeScript (`npx create-next-app@latest ai-learning-lab --typescript --tailwind --app`)
  - [ ] 0.1.2 Set up directory structure following Relevant Files organization
  - [ ] 0.1.3 Install core dependencies: `react`, `next`, `typescript`, `tailwindcss`, `@anthropic-ai/sdk`, `zod` for validation
  - [ ] 0.1.4 Install dev dependencies: `jest`, `@testing-library/react`, `@testing-library/jest-dom`, `@playwright/test` for E2E
  - [ ] 0.1.5 Configure TypeScript with strict mode in `tsconfig.json`
  - [ ] 0.1.6 Set up Tailwind configuration with accessibility-friendly color palette
  - [ ] 0.1.7 Create `.env.example` file with required environment variables
  - [ ] 0.1.8 Create `.gitignore` with Node.js, Next.js, and environment files
  - [ ] 0.1.9 Initialize Git repository and make initial commit

- [ ] **0.2 Set up database**
  - [ ] 0.2.1 Choose database (PostgreSQL recommended for relational data with JSON support)
  - [ ] 0.2.2 Install database client library (`pg` for PostgreSQL or Prisma ORM)
  - [ ] 0.2.3 Create `src/database/schema.sql` with all entity tables (UserProfile, LearningStrategy, Topic, Concept, DailyPlan, MemoryEntry, EvidenceItem)
  - [ ] 0.2.4 Set up database migration system (using Prisma or manual migration scripts)
  - [ ] 0.2.5 Create initial migration file
  - [ ] 0.2.6 Set up database connection utility in `src/database/connection.ts`
  - [ ] 0.2.7 Write database connection test

- [ ] **0.3 Configure testing infrastructure**
  - [ ] 0.3.1 Configure Jest for unit/integration testing (`jest.config.js`)
  - [ ] 0.3.2 Configure Playwright for E2E testing (`playwright.config.ts`)
  - [ ] 0.3.3 Create test utilities in `tests/utils/` (mock factories, test helpers)
  - [ ] 0.3.4 Set up test database configuration
  - [ ] 0.3.5 Create example component test to validate setup
  - [ ] 0.3.6 Create example API test to validate setup

**Acceptance Criteria for Task 0:**
- Project runs locally with `npm run dev`
- Database connection successful
- Test suite runs with `npm test`
- E2E test suite runs with `npx playwright test`
- All environment variables documented in `.env.example`

---

### 1. Define Core Type System

- [ ] **1.0 Create comprehensive TypeScript types**
  - [ ] 1.0.1 Create `src/types/userProfile.ts` with all questionnaire response types
    - Include enums for all multi-choice responses (Role, Skills, Goals, etc.)
    - Define ComfortPreferences interface with all accessibility toggles
    - Define complete UserProfile interface matching R2.1-R2.27
  - [ ] 1.0.2 Create `src/types/topicGraph.ts`
    - Define Topic interface
    - Define Concept interface with prereq_ids[], difficulty, why_it_matters, common_confusions[], example_template, application_template
    - Define DailyPlan interface
  - [ ] 1.0.3 Create `src/types/memory.ts`
    - Define MemoryEntry interface with reflection_text, action_taken (optional), tags[], created_at
    - Define EvidenceType enum (GitHub, ExecutionEvidence, Artifact, Link)
    - Define EvidenceItem interface with source_type (verifiable/user-provided)
  - [ ] 1.0.4 Create `src/types/learningStrategy.ts`
    - Define LearningStrategy interface with pace, depth, structure, comfort_defaults
    - Define AdaptationSignal types
  - [ ] 1.0.5 Write Zod schemas for runtime validation of all major types
  - [ ] 1.0.6 Write unit tests validating type constraints

**Acceptance Criteria for Task 1:**
- All types exported from `src/types/index.ts`
- Zod schemas validate example data correctly
- Types match PRD requirements R2-R16 exactly
- Test coverage > 90% for validation logic

---

### 2. Phase 1 - Onboarding UI (Topic Selection + Questionnaire)

- [ ] **2.0 Create topic selection screen**
  - [ ] 2.0.1 Create `src/components/onboarding/TopicSelection.tsx`
    - Display list of available topics (start with Docker, Kubernetes)
    - Single-select radio buttons or cards
    - "Continue" button only enabled when topic selected
  - [ ] 2.0.2 Create `src/components/onboarding/TopicCard.tsx` reusable component
  - [ ] 2.0.3 Style with Tailwind for clean, accessible interface
  - [ ] 2.0.4 Add keyboard navigation support (arrow keys, enter to select)
  - [ ] 2.0.5 Write component tests for TopicSelection
  - [ ] 2.0.6 Test accessibility with screen reader simulation

- [ ] **2.1 Create questionnaire component structure**
  - [ ] 2.1.1 Create `src/components/onboarding/Questionnaire.tsx` main component
    - State management for 8 sections and progression
    - Section navigation (Previous/Next buttons)
    - Progress indicator showing current section (e.g., "2 of 8")
  - [ ] 2.1.2 Create `src/components/onboarding/QuestionnaireSection.tsx` wrapper component
  - [ ] 2.1.3 Create reusable question components:
    - `SingleSelect.tsx` (radio buttons)
    - `MultiSelect.tsx` (checkboxes with max selection limit)
    - `Scale.tsx` (for time commitments, preference scales)
  - [ ] 2.1.4 Implement form state management (React Hook Form or similar)
  - [ ] 2.1.5 Add form validation (required fields, max selections)
  - [ ] 2.1.6 Write component tests for Questionnaire navigation

- [ ] **2.2 Implement Section 1 - Background & Baseline**
  - [ ] 2.2.1 Implement Q1: Current role (5 options as per R2.1)
  - [ ] 2.2.2 Implement Q2: Comfortable with (multi-select, R2.2)
  - [ ] 2.2.3 Implement Q3: Prior experience with topic (5 levels, R2.3)
  - [ ] 2.2.4 Add section validation
  - [ ] 2.2.5 Write tests for Section 1 interactions

- [ ] **2.3 Implement Section 2 - Goals & Outcomes**
  - [ ] 2.3.1 Implement Q1: Why learning now (pick up to 2, R2.4)
  - [ ] 2.3.2 Implement Q2: Outcomes that matter (multi-select, R2.5)
  - [ ] 2.3.3 Implement Q3: Mastery level (2 options, R2.6)
  - [ ] 2.3.4 Add section validation
  - [ ] 2.3.5 Write tests for Section 2

- [ ] **2.4 Implement Section 3 - Learning Structure**
  - [ ] 2.4.1 Implement Q1: Learning flow preference (3 options, R2.7)
  - [ ] 2.4.2 Implement Q2: Complexity increase (2 options, R2.8)
  - [ ] 2.4.3 Implement Q3: Troubleshooting importance (3 levels, R2.9)
  - [ ] 2.4.4 Add section validation
  - [ ] 2.4.5 Write tests for Section 3

- [ ] **2.5 Implement Section 4 - Platform & Tooling**
  - [ ] 2.5.1 Implement Q1: System to use (4 options, R2.10)
  - [ ] 2.5.2 Implement Q2: Local tool installation comfort (3 options, R2.11)
  - [ ] 2.5.3 Add section validation
  - [ ] 2.5.4 Write tests for Section 4

- [ ] **2.6 Implement Section 5 - Time & Consistency**
  - [ ] 2.6.1 Implement Q1: Daily time commitment (3 ranges, R2.12)
  - [ ] 2.6.2 Implement Q2: Weekly time commitment (3 ranges, R2.13)
  - [ ] 2.6.3 Implement Q3: Behavior when skipping (3 options, R2.14)
  - [ ] 2.6.4 Add validation ensuring weekly >= daily * minimum days
  - [ ] 2.6.5 Write tests for Section 5

- [ ] **2.7 Implement Section 6 - Learning Style & Depth**
  - [ ] 2.7.1 Implement Q1: What helps understanding (multi-select, R2.15)
  - [ ] 2.7.2 Implement Q2: What frustrates more (2 options, R2.16)
  - [ ] 2.7.3 Implement Q3: Depth preference (2 options, R2.17)
  - [ ] 2.7.4 Add section validation
  - [ ] 2.7.5 Write tests for Section 6

- [ ] **2.8 Implement Section 7 - Learning Comfort & Accessibility**
  - [ ] 2.8.1 Implement Q1: Best learning format (pick up to 2, R2.18)
  - [ ] 2.8.2 Implement Q2: Audio/video preference (4 options, R2.19)
  - [ ] 2.8.3 Implement Q3: What overwhelms (pick up to 2, R2.20)
  - [ ] 2.8.4 Implement Q4: Daily session style (3 options, R2.21)
  - [ ] 2.8.5 Implement Q5: Content order preference (3 options, R2.22)
  - [ ] 2.8.6 Implement Q6: Skip behavior (3 options, R2.23)
  - [ ] 2.8.7 Implement Q7: UI comfort toggles (multi-select, R2.24)
  - [ ] 2.8.8 Add section validation
  - [ ] 2.8.9 Write tests for Section 7

- [ ] **2.9 Implement Section 8 - Application & Proof-of-Work**
  - [ ] 2.9.1 Implement Q1: Application comfort (multi-select, R2.25)
  - [ ] 2.9.2 Implement Q2: What to track (3 options, R2.26)
  - [ ] 2.9.3 Implement Q3: Proof-of-work importance (3 levels, R2.27)
  - [ ] 2.9.4 Add section validation
  - [ ] 2.9.5 Write tests for Section 8

- [ ] **2.10 Add accessibility features to questionnaire**
  - [ ] 2.10.1 Implement keyboard navigation between sections
  - [ ] 2.10.2 Add ARIA labels to all form controls
  - [ ] 2.10.3 Implement focus management (focus first field on section load)
  - [ ] 2.10.4 Add skip-to-section navigation for keyboard users
  - [ ] 2.10.5 Test with screen reader
  - [ ] 2.10.6 Test with keyboard-only navigation

**Acceptance Criteria for Task 2:**
- All 8 sections render correctly with exact wording from PRD
- Form validation prevents progression with invalid/incomplete data
- Questionnaire can be completed in 5-8 minutes (manual test)
- Fully accessible via keyboard and screen reader
- Component test coverage > 85%
- E2E test completes full questionnaire flow

---

### 3. Phase 1 - Learning Contract Generation & Confirmation

- [ ] **3.0 Set up Claude API integration**
  - [ ] 3.0.1 Create `src/services/claudeClient.ts` wrapper for Anthropic SDK
  - [ ] 3.0.2 Add environment variable for Anthropic API key
  - [ ] 3.0.3 Implement error handling and retry logic
  - [ ] 3.0.4 Write unit tests with mocked API responses

- [ ] **3.1 Create learning contract generator service**
  - [ ] 3.1.1 Create `src/services/learningContractGenerator.ts`
  - [ ] 3.1.2 Implement function to transform UserProfile to natural language prompt
  - [ ] 3.1.3 Create Claude prompt template that generates contract summary as per R3 requirements
    - Must restate learner profile
    - Must explain course design decisions
    - Must connect questionnaire answers → decisions
    - Must specify what will be skipped, emphasized, daily structure, comfort defaults
  - [ ] 3.1.4 Implement contract parsing and validation
  - [ ] 3.1.5 Write tests with sample questionnaire responses

- [ ] **3.2 Create learning contract summary UI**
  - [ ] 3.2.1 Create `src/components/onboarding/LearningContractSummary.tsx`
  - [ ] 3.2.2 Display generated summary in readable format with sections:
    - Your Profile
    - Learning Approach
    - Content Format
    - Daily Structure
    - What We'll Track
    - What We'll Emphasize
    - What We'll Skip
  - [ ] 3.2.3 Add "Confirm" and "Correct" buttons
  - [ ] 3.2.4 Implement "Correct" functionality (edit mode or back to questionnaire)
  - [ ] 3.2.5 Show loading state during generation
  - [ ] 3.2.6 Handle generation errors gracefully
  - [ ] 3.2.7 Write component tests
  - [ ] 3.2.8 Test with various questionnaire combinations

- [ ] **3.3 Create API endpoints for onboarding**
  - [ ] 3.3.1 Create `src/api/routes/onboarding.ts`
  - [ ] 3.3.2 Implement `POST /api/onboarding/topic` - Save selected topic
  - [ ] 3.3.3 Implement `POST /api/onboarding/questionnaire` - Save questionnaire responses
  - [ ] 3.3.4 Implement `POST /api/onboarding/generate-contract` - Generate learning contract
  - [ ] 3.3.5 Implement `POST /api/onboarding/confirm-contract` - Confirm and persist contract
  - [ ] 3.3.6 Add request validation using Zod schemas
  - [ ] 3.3.7 Write API tests for all endpoints

- [ ] **3.4 Persist user profile to database**
  - [ ] 3.4.1 Create database repository functions in `src/repositories/userProfileRepository.ts`
  - [ ] 3.4.2 Implement `createUserProfile()` function
  - [ ] 3.4.3 Implement `getUserProfile(userId)` function
  - [ ] 3.4.4 Implement `updateUserProfile(userId, data)` function
  - [ ] 3.4.5 Write repository tests with test database

**Acceptance Criteria for Task 3:**
- Learning contract generation works end-to-end
- Generated contract matches example format in PRD Appendix
- User can confirm contract and proceed to Day 1
- User can correct/edit questionnaire before confirming
- Contract is persisted to database on confirmation
- API tests cover all endpoints
- Error states are handled gracefully

---

### 4. Phase 2 - Topic Graph & Learning Strategy

- [ ] **4.0 Create curated topic graph for Docker**
  - [ ] 4.0.1 Research and design Docker concept hierarchy
  - [ ] 4.0.2 Create `src/config/topicGraphs/docker.json` with 30-50 concept nodes
  - [ ] 4.0.3 For each concept, define:
    - title (single idea)
    - prereq_ids[] (concept IDs)
    - difficulty (beginner/intermediate/advanced)
    - why_it_matters (one sentence)
    - common_confusions[] (1-2 misconceptions)
    - example_template (minimal example)
    - application_template (optional 5-10 min activity)
  - [ ] 4.0.4 Validate prerequisite relationships (no circular dependencies)
  - [ ] 4.0.5 Create schema validation for topic graph JSON
  - [ ] 4.0.6 Write tests validating graph structure

- [ ] **4.1 Create topic graph service**
  - [ ] 4.1.1 Create `src/services/topicGraph.ts`
  - [ ] 4.1.2 Implement `loadTopicGraph(topicName)` function
  - [ ] 4.1.3 Implement `getConceptById(conceptId)` function
  - [ ] 4.1.4 Implement `getPrerequisites(conceptId)` recursive function
  - [ ] 4.1.5 Implement `filterByDifficulty(difficulty)` function
  - [ ] 4.1.6 Implement `topologicalSort()` for prerequisite ordering
  - [ ] 4.1.7 Write unit tests for all graph operations

- [ ] **4.2 Create learning strategy engine**
  - [ ] 4.2.1 Create `src/services/learningStrategyEngine.ts`
  - [ ] 4.2.2 Implement `generateLearningStrategy(userProfile)` function
  - [ ] 4.2.3 Transform questionnaire answers into strategy decisions:
    - Determine start_level from baseline_skills and prior_experience
    - Set phase_weighting based on goals and outcomes
    - Define daily_slice_policy from time commitments
    - Set application_frequency from application preferences
    - Define content_format_policy from comfort preferences
    - Set link_budget_policy from overwhelm triggers
  - [ ] 4.2.4 Write tests with various user profile combinations
  - [ ] 4.2.5 Validate that strategy respects all accessibility preferences

- [ ] **4.3 Create daily plan generator**
  - [ ] 4.3.1 Create `src/services/dailyPlanGenerator.ts`
  - [ ] 4.3.2 Implement `generateDailyPlan(learningStrategy, topicGraph)` function
  - [ ] 4.3.3 Filter concepts based on learning strategy
  - [ ] 4.3.4 Order concepts respecting prerequisites (topological sort)
  - [ ] 4.3.5 Split oversized concepts into smaller nodes as needed
  - [ ] 4.3.6 Ensure one concept per day (R7.3)
  - [ ] 4.3.7 Calculate estimated time for each DLU
  - [ ] 4.3.8 Write tests validating plan generation
  - [ ] 4.3.9 Test that daily time respects user's budget

**Acceptance Criteria for Task 4:**
- Docker topic graph loaded successfully
- Learning strategy generated from any valid user profile
- Daily plan generated with concepts in prerequisite order
- Plan respects "one concept per day" constraint
- Estimated daily time within user's time budget
- All service functions have unit tests
- Integration test validates end-to-end from profile → plan

---

### 5. Phase 2 - Daily Learning Unit UI

- [ ] **5.0 Create main daily learning unit component**
  - [ ] 5.0.1 Create `src/components/daily/DailyLearningUnit.tsx`
  - [ ] 5.0.2 Implement 4-part structure layout:
    - Concept (5-7 min)
    - Concrete Example (5 min)
    - Reflection (2-3 min)
    - Application (optional, 5-10 min)
  - [ ] 5.0.3 Add progress indicator within DLU (e.g., "Step 1 of 4")
  - [ ] 5.0.4 Implement "Next" navigation between parts
  - [ ] 5.0.5 Add session timer to track actual time spent
  - [ ] 5.0.6 Write component tests

- [ ] **5.1 Create concept explanation component**
  - [ ] 5.1.1 Create `src/components/daily/ConceptExplanation.tsx`
  - [ ] 5.1.2 Display concept title
  - [ ] 5.1.3 Display "why it matters" prominently at top (R9.2)
  - [ ] 5.1.4 Display short, targeted explanation (R9.3)
  - [ ] 5.1.5 Render content based on user format preferences:
    - Text-first mode: paragraphs + diagrams
    - TL;DR mode: summary → details
    - Details-first mode: details → summary
  - [ ] 5.1.6 Show "Deep dive" link only on request (R8.2)
  - [ ] 5.1.7 Write component tests for different format modes

- [ ] **5.2 Create minimal example component**
  - [ ] 5.2.1 Create `src/components/daily/MinimalExample.tsx`
  - [ ] 5.2.2 Display code/command example with syntax highlighting
  - [ ] 5.2.3 Add copy-to-clipboard button
  - [ ] 5.2.4 For hands-on labs: step-by-step checklist
  - [ ] 5.2.5 Add "Run locally" instructions based on user's platform
  - [ ] 5.2.6 Write component tests

- [ ] **5.3 Create reflection prompts component**
  - [ ] 5.3.1 Create `src/components/daily/ReflectionPrompts.tsx`
  - [ ] 5.3.2 Display 1-2 reflection questions (R9.5)
  - [ ] 5.3.3 Provide textarea for user response
  - [ ] 5.3.4 Add optional "I'm confused about..." field
  - [ ] 5.3.5 Store reflection in component state
  - [ ] 5.3.6 Write component tests

- [ ] **5.4 Create optional application moment component**
  - [ ] 5.4.1 Create `src/components/daily/ApplicationMoment.tsx`
  - [ ] 5.4.2 Clearly mark as "Optional" (R9.6)
  - [ ] 5.4.3 Display application template with clear instructions
  - [ ] 5.4.4 Show estimated time (5-10 minutes)
  - [ ] 5.4.5 Add "Skip for today" and "Complete" buttons
  - [ ] 5.4.6 If skipped, proceed to completion
  - [ ] 5.4.7 If completed, show evidence capture prompt (task 7.1)
  - [ ] 5.4.8 Write component tests for both paths

- [ ] **5.5 Implement accessibility features**
  - [ ] 5.5.1 Create `src/components/common/FocusMode.tsx` wrapper
  - [ ] 5.5.2 When Focus Mode enabled:
    - Hide navigation distractions
    - Reduce external links
    - Larger typography
    - High contrast mode option
  - [ ] 5.5.3 Implement reduced motion option (CSS prefers-reduced-motion)
  - [ ] 5.5.4 Add keyboard shortcuts for DLU navigation
  - [ ] 5.5.5 Test with screen reader
  - [ ] 5.5.6 Write accessibility tests

- [ ] **5.6 Create API endpoints for daily learning**
  - [ ] 5.6.1 Create `src/api/routes/learning.ts`
  - [ ] 5.6.2 Implement `GET /api/learning/today` - Fetch today's DLU
  - [ ] 5.6.3 Implement `POST /api/learning/complete` - Mark DLU as complete
  - [ ] 5.6.4 Implement `GET /api/learning/progress` - Get overall progress
  - [ ] 5.6.5 Add authentication/authorization middleware
  - [ ] 5.6.6 Write API tests

**Acceptance Criteria for Task 5:**
- Daily Learning Unit displays with all 4 parts
- One concept per day enforced
- Session time respects user's daily budget
- Content format adapts to user preferences (text-first, TL;DR, etc.)
- Focus Mode works correctly when enabled
- Fully keyboard navigable
- API returns correct DLU for user's current day
- Component and API test coverage > 85%

---

### 6. Phase 2 - Adaptation Engine

- [ ] **6.0 Create adaptation engine service**
  - [ ] 6.0.1 Create `src/services/adaptationEngine.ts`
  - [ ] 6.0.2 Define adaptation signal types (skipped days, confusion, overwhelm, fast progress)
  - [ ] 6.0.3 Implement `detectAdaptationSignals(userId)` function
  - [ ] 6.0.4 Write tests for signal detection

- [ ] **6.1 Implement skipped days adaptation**
  - [ ] 6.1.1 Track consecutive skipped days in user activity log
  - [ ] 6.1.2 Implement `generateRecap(lastCompletedDay)` function (1-3 min content, R10.1)
  - [ ] 6.1.3 If user preference is "ask before adjusting", show adjustment prompt
  - [ ] 6.1.4 If "slow down automatically", adjust pace without prompt
  - [ ] 6.1.5 Create recap UI component
  - [ ] 6.1.6 Write tests for recap generation
  - [ ] 6.1.7 Test different skip patterns (1 day, 3 days, 1 week)

- [ ] **6.2 Implement faster progress adaptation**
  - [ ] 6.2.1 Track user completion rate and time spent
  - [ ] 6.2.2 Detect when user consistently finishes early (R10.2)
  - [ ] 6.2.3 Unlock stretch concepts or shorten prerequisite review
  - [ ] 6.2.4 Never skip foundational concepts
  - [ ] 6.2.5 Write tests for progression acceleration
  - [ ] 6.2.6 Validate foundations are never skipped

- [ ] **6.3 Implement repeated confusion adaptation**
  - [ ] 6.3.1 Track reflection responses for confusion indicators (R10.3)
  - [ ] 6.3.2 Detect repeated confusion on same concept (e.g., 3 "confused" reflections)
  - [ ] 6.3.3 Generate alternate explanation using Claude API
  - [ ] 6.3.4 Create micro-lab for hands-on validation
  - [ ] 6.3.5 Write tests for confusion detection
  - [ ] 6.3.6 Test alternate explanation generation

- [ ] **6.4 Implement overwhelm detection adaptation**
  - [ ] 6.4.1 Track user's overwhelm signals from questionnaire (R10.5)
  - [ ] 6.4.2 Monitor session abandonment, long pauses, excessive time
  - [ ] 6.4.3 When overwhelm detected:
    - Reduce external links
    - Enforce Focus Mode
    - Split upcoming concepts into smaller nodes
  - [ ] 6.4.4 Write tests for overwhelm detection
  - [ ] 6.4.5 Test concept splitting logic

- [ ] **6.5 Implement application density adaptation**
  - [ ] 6.5.1 Track application completion rate (R10.4)
  - [ ] 6.5.2 If user opted in but rarely completes: reduce frequency gently
  - [ ] 6.5.3 If user consistently completes: increase frequency
  - [ ] 6.5.4 Never force application if user opted out
  - [ ] 6.5.5 Write tests for application frequency adjustment

**Acceptance Criteria for Task 6:**
- Adaptation engine detects all 5 signal types (skip, fast, confusion, overwhelm, low application)
- Recaps generated for skipped days
- Alternate explanations generated for repeated confusion
- Concept splitting works for overwhelm
- User preferences respected (ask vs automatic adjustment)
- All adaptation rules have unit tests
- Integration test validates adaptation end-to-end

---

### 7. Phase 3 - Memory System

- [ ] **7.0 Create memory entry creation**
  - [ ] 7.0.1 Create `src/services/memoryService.ts`
  - [ ] 7.0.2 Implement `createMemoryEntry(userId, conceptId, reflectionData)` function
  - [ ] 7.0.3 Automatically create entry on DLU completion (R11.1)
  - [ ] 7.0.4 Store: concept, reflection_text, action_taken (if applicable), tags[], timestamp
  - [ ] 7.0.5 Write tests for memory creation

- [ ] **7.1 Create evidence capture component**
  - [ ] 7.1.1 Create `src/components/memory/EvidenceCapture.tsx`
  - [ ] 7.1.2 Show ONLY after application moment completion (R12.1)
  - [ ] 7.1.3 Display prompt: "Did this produce something you want to remember?"
  - [ ] 7.1.4 Provide 3 primary actions (R12.2):
    - "Attach GitHub link" → input field for URL
    - "Paste output" → textarea for terminal output/code
    - "Skip" → no evidence attached
  - [ ] 7.1.5 Default visibility to private (R12.4)
  - [ ] 7.1.6 Write component tests for all 3 actions

- [ ] **7.2 Create evidence service**
  - [ ] 7.2.1 Create `src/services/evidenceService.ts`
  - [ ] 7.2.2 Implement `attachEvidence(memoryEntryId, evidenceData)` function
  - [ ] 7.2.3 Support evidence types: GitHub, ExecutionEvidence, Artifact, Link (R12.3)
  - [ ] 7.2.4 Label evidence as verifiable (GitHub links) vs user-provided (screenshots/output) (R14.2)
  - [ ] 7.2.5 Store evidence with memory_entry_id association
  - [ ] 7.2.6 Write tests for evidence attachment

- [ ] **7.3 Create evidence graph service**
  - [ ] 7.3.1 Create `src/services/evidenceGraph.ts`
  - [ ] 7.3.2 Implement internal graph: Topic → Skill → Concept → MemoryEntry → EvidenceItem (R13.1)
  - [ ] 7.3.3 Implement query functions:
    - `getMemoryEntriesByTopic(topicId)`
    - `getMemoryEntriesBySkill(skill)`
    - `getProofBackedEntries(userId)` (entries with evidence only)
    - `getAppliedEntries(userId)` (entries with action_taken)
  - [ ] 7.3.4 Graph remains internal, not exposed to UI (R13.2)
  - [ ] 7.3.5 Write tests for all query functions

- [ ] **7.4 Create memory timeline view**
  - [ ] 7.4.1 Create `src/components/memory/MemoryTimeline.tsx`
  - [ ] 7.4.2 Display chronological list of all memory entries (R15.1)
  - [ ] 7.4.3 Each entry shows:
    - Concept learned
    - Date
    - Reflection snippet
    - Tags (topic, difficulty)
    - Badge if proof-backed (has evidence)
  - [ ] 7.4.4 Implement infinite scroll or pagination
  - [ ] 7.4.5 Write component tests

- [ ] **7.5 Create memory filters component**
  - [ ] 7.5.1 Create `src/components/memory/MemoryFilters.tsx`
  - [ ] 7.5.2 Implement filter buttons:
    - All (default)
    - Applied (action_taken is not null) - R15.2
    - Proof-backed (has evidence attached) - R15.3
    - By Topic (dropdown)
    - By Skill (dropdown)
  - [ ] 7.5.3 Update timeline when filter changes
  - [ ] 7.5.4 Write component tests for each filter

- [ ] **7.6 Create topic/skill view**
  - [ ] 7.6.1 Create `src/components/memory/TopicSkillView.tsx`
  - [ ] 7.6.2 Group proof-backed entries by topic (R15.4)
  - [ ] 7.6.3 Group proof-backed entries by skill
  - [ ] 7.6.4 Display counts and example evidence
  - [ ] 7.6.5 Answer "What have I done?" using only evidence-backed entries (R15.5)
  - [ ] 7.6.6 Write component tests

- [ ] **7.7 Create API endpoints for memory**
  - [ ] 7.7.1 Create `src/api/routes/memory.ts`
  - [ ] 7.7.2 Implement `GET /api/memory/entries` - Fetch all entries with optional filters
  - [ ] 7.7.3 Implement `POST /api/memory/entries` - Create memory entry (auto on DLU complete)
  - [ ] 7.7.4 Implement `POST /api/memory/evidence` - Attach evidence to entry
  - [ ] 7.7.5 Implement `GET /api/memory/proof-backed` - Get proof-backed entries only
  - [ ] 7.7.6 Implement `GET /api/memory/by-topic/:topicId` - Get entries for topic
  - [ ] 7.7.7 Write API tests

**Acceptance Criteria for Task 7:**
- Memory entry created automatically on every DLU completion
- Evidence capture appears only after application moments
- Evidence properly attached to memory entries with source type labels
- Memory timeline displays all entries chronologically
- Filters work: All, Applied, Proof-backed, By Topic, By Skill
- Topic/Skill view groups proof-backed entries correctly
- Proof-backed definition enforced: entry must have evidence (R14.1)
- API test coverage > 85%

---

### 8. Phase 3 - Weekly Review

- [ ] **8.0 Create weekly digest service**
  - [ ] 8.0.1 Create `src/services/weeklyDigestService.ts`
  - [ ] 8.0.2 Implement `generateWeeklyDigest(userId)` function
  - [ ] 8.0.3 Calculate metrics:
    - Completed vs skipped days (R16.1)
    - Applied vs read-only concepts (counts + examples) (R16.1)
    - Count of proof-backed entries (R16.1)
  - [ ] 8.0.4 Generate one adjustment suggestion (R16.3):
    - Pace (speed up / slow down)
    - Recap frequency
    - Chunk size (split concepts)
    - Application frequency
  - [ ] 8.0.5 Use gentle, non-judgmental tone (R16.2)
  - [ ] 8.0.6 Write tests for digest generation

- [ ] **8.1 Create weekly digest component**
  - [ ] 8.1.1 Create `src/components/memory/WeeklyDigest.tsx`
  - [ ] 8.1.2 Display metrics in cards:
    - "This Week" section with completed/skipped days
    - "Learning Style" section with applied vs read-only
    - "Progress" section with proof-backed count
  - [ ] 8.1.3 Display suggested adjustment with explanation (R16.3)
  - [ ] 8.1.4 Provide "Accept" and "Keep current pace" buttons (R16.4)
  - [ ] 8.1.5 Show visual progress chart (optional: bar chart of daily activity)
  - [ ] 8.1.6 Write component tests

- [ ] **8.2 Implement adjustment acceptance**
  - [ ] 8.2.1 When user accepts adjustment, update LearningStrategy
  - [ ] 8.2.2 When user overrides, maintain current strategy
  - [ ] 8.2.3 Log adjustment decisions for future improvements
  - [ ] 8.2.4 Write tests for both acceptance paths

- [ ] **8.3 Create API endpoints for weekly review**
  - [ ] 8.3.1 Create `src/api/routes/weekly.ts`
  - [ ] 8.3.2 Implement `GET /api/weekly/digest` - Get current week's digest
  - [ ] 8.3.3 Implement `POST /api/weekly/accept-adjustment` - Accept suggested adjustment
  - [ ] 8.3.4 Implement `POST /api/weekly/override-adjustment` - Keep current pace
  - [ ] 8.3.5 Write API tests

**Acceptance Criteria for Task 8:**
- Weekly digest generates automatically on Sunday evening or user request
- Displays completed vs skipped days accurately
- Shows applied vs read-only concepts with examples
- Shows proof-backed entry count
- Suggests ONE adjustment with clear reasoning
- User can accept or override adjustment
- Tone is gentle and non-judgmental
- API test coverage > 85%

---

### 9. Settings & User Preferences

- [ ] **9.0 Create settings panel component**
  - [ ] 9.0.1 Create `src/components/settings/SettingsPanel.tsx`
  - [ ] 9.0.2 Organize settings into sections:
    - Time & Pace
    - Learning Preferences
    - Accessibility
    - Application Preferences
    - Account
  - [ ] 9.0.3 Write component tests

- [ ] **9.1 Implement time & pace settings**
  - [ ] 9.1.1 Allow editing daily time commitment (R20.1)
  - [ ] 9.1.2 Allow editing weekly time commitment
  - [ ] 9.1.3 Allow editing pace preference (fast/normal/slow)
  - [ ] 9.1.4 Show impact preview: "This will adjust your plan to X days/week"
  - [ ] 9.1.5 Write component tests

- [ ] **9.2 Implement accessibility settings**
  - [ ] 9.2.1 Allow toggling Focus Mode (R2.24, R20.1)
  - [ ] 9.2.2 Allow toggling Reduced Motion
  - [ ] 9.2.3 Allow toggling Larger Text
  - [ ] 9.2.4 Allow toggling High Contrast/Dark Mode
  - [ ] 9.2.5 Allow changing video preference (avoid / short clips / longer ok)
  - [ ] 9.2.6 Settings persist in user profile
  - [ ] 9.2.7 Write component tests

- [ ] **9.3 Implement application preferences**
  - [ ] 9.3.1 Allow changing application frequency (more/normal/less/off)
  - [ ] 9.3.2 Allow changing proof-of-work importance
  - [ ] 9.3.3 Write component tests

- [ ] **9.4 Create settings API endpoints**
  - [ ] 9.4.1 Create `src/api/routes/settings.ts`
  - [ ] 9.4.2 Implement `GET /api/settings` - Fetch current settings
  - [ ] 9.4.3 Implement `PATCH /api/settings/time` - Update time commitments
  - [ ] 9.4.4 Implement `PATCH /api/settings/accessibility` - Update accessibility preferences
  - [ ] 9.4.5 Implement `PATCH /api/settings/application` - Update application preferences
  - [ ] 9.4.6 Trigger plan regeneration when time budget changes significantly (R20.2)
  - [ ] 9.4.7 Write API tests

**Acceptance Criteria for Task 9:**
- Settings panel displays all preferences from questionnaire
- Changes apply to future DLUs without disrupting current progress (R20.2)
- Time budget changes trigger plan recalculation
- Accessibility settings apply immediately to UI
- Settings persisted to database
- API test coverage > 85%

---

### 10. Main Navigation & Layout

- [ ] **10.0 Create main layout component**
  - [ ] 10.0.1 Create `src/components/layout/MainLayout.tsx`
  - [ ] 10.0.2 Implement navigation sidebar with routes:
    - Today (Daily Learning)
    - Memory (Timeline + Filters)
    - Progress (Weekly Digest)
    - Settings
  - [ ] 10.0.3 Add user profile dropdown (logout, account)
  - [ ] 10.0.4 Responsive design (mobile: bottom nav, desktop: sidebar)
  - [ ] 10.0.5 Write component tests

- [ ] **10.1 Implement routing**
  - [ ] 10.1.1 Set up Next.js App Router structure
  - [ ] 10.1.2 Create route: `/onboarding` (topic selection → questionnaire → contract)
  - [ ] 10.1.3 Create route: `/today` (daily learning unit)
  - [ ] 10.1.4 Create route: `/memory` (timeline + filters)
  - [ ] 10.1.5 Create route: `/progress` (weekly digest)
  - [ ] 10.1.6 Create route: `/settings`
  - [ ] 10.1.7 Implement protected routes (require authentication)
  - [ ] 10.1.8 Write routing tests

- [ ] **10.2 Create custom accessibility hook**
  - [ ] 10.2.1 Create `src/hooks/useAccessibility.ts`
  - [ ] 10.2.2 Fetch user's accessibility preferences from context/API
  - [ ] 10.2.3 Provide helpers: `isFocusModeEnabled()`, `isReducedMotion()`, `getTextSize()`, etc.
  - [ ] 10.2.4 Apply preferences globally via CSS variables
  - [ ] 10.2.5 Write hook tests

**Acceptance Criteria for Task 10:**
- Navigation works across all main routes
- Responsive design works on mobile and desktop
- Protected routes redirect unauthenticated users
- Accessibility preferences apply globally
- Layout component tests cover navigation

---

### 11. Authentication & User Management

- [ ] **11.0 Set up authentication**
  - [ ] 11.0.1 Choose auth provider (NextAuth.js recommended)
  - [ ] 11.0.2 Install and configure NextAuth.js
  - [ ] 11.0.3 Set up email/password authentication
  - [ ] 11.0.4 Set up OAuth (Google/GitHub optional)
  - [ ] 11.0.5 Create user registration flow
  - [ ] 11.0.6 Create login flow
  - [ ] 11.0.7 Implement session management
  - [ ] 11.0.8 Write auth tests

- [ ] **11.1 Create user database schema**
  - [ ] 11.1.1 Add `users` table with id, email, hashed_password, created_at
  - [ ] 11.1.2 Create migration for users table
  - [ ] 11.1.3 Link UserProfile to user_id (foreign key)
  - [ ] 11.1.4 Write repository functions for user CRUD

- [ ] **11.2 Implement authentication middleware**
  - [ ] 11.2.1 Create middleware to verify session on protected API routes
  - [ ] 11.2.2 Attach userId to request context
  - [ ] 11.2.3 Write middleware tests

**Acceptance Criteria for Task 11:**
- Users can register and log in
- Sessions persist across page refreshes
- Protected routes and APIs require authentication
- User data is properly isolated by userId
- Auth tests cover registration, login, logout

---

### 12. End-to-End Testing

- [ ] **12.0 Create E2E test: Onboarding flow**
  - [ ] 12.0.1 Create `tests/e2e/onboarding.spec.ts`
  - [ ] 12.0.2 Test: Register → Select Topic → Complete Questionnaire → Confirm Contract
  - [ ] 12.0.3 Validate questionnaire sections render correctly
  - [ ] 12.0.4 Validate contract summary generation
  - [ ] 12.0.5 Validate redirect to Day 1 after confirmation

- [ ] **12.1 Create E2E test: Daily learning flow**
  - [ ] 12.1.1 Create `tests/e2e/dailyLearning.spec.ts`
  - [ ] 12.1.2 Test: Login → Navigate to Today → Complete DLU (all 4 parts)
  - [ ] 12.1.3 Validate concept, example, reflection, application render
  - [ ] 12.1.4 Validate optional application skip path
  - [ ] 12.1.5 Validate memory entry creation

- [ ] **12.2 Create E2E test: Memory system**
  - [ ] 12.2.1 Create `tests/e2e/memory.spec.ts`
  - [ ] 12.2.2 Test: Navigate to Memory → View Timeline → Apply Filters
  - [ ] 12.2.3 Validate filters: All, Applied, Proof-backed
  - [ ] 12.2.4 Test evidence capture after application
  - [ ] 12.2.5 Validate proof-backed entries display correctly

- [ ] **12.3 Create E2E test: Weekly review**
  - [ ] 12.3.1 Create `tests/e2e/weeklyReview.spec.ts`
  - [ ] 12.3.2 Test: Navigate to Progress → View Digest → Accept Adjustment
  - [ ] 12.3.3 Validate metrics display correctly
  - [ ] 12.3.4 Validate adjustment suggestion appears
  - [ ] 12.3.5 Validate both accept and override paths

- [ ] **12.4 Create E2E test: Settings changes**
  - [ ] 12.4.1 Create `tests/e2e/settings.spec.ts`
  - [ ] 12.4.2 Test: Navigate to Settings → Change time budget → Save
  - [ ] 12.4.3 Test: Change accessibility toggles → Verify UI updates
  - [ ] 12.4.4 Validate settings persist after refresh

**Acceptance Criteria for Task 12:**
- All E2E tests pass consistently
- E2E tests cover complete user journeys (onboarding → daily use → memory → review)
- Tests run in CI/CD pipeline
- E2E test coverage includes happy paths and error scenarios

---

### 13. Documentation

- [ ] **13.0 Create project README**
  - [ ] 13.0.1 Create `README.md` with:
    - Project overview
    - Installation instructions
    - Environment setup (`.env` variables)
    - Running locally (`npm run dev`)
    - Running tests (`npm test`, `npx playwright test`)
    - Tech stack summary
  - [ ] 13.0.2 Add screenshots of key screens

- [ ] **13.1 Create architecture documentation**
  - [ ] 13.1.1 Create `docs/ARCHITECTURE.md`
  - [ ] 13.1.2 Document system architecture (3 phases, services, data flow)
  - [ ] 13.1.3 Document data model with entity relationships
  - [ ] 13.1.4 Document API endpoints with examples
  - [ ] 13.1.5 Create architecture diagrams (optional: Mermaid or draw.io)

- [ ] **13.2 Create topic graph authoring guide**
  - [ ] 13.2.1 Create `docs/TOPIC_GRAPH_GUIDE.md`
  - [ ] 13.2.2 Explain concept node structure
  - [ ] 13.2.3 Provide examples of well-designed concepts
  - [ ] 13.2.4 Document prerequisite relationship guidelines
  - [ ] 13.2.5 Include JSON schema for validation

- [ ] **13.3 Create API documentation**
  - [ ] 13.3.1 Create `docs/API.md`
  - [ ] 13.3.2 Document all API endpoints with:
    - Method, path, authentication
    - Request/response schemas
    - Example requests/responses
    - Error codes and messages

- [ ] **13.4 Create deployment guide**
  - [ ] 13.4.1 Create `docs/DEPLOYMENT.md`
  - [ ] 13.4.2 Document environment variables for production
  - [ ] 13.4.3 Document database setup and migrations
  - [ ] 13.4.4 Document deployment steps (Vercel/Railway/etc.)
  - [ ] 13.4.5 Document monitoring and logging setup

**Acceptance Criteria for Task 13:**
- README allows new developer to run project locally
- Architecture doc explains system design clearly
- Topic graph guide enables creating new topic graphs
- API doc covers all endpoints with examples
- Deployment doc allows production deployment

---

### 14. Performance & Optimization

- [ ] **14.0 Optimize database queries**
  - [ ] 14.0.1 Add indexes on frequently queried fields (user_id, topic_id, created_at)
  - [ ] 14.0.2 Optimize memory entry queries with pagination
  - [ ] 14.0.3 Cache topic graph in memory (rarely changes)
  - [ ] 14.0.4 Write performance tests for database queries

- [ ] **14.1 Optimize Claude API usage**
  - [ ] 14.1.1 Cache generated learning contracts (don't regenerate on refresh)
  - [ ] 14.1.2 Cache concept explanations (pre-generate for curated concepts)
  - [ ] 14.1.3 Implement rate limiting for API calls
  - [ ] 14.1.4 Add retry logic with exponential backoff
  - [ ] 14.1.5 Write tests for API optimization logic

- [ ] **14.2 Frontend performance**
  - [ ] 14.2.1 Implement code splitting for routes
  - [ ] 14.2.2 Lazy load heavy components (charts, diagrams)
  - [ ] 14.2.3 Optimize images (use Next.js Image component)
  - [ ] 14.2.4 Add loading states for async operations
  - [ ] 14.2.5 Run Lighthouse audit and fix issues

**Acceptance Criteria for Task 14:**
- Database queries < 100ms for typical operations
- Claude API calls cached appropriately
- Page load time < 2 seconds on 3G
- Lighthouse score > 90 for Performance, Accessibility

---

### 15. Security & Privacy

- [ ] **15.0 Implement security best practices**
  - [ ] 15.0.1 Validate all user inputs (use Zod schemas)
  - [ ] 15.0.2 Sanitize user-generated content (reflections, evidence)
  - [ ] 15.0.3 Implement CSRF protection
  - [ ] 15.0.4 Use HTTPS in production (enforce via middleware)
  - [ ] 15.0.5 Set secure HTTP headers (Content-Security-Policy, etc.)
  - [ ] 15.0.6 Write security tests

- [ ] **15.1 Implement data privacy**
  - [ ] 15.1.1 Ensure memory entries are private by default (R12.4, S1)
  - [ ] 15.1.2 Implement user data export (GDPR compliance)
  - [ ] 15.1.3 Implement user data deletion
  - [ ] 15.1.4 Do not store sensitive data in evidence (S2)
  - [ ] 15.1.5 Write privacy compliance tests

**Acceptance Criteria for Task 15:**
- All user inputs validated and sanitized
- Memory entries isolated by userId
- User can export and delete their data
- No sensitive data stored in evidence
- Security audit passes (manual or automated)

---

### 16. Final Integration & Polish

- [ ] **16.0 Fix bugs from testing**
  - [ ] 16.0.1 Address all failing tests
  - [ ] 16.0.2 Fix bugs reported in manual testing
  - [ ] 16.0.3 Fix accessibility issues from screen reader testing
  - [ ] 16.0.4 Regression test all major flows

- [ ] **16.1 Polish UI/UX**
  - [ ] 16.1.1 Ensure consistent spacing, typography, colors across all screens
  - [ ] 16.1.2 Add smooth transitions and animations (respect reduced motion)
  - [ ] 16.1.3 Polish error messages (friendly, actionable)
  - [ ] 16.1.4 Add empty states (no memory entries, no progress yet)
  - [ ] 16.1.5 Add success states (confetti on DLU completion optional)

- [ ] **16.2 Final end-to-end validation**
  - [ ] 16.2.1 Complete onboarding as new user
  - [ ] 16.2.2 Complete 7 days of daily learning
  - [ ] 16.2.3 Create proof-backed memory entries
  - [ ] 16.2.4 View weekly digest and accept adjustment
  - [ ] 16.2.5 Change settings and verify changes apply
  - [ ] 16.2.6 Export user data
  - [ ] 16.2.7 Delete user account

- [ ] **16.3 Prepare for deployment**
  - [ ] 16.3.1 Set up production environment variables
  - [ ] 16.3.2 Run database migrations in staging environment
  - [ ] 16.3.3 Deploy to staging
  - [ ] 16.3.4 Test in staging environment
  - [ ] 16.3.5 Set up monitoring and error tracking (Sentry or similar)
  - [ ] 16.3.6 Deploy to production
  - [ ] 16.3.7 Verify production deployment

**Acceptance Criteria for Task 16:**
- All tests passing (unit, integration, E2E)
- UI polished and consistent
- Complete user journey works in production
- Monitoring and error tracking active
- Documentation complete and accurate

---

## Definition of Done (Checklist)

### Phase 1 Complete
- [ ] Questionnaire includes all 8 sections with exact locked wording
- [ ] Learning contract summary generated and connects answers → decisions
- [ ] User can confirm/correct summary before Day 1
- [ ] Confirmed profile persists and is used for planning

### Phase 2 Complete
- [ ] Daily Learning Unit follows invariant 4-part structure
- [ ] One concept per day enforced (concept splitting supported)
- [ ] Daily session respects user's time budget
- [ ] Adaptation handles: skipped days, faster progress, repeated confusion, overwhelm
- [ ] Content format adapts to accessibility preferences

### Phase 3 Complete
- [ ] Every completed DLU creates MemoryEntry automatically
- [ ] Evidence capture is optional and low-friction
- [ ] Evidence items attach to memory entries with source type labels
- [ ] Memory timeline supports filters: all, applied, proof-backed
- [ ] Topic/Skill view groups proof-backed entries
- [ ] Weekly digest generates with gentle tone and adjustment suggestion
- [ ] Proof-backed entries answer "What have I done?" with verifiable examples

### Overall v1.1 Complete
- [ ] All functional requirements (R1-R20) implemented
- [ ] All non-goals respected (no scope creep)
- [ ] Core user flows work end-to-end (onboarding, daily, weekly review)
- [ ] Data model supports all three phases cleanly
- [ ] System can be used daily by real learner for 30+ days
- [ ] First user can show proof-backed evidence of learning journey
- [ ] Production deployment successful
- [ ] Documentation complete

---

## Notes

### Testing Commands
- Run unit/integration tests: `npm test`
- Run E2E tests: `npx playwright test`
- Run specific test file: `npm test -- path/to/test.test.ts`
- Run tests in watch mode: `npm test -- --watch`

### Development Commands
- Start dev server: `npm run dev`
- Build for production: `npm run build`
- Start production server: `npm start`
- Run linter: `npm run lint`
- Format code: `npm run format`

### Database Commands
- Run migrations: `npm run migrate`
- Rollback migration: `npm run migrate:rollback`
- Seed database: `npm run seed`

### Branch Strategy
- Feature branch: `feature/ai-learning-lab-foundation`
- Create sub-branches for large tasks if needed: `feature/ai-learning-lab-memory-system`
- Merge to main after each major phase is complete and tested

---

**Total Estimated Tasks:** 16 parent tasks, ~200+ subtasks
**Estimated Timeline:** 8-12 weeks for single developer (full-time equivalent)
