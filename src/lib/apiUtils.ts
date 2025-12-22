/**
 * API Utilities
 *
 * Standardized response helpers and error handlers for API routes.
 * Provides consistent error handling and response formatting across all endpoints.
 *
 * @module lib/apiUtils
 */

import { NextResponse } from 'next/server';
import { ZodError } from 'zod';

// ============================================
// Response Types
// ============================================

/**
 * Standard API success response
 */
export interface ApiSuccessResponse<T = unknown> {
  success: true;
  data: T;
  message?: string;
}

/**
 * Standard API error response
 */
export interface ApiErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
}

/**
 * Combined API response type
 */
export type ApiResponse<T = unknown> =
  | ApiSuccessResponse<T>
  | ApiErrorResponse;

// ============================================
// Error Codes
// ============================================

export enum ApiErrorCode {
  // Validation errors (400)
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  INVALID_INPUT = 'INVALID_INPUT',
  MISSING_FIELD = 'MISSING_FIELD',

  // Authentication errors (401)
  UNAUTHORIZED = 'UNAUTHORIZED',
  INVALID_TOKEN = 'INVALID_TOKEN',
  TOKEN_EXPIRED = 'TOKEN_EXPIRED',

  // Authorization errors (403)
  FORBIDDEN = 'FORBIDDEN',
  INSUFFICIENT_PERMISSIONS = 'INSUFFICIENT_PERMISSIONS',

  // Not found errors (404)
  NOT_FOUND = 'NOT_FOUND',
  RESOURCE_NOT_FOUND = 'RESOURCE_NOT_FOUND',

  // Conflict errors (409)
  CONFLICT = 'CONFLICT',
  ALREADY_EXISTS = 'ALREADY_EXISTS',

  // Server errors (500)
  INTERNAL_ERROR = 'INTERNAL_ERROR',
  DATABASE_ERROR = 'DATABASE_ERROR',
  EXTERNAL_API_ERROR = 'EXTERNAL_API_ERROR',

  // Rate limiting (429)
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',
}

// ============================================
// Response Helpers
// ============================================

/**
 * Create a success response
 */
export function successResponse<T>(
  data: T,
  message?: string,
  status: number = 200
): NextResponse<ApiSuccessResponse<T>> {
  return NextResponse.json(
    {
      success: true,
      data,
      ...(message && { message }),
    },
    { status }
  );
}

/**
 * Create an error response
 */
export function errorResponse(
  code: ApiErrorCode,
  message: string,
  status: number = 400,
  details?: unknown
): NextResponse<ApiErrorResponse> {
  return NextResponse.json(
    {
      success: false,
      error: {
        code,
        message,
        ...(details && { details }),
      },
    },
    { status }
  );
}

// ============================================
// Error Handlers
// ============================================

/**
 * Handle Zod validation errors
 */
export function handleZodError(
  error: ZodError
): NextResponse<ApiErrorResponse> {
  const details = error.errors.map((err) => ({
    path: err.path.join('.'),
    message: err.message,
    code: err.code,
  }));

  return errorResponse(
    ApiErrorCode.VALIDATION_ERROR,
    'Validation failed. Please check your input.',
    400,
    details
  );
}

/**
 * Handle generic errors
 */
export function handleError(
  error: unknown
): NextResponse<ApiErrorResponse> {
  // Zod validation errors
  if (error instanceof ZodError) {
    return handleZodError(error);
  }

  // Known error with message
  if (error instanceof Error) {
    // Check if it's a specific application error
    if (error.name === 'ContractGenerationError') {
      return errorResponse(
        ApiErrorCode.EXTERNAL_API_ERROR,
        error.message,
        500
      );
    }

    if (error.name === 'ContractParsingError') {
      return errorResponse(
        ApiErrorCode.INTERNAL_ERROR,
        error.message,
        500
      );
    }

    if (error.name === 'DatabaseError') {
      return errorResponse(
        ApiErrorCode.DATABASE_ERROR,
        'Database operation failed',
        500
      );
    }

    // Generic error
    return errorResponse(
      ApiErrorCode.INTERNAL_ERROR,
      error.message || 'An unexpected error occurred',
      500
    );
  }

  // Unknown error
  return errorResponse(
    ApiErrorCode.INTERNAL_ERROR,
    'An unexpected error occurred',
    500
  );
}

// ============================================
// Request Helpers
// ============================================

/**
 * Parse and validate JSON request body
 */
export async function parseRequestBody<T>(
  request: Request,
  schema: { parse: (data: unknown) => T }
): Promise<T> {
  try {
    const body = await request.json();
    return schema.parse(body);
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new Error('Invalid JSON in request body');
    }
    throw error;
  }
}

/**
 * Get user ID from session (placeholder for now)
 * TODO: Implement actual authentication
 */
export function getUserIdFromSession(
  request: Request
): string | null {
  // Placeholder: In production, get from session/JWT
  // For now, extract from header
  const userId = request.headers.get('x-user-id');

  // Return null if header is missing or empty
  if (!userId || userId.trim() === '') {
    return null;
  }

  return userId;
}

/**
 * Require authentication (placeholder)
 * TODO: Implement actual authentication check
 */
export function requireAuth(
  request: Request
): { userId: string } | null {
  const userId = getUserIdFromSession(request);

  if (!userId) {
    return null;
  }

  return { userId };
}

// ============================================
// Validation Helpers
// ============================================

/**
 * Validate required fields are present
 */
export function validateRequiredFields<T extends Record<string, unknown>>(
  data: T,
  requiredFields: (keyof T)[]
): void {
  const missingFields = requiredFields.filter(
    (field) => data[field] === undefined || data[field] === null
  );

  if (missingFields.length > 0) {
    throw new Error(
      `Missing required fields: ${missingFields.join(', ')}`
    );
  }
}

// ============================================
// CORS Helpers (if needed)
// ============================================

/**
 * Add CORS headers to response
 */
export function addCorsHeaders(response: NextResponse): NextResponse {
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, DELETE, OPTIONS'
  );
  response.headers.set(
    'Access-Control-Allow-Headers',
    'Content-Type, Authorization'
  );
  return response;
}

/**
 * Handle OPTIONS request for CORS preflight
 */
export function handleOptions(): NextResponse {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods':
        'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers':
        'Content-Type, Authorization',
    },
  });
}
