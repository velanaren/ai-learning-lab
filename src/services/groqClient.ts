/**
 * Groq API Client
 *
 * Wrapper for Groq SDK providing:
 * - Text generation with retry logic and error handling
 * - Learning contract generation
 * - Concept explanation generation
 * - Rate limiting awareness
 * - Privacy-safe logging
 *
 * @module services/groqClient
 */

// Import Groq SDK with Node.js shims for fetch polyfill
import 'groq-sdk/shims/node';
import Groq from 'groq-sdk';
import type { UserProfile } from '@/types/userProfile';
import type { Concept } from '@/types/topicGraph';
import type { ContentFormatPolicy } from '@/types/learningStrategy';

// ============================================
// Configuration
// ============================================

/**
 * Groq model options
 */
export enum GroqModel {
  /** Best quality model for complex tasks */
  LLAMA_70B = 'llama-3.3-70b-versatile',
  /** Fast model for simple tasks */
  LLAMA_8B = 'llama3-8b-8192',
  /** Long context model */
  MIXTRAL = 'mixtral-8x7b-32768',
}

/**
 * Default configuration
 */
const DEFAULT_CONFIG = {
  /** Default model to use */
  model: GroqModel.LLAMA_70B,
  /** Maximum retry attempts */
  maxRetries: 3,
  /** Initial retry delay in milliseconds */
  retryDelay: 1000,
  /** Request timeout in milliseconds */
  timeout: 30000,
  /** Rate limit (requests per minute for free tier) */
  rateLimit: 30,
} as const;

/**
 * Options for text generation
 */
export interface GenerateOptions {
  /** Model to use (defaults to LLAMA_70B) */
  model?: GroqModel;
  /** Temperature for randomness (0-2, default 0.7) */
  temperature?: number;
  /** Maximum tokens to generate (default 1024) */
  maxTokens?: number;
  /** System prompt for context */
  systemPrompt?: string;
}

// ============================================
// Error Types
// ============================================

/**
 * Custom error for Groq API errors
 */
export class GroqAPIError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public cause?: Error
  ) {
    super(message);
    this.name = 'GroqAPIError';
  }
}

// ============================================
// Rate Limiter
// ============================================

/**
 * Simple rate limiter to track requests
 */
class RateLimiter {
  private requests: number[] = [];
  private readonly limit: number;
  private readonly windowMs: number = 60000; // 1 minute

  constructor(limit: number) {
    this.limit = limit;
  }

  /**
   * Check if we can make a request
   */
  canMakeRequest(): boolean {
    this.cleanOldRequests();
    return this.requests.length < this.limit;
  }

  /**
   * Record a request
   */
  recordRequest(): void {
    this.requests.push(Date.now());
  }

  /**
   * Get time until next available slot
   */
  getWaitTime(): number {
    this.cleanOldRequests();
    if (this.canMakeRequest()) {
      return 0;
    }
    // Wait until oldest request expires
    const oldestRequest = this.requests[0];
    return oldestRequest + this.windowMs - Date.now();
  }

  /**
   * Remove requests older than the time window
   */
  private cleanOldRequests(): void {
    const now = Date.now();
    this.requests = this.requests.filter((time) => now - time < this.windowMs);
  }
}

// ============================================
// Groq Client Class
// ============================================

/**
 * Groq API client with retry logic and rate limiting
 */
class GroqClient {
  private client: Groq;
  private rateLimiter: RateLimiter;
  private requestCount: number = 0;

  constructor() {
    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) {
      throw new GroqAPIError(
        'GROQ_API_KEY environment variable is not set. Please add it to your .env file.'
      );
    }

