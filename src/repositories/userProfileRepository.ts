/**
 * User Profile Repository
 *
 * Data access layer for UserProfile operations.
 * Provides CRUD operations with Prisma Client.
 *
 * @module repositories/userProfileRepository
 */

import { prisma } from '@/lib/prisma';
import type { UserProfile } from '@/types/userProfile';
import type { Prisma } from '@prisma/client';

// ============================================
// Error Classes
// ============================================

/**
 * Database operation error
 */
export class DatabaseError extends Error {
  constructor(
    message: string,
    public readonly cause?: unknown
  ) {
    super(message);
    this.name = 'DatabaseError';
  }
}

/**
 * Resource not found error
 */
export class NotFoundError extends Error {
  constructor(
    message: string,
    public readonly resourceId?: string
  ) {
    super(message);
    this.name = 'NotFoundError';
  }
}

/**
 * Validation error for repository operations
 */
export class ValidationError extends Error {
  constructor(
    message: string,
    public readonly details?: unknown
  ) {
    super(message);
    this.name = 'ValidationError';
  }
}

// ============================================
// Type Definitions
// ============================================

/**
 * Input data for creating a user profile
 * Omits auto-generated fields (id, createdAt, updatedAt)
 */
export type CreateUserProfileInput = Omit<
  UserProfile,
  'id' | 'createdAt' | 'updatedAt'
>;

/**
 * Input data for updating a user profile
 * All fields are optional except userId
 */
export type UpdateUserProfileInput = Partial<
  Omit<UserProfile, 'id' | 'createdAt' | 'updatedAt'>
>;

// ============================================
// Repository Functions
// ============================================

/**
 * Create a new user profile
 *
 * @param profileData - User profile data without id, createdAt, updatedAt
 * @returns Created user profile with generated id and timestamps
 * @throws {ValidationError} If required fields are missing
 * @throws {DatabaseError} If database operation fails
 *
 * @example
 * const profile = await createUserProfile({
 *   role: Role.DEVOPS_SRE,
 *   baselineSkills: [BaselineSkill.LINUX_CLI],
 *   priorExperience: PriorExperience.USED_BASICS,
 *   // ... all other required fields
 * });
 */
export async function createUserProfile(
  profileData: CreateUserProfileInput
): Promise<UserProfile> {
  try {
    // Validate required fields
    validateRequiredFields(profileData);

    // Convert TypeScript enums to string values for Prisma
    const prismaData: Prisma.UserProfileCreateInput = {
      role: profileData.role,
      baselineSkills: profileData.baselineSkills,
      priorExperience: profileData.priorExperience,
      goals: profileData.goals,
      outcomes: profileData.outcomes,
      masteryLevel: profileData.masteryLevel,
      learningFlow: profileData.learningFlow,
      complexityPref: profileData.complexityPref,
      troubleshooting: profileData.troubleshooting,
      platform: profileData.platform,
      toolInstallComfort: profileData.toolInstallComfort,
      dailyMinutes: profileData.dailyMinutes,
      weeklyHours: profileData.weeklyHours,
      pacingPref: profileData.pacingPref,
      learningStyle: profileData.learningStyle,
      frustrationPref: profileData.frustrationPref,
      depthPref: profileData.depthPref,
      comfortPrefs: profileData.comfortPrefs as Prisma.JsonValue,
      applicationPref: profileData.applicationPref,
      trackingPref: profileData.trackingPref,
      evidencePref: profileData.evidencePref,
    };

    // Create profile in database
    const createdProfile = await prisma.userProfile.create({
      data: prismaData,
    });

    // Convert Prisma result to UserProfile type
    return convertPrismaToUserProfile(createdProfile);
  } catch (error) {
    if (error instanceof ValidationError) {
      throw error;
    }

    // Prisma unique constraint violation
    if (
      error instanceof Error &&
      'code' in error &&
      error.code === 'P2002'
    ) {
      throw new DatabaseError(
        'User profile with this identifier already exists',
        error
      );
    }

    // Generic database error
    throw new DatabaseError(
      'Failed to create user profile',
      error
    );
  }
}

/**
 * Get user profile by ID
 *
 * @param userId - UUID of the user profile
 * @returns User profile if found, null otherwise
 * @throws {ValidationError} If userId is invalid
 * @throws {DatabaseError} If database operation fails
 *
 * @example
 * const profile = await getUserProfile('123e4567-e89b-12d3-a456-426614174000');
 * if (profile) {
 *   console.log(profile.role);
 * }
 */
export async function getUserProfile(
  userId: string
): Promise<UserProfile | null> {
  try {
    // Validate UUID format
    if (!isValidUUID(userId)) {
      throw new ValidationError('Invalid user ID format');
    }

    // Query database
    const profile = await prisma.userProfile.findUnique({
      where: { id: userId },
    });

    // Return null if not found
    if (!profile) {
      return null;
    }

    // Convert Prisma result to UserProfile type
    return convertPrismaToUserProfile(profile);
  } catch (error) {
    if (error instanceof ValidationError) {
      throw error;
    }

    throw new DatabaseError('Failed to get user profile', error);
  }
}

