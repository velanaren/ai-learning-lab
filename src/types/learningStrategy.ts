/**
 * Learning Strategy Types
 *
 * Defines types for learning strategy generation and daily plan assembly.
 * Transforms user profile into concrete strategy decisions.
 *
 * @module types/learningStrategy
 */

import { z } from 'zod';
import { Difficulty } from './topicGraph';

// ============================================
// Start Level
// ============================================

/**
 * Starting level for learning path
 * Derived from user's prior experience and baseline skills
 */
export enum StartLevel {
  /** Complete beginner with no prior experience */
  ABSOLUTE_BEGINNER = 'absolute-beginner',
  /** Has seen basics, needs structured learning */
  BEGINNER = 'beginner',
  /** Has built small things, needs deeper understanding */
  INTERMEDIATE = 'intermediate',
  /** Used professionally, wants mastery */
  ADVANCED = 'advanced',
}

export const startLevelSchema = z.nativeEnum(StartLevel);

// ============================================
// Phase Weighting
// ============================================

/**
 * Learning phase types
 */
export enum LearningPhase {
  /** Foundation concepts */
  FOUNDATION = 'foundation',
  /** Core practical skills */
  CORE = 'core',
  /** Advanced topics and edge cases */
  ADVANCED = 'advanced',
  /** Real-world integration and troubleshooting */
  MASTERY = 'mastery',
}

export const learningPhaseSchema = z.nativeEnum(LearningPhase);

/**
 * Phase weighting configuration
 * Determines how much emphasis to place on each learning phase
 */
export interface PhaseWeighting {
  /** Foundation phase weight (0-1) */
  foundation: number;
  /** Core phase weight (0-1) */
  core: number;
  /** Advanced phase weight (0-1) */
  advanced: number;
  /** Mastery phase weight (0-1) */
  mastery: number;
}

/**
 * Zod schema for Phase Weighting
 */
export const phaseWeightingSchema = z.object({
  foundation: z.number().min(0).max(1),
  core: z.number().min(0).max(1),
  advanced: z.number().min(0).max(1),
  mastery: z.number().min(0).max(1),
});

// ============================================
// Daily Slice Policy
// ============================================

/**
 * Daily slice policy determines how to structure daily content
 */
export enum DailySlicePolicy {
  /** Single concept, minimal example, short reflection */
  MINIMAL = 'minimal',
  /** Single concept, detailed example, reflection + optional application */
  STANDARD = 'standard',
  /** Single concept, detailed example, reflection, encouraged application */
  APPLIED = 'applied',
}

export const dailySlicePolicySchema = z.nativeEnum(DailySlicePolicy);

// ============================================
// Application Frequency
// ============================================

/**
 * Application frequency determines how often to include application moments
 */
export enum ApplicationFrequency {
  /** Rarely suggest application (user prefers read-only) */
  RARE = 'rare',
  /** Occasional application (every 3-4 concepts) */
  OCCASIONAL = 'occasional',
  /** Regular application (every 2 concepts) */
  REGULAR = 'regular',
  /** Frequent application (almost every concept) */
  FREQUENT = 'frequent',
}

export const applicationFrequencySchema = z.nativeEnum(ApplicationFrequency);

// ============================================
// Content Format Policy
// ============================================

/**
 * Content format preferences
 * Derived from Section 7 accessibility preferences
 */
export interface ContentFormatPolicy {
  /** Prefer text-first explanations */
  textFirst: boolean;
  /** Maximum video length in minutes (0 = no videos) */
  maxVideoLength: number;
  /** Include diagrams and visual aids */
  includeDiagrams: boolean;
  /** Include step-by-step checklists */
  includeChecklists: boolean;
  /** Use analogies for complex concepts */
  useAnalogies: boolean;
  /** Maximum number of new terms per concept */
  maxNewTerms: number;
  /** Include checkpoint summaries */
  includeCheckpoints: boolean;
  /** Content order preference */
  contentOrder: 'tldr-first' | 'details-first' | 'example-first';
}

/**
 * Zod schema for Content Format Policy
 */
