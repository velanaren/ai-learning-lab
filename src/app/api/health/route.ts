/**
 * Health Check API Route
 *
 * Returns the health status of the application and database.
 */

import { NextResponse } from 'next/server';
import { healthCheck } from '@/database/connection';

export const dynamic = 'force-dynamic'; // Don't cache this route

/**
 * GET /api/health
 *
 * Health check endpoint for monitoring
 */
export async function GET() {
  try {
    // Check database connectivity
    const dbHealthy = await healthCheck();

    const health = {
      status: dbHealthy ? 'healthy' : 'unhealthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      database: dbHealthy ? 'connected' : 'disconnected',
      environment: process.env.NODE_ENV || 'unknown',
    };

    // Return 200 if healthy, 503 if unhealthy
    const statusCode = dbHealthy ? 200 : 503;

    return NextResponse.json(health, { status: statusCode });
  } catch (error) {
    // Return error response
    return NextResponse.json(
      {
        status: 'error',
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
