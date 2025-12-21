-- AI Learning Lab Database Schema
-- Generated from Prisma schema.prisma
-- PostgreSQL Database

-- ============================================
-- Core Entity Tables
-- ============================================

-- UserProfile - Stores confirmed learning contract inputs from questionnaire
CREATE TABLE "UserProfile" (
    "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Section 1 - Background & Baseline
    "role" TEXT NOT NULL,
    "baselineSkills" TEXT[] NOT NULL DEFAULT '{}',
    "priorExperience" TEXT NOT NULL,

    -- Section 2 - Goals & Outcomes
    "goals" TEXT[] NOT NULL DEFAULT '{}',
    "outcomes" TEXT[] NOT NULL DEFAULT '{}',
    "masteryLevel" TEXT NOT NULL,

    -- Section 3 - Learning Structure
    "learningFlow" TEXT NOT NULL,
    "complexityPref" TEXT NOT NULL,
    "troubleshooting" TEXT NOT NULL,

    -- Section 4 - Platform & Tooling
    "platform" TEXT NOT NULL,
    "toolInstallComfort" TEXT NOT NULL,

    -- Section 5 - Time & Consistency
    "dailyMinutes" INTEGER NOT NULL,
    "weeklyHours" INTEGER NOT NULL,
    "pacingPref" TEXT NOT NULL,

    -- Section 6 - Learning Style & Depth
    "learningStyle" TEXT[] NOT NULL DEFAULT '{}',
    "frustrationPref" TEXT NOT NULL,
    "depthPref" TEXT NOT NULL,

    -- Section 7 - Learning Comfort & Accessibility
    "comfortPrefs" JSONB NOT NULL, -- {text_first, video_limit, overload_triggers, focus_mode, ui_toggles}

    -- Section 8 - Application & Proof-of-Work
    "applicationPref" TEXT NOT NULL,
    "trackingPref" TEXT NOT NULL,
    "evidencePref" TEXT NOT NULL,

    -- Metadata
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);

CREATE INDEX "UserProfile_createdAt_idx" ON "UserProfile"("createdAt");

