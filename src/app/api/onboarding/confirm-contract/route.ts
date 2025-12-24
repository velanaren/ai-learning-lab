/**
 * Confirm Learning Contract API Route
 *
 * POST /api/onboarding/confirm-contract
 * Confirms and persists the learning contract, completing onboarding.
 *
 * @module api/onboarding/confirm-contract
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
import { learningContractSummarySchema } from '@/types/learningStrategy';

// ============================================
// Request/Response Schemas
// ============================================

/**
 * Confirm contract request schema
 */
const confirmContractRequestSchema = z.object({
  userId: z.string().uuid('User ID must be a valid UUID'),
  contract: learningContractSummarySchema,
  corrections: z
    .string()
    .optional()
    .describe('User corrections to the contract'),
  confirmed: z
    .boolean()
    .describe('Whether user confirmed the contract'),
});

type ConfirmContractRequest = z.infer<
  typeof confirmContractRequestSchema
>;

/**
 * Confirm contract response
 */
interface ConfirmContractResponse {
  contractId: string;
  userId: string;
  confirmedAt: string;
  onboardingComplete: boolean;
  nextStep: 'day-1' | 'revise-contract';
}

// ============================================
// POST Handler
// ============================================

/**
 * POST /api/onboarding/confirm-contract
 *
 * Confirms and persists the learning contract.
 * Marks onboarding as complete if user confirms.
 * If user requests corrections, stores feedback and redirects to revision.
 *
 * @param request - Next.js request object
 * @returns JSON response with confirmation status
 *
 * @example
 * POST /api/onboarding/confirm-contract
 * {
 *   "userId": "123e4567-e89b-12d3-a456-426614174000",
 *   "contract": {
 *     "profileSummary": "You're a DevOps professional...",
 *     "learningApproach": "Mix concepts and hands-on...",
 *     "contentFormat": "Text-first learning...",
 *     "dailyStructure": "30-minute sessions...",
 *     "skipBehavior": "Gentle recap...",
 *     "tracking": "Every concept...",
 *     "emphasis": ["CI/CD integration", "Troubleshooting"],
 *     "skipped": ["Windows features"],
 *     "generatedAt": "2025-01-15T10:30:00.000Z"
 *   },
 *   "confirmed": true,
 *   "corrections": ""
 * }
 *
 * Response if confirmed:
 * {
 *   "success": true,
 *   "data": {
 *     "contractId": "contract-123",
 *     "userId": "123e4567-e89b-12d3-a456-426614174000",
 *     "confirmedAt": "2025-01-15T10:35:00.000Z",
 *     "onboardingComplete": true,
 *     "nextStep": "day-1"
 *   }
 * }
 *
 * Response if corrections requested:
 * {
 *   "success": true,
 *   "data": {
 *     "contractId": "contract-123",
 *     "userId": "123e4567-e89b-12d3-a456-426614174000",
 *     "confirmedAt": "2025-01-15T10:35:00.000Z",
 *     "onboardingComplete": false,
 *     "nextStep": "revise-contract"
 *   }
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
    const body = await parseRequestBody<ConfirmContractRequest>(
      request,
      confirmContractRequestSchema
    );

    // Verify user matches authenticated user
    if (body.userId !== auth.userId) {
      return errorResponse(
        ApiErrorCode.FORBIDDEN,
        'User ID mismatch',
        403
      );
    }

    // TODO: Save to database
    // In production:
    // if (body.confirmed) {
    //   // User confirmed - save contract and mark onboarding complete
    //   await prisma.learningContract.create({
    //     data: {
    //       userId: body.userId,
    //       ...body.contract,
    //       confirmed: true,
    //       confirmedAt: new Date(),
    //     },
    //   });
    //
    //   await prisma.userProfile.update({
    //     where: { userId: body.userId },
    //     data: {
    //       onboardingComplete: true,
    //       onboardingCompletedAt: new Date(),
    //     },
    //   });
    // } else {
    //   // User requested corrections - save feedback
    //   await prisma.contractCorrection.create({
    //     data: {
    //       userId: body.userId,
    //       corrections: body.corrections || '',
    //       createdAt: new Date(),
    //     },
    //   });
    // }

    // Prepare response
    const response: ConfirmContractResponse = {
      contractId: `contract-${Date.now()}`, // Temporary ID
      userId: body.userId,
      confirmedAt: new Date().toISOString(),
      onboardingComplete: body.confirmed,
      nextStep: body.confirmed ? 'day-1' : 'revise-contract',
    };

    const message = body.confirmed
      ? 'Learning contract confirmed! Onboarding complete.'
      : 'Corrections received. We will revise your contract.';

    return successResponse(response, message, 200);
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
