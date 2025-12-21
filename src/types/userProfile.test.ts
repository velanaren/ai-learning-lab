/**
 * User Profile Types - Unit Tests
 *
 * Tests Zod schema validation for user profile and questionnaire types.
 */

import { z } from 'zod';
import {
  Role,
  BaselineSkill,
  PriorExperience,
  Goal,
  Outcome,
  MasteryLevel,
  LearningFlow,
  ComplexityPreference,
  TroubleshootingImportance,
  Platform,
  ToolInstallComfort,
  PacingPreference,
  LearningStyleHelper,
  FrustrationPreference,
  DepthPreference,
  LearningFormat,
  VideoPreference,
  OverwhelmTrigger,
  SessionStyle,
  ContentOrder,
  SkipBehavior,
  UIToggle,
  ApplicationComfort,
  TrackingPreference,
  EvidenceImportance,
  userProfileSchema,
  createUserProfileInputSchema,
  updateUserProfileInputSchema,
  comfortPreferencesSchema,
  type UserProfile,
  type CreateUserProfileInput,
  type ComfortPreferences,
} from './userProfile';

describe('User Profile Enums', () => {
  describe('Role', () => {
    it('should have all expected role values', () => {
      expect(Object.values(Role)).toContain('Application Support Engineer');
      expect(Object.values(Role)).toContain('Software Developer');
      expect(Object.values(Role)).toContain('DevOps-SRE');
      expect(Object.values(Role)).toContain('Student');
      expect(Object.values(Role)).toContain('Other');
    });
  });

  describe('BaselineSkill', () => {
    it('should have all expected baseline skill values', () => {
      expect(Object.values(BaselineSkill)).toContain('Linux CLI');
      expect(Object.values(BaselineSkill)).toContain('Bash scripting');
      expect(Object.values(BaselineSkill)).toContain('Python');
      expect(Object.values(BaselineSkill)).toContain('Git');
      expect(Object.values(BaselineSkill)).toContain('Debugging prod issues');
      expect(Object.values(BaselineSkill)).toContain('None');
    });
  });

  describe('PriorExperience', () => {
    it('should have all expected prior experience values', () => {
      expect(Object.values(PriorExperience)).toContain('Never');
      expect(Object.values(PriorExperience)).toContain('Used basics');
      expect(Object.values(PriorExperience)).toContain('Built small things');
      expect(Object.values(PriorExperience)).toContain('Used in CI-CD');
      expect(Object.values(PriorExperience)).toContain('Used professionally');
    });
  });
});

describe('ComfortPreferences Schema', () => {
  const validComfortPrefs: ComfortPreferences = {
    learningFormats: [LearningFormat.TEXT_FIRST, LearningFormat.DIAGRAMS_MENTAL_MODELS],
    videoPreference: VideoPreference.SHORT_CLIPS_ONLY,
    overwhelmTriggers: [OverwhelmTrigger.TOO_MANY_NEW_TERMS, OverwhelmTrigger.TOO_MUCH_UI],
    sessionStyle: SessionStyle.ONE_CONCEPT_PER_DAY,
    contentOrder: ContentOrder.TLDR_THEN_DETAILS,
    skipBehavior: SkipBehavior.GENTLE_RECAP,
    uiToggles: [UIToggle.FOCUS_MODE, UIToggle.LARGER_TEXT],
  };

  it('should validate valid comfort preferences', () => {
    expect(() => comfortPreferencesSchema.parse(validComfortPrefs)).not.toThrow();
  });

  it('should reject more than 2 learning formats', () => {
    const invalid = {
      ...validComfortPrefs,
      learningFormats: [
        LearningFormat.TEXT_FIRST,
        LearningFormat.DIAGRAMS_MENTAL_MODELS,
        LearningFormat.SHORT_CLIPS_3MIN,
      ],
    };
    expect(() => comfortPreferencesSchema.parse(invalid)).toThrow();
  });

  it('should reject empty learning formats', () => {
    const invalid = {
      ...validComfortPrefs,
      learningFormats: [],
    };
    expect(() => comfortPreferencesSchema.parse(invalid)).toThrow();
  });

  it('should reject more than 2 overwhelm triggers', () => {
    const invalid = {
      ...validComfortPrefs,
      overwhelmTriggers: [
        OverwhelmTrigger.TOO_MANY_NEW_TERMS,
        OverwhelmTrigger.TOO_MUCH_UI,
        OverwhelmTrigger.SETUP_FRICTION,
      ],
    };
    expect(() => comfortPreferencesSchema.parse(invalid)).toThrow();
  });

  it('should accept empty UI toggles', () => {
    const valid = {
      ...validComfortPrefs,
      uiToggles: [],
    };
    expect(() => comfortPreferencesSchema.parse(valid)).not.toThrow();
  });
});

