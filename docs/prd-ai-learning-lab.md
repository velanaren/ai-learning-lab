# PRD: AI Learning Lab - Hyper-Personal Daily Learning System

## Introduction/Overview

AI Learning Lab is a hyper-personal daily learning system designed to solve the chronic problem of inconsistent technical learning for DevOps and software engineering professionals. Unlike traditional course platforms or chatbots, this system adapts to the learner's background, goals, time constraints, and learning preferences to deliver structured daily learning sessions that feel achievable and build visible, verifiable progress over time.

**Problem Statement:**
Technical professionals struggle to maintain consistent learning because:
- They follow too many sources without structure
- They consume information without applying it
- Progress feels invisible and unverifiable
- They can't realistically fit heavy learning systems into busy daily schedules

**Solution:**
A daily-use learning system that:
- Delivers short, structured daily sessions (10-60 minutes based on user availability)
- Adapts to individual learning styles and accessibility needs
- Captures learning and application through a Memory system
- Provides verifiable Proof-of-Work through evidence-backed memory entries
- Adjusts automatically when users skip days or accelerate progress

**Design Constraint (Non-negotiable):**
The default daily experience must fit into a real day. If it cannot realistically be used daily, it is not solving the problem.

---

## Goals

1. **Enable Consistent Learning**: Make daily technical learning feel achievable and sustainable for working professionals
2. **Provide Personalization at Scale**: Deliver learning paths that adapt to individual backgrounds, goals, time constraints, and accessibility needs
3. **Build Visible Progress**: Create a Memory system that makes learning progress tangible and verifiable
4. **Support Inclusive Learning**: Accommodate diverse learning styles, comfort preferences, and accessibility requirements without diagnosis requirements
5. **Establish Trust**: Build confidence through structured, evidence-based learning that users continue using beyond cohort completion

---

## User Stories

### Primary User: Mid-Career Technical Professional
**As a DevOps engineer with 5 years of experience,**
I want a learning system that respects my limited daily time and understands I already know Linux basics,
So that I can master Docker without feeling overwhelmed or wasting time on content I already know.

**As a developer transitioning to DevOps,**
I want learning that starts with concepts before diving into commands,
So that I build proper mental models instead of just memorizing CLI syntax.

**As a neurodivergent learner,**
I want to control video content, reduce UI clutter, and get gentle recaps when I miss days,
So that I can learn effectively without sensory overload or shame when my consistency isn't perfect.

### Application-Focused User
**As someone who learns by building,**
I want optional daily application moments that are small and finishable,
So that I can apply what I learn immediately without getting stuck on huge projects.

**As a portfolio-conscious job seeker,**
I want a simple way to prove what I've actually built and learned,
So that I can answer "What Docker experience do you have?" with concrete evidence, not vague claims.

### Time-Constrained User
**As a parent with unpredictable schedules,**
I want the system to adapt when I miss days without judgment,
So that I can maintain learning momentum even when life gets chaotic.

---

## Functional Requirements

### Phase 1: Onboarding & Learning Contract

#### R1: Topic Selection
The system must allow users to select a technical topic they want to learn (e.g., Docker, Kubernetes, Python).

#### R2: Comprehensive Questionnaire (8 Sections - v1.1 Locked)
The system must collect user information through exactly 8 sections:

**Section 1 - Background & Baseline:**
- R2.1: Ask current role (Application Support Engineer / Software Developer / DevOps-SRE / Student / Other)
- R2.2: Ask which topics user is already comfortable with (multi-select: Linux CLI, Bash scripting, Python, Git, Debugging prod issues, None)
- R2.3: Ask prior experience with chosen topic (Never / Used basics / Built small things / Used in CI-CD / Used professionally)

**Section 2 - Goals & Outcomes:**
- R2.4: Ask why learning this topic now (pick up to 2: Career transition, Improve current role, Prepare for next topic, Fundamentals, Interview prep)
- R2.5: Ask which outcomes matter most (multi-select: Build real apps, Use in CI-CD, Understand internals, Troubleshoot, Interview-ready)
- R2.6: Ask mastery level goal ("use confidently" vs "devops-grade mastery")

