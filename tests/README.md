# Testing Infrastructure

Comprehensive testing setup for the AI Learning Lab project.

## Overview

This project uses two testing frameworks:
- **Jest + React Testing Library** for unit and integration tests
- **Playwright** for end-to-end (E2E) tests

## Table of Contents

- [Quick Start](#quick-start)
- [Unit/Integration Tests (Jest)](#unitintegration-tests-jest)
- [E2E Tests (Playwright)](#e2e-tests-playwright)
- [Test Utilities](#test-utilities)
- [Mock Data Factories](#mock-data-factories)
- [Writing Tests](#writing-tests)
- [Coverage](#coverage)
- [Best Practices](#best-practices)

---

## Quick Start

```bash
# Run all unit/integration tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run specific test file
npm test -- Button.test

# Run tests with coverage
npm test -- --coverage

# Run E2E tests
npx playwright test

# Run E2E tests in UI mode
npx playwright test --ui

# Run E2E tests in specific browser
npx playwright test --project=chromium
```

---

## Unit/Integration Tests (Jest)

### Configuration

Jest is configured in `jest.config.js` with the following features:

- **Environment**: `jsdom` for component tests, `node` for API tests
- **TypeScript**: Full support via `ts-jest`
- **Module Aliases**: `@/` maps to `src/`
- **Coverage Thresholds**:
  - Global: 80% branches, 85% functions/lines/statements
  - Types: 90% (validation logic)
  - Components/Services: 85%

### Running Tests

```bash
# All tests
npm test

# Watch mode
npm test -- --watch

# Specific test file
npm test -- path/to/test

# With coverage
npm test -- --coverage

# Verbose output
npm test -- --verbose

# Update snapshots
npm test -- -u
```

### Test File Structure

```
src/
├── components/
│   └── common/
│       ├── Button.tsx
│       └── Button.test.tsx        # Co-located with component
├── types/
│   ├── userProfile.ts
│   └── userProfile.test.ts        # Co-located with types
└── app/
    └── api/
        └── health/
            ├── route.ts
            └── route.test.ts      # Co-located with API route
```

### Example Component Test

```typescript
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from './Button';

describe('Button Component', () => {
  it('should call onClick when clicked', async () => {
    const user = userEvent.setup();
    const handleClick = jest.fn();

    render(<Button onClick={handleClick}>Click me</Button>);

    const button = screen.getByRole('button');
    await user.click(button);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

### Example API Route Test

```typescript
/**
 * @jest-environment node
 */
import { GET } from './route';
import * as dbConnection from '@/database/connection';

jest.mock('@/database/connection', () => ({
  healthCheck: jest.fn(),
}));

describe('/api/health', () => {
  it('should return 200 when healthy', async () => {
    (dbConnection.healthCheck as jest.Mock).mockResolvedValue(true);

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.status).toBe('healthy');
  });
});
```

---

## E2E Tests (Playwright)

### Configuration

Playwright is configured in `playwright.config.ts` with:

- **Browsers**: Chromium, Firefox, WebKit
- **Parallel Execution**: Enabled
- **Screenshots**: On failure
- **Videos**: On failure
- **Traces**: On first retry

### Running E2E Tests

```bash
# Run all E2E tests
npx playwright test

# Run in UI mode (interactive)
npx playwright test --ui

# Run specific test file
npx playwright test example.spec.ts

# Run specific browser
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit

# Debug mode
npx playwright test --debug

# Generate HTML report
npx playwright show-report
```

### Test File Structure

```
tests/
└── e2e/
    ├── example.spec.ts           # Example E2E test
    └── onboarding.spec.ts        # Onboarding flow tests (future)
```

### Example E2E Test

```typescript
import { test, expect } from '@playwright/test';

test('should load homepage', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('main')).toBeVisible();
});

test('should call API endpoint', async ({ request }) => {
  const response = await request.get('/api/health');
  expect(response.ok()).toBeTruthy();

  const data = await response.json();
  expect(data).toHaveProperty('status');
});
```

---

## Test Utilities

Located in `tests/utils/testHelpers.ts`:

### Available Helpers

```typescript
// Render with custom providers
import { render } from '@/../../tests/utils/testHelpers';

// Wait utilities
await wait(1000);
await flushPromises();

// UUID generation
const id = mockUUID(1); // "550e8400-e29b-41d4-a716-000000000001"

// Date generation
const date = mockDate(0);     // 2025-01-20
const tomorrow = mockDate(1); // 2025-01-21

// Console utilities
const restore = suppressConsole();
const consoleSpy = spyOnConsole();

// Local storage mock
const storage = setupMockLocalStorage();

// Fetch mock
mockFetch({ data: 'test' }, 200);

// Router mocks
mockRouterPush.mockClear();
```

---

## Mock Data Factories

Located in `tests/utils/mockFactories.ts`:

### Available Factories

```typescript
import {
  createMockUserProfile,
  createMockTopic,
  createMockConcept,
  createMockDailyPlan,
  createMockMemoryEntry,
  createMockEvidenceItem,
  createMockLearningStrategy,
  createMockUserWithData,
  createMockPrismaClient,
} from '@/../../tests/utils/mockFactories';

// Create mock user profile
const profile = createMockUserProfile({
  role: Role.SOFTWARE_DEVELOPER,
  dailyMinutes: 30,
});

// Create complete mock user with all data
const { profile, strategy, topic, plan, concepts } = createMockUserWithData();

// Mock Prisma client
const prisma = createMockPrismaClient();
prisma.userProfile.findUnique.mockResolvedValue(profile);
```

---

## Writing Tests

### Component Tests

**Best Practices:**
- Use `screen` queries for finding elements
- Prefer `getByRole` over `getByTestId`
- Use `userEvent` for interactions (more realistic than `fireEvent`)
- Test accessibility (ARIA attributes, keyboard navigation)
- Test error states and edge cases

```typescript
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

describe('MyComponent', () => {
  it('should be accessible', () => {
    render(<MyComponent />);
    const button = screen.getByRole('button', { name: /submit/i });
    expect(button).toHaveAttribute('aria-label');
  });

  it('should handle user interactions', async () => {
    const user = userEvent.setup();
    render(<MyComponent />);

    await user.type(screen.getByRole('textbox'), 'Hello');
    await user.click(screen.getByRole('button'));

    expect(screen.getByText('Success')).toBeInTheDocument();
  });
});
```

### API Route Tests

**Best Practices:**
- Add `@jest-environment node` comment
- Mock database and external dependencies
- Test success and error cases
- Verify response structure and status codes

```typescript
/**
 * @jest-environment node
 */
import { POST } from './route';

jest.mock('@/database/connection');

describe('/api/endpoint', () => {
  it('should handle valid input', async () => {
    const request = new Request('http://localhost:3000/api/endpoint', {
      method: 'POST',
      body: JSON.stringify({ data: 'test' }),
    });

    const response = await POST(request);
    expect(response.status).toBe(200);
  });
});
```

### Zod Schema Tests

**Best Practices:**
- Test valid inputs
- Test invalid inputs
- Test edge cases (boundaries, empty arrays, etc.)
- Test all constraint validations

```typescript
import { userProfileSchema } from './userProfile';

describe('userProfileSchema', () => {
  it('should validate valid profile', () => {
    const valid = { /* ... */ };
    expect(() => userProfileSchema.parse(valid)).not.toThrow();
  });

  it('should reject invalid UUID', () => {
    const invalid = { id: 'not-a-uuid', /* ... */ };
    expect(() => userProfileSchema.parse(invalid)).toThrow();
  });
});
```

---

## Coverage

### Thresholds

Coverage thresholds are enforced:

- **Global**: 80% branches, 85% functions/lines/statements
- **Types (`src/types/**`)**: 90% all metrics
- **Components (`src/components/**`)**: 85% all metrics
- **Services (`src/services/**`)**: 85% all metrics

### Viewing Coverage

```bash
# Generate coverage report
npm test -- --coverage

# Open HTML coverage report
open coverage/lcov-report/index.html
```

### Coverage Reports

Coverage is reported in multiple formats:
- **Text**: In terminal
- **LCOV**: For CI/CD tools
- **HTML**: Interactive browser report
- **JSON**: For programmatic access

---

## Best Practices

### General Testing Principles

1. **AAA Pattern**: Arrange, Act, Assert
   ```typescript
   it('should do something', () => {
     // Arrange
     const input = 'test';

     // Act
     const result = processInput(input);

     // Assert
     expect(result).toBe('TEST');
   });
   ```

2. **One Assertion Per Test** (when possible)
   - Makes failures clearer
   - Each test has single responsibility

3. **Descriptive Test Names**
   - Use "should..." format
   - Clearly state expected behavior
   - Include context when needed

4. **Test Behavior, Not Implementation**
   - Test what users see/experience
   - Don't test internal implementation details
   - Refactoring shouldn't break tests

### Accessibility Testing

Always test accessibility features:

```typescript
it('should be keyboard accessible', async () => {
  const user = userEvent.setup();
  render(<Component />);

  // Tab to element
  await user.tab();

  // Verify focus
  expect(screen.getByRole('button')).toHaveFocus();

  // Activate with Enter
  await user.keyboard('{Enter}');
});

it('should have proper ARIA labels', () => {
  render(<Component />);
  const button = screen.getByRole('button');

  expect(button).toHaveAttribute('aria-label');
  expect(button).not.toHaveAttribute('aria-disabled', 'true');
});
```

### Mocking Best Practices

1. **Mock at Module Boundaries**
   ```typescript
   jest.mock('@/database/connection');
   ```

2. **Reset Mocks Between Tests**
   ```typescript
   beforeEach(() => {
     jest.clearAllMocks();
   });
   ```

3. **Use Type-Safe Mocks**
   ```typescript
   const mockFn = jest.fn() as jest.MockedFunction<typeof originalFn>;
   ```

### Performance

- Use `screen.getBy*` over `container.querySelector`
- Avoid unnecessary `waitFor` if not needed
- Use `userEvent` instead of `fireEvent` (more realistic)
- Clean up after tests (listeners, timers, etc.)

---

## Troubleshooting

### Common Issues

**Test timeout:**
```typescript
jest.setTimeout(10000); // Increase timeout
```

**Module not found:**
- Check `moduleNameMapper` in `jest.config.js`
- Verify path aliases match `tsconfig.json`

**Mock not working:**
- Ensure mock is called before import
- Use `jest.resetModules()` if needed

**Async test not completing:**
- Ensure all promises are awaited
- Check for unhandled promise rejections

---

## CI/CD Integration

### GitHub Actions Example

```yaml
- name: Run Tests
  run: npm test -- --coverage

- name: Upload Coverage
  uses: codecov/codecov-action@v3
  with:
    files: ./coverage/lcov.info
```

### Pre-commit Hook

```bash
# .husky/pre-commit
npm test -- --bail --findRelatedTests
```

---

## Resources

- [Jest Documentation](https://jestjs.io/)
- [React Testing Library](https://testing-library.com/react)
- [Playwright Documentation](https://playwright.dev/)
- [Testing Best Practices](https://testingjavascript.com/)
- [Accessibility Testing](https://www.w3.org/WAI/test-evaluate/)

---

## Summary

- ✅ **194 tests** passing (types, components, API routes)
- ✅ **Jest** configured with TypeScript, React Testing Library
- ✅ **Playwright** configured for E2E testing (3 browsers)
- ✅ **Test utilities** for common testing needs
- ✅ **Mock factories** for generating test data
- ✅ **Coverage thresholds** enforced per PRD requirements
- ✅ **Example tests** demonstrating best practices
