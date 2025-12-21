/**
 * Jest Setup File
 *
 * This file runs before each test suite.
 * Use it to configure testing library extensions and global mocks.
 */

// Extend Jest matchers with DOM-specific matchers
// Learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

// Polyfill for Next.js server components (Request, Response, Headers, etc.)
import { TextEncoder, TextDecoder } from 'util';
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// Mock environment variables for testing
process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/ai_learning_lab_test';
process.env.NODE_ENV = 'test';

// Mock Next.js router
jest.mock('next/router', () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
    back: jest.fn(),
    pathname: '/',
    query: {},
    asPath: '/',
    route: '/',
  })),
}));

// Mock Next.js navigation (App Router)
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
    back: jest.fn(),
  })),
  usePathname: jest.fn(() => '/'),
  useSearchParams: jest.fn(() => new URLSearchParams()),
}));

// Global test timeout (increase for slower tests)
jest.setTimeout(10000);

// Clean up after each test
afterEach(() => {
  jest.clearAllMocks();
});
