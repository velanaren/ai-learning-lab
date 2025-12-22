/**
 * User Profile Repository Tests
 *
 * Comprehensive tests for all CRUD operations with Prisma Client.
 * Tests success cases, validation, error handling, and edge cases.
 *
 * @module repositories/userProfileRepository.test
 */

import {
  createUserProfile,
  getUserProfile,
  updateUserProfile,
  deleteUserProfile,
  listUserProfiles,
  countUserProfiles,
  DatabaseError,
  NotFoundError,
  ValidationError,
  type CreateUserProfileInput,
  type UpdateUserProfileInput,
} from './userProfileRepository';
import { prisma } from '@/lib/prisma';
import type { UserProfile } from '@/types/userProfile';
import {
  Role,
  BaselineSkill,
  PriorExperience,
  Goal,
  Outcome,
  MasteryLevel,
  LearningFlow,
  ComplexityPreference,
  TroubleshootingImportance,
  Platform,
  ToolInstallComfort,
  PacingPreference,
  LearningStyleHelper,
  FrustrationPreference,
  DepthPreference,
  LearningFormat,
  VideoPreference,
  OverwhelmTrigger,
  SessionStyle,
  ContentOrder,
  SkipBehavior,
  UIToggle,
  ApplicationComfort,
  TrackingPreference,
  EvidenceImportance,
} from '@/types/userProfile';

// Mock Prisma Client
jest.mock('@/lib/prisma', () => ({
  prisma: {
    userProfile: {
      create: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findMany: jest.fn(),
      count: jest.fn(),
    },
  },
}));

// ============================================
// Test Fixtures
// ============================================

const mockUserProfileInput: CreateUserProfileInput = {
  role: Role.DEVOPS_SRE,
  baselineSkills: [BaselineSkill.LINUX_CLI, BaselineSkill.GIT],
  priorExperience: PriorExperience.USED_BASICS,
  goals: [Goal.IMPROVE_CURRENT_ROLE],
  outcomes: [Outcome.BUILD_REAL_APPS, Outcome.TROUBLESHOOT],
  masteryLevel: MasteryLevel.DEVOPS_GRADE_MASTERY,
  learningFlow: LearningFlow.MIX,
  complexityPref: ComplexityPreference.GRADUALLY_ONE_LAYER,
  troubleshooting: TroubleshootingImportance.VERY_IMPORTANT,
  platform: Platform.LINUX,
  toolInstallComfort: ToolInstallComfort.YES,
  dailyMinutes: 30,
  weeklyHours: 5,
  pacingPref: PacingPreference.RECAP_CONTINUE,
  learningStyle: [
    LearningStyleHelper.STEP_BY_STEP_LABS,
    LearningStyleHelper.VISUALS,
  ],
  frustrationPref:
    FrustrationPreference.TOO_MUCH_THEORY_WITHOUT_PRACTICE,
  depthPref: DepthPreference.NEVER_COMPROMISE_ON_ACCURACY,
  comfortPrefs: {
    learningFormats: [
      LearningFormat.TEXT_FIRST,
      LearningFormat.STEP_BY_STEP_LABS,
    ],
    videoPreference: VideoPreference.SHORT_CLIPS_ONLY,
    overwhelmTriggers: [OverwhelmTrigger.TOO_MANY_NEW_TERMS],
    sessionStyle: SessionStyle.ONE_CONCEPT_PLUS_SMALL_APPLICATION,
    contentOrder: ContentOrder.TLDR_THEN_DETAILS,
    skipBehavior: SkipBehavior.GENTLE_RECAP,
    uiToggles: [UIToggle.FOCUS_MODE],
  },
  applicationPref: [
    ApplicationComfort.RUNNING_COMMANDS,
    ApplicationComfort.LINKING_GITHUB,
  ],
  trackingPref:
    TrackingPreference.LEARNING_PLUS_APPLICATIONS_PLUS_EVIDENCE,
  evidencePref: EvidenceImportance.VERY_IMPORTANT,
};