/**
 * Update user profile
 *
 * @param userId - UUID of the user profile to update
 * @param data - Partial user profile data to update
 * @returns Updated user profile
 * @throws {NotFoundError} If user profile not found
 * @throws {ValidationError} If userId or data is invalid
 * @throws {DatabaseError} If database operation fails
 *
 * @example
 * const updated = await updateUserProfile(
 *   '123e4567-e89b-12d3-a456-426614174000',
 *   { dailyMinutes: 45, weeklyHours: 6 }
 * );
 */
export async function updateUserProfile(
  userId: string,
  data: UpdateUserProfileInput
): Promise<UserProfile> {
  try {
    // Validate UUID format
    if (!isValidUUID(userId)) {
      throw new ValidationError('Invalid user ID format');
    }

    // Validate update data is not empty
    if (Object.keys(data).length === 0) {
      throw new ValidationError('Update data cannot be empty');
    }

    // Convert TypeScript types to Prisma-compatible format
    const prismaData: Prisma.UserProfileUpdateInput = {
      ...(data.role !== undefined && { role: data.role }),
      ...(data.baselineSkills !== undefined && {
        baselineSkills: data.baselineSkills,
      }),
      ...(data.priorExperience !== undefined && {
        priorExperience: data.priorExperience,
      }),
      ...(data.goals !== undefined && { goals: data.goals }),
      ...(data.outcomes !== undefined && { outcomes: data.outcomes }),
      ...(data.masteryLevel !== undefined && {
        masteryLevel: data.masteryLevel,
      }),
      ...(data.learningFlow !== undefined && {
        learningFlow: data.learningFlow,
      }),
      ...(data.complexityPref !== undefined && {
        complexityPref: data.complexityPref,
      }),
      ...(data.troubleshooting !== undefined && {
        troubleshooting: data.troubleshooting,
      }),
      ...(data.platform !== undefined && { platform: data.platform }),
      ...(data.toolInstallComfort !== undefined && {
        toolInstallComfort: data.toolInstallComfort,
      }),
      ...(data.dailyMinutes !== undefined && {
        dailyMinutes: data.dailyMinutes,
      }),
      ...(data.weeklyHours !== undefined && {
        weeklyHours: data.weeklyHours,
      }),
      ...(data.pacingPref !== undefined && {
        pacingPref: data.pacingPref,
      }),
      ...(data.learningStyle !== undefined && {
        learningStyle: data.learningStyle,
      }),
      ...(data.frustrationPref !== undefined && {
        frustrationPref: data.frustrationPref,
      }),
      ...(data.depthPref !== undefined && {
        depthPref: data.depthPref,
      }),
      ...(data.comfortPrefs !== undefined && {
        comfortPrefs: data.comfortPrefs as Prisma.JsonValue,
      }),
      ...(data.applicationPref !== undefined && {
        applicationPref: data.applicationPref,
      }),
      ...(data.trackingPref !== undefined && {
        trackingPref: data.trackingPref,
      }),
      ...(data.evidencePref !== undefined && {
        evidencePref: data.evidencePref,
      }),
    };

    // Update profile in database
    const updatedProfile = await prisma.userProfile.update({
      where: { id: userId },
      data: prismaData,
    });

    // Convert Prisma result to UserProfile type
    return convertPrismaToUserProfile(updatedProfile);
  } catch (error) {
    if (
      error instanceof ValidationError ||
      error instanceof NotFoundError
    ) {
      throw error;
    }

    // Prisma record not found error
    if (
      error instanceof Error &&
      'code' in error &&
      error.code === 'P2025'
    ) {
      throw new NotFoundError(
        'User profile not found',
        userId
      );
    }

    throw new DatabaseError('Failed to update user profile', error);
  }
}

/**
 * Delete user profile
 *
 * @param userId - UUID of the user profile to delete
 * @returns Deleted user profile
 * @throws {NotFoundError} If user profile not found
 * @throws {ValidationError} If userId is invalid
 * @throws {DatabaseError} If database operation fails
 *
 * @example
 * const deleted = await deleteUserProfile('123e4567-e89b-12d3-a456-426614174000');
 */
export async function deleteUserProfile(
  userId: string
): Promise<UserProfile> {
  try {
    // Validate UUID format
    if (!isValidUUID(userId)) {
      throw new ValidationError('Invalid user ID format');
    }

    // Delete profile from database
    const deletedProfile = await prisma.userProfile.delete({
      where: { id: userId },
    });

    // Convert Prisma result to UserProfile type
    return convertPrismaToUserProfile(deletedProfile);
  } catch (error) {
    if (
      error instanceof ValidationError ||
      error instanceof NotFoundError
    ) {
      throw error;
    }

    // Prisma record not found error
    if (
      error instanceof Error &&
      'code' in error &&
      error.code === 'P2025'
    ) {
      throw new NotFoundError(
        'User profile not found',
        userId
      );
    }

    throw new DatabaseError('Failed to delete user profile', error);
  }
}