export const contentFormatPolicySchema = z.object({
  textFirst: z.boolean(),
  maxVideoLength: z.number().min(0).max(60),
  includeDiagrams: z.boolean(),
  includeChecklists: z.boolean(),
  useAnalogies: z.boolean(),
  maxNewTerms: z.number().positive(),
  includeCheckpoints: z.boolean(),
  contentOrder: z.enum(['tldr-first', 'details-first', 'example-first']),
});

// ============================================
// Link Budget Policy
// ============================================

/**
 * Link budget policy determines how many external links to show
 */
export enum LinkBudgetPolicy {
  /** No external links (focus mode) */
  NONE = 'none',
  /** Minimal links (1-2 per concept, only essential) */
  MINIMAL = 'minimal',
  /** Standard links (3-5 per concept) */
  STANDARD = 'standard',
  /** Rich links (unlimited, show all resources) */
  RICH = 'rich',
}

export const linkBudgetPolicySchema = z.nativeEnum(LinkBudgetPolicy);

// ============================================
// Learning Strategy Entity (R6)
// ============================================

/**
 * Learning Strategy transforms user profile into concrete strategy decisions
 * Determines pace, depth, structure, and comfort defaults
 *
 * @see PRD Requirements R6.1-R6.2
 */
export interface LearningStrategy {
  /** Unique strategy identifier */
  id: string;
  /** User this strategy belongs to */
  userId: string;
  /** Starting level based on prior experience */
  startLevel: StartLevel;
  /** Weighting for different learning phases */
  phaseWeighting: PhaseWeighting;
  /** How to structure daily content */
  dailySlicePolicy: DailySlicePolicy;
  /** How often to include application moments */
  applicationFrequency: ApplicationFrequency;
  /** Content format preferences */
  contentFormatPolicy: ContentFormatPolicy;
  /** How many external links to show */
  linkBudgetPolicy: LinkBudgetPolicy;
  /** When strategy was created */
  createdAt: Date;
  /** When strategy was last updated */
  updatedAt: Date;
}

/**
 * Zod schema for Learning Strategy validation
 */
export const learningStrategySchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  startLevel: startLevelSchema,
  phaseWeighting: phaseWeightingSchema,
  dailySlicePolicy: dailySlicePolicySchema,
  applicationFrequency: applicationFrequencySchema,
  contentFormatPolicy: contentFormatPolicySchema,
  linkBudgetPolicy: linkBudgetPolicySchema,
  createdAt: z.date(),
  updatedAt: z.date(),
});

/**
 * Type for creating a new learning strategy
 */
export type CreateLearningStrategyInput = Omit<LearningStrategy, 'id' | 'createdAt' | 'updatedAt'>;

/**
 * Zod schema for creating a new learning strategy
 */
export const createLearningStrategyInputSchema = learningStrategySchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// ============================================
// Adaptation Signals (R10)
// ============================================

/**
 * Adaptation signal types
 * System detects these signals and adjusts accordingly
 *
 * @see PRD Requirement R10
 */
export enum AdaptationSignal {
  /** User skipped days */
  SKIPPED_DAYS = 'skipped-days',
  /** User progressing faster than expected */
  FAST_PROGRESS = 'fast-progress',
  /** Repeated confusion on concepts */
  REPEATED_CONFUSION = 'repeated-confusion',
  /** Low application density */
  LOW_APPLICATION = 'low-application',
  /** User showing signs of overwhelm */
  OVERWHELM = 'overwhelm',
}

export const adaptationSignalSchema = z.nativeEnum(AdaptationSignal);

/**
 * Adaptation action to take in response to signal
 */
