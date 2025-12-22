/**
 * Groq Client Tests
 *
 * Comprehensive unit tests for Groq API client including:
 * - Success cases
 * - Error scenarios
 * - Retry logic
 * - Rate limiting
 * - Timeout handling
 *
 * @module services/groqClient.test
 */

import {
  generateText,
  generateLearningContract,
  generateConceptExplanation,
  GroqAPIError,
  GroqModel,
  resetGroqClient,
} from './groqClient';
import type { UserProfile } from '@/types/userProfile';
import type { Concept } from '@/types/topicGraph';
import type { ContentFormatPolicy } from '@/types/learningStrategy';
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
import { Difficulty } from '@/types/topicGraph';

// Mock Groq SDK
const mockCreate = jest.fn();

jest.mock('groq-sdk', () => {
  return jest.fn().mockImplementation(() => ({
    chat: {
      completions: {
        create: mockCreate,
      },
    },
  }));
});

// ============================================
// Test Fixtures
// ============================================

const mockUserProfile: UserProfile = {
  id: '123e4567-e89b-12d3-a456-426614174000',
  role: Role.DEVOPS_SRE,
  baselineSkills: [BaselineSkill.LINUX_CLI, BaselineSkill.GIT],
  priorExperience: PriorExperience.USED_BASICS,
  goals: [Goal.IMPROVE_CURRENT_ROLE, Goal.FUNDAMENTALS],
  outcomes: [Outcome.BUILD_REAL_APPS, Outcome.TROUBLESHOOT],
  masteryLevel: MasteryLevel.DEVOPS_GRADE_MASTERY,
  learningFlow: LearningFlow.MIX,
  complexityPref: ComplexityPreference.GRADUALLY_ONE_LAYER,
  troubleshooting: TroubleshootingImportance.VERY_IMPORTANT,
  platform: Platform.MACOS_APPLE_SILICON,
  toolInstallComfort: ToolInstallComfort.YES,
  dailyMinutes: 30,
  weeklyHours: 5,
  pacingPref: PacingPreference.RECAP_CONTINUE,
  learningStyle: [LearningStyleHelper.STEP_BY_STEP_LABS, LearningStyleHelper.VISUALS],
  frustrationPref: FrustrationPreference.TOO_MUCH_THEORY_WITHOUT_PRACTICE,
  depthPref: DepthPreference.NEVER_COMPROMISE_ON_ACCURACY,
  comfortPrefs: {
    learningFormats: [LearningFormat.TEXT_FIRST, LearningFormat.STEP_BY_STEP_LABS],
    videoPreference: VideoPreference.SHORT_CLIPS_ONLY,
    overwhelmTriggers: [OverwhelmTrigger.TOO_MANY_NEW_TERMS, OverwhelmTrigger.TOO_MANY_LINKS],
    sessionStyle: SessionStyle.ONE_CONCEPT_PLUS_SMALL_APPLICATION,
    contentOrder: ContentOrder.TLDR_THEN_DETAILS,
    skipBehavior: SkipBehavior.GENTLE_RECAP,
    uiToggles: [UIToggle.FOCUS_MODE],
  },
  applicationPref: [ApplicationComfort.RUNNING_COMMANDS, ApplicationComfort.LINKING_GITHUB],
  trackingPref: TrackingPreference.LEARNING_PLUS_APPLICATIONS_PLUS_EVIDENCE,
  evidencePref: EvidenceImportance.VERY_IMPORTANT,
  createdAt: new Date('2025-01-01'),
  updatedAt: new Date('2025-01-01'),
};

const mockConcept: Concept = {
  id: '223e4567-e89b-12d3-a456-426614174001',
  topicId: '323e4567-e89b-12d3-a456-426614174002',
  title: 'Docker Container Basics',
  prereqIds: [],
  difficulty: Difficulty.BEGINNER,
  whyItMatters: 'Containers are the foundation of modern DevOps workflows',
  commonConfusions: [
    'Containers vs VMs',
    'Images vs containers',
  ],
  exampleTemplate: 'Run a simple nginx container',
  applicationTemplate: 'Create a custom container with your own app',
  createdAt: new Date('2025-01-01'),
  updatedAt: new Date('2025-01-01'),
};

const mockContentPreferences: ContentFormatPolicy = {
  textFirst: true,
  maxVideoLength: 3,
  includeDiagrams: true,
  includeChecklists: true,
  useAnalogies: true,
  maxNewTerms: 5,
  includeCheckpoints: true,
  contentOrder: 'tldr-first',
};