    this.client = new Groq({ apiKey });
    this.rateLimiter = new RateLimiter(DEFAULT_CONFIG.rateLimit);
  }

  /**
   * Generate text with retry logic and error handling
   *
   * @param prompt - The prompt to send to the model
   * @param options - Generation options
   * @returns Generated text
   * @throws GroqAPIError if generation fails after retries
   */
  async generateText(
    prompt: string,
    options: GenerateOptions = {}
  ): Promise<string> {
    const {
      model = DEFAULT_CONFIG.model,
      temperature = 0.7,
      maxTokens = 1024,
      systemPrompt,
    } = options;

    const messages: Groq.Chat.ChatCompletionMessageParam[] = [];

    if (systemPrompt) {
      messages.push({
        role: 'system',
        content: systemPrompt,
      });
    }

    messages.push({
      role: 'user',
      content: prompt,
    });

    let lastError: Error | undefined;

    for (let attempt = 0; attempt < DEFAULT_CONFIG.maxRetries; attempt++) {
      try {
        // Check rate limit
        if (!this.rateLimiter.canMakeRequest()) {
          const waitTime = this.rateLimiter.getWaitTime();
          this.log('rate-limit', `Waiting ${waitTime}ms before retry`);
          await this.sleep(waitTime);
        }

        // Record request
        this.rateLimiter.recordRequest();
        this.requestCount++;

        const startTime = Date.now();

        // Make request with timeout
        const response = await Promise.race([
          this.client.chat.completions.create({
            model,
            messages,
            temperature,
            max_tokens: maxTokens,
          }),
          this.timeoutPromise(),
        ]);

        const duration = Date.now() - startTime;
        this.log('success', `Request completed in ${duration}ms`);

        const content = response.choices[0]?.message?.content;

        if (!content) {
          throw new GroqAPIError('Empty response from Groq API');
        }

        return content;
      } catch (error) {
        lastError = error as Error;
        const isLastAttempt = attempt === DEFAULT_CONFIG.maxRetries - 1;

        // Handle different error types
        if (this.isTimeoutError(error)) {
          this.log('error', 'Request timeout');
          if (!isLastAttempt) {
            await this.sleep(this.getBackoffDelay(attempt));
            continue;
          }
        } else if (this.isRateLimitError(error)) {
          this.log('error', 'Rate limit exceeded');
          if (!isLastAttempt) {
            await this.sleep(this.getBackoffDelay(attempt));
            continue;
          }
        } else if (this.isRetriableError(error)) {
          this.log('error', `Retriable error: ${error}`);
          if (!isLastAttempt) {
            await this.sleep(this.getBackoffDelay(attempt));
            continue;
          }
        } else {
          // Non-retriable error, throw immediately
          this.log('error', `Non-retriable error: ${error}`);
          throw this.wrapError(error);
        }
      }
    }

    // All retries exhausted
    throw new GroqAPIError(
      `Failed after ${DEFAULT_CONFIG.maxRetries} attempts`,
      undefined,
      lastError
    );
  }

  /**
   * Generate personalized learning contract from user profile
   *
   * @param userProfile - User profile from questionnaire
   * @returns Formatted markdown learning contract
   */
  async generateLearningContract(
    userProfile: UserProfile
  ): Promise<string> {
    const systemPrompt = `You are an expert learning coach creating a personalized learning contract.

Your task is to analyze the user's profile and explain the learning approach in a clear, encouraging way.

Format the response as markdown with these sections:
1. **Your Learning Profile** - Summarize their background and goals
2. **Your Learning Approach** - Explain how we'll teach based on their preferences
3. **Daily Structure** - Describe what a typical day looks like
4. **Content Format** - Explain how content will be presented
5. **When You Skip Days** - Explain what happens if they miss days
6. **What We'll Track** - Describe the tracking approach
7. **What We'll Emphasize** - List key areas of focus
8. **What We'll Skip** - List what we won't cover (for now)

Keep it warm, concise, and use "we" language. Focus on connecting their answers to design decisions.`;

    const prompt = `Create a learning contract for this user profile:

**Background:**
- Role: ${userProfile.role}
- Baseline Skills: ${userProfile.baselineSkills.join(', ')}
- Prior Experience: ${userProfile.priorExperience}

**Goals:**
- Goals: ${userProfile.goals.join(', ')}
- Desired Outcomes: ${userProfile.outcomes.join(', ')}
- Mastery Level: ${userProfile.masteryLevel}

**Learning Style:**
- Learning Flow: ${userProfile.learningFlow}
- Complexity Preference: ${userProfile.complexityPref}
- Troubleshooting Importance: ${userProfile.troubleshooting}
- Frustration Preference: ${userProfile.frustrationPref}
- Depth Preference: ${userProfile.depthPref}

**Time Commitment:**
- Daily Minutes: ${userProfile.dailyMinutes}
- Weekly Hours: ${userProfile.weeklyHours}
- Pacing Preference: ${userProfile.pacingPref}

**Comfort & Accessibility:**
- Learning Formats: ${userProfile.comfortPrefs.learningFormats.join(', ')}
- Video Preference: ${userProfile.comfortPrefs.videoPreference}
- Overwhelm Triggers: ${userProfile.comfortPrefs.overwhelmTriggers.join(', ')}
- Session Style: ${userProfile.comfortPrefs.sessionStyle}
- Content Order: ${userProfile.comfortPrefs.contentOrder}
- Skip Behavior: ${userProfile.comfortPrefs.skipBehavior}

**Application & Tracking:**
- Application Comfort: ${userProfile.applicationPref.join(', ')}
- Tracking Preference: ${userProfile.trackingPref}
- Evidence Importance: ${userProfile.evidencePref}

**Platform:**
- Platform: ${userProfile.platform}
- Tool Install Comfort: ${userProfile.toolInstallComfort}

Generate a personalized learning contract that explains how we'll use these preferences.`;

    return this.generateText(prompt, {
      systemPrompt,
      model: GroqModel.LLAMA_70B,
      temperature: 0.7,
      maxTokens: 2048,
    });
  }

  /**
   * Generate concept explanation adapted to user preferences
   *
   * @param concept - The concept to explain
   * @param preferences - User's content format preferences
   * @returns Formatted concept explanation
   */
  async generateConceptExplanation(
    concept: Concept,
    preferences: ContentFormatPolicy
  ): Promise<string> {
    const systemPrompt = `You are an expert technical educator creating concept explanations.

Follow these content preferences:
- Text-first: ${preferences.textFirst}
- Use Analogies: ${preferences.useAnalogies}
- Include Checkpoints: ${preferences.includeCheckpoints}
- Max New Terms: ${preferences.maxNewTerms}
- Content Order: ${preferences.contentOrder}

Structure your explanation to match the user's learning style.
Keep it clear, concise, and actionable.`;

    const contentOrderInstructions = {
      'tldr-first': 'Start with a TL;DR summary, then provide details.',
      'details-first': 'Explain in detail first, then provide a summary.',
      'example-first': 'Start with a concrete example, then explain the concept.',
    };

    const prompt = `Explain this concept:

**Title:** ${concept.title}

**Why It Matters:** ${concept.whyItMatters}

**Common Confusions:**
${concept.commonConfusions.map((c) => `- ${c}`).join('\n')}

**Content Order:** ${contentOrderInstructions[preferences.contentOrder]}

**Instructions:**
1. ${preferences.useAnalogies ? 'Use 1-2 clear analogies to explain complex parts.' : 'Focus on direct explanations without analogies.'}
2. Introduce no more than ${preferences.maxNewTerms} new technical terms.
3. ${preferences.includeCheckpoints ? 'Include checkpoint summaries after each major section.' : 'Keep it flowing without checkpoint breaks.'}
4. Address the common confusions listed above.
5. Keep the explanation to 5-7 minutes of reading time.

Generate the explanation as markdown.`;

    return this.generateText(prompt, {
      systemPrompt,
      model: GroqModel.LLAMA_70B,
      temperature: 0.7,
      maxTokens: 1536,
    });
  }

  // ============================================
  // Helper Methods
  // ============================================

  /**
   * Create a timeout promise
   */
  private timeoutPromise(): Promise<never> {
    return new Promise((_, reject) => {
      setTimeout(() => {
        reject(new Error('Request timeout'));
      }, DEFAULT_CONFIG.timeout);
    });
  }

  /**
   * Sleep for specified milliseconds
   */
  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * Get exponential backoff delay
   */
  private getBackoffDelay(attempt: number): number {
    return DEFAULT_CONFIG.retryDelay * Math.pow(2, attempt);
  }

  /**
   * Check if error is a timeout
   */
  private isTimeoutError(error: unknown): boolean {
    return error instanceof Error && error.message.includes('timeout');
  }

  /**
   * Check if error is a rate limit error
   */
  private isRateLimitError(error: unknown): boolean {
    if (error && typeof error === 'object' && 'status' in error) {
      return (error as { status?: number }).status === 429;
    }
    return false;
  }

  /**
   * Check if error is retriable
   */
  private isRetriableError(error: unknown): boolean {
    // Retry on network errors and 5xx server errors
    if (error && typeof error === 'object' && 'status' in error) {
      const status = (error as { status?: number }).status;
      return status !== undefined && (status >= 500 || status === 429);
    }
    return error instanceof Error && error.message.includes('network');
  }

  /**
   * Wrap error in GroqAPIError
   */
  private wrapError(error: unknown): GroqAPIError {
    if (error instanceof GroqAPIError) {
      return error;
    }

    if (error && typeof error === 'object') {
      if ('status' in error) {
        const status = (error as { status?: number }).status;
        if (status === 401) {
          return new GroqAPIError(
            'Invalid API key. Please check your GROQ_API_KEY environment variable.',
            401,
            error as Error
          );
        }
        if (status === 429) {
          return new GroqAPIError(
            'Rate limit exceeded. Please try again later.',
            429,
            error as Error
          );
        }
        if (status && status >= 500) {
          return new GroqAPIError(
            'Groq server error. Please try again later.',
            status,
            error as Error
          );
        }
      }
    }

    return new GroqAPIError(
      'Unknown error occurred',
      undefined,
      error as Error
    );
  }

  /**
   * Privacy-safe logging
   * Logs request metadata without exposing sensitive data
   */
  private log(
    type: 'success' | 'error' | 'rate-limit',
    message: string
  ): void {
    const timestamp = new Date().toISOString();
    const logMessage = `[GroqClient] [${type.toUpperCase()}] ${timestamp} - ${message} (Total requests: ${this.requestCount})`;

    if (type === 'error') {
      console.error(logMessage);
    } else {
      console.log(logMessage);
    }
  }
}

