/**
 * Topic Graph Types
 *
 * Defines types for the curated concept library, topics, and daily learning plans.
 * These types support the "one concept per day" constraint and prerequisite sequencing.
 *
 * @module types/topicGraph
 */

import { z } from 'zod';

// ============================================
// Difficulty Levels
// ============================================

/**
 * Concept difficulty levels
 */
export enum Difficulty {
  BEGINNER = 'beginner',
  INTERMEDIATE = 'intermediate',
  ADVANCED = 'advanced',
}

export const difficultySchema = z.nativeEnum(Difficulty);

// ============================================
// Topic Entity (R5.1)
// ============================================

/**
 * Topic represents a technical subject area (e.g., Docker, Kubernetes)
 * Contains curated concepts organized by prerequisites and difficulty
 *
 * @see PRD Requirement R5.1
 */
export interface Topic {
  /** Unique topic identifier */
  id: string;
  /** Topic name (e.g., "Docker", "Kubernetes") */
  name: string;
  /** Detailed description of what this topic covers */
  description: string;
  /** Tags for categorization and filtering */
  tags: string[];
  /** When topic was created */
  createdAt: Date;
  /** When topic was last updated */
  updatedAt: Date;
}

/**
 * Zod schema for Topic validation
 */
export const topicSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(100),
  description: z.string().min(10).max(1000),
  tags: z.array(z.string()),
  createdAt: z.date(),
  updatedAt: z.date(),
});

/**
 * Type for creating a new topic
 */
export type CreateTopicInput = Omit<Topic, 'id' | 'createdAt' | 'updatedAt'>;

/**
 * Zod schema for creating a new topic
 */
export const createTopicInputSchema = topicSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// ============================================
// Concept Entity (R5.2)
// ============================================

/**
 * Concept represents a single learning unit
 * Enforces "one concept per day" rule (R7.3, R8.1)
 *
 * Each concept includes:
 * - Prerequisites (concept IDs)
 * - Difficulty level
 * - "Why it matters" statement
 * - Common confusions
 * - Minimal example template
 * - Optional application template
 *
 * @see PRD Requirements R5.2, R7.3, R8.1
 */
export interface Concept {
  /** Unique concept identifier */
  id: string;
  /** Topic this concept belongs to */
  topicId: string;
  /** Concept title (clear, single idea) */
  title: string;
  /** Array of prerequisite concept IDs that must be completed first */
  prereqIds: string[];
  /** Difficulty level */
  difficulty: Difficulty;
  /** Single sentence explaining why this concept matters */
  whyItMatters: string;
  /** 1-2 common misconceptions or confusions about this concept */
  commonConfusions: string[];
  /** Minimal hands-on example (5 min) */
  exampleTemplate: string;
  /** Optional application task template (5-10 min) */
  applicationTemplate: string;
  /** When concept was created */
  createdAt: Date;
  /** When concept was last updated */
  updatedAt: Date;
}

/**
 * Zod schema for Concept validation
 */
export const conceptSchema = z.object({
  id: z.string().uuid(),
  topicId: z.string().uuid(),
  title: z.string().min(5).max(200),
  prereqIds: z.array(z.string().uuid()),
  difficulty: difficultySchema,
  whyItMatters: z.string().min(10).max(300),
  commonConfusions: z.array(z.string()).min(0).max(2),
  exampleTemplate: z.string().min(50),
  applicationTemplate: z.string().min(50),
  createdAt: z.date(),
  updatedAt: z.date(),
});

/**
 * Type for creating a new concept
 */
export type CreateConceptInput = Omit<Concept, 'id' | 'createdAt' | 'updatedAt'>;

/**
 * Zod schema for creating a new concept
 */
export const createConceptInputSchema = conceptSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// ============================================
// Daily Learning Unit (DLU) Structure (R7.2, R8)
// ============================================

/**
 * Daily Learning Unit part types
 * Enforces the invariant 4-part structure (R7.2)
 */
export enum DLUPartType {
  /** Concept explanation (5-7 min) - "why it matters" + short explanation */
  CONCEPT = 'concept',
  /** Concrete example (5 min) - minimal hands-on example */
  EXAMPLE = 'example',
  /** Reflection (2-3 min) - 1-2 prompts */
  REFLECTION = 'reflection',
  /** Application (5-10 min) - optional, always skippable */
  APPLICATION = 'application',
}

export const dluPartTypeSchema = z.nativeEnum(DLUPartType);

/**
 * Daily Learning Unit (DLU)
 * Represents a single day's learning session
 *
 * Structure (invariant):
 * 1. Concept (5-7 min)
 * 2. Concrete Example (5 min)
 * 3. Reflection (2-3 min)
 * 4. Application (5-10 min, optional)
 *
 * @see PRD Requirements R7.2, R8.1-R8.6, R9.1-R9.6
 */