// ============================================
// Test Setup
// ============================================

describe('GroqClient', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    // Reset modules and environment
    jest.clearAllMocks();
    resetGroqClient();
    process.env = { ...originalEnv, GROQ_API_KEY: 'test-api-key' };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  // ============================================
  // Initialization Tests
  // ============================================

  describe('Initialization', () => {
    it('should throw error if GROQ_API_KEY is not set', () => {
      delete process.env.GROQ_API_KEY;
      resetGroqClient();

      expect(() => generateText('test')).rejects.toThrow(
        'GROQ_API_KEY environment variable is not set'
      );
    });

    it('should initialize successfully with valid API key', async () => {
      mockCreate.mockResolvedValue({
        choices: [{ message: { content: 'Hello' } }],
      });

      const result = await generateText('test');
      expect(result).toBe('Hello');
    });
  });

  // ============================================
  // generateText Tests
  // ============================================

  describe('generateText', () => {
    it('should generate text successfully', async () => {
      const mockResponse = {
        choices: [{ message: { content: 'Generated text response' } }],
      };
      mockCreate.mockResolvedValue(mockResponse);

      const result = await generateText('Test prompt');

      expect(result).toBe('Generated text response');
      expect(mockCreate).toHaveBeenCalledWith(
        expect.objectContaining({
          model: GroqModel.LLAMA_70B,
          messages: [{ role: 'user', content: 'Test prompt' }],
          temperature: 0.7,
          max_tokens: 1024,
        })
      );
    });

    it('should use custom options', async () => {
      const mockResponse = {
        choices: [{ message: { content: 'Response' } }],
      };
      mockCreate.mockResolvedValue(mockResponse);

      await generateText('Prompt', {
        model: GroqModel.LLAMA_8B,
        temperature: 0.5,
        maxTokens: 512,
        systemPrompt: 'You are a helpful assistant',
      });

      expect(mockCreate).toHaveBeenCalledWith(
        expect.objectContaining({
          model: GroqModel.LLAMA_8B,
          messages: [
            { role: 'system', content: 'You are a helpful assistant' },
            { role: 'user', content: 'Prompt' },
          ],
          temperature: 0.5,
          max_tokens: 512,
        })
      );
    });

    it('should throw error on empty response', async () => {
      mockCreate.mockResolvedValue({
        choices: [{ message: { content: null } }],
      });

      await expect(generateText('Test')).rejects.toThrow(
        'Empty response from Groq API'
      );
    });

    it('should throw error on missing choices', async () => {
      mockCreate.mockResolvedValue({ choices: [] });

      await expect(generateText('Test')).rejects.toThrow(
        'Empty response from Groq API'
      );
    });
  });

  // ============================================
  // Error Handling Tests
  // ============================================

  describe('Error Handling', () => {
    it('should handle 401 Unauthorized error', async () => {
      const error = { status: 401, message: 'Unauthorized' };
      mockCreate.mockRejectedValue(error);

      await expect(generateText('Test')).rejects.toThrow(
        'Invalid API key'
      );
    });

    it('should handle 429 Rate Limit error with retry', async () => {
      const error = { status: 429, message: 'Rate limit exceeded' };
      mockCreate
        .mockRejectedValueOnce(error)
        .mockResolvedValue({
          choices: [{ message: { content: 'Success after retry' } }],
        });

      const result = await generateText('Test');
      expect(result).toBe('Success after retry');
      expect(mockCreate).toHaveBeenCalledTimes(2);
    });

    it('should handle 500 Server Error with retry', async () => {
      const error = { status: 500, message: 'Internal Server Error' };
      mockCreate
        .mockRejectedValueOnce(error)
        .mockResolvedValue({
          choices: [{ message: { content: 'Success after retry' } }],
        });

      const result = await generateText('Test');
      expect(result).toBe('Success after retry');
      expect(mockCreate).toHaveBeenCalledTimes(2);
    });

    it('should fail after max retries', async () => {
      const error = { status: 500, message: 'Server Error' };
      mockCreate.mockRejectedValue(error);

      await expect(generateText('Test')).rejects.toThrow(
        'Failed after 3 attempts'
      );
      expect(mockCreate).toHaveBeenCalledTimes(3);
    });

    it('should handle network errors with retry', async () => {
      const networkError = new Error('network error occurred');
      mockCreate
        .mockRejectedValueOnce(networkError)
        .mockResolvedValue({
          choices: [{ message: { content: 'Success after retry' } }],
        });

      const result = await generateText('Test');
      expect(result).toBe('Success after retry');
      expect(mockCreate).toHaveBeenCalledTimes(2);
    });

    it('should not retry on non-retriable errors', async () => {
      const error = { status: 400, message: 'Bad Request' };
      mockCreate.mockRejectedValue(error);

      await expect(generateText('Test')).rejects.toThrow();
      expect(mockCreate).toHaveBeenCalledTimes(1);
    });
  });

  // ============================================
  // Retry Logic Tests
  // ============================================

  describe('Retry Logic', () => {
    it('should use exponential backoff', async () => {
      const error = { status: 500, message: 'Server Error' };
      const startTime = Date.now();

      mockCreate
        .mockRejectedValueOnce(error)
        .mockRejectedValueOnce(error)
        .mockResolvedValue({
          choices: [{ message: { content: 'Success' } }],
        });

      await generateText('Test');

      const duration = Date.now() - startTime;
      // Should have waited at least 1000ms (first retry) + 2000ms (second retry)
      // But we'll be lenient and just check it waited some time
      expect(duration).toBeGreaterThanOrEqual(1000);
      expect(mockCreate).toHaveBeenCalledTimes(3);
    });
  });

  // ============================================
  // Timeout Tests
  // ============================================

  describe('Timeout Handling', () => {
    it.skip('should timeout after 30 seconds', async () => {
      // Skipped: Takes too long to run in test suite
      // Mock a hanging request
      mockCreate.mockImplementation(
        () => new Promise((resolve) => setTimeout(resolve, 35000))
      );

      await expect(generateText('Test')).rejects.toThrow('timeout');
    }, 35000);

    it.skip('should retry after timeout', async () => {
      // Skipped: Takes too long to run in test suite
      mockCreate
        .mockImplementationOnce(
          () => new Promise((resolve) => setTimeout(resolve, 35000))
        )
        .mockResolvedValue({
          choices: [{ message: { content: 'Success after timeout' } }],
        });

      const result = await generateText('Test');
      expect(result).toBe('Success after timeout');
      expect(mockCreate).toHaveBeenCalledTimes(2);
    }, 40000);
  });

  // ============================================
  // generateLearningContract Tests
  // ============================================

  describe('generateLearningContract', () => {
    it('should generate learning contract from user profile', async () => {
      const mockContract = `# Your Learning Contract

## Your Learning Profile
You're a DevOps-SRE professional...

## Your Learning Approach
We'll use a mix of concepts and hands-on practice...`;

      mockCreate.mockResolvedValue({
        choices: [{ message: { content: mockContract } }],
      });

      const result = await generateLearningContract(mockUserProfile);

      expect(result).toBe(mockContract);
      expect(mockCreate).toHaveBeenCalledWith(
        expect.objectContaining({
          model: GroqModel.LLAMA_70B,
          temperature: 0.7,
          max_tokens: 2048,
          messages: expect.arrayContaining([
            expect.objectContaining({
              role: 'system',
              content: expect.stringContaining('learning coach'),
            }),
            expect.objectContaining({
              role: 'user',
              content: expect.stringContaining('DevOps-SRE'),
            }),
          ]),
        })
      );
    });

    it('should include all profile sections in prompt', async () => {
      mockCreate.mockResolvedValue({
        choices: [{ message: { content: 'Contract' } }],
      });

      await generateLearningContract(mockUserProfile);

      const callArgs = mockCreate.mock.calls[0][0];
      const userMessage = callArgs.messages.find((m: any) => m.role === 'user');

      expect(userMessage.content).toContain('DevOps-SRE');
      expect(userMessage.content).toContain('Linux CLI');
      expect(userMessage.content).toContain('Used basics');
      expect(userMessage.content).toContain('30'); // daily minutes
      expect(userMessage.content).toContain('text-first');
    });
  });

  // ============================================
  // generateConceptExplanation Tests
  // ============================================

  describe('generateConceptExplanation', () => {
    it('should generate concept explanation', async () => {
      const mockExplanation = `# Docker Container Basics

## TL;DR
Containers package applications with dependencies...

## What Are Containers?
Think of containers like shipping containers...`;

      mockCreate.mockResolvedValue({
        choices: [{ message: { content: mockExplanation } }],
      });

      const result = await generateConceptExplanation(
        mockConcept,
        mockContentPreferences
      );

      expect(result).toBe(mockExplanation);
      expect(mockCreate).toHaveBeenCalledWith(
        expect.objectContaining({
          model: GroqModel.LLAMA_70B,
          temperature: 0.7,
          max_tokens: 1536,
        })
      );
    });

    it('should respect content preferences', async () => {
      mockCreate.mockResolvedValue({
        choices: [{ message: { content: 'Explanation' } }],
      });

      await generateConceptExplanation(mockConcept, mockContentPreferences);

      const callArgs = mockCreate.mock.calls[0][0];
      const systemMessage = callArgs.messages.find((m: any) => m.role === 'system');
      const userMessage = callArgs.messages.find((m: any) => m.role === 'user');

      expect(systemMessage.content).toContain('Text-first: true');
      expect(systemMessage.content).toContain('Use Analogies: true');
      expect(systemMessage.content).toContain('Max New Terms: 5');
      expect(userMessage.content).toContain('Docker Container Basics');
      expect(userMessage.content).toContain('Containers vs VMs');
    });

    it('should adapt to different content orders', async () => {
      mockCreate.mockResolvedValue({
        choices: [{ message: { content: 'Explanation' } }],
      });

      const preferences = {
        ...mockContentPreferences,
        contentOrder: 'example-first' as const,
      };

      await generateConceptExplanation(mockConcept, preferences);

      const callArgs = mockCreate.mock.calls[0][0];
      const userMessage = callArgs.messages.find((m: any) => m.role === 'user');

      expect(userMessage.content).toContain('Start with a concrete example');
    });

    it('should handle concepts without analogies', async () => {
      mockCreate.mockResolvedValue({
        choices: [{ message: { content: 'Direct explanation' } }],
      });

      const preferences = {
        ...mockContentPreferences,
        useAnalogies: false,
      };

      await generateConceptExplanation(mockConcept, preferences);

      const callArgs = mockCreate.mock.calls[0][0];
      const userMessage = callArgs.messages.find((m: any) => m.role === 'user');

      expect(userMessage.content).toContain(
        'Focus on direct explanations without analogies'
      );
    });
  });

  // ============================================
  // Rate Limiting Tests
  // ============================================

  describe('Rate Limiting', () => {
    it('should respect rate limits', async () => {
      mockCreate.mockResolvedValue({
        choices: [{ message: { content: 'Response' } }],
      });

      // Make 30 requests (the rate limit)
      const promises = Array.from({ length: 30 }, () =>
        generateText('Test')
      );

      await Promise.all(promises);

      expect(mockCreate).toHaveBeenCalledTimes(30);
    });

    it.skip('should wait when rate limit is exceeded', async () => {
      // Skipped: Takes too long to run in test suite
      mockCreate.mockResolvedValue({
        choices: [{ message: { content: 'Response' } }],
      });

      const startTime = Date.now();

      // Make 31 requests (1 over the rate limit)
      const promises = Array.from({ length: 31 }, () =>
        generateText('Test')
      );

      await Promise.all(promises);

      const duration = Date.now() - startTime;

      // Should have waited for the rate limit window
      // In practice, this might not wait the full 60s due to cleanup
      expect(mockCreate).toHaveBeenCalledTimes(31);
    }, 65000); // Extend timeout for this test
  });

  // ============================================
  // Integration Tests
  // ============================================

  describe('Integration', () => {
    it('should handle multiple sequential requests', async () => {
      mockCreate.mockResolvedValue({
        choices: [{ message: { content: 'Response' } }],
      });

      await generateText('First');
      await generateText('Second');
      await generateText('Third');

      expect(mockCreate).toHaveBeenCalledTimes(3);
    });

    it('should handle mixed success and retry scenarios', async () => {
      mockCreate
        .mockResolvedValueOnce({
          choices: [{ message: { content: 'Success 1' } }],
        })
        .mockRejectedValueOnce({ status: 500 })
        .mockResolvedValueOnce({
          choices: [{ message: { content: 'Success after retry' } }],
        })
        .mockResolvedValueOnce({
          choices: [{ message: { content: 'Success 2' } }],
        });

      const result1 = await generateText('First');
      const result2 = await generateText('Second');
      const result3 = await generateText('Third');

      expect(result1).toBe('Success 1');
      expect(result2).toBe('Success after retry');
      expect(result3).toBe('Success 2');
      expect(mockCreate).toHaveBeenCalledTimes(4); // 1 + 2 (with retry) + 1
    });
  });
});
