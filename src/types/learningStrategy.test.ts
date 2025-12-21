/**
 * Learning Strategy Types - Unit Tests
 *
 * Tests Zod schema validation for learning strategy types.
 */

import { Difficulty } from './topicGraph';
import {
  StartLevel,
  LearningPhase,
  DailySlicePolicy,
  ApplicationFrequency,
  LinkBudgetPolicy,
  AdaptationSignal,
  AdaptationAction,
  learningStrategySchema,
  phaseWeightingSchema,
  contentFormatPolicySchema,
  adaptationRecommendationSchema,
  conceptFiltersSchema,
  learningContractSummarySchema,
  learningContractConfirmationSchema,
  createLearningStrategyInputSchema,
  type LearningStrategy,
  type PhaseWeighting,
  type ContentFormatPolicy,
  type AdaptationRecommendation,
  type LearningContractSummary,
} from './learningStrategy';

describe('Learning Strategy Enums', () => {
  describe('StartLevel', () => {
    it('should have all expected start levels', () => {
      expect(Object.values(StartLevel)).toContain('absolute-beginner');
      expect(Object.values(StartLevel)).toContain('beginner');
      expect(Object.values(StartLevel)).toContain('intermediate');
      expect(Object.values(StartLevel)).toContain('advanced');
    });
  });

  describe('LearningPhase', () => {
    it('should have all learning phases', () => {
      expect(Object.values(LearningPhase)).toContain('foundation');
      expect(Object.values(LearningPhase)).toContain('core');
      expect(Object.values(LearningPhase)).toContain('advanced');
      expect(Object.values(LearningPhase)).toContain('mastery');
    });
  });

  describe('DailySlicePolicy', () => {
    it('should have all daily slice policies', () => {
      expect(Object.values(DailySlicePolicy)).toContain('minimal');
      expect(Object.values(DailySlicePolicy)).toContain('standard');
      expect(Object.values(DailySlicePolicy)).toContain('applied');
    });
  });

  describe('ApplicationFrequency', () => {
    it('should have all application frequencies', () => {
      expect(Object.values(ApplicationFrequency)).toContain('rare');
      expect(Object.values(ApplicationFrequency)).toContain('occasional');
      expect(Object.values(ApplicationFrequency)).toContain('regular');
      expect(Object.values(ApplicationFrequency)).toContain('frequent');
    });
  });

  describe('LinkBudgetPolicy', () => {
    it('should have all link budget policies', () => {
      expect(Object.values(LinkBudgetPolicy)).toContain('none');
      expect(Object.values(LinkBudgetPolicy)).toContain('minimal');
      expect(Object.values(LinkBudgetPolicy)).toContain('standard');
      expect(Object.values(LinkBudgetPolicy)).toContain('rich');
    });
  });

  describe('AdaptationSignal', () => {
    it('should have all adaptation signals', () => {
      expect(Object.values(AdaptationSignal)).toContain('skipped-days');
      expect(Object.values(AdaptationSignal)).toContain('fast-progress');
      expect(Object.values(AdaptationSignal)).toContain('repeated-confusion');
      expect(Object.values(AdaptationSignal)).toContain('low-application');
      expect(Object.values(AdaptationSignal)).toContain('overwhelm');
    });
  });

  describe('AdaptationAction', () => {
    it('should have all adaptation actions', () => {
      expect(Object.values(AdaptationAction)).toContain('show-recap');
      expect(Object.values(AdaptationAction)).toContain('slow-down');
      expect(Object.values(AdaptationAction)).toContain('speed-up');
      expect(Object.values(AdaptationAction)).toContain('unlock-stretch');
      expect(Object.values(AdaptationAction)).toContain('alternate-explanation');
      expect(Object.values(AdaptationAction)).toContain('add-micro-lab');
      expect(Object.values(AdaptationAction)).toContain('increase-application');
      expect(Object.values(AdaptationAction)).toContain('reduce-links');
      expect(Object.values(AdaptationAction)).toContain('enforce-focus-mode');
      expect(Object.values(AdaptationAction)).toContain('split-concepts');
      expect(Object.values(AdaptationAction)).toContain('ask-user');
    });
  });
});

