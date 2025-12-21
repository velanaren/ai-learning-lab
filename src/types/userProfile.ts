/**
 * User Profile Types
 *
 * Defines types for the 8-section onboarding questionnaire and user profile data.
 * These types match the locked questionnaire structure from PRD R2.1-R2.27.
 *
 * @module types/userProfile
 */

import { z } from 'zod';

// ============================================
// Section 1: Background & Baseline (R2.1-R2.3)
// ============================================

/**
 * User's current role
 */
export enum Role {
  APPLICATION_SUPPORT = 'Application Support Engineer',
  SOFTWARE_DEVELOPER = 'Software Developer',
  DEVOPS_SRE = 'DevOps-SRE',
  STUDENT = 'Student',
  OTHER = 'Other',
}

/**
 * Skills user is already comfortable with (multi-select)
 */
export enum BaselineSkill {
  LINUX_CLI = 'Linux CLI',
  BASH_SCRIPTING = 'Bash scripting',
  PYTHON = 'Python',
  GIT = 'Git',
  DEBUGGING_PROD = 'Debugging prod issues',
  NONE = 'None',
}

/**
 * Prior experience with chosen topic
 */
export enum PriorExperience {
  NEVER = 'Never',
  USED_BASICS = 'Used basics',
  BUILT_SMALL_THINGS = 'Built small things',
  USED_IN_CI_CD = 'Used in CI-CD',
  USED_PROFESSIONALLY = 'Used professionally',
}

export const roleSchema = z.nativeEnum(Role);
export const baselineSkillSchema = z.nativeEnum(BaselineSkill);
export const priorExperienceSchema = z.nativeEnum(PriorExperience);

// ============================================
// Section 2: Goals & Outcomes (R2.4-R2.6)
// ============================================

/**
 * Why learning this topic now (pick up to 2)
 */
export enum Goal {
  CAREER_TRANSITION = 'Career transition',
  IMPROVE_CURRENT_ROLE = 'Improve current role',
  PREPARE_NEXT_TOPIC = 'Prepare for next topic',
  FUNDAMENTALS = 'Fundamentals',
  INTERVIEW_PREP = 'Interview prep',
}

/**
 * Which outcomes matter most (multi-select)
 */
export enum Outcome {
  BUILD_REAL_APPS = 'Build real apps',
  USE_IN_CI_CD = 'Use in CI-CD',
  UNDERSTAND_INTERNALS = 'Understand internals',
  TROUBLESHOOT = 'Troubleshoot',
  INTERVIEW_READY = 'Interview-ready',
}

/**
 * Mastery level goal
 */
export enum MasteryLevel {
  USE_CONFIDENTLY = 'use confidently',
  DEVOPS_GRADE_MASTERY = 'devops-grade mastery',
}

export const goalSchema = z.nativeEnum(Goal);
export const outcomeSchema = z.nativeEnum(Outcome);
export const masteryLevelSchema = z.nativeEnum(MasteryLevel);

// ============================================
// Section 3: Learning Structure (R2.7-R2.9)
// ============================================

/**
 * Preferred learning flow
 */
export enum LearningFlow {
  CONCEPTS_FIRST = 'concepts-first',
  BUILD_FIRST = 'build-first',
  MIX = 'mix',
}

/**
 * How complexity should increase
 */
export enum ComplexityPreference {
  GRADUALLY_ONE_LAYER = 'gradually one layer',
  THROUGH_REALISTIC_PROJECTS = 'through realistic projects',
}

/**
 * Importance of troubleshooting practice
 */
export enum TroubleshootingImportance {
  LOW = 'low',
  SOME = 'some',
  VERY_IMPORTANT = 'very important',
}

export const learningFlowSchema = z.nativeEnum(LearningFlow);
export const complexityPreferenceSchema = z.nativeEnum(ComplexityPreference);
export const troubleshootingImportanceSchema = z.nativeEnum(TroubleshootingImportance);

// ============================================
// Section 4: Platform & Tooling (R2.10-R2.11)
// ============================================

/**
 * System that will be used for learning
 */
export enum Platform {
  MACOS_INTEL = 'macOS Intel',
  MACOS_APPLE_SILICON = 'macOS Apple Silicon',
  LINUX = 'Linux',
  WINDOWS_WSL = 'Windows WSL',
}

