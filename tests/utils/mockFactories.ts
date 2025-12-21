/**
 * Mock Data Factories
 *
 * Factory functions for generating test data.
 * These factories create valid objects that match our type schemas.
 */

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
  Difficulty,
  EvidenceType,
  SourceType,
  EvidenceVisibility,
  type UserProfile,
  type ComfortPreferences,
  type Topic,
  type Concept,
  type DailyPlan,
  type MemoryEntry,
  type EvidenceItem,
  type LearningStrategy,
  type DailyLearningUnit,
} from '@/types';

/**
 * Generate a mock UUID
 */
const mockUUID = (seed = 0): string => {
  const hex = seed.toString(16).padStart(12, '0');
  return `550e8400-e29b-41d4-a716-${hex}`;
};

/**
 * Generate a mock date
 */
const mockDate = (offset = 0): Date => {
  const baseDate = new Date('2025-01-20T10:00:00Z');
  const date = new Date(baseDate);
  date.setDate(date.getDate() + offset);
  return date;
};

/**
 * Create mock ComfortPreferences
 */
export const createMockComfortPreferences = (
  overrides?: Partial<ComfortPreferences>
): ComfortPreferences => ({
  learningFormats: [LearningFormat.TEXT_FIRST],
  videoPreference: VideoPreference.SHORT_CLIPS_ONLY,
  overwhelmTriggers: [OverwhelmTrigger.TOO_MANY_NEW_TERMS],
  sessionStyle: SessionStyle.ONE_CONCEPT_PER_DAY,
  contentOrder: ContentOrder.TLDR_THEN_DETAILS,
  skipBehavior: SkipBehavior.GENTLE_RECAP,
  uiToggles: [UIToggle.FOCUS_MODE],
  ...overrides,
});

/**
 * Create mock UserProfile
 */
export const createMockUserProfile = (overrides?: Partial<UserProfile>): UserProfile => ({
  id: mockUUID(1),
  role: Role.SOFTWARE_DEVELOPER,
  baselineSkills: [BaselineSkill.LINUX_CLI, BaselineSkill.GIT],
  priorExperience: PriorExperience.USED_BASICS,
  goals: [Goal.IMPROVE_CURRENT_ROLE],
  outcomes: [Outcome.BUILD_REAL_APPS, Outcome.TROUBLESHOOT],
  masteryLevel: MasteryLevel.USE_CONFIDENTLY,
  learningFlow: LearningFlow.CONCEPTS_FIRST,
  complexityPref: ComplexityPreference.GRADUALLY_ONE_LAYER,
  troubleshooting: TroubleshootingImportance.SOME,
  platform: Platform.MACOS_APPLE_SILICON,
  toolInstallComfort: ToolInstallComfort.YES,
  dailyMinutes: 20,
  weeklyHours: 5,
  pacingPref: PacingPreference.ASK_BEFORE_ADJUSTING,
  learningStyle: [LearningStyleHelper.STEP_BY_STEP_LABS],
  frustrationPref: FrustrationPreference.OVERSIMPLIFIED_EXPLANATIONS,
  depthPref: DepthPreference.KEEP_IT_SIMPLE_FIRST,
  comfortPrefs: createMockComfortPreferences(),
  applicationPref: [ApplicationComfort.RUNNING_COMMANDS, ApplicationComfort.LINKING_GITHUB],
  trackingPref: TrackingPreference.LEARNING_PLUS_APPLICATIONS_PLUS_EVIDENCE,
  evidencePref: EvidenceImportance.IMPORTANT,
  createdAt: mockDate(0),
  updatedAt: mockDate(0),
  ...overrides,
});

/**
 * Create mock Topic
 */
export const createMockTopic = (overrides?: Partial<Topic>): Topic => ({
  id: mockUUID(100),
  name: 'Docker',
  description: 'Learn containerization with Docker from basics to production',
  tags: ['containers', 'devops', 'infrastructure'],
  createdAt: mockDate(0),
  updatedAt: mockDate(0),
  ...overrides,
});

/**
 * Create mock Concept
 */
export const createMockConcept = (overrides?: Partial<Concept>): Concept => ({
  id: mockUUID(200),
  topicId: mockUUID(100),
  title: 'What is a Docker container?',
  prereqIds: [],
  difficulty: Difficulty.BEGINNER,
  whyItMatters: 'Containers enable consistent deployment across environments',
  commonConfusions: [
    'Confusing containers with virtual machines',
    'Thinking containers are less secure than VMs',
  ],
  exampleTemplate:
    'Run your first container: docker run hello-world\nThis pulls and runs a simple test image.',
  applicationTemplate:
    'Create a Dockerfile for a simple Node.js app and build your first custom container image.',
  createdAt: mockDate(0),
  updatedAt: mockDate(0),
  ...overrides,
});