describe('PhaseWeighting Schema', () => {
  const validPhaseWeighting: PhaseWeighting = {
    foundation: 0.3,
    core: 0.4,
    advanced: 0.2,
    mastery: 0.1,
  };

  it('should validate valid phase weighting', () => {
    expect(() => phaseWeightingSchema.parse(validPhaseWeighting)).not.toThrow();
  });

  it('should reject weight less than 0', () => {
    const invalid = { ...validPhaseWeighting, foundation: -0.1 };
    expect(() => phaseWeightingSchema.parse(invalid)).toThrow();
  });

  it('should reject weight greater than 1', () => {
    const invalid = { ...validPhaseWeighting, core: 1.5 };
    expect(() => phaseWeightingSchema.parse(invalid)).toThrow();
  });

  it('should accept all zeros', () => {
    const valid = { foundation: 0, core: 0, advanced: 0, mastery: 0 };
    expect(() => phaseWeightingSchema.parse(valid)).not.toThrow();
  });

  it('should accept all ones', () => {
    const valid = { foundation: 1, core: 1, advanced: 1, mastery: 1 };
    expect(() => phaseWeightingSchema.parse(valid)).not.toThrow();
  });
});

describe('ContentFormatPolicy Schema', () => {
  const validContentFormat: ContentFormatPolicy = {
    textFirst: true,
    maxVideoLength: 3,
    includeDiagrams: true,
    includeChecklists: true,
    useAnalogies: true,
    maxNewTerms: 5,
    includeCheckpoints: true,
    contentOrder: 'tldr-first',
  };

  it('should validate valid content format policy', () => {
    expect(() => contentFormatPolicySchema.parse(validContentFormat)).not.toThrow();
  });

  it('should accept zero max video length (no videos)', () => {
    const valid = { ...validContentFormat, maxVideoLength: 0 };
    expect(() => contentFormatPolicySchema.parse(valid)).not.toThrow();
  });

  it('should reject negative max video length', () => {
    const invalid = { ...validContentFormat, maxVideoLength: -1 };
    expect(() => contentFormatPolicySchema.parse(invalid)).toThrow();
  });

  it('should reject max video length greater than 60', () => {
    const invalid = { ...validContentFormat, maxVideoLength: 65 };
    expect(() => contentFormatPolicySchema.parse(invalid)).toThrow();
  });

  it('should reject zero or negative max new terms', () => {
    const invalid = { ...validContentFormat, maxNewTerms: 0 };
    expect(() => contentFormatPolicySchema.parse(invalid)).toThrow();
  });

  it('should validate all content order options', () => {
    const tldrFirst = { ...validContentFormat, contentOrder: 'tldr-first' as const };
    const detailsFirst = { ...validContentFormat, contentOrder: 'details-first' as const };
    const exampleFirst = { ...validContentFormat, contentOrder: 'example-first' as const };

    expect(() => contentFormatPolicySchema.parse(tldrFirst)).not.toThrow();
    expect(() => contentFormatPolicySchema.parse(detailsFirst)).not.toThrow();
    expect(() => contentFormatPolicySchema.parse(exampleFirst)).not.toThrow();
  });

  it('should reject invalid content order', () => {
    const invalid = { ...validContentFormat, contentOrder: 'invalid-order' };
    expect(() => contentFormatPolicySchema.parse(invalid)).toThrow();
  });
});