export interface DailyLearningUnit {
  /** Concept being taught (one concept per DLU) */
  concept: Concept;
  /** Generated concept explanation (stored to avoid repeated LLM calls) */
  conceptExplanation: string;
  /** Concrete example content */
  concreteExample: string;
  /** Reflection prompts (1-2 prompts) */
  reflectionPrompts: string[];
  /** Application moment (optional, always skippable) */
  applicationMoment?: string;
  /** Estimated time in minutes for this DLU */
  estimatedMinutes: number;
}

/**
 * Zod schema for Daily Learning Unit validation
 */
export const dailyLearningUnitSchema = z.object({
  concept: conceptSchema,
  conceptExplanation: z.string().min(100),
  concreteExample: z.string().min(50),
  reflectionPrompts: z.array(z.string()).min(1).max(2),
  applicationMoment: z.string().min(50).optional(),
  estimatedMinutes: z.number().min(10).max(60),
});

// ============================================
// Daily Plan Entity (R7.1)
// ============================================

/**
 * Daily Plan stores the upcoming daily schedule for a user
 * Generated at learning contract confirmation
 * Contains ordered sequence of concept IDs
 *
 * @see PRD Requirement R7.1
 */
export interface DailyPlan {
  /** Unique plan identifier */
  id: string;
  /** User this plan belongs to */
  userId: string;
  /** Topic being learned */
  topicId: string;
  /** When this plan was generated */
  generatedAt: Date;
  /** Ordered array of concept IDs representing the learning path */
  conceptSequence: string[];
  /** When plan was created */
  createdAt: Date;
  /** When plan was last updated */
  updatedAt: Date;
}

/**
 * Zod schema for Daily Plan validation
 */
export const dailyPlanSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  topicId: z.string().uuid(),
  generatedAt: z.date(),
  conceptSequence: z.array(z.string().uuid()).min(1),
  createdAt: z.date(),
  updatedAt: z.date(),
});

/**
 * Type for creating a new daily plan
 */
export type CreateDailyPlanInput = Omit<DailyPlan, 'id' | 'createdAt' | 'updatedAt'>;

/**
 * Zod schema for creating a new daily plan
 */
export const createDailyPlanInputSchema = dailyPlanSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// ============================================
// Topic Graph Structure
// ============================================

/**
 * Topic Graph represents the complete curated concept library for a topic
 * Includes all concepts with their prerequisites and difficulty levels
 * Supports prerequisite-based sequencing
 *
 * @see PRD Requirement R5.1-R5.3, Performance Consideration P1
 */
export interface TopicGraph {
  /** Topic metadata */
  topic: Topic;
  /** All concepts in this topic */
  concepts: Concept[];
  /** Total number of concepts */
  totalConcepts: number;
  /** Concepts grouped by difficulty */
  conceptsByDifficulty: {
    beginner: Concept[];
    intermediate: Concept[];
    advanced: Concept[];
  };
}

/**
 * Zod schema for Topic Graph validation
 */
export const topicGraphSchema = z.object({
  topic: topicSchema,
  concepts: z.array(conceptSchema).min(1),
  totalConcepts: z.number().positive(),
  conceptsByDifficulty: z.object({
    beginner: z.array(conceptSchema),
    intermediate: z.array(conceptSchema),
    advanced: z.array(conceptSchema),
  }),
});

// ============================================
// Utility Types
// ============================================

/**
 * Concept with progress tracking
 * Used to track which concepts have been completed
 */
export interface ConceptWithProgress extends Concept {
  /** Whether this concept has been completed */
  completed: boolean;
  /** When this concept was completed (if completed) */
  completedAt?: Date;
  /** Whether prerequisites are satisfied */
  prerequisitesSatisfied: boolean;
}

/**
 * Zod schema for Concept with Progress
 */
export const conceptWithProgressSchema = conceptSchema.extend({
  completed: z.boolean(),
  completedAt: z.date().optional(),
  prerequisitesSatisfied: z.boolean(),
});

/**
 * Daily plan progress summary
 */
export interface DailyPlanProgress {
  /** Daily plan */
  plan: DailyPlan;
  /** Total concepts in plan */
  totalConcepts: number;
  /** Concepts completed */
  completedConcepts: number;
  /** Current concept index (0-based) */
  currentConceptIndex: number;
  /** Current concept */
  currentConcept?: Concept;
  /** Progress percentage (0-100) */
  progressPercentage: number;
}

/**
 * Zod schema for Daily Plan Progress
 */
export const dailyPlanProgressSchema = z.object({
  plan: dailyPlanSchema,
  totalConcepts: z.number().nonnegative(),
  completedConcepts: z.number().nonnegative(),
  currentConceptIndex: z.number().nonnegative(),
  currentConcept: conceptSchema.optional(),
  progressPercentage: z.number().min(0).max(100),
});