/**
 * Create mock DailyPlan
 */
export const createMockDailyPlan = (overrides?: Partial<DailyPlan>): DailyPlan => ({
  id: mockUUID(300),
  userId: mockUUID(1),
  topicId: mockUUID(100),
  generatedAt: mockDate(0),
  conceptSequence: [mockUUID(200), mockUUID(201), mockUUID(202)],
  createdAt: mockDate(0),
  updatedAt: mockDate(0),
  ...overrides,
});

/**
 * Create mock DailyLearningUnit
 */
export const createMockDailyLearningUnit = (
  overrides?: Partial<DailyLearningUnit>
): DailyLearningUnit => ({
  concept: createMockConcept(),
  conceptExplanation:
    'A Docker container is a lightweight, standalone, executable package that includes everything needed to run a piece of software: code, runtime, system tools, libraries, and settings. Unlike virtual machines, containers share the host OS kernel, making them more efficient.',
  concreteExample:
    'Let\'s run your first container:\n1. docker pull nginx\n2. docker run -d -p 8080:80 nginx\n3. Open http://localhost:8080\nYou now have a web server running in a container!',
  reflectionPrompts: [
    'How is a container different from installing software directly on your machine?',
    'What advantages do you see in using containers for deployment?',
  ],
  applicationMoment:
    'Create a simple Dockerfile for a web application and run it locally.',
  estimatedMinutes: 25,
  ...overrides,
});

/**
 * Create mock MemoryEntry
 */
export const createMockMemoryEntry = (overrides?: Partial<MemoryEntry>): MemoryEntry => ({
  id: mockUUID(400),
  userId: mockUUID(1),
  topicId: mockUUID(100),
  conceptId: mockUUID(200),
  reflectionText: 'I learned that containers are different from VMs in fundamental ways',
  actionTaken: 'Created a Dockerfile for a simple Node.js app and built the image',
  tags: ['docker', 'containers', 'beginner', 'phase-1'],
  createdAt: mockDate(0),
  updatedAt: mockDate(0),
  ...overrides,
});

/**
 * Create mock EvidenceItem
 */
export const createMockEvidenceItem = (overrides?: Partial<EvidenceItem>): EvidenceItem => ({
  id: mockUUID(500),
  memoryEntryId: mockUUID(400),
  type: EvidenceType.GITHUB,
  urlOrBlobRef: 'https://github.com/user/repo/commit/abc123',
  label: 'First Docker compose file',
  sourceType: SourceType.VERIFIABLE,
  visibility: EvidenceVisibility.PRIVATE,
  createdAt: mockDate(0),
  updatedAt: mockDate(0),
  ...overrides,
});

/**
 * Create mock LearningStrategy
 */
export const createMockLearningStrategy = (
  overrides?: Partial<LearningStrategy>
): LearningStrategy => ({
  id: mockUUID(600),
  userId: mockUUID(1),
  startLevel: 'beginner' as const,
  phaseWeighting: {
    foundation: 0.4,
    core: 0.4,
    advanced: 0.15,
    mastery: 0.05,
  },
  dailySlicePolicy: 'standard' as const,
  applicationFrequency: 'regular' as const,
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
  linkBudgetPolicy: 'minimal' as const,
  createdAt: mockDate(0),
  updatedAt: mockDate(0),
  ...overrides,
});

/**
 * Create a complete mock user with profile, strategy, and plan
 */
export const createMockUserWithData = () => {
  const userId = mockUUID(1);
  const topicId = mockUUID(100);

  return {
    profile: createMockUserProfile({ id: userId }),
    strategy: createMockLearningStrategy({ userId }),
    topic: createMockTopic({ id: topicId }),
    plan: createMockDailyPlan({ userId, topicId }),
    concepts: [
      createMockConcept({ id: mockUUID(200), topicId }),
      createMockConcept({ id: mockUUID(201), topicId }),
      createMockConcept({ id: mockUUID(202), topicId }),
    ],
    memoryEntries: [
      createMockMemoryEntry({ userId, topicId, conceptId: mockUUID(200) }),
    ],
    evidenceItems: [
      createMockEvidenceItem({ memoryEntryId: mockUUID(400) }),
    ],
  };
};

/**
 * Create mock Prisma client for testing
 * Returns an object with mocked Prisma methods
 */
export const createMockPrismaClient = () => ({
  userProfile: {
    findUnique: jest.fn(),
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  topic: {
    findUnique: jest.fn(),
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  concept: {
    findUnique: jest.fn(),
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  memoryEntry: {
    findUnique: jest.fn(),
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  evidenceItem: {
    findUnique: jest.fn(),
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  $connect: jest.fn(),
  $disconnect: jest.fn(),
  $transaction: jest.fn(),
});
