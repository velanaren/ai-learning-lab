/**
 * Learning Contract Generator Service
 *
 * Transforms user profile from questionnaire into a personalized learning contract.
 * Generates natural language summaries that connect questionnaire answers to
 * specific course design decisions.
 *
 * @module services/learningContractGenerator
 * @see PRD Requirements R3.1-R3.4
 */

import { generateLearningContract } from './groqClient';
import type { UserProfile } from '@/types/userProfile';
import type { LearningContractSummary } from '@/types/learningStrategy';
import {
  learningContractSummarySchema,
  type LearningContractSummary as LCSType,
} from '@/types/learningStrategy';

// ============================================
// Error Types
// ============================================

/**
 * Error thrown when contract generation fails
 */
export class ContractGenerationError extends Error {
  constructor(
    message: string,
    public cause?: Error
  ) {
    super(message);
    this.name = 'ContractGenerationError';
  }
}

/**
 * Error thrown when contract parsing fails
 */
export class ContractParsingError extends Error {
  constructor(
    message: string,
    public cause?: Error
  ) {
    super(message);
    this.name = 'ContractParsingError';
  }
}

// ============================================
// Helper Functions
// ============================================

/**
 * Build a detailed system prompt for learning contract generation
 */
function buildSystemPrompt(): string {
  return `You are an expert learning coach creating personalized learning contracts.

Your task is to analyze a user's questionnaire responses and generate a clear, warm, encouraging learning contract summary.

CRITICAL REQUIREMENTS:
1. Use natural, conversational language ("you're", "we'll", not formal)
2. Connect specific questionnaire answers to specific design decisions
3. Make all design decisions explicit and transparent
4. Use the exact structure provided in the user prompt
5. Keep each section focused and concise (2-4 sentences per section)
6. Be specific - mention actual values from their profile (platform, tools, time commitments)
7. End with encouragement and a question asking for confirmation/corrections

TONE:
- Warm and encouraging
- Professional but friendly
- Use "you" and "we" language
- Avoid jargon unless necessary
- Show you understand their specific context

Remember: This contract is a commitment between you and the learner. It should feel personal and tailored to their exact needs.`;
}

/**
 * Build learning approach description based on profile
 */
function buildLearningApproach(profile: UserProfile): string {
  const approaches: string[] = [];

  // Learning flow
  const flowMap = {
    'concepts-first': 'Start with concepts first, then hands-on practice',
    'build-first': 'Start with hands-on building, then explain concepts',
    mix: 'Mix concepts and hands-on practice throughout',
  };
  approaches.push(flowMap[profile.learningFlow]);

  // Complexity preference
  const complexityMap = {
    'gradually one layer':
      'Increase complexity gradually, one layer at a time',
    'through realistic projects':
      'Build complexity through realistic project scenarios',
  };
  approaches.push(complexityMap[profile.complexityPref]);

  // Troubleshooting
  const troubleshootingMap = {
    low: 'Include light troubleshooting practice',
    some: 'Include moderate troubleshooting practice',
    'very important': 'Include extensive troubleshooting practice',
  };
  approaches.push(troubleshootingMap[profile.troubleshooting]);

  // Mastery level
  approaches.push(
    `Target "${profile.masteryLevel}" mastery level`
  );

  return approaches.join('\n- ');
}

/**
 * Build content format description based on profile
 */
function buildContentFormat(profile: UserProfile): string {
  const formats: string[] = [];

  // Learning formats
  if (profile.comfortPrefs.learningFormats.includes('text-first')) {
    formats.push('Text-first learning');
  }
  if (
    profile.comfortPrefs.learningFormats.includes(
      'diagrams/mental models'
    )
  ) {
    formats.push('Diagrams and mental models for complex concepts');
  }
  if (
    profile.comfortPrefs.learningFormats.includes(
      'step-by-step labs'
    )
  ) {
    formats.push('Step-by-step hands-on labs');
  }

  // Video preference
  const videoMap = {
    'avoid audio-video': 'No video content',
    'short clips only': 'Short video clips (≤3 min) only when truly needed',
    '5–10 min occasionally':
      'Occasional video content (5-10 min) for demonstrations',
    'longer videos ok': 'Video content when helpful',
  };
  formats.push(videoMap[profile.comfortPrefs.videoPreference]);

  // Overwhelm triggers
  if (
    profile.comfortPrefs.overwhelmTriggers.includes(
      'too many new terms'
    )
  ) {
    formats.push('Limit new technical terms per concept');
  }
  if (
    profile.comfortPrefs.overwhelmTriggers.includes('too many links')
  ) {
    formats.push('Minimal external links to avoid distraction');
  }

  // Content order
  const orderMap = {
    'TL;DR → details': 'Start with TL;DR, then dive into details',
    'details → summary': 'Detailed explanation first, summary at end',
    'example → explanation':
      'Show concrete example first, then explain concept',
  };
  formats.push(orderMap[profile.comfortPrefs.contentOrder]);

  return formats.join('\n- ');
}