-- LearningStrategy - Derived decisions used to assemble daily plans
CREATE TABLE "LearningStrategy" (
    "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
    "userId" TEXT NOT NULL UNIQUE,

    -- Strategy fields
    "startLevel" TEXT NOT NULL,
    "phaseWeighting" JSONB NOT NULL, -- Weighting for different learning phases
    "dailySlicePolicy" TEXT NOT NULL, -- How to structure daily content
    "applicationFrequency" TEXT NOT NULL, -- How often to include application moments
    "contentFormatPolicy" JSONB NOT NULL, -- Format preferences (text, video, diagrams)
    "linkBudgetPolicy" TEXT NOT NULL, -- How many external links to show

    -- Metadata
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    -- Foreign Keys
    CONSTRAINT "LearningStrategy_userId_fkey" FOREIGN KEY ("userId") REFERENCES "UserProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX "LearningStrategy_userId_idx" ON "LearningStrategy"("userId");

-- Topic - Allows multiple technical topics in system
CREATE TABLE "Topic" (
    "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL UNIQUE,
    "description" TEXT NOT NULL,
    "tags" TEXT[] NOT NULL DEFAULT '{}',

    -- Metadata
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);

CREATE INDEX "Topic_name_idx" ON "Topic"("name");

-- Concept - Single concept node for sequencing and daily slicing
CREATE TABLE "Concept" (
    "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
    "topicId" TEXT NOT NULL,

    -- Concept fields
    "title" TEXT NOT NULL,
    "prereqIds" TEXT[] NOT NULL DEFAULT '{}', -- Array of concept IDs that are prerequisites
    "difficulty" TEXT NOT NULL, -- e.g., "beginner", "intermediate", "advanced"
    "whyItMatters" TEXT NOT NULL, -- Single sentence explaining importance
    "commonConfusions" TEXT[] NOT NULL DEFAULT '{}', -- 1-2 common misconceptions or confusions
    "exampleTemplate" TEXT NOT NULL, -- Minimal hands-on example
    "applicationTemplate" TEXT NOT NULL, -- Optional application task template

    -- Metadata
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    -- Foreign Keys
    CONSTRAINT "Concept_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "Topic"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX "Concept_topicId_idx" ON "Concept"("topicId");
CREATE INDEX "Concept_difficulty_idx" ON "Concept"("difficulty");

-- DailyPlan - Stores upcoming daily schedule for a user
CREATE TABLE "DailyPlan" (
    "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
    "userId" TEXT NOT NULL,
    "topicId" TEXT NOT NULL,

    -- Plan fields
    "generatedAt" TIMESTAMP(3) NOT NULL,
    "conceptSequence" TEXT[] NOT NULL DEFAULT '{}', -- Ordered array of concept IDs

    -- Metadata
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    -- Foreign Keys
    CONSTRAINT "DailyPlan_userId_fkey" FOREIGN KEY ("userId") REFERENCES "UserProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "DailyPlan_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "Topic"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX "DailyPlan_userId_idx" ON "DailyPlan"("userId");
CREATE INDEX "DailyPlan_topicId_idx" ON "DailyPlan"("topicId");
CREATE INDEX "DailyPlan_generatedAt_idx" ON "DailyPlan"("generatedAt");

-- MemoryEntry - System of record for learning and application
CREATE TABLE "MemoryEntry" (
    "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
    "userId" TEXT NOT NULL,
    "topicId" TEXT NOT NULL,
    "conceptId" TEXT NOT NULL,

    -- Memory fields
    "reflectionText" TEXT NOT NULL, -- User's reflection on what changed/unclear
    "actionTaken" TEXT, -- Optional: what the user built/applied
    "tags" TEXT[] NOT NULL DEFAULT '{}', -- e.g., ["docker", "containers", "beginner", "phase-1"]

    -- Metadata
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    -- Foreign Keys
    CONSTRAINT "MemoryEntry_userId_fkey" FOREIGN KEY ("userId") REFERENCES "UserProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "MemoryEntry_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "Topic"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "MemoryEntry_conceptId_fkey" FOREIGN KEY ("conceptId") REFERENCES "Concept"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX "MemoryEntry_userId_idx" ON "MemoryEntry"("userId");
CREATE INDEX "MemoryEntry_topicId_idx" ON "MemoryEntry"("topicId");
CREATE INDEX "MemoryEntry_conceptId_idx" ON "MemoryEntry"("conceptId");
CREATE INDEX "MemoryEntry_createdAt_idx" ON "MemoryEntry"("createdAt");
CREATE INDEX "MemoryEntry_tags_idx" ON "MemoryEntry" USING GIN("tags");

-- EvidenceItem - Makes memory proof-backed and supports proof views
CREATE TABLE "EvidenceItem" (
    "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
    "memoryEntryId" TEXT NOT NULL,

    -- Evidence fields
    "type" TEXT NOT NULL, -- e.g., "github", "execution", "artifact", "link"
    "urlOrBlobRef" TEXT NOT NULL, -- URL or reference to stored blob
    "label" TEXT NOT NULL, -- User-friendly description
    "sourceType" TEXT NOT NULL, -- "verifiable" (GitHub link) or "user-provided" (screenshot/paste)
    "visibility" TEXT NOT NULL DEFAULT 'private', -- "private" or "shareable"

    -- Metadata
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    -- Foreign Keys
    CONSTRAINT "EvidenceItem_memoryEntryId_fkey" FOREIGN KEY ("memoryEntryId") REFERENCES "MemoryEntry"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX "EvidenceItem_memoryEntryId_idx" ON "EvidenceItem"("memoryEntryId");
CREATE INDEX "EvidenceItem_type_idx" ON "EvidenceItem"("type");
CREATE INDEX "EvidenceItem_sourceType_idx" ON "EvidenceItem"("sourceType");

-- ============================================
-- Comments for Schema Understanding
-- ============================================

COMMENT ON TABLE "UserProfile" IS 'Stores confirmed learning contract inputs from 8-section questionnaire';
COMMENT ON TABLE "LearningStrategy" IS 'Derived decisions used to assemble daily learning plans based on user profile';
COMMENT ON TABLE "Topic" IS 'Allows multiple technical topics (e.g., Docker, Kubernetes) in the system';
COMMENT ON TABLE "Concept" IS 'Single concept node for sequencing and daily slicing - enforces "one concept per day" rule';
COMMENT ON TABLE "DailyPlan" IS 'Stores upcoming daily schedule as ordered sequence of concept IDs';
COMMENT ON TABLE "MemoryEntry" IS 'System of record for learning and application - automatically created for each completed DLU';
COMMENT ON TABLE "EvidenceItem" IS 'Makes memory proof-backed - contains GitHub links, screenshots, artifacts, etc.';

COMMENT ON COLUMN "UserProfile"."comfortPrefs" IS 'JSON object containing text_first, video_limit, overload_triggers, focus_mode, ui_toggles';
COMMENT ON COLUMN "LearningStrategy"."phaseWeighting" IS 'JSON object with weighting for different learning phases';
COMMENT ON COLUMN "LearningStrategy"."contentFormatPolicy" IS 'JSON object defining format preferences (text, video, diagrams)';
COMMENT ON COLUMN "Concept"."prereqIds" IS 'Array of concept IDs that must be completed before this concept';
COMMENT ON COLUMN "DailyPlan"."conceptSequence" IS 'Ordered array of concept IDs representing the daily learning path';
COMMENT ON COLUMN "MemoryEntry"."tags" IS 'Tags for filtering: topic name, skill, difficulty level, phase';
COMMENT ON COLUMN "EvidenceItem"."sourceType" IS 'Distinguishes verifiable evidence (GitHub) from user-provided (screenshots)';
