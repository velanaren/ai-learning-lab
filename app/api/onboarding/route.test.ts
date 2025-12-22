/**
 * Onboarding API Routes Tests
 *
 * Comprehensive integration tests for all onboarding endpoints.
 * Tests success cases, validation, error handling, and edge cases.
 *
 * @module api/onboarding/route.test
 */

// Mock groq-sdk before any imports that use it
jest.mock('groq-sdk/shims/node', () => ({}));
jest.mock('groq-sdk', () => {
  return jest.fn().mockImplementation(() => ({
    chat: {
      completions: {
        create: jest.fn(),
      },
    },
  }));
});

import { POST as topicPost } from './topic/route';
import { POST as questionnairePost } from './questionnaire/route';
import { POST as generateContractPost } from './generate-contract/route';
import { POST as confirmContractPost } from './confirm-contract/route';
import * as contractGenerator from '@/services/learningContractGenerator';
import type { UserProfile } from '@/types/userProfile';
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
} from '@/types/userProfile';

// Mock the contract generator
jest.mock('@/services/learningContractGenerator');

// ============================================
// Test Fixtures
// ============================================

const mockUserProfile: UserProfile = {
  id: '123e4567-e89b-12d3-a456-426614174000',
  role: Role.DEVOPS_SRE,
  baselineSkills: [BaselineSkill.LINUX_CLI, BaselineSkill.GIT],
  priorExperience: PriorExperience.USED_BASICS,
  goals: [Goal.IMPROVE_CURRENT_ROLE],
  outcomes: [Outcome.BUILD_REAL_APPS, Outcome.TROUBLESHOOT],
  masteryLevel: MasteryLevel.DEVOPS_GRADE_MASTERY,
  learningFlow: LearningFlow.MIX,
  complexityPref: ComplexityPreference.GRADUALLY_ONE_LAYER,
  troubleshooting: TroubleshootingImportance.VERY_IMPORTANT,
  platform: Platform.LINUX,
  toolInstallComfort: ToolInstallComfort.YES,
  dailyMinutes: 30,
  weeklyHours: 5,
  pacingPref: PacingPreference.RECAP_CONTINUE,
  learningStyle: [
    LearningStyleHelper.STEP_BY_STEP_LABS,
    LearningStyleHelper.VISUALS,
  ],
  frustrationPref:
    FrustrationPreference.TOO_MUCH_THEORY_WITHOUT_PRACTICE,
  depthPref: DepthPreference.NEVER_COMPROMISE_ON_ACCURACY,
  comfortPrefs: {
    learningFormats: [
      LearningFormat.TEXT_FIRST,
      LearningFormat.STEP_BY_STEP_LABS,
    ],
    videoPreference: VideoPreference.SHORT_CLIPS_ONLY,
    overwhelmTriggers: [OverwhelmTrigger.TOO_MANY_NEW_TERMS],
    sessionStyle: SessionStyle.ONE_CONCEPT_PLUS_SMALL_APPLICATION,
    contentOrder: ContentOrder.TLDR_THEN_DETAILS,
    skipBehavior: SkipBehavior.GENTLE_RECAP,
    uiToggles: [UIToggle.FOCUS_MODE],
  },
  applicationPref: [
    ApplicationComfort.RUNNING_COMMANDS,
    ApplicationComfort.LINKING_GITHUB,
  ],
  trackingPref:
    TrackingPreference.LEARNING_PLUS_APPLICATIONS_PLUS_EVIDENCE,
  evidencePref: EvidenceImportance.VERY_IMPORTANT,
  createdAt: new Date('2025-01-01'),
  updatedAt: new Date('2025-01-01'),
};

const mockContract = {
  profileSummary:
    "You're a DevOps/SRE professional with experience in Linux CLI and Git. You want to improve in your current role.",
  learningApproach:
    'Mix concepts and hands-on practice throughout the learning journey.',
  contentFormat:
    'Text-first learning with diagrams and step-by-step labs.',
  dailyStructure:
    '30-minute sessions with optional application moments.',
  skipBehavior:
    'Gentle recap before resuming after missed days.',
  tracking:
    'Every concept you learn with automatic memory entries.',
  emphasis: [
    'Building real-world applications',
    'Troubleshooting skills',
  ],
  skipped: ['Windows-specific features'],
  generatedAt: new Date('2025-01-01'),
};