**Section 3 - Learning Structure:**
- R2.7: Ask preferred learning flow (concepts-first / build-first / mix)
- R2.8: Ask how complexity should increase (gradually one layer / through realistic projects)
- R2.9: Ask importance of troubleshooting practice (low / some / very important)

**Section 4 - Platform & Tooling:**
- R2.10: Ask what system will be used (macOS Intel / macOS Apple Silicon / Linux / Windows WSL)
- R2.11: Ask comfort with local tool installation (yes / prefer minimal setup / prefer cloud)

**Section 5 - Time & Consistency:**
- R2.12: Ask realistic daily time commitment (10–15 / 20–30 / 45–60 minutes)
- R2.13: Ask total weekly time commitment (<5 / 5–10 / 10+ hours)
- R2.14: Ask preferred behavior when missing days (recap+continue / slow down automatically / ask before adjusting)

**Section 6 - Learning Style & Depth:**
- R2.15: Ask what helps understand complex systems (multi-select: analogies, step-by-step labs, visuals, all)
- R2.16: Ask what frustrates more (oversimplified explanations / too much theory without practice)
- R2.17: Ask depth preference (keep it simple first vs never compromise on accuracy)

**Section 7 - Learning Comfort & Accessibility:**
- R2.18: Ask best learning format (pick up to 2: text-first, step-by-step labs, diagrams/mental models, short clips ≤3 min, no videos—text only)
- R2.19: Ask audio/video preference (avoid audio-video / short clips only / 5–10 min occasionally / longer videos ok)
- R2.20: Ask what overwhelms most (pick up to 2: too many new terms, long explanations without checkpoints, too many links, too much UI, setup friction)
- R2.21: Ask preferred daily session style (one concept per day / one concept + small application / project flow)
- R2.22: Ask content order preference (TL;DR → details / details → summary / example → explanation)
- R2.23: Ask skip behavior preference (gentle recap / simplified restart / ask before changing pace)
- R2.24: Provide UI comfort toggles (multi-select: Focus Mode, Reduced motion, Larger text, High contrast/dark mode)

**Section 8 - Application & Proof-of-Work:**
- R2.25: Ask application comfort level (multi-select: code/config snippets, running commands, linking GitHub, writing short reflections)
- R2.26: Ask what system should track (learning only / learning + small applications / learning + applications + evidence links)
- R2.27: Ask importance of proof-of-work (nice-to-have / important / very important)

#### R3: Learning Contract Generation
- R3.1: The system must generate a reflective summary immediately after questionnaire completion
- R3.2: The summary must restate the learner profile in natural language
- R3.3: The summary must explicitly explain course design decisions based on answers (what will be skipped, emphasized, daily structure, comfort defaults)
- R3.4: The summary must connect specific questionnaire answers to specific course decisions

#### R4: Learning Contract Confirmation
- R4.1: The system must display the learning contract summary to the user
- R4.2: The system must allow users to confirm or correct the summary before starting Day 1
- R4.3: The system must not begin daily learning until the contract is confirmed

### Phase 2: Course Design & Daily Learning Delivery

#### R5: Topic Graph (Curated Concept Library)
- R5.1: The system must maintain a curated Topic Graph for each supported topic
- R5.2: Each concept node must include: concept name (single idea), prerequisites (concept IDs), difficulty level, "why it matters" statement, 1-2 common confusions, minimal example hook, optional application template
- R5.3: The system must not generate random or uncurated lesson content

#### R6: Learning Strategy Generation
- R6.1: The system must transform confirmed user profile into a Learning Strategy that determines: pace, depth, structure, comfort defaults
- R6.2: The Learning Strategy must filter the Topic Graph to match user's level and goals

#### R7: Daily Plan Generation
- R7.1: The system must generate a Daily Plan as a sequence of Daily Learning Units (DLUs)
- R7.2: Each Daily Learning Unit must follow the invariant structure: Concept (5-7 min) → Concrete Example (5 min) → Reflection (2-3 min) → Optional Application (5-10 min)
- R7.3: The system must enforce "one concept per day" rule
- R7.4: If a concept is too large, the system must split it into smaller concept nodes