/**
 * List all user profiles with optional pagination
 *
 * @param options - Pagination options (skip, take)
 * @returns Array of user profiles
 * @throws {DatabaseError} If database operation fails
 *
 * @example
 * const profiles = await listUserProfiles({ skip: 0, take: 10 });
 */
export async function listUserProfiles(options?: {
  skip?: number;
  take?: number;
}): Promise<UserProfile[]> {
  try {
    const profiles = await prisma.userProfile.findMany({
      skip: options?.skip,
      take: options?.take,
      orderBy: { createdAt: 'desc' },
    });

    return profiles.map(convertPrismaToUserProfile);
  } catch (error) {
    throw new DatabaseError('Failed to list user profiles', error);
  }
}

/**
 * Count total user profiles
 *
 * @returns Total count of user profiles
 * @throws {DatabaseError} If database operation fails
 *
 * @example
 * const count = await countUserProfiles();
 */
export async function countUserProfiles(): Promise<number> {
  try {
    return await prisma.userProfile.count();
  } catch (error) {
    throw new DatabaseError(
      'Failed to count user profiles',
      error
    );
  }
}

// ============================================
// Helper Functions
// ============================================

/**
 * Validate UUID format
 * Accepts any UUID version (v1, v4, etc.)
 */
function isValidUUID(uuid: string): boolean {
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
}

/**
 * Validate required fields are present
 */
function validateRequiredFields(data: CreateUserProfileInput): void {
  const requiredFields = [
    'role',
    'baselineSkills',
    'priorExperience',
    'goals',
    'outcomes',
    'masteryLevel',
    'learningFlow',
    'complexityPref',
    'troubleshooting',
    'platform',
    'toolInstallComfort',
    'dailyMinutes',
    'weeklyHours',
    'pacingPref',
    'learningStyle',
    'frustrationPref',
    'depthPref',
    'comfortPrefs',
    'applicationPref',
    'trackingPref',
    'evidencePref',
  ] as const;

  const missingFields = requiredFields.filter(
    (field) => data[field] === undefined || data[field] === null
  );

  if (missingFields.length > 0) {
    throw new ValidationError(
      `Missing required fields: ${missingFields.join(', ')}`
    );
  }

  // Validate numeric fields
  if (data.dailyMinutes < 10 || data.dailyMinutes > 120) {
    throw new ValidationError(
      'dailyMinutes must be between 10 and 120'
    );
  }

  if (data.weeklyHours < 1 || data.weeklyHours > 40) {
    throw new ValidationError(
      'weeklyHours must be between 1 and 40'
    );
  }

  // Validate arrays are not empty
  if (data.baselineSkills.length === 0) {
    throw new ValidationError('baselineSkills cannot be empty');
  }

  if (data.goals.length === 0) {
    throw new ValidationError('goals cannot be empty');
  }

  if (data.outcomes.length === 0) {
    throw new ValidationError('outcomes cannot be empty');
  }

  if (data.learningStyle.length === 0) {
    throw new ValidationError('learningStyle cannot be empty');
  }
}

/**
 * Convert Prisma UserProfile to TypeScript UserProfile type
 */
function convertPrismaToUserProfile(
  prismaProfile: any
): UserProfile {
  return {
    id: prismaProfile.id,
    role: prismaProfile.role,
    baselineSkills: prismaProfile.baselineSkills,
    priorExperience: prismaProfile.priorExperience,
    goals: prismaProfile.goals,
    outcomes: prismaProfile.outcomes,
    masteryLevel: prismaProfile.masteryLevel,
    learningFlow: prismaProfile.learningFlow,
    complexityPref: prismaProfile.complexityPref,
    troubleshooting: prismaProfile.troubleshooting,
    platform: prismaProfile.platform,
    toolInstallComfort: prismaProfile.toolInstallComfort,
    dailyMinutes: prismaProfile.dailyMinutes,
    weeklyHours: prismaProfile.weeklyHours,
    pacingPref: prismaProfile.pacingPref,
    learningStyle: prismaProfile.learningStyle,
    frustrationPref: prismaProfile.frustrationPref,
    depthPref: prismaProfile.depthPref,
    comfortPrefs: prismaProfile.comfortPrefs,
    applicationPref: prismaProfile.applicationPref,
    trackingPref: prismaProfile.trackingPref,
    evidencePref: prismaProfile.evidencePref,
    createdAt: prismaProfile.createdAt,
    updatedAt: prismaProfile.updatedAt,
  };
}
