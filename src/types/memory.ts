/**
 * Memory & Proof-of-Work Types
 *
 * Defines types for the Memory system that captures learning and application.
 * Supports the proof-of-work definition and evidence-backed progress tracking.
 *
 * @module types/memory
 */

import { z } from 'zod';

// ============================================
// Evidence Types (R12.3)
// ============================================

/**
 * Types of evidence that can be attached to memory entries
 *
 * @see PRD Requirement R12.3
 */
export enum EvidenceType {
  /** GitHub repository, PR, commit, or file link */
  GITHUB = 'github',
  /** Screenshot of terminal output or pasted output */
  EXECUTION = 'execution',
  /** Code snippet, config file, or markdown notes */
  ARTIFACT = 'artifact',
  /** Demo URL, gist, diagram, or other links */
  LINK = 'link',
}

export const evidenceTypeSchema = z.nativeEnum(EvidenceType);

/**
 * Source type distinguishes verifiable vs user-provided evidence
 *
 * @see PRD Requirement R14.2
 */
export enum SourceType {
  /** Verifiable evidence (e.g., GitHub link that can be checked) */
  VERIFIABLE = 'verifiable',
  /** User-provided evidence (e.g., screenshot, pasted output) */
  USER_PROVIDED = 'user-provided',
}

export const sourceTypeSchema = z.nativeEnum(SourceType);

/**
 * Evidence visibility setting
 *
 * @see PRD Requirement R12.4-R12.5
 */
export enum EvidenceVisibility {
  /** Private to user only (default) */
  PRIVATE = 'private',
  /** Shareable with others */
  SHAREABLE = 'shareable',
}

export const evidenceVisibilitySchema = z.nativeEnum(EvidenceVisibility);

// ============================================
// Evidence Item Entity (R12, R14)
// ============================================

/**
 * Evidence Item makes memory proof-backed
 * Contains GitHub links, screenshots, artifacts, etc.
 *
 * A Memory Entry becomes "proof-backed" when at least one evidence item is attached (R14.1)
 *
 * @see PRD Requirements R12.1-R12.5, R14.1-R14.4
 */
export interface EvidenceItem {
  /** Unique evidence identifier */
  id: string;
  /** Memory entry this evidence belongs to */
  memoryEntryId: string;
  /** Type of evidence */
  type: EvidenceType;
  /** URL or reference to stored blob */
  urlOrBlobRef: string;
  /** User-friendly description of this evidence */
  label: string;
  /** Source type (verifiable or user-provided) */
  sourceType: SourceType;
  /** Visibility setting */
  visibility: EvidenceVisibility;
  /** When evidence was created */
  createdAt: Date;
  /** When evidence was last updated */
  updatedAt: Date;
}

/**
 * Zod schema for Evidence Item validation
 */
export const evidenceItemSchema = z.object({
  id: z.string().uuid(),
  memoryEntryId: z.string().uuid(),
  type: evidenceTypeSchema,
  urlOrBlobRef: z.string().min(1),
  label: z.string().min(1).max(200),
  sourceType: sourceTypeSchema,
  visibility: evidenceVisibilitySchema,
  createdAt: z.date(),
  updatedAt: z.date(),
});

/**
 * Type for creating a new evidence item
 */
export type CreateEvidenceItemInput = Omit<EvidenceItem, 'id' | 'createdAt' | 'updatedAt'>;

/**
 * Zod schema for creating a new evidence item
 */
export const createEvidenceItemInputSchema = evidenceItemSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// ============================================
// Memory Entry Entity (R11)
// ============================================

/**
 * Memory Entry is the system of record for learning and application
 * Automatically created for every completed Daily Learning Unit (R11.1)
 *
 * @see PRD Requirements R11.1-R11.3
 */
export interface MemoryEntry {
  /** Unique memory entry identifier */
  id: string;
  /** User this memory belongs to */
  userId: string;
  /** Topic being learned */
  topicId: string;
  /** Concept that was learned */
  conceptId: string;
  /** User's reflection on what changed or what's unclear */
  reflectionText: string;
  /** Optional: what the user built or applied */
  actionTaken?: string;
  /** Tags for filtering (e.g., ["docker", "containers", "beginner", "phase-1"]) */
  tags: string[];
  /** When memory was created */
  createdAt: Date;
  /** When memory was last updated */
  updatedAt: Date;
}