/**
 * Comfort with local tool installation
 */
export enum ToolInstallComfort {
  YES = 'yes',
  PREFER_MINIMAL_SETUP = 'prefer minimal setup',
  PREFER_CLOUD = 'prefer cloud',
}

export const platformSchema = z.nativeEnum(Platform);
export const toolInstallComfortSchema = z.nativeEnum(ToolInstallComfort);

// ============================================
// Section 5: Time & Consistency (R2.12-R2.14)
// ============================================

/**
 * Realistic daily time commitment (in minutes)
 */
export enum DailyMinutes {
  TEN_TO_FIFTEEN = 10,
  TWENTY_TO_THIRTY = 20,
  FORTY_FIVE_TO_SIXTY = 45,
}

/**
 * Total weekly time commitment (in hours)
 */
export enum WeeklyHours {
  LESS_THAN_FIVE = 5,
  FIVE_TO_TEN = 5,
  TEN_PLUS = 10,
}

/**
 * Preferred behavior when missing days
 */
export enum PacingPreference {
  RECAP_CONTINUE = 'recap+continue',
  SLOW_DOWN_AUTOMATICALLY = 'slow down automatically',
  ASK_BEFORE_ADJUSTING = 'ask before adjusting',
}

export const dailyMinutesSchema = z.nativeEnum(DailyMinutes);
export const weeklyHoursSchema = z.nativeEnum(WeeklyHours);
export const pacingPreferenceSchema = z.nativeEnum(PacingPreference);

// ============================================
// Section 6: Learning Style & Depth (R2.15-R2.17)
// ============================================

/**
 * What helps understand complex systems (multi-select)
 */
export enum LearningStyleHelper {
  ANALOGIES = 'analogies',
  STEP_BY_STEP_LABS = 'step-by-step labs',
  VISUALS = 'visuals',
  ALL = 'all',
}

/**
 * What frustrates more
 */
export enum FrustrationPreference {
  OVERSIMPLIFIED_EXPLANATIONS = 'oversimplified explanations',
  TOO_MUCH_THEORY_WITHOUT_PRACTICE = 'too much theory without practice',
}

/**
 * Depth preference
 */
export enum DepthPreference {
  KEEP_IT_SIMPLE_FIRST = 'keep it simple first',
  NEVER_COMPROMISE_ON_ACCURACY = 'never compromise on accuracy',
}

export const learningStyleHelperSchema = z.nativeEnum(LearningStyleHelper);
export const frustrationPreferenceSchema = z.nativeEnum(FrustrationPreference);
export const depthPreferenceSchema = z.nativeEnum(DepthPreference);

// ============================================
// Section 7: Learning Comfort & Accessibility (R2.18-R2.24)
// ============================================

/**
 * Best learning format (pick up to 2)
 */
export enum LearningFormat {
  TEXT_FIRST = 'text-first',
  STEP_BY_STEP_LABS = 'step-by-step labs',
  DIAGRAMS_MENTAL_MODELS = 'diagrams/mental models',
  SHORT_CLIPS_3MIN = 'short clips ≤3 min',
  NO_VIDEOS_TEXT_ONLY = 'no videos—text only',
}

/**
 * Audio/video preference
 */
export enum VideoPreference {
  AVOID_AUDIO_VIDEO = 'avoid audio-video',
  SHORT_CLIPS_ONLY = 'short clips only',
  FIVE_TO_TEN_MIN_OCCASIONALLY = '5–10 min occasionally',
  LONGER_VIDEOS_OK = 'longer videos ok',
}

/**
 * What overwhelms most (pick up to 2)
 */
export enum OverwhelmTrigger {
  TOO_MANY_NEW_TERMS = 'too many new terms',
  LONG_EXPLANATIONS_WITHOUT_CHECKPOINTS = 'long explanations without checkpoints',
  TOO_MANY_LINKS = 'too many links',
  TOO_MUCH_UI = 'too much UI',
  SETUP_FRICTION = 'setup friction',
}

/**
 * Preferred daily session style
 */