const mockUserProfile: UserProfile = {
  id: '123e4567-e89b-12d3-a456-426614174000',
  ...mockUserProfileInput,
  createdAt: new Date('2025-01-01'),
  updatedAt: new Date('2025-01-01'),
};

const mockPrismaProfile = {
  id: '123e4567-e89b-12d3-a456-426614174000',
  role: Role.DEVOPS_SRE,
  baselineSkills: [BaselineSkill.LINUX_CLI, BaselineSkill.GIT],
  priorExperience: PriorExperience.USED_BASICS,
  goals: [Goal.IMPROVE_CURRENT_ROLE],
  outcomes: [Outcome.BUILD_REAL_APPS, Outcome.TROUBLESHOOT],
  masteryLevel: MasteryLevel.DEVOPS_GRADE_MASTERY,
  learningFlow: LearningFlow.MIX,
  complexityPref: ComplexityPreference.GRADUALLY_ONE_LAYER,
  troubleshooting: TroubleshootingImportance.VERY_IMPORTANT,
  platform: Platform.LINUX,
  toolInstallComfort: ToolInstallComfort.YES,
  dailyMinutes: 30,
  weeklyHours: 5,
  pacingPref: PacingPreference.RECAP_CONTINUE,
  learningStyle: [
    LearningStyleHelper.STEP_BY_STEP_LABS,
    LearningStyleHelper.VISUALS,
  ],
  frustrationPref:
    FrustrationPreference.TOO_MUCH_THEORY_WITHOUT_PRACTICE,
  depthPref: DepthPreference.NEVER_COMPROMISE_ON_ACCURACY,
  comfortPrefs: mockUserProfileInput.comfortPrefs,
  applicationPref: [
    ApplicationComfort.RUNNING_COMMANDS,
    ApplicationComfort.LINKING_GITHUB,
  ],
  trackingPref:
    TrackingPreference.LEARNING_PLUS_APPLICATIONS_PLUS_EVIDENCE,
  evidencePref: EvidenceImportance.VERY_IMPORTANT,
  createdAt: new Date('2025-01-01'),
  updatedAt: new Date('2025-01-01'),
};

// ============================================
// createUserProfile Tests
// ============================================

