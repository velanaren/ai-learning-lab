/**
 * AI Learning Lab - Type System
 *
 * Central export point for all TypeScript types and Zod schemas.
 * Provides type-safe interfaces for the entire application.
 *
 * @module types
 */

// ============================================
// User Profile Types (Section 1-8 Questionnaire)
// ============================================

export {
  // Section 1: Background & Baseline
  Role,
  BaselineSkill,
  PriorExperience,
  roleSchema,
  baselineSkillSchema,
  priorExperienceSchema,

  // Section 2: Goals & Outcomes
  Goal,
  Outcome,
  MasteryLevel,
  goalSchema,
  outcomeSchema,
  masteryLevelSchema,

  // Section 3: Learning Structure
  LearningFlow,
  ComplexityPreference,
  TroubleshootingImportance,
  learningFlowSchema,
  complexityPreferenceSchema,
  troubleshootingImportanceSchema,

  // Section 4: Platform & Tooling
  Platform,
  ToolInstallComfort,
  platformSchema,
  toolInstallComfortSchema,

  // Section 5: Time & Consistency
  DailyMinutes,
  WeeklyHours,
  PacingPreference,
  dailyMinutesSchema,
  weeklyHoursSchema,
  pacingPreferenceSchema,

  // Section 6: Learning Style & Depth
  LearningStyleHelper,
  FrustrationPreference,
  DepthPreference,
  learningStyleHelperSchema,
  frustrationPreferenceSchema,
  depthPreferenceSchema,

  // Section 7: Learning Comfort & Accessibility
  LearningFormat,
  VideoPreference,
  OverwhelmTrigger,
  SessionStyle,
  ContentOrder,
  SkipBehavior,
  UIToggle,
  learningFormatSchema,
  videoPreferenceSchema,
  overwhelmTriggerSchema,
  sessionStyleSchema,
  contentOrderSchema,
  skipBehaviorSchema,
  uiToggleSchema,
  type ComfortPreferences,
  comfortPreferencesSchema,

  // Section 8: Application & Proof-of-Work
  ApplicationComfort,
  TrackingPreference,
  EvidenceImportance,
  applicationComfortSchema,
  trackingPreferenceSchema,
  evidenceImportanceSchema,

  // Complete User Profile
  type UserProfile,
  userProfileSchema,
  type CreateUserProfileInput,
  createUserProfileInputSchema,
  type UpdateUserProfileInput,
  updateUserProfileInputSchema,
} from './userProfile';

// ============================================
// Topic Graph Types
// ============================================

export {
  // Difficulty
  Difficulty,
  difficultySchema,

  // Topic
  type Topic,
  topicSchema,
  type CreateTopicInput,
  createTopicInputSchema,

  // Concept
  type Concept,
  conceptSchema,
  type CreateConceptInput,
  createConceptInputSchema,

  // Daily Learning Unit
  DLUPartType,
  dluPartTypeSchema,
  type DailyLearningUnit,
  dailyLearningUnitSchema,

  // Daily Plan
  type DailyPlan,
  dailyPlanSchema,
  type CreateDailyPlanInput,
  createDailyPlanInputSchema,

  // Topic Graph
  type TopicGraph,
  topicGraphSchema,

  // Utility Types
  type ConceptWithProgress,
  conceptWithProgressSchema,
  type DailyPlanProgress,
  dailyPlanProgressSchema,
} from './topicGraph';

// ============================================
// Memory & Proof-of-Work Types
// ============================================

export {
  // Evidence Types
  EvidenceType,
  SourceType,
  EvidenceVisibility,
  evidenceTypeSchema,
  sourceTypeSchema,
  evidenceVisibilitySchema,

  // Evidence Item
  type EvidenceItem,
  evidenceItemSchema,
  type CreateEvidenceItemInput,
  createEvidenceItemInputSchema,

  // Memory Entry
  type MemoryEntry,
  memoryEntrySchema,
  type CreateMemoryEntryInput,
  createMemoryEntryInputSchema,

  // Memory with Evidence
  type MemoryEntryWithEvidence,
  memoryEntryWithEvidenceSchema,

  // Memory Views
  MemoryViewFilter,
  memoryViewFilterSchema,
  type MemoryTimelineEntry,
  memoryTimelineEntrySchema,
  type MemoryTimeline,
  memoryTimelineSchema,

  // Grouped Views
  type MemoryByTopic,
  memoryByTopicSchema,
  type MemoryBySkill,
  memoryBySkillSchema,

  // Weekly Digest
  AdjustmentType,
  adjustmentTypeSchema,
  type AdjustmentSuggestion,
  adjustmentSuggestionSchema,
  type WeeklyDigest,
  weeklyDigestSchema,
  type AdjustmentResponse,
  adjustmentResponseSchema,
} from './memory';

// ============================================
// Learning Strategy Types
// ============================================

export {
  // Start Level
  StartLevel,
  startLevelSchema,

  // Learning Phases
  LearningPhase,
  learningPhaseSchema,
  type PhaseWeighting,
  phaseWeightingSchema,

  // Policies
  DailySlicePolicy,
  dailySlicePolicySchema,
  ApplicationFrequency,
  applicationFrequencySchema,
  type ContentFormatPolicy,
  contentFormatPolicySchema,
  LinkBudgetPolicy,
  linkBudgetPolicySchema,

  // Learning Strategy
  type LearningStrategy,
  learningStrategySchema,
  type CreateLearningStrategyInput,
  createLearningStrategyInputSchema,

  // Adaptation
  AdaptationSignal,
  adaptationSignalSchema,
  AdaptationAction,
  adaptationActionSchema,
  type AdaptationRecommendation,
  adaptationRecommendationSchema,

  // Filters
  type ConceptFilters,
  conceptFiltersSchema,

  // Learning Contract
  type LearningContractSummary,
  learningContractSummarySchema,
  type LearningContractConfirmation,
  learningContractConfirmationSchema,
} from './learningStrategy';