#### R8: Daily Learning Unit Structure (Hard Constraints)
- R8.1: One DLU must equal one concept (no multi-concept days)
- R8.2: Deep dives must be optional links shown only on request or when needed later
- R8.3: Application moments must be completable in 5-10 minutes and always optional
- R8.4: If user preference is text-only, system must not require videos; use text + diagrams + checklists instead
- R8.5: Total daily session time must respect user's stated time budget

#### R9: Daily Learning Experience
- R9.1: User must see "Today's learning" as primary interface, not modules or long courses
- R9.2: Each concept must start with "why it matters" in one sentence
- R9.3: Concept explanation must be short and targeted
- R9.4: System must present minimal example for hands-on understanding
- R9.5: System must present 1-2 reflection prompts
- R9.6: Application moment must appear as optional, not required
- R9.7: Users must never feel they are using a dashboard, portfolio builder, or graph editor

#### R10: Adaptation Rules
- R10.1: When user skips days: show 1-3 minute recap and resume; if preference is "ask before adjusting," prompt before pace changes
- R10.2: When user progresses faster: unlock stretch concepts or shorten prerequisite review (never skip foundations)
- R10.3: When repeated confusion detected: present alternate explanation with new analogy plus micro-lab validation
- R10.4: When low application density: if user opted into application, gently increase application frequency (never force)
- R10.5: When overwhelm detected: reduce external links, enforce Focus Mode, split upcoming concepts into smaller nodes

### Phase 3: Memory & Proof-of-Work System

#### R11: Memory Entry Creation
- R11.1: System must automatically create a Memory Entry for every completed daily session
- R11.2: Each Memory Entry must include: concept learned, user reflection (what changed/unclear), optional action taken, tags (topic/skill/difficulty/phase), timestamp
- R11.3: Memory entries must be created without requiring user curation effort

#### R12: Evidence Capture (Low-Friction)
- R12.1: Evidence prompt must appear ONLY after an application moment, never during concept learning
- R12.2: Evidence prompt must offer at most 3 primary actions: Attach GitHub link, Paste output, Skip
- R12.3: System must support these evidence types:
  - GitHub: repo link, PR link, commit link, file path link
  - Execution evidence: screenshot of terminal output, pasted output (marked self-reported)
  - Artifacts: small code/config snippet, markdown notes
  - Links: demo URL, gist, diagram
- R12.4: Default evidence visibility must be private
- R12.5: Users may optionally mark evidence items as shareable

#### R13: Evidence Graph (Internal)
- R13.1: System must maintain internal evidence graph linking: Topic → Skill → Concept → Memory Entry → Evidence Item
- R13.2: Evidence graph must remain internal; users see simple views, not graph UI
- R13.3: Graph must enable intelligent queries for user-visible views

#### R14: Proof-of-Work Definition
- R14.1: A Memory Entry becomes "proof-backed" ONLY when at least one evidence item is attached
- R14.2: System must label evidence by source type: verifiable (GitHub link) vs user-provided (screenshot/output)
- R14.3: System must never invent metrics or achievements
- R14.4: System must never label entries as proof-backed without attached evidence

#### R15: User-Visible Memory Views
- R15.1: Memory Timeline: chronological list of all memory entries
- R15.2: Applied Filter: show only entries where action was taken
- R15.3: Proof-backed Filter: show only entries with evidence attached
- R15.4: Topic/Skill View: group proof-backed entries by topic or skill
- R15.5: Each view must answer "What have I actually done?" using only evidence-backed entries

#### R16: Weekly Digest
- R16.1: System must generate weekly summary showing: completed vs skipped days, applied vs read-only concepts (counts + examples), count of proof-backed entries
- R16.2: Digest must be gentle and non-judgmental in tone
- R16.3: Digest must suggest one adjustment (pace/recap/chunk size/application frequency)
- R16.4: User must be able to accept or override suggested adjustment