/**
 * Build daily structure description based on profile
 */
function buildDailyStructure(profile: UserProfile): string {
  const structures: string[] = [];

  // Session length
  const sessionLength =
    profile.dailyMinutes <= 15
      ? '10-15 minute sessions'
      : profile.dailyMinutes <= 30
      ? '20-30 minute sessions'
      : '45-60 minute sessions';

  structures.push(
    `${sessionLength} (concept + example + reflection)`
  );

  // Application moments
  if (
    profile.comfortPrefs.sessionStyle ===
    'one concept + small application'
  ) {
    structures.push('Optional 5-10 minute application moments');
  } else if (profile.comfortPrefs.sessionStyle === 'project flow') {
    structures.push('Regular project-based application tasks');
  }

  // One concept per day
  structures.push('One concept per day to keep sessions finishable');

  // Weekly commitment
  structures.push(
    `Aiming for ${profile.weeklyHours} hours per week total`
  );

  return structures.join('\n- ');
}

/**
 * Build skip behavior description based on profile
 */
function buildSkipBehavior(profile: UserProfile): string {
  const behaviors: string[] = [];

  const behaviorMap = {
    'gentle recap':
      'Gentle recap (1-3 minutes) before resuming after missed days',
    'simplified restart':
      'Simplified restart with condensed version of missed concepts',
    'ask before changing pace':
      'Ask before making any pace adjustments after missed days',
  };

  behaviors.push(behaviorMap[profile.comfortPrefs.skipBehavior]);

  if (profile.pacingPref === 'recap+continue') {
    behaviors.push('Continue where you left off after recap');
  } else if (profile.pacingPref === 'slow down automatically') {
    behaviors.push('Automatically slow down if you miss multiple days');
  } else {
    behaviors.push("I'll ask before making automatic pace changes");
  }

  return behaviors.join('\n- ');
}

/**
 * Build tracking description based on profile
 */
function buildTracking(profile: UserProfile): string {
  const tracking: string[] = [];

  // Base tracking
  tracking.push(
    'Every concept you learn (automatic memory entry created)'
  );

  // Application tracking
  if (
    profile.trackingPref === 'learning + small applications' ||
    profile.trackingPref ===
      'learning + applications + evidence links'
  ) {
    tracking.push('Application moments you complete');
  }

  // Evidence tracking
  if (
    profile.trackingPref ===
    'learning + applications + evidence links'
  ) {
    const evidenceTypes: string[] = [];
    if (profile.applicationPref.includes('linking GitHub')) {
      evidenceTypes.push('GitHub repos');
    }
    if (profile.applicationPref.includes('code/config snippets')) {
      evidenceTypes.push('code snippets');
    }
    if (profile.applicationPref.includes('running commands')) {
      evidenceTypes.push('command outputs');
    }

    if (evidenceTypes.length > 0) {
      tracking.push(
        `Evidence links (${evidenceTypes.join(', ')}) when you choose to attach them`
      );
    }
  }

  // Reflection tracking
  if (
    profile.applicationPref.includes('writing short reflections')
  ) {
    tracking.push('Your reflections and insights');
  }

  return tracking.join('\n- ');
}

/**
 * Determine what will be emphasized based on profile
 */
function determineEmphasis(profile: UserProfile): string[] {
  const emphasis: string[] = [];

  // Based on outcomes
  if (profile.outcomes.includes('Build real apps')) {
    emphasis.push('Building real-world applications and projects');
  }
  if (profile.outcomes.includes('Use in CI-CD')) {
    emphasis.push(
      'CI/CD pipeline integration and automation workflows'
    );
  }
  if (profile.outcomes.includes('Understand internals')) {
    emphasis.push('Understanding how things work under the hood');
  }
  if (profile.outcomes.includes('Troubleshoot')) {
    emphasis.push('Troubleshooting common issues and debugging');
  }
  if (profile.outcomes.includes('Interview-ready')) {
    emphasis.push('Interview preparation and conceptual questions');
  }

  // Based on depth preference
  if (profile.depthPref === 'never compromise on accuracy') {
    emphasis.push('Technical accuracy and deep understanding');
  }

  // Based on learning style
  if (profile.learningStyle.includes('analogies')) {
    emphasis.push('Clear analogies to help grasp complex concepts');
  }
  if (profile.learningStyle.includes('step-by-step labs')) {
    emphasis.push('Hands-on step-by-step practical exercises');
  }
  if (profile.learningStyle.includes('visuals')) {
    emphasis.push('Visual diagrams and mental models');
  }

  return emphasis;
}