// Helper to create mock request
function createMockRequest(
  body: unknown,
  headers: Record<string, string> = {}
): Request {
  return new Request('http://localhost:3000/api/test', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-user-id': 'temp-user-123',
      ...headers,
    },
    body: JSON.stringify(body),
  });
}

// ============================================
// POST /api/onboarding/topic Tests
// ============================================

describe('POST /api/onboarding/topic', () => {
  it('should save topic successfully', async () => {
    const request = createMockRequest({
      topicId: '123e4567-e89b-12d3-a456-426614174000',
      topicName: 'Docker',
    });

    const response = await topicPost(request as any);
    const data = await response.json();

    expect(response.status).toBe(201);
    expect(data.success).toBe(true);
    expect(data.data.topicId).toBe(
      '123e4567-e89b-12d3-a456-426614174000'
    );
    expect(data.data.topicName).toBe('Docker');
    expect(data.message).toBe('Topic saved successfully');
  });

  it('should reject invalid topic ID', async () => {
    const request = createMockRequest({
      topicId: 'invalid-uuid',
      topicName: 'Docker',
    });

    const response = await topicPost(request as any);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.success).toBe(false);
    expect(data.error.code).toBe('VALIDATION_ERROR');
  });

  it('should reject missing topic name', async () => {
    const request = createMockRequest({
      topicId: '123e4567-e89b-12d3-a456-426614174000',
      topicName: '',
    });

    const response = await topicPost(request as any);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.success).toBe(false);
    expect(data.error.code).toBe('VALIDATION_ERROR');
  });

  it('should require authentication', async () => {
    const request = createMockRequest(
      {
        topicId: '123e4567-e89b-12d3-a456-426614174000',
        topicName: 'Docker',
      },
      { 'x-user-id': '' } // No user ID
    );

    const response = await topicPost(request as any);
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.success).toBe(false);
    expect(data.error.code).toBe('UNAUTHORIZED');
  });
});

// ============================================
// POST /api/onboarding/questionnaire Tests
// ============================================

describe('POST /api/onboarding/questionnaire', () => {
  it('should save questionnaire successfully', async () => {
    const { id, createdAt, updatedAt, ...profileData } =
      mockUserProfile;

    const request = createMockRequest(profileData);

    const response = await questionnairePost(request as any);
    const data = await response.json();

    expect(response.status).toBe(201);
    expect(data.success).toBe(true);
    expect(data.data.isComplete).toBe(true);
    expect(data.data.nextStep).toBe('generate-contract');
  });

  it('should reject invalid role', async () => {
    const { id, createdAt, updatedAt, ...profileData } =
      mockUserProfile;

    const request = createMockRequest({
      ...profileData,
      role: 'InvalidRole',
    });

    const response = await questionnairePost(request as any);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.success).toBe(false);
    expect(data.error.code).toBe('VALIDATION_ERROR');
  });

  it('should reject missing required fields', async () => {
    const request = createMockRequest({
      role: Role.STUDENT,
      // Missing all other required fields
    });

    const response = await questionnairePost(request as any);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.success).toBe(false);
  });

  it('should validate comfort preferences', async () => {
    const { id, createdAt, updatedAt, ...profileData } =
      mockUserProfile;

    const request = createMockRequest({
      ...profileData,
      comfortPrefs: {
        // Missing required fields
        learningFormats: [],
      },
    });

    const response = await questionnairePost(request as any);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.success).toBe(false);
  });
});

// ============================================
// POST /api/onboarding/generate-contract Tests
// ============================================