describe('createUserProfile', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create user profile successfully', async () => {
    (prisma.userProfile.create as jest.Mock).mockResolvedValue(
      mockPrismaProfile
    );

    const result = await createUserProfile(mockUserProfileInput);

    expect(result).toEqual(mockUserProfile);
    expect(prisma.userProfile.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        role: Role.DEVOPS_SRE,
        baselineSkills: [BaselineSkill.LINUX_CLI, BaselineSkill.GIT],
        dailyMinutes: 30,
      }),
    });
  });

  it('should validate required fields', async () => {
    const invalidInput = {
      role: Role.STUDENT,
      // Missing all other required fields
    } as CreateUserProfileInput;

    await expect(
      createUserProfile(invalidInput)
    ).rejects.toThrow(ValidationError);
    await expect(
      createUserProfile(invalidInput)
    ).rejects.toThrow('Missing required fields');
  });

  it('should validate dailyMinutes range', async () => {
    const invalidInput = {
      ...mockUserProfileInput,
      dailyMinutes: 5, // Too low
    };

    await expect(
      createUserProfile(invalidInput)
    ).rejects.toThrow(ValidationError);
    await expect(
      createUserProfile(invalidInput)
    ).rejects.toThrow('dailyMinutes must be between 10 and 120');
  });

  it('should validate weeklyHours range', async () => {
    const invalidInput = {
      ...mockUserProfileInput,
      weeklyHours: 50, // Too high
    };

    await expect(
      createUserProfile(invalidInput)
    ).rejects.toThrow(ValidationError);
    await expect(
      createUserProfile(invalidInput)
    ).rejects.toThrow('weeklyHours must be between 1 and 40');
  });

  it('should validate baselineSkills not empty', async () => {
    const invalidInput = {
      ...mockUserProfileInput,
      baselineSkills: [],
    };

    await expect(
      createUserProfile(invalidInput)
    ).rejects.toThrow(ValidationError);
    await expect(
      createUserProfile(invalidInput)
    ).rejects.toThrow('baselineSkills cannot be empty');
  });

  it('should validate goals not empty', async () => {
    const invalidInput = {
      ...mockUserProfileInput,
      goals: [],
    };

    await expect(
      createUserProfile(invalidInput)
    ).rejects.toThrow(ValidationError);
    await expect(
      createUserProfile(invalidInput)
    ).rejects.toThrow('goals cannot be empty');
  });

  it('should handle database errors', async () => {
    (prisma.userProfile.create as jest.Mock).mockRejectedValue(
      new Error('Database connection failed')
    );

    await expect(
      createUserProfile(mockUserProfileInput)
    ).rejects.toThrow(DatabaseError);
    await expect(
      createUserProfile(mockUserProfileInput)
    ).rejects.toThrow('Failed to create user profile');
  });

  it('should handle unique constraint violations', async () => {
    const uniqueError = new Error('Unique constraint') as any;
    uniqueError.code = 'P2002';

    (prisma.userProfile.create as jest.Mock).mockRejectedValue(
      uniqueError
    );

    await expect(
      createUserProfile(mockUserProfileInput)
    ).rejects.toThrow(DatabaseError);
    await expect(
      createUserProfile(mockUserProfileInput)
    ).rejects.toThrow('already exists');
  });
});

// ============================================
// getUserProfile Tests
// ============================================

describe('getUserProfile', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should get user profile successfully', async () => {
    (prisma.userProfile.findUnique as jest.Mock).mockResolvedValue(
      mockPrismaProfile
    );

    const result = await getUserProfile(
      '123e4567-e89b-12d3-a456-426614174000'
    );

    expect(result).toEqual(mockUserProfile);
    expect(prisma.userProfile.findUnique).toHaveBeenCalledWith({
      where: { id: '123e4567-e89b-12d3-a456-426614174000' },
    });
  });

  it('should return null if profile not found', async () => {
    (prisma.userProfile.findUnique as jest.Mock).mockResolvedValue(
      null
    );

    const result = await getUserProfile(
      '123e4567-e89b-12d3-a456-426614174000'
    );

    expect(result).toBeNull();
  });

  it('should validate UUID format', async () => {
    await expect(getUserProfile('invalid-uuid')).rejects.toThrow(
      ValidationError
    );
    await expect(getUserProfile('invalid-uuid')).rejects.toThrow(
      'Invalid user ID format'
    );
  });

  it('should handle database errors', async () => {
    (prisma.userProfile.findUnique as jest.Mock).mockRejectedValue(
      new Error('Database error')
    );

    await expect(
      getUserProfile('123e4567-e89b-12d3-a456-426614174000')
    ).rejects.toThrow(DatabaseError);
    await expect(
      getUserProfile('123e4567-e89b-12d3-a456-426614174000')
    ).rejects.toThrow('Failed to get user profile');
  });
});

// ============================================
// updateUserProfile Tests
// ============================================