describe('LearningStrategy Schema', () => {
  const validStrategy: LearningStrategy = {
    id: 'aa0e8400-e29b-41d4-a716-446655440007',
    userId: '770e8400-e29b-41d4-a716-446655440003',
    startLevel: StartLevel.BEGINNER,
    phaseWeighting: {
      foundation: 0.4,
      core: 0.4,
      advanced: 0.15,
      mastery: 0.05,
    },
    dailySlicePolicy: DailySlicePolicy.STANDARD,
    applicationFrequency: ApplicationFrequency.REGULAR,
    contentFormatPolicy: {
      textFirst: true,
      maxVideoLength: 5,
      includeDiagrams: true,
      includeChecklists: true,
      useAnalogies: true,
      maxNewTerms: 3,
      includeCheckpoints: true,
      contentOrder: 'tldr-first',
    },
    linkBudgetPolicy: LinkBudgetPolicy.MINIMAL,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  it('should validate a valid learning strategy', () => {
    expect(() => learningStrategySchema.parse(validStrategy)).not.toThrow();
  });

  it('should reject invalid strategy UUID', () => {
    const invalid = { ...validStrategy, id: 'not-a-uuid' };
    expect(() => learningStrategySchema.parse(invalid)).toThrow();
  });

  it('should reject invalid user UUID', () => {
    const invalid = { ...validStrategy, userId: 'not-a-uuid' };
    expect(() => learningStrategySchema.parse(invalid)).toThrow();
  });

  it('should validate advanced learner strategy', () => {
    const valid = {
      ...validStrategy,
      startLevel: StartLevel.ADVANCED,
      phaseWeighting: { foundation: 0.1, core: 0.2, advanced: 0.4, mastery: 0.3 },
      dailySlicePolicy: DailySlicePolicy.APPLIED,
      applicationFrequency: ApplicationFrequency.FREQUENT,
      linkBudgetPolicy: LinkBudgetPolicy.RICH,
    };
    expect(() => learningStrategySchema.parse(valid)).not.toThrow();
  });

  it('should validate absolute beginner strategy', () => {
    const valid = {
      ...validStrategy,
      startLevel: StartLevel.ABSOLUTE_BEGINNER,
      phaseWeighting: { foundation: 0.6, core: 0.3, advanced: 0.1, mastery: 0 },
      dailySlicePolicy: DailySlicePolicy.MINIMAL,
      applicationFrequency: ApplicationFrequency.RARE,
      linkBudgetPolicy: LinkBudgetPolicy.NONE,
      contentFormatPolicy: {
        ...validStrategy.contentFormatPolicy,
        maxVideoLength: 0,
        maxNewTerms: 2,
      },
    };
    expect(() => learningStrategySchema.parse(valid)).not.toThrow();
  });
});

describe('AdaptationRecommendation Schema', () => {
  const validRecommendation: AdaptationRecommendation = {
    signal: AdaptationSignal.SKIPPED_DAYS,
    action: AdaptationAction.SHOW_RECAP,
    explanation: 'You missed 3 days this week. A quick recap will help you get back on track.',
    requiresUserConfirmation: false,
    generatedAt: new Date(),
  };

  it('should validate a valid adaptation recommendation', () => {
    expect(() => adaptationRecommendationSchema.parse(validRecommendation)).not.toThrow();
  });

  it('should validate recommendation requiring user confirmation', () => {
    const valid = {
      ...validRecommendation,
      signal: AdaptationSignal.FAST_PROGRESS,
      action: AdaptationAction.SPEED_UP,
      requiresUserConfirmation: true,
      explanation:
        'You are progressing quickly. Would you like to unlock some advanced stretch concepts?',
    };
    expect(() => adaptationRecommendationSchema.parse(valid)).not.toThrow();
  });

  it('should reject short explanation', () => {
    const invalid = { ...validRecommendation, explanation: 'Too short' };
    expect(() => adaptationRecommendationSchema.parse(invalid)).toThrow();
  });

  it('should validate all adaptation signals and actions', () => {
    const overwhelmSignal = {
      ...validRecommendation,
      signal: AdaptationSignal.OVERWHELM,
      action: AdaptationAction.ENFORCE_FOCUS_MODE,
      explanation: 'Content seems overwhelming. Enabling focus mode to reduce distractions.',
    };
    expect(() => adaptationRecommendationSchema.parse(overwhelmSignal)).not.toThrow();

    const confusionSignal = {
      ...validRecommendation,
      signal: AdaptationSignal.REPEATED_CONFUSION,
      action: AdaptationAction.ALTERNATE_EXPLANATION,
      explanation: 'Concept seems unclear. Let me try explaining it a different way.',
    };
    expect(() => adaptationRecommendationSchema.parse(confusionSignal)).not.toThrow();
  });
});

describe('ConceptFilters Schema', () => {
  const validFilters = {
    minDifficulty: Difficulty.BEGINNER,
    maxDifficulty: Difficulty.INTERMEDIATE,
    requiredTags: ['docker'],
    excludedTags: ['advanced-orchestration'],
    includeTroubleshooting: true,
  };

  it('should validate valid concept filters', () => {
    expect(() => conceptFiltersSchema.parse(validFilters)).not.toThrow();
  });

  it('should accept empty required tags', () => {
    const valid = { ...validFilters, requiredTags: [] };
    expect(() => conceptFiltersSchema.parse(valid)).not.toThrow();
  });

  it('should accept empty excluded tags', () => {
    const valid = { ...validFilters, excludedTags: [] };
    expect(() => conceptFiltersSchema.parse(valid)).not.toThrow();
  });

  it('should validate filters for advanced learners', () => {
    const valid = {
      minDifficulty: Difficulty.INTERMEDIATE,
      maxDifficulty: Difficulty.ADVANCED,
      requiredTags: ['production', 'orchestration'],
      excludedTags: ['beginner'],
      includeTroubleshooting: true,
    };
    expect(() => conceptFiltersSchema.parse(valid)).not.toThrow();
  });
});

describe('LearningContractSummary Schema', () => {
  const validContract: LearningContractSummary = {
    profileSummary:
      'You are a Software Developer with experience in Linux CLI and Git, learning Docker to improve in your current role.',
    learningApproach:
      'Start with concepts first, then hands-on practice. Increase complexity gradually, one layer at a time.',
    contentFormat:
      'Text-first learning with diagrams and mental models. Short video clips (≤3 min) only when truly needed.',
    dailyStructure:
      '20-25 minute sessions (concept + example + reflection). Optional 5-10 minute application moments. One concept per day to keep sessions finishable.',
    skipBehavior: 'Gentle recap (1-3 minutes) before resuming. No automatic pace changes; I will ask first.',
    tracking:
      'Every concept you learn (automatic memory entry). Application moments you complete. Evidence links when you choose to attach them.',
    emphasis: [
      'Building strong mental models of containerization',
      'Understanding when and why to use specific Docker features',
      'Troubleshooting common Docker issues',
    ],
    skipped: [
      'Windows-specific Docker Desktop features (you are on macOS)',
      'Advanced orchestration (that is Kubernetes, your next topic)',
    ],
    generatedAt: new Date(),
  };

  it('should validate a valid learning contract summary', () => {
    expect(() => learningContractSummarySchema.parse(validContract)).not.toThrow();
  });

  it('should reject short profile summary', () => {
    const invalid = { ...validContract, profileSummary: 'Too short' };
    expect(() => learningContractSummarySchema.parse(invalid)).toThrow();
  });

  it('should reject short learning approach', () => {
    const invalid = { ...validContract, learningApproach: 'Too short' };
    expect(() => learningContractSummarySchema.parse(invalid)).toThrow();
  });

  it('should reject empty emphasis array', () => {
    const invalid = { ...validContract, emphasis: [] };
    expect(() => learningContractSummarySchema.parse(invalid)).toThrow();
  });

  it('should accept empty skipped array', () => {
    const valid = { ...validContract, skipped: [] };
    expect(() => learningContractSummarySchema.parse(valid)).not.toThrow();
  });

  it('should validate contract for absolute beginner', () => {
    const valid = {
      ...validContract,
      profileSummary: 'You are a Student with no prior experience, starting with fundamentals.',
      emphasis: ['Building foundational understanding', 'Hands-on practice with simple examples'],
      skipped: ['Advanced topics will come later', 'Production-grade configurations'],
    };
    expect(() => learningContractSummarySchema.parse(valid)).not.toThrow();
  });
});

describe('LearningContractConfirmation Schema', () => {
  it('should validate confirmed contract', () => {
    const valid = {
      confirmed: true,
      confirmedAt: new Date(),
    };
    expect(() => learningContractConfirmationSchema.parse(valid)).not.toThrow();
  });

  it('should validate rejected contract with corrections', () => {
    const valid = {
      confirmed: false,
      corrections:
        'I actually prefer to start with build-first approach, not concepts-first. Also, I have more time available - 45 minutes daily.',
      confirmedAt: new Date(),
    };
    expect(() => learningContractConfirmationSchema.parse(valid)).not.toThrow();
  });

  it('should validate rejected contract without corrections', () => {
    const valid = {
      confirmed: false,
      confirmedAt: new Date(),
    };
    expect(() => learningContractConfirmationSchema.parse(valid)).not.toThrow();
  });
});

describe('Create Learning Strategy Input Schema', () => {
  it('should validate create input without id and timestamps', () => {
    const valid = {
      userId: '770e8400-e29b-41d4-a716-446655440003',
      startLevel: StartLevel.INTERMEDIATE,
      phaseWeighting: { foundation: 0.2, core: 0.5, advanced: 0.2, mastery: 0.1 },
      dailySlicePolicy: DailySlicePolicy.APPLIED,
      applicationFrequency: ApplicationFrequency.FREQUENT,
      contentFormatPolicy: {
        textFirst: true,
        maxVideoLength: 10,
        includeDiagrams: true,
        includeChecklists: true,
        useAnalogies: false,
        maxNewTerms: 5,
        includeCheckpoints: true,
        contentOrder: 'example-first' as const,
      },
      linkBudgetPolicy: LinkBudgetPolicy.STANDARD,
    };
    expect(() => createLearningStrategyInputSchema.parse(valid)).not.toThrow();
  });

  it('should ignore if id is provided (omit strips it)', () => {
    const withId = {
      id: 'aa0e8400-e29b-41d4-a716-446655440007',
      userId: '770e8400-e29b-41d4-a716-446655440003',
      startLevel: StartLevel.BEGINNER,
      phaseWeighting: { foundation: 0.4, core: 0.4, advanced: 0.15, mastery: 0.05 },
      dailySlicePolicy: DailySlicePolicy.STANDARD,
      applicationFrequency: ApplicationFrequency.REGULAR,
      contentFormatPolicy: {
        textFirst: true,
        maxVideoLength: 5,
        includeDiagrams: true,
        includeChecklists: true,
        useAnalogies: true,
        maxNewTerms: 3,
        includeCheckpoints: true,
        contentOrder: 'tldr-first' as const,
      },
      linkBudgetPolicy: LinkBudgetPolicy.MINIMAL,
    };
    const result = createLearningStrategyInputSchema.parse(withId);
    expect(result).not.toHaveProperty('id');
  });
});