export enum SessionStyle {
  ONE_CONCEPT_PER_DAY = 'one concept per day',
  ONE_CONCEPT_PLUS_SMALL_APPLICATION = 'one concept + small application',
  PROJECT_FLOW = 'project flow',
}

/**
 * Content order preference
 */
export enum ContentOrder {
  TLDR_THEN_DETAILS = 'TL;DR → details',
  DETAILS_THEN_SUMMARY = 'details → summary',
  EXAMPLE_THEN_EXPLANATION = 'example → explanation',
}

/**
 * Skip behavior preference
 */
export enum SkipBehavior {
  GENTLE_RECAP = 'gentle recap',
  SIMPLIFIED_RESTART = 'simplified restart',
  ASK_BEFORE_CHANGING_PACE = 'ask before changing pace',
}

/**
 * UI comfort toggles (multi-select)
 */
export enum UIToggle {
  FOCUS_MODE = 'Focus Mode',
  REDUCED_MOTION = 'Reduced motion',
  LARGER_TEXT = 'Larger text',
  HIGH_CONTRAST_DARK_MODE = 'High contrast/dark mode',
}

export const learningFormatSchema = z.nativeEnum(LearningFormat);
export const videoPreferenceSchema = z.nativeEnum(VideoPreference);
export const overwhelmTriggerSchema = z.nativeEnum(OverwhelmTrigger);
export const sessionStyleSchema = z.nativeEnum(SessionStyle);
export const contentOrderSchema = z.nativeEnum(ContentOrder);
export const skipBehaviorSchema = z.nativeEnum(SkipBehavior);
export const uiToggleSchema = z.nativeEnum(UIToggle);

/**
 * Comfort preferences object for Section 7
 */
export interface ComfortPreferences {
  /** Best learning formats (up to 2) */
  learningFormats: LearningFormat[];
  /** Audio/video preference */
  videoPreference: VideoPreference;
  /** What overwhelms most (up to 2) */
  overwhelmTriggers: OverwhelmTrigger[];
  /** Preferred daily session style */
  sessionStyle: SessionStyle;
  /** Content order preference */
  contentOrder: ContentOrder;
  /** Skip behavior preference */
  skipBehavior: SkipBehavior;
  /** UI comfort toggles */
  uiToggles: UIToggle[];
}

export const comfortPreferencesSchema = z.object({
  learningFormats: z.array(learningFormatSchema).min(1).max(2),
  videoPreference: videoPreferenceSchema,
  overwhelmTriggers: z.array(overwhelmTriggerSchema).min(1).max(2),
  sessionStyle: sessionStyleSchema,
  contentOrder: contentOrderSchema,
  skipBehavior: skipBehaviorSchema,
  uiToggles: z.array(uiToggleSchema),
});

// ============================================
// Section 8: Application & Proof-of-Work (R2.25-R2.27)
// ============================================

/**
 * Application comfort level (multi-select)
 */
export enum ApplicationComfort {
  CODE_CONFIG_SNIPPETS = 'code/config snippets',
  RUNNING_COMMANDS = 'running commands',
  LINKING_GITHUB = 'linking GitHub',
  WRITING_SHORT_REFLECTIONS = 'writing short reflections',
}

/**
 * What system should track
 */
export enum TrackingPreference {
  LEARNING_ONLY = 'learning only',
  LEARNING_PLUS_SMALL_APPLICATIONS = 'learning + small applications',
  LEARNING_PLUS_APPLICATIONS_PLUS_EVIDENCE = 'learning + applications + evidence links',
}

/**
 * Importance of proof-of-work
 */
export enum EvidenceImportance {
  NICE_TO_HAVE = 'nice-to-have',
  IMPORTANT = 'important',
  VERY_IMPORTANT = 'very important',
}

export const applicationComfortSchema = z.nativeEnum(ApplicationComfort);
export const trackingPreferenceSchema = z.nativeEnum(TrackingPreference);
export const evidenceImportanceSchema = z.nativeEnum(EvidenceImportance);

// ============================================
// Complete User Profile Interface
// ============================================

/**
 * Complete user profile from 8-section questionnaire
 * Maps to UserProfile entity in database
 *
 * @see PRD Requirements R2.1-R2.27
 */
export interface UserProfile {
  /** Unique user identifier */
  id: string;