### Phase 4: Core User Flows

#### R17: Onboarding Flow
- R17.1: User selects topic → completes 8-section questionnaire → views learning contract summary → confirms/corrects → Day 1 begins immediately

#### R18: Daily Flow
- R18.1: Open app → see Today's concept + "why it matters" → read short explanation → try minimal example → answer reflection prompts → optional application → memory saved automatically → evidence prompt only if application occurred

#### R19: Weekly Review Flow
- R19.1: Show completed vs skipped days → show applied vs read-only with examples → suggest one adjustment → user accepts or overrides

#### R20: Settings & Preferences
- R20.1: System must allow users to adjust: time budget, pace preference, accessibility toggles, application preference
- R20.2: Changes must apply to future daily sessions without disrupting current progress

---

## Non-Goals (Out of Scope)

### NG1: Full Course Marketplace
This is not a platform for hosting multiple course creators or monetizing third-party content.

### NG2: Long-Form Video Platform
The system will not become a video-heavy platform like Udemy or YouTube courses.

### NG3: Heavy Portfolio Builder
While proof-of-work emerges from Memory, this is not a standalone portfolio creation tool with complex templates.

### NG4: Code Execution Sandbox
Version 1 will not include untrusted code execution. Users run code locally; execution evidence is captured through screenshots/paste (optional future enhancement).

### NG5: Real-Time News Feed
Ecosystem awareness can start as curated weekly digest, not a real-time news aggregator.

### NG6: Multi-User Collaboration
Version 1 is single-player focused; collaborative learning features are out of scope.

### NG7: Mobile-First Experience
Initial focus is web/desktop; mobile optimization is future work.

### NG8: Gamification & Leaderboards
No points, badges, or competitive elements. Progress is personal and evidence-based.

---

## Design Considerations

### Mental Model: Learning → Application → Memory
The system operates as three reinforcing layers that users experience seamlessly:
1. **Learning**: Short daily sessions building mental models
2. **Application**: Lightweight actions converting knowledge to capability  
3. **Memory**: Structured capture of learning + actions taken

### Key Design Principles

#### 1. Daily Habit Formation
- Consistent, predictable structure (same DLU format every day)
- Calm interface that reduces cognitive load
- Achievable session lengths that fit real schedules

#### 2. Inclusive by Default
- Never require diagnosis for accessibility
- Capture comfort preferences through behavioral questions
- Support text-first, video-optional, reduced-motion workflows
- Provide gentle recaps for inconsistent learners

#### 3. Evidence Over Claims
- Proof-of-work = memory + evidence
- Clearly label verifiable vs self-reported evidence
- Never inflate or invent achievements
- Make "What have I done?" answerable with concrete examples

#### 4. Trust Through Transparency
- Learning contract makes design decisions explicit
- Adaptation suggestions are presented, not imposed
- Users can override system adjustments
- Quality comes from curated Topic Graph, not AI hallucinations

### UI/UX Requirements

#### Minimal Screen Set
1. Welcome + Topic Choice
2. Questionnaire (8 sections, ~5-8 minutes total)
3. Learning Contract Summary
4. Today (Daily Learning Unit)
5. Memory (timeline + filters)
6. Weekly Review
7. Settings

#### Focus Mode (Accessibility Toggle)
When enabled:
- Reduce UI elements
- Hide external links by default
- Larger, clearer typography
- Minimal navigation distractions

#### Content Format Adaptations
Based on questionnaire Section 7:
- Text-first users: diagrams + checklists, no video requirements
- Short-clip-only users: videos ≤3 min with transcripts
- No-video users: complete text alternatives for all content

---

## Technical Considerations

### Data Model (Clean, Sufficient)

#### Core Entities

**UserProfile**
- Fields: role, baseline_skills[], goals[], outcomes[], platform, daily_minutes, weekly_hours, pacing_pref, learning_style[], comfort_prefs (text_first, video_limit, overload_triggers, focus_mode), application_pref, evidence_pref
- Purpose: Stores confirmed learning contract inputs

