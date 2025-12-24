/**
 * Generate Learning Contract API Route
 *
 * POST /api/onboarding/generate-contract
 * Generates a personalized learning contract from user profile.
 *
 * @module api/onboarding/generate-contract
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
import { generateLearningContractSummary } from '@/services/learningContractGenerator';
import { userProfileSchema, type UserProfile } from '@/types/userProfile';

// ============================================
// Request/Response Schemas
// ============================================

/**
 * Generate contract request schema
 * Accepts either a complete UserProfile or just a userId to fetch from DB
 */
const generateContractRequestSchema = z.union([
  // Option 1: Provide full user profile
  z.object({
    userProfile: userProfileSchema,
  }),
  // Option 2: Provide userId to fetch from DB
  z.object({
    userId: z.string().uuid(),
  }),
]);

type GenerateContractRequest = z.infer<
  typeof generateContractRequestSchema
>;

/**
 * Generate contract response
 */
interface GenerateContractResponse {
  contract: {
    profileSummary: string;
    learningApproach: string;
    contentFormat: string;
    dailyStructure: string;
    skipBehavior: string;
    tracking: string;
    emphasis: string[];
    skipped: string[];
    generatedAt: string;
  };
  userId: string;
  nextStep: 'confirm-contract';
}

// ============================================
// POST Handler
// ============================================

/**
 * POST /api/onboarding/generate-contract
 *
 * Generates a personalized learning contract based on user profile.
 * Uses Groq AI to create a natural language summary that explains
 * all design decisions.
 *
 * @param request - Next.js request object
 * @returns JSON response with generated contract
 *
 * @example
 * POST /api/onboarding/generate-contract
 * {
 *   "userId": "123e4567-e89b-12d3-a456-426614174000"
 * }
 *
 * Or with full profile:
 * {
 *   "userProfile": { ...complete profile object... }
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
    const body = await parseRequestBody<GenerateContractRequest>(
      request,
      generateContractRequestSchema
    );

    // Get user profile
    let userProfile: UserProfile;

    if ('userProfile' in body) {
      // Profile provided directly
      userProfile = body.userProfile;
    } else {
      // Fetch profile from database
      // TODO: Implement database fetch
      // const profile = await prisma.userProfile.findUnique({
      //   where: { userId: body.userId },
      // });
      //
      // if (!profile) {
      //   return errorResponse(
      //     ApiErrorCode.NOT_FOUND,
      //     'User profile not found',
      //     404
      //   );
      // }
      //
      // userProfile = profile;

      // For now, return error since we don't have DB yet
      return errorResponse(
        ApiErrorCode.INVALID_INPUT,
        'Please provide userProfile in request body (database not yet implemented)',
        400
      );
    }

    // Generate learning contract
    const contract = await generateLearningContractSummary(
      userProfile
    );

    // Prepare response
    const response: GenerateContractResponse = {
      contract: {
        profileSummary: contract.profileSummary,
        learningApproach: contract.learningApproach,
        contentFormat: contract.contentFormat,
        dailyStructure: contract.dailyStructure,
        skipBehavior: contract.skipBehavior,
        tracking: contract.tracking,
        emphasis: contract.emphasis,
        skipped: contract.skipped,
        generatedAt: contract.generatedAt.toISOString(),
      },
      userId: userProfile.id,
      nextStep: 'confirm-contract',
    };

    return successResponse(
      response,
      'Learning contract generated successfully',
      200
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