describe('UserProfile Schema', () => {
  const validUserProfile: UserProfile = {
    id: '550e8400-e29b-41d4-a716-446655440000',
    // Section 1
    role: Role.SOFTWARE_DEVELOPER,
    baselineSkills: [BaselineSkill.LINUX_CLI, BaselineSkill.GIT],
    priorExperience: PriorExperience.USED_BASICS,
    // Section 2
    goals: [Goal.IMPROVE_CURRENT_ROLE, Goal.PREPARE_NEXT_TOPIC],
    outcomes: [Outcome.BUILD_REAL_APPS, Outcome.TROUBLESHOOT],
    masteryLevel: MasteryLevel.USE_CONFIDENTLY,
    // Section 3
    learningFlow: LearningFlow.CONCEPTS_FIRST,
    complexityPref: ComplexityPreference.GRADUALLY_ONE_LAYER,
    troubleshooting: TroubleshootingImportance.SOME,
    // Section 4
    platform: Platform.MACOS_APPLE_SILICON,
    toolInstallComfort: ToolInstallComfort.YES,
    // Section 5
    dailyMinutes: 20,
    weeklyHours: 5,
    pacingPref: PacingPreference.ASK_BEFORE_ADJUSTING,
    // Section 6
    learningStyle: [LearningStyleHelper.STEP_BY_STEP_LABS, LearningStyleHelper.VISUALS],
    frustrationPref: FrustrationPreference.OVERSIMPLIFIED_EXPLANATIONS,
    depthPref: DepthPreference.KEEP_IT_SIMPLE_FIRST,
    // Section 7
    comfortPrefs: {
      learningFormats: [LearningFormat.TEXT_FIRST],
      videoPreference: VideoPreference.SHORT_CLIPS_ONLY,
      overwhelmTriggers: [OverwhelmTrigger.TOO_MANY_NEW_TERMS],
      sessionStyle: SessionStyle.ONE_CONCEPT_PER_DAY,
      contentOrder: ContentOrder.TLDR_THEN_DETAILS,
      skipBehavior: SkipBehavior.GENTLE_RECAP,
      uiToggles: [UIToggle.FOCUS_MODE],
    },
    // Section 8
    applicationPref: [ApplicationComfort.RUNNING_COMMANDS, ApplicationComfort.LINKING_GITHUB],
    trackingPref: TrackingPreference.LEARNING_PLUS_APPLICATIONS_PLUS_EVIDENCE,
    evidencePref: EvidenceImportance.IMPORTANT,
    // Metadata
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  it('should validate a complete valid user profile', () => {
    expect(() => userProfileSchema.parse(validUserProfile)).not.toThrow();
  });

  it('should reject invalid UUID', () => {
    const invalid = {
      ...validUserProfile,
      id: 'not-a-uuid',
    };
    expect(() => userProfileSchema.parse(invalid)).toThrow();
  });

  it('should reject more than 2 goals', () => {
    const invalid = {
      ...validUserProfile,
      goals: [Goal.IMPROVE_CURRENT_ROLE, Goal.PREPARE_NEXT_TOPIC, Goal.INTERVIEW_PREP],
    };
    expect(() => userProfileSchema.parse(invalid)).toThrow();
  });

  it('should reject empty goals array', () => {
    const invalid = {
      ...validUserProfile,
      goals: [],
    };
    expect(() => userProfileSchema.parse(invalid)).toThrow();
  });

  it('should reject negative daily minutes', () => {
    const invalid = {
      ...validUserProfile,
      dailyMinutes: -10,
    };
    expect(() => userProfileSchema.parse(invalid)).toThrow();
  });

  it('should reject zero daily minutes', () => {
    const invalid = {
      ...validUserProfile,
      dailyMinutes: 0,
    };
    expect(() => userProfileSchema.parse(invalid)).toThrow();
  });

  it('should reject negative weekly hours', () => {
    const invalid = {
      ...validUserProfile,
      weeklyHours: -5,
    };
    expect(() => userProfileSchema.parse(invalid)).toThrow();
  });

  it('should accept empty baseline skills (None selected)', () => {
    const valid = {
      ...validUserProfile,
      baselineSkills: [],
    };
    expect(() => userProfileSchema.parse(valid)).not.toThrow();
  });

  it('should reject empty learning style', () => {
    const invalid = {
      ...validUserProfile,
      learningStyle: [],
    };
    expect(() => userProfileSchema.parse(invalid)).toThrow();
  });

  it('should reject empty application preferences', () => {
    const invalid = {
      ...validUserProfile,
      applicationPref: [],
    };
    expect(() => userProfileSchema.parse(invalid)).toThrow();
  });
});

describe('CreateUserProfileInput Schema', () => {
  const validCreateInput: CreateUserProfileInput = {
    // Section 1
    role: Role.DEVOPS_SRE,
    baselineSkills: [BaselineSkill.LINUX_CLI, BaselineSkill.BASH_SCRIPTING, BaselineSkill.GIT],
    priorExperience: PriorExperience.BUILT_SMALL_THINGS,
    // Section 2
    goals: [Goal.CAREER_TRANSITION],
    outcomes: [Outcome.UNDERSTAND_INTERNALS, Outcome.INTERVIEW_READY],
    masteryLevel: MasteryLevel.DEVOPS_GRADE_MASTERY,
    // Section 3
    learningFlow: LearningFlow.BUILD_FIRST,
    complexityPref: ComplexityPreference.THROUGH_REALISTIC_PROJECTS,
    troubleshooting: TroubleshootingImportance.VERY_IMPORTANT,
    // Section 4
    platform: Platform.LINUX,
    toolInstallComfort: ToolInstallComfort.YES,
    // Section 5
    dailyMinutes: 45,
    weeklyHours: 10,
    pacingPref: PacingPreference.RECAP_CONTINUE,
    // Section 6
    learningStyle: [LearningStyleHelper.ALL],
    frustrationPref: FrustrationPreference.TOO_MUCH_THEORY_WITHOUT_PRACTICE,
    depthPref: DepthPreference.NEVER_COMPROMISE_ON_ACCURACY,
    // Section 7
    comfortPrefs: {
      learningFormats: [LearningFormat.STEP_BY_STEP_LABS, LearningFormat.DIAGRAMS_MENTAL_MODELS],
      videoPreference: VideoPreference.FIVE_TO_TEN_MIN_OCCASIONALLY,
      overwhelmTriggers: [OverwhelmTrigger.LONG_EXPLANATIONS_WITHOUT_CHECKPOINTS],
      sessionStyle: SessionStyle.ONE_CONCEPT_PLUS_SMALL_APPLICATION,
      contentOrder: ContentOrder.EXAMPLE_THEN_EXPLANATION,
      skipBehavior: SkipBehavior.ASK_BEFORE_CHANGING_PACE,
      uiToggles: [UIToggle.REDUCED_MOTION, UIToggle.HIGH_CONTRAST_DARK_MODE],
    },
    // Section 8
    applicationPref: [
      ApplicationComfort.CODE_CONFIG_SNIPPETS,
      ApplicationComfort.RUNNING_COMMANDS,
      ApplicationComfort.LINKING_GITHUB,
      ApplicationComfort.WRITING_SHORT_REFLECTIONS,
    ],
    trackingPref: TrackingPreference.LEARNING_PLUS_APPLICATIONS_PLUS_EVIDENCE,
    evidencePref: EvidenceImportance.VERY_IMPORTANT,
  };

  it('should validate valid create input (without id and timestamps)', () => {
    expect(() => createUserProfileInputSchema.parse(validCreateInput)).not.toThrow();
  });

  it('should ignore if id is provided (omit strips it)', () => {
    const withId = {
      ...validCreateInput,
      id: '550e8400-e29b-41d4-a716-446655440000',
    };
    const result = createUserProfileInputSchema.parse(withId);
    expect(result).not.toHaveProperty('id');
  });

  it('should ignore if createdAt is provided (omit strips it)', () => {
    const withCreatedAt = {
      ...validCreateInput,
      createdAt: new Date(),
    };
    const result = createUserProfileInputSchema.parse(withCreatedAt);
    expect(result).not.toHaveProperty('createdAt');
  });

  it('should ignore if updatedAt is provided (omit strips it)', () => {
    const withUpdatedAt = {
      ...validCreateInput,
      updatedAt: new Date(),
    };
    const result = createUserProfileInputSchema.parse(withUpdatedAt);
    expect(result).not.toHaveProperty('updatedAt');
  });
});

describe('UpdateUserProfileInput Schema', () => {
  it('should validate partial update with only id required', () => {
    const valid = {
      id: '550e8400-e29b-41d4-a716-446655440000',
      dailyMinutes: 30,
    };
    expect(() => updateUserProfileInputSchema.parse(valid)).not.toThrow();
  });

  it('should validate update with multiple fields', () => {
    const valid = {
      id: '550e8400-e29b-41d4-a716-446655440000',
      dailyMinutes: 30,
      weeklyHours: 8,
      pacingPref: PacingPreference.SLOW_DOWN_AUTOMATICALLY,
    };
    expect(() => updateUserProfileInputSchema.parse(valid)).not.toThrow();
  });

  it('should reject update without id', () => {
    const invalid = {
      dailyMinutes: 30,
    };
    expect(() => updateUserProfileInputSchema.parse(invalid)).toThrow();
  });

  it('should reject invalid UUID in update', () => {
    const invalid = {
      id: 'not-a-uuid',
      dailyMinutes: 30,
    };
    expect(() => updateUserProfileInputSchema.parse(invalid)).toThrow();
  });

  it('should reject invalid values in update', () => {
    const invalid = {
      id: '550e8400-e29b-41d4-a716-446655440000',
      dailyMinutes: -10, // negative not allowed
    };
    expect(() => updateUserProfileInputSchema.parse(invalid)).toThrow();
  });
});

describe('Type Safety', () => {
  it('should ensure UserProfile has all required fields', () => {
    const profile: UserProfile = {
      id: '550e8400-e29b-41d4-a716-446655440000',
      role: Role.STUDENT,
      baselineSkills: [BaselineSkill.NONE],
      priorExperience: PriorExperience.NEVER,
      goals: [Goal.FUNDAMENTALS],
      outcomes: [Outcome.BUILD_REAL_APPS],
      masteryLevel: MasteryLevel.USE_CONFIDENTLY,
      learningFlow: LearningFlow.CONCEPTS_FIRST,
      complexityPref: ComplexityPreference.GRADUALLY_ONE_LAYER,
      troubleshooting: TroubleshootingImportance.LOW,
      platform: Platform.WINDOWS_WSL,
      toolInstallComfort: ToolInstallComfort.PREFER_MINIMAL_SETUP,
      dailyMinutes: 10,
      weeklyHours: 5,
      pacingPref: PacingPreference.ASK_BEFORE_ADJUSTING,
      learningStyle: [LearningStyleHelper.ANALOGIES],
      frustrationPref: FrustrationPreference.OVERSIMPLIFIED_EXPLANATIONS,
      depthPref: DepthPreference.KEEP_IT_SIMPLE_FIRST,
      comfortPrefs: {
        learningFormats: [LearningFormat.NO_VIDEOS_TEXT_ONLY],
        videoPreference: VideoPreference.AVOID_AUDIO_VIDEO,
        overwhelmTriggers: [OverwhelmTrigger.SETUP_FRICTION],
        sessionStyle: SessionStyle.ONE_CONCEPT_PER_DAY,
        contentOrder: ContentOrder.TLDR_THEN_DETAILS,
        skipBehavior: SkipBehavior.SIMPLIFIED_RESTART,
        uiToggles: [],
      },
      applicationPref: [ApplicationComfort.WRITING_SHORT_REFLECTIONS],
      trackingPref: TrackingPreference.LEARNING_ONLY,
      evidencePref: EvidenceImportance.NICE_TO_HAVE,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // This should compile without errors
    expect(profile.id).toBeDefined();
  });
});
