/**
 * Health Check API Route - Unit Tests
 *
 * Example test demonstrating API route testing with Next.js
 *
 * @jest-environment node
 */

import { GET } from './route';
import * as dbConnection from '@/database/connection';

// Mock the database connection module
jest.mock('@/database/connection', () => ({
  healthCheck: jest.fn(),
}));

describe('/api/health', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET', () => {
    it('should return 200 and healthy status when database is connected', async () => {
      // Mock successful database health check
      (dbConnection.healthCheck as jest.Mock).mockResolvedValue(true);

      const response = await GET();
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toMatchObject({
        status: 'healthy',
        database: 'connected',
      });
      expect(data).toHaveProperty('timestamp');
      expect(data).toHaveProperty('uptime');
      expect(data).toHaveProperty('environment');
    });

    it('should return 503 and unhealthy status when database is disconnected', async () => {
      // Mock failed database health check
      (dbConnection.healthCheck as jest.Mock).mockResolvedValue(false);

      const response = await GET();
      const data = await response.json();

      expect(response.status).toBe(503);
      expect(data).toMatchObject({
        status: 'unhealthy',
        database: 'disconnected',
      });
      expect(data).toHaveProperty('timestamp');
    });

    it('should return 500 when an error occurs', async () => {
      // Mock database health check throwing an error
      const errorMessage = 'Database connection failed';
      (dbConnection.healthCheck as jest.Mock).mockRejectedValue(new Error(errorMessage));

      const response = await GET();
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data).toMatchObject({
        status: 'error',
        error: errorMessage,
      });
      expect(data).toHaveProperty('timestamp');
    });

    it('should include current environment', async () => {
      (dbConnection.healthCheck as jest.Mock).mockResolvedValue(true);
      const originalEnv = process.env.NODE_ENV;

      // Test with specific environment
      process.env.NODE_ENV = 'test';

      const response = await GET();
      const data = await response.json();

      expect(data.environment).toBe('test');

      // Restore original environment
      process.env.NODE_ENV = originalEnv;
    });

    it('should include process uptime', async () => {
      (dbConnection.healthCheck as jest.Mock).mockResolvedValue(true);

      const response = await GET();
      const data = await response.json();

      expect(typeof data.uptime).toBe('number');
      expect(data.uptime).toBeGreaterThanOrEqual(0);
    });

    it('should include ISO timestamp', async () => {
      (dbConnection.healthCheck as jest.Mock).mockResolvedValue(true);

      const response = await GET();
      const data = await response.json();

      expect(data.timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/);
      expect(new Date(data.timestamp).toString()).not.toBe('Invalid Date');
    });

    it('should call database health check once', async () => {
      (dbConnection.healthCheck as jest.Mock).mockResolvedValue(true);

      await GET();

      expect(dbConnection.healthCheck).toHaveBeenCalledTimes(1);
    });

    it('should handle non-Error exceptions gracefully', async () => {
      // Mock throwing a non-Error object
      (dbConnection.healthCheck as jest.Mock).mockRejectedValue('String error');

      const response = await GET();
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.status).toBe('error');
      expect(data.error).toBe('Unknown error');
    });
  });
});