describe('updateUserProfile', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should update user profile successfully', async () => {
    const updatedProfile = {
      ...mockPrismaProfile,
      dailyMinutes: 45,
      weeklyHours: 7,
      updatedAt: new Date('2025-01-02'),
    };

    (prisma.userProfile.update as jest.Mock).mockResolvedValue(
      updatedProfile
    );

    const updateData: UpdateUserProfileInput = {
      dailyMinutes: 45,
      weeklyHours: 7,
    };

    const result = await updateUserProfile(
      '123e4567-e89b-12d3-a456-426614174000',
      updateData
    );

    expect(result.dailyMinutes).toBe(45);
    expect(result.weeklyHours).toBe(7);
    expect(prisma.userProfile.update).toHaveBeenCalledWith({
      where: { id: '123e4567-e89b-12d3-a456-426614174000' },
      data: expect.objectContaining({
        dailyMinutes: 45,
        weeklyHours: 7,
      }),
    });
  });

  it('should validate UUID format', async () => {
    await expect(
      updateUserProfile('invalid-uuid', { dailyMinutes: 45 })
    ).rejects.toThrow(ValidationError);
    await expect(
      updateUserProfile('invalid-uuid', { dailyMinutes: 45 })
    ).rejects.toThrow('Invalid user ID format');
  });

  it('should validate update data not empty', async () => {
    await expect(
      updateUserProfile(
        '123e4567-e89b-12d3-a456-426614174000',
        {}
      )
    ).rejects.toThrow(ValidationError);
    await expect(
      updateUserProfile(
        '123e4567-e89b-12d3-a456-426614174000',
        {}
      )
    ).rejects.toThrow('Update data cannot be empty');
  });

  it('should handle user not found', async () => {
    const notFoundError = new Error('Record not found') as any;
    notFoundError.code = 'P2025';

    (prisma.userProfile.update as jest.Mock).mockRejectedValue(
      notFoundError
    );

    await expect(
      updateUserProfile(
        '123e4567-e89b-12d3-a456-426614174000',
        { dailyMinutes: 45 }
      )
    ).rejects.toThrow(NotFoundError);
    await expect(
      updateUserProfile(
        '123e4567-e89b-12d3-a456-426614174000',
        { dailyMinutes: 45 }
      )
    ).rejects.toThrow('User profile not found');
  });

  it('should handle database errors', async () => {
    (prisma.userProfile.update as jest.Mock).mockRejectedValue(
      new Error('Database error')
    );

    await expect(
      updateUserProfile(
        '123e4567-e89b-12d3-a456-426614174000',
        { dailyMinutes: 45 }
      )
    ).rejects.toThrow(DatabaseError);
    await expect(
      updateUserProfile(
        '123e4567-e89b-12d3-a456-426614174000',
        { dailyMinutes: 45 }
      )
    ).rejects.toThrow('Failed to update user profile');
  });
});

// ============================================
// deleteUserProfile Tests
// ============================================

describe('deleteUserProfile', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should delete user profile successfully', async () => {
    (prisma.userProfile.delete as jest.Mock).mockResolvedValue(
      mockPrismaProfile
    );

    const result = await deleteUserProfile(
      '123e4567-e89b-12d3-a456-426614174000'
    );

    expect(result).toEqual(mockUserProfile);
    expect(prisma.userProfile.delete).toHaveBeenCalledWith({
      where: { id: '123e4567-e89b-12d3-a456-426614174000' },
    });
  });

  it('should validate UUID format', async () => {
    await expect(
      deleteUserProfile('invalid-uuid')
    ).rejects.toThrow(ValidationError);
    await expect(
      deleteUserProfile('invalid-uuid')
    ).rejects.toThrow('Invalid user ID format');
  });

  it('should handle user not found', async () => {
    const notFoundError = new Error('Record not found') as any;
    notFoundError.code = 'P2025';

    (prisma.userProfile.delete as jest.Mock).mockRejectedValue(
      notFoundError
    );

    await expect(
      deleteUserProfile('123e4567-e89b-12d3-a456-426614174000')
    ).rejects.toThrow(NotFoundError);
    await expect(
      deleteUserProfile('123e4567-e89b-12d3-a456-426614174000')
    ).rejects.toThrow('User profile not found');
  });

  it('should handle database errors', async () => {
    (prisma.userProfile.delete as jest.Mock).mockRejectedValue(
      new Error('Database error')
    );

    await expect(
      deleteUserProfile('123e4567-e89b-12d3-a456-426614174000')
    ).rejects.toThrow(DatabaseError);
    await expect(
      deleteUserProfile('123e4567-e89b-12d3-a456-426614174000')
    ).rejects.toThrow('Failed to delete user profile');
  });
});