/**
 * Determine what will be skipped based on profile
 */
function determineSkipped(profile: UserProfile): string[] {
  const skipped: string[] = [];

  // Platform-specific skips
  if (profile.platform.includes('macOS')) {
    skipped.push('Windows-specific configurations and tools');
  } else if (profile.platform.includes('Windows')) {
    skipped.push('macOS/Linux-specific configurations');
  } else if (profile.platform === 'Linux') {
    skipped.push('Windows and macOS-specific features');
  }

  // Based on video preference
  if (profile.comfortPrefs.videoPreference === 'avoid audio-video') {
    skipped.push('Video tutorials and demonstrations');
  }

  // Based on tool install comfort
  if (profile.toolInstallComfort === 'prefer cloud') {
    skipped.push('Complex local environment setup (cloud-first approach)');
  }

  // Based on depth preference
  if (profile.depthPref === 'keep it simple first') {
    skipped.push(
      'Theory-heavy deep dives (save advanced topics for later)'
    );
  }

  // Based on frustration preference
  if (
    profile.frustrationPref ===
    'too much theory without practice'
  ) {
    skipped.push('Extended theoretical explanations without hands-on');
  }

  // Based on goals - skip advanced topics if focusing on fundamentals
  if (profile.goals.includes('Fundamentals')) {
    skipped.push(
      'Advanced optimization and edge cases (build foundation first)'
    );
  }

  return skipped;
}

/**
 * Build user prompt with profile data for Groq
 */
function buildUserPrompt(profile: UserProfile): string {
  const learningApproach = buildLearningApproach(profile);
  const contentFormat = buildContentFormat(profile);
  const dailyStructure = buildDailyStructure(profile);
  const skipBehavior = buildSkipBehavior(profile);
  const tracking = buildTracking(profile);
  const emphasis = determineEmphasis(profile);
  const skipped = determineSkipped(profile);

  // Build role description
  const roleDescriptions = {
    'Application Support Engineer': 'an Application Support Engineer',
    'Software Developer': 'a Software Developer',
    'DevOps-SRE': 'a DevOps/SRE professional',
    Student: 'a student',
    Other: 'a professional',
  };
  const roleDesc = roleDescriptions[profile.role];

  // Build baseline skills list
  const baselineSkills =
    profile.baselineSkills.length > 0
      ? profile.baselineSkills
          .filter((skill) => skill !== 'None')
          .join(', ')
      : 'no prior experience with these tools';

  // Build goals list
  const goalsText = profile.goals.join(' and ').toLowerCase();

  return `Generate a personalized learning contract summary based on this user profile.

Use EXACTLY this structure (keep the headers as-is):

---
Learning Contract Summary

Profile:
[Restate who they are, their background, goals, and time commitment. Be specific - mention their role, baseline skills, why they're learning, and exact time commitments.]

Learning Approach:
${learningApproach}

Content Format:
${contentFormat}

Daily Structure:
${dailyStructure}

When You Skip Days:
${skipBehavior}

What We'll Track:
${tracking}

What We'll Emphasize:
${emphasis.map((e) => `- ${e}`).join('\n')}

What We'll Skip:
${skipped.map((s) => `- ${s}`).join('\n')}

Is this accurate? Correct anything that doesn't match your needs.
---

USER PROFILE DATA:
- Role: ${profile.role}
- Baseline Skills: ${baselineSkills}
- Prior Experience: ${profile.priorExperience}
- Goals: ${goalsText}
- Desired Mastery: ${profile.masteryLevel}
- Daily Time: ${profile.dailyMinutes} minutes
- Weekly Time: ${profile.weeklyHours} hours
- Platform: ${profile.platform}

Generate the contract summary now. Use warm, conversational language. Be specific about their context.`;
}

/**
 * Parse Groq response into structured contract summary
 */