/**
 * Zod schema for Memory Entry validation
 */
export const memoryEntrySchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  topicId: z.string().uuid(),
  conceptId: z.string().uuid(),
  reflectionText: z.string().min(10),
  actionTaken: z.string().min(10).optional(),
  tags: z.array(z.string()),
  createdAt: z.date(),
  updatedAt: z.date(),
});

/**
 * Type for creating a new memory entry
 */
export type CreateMemoryEntryInput = Omit<MemoryEntry, 'id' | 'createdAt' | 'updatedAt'>;

/**
 * Zod schema for creating a new memory entry
 */
export const createMemoryEntryInputSchema = memoryEntrySchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// ============================================
// Memory with Evidence
// ============================================

/**
 * Memory Entry with attached evidence items
 * Used for displaying complete memory information
 */
export interface MemoryEntryWithEvidence extends MemoryEntry {
  /** Attached evidence items */
  evidenceItems: EvidenceItem[];
  /** Whether this entry is proof-backed (has at least one evidence item) */
  isProofBacked: boolean;
}

/**
 * Zod schema for Memory Entry with Evidence
 */
export const memoryEntryWithEvidenceSchema = memoryEntrySchema.extend({
  evidenceItems: z.array(evidenceItemSchema),
  isProofBacked: z.boolean(),
});

// ============================================
// Memory View Filters (R15)
// ============================================

/**
 * Memory view filter options
 *
 * @see PRD Requirement R15.1-R15.5
 */
export enum MemoryViewFilter {
  /** All memory entries (chronological) */
  ALL = 'all',
  /** Only entries where action was taken */
  APPLIED = 'applied',
  /** Only entries with evidence attached (proof-backed) */
  PROOF_BACKED = 'proof-backed',
  /** Group by topic */
  BY_TOPIC = 'by-topic',
  /** Group by skill */
  BY_SKILL = 'by-skill',
}

export const memoryViewFilterSchema = z.nativeEnum(MemoryViewFilter);

// ============================================
// Memory Timeline
// ============================================

/**
 * Memory timeline entry
 * Combines memory, concept, and topic information for display
 */
export interface MemoryTimelineEntry {
  /** Memory entry */
  memory: MemoryEntryWithEvidence;
  /** Concept title */
  conceptTitle: string;
  /** Topic name */
  topicName: string;
  /** Whether action was taken */
  hasAction: boolean;
  /** Whether entry is proof-backed */
  isProofBacked: boolean;
  /** Number of evidence items */
  evidenceCount: number;
}

/**
 * Zod schema for Memory Timeline Entry
 */
export const memoryTimelineEntrySchema = z.object({
  memory: memoryEntryWithEvidenceSchema,
  conceptTitle: z.string(),
  topicName: z.string(),
  hasAction: z.boolean(),
  isProofBacked: z.boolean(),
  evidenceCount: z.number().nonnegative(),
});

/**
 * Memory timeline view
 * Chronological list of all memory entries
 */
export interface MemoryTimeline {
  /** Timeline entries */
  entries: MemoryTimelineEntry[];
  /** Total memory entries */
  totalEntries: number;
  /** Entries with action taken */
  appliedEntries: number;
  /** Proof-backed entries */
  proofBackedEntries: number;
}

/**
 * Zod schema for Memory Timeline
 */
export const memoryTimelineSchema = z.object({
  entries: z.array(memoryTimelineEntrySchema),
  totalEntries: z.number().nonnegative(),
  appliedEntries: z.number().nonnegative(),
  proofBackedEntries: z.number().nonnegative(),
});

// ============================================
// Topic/Skill Grouped View (R15.4)
// ============================================

/**
 * Memory entries grouped by topic
 */