// ============================================
// listUserProfiles Tests
// ============================================

describe('listUserProfiles', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should list all user profiles', async () => {
    const profiles = [mockPrismaProfile, mockPrismaProfile];
    (prisma.userProfile.findMany as jest.Mock).mockResolvedValue(
      profiles
    );

    const result = await listUserProfiles();

    expect(result).toHaveLength(2);
    expect(result[0]).toEqual(mockUserProfile);
    expect(prisma.userProfile.findMany).toHaveBeenCalledWith({
      skip: undefined,
      take: undefined,
      orderBy: { createdAt: 'desc' },
    });
  });

  it('should support pagination', async () => {
    (prisma.userProfile.findMany as jest.Mock).mockResolvedValue([
      mockPrismaProfile,
    ]);

    const result = await listUserProfiles({ skip: 10, take: 5 });

    expect(result).toHaveLength(1);
    expect(prisma.userProfile.findMany).toHaveBeenCalledWith({
      skip: 10,
      take: 5,
      orderBy: { createdAt: 'desc' },
    });
  });

  it('should handle database errors', async () => {
    (prisma.userProfile.findMany as jest.Mock).mockRejectedValue(
      new Error('Database error')
    );

    await expect(listUserProfiles()).rejects.toThrow(
      DatabaseError
    );
    await expect(listUserProfiles()).rejects.toThrow(
      'Failed to list user profiles'
    );
  });
});

// ============================================
// countUserProfiles Tests
// ============================================

describe('countUserProfiles', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should count user profiles successfully', async () => {
    (prisma.userProfile.count as jest.Mock).mockResolvedValue(42);

    const result = await countUserProfiles();

    expect(result).toBe(42);
    expect(prisma.userProfile.count).toHaveBeenCalled();
  });

  it('should handle database errors', async () => {
    (prisma.userProfile.count as jest.Mock).mockRejectedValue(
      new Error('Database error')
    );

    await expect(countUserProfiles()).rejects.toThrow(
      DatabaseError
    );
    await expect(countUserProfiles()).rejects.toThrow(
      'Failed to count user profiles'
    );
  });
});

// ============================================
// Integration Tests
// ============================================

describe('UserProfile Repository Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should complete full CRUD lifecycle', async () => {
    // Create
    (prisma.userProfile.create as jest.Mock).mockResolvedValue(
      mockPrismaProfile
    );
    const created = await createUserProfile(mockUserProfileInput);
    expect(created.id).toBe('123e4567-e89b-12d3-a456-426614174000');

    // Read
    (prisma.userProfile.findUnique as jest.Mock).mockResolvedValue(
      mockPrismaProfile
    );
    const retrieved = await getUserProfile(created.id);
    expect(retrieved).toEqual(created);

    // Update
    const updatedPrisma = {
      ...mockPrismaProfile,
      dailyMinutes: 60,
    };
    (prisma.userProfile.update as jest.Mock).mockResolvedValue(
      updatedPrisma
    );
    const updated = await updateUserProfile(created.id, {
      dailyMinutes: 60,
    });
    expect(updated.dailyMinutes).toBe(60);

    // Delete
    (prisma.userProfile.delete as jest.Mock).mockResolvedValue(
      mockPrismaProfile
    );
    const deleted = await deleteUserProfile(created.id);
    expect(deleted.id).toBe(created.id);

    // Verify not found after delete
    (prisma.userProfile.findUnique as jest.Mock).mockResolvedValue(
      null
    );
    const notFound = await getUserProfile(created.id);
    expect(notFound).toBeNull();
  });
});
