/**
 * Onboarding Questionnaire API Route
 *
 * POST /api/onboarding/questionnaire
 * Saves the user's complete questionnaire responses.
 *
 * @module api/onboarding/questionnaire
 */

import { NextRequest } from 'next/server';
import { z } from 'zod';
import {
  successResponse,
  errorResponse,
  handleError,
  parseRequestBody,
  requireAuth,
  ApiErrorCode,
} from '@/lib/apiUtils';
import {
  createUserProfileInputSchema,
  type CreateUserProfileInput,
} from '@/types/userProfile';

// ============================================
// Request/Response Schemas
// ============================================

/**
 * Questionnaire response includes all user profile fields
 * Uses the existing CreateUserProfileInput type and schema
 */
type QuestionnaireRequest = CreateUserProfileInput;

/**
 * Questionnaire save response
 */
interface QuestionnaireResponse {
  profileId: string;
  savedAt: string;
  isComplete: boolean;
  nextStep: 'generate-contract';
}

// ============================================
// POST Handler
// ============================================

/**
 * POST /api/onboarding/questionnaire
 *
 * Saves the user's complete questionnaire responses.
 * Validates all 8 sections of the questionnaire.
 *
 * @param request - Next.js request object
 * @returns JSON response with save confirmation
 *
 * @example
 * POST /api/onboarding/questionnaire
 * {
 *   "role": "DevOps-SRE",
 *   "baselineSkills": ["Linux CLI", "Git"],
 *   "priorExperience": "Used basics",
 *   "goals": ["Improve current role"],
 *   "outcomes": ["Build real apps"],
 *   "masteryLevel": "devops-grade mastery",
 *   "learningFlow": "mix",
 *   "complexityPref": "gradually one layer",
 *   "troubleshooting": "very important",
 *   "platform": "Linux",
 *   "toolInstallComfort": "yes",
 *   "dailyMinutes": 30,
 *   "weeklyHours": 5,
 *   "pacingPref": "recap+continue",
 *   "learningStyle": ["step-by-step labs", "visuals"],
 *   "frustrationPref": "too much theory without practice",
 *   "depthPref": "never compromise on accuracy",
 *   "comfortPrefs": {
 *     "learningFormats": ["text-first", "step-by-step labs"],
 *     "videoPreference": "short clips only",
 *     "overwhelmTriggers": ["too many new terms"],
 *     "sessionStyle": "one concept + small application",
 *     "contentOrder": "TL;DR → details",
 *     "skipBehavior": "gentle recap",
 *     "uiToggles": ["Focus Mode"]
 *   },
 *   "applicationPref": ["running commands", "linking GitHub"],
 *   "trackingPref": "learning + applications + evidence links",
 *   "evidencePref": "very important"
 * }
 */
export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const auth = requireAuth(request);
    if (!auth) {
      return errorResponse(
        ApiErrorCode.UNAUTHORIZED,
        'Authentication required',
        401
      );
    }

    // Parse and validate request body
    const body = await parseRequestBody<QuestionnaireRequest>(
      request,
      createUserProfileInputSchema
    );

    // TODO: Save to database
    // In production:
    // const profile = await prisma.userProfile.upsert({
    //   where: { userId: auth.userId },
    //   update: {
    //     ...body,
    //     updatedAt: new Date(),
    //   },
    //   create: {
    //     userId: auth.userId,
    //     ...body,
    //     createdAt: new Date(),
    //     updatedAt: new Date(),
    //   },
    // });

    // Simulate database save
    const response: QuestionnaireResponse = {
      profileId: auth.userId,
      savedAt: new Date().toISOString(),
      isComplete: true,
      nextStep: 'generate-contract',
    };

    return successResponse(
      response,
      'Questionnaire responses saved successfully',
      201
    );
  } catch (error) {
    return handleError(error);
  }
}

// ============================================
// OPTIONS Handler (CORS)
// ============================================

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
