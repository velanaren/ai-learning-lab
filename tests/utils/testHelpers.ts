/**
 * Test Helpers
 *
 * Common utilities and helpers for testing.
 */

import { render as rtlRender, RenderOptions } from '@testing-library/react';
import { ReactElement } from 'react';

/**
 * Custom render function that wraps React Testing Library's render
 * with common providers and setup.
 *
 * @example
 * const { getByText } = render(<MyComponent />);
 */
export function render(ui: ReactElement, options?: RenderOptions) {
  return rtlRender(ui, {
    ...options,
    // Add wrapper providers here as needed
    // wrapper: ({ children }) => <Providers>{children}</Providers>,
  });
}

/**
 * Wait for a specific amount of time
 * Useful for testing async behavior
 *
 * @param ms - Milliseconds to wait
 */
export const wait = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Flush all pending promises
 * Useful after triggering async actions
 */
export const flushPromises = () => new Promise((resolve) => setImmediate(resolve));

/**
 * Generate a mock UUID for testing
 * Returns a valid UUID v4 format
 */
export const mockUUID = (seed = 0): string => {
  const hex = seed.toString(16).padStart(12, '0');
  return `550e8400-e29b-41d4-a716-${hex}`;
};

/**
 * Create a mock Date for consistent testing
 *
 * @param offset - Days offset from base date (2025-01-20)
 */
export const mockDate = (offset = 0): Date => {
  const baseDate = new Date('2025-01-20T10:00:00Z');
  const date = new Date(baseDate);
  date.setDate(date.getDate() + offset);
  return date;
};

/**
 * Mock console methods to suppress output during tests
 * Returns cleanup function to restore original console
 */
export const suppressConsole = () => {
  const originalConsole = {
    log: console.log,
    warn: console.warn,
    error: console.error,
  };

  console.log = jest.fn();
  console.warn = jest.fn();
  console.error = jest.fn();

  return () => {
    console.log = originalConsole.log;
    console.warn = originalConsole.warn;
    console.error = originalConsole.error;
  };
};

/**
 * Create a spy on console methods
 * Returns object with spy functions
 */
export const spyOnConsole = () => {
  const logSpy = jest.spyOn(console, 'log').mockImplementation();
  const warnSpy = jest.spyOn(console, 'warn').mockImplementation();
  const errorSpy = jest.spyOn(console, 'error').mockImplementation();

  return {
    log: logSpy,
    warn: warnSpy,
    error: errorSpy,
    restore: () => {
      logSpy.mockRestore();
      warnSpy.mockRestore();
      errorSpy.mockRestore();
    },
  };
};

/**
 * Mock local storage for testing
 */
export class MockLocalStorage {
  private store: Map<string, string> = new Map();

  getItem(key: string): string | null {
    return this.store.get(key) || null;
  }

  setItem(key: string, value: string): void {
    this.store.set(key, value);
  }

  removeItem(key: string): void {
    this.store.delete(key);
  }

  clear(): void {
    this.store.clear();
  }

  get length(): number {
    return this.store.size;
  }

  key(index: number): string | null {
    const keys = Array.from(this.store.keys());
    return keys[index] || null;
  }
}

/**
 * Setup mock localStorage for tests
 */
export const setupMockLocalStorage = () => {
  const mockStorage = new MockLocalStorage();

  Object.defineProperty(window, 'localStorage', {
    value: mockStorage,
    writable: true,
  });

  return mockStorage;
};

/**
 * Mock fetch API for testing
 *
 * @param mockResponse - Response data to return
 * @param status - HTTP status code
 */
export const mockFetch = (mockResponse: unknown, status = 200) => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: status >= 200 && status < 300,
      status,
      json: () => Promise.resolve(mockResponse),
      text: () => Promise.resolve(JSON.stringify(mockResponse)),
      headers: new Headers(),
      redirected: false,
      statusText: status === 200 ? 'OK' : 'Error',
      type: 'basic' as ResponseType,
      url: '',
      clone: jest.fn(),
      body: null,
      bodyUsed: false,
      arrayBuffer: () => Promise.resolve(new ArrayBuffer(0)),
      blob: () => Promise.resolve(new Blob()),
      formData: () => Promise.resolve(new FormData()),
    } as Response)
  ) as jest.Mock;
};

/**
 * Mock Next.js router push/replace functions
 */
export const mockRouterPush = jest.fn();
export const mockRouterReplace = jest.fn();
export const mockRouterBack = jest.fn();

/**
 * Reset all router mocks
 */
export const resetRouterMocks = () => {
  mockRouterPush.mockClear();
  mockRouterReplace.mockClear();
  mockRouterBack.mockClear();
};

/**
 * Create a typed mock function with proper TypeScript support
 */
export const createMockFn = <T extends (...args: any[]) => any>(): jest.MockedFunction<T> => {
  return jest.fn() as jest.MockedFunction<T>;
};

// Re-export commonly used testing library utilities
export * from '@testing-library/react';
export { default as userEvent } from '@testing-library/user-event';