describe('POST /api/onboarding/generate-contract', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should generate contract successfully', async () => {
    (
      contractGenerator.generateLearningContractSummary as jest.Mock
    ).mockResolvedValue(mockContract);

    const request = createMockRequest({
      userProfile: mockUserProfile,
    });

    const response = await generateContractPost(request as any);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.data.contract.profileSummary).toBe(
      mockContract.profileSummary
    );
    expect(data.data.nextStep).toBe('confirm-contract');
    expect(
      contractGenerator.generateLearningContractSummary
    ).toHaveBeenCalledWith(mockUserProfile);
  });

  it('should handle contract generation errors', async () => {
    (
      contractGenerator.generateLearningContractSummary as jest.Mock
    ).mockRejectedValue(new Error('Generation failed'));

    const request = createMockRequest({
      userProfile: mockUserProfile,
    });

    const response = await generateContractPost(request as any);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.success).toBe(false);
    expect(data.error.code).toBe('INTERNAL_ERROR');
  });

  it('should reject request with userId only (DB not implemented)', async () => {
    const request = createMockRequest({
      userId: '123e4567-e89b-12d3-a456-426614174000',
    });

    const response = await generateContractPost(request as any);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.success).toBe(false);
    expect(data.error.message).toContain('database not yet');
  });
});

// ============================================
// POST /api/onboarding/confirm-contract Tests
// ============================================

describe('POST /api/onboarding/confirm-contract', () => {
  it('should confirm contract successfully', async () => {
    const request = createMockRequest({
      userId: 'temp-user-123',
      contract: mockContract,
      confirmed: true,
      corrections: '',
    });

    const response = await confirmContractPost(request as any);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.data.onboardingComplete).toBe(true);
    expect(data.data.nextStep).toBe('day-1');
    expect(data.message).toContain('confirmed');
  });

  it('should handle contract corrections', async () => {
    const request = createMockRequest({
      userId: 'temp-user-123',
      contract: mockContract,
      confirmed: false,
      corrections: 'Please add more troubleshooting practice',
    });

    const response = await confirmContractPost(request as any);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.data.onboardingComplete).toBe(false);
    expect(data.data.nextStep).toBe('revise-contract');
    expect(data.message).toContain('Corrections received');
  });

  it('should reject user ID mismatch', async () => {
    const request = createMockRequest(
      {
        userId: 'different-user-456',
        contract: mockContract,
        confirmed: true,
      },
      { 'x-user-id': 'temp-user-123' }
    );

    const response = await confirmContractPost(request as any);
    const data = await response.json();

    expect(response.status).toBe(403);
    expect(data.success).toBe(false);
    expect(data.error.code).toBe('FORBIDDEN');
  });

  it('should validate contract structure', async () => {
    const request = createMockRequest({
      userId: 'temp-user-123',
      contract: {
        // Invalid contract - missing required fields
        profileSummary: 'Summary',
      },
      confirmed: true,
    });

    const response = await confirmContractPost(request as any);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.success).toBe(false);
  });
});

// ============================================
// Integration Tests
// ============================================

describe('Onboarding Flow Integration', () => {
  it('should complete full onboarding flow', async () => {
    // Step 1: Save topic
    const topicRequest = createMockRequest({
      topicId: '123e4567-e89b-12d3-a456-426614174000',
      topicName: 'Docker',
    });
    const topicResponse = await topicPost(topicRequest as any);
    expect(topicResponse.status).toBe(201);

    // Step 2: Save questionnaire
    const { id, createdAt, updatedAt, ...profileData } =
      mockUserProfile;
    const questionnaireRequest = createMockRequest(profileData);
    const questionnaireResponse = await questionnairePost(
      questionnaireRequest as any
    );
    expect(questionnaireResponse.status).toBe(201);

    // Step 3: Generate contract
    (
      contractGenerator.generateLearningContractSummary as jest.Mock
    ).mockResolvedValue(mockContract);

    const generateRequest = createMockRequest({
      userProfile: mockUserProfile,
    });
    const generateResponse = await generateContractPost(
      generateRequest as any
    );
    expect(generateResponse.status).toBe(200);

    // Step 4: Confirm contract
    const confirmRequest = createMockRequest({
      userId: 'temp-user-123',
      contract: mockContract,
      confirmed: true,
    });
    const confirmResponse = await confirmContractPost(
      confirmRequest as any
    );
    expect(confirmResponse.status).toBe(200);

    const confirmData = await confirmResponse.json();
    expect(confirmData.data.onboardingComplete).toBe(true);
  });
});