  // Section 1: Background & Baseline
  /** User's current role */
  role: Role;
  /** Skills user is already comfortable with */
  baselineSkills: BaselineSkill[];
  /** Prior experience with chosen topic */
  priorExperience: PriorExperience;

  // Section 2: Goals & Outcomes
  /** Why learning this topic now (up to 2) */
  goals: Goal[];
  /** Which outcomes matter most */
  outcomes: Outcome[];
  /** Mastery level goal */
  masteryLevel: MasteryLevel;

  // Section 3: Learning Structure
  /** Preferred learning flow */
  learningFlow: LearningFlow;
  /** How complexity should increase */
  complexityPref: ComplexityPreference;
  /** Importance of troubleshooting practice */
  troubleshooting: TroubleshootingImportance;

  // Section 4: Platform & Tooling
  /** System that will be used */
  platform: Platform;
  /** Comfort with local tool installation */
  toolInstallComfort: ToolInstallComfort;

  // Section 5: Time & Consistency
  /** Realistic daily time commitment (minutes) */
  dailyMinutes: number;
  /** Total weekly time commitment (hours) */
  weeklyHours: number;
  /** Preferred behavior when missing days */
  pacingPref: PacingPreference;

  // Section 6: Learning Style & Depth
  /** What helps understand complex systems */
  learningStyle: LearningStyleHelper[];
  /** What frustrates more */
  frustrationPref: FrustrationPreference;
  /** Depth preference */
  depthPref: DepthPreference;

  // Section 7: Learning Comfort & Accessibility
  /** Comprehensive comfort preferences */
  comfortPrefs: ComfortPreferences;

  // Section 8: Application & Proof-of-Work
  /** Application comfort level */
  applicationPref: ApplicationComfort[];
  /** What system should track */
  trackingPref: TrackingPreference;
  /** Importance of proof-of-work */
  evidencePref: EvidenceImportance;

  // Metadata
  /** When profile was created */
  createdAt: Date;
  /** When profile was last updated */
  updatedAt: Date;
}

/**
 * Zod schema for complete user profile validation
 * Enforces all questionnaire constraints
 */
export const userProfileSchema = z.object({
  id: z.string().uuid(),

  // Section 1
  role: roleSchema,
  baselineSkills: z.array(baselineSkillSchema),
  priorExperience: priorExperienceSchema,

  // Section 2
  goals: z.array(goalSchema).min(1).max(2),
  outcomes: z.array(outcomeSchema).min(1),
  masteryLevel: masteryLevelSchema,

  // Section 3
  learningFlow: learningFlowSchema,
  complexityPref: complexityPreferenceSchema,
  troubleshooting: troubleshootingImportanceSchema,

  // Section 4
  platform: platformSchema,
  toolInstallComfort: toolInstallComfortSchema,

  // Section 5
  dailyMinutes: z.number().positive(),
  weeklyHours: z.number().positive(),
  pacingPref: pacingPreferenceSchema,

  // Section 6
  learningStyle: z.array(learningStyleHelperSchema).min(1),
  frustrationPref: frustrationPreferenceSchema,
  depthPref: depthPreferenceSchema,

  // Section 7
  comfortPrefs: comfortPreferencesSchema,

  // Section 8
  applicationPref: z.array(applicationComfortSchema).min(1),
  trackingPref: trackingPreferenceSchema,
  evidencePref: evidenceImportanceSchema,

  // Metadata
  createdAt: z.date(),
  updatedAt: z.date(),
});

/**
 * Type for creating a new user profile (without id and timestamps)
 */
export type CreateUserProfileInput = Omit<UserProfile, 'id' | 'createdAt' | 'updatedAt'>;

/**
 * Zod schema for creating a new user profile
 */
export const createUserProfileInputSchema = userProfileSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

/**
 * Type for updating user profile (all fields optional except id)
 */
export type UpdateUserProfileInput = Partial<Omit<UserProfile, 'id' | 'createdAt' | 'updatedAt'>> & {
  id: string;
};

/**
 * Zod schema for updating user profile
 */
export const updateUserProfileInputSchema = userProfileSchema
  .omit({ createdAt: true, updatedAt: true })
  .partial()
  .required({ id: true });