export enum AdaptationAction {
  /** Show recap before resuming */
  SHOW_RECAP = 'show-recap',
  /** Slow down pace */
  SLOW_DOWN = 'slow-down',
  /** Speed up pace */
  SPEED_UP = 'speed-up',
  /** Unlock stretch concepts */
  UNLOCK_STRETCH = 'unlock-stretch',
  /** Present alternate explanation */
  ALTERNATE_EXPLANATION = 'alternate-explanation',
  /** Add micro-lab validation */
  ADD_MICRO_LAB = 'add-micro-lab',
  /** Increase application frequency */
  INCREASE_APPLICATION = 'increase-application',
  /** Reduce external links */
  REDUCE_LINKS = 'reduce-links',
  /** Enforce focus mode */
  ENFORCE_FOCUS_MODE = 'enforce-focus-mode',
  /** Split upcoming concepts */
  SPLIT_CONCEPTS = 'split-concepts',
  /** Ask user before adjusting */
  ASK_USER = 'ask-user',
}

export const adaptationActionSchema = z.nativeEnum(AdaptationAction);

/**
 * Adaptation recommendation
 * Generated when adaptation signal is detected
 */
export interface AdaptationRecommendation {
  /** Signal that triggered this recommendation */
  signal: AdaptationSignal;
  /** Recommended action */
  action: AdaptationAction;
  /** Explanation for user (gentle, non-judgmental) */
  explanation: string;
  /** Whether to ask user before applying */
  requiresUserConfirmation: boolean;
  /** When recommendation was generated */
  generatedAt: Date;
}

/**
 * Zod schema for Adaptation Recommendation
 */
export const adaptationRecommendationSchema = z.object({
  signal: adaptationSignalSchema,
  action: adaptationActionSchema,
  explanation: z.string().min(10),
  requiresUserConfirmation: z.boolean(),
  generatedAt: z.date(),
});

// ============================================
// Strategy Filters
// ============================================

/**
 * Filters for concept selection based on user level and goals
 */
export interface ConceptFilters {
  /** Minimum difficulty level */
  minDifficulty: Difficulty;
  /** Maximum difficulty level */
  maxDifficulty: Difficulty;
  /** Tags that must be present */
  requiredTags: string[];
  /** Tags to exclude */
  excludedTags: string[];
  /** Whether to include troubleshooting concepts */
  includeTroubleshooting: boolean;
}

/**
 * Zod schema for Concept Filters
 */
export const conceptFiltersSchema = z.object({
  minDifficulty: z.nativeEnum(Difficulty),
  maxDifficulty: z.nativeEnum(Difficulty),
  requiredTags: z.array(z.string()),
  excludedTags: z.array(z.string()),
  includeTroubleshooting: z.boolean(),
});

// ============================================
// Learning Contract Summary (R3)
// ============================================

/**
 * Learning contract summary
 * Generated from user profile and strategy
 * Explains all design decisions
 *
 * @see PRD Requirements R3.1-R3.4
 */
export interface LearningContractSummary {
  /** User profile summary */
  profileSummary: string;
  /** Learning approach explanation */
  learningApproach: string;
  /** Content format explanation */
  contentFormat: string;
  /** Daily structure explanation */
  dailyStructure: string;
  /** Skip behavior explanation */
  skipBehavior: string;
  /** What will be tracked */
  tracking: string;
  /** What will be emphasized */
  emphasis: string[];
  /** What will be skipped */
  skipped: string[];
  /** When contract was generated */
  generatedAt: Date;
}

/**
 * Zod schema for Learning Contract Summary
 */
export const learningContractSummarySchema = z.object({
  profileSummary: z.string().min(50),
  learningApproach: z.string().min(50),
  contentFormat: z.string().min(50),
  dailyStructure: z.string().min(50),
  skipBehavior: z.string().min(50),
  tracking: z.string().min(50),
  emphasis: z.array(z.string()).min(1),
  skipped: z.array(z.string()),
  generatedAt: z.date(),
});

/**
 * Learning contract confirmation
 * User confirms or corrects the contract
 */
export interface LearningContractConfirmation {
  /** Whether user confirmed the contract */
  confirmed: boolean;
  /** Corrections requested by user (if not confirmed) */
  corrections?: string;
  /** When confirmation was submitted */
  confirmedAt: Date;
}

/**
 * Zod schema for Learning Contract Confirmation
 */
export const learningContractConfirmationSchema = z.object({
  confirmed: z.boolean(),
  corrections: z.string().optional(),
  confirmedAt: z.date(),
});