// ============================================
// Singleton Instance
// ============================================

let groqClientInstance: GroqClient | null = null;

/**
 * Get or create the Groq client instance
 */
export function getGroqClient(): GroqClient {
  if (!groqClientInstance) {
    groqClientInstance = new GroqClient();
  }
  return groqClientInstance;
}

// ============================================
// Public API
// ============================================

/**
 * Generate text using Groq API
 *
 * @param prompt - The prompt to send
 * @param options - Generation options
 * @returns Generated text
 */
export async function generateText(
  prompt: string,
  options?: GenerateOptions
): Promise<string> {
  const client = getGroqClient();
  return client.generateText(prompt, options);
}

/**
 * Generate personalized learning contract
 *
 * @param userProfile - User profile from questionnaire
 * @returns Learning contract in markdown format
 */
export async function generateLearningContract(
  userProfile: UserProfile
): Promise<string> {
  const client = getGroqClient();
  return client.generateLearningContract(userProfile);
}

/**
 * Generate concept explanation
 *
 * @param concept - Concept to explain
 * @param preferences - Content format preferences
 * @returns Concept explanation in markdown format
 */
export async function generateConceptExplanation(
  concept: Concept,
  preferences: ContentFormatPolicy
): Promise<string> {
  const client = getGroqClient();
  return client.generateConceptExplanation(concept, preferences);
}

/**
 * Reset the Groq client instance (useful for testing)
 */
export function resetGroqClient(): void {
  groqClientInstance = null;
}