**LearningStrategy**
- Fields: start_level, phase_weighting, daily_slice_policy, application_frequency, content_format_policy, link_budget_policy
- Purpose: Derived decisions used to assemble plan

**Topic**
- Fields: name, description, tags[]
- Purpose: Allows multiple technical topics in system

**Concept**
- Fields: topic_id, title, prereq_ids[], difficulty, why_it_matters, common_confusions[], example_template, application_template
- Purpose: Single concept node for sequencing and daily slicing

**DailyPlan**
- Fields: user_id, topic_id, generated_at, concept_sequence[]
- Purpose: Stores upcoming daily schedule

**MemoryEntry**
- Fields: user_id, topic_id, concept_id, reflection_text, action_taken (optional), tags[], created_at
- Purpose: System of record for learning and application

**EvidenceItem**
- Fields: memory_entry_id, type, url_or_blob_ref, label, source_type (verifiable/user-provided), visibility
- Purpose: Makes memory proof-backed and supports proof views

### Technology Stack Recommendations

**Frontend:**
- React or Next.js for component-based UI
- Tailwind CSS for accessible, responsive design
- Consider shadcn/ui for pre-built accessible components

**Backend:**
- Node.js/Express or Python/FastAPI for API
- PostgreSQL for relational data (profiles, concepts, memory entries)
- Consider separate storage for evidence items (S3/Cloudinary for screenshots, text storage for snippets)

**AI/LLM Integration:**
- Use Claude API for learning contract generation
- Use Claude API for concept explanation generation
- Use Claude API for reflection prompt generation
- Store generated content, don't regenerate on every view

**Authentication:**
- Simple email/password or OAuth (Google/GitHub)
- No social features required initially

### Performance Considerations

#### P1: Topic Graph Pre-curation
- Concepts should be manually curated by subject matter experts
- Quality control prevents AI hallucinations in core learning content
- Graph structure allows efficient prerequisite traversal

#### P2: Memory Query Optimization
- Index memory entries by: user_id, topic_id, created_at, tags
- Evidence items should have foreign key to memory_entry_id
- Proof-backed filter should be efficient query (JOIN where evidence exists)

#### P3: Daily Plan Generation
- Generate full plan at confirmation, not day-by-day
- Allow plan regeneration on major adaptation (e.g., user switches from 15min to 45min daily)
- Cache generated content per concept to avoid repeated LLM calls

### Security & Privacy

#### S1: Data Privacy
- Memory entries are private by default
- Evidence visibility is user-controlled
- No public sharing features in v1

#### S2: Evidence Storage
- GitHub links are just URLs (no auth required)
- Screenshots/pastes stored with user_id association
- No sensitive data (passwords, keys) should be capturable as evidence

---

## Success Metrics

### Learning Consistency
- **Daily Active Usage Rate**: % of users who complete a DLU at least 5 days per week
- **Weekly Completion Rate**: % of users who complete at least 1 DLU per week over 4 weeks

### Personalization Effectiveness  
- **Learning Contract Correction Rate**: % of users who correct their generated contract (lower is better if generation is accurate)
- **Adaptation Acceptance Rate**: % of weekly adjustment suggestions accepted by users

### Memory & Proof-of-Work Adoption
- **Memory Entry Creation Rate**: % of completed DLUs that result in saved memory entries (should be 100%)
- **Evidence Capture Rate**: % of application moments that result in evidence attachment
- **Proof-backed Portfolio Growth**: Average number of proof-backed entries per user per month

### Retention & Trust
- **30-Day Retention**: % of users still active after 30 days
- **Post-Cohort Continuation**: % of users who continue using system after structured cohort ends
- **Time-to-First-Proof**: Days from signup to first proof-backed memory entry

---

## Definition of Done

### Phase 1 Complete When:
- [ ] Questionnaire implements all 8 sections with exact locked wording
- [ ] Learning contract summary generation works and connects answers → decisions
- [ ] User can confirm/correct summary before Day 1
- [ ] Confirmed profile persists and is used for plan generation