function parseContractResponse(
  response: string
): LearningContractSummary {
  try {
    // Extract sections using regex patterns
    const profileMatch = response.match(
      /Profile:\s*\n([\s\S]*?)(?=\n(?:Learning Approach|Content Format):)/i
    );
    const learningApproachMatch = response.match(
      /Learning Approach:\s*\n([\s\S]*?)(?=\n(?:Content Format|Daily Structure):)/i
    );
    const contentFormatMatch = response.match(
      /Content Format:\s*\n([\s\S]*?)(?=\n(?:Daily Structure|When You Skip):)/i
    );
    const dailyStructureMatch = response.match(
      /Daily Structure:\s*\n([\s\S]*?)(?=\n(?:When You Skip|What We'll Track):)/i
    );
    const skipBehaviorMatch = response.match(
      /When You Skip Days?:\s*\n([\s\S]*?)(?=\n(?:What We'll Track|What We'll Emphasize):)/i
    );
    const trackingMatch = response.match(
      /What We'll Track:\s*\n([\s\S]*?)(?=\n(?:What We'll Emphasize|What We'll Skip):)/i
    );
    const emphasisMatch = response.match(
      /What We'll Emphasize:\s*\n([\s\S]*?)(?=\n(?:What We'll Skip|Is this accurate):)/i
    );
    const skippedMatch = response.match(
      /What We'll Skip:\s*\n([\s\S]*?)(?=\n(?:Is this accurate|$))/i
    );

    // Extract and clean sections
    const profileSummary = profileMatch
      ? profileMatch[1].trim()
      : '';
    const learningApproach = learningApproachMatch
      ? learningApproachMatch[1].trim()
      : '';
    const contentFormat = contentFormatMatch
      ? contentFormatMatch[1].trim()
      : '';
    const dailyStructure = dailyStructureMatch
      ? dailyStructureMatch[1].trim()
      : '';
    const skipBehavior = skipBehaviorMatch
      ? skipBehaviorMatch[1].trim()
      : '';
    const tracking = trackingMatch ? trackingMatch[1].trim() : '';

    // Extract emphasis array (bullet points)
    const emphasisText = emphasisMatch ? emphasisMatch[1].trim() : '';
    const emphasis = emphasisText
      .split('\n')
      .map((line) => line.replace(/^-\s*/, '').trim())
      .filter((line) => line.length > 0);

    // Extract skipped array (bullet points)
    const skippedText = skippedMatch ? skippedMatch[1].trim() : '';
    const skipped = skippedText
      .split('\n')
      .map((line) => line.replace(/^-\s*/, '').trim())
      .filter((line) => line.length > 0);

    // Build contract summary object
    const contractSummary: LearningContractSummary = {
      profileSummary,
      learningApproach,
      contentFormat,
      dailyStructure,
      skipBehavior,
      tracking,
      emphasis,
      skipped,
      generatedAt: new Date(),
    };

    // Validate using Zod schema
    const validated =
      learningContractSummarySchema.parse(contractSummary);

    return validated;
  } catch (error) {
    throw new ContractParsingError(
      'Failed to parse learning contract response. Response may be malformed.',
      error as Error
    );
  }
}

// ============================================
// Main Service Function
// ============================================

/**
 * Generate a personalized learning contract from user profile
 *
 * Transforms questionnaire responses into a natural language contract
 * that explains all design decisions and connects answers to specific
 * course configuration choices.
 *
 * @param profile - User profile from questionnaire
 * @returns Structured learning contract summary
 * @throws ContractGenerationError if API call fails
 * @throws ContractParsingError if response parsing fails
 *
 * @example
 * ```typescript
 * const profile = await getUserProfile(userId);
 * const contract = await generateLearningContractSummary(profile);
 * console.log(contract.profileSummary);
 * ```
 *
 * @see PRD Requirements R3.1-R3.4
 */
export async function generateLearningContractSummary(
  profile: UserProfile
): Promise<LearningContractSummary> {
  try {
    // Build prompts
    const systemPrompt = buildSystemPrompt();
    const userPrompt = buildUserPrompt(profile);

    // Call Groq API
    const response = await generateLearningContract(profile);

    // Parse response
    const contractSummary = parseContractResponse(response);

    return contractSummary;
  } catch (error) {
    if (error instanceof ContractParsingError) {
      throw error;
    }

    throw new ContractGenerationError(
      'Failed to generate learning contract. Please try again.',
      error as Error
    );
  }
}

/**
 * Validate a learning contract summary
 *
 * @param summary - Contract summary to validate
 * @returns true if valid, throws error if invalid
 */
export function validateContractSummary(
  summary: LearningContractSummary
): boolean {
  try {
    learningContractSummarySchema.parse(summary);
    return true;
  } catch (error) {
    throw new ContractParsingError(
      'Invalid learning contract summary structure',
      error as Error
    );
  }
}
