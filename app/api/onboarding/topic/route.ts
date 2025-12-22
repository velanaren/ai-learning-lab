/**
 * Onboarding Topic API Route
 *
 * POST /api/onboarding/topic
 * Saves the user's selected topic at the start of onboarding.
 *
 * @module api/onboarding/topic
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

// ============================================
// Request/Response Schemas
// ============================================

/**
 * Topic selection request schema
 */
const topicRequestSchema = z.object({
  topicId: z.string().uuid('Topic ID must be a valid UUID'),
  topicName: z
    .string()
    .min(1, 'Topic name is required')
    .max(100, 'Topic name must be less than 100 characters'),
});

type TopicRequest = z.infer<typeof topicRequestSchema>;

/**
 * Topic selection response
 */
interface TopicResponse {
  topicId: string;
  topicName: string;
  savedAt: string;
}

// ============================================
// POST Handler
// ============================================

/**
 * POST /api/onboarding/topic
 *
 * Saves the user's selected topic for onboarding.
 *
 * @param request - Next.js request object
 * @returns JSON response with saved topic data
 *
 * @example
 * POST /api/onboarding/topic
 * {
 *   "topicId": "123e4567-e89b-12d3-a456-426614174000",
 *   "topicName": "Docker"
 * }
 *
 * Response:
 * {
 *   "success": true,
 *   "data": {
 *     "topicId": "123e4567-e89b-12d3-a456-426614174000",
 *     "topicName": "Docker",
 *     "savedAt": "2025-01-15T10:30:00.000Z"
 *   }
 * }
 */
export async function POST(request: NextRequest) {
  try {
    // Check authentication (placeholder)
    const auth = requireAuth(request);
    if (!auth) {
      return errorResponse(
        ApiErrorCode.UNAUTHORIZED,
        'Authentication required',
        401
      );
    }

    // Parse and validate request body
    const body = await parseRequestBody<TopicRequest>(
      request,
      topicRequestSchema
    );

    // TODO: Save to database
    // For now, we'll just return the data
    // In production:
    // await prisma.userProfile.upsert({
    //   where: { userId: auth.userId },
    //   update: { topicId: body.topicId },
    //   create: {
    //     userId: auth.userId,
    //     topicId: body.topicId,
    //     // ... other required fields
    //   }
    // });

    // Simulate database save
    const response: TopicResponse = {
      topicId: body.topicId,
      topicName: body.topicName,
      savedAt: new Date().toISOString(),
    };

    return successResponse(
      response,
      'Topic saved successfully',
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