### Phase 2 Complete When:
- [ ] Daily Learning Unit follows invariant 4-part structure
- [ ] One concept per day is enforced (concept splitting supported)
- [ ] Daily session respects user's time budget
- [ ] Adaptation handles: skipped days, faster progress, repeated confusion, overwhelm
- [ ] Content format adapts to accessibility preferences (text-only, short-clips, etc.)

### Phase 3 Complete When:
- [ ] Every completed DLU creates MemoryEntry automatically
- [ ] Evidence capture is optional and low-friction (3-action prompt after application only)
- [ ] Evidence items attach to memory entries with source type labels
- [ ] Memory timeline supports filters: all, applied, proof-backed
- [ ] Topic/Skill view groups proof-backed entries
- [ ] Weekly digest generates with gentle tone and adjustment suggestion
- [ ] Proof-backed entries answer "What have I done?" with verifiable examples

### Overall v1.1 Complete When:
- [ ] All functional requirements (R1-R20) are implemented
- [ ] All non-goals are respected (no scope creep)
- [ ] Core user flows (onboarding, daily, weekly review) work end-to-end
- [ ] Data model supports all three phases cleanly
- [ ] System can be used daily by a real learner for 30+ days
- [ ] First user can show proof-backed evidence of their learning journey

---

## Open Questions for Development

1. **Topic Graph Authoring**: How will initial Docker/Kubernetes concept graphs be curated? Manual authoring? Subject matter expert collaboration?

2. **LLM Content Generation**: Which parts use real-time LLM generation vs pre-generated content? (Recommendation: pre-generate concept explanations, real-time for learning contract summary)

3. **Evidence Upload Limits**: What are size limits for screenshots? Storage strategy for artifacts?

4. **Adaptation Triggers**: Exact thresholds for detecting "repeated confusion" or "overwhelm"? (e.g., 3 wrong reflection answers = confusion, 2 skipped days = overwhelm check)

5. **Weekly Digest Timing**: Fixed day/time or personalized to user's typical learning day?

6. **Multi-Topic Support**: Can users learn multiple topics simultaneously, or one topic at a time?

---

## Appendix: Example Learning Contract Summary

Based on questionnaire answers, here's what a generated summary might look like:

```
Learning Contract Summary

Profile:
You're a Software Developer with experience in Linux CLI, Bash scripting, and Git. You want to learn Docker to improve in your current role and prepare for the next topic (likely Kubernetes). You can commit 20-30 minutes daily, about 5-10 hours per week.

Learning Approach:
- Start with concepts first, then hands-on practice (your preference)
- Increase complexity gradually, one layer at a time
- Include moderate troubleshooting practice
- Target "use confidently" mastery level

Content Format:
- Text-first learning with diagrams and mental models
- Short video clips (≤3 min) only when truly needed
- Avoid overwhelming with too many new terms at once
- Start with TL;DR, then dive into details

Daily Structure:
- 20-25 minute sessions (concept + example + reflection)
- Optional 5-10 minute application moments
- One concept per day to keep sessions finishable

When You Skip Days:
- Gentle recap (1-3 minutes) before resuming
- No automatic pace changes; I'll ask first

What We'll Track:
- Every concept you learn (automatic memory entry)
- Application moments you complete
- Evidence links (GitHub repos, code snippets) when you choose to attach them

What We'll Emphasize:
- Building strong mental models of containerization
- Understanding when and why to use specific Docker features
- Troubleshooting common Docker issues
- Hands-on practice with real configurations

What We'll Skip:
- Windows-specific Docker Desktop features (you're on Linux)
- Advanced orchestration (that's Kubernetes, your next topic)
- Theory-heavy deep dives without practical application

Is this accurate? Correct anything that doesn't match your needs.
```

---

## Version History

- **v1.0** (2025-12-20): Initial PRD draft based on Product Blueprint v1.1
- **v1.1** (Current): Added detailed functional requirements, complete data model, success metrics

---

**Next Steps:**
1. Review and approve PRD
2. Generate task list using this PRD
3. Begin Phase 1 implementation (Questionnaire & Learning Contract)