export interface MemoryByTopic {
  /** Topic name */
  topicName: string;
  /** Topic ID */
  topicId: string;
  /** Proof-backed entries for this topic */
  proofBackedEntries: MemoryTimelineEntry[];
  /** Total proof-backed count */
  proofBackedCount: number;
}

/**
 * Zod schema for Memory by Topic
 */
export const memoryByTopicSchema = z.object({
  topicName: z.string(),
  topicId: z.string().uuid(),
  proofBackedEntries: z.array(memoryTimelineEntrySchema),
  proofBackedCount: z.number().nonnegative(),
});

/**
 * Memory entries grouped by skill
 */
export interface MemoryBySkill {
  /** Skill name (derived from tags) */
  skillName: string;
  /** Proof-backed entries for this skill */
  proofBackedEntries: MemoryTimelineEntry[];
  /** Total proof-backed count */
  proofBackedCount: number;
}

/**
 * Zod schema for Memory by Skill
 */
export const memoryBySkillSchema = z.object({
  skillName: z.string(),
  proofBackedEntries: z.array(memoryTimelineEntrySchema),
  proofBackedCount: z.number().nonnegative(),
});

// ============================================
// Weekly Digest (R16)
// ============================================

/**
 * Adjustment suggestion types
 */
export enum AdjustmentType {
  /** Adjust learning pace */
  PACE = 'pace',
  /** Add or reduce recap frequency */
  RECAP = 'recap',
  /** Adjust concept chunk size */
  CHUNK_SIZE = 'chunk-size',
  /** Adjust application frequency */
  APPLICATION_FREQUENCY = 'application-frequency',
}

export const adjustmentTypeSchema = z.nativeEnum(AdjustmentType);

/**
 * Weekly adjustment suggestion
 *
 * @see PRD Requirement R16.3
 */
export interface AdjustmentSuggestion {
  /** Type of adjustment */
  type: AdjustmentType;
  /** Gentle, non-judgmental suggestion text */
  suggestion: string;
  /** Reasoning behind the suggestion */
  reasoning: string;
}

/**
 * Zod schema for Adjustment Suggestion
 */
export const adjustmentSuggestionSchema = z.object({
  type: adjustmentTypeSchema,
  suggestion: z.string().min(10),
  reasoning: z.string().min(10),
});

/**
 * Weekly digest summary
 *
 * @see PRD Requirements R16.1-R16.4
 */
export interface WeeklyDigest {
  /** Week start date */
  weekStart: Date;
  /** Week end date */
  weekEnd: Date;
  /** Days completed this week */
  completedDays: number;
  /** Days skipped this week */
  skippedDays: number;
  /** Concepts with action taken (count) */
  appliedConcepts: number;
  /** Concepts read only (count) */
  readOnlyConcepts: number;
  /** Example applied concepts (for display) */
  appliedConceptsExamples: string[];
  /** Proof-backed entries created this week */
  proofBackedEntriesCount: number;
  /** Suggested adjustment (gentle tone) */
  adjustmentSuggestion?: AdjustmentSuggestion;
  /** When digest was generated */
  generatedAt: Date;
}

/**
 * Zod schema for Weekly Digest
 */
export const weeklyDigestSchema = z.object({
  weekStart: z.date(),
  weekEnd: z.date(),
  completedDays: z.number().min(0).max(7),
  skippedDays: z.number().min(0).max(7),
  appliedConcepts: z.number().nonnegative(),
  readOnlyConcepts: z.number().nonnegative(),
  appliedConceptsExamples: z.array(z.string()).max(3),
  proofBackedEntriesCount: z.number().nonnegative(),
  adjustmentSuggestion: adjustmentSuggestionSchema.optional(),
  generatedAt: z.date(),
});

/**
 * User's response to weekly digest adjustment suggestion
 */
export interface AdjustmentResponse {
  /** Whether user accepted the suggestion */
  accepted: boolean;
  /** User's override preference (if rejected) */
  override?: string;
}

/**
 * Zod schema for Adjustment Response
 */
export const adjustmentResponseSchema = z.object({
  accepted: z.boolean(),
  override: z.string().optional(),
});
