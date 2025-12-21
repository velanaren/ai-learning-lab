/**
 * Memory & Proof-of-Work Types - Unit Tests
 *
 * Tests Zod schema validation for memory and evidence types.
 */

import {
  EvidenceType,
  SourceType,
  EvidenceVisibility,
  MemoryViewFilter,
  AdjustmentType,
  evidenceItemSchema,
  memoryEntrySchema,
  memoryEntryWithEvidenceSchema,
  memoryTimelineEntrySchema,
  memoryTimelineSchema,
  memoryByTopicSchema,
  memoryBySkillSchema,
  weeklyDigestSchema,
  adjustmentSuggestionSchema,
  adjustmentResponseSchema,
  createEvidenceItemInputSchema,
  createMemoryEntryInputSchema,
  type EvidenceItem,
  type MemoryEntry,
  type MemoryEntryWithEvidence,
  type WeeklyDigest,
} from './memory';

describe('Memory & Evidence Enums', () => {
  describe('EvidenceType', () => {
    it('should have all expected evidence types', () => {
      expect(Object.values(EvidenceType)).toContain('github');
      expect(Object.values(EvidenceType)).toContain('execution');
      expect(Object.values(EvidenceType)).toContain('artifact');
      expect(Object.values(EvidenceType)).toContain('link');
    });
  });

  describe('SourceType', () => {
    it('should distinguish verifiable from user-provided', () => {
      expect(Object.values(SourceType)).toContain('verifiable');
      expect(Object.values(SourceType)).toContain('user-provided');
    });
  });

  describe('EvidenceVisibility', () => {
    it('should have private and shareable options', () => {
      expect(Object.values(EvidenceVisibility)).toContain('private');
      expect(Object.values(EvidenceVisibility)).toContain('shareable');
    });
  });

  describe('MemoryViewFilter', () => {
    it('should have all expected view filters', () => {
      expect(Object.values(MemoryViewFilter)).toContain('all');
      expect(Object.values(MemoryViewFilter)).toContain('applied');
      expect(Object.values(MemoryViewFilter)).toContain('proof-backed');
      expect(Object.values(MemoryViewFilter)).toContain('by-topic');
      expect(Object.values(MemoryViewFilter)).toContain('by-skill');
    });
  });

  describe('AdjustmentType', () => {
    it('should have all adjustment types', () => {
      expect(Object.values(AdjustmentType)).toContain('pace');
      expect(Object.values(AdjustmentType)).toContain('recap');
      expect(Object.values(AdjustmentType)).toContain('chunk-size');
      expect(Object.values(AdjustmentType)).toContain('application-frequency');
    });
  });
});

describe('EvidenceItem Schema', () => {
  const validEvidenceItem: EvidenceItem = {
    id: '990e8400-e29b-41d4-a716-446655440005',
    memoryEntryId: '880e8400-e29b-41d4-a716-446655440004',
    type: EvidenceType.GITHUB,
    urlOrBlobRef: 'https://github.com/user/repo/commit/abc123',
    label: 'First Docker compose file',
    sourceType: SourceType.VERIFIABLE,
    visibility: EvidenceVisibility.PRIVATE,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  it('should validate a valid evidence item', () => {
    expect(() => evidenceItemSchema.parse(validEvidenceItem)).not.toThrow();
  });

  it('should reject invalid evidence UUID', () => {
    const invalid = { ...validEvidenceItem, id: 'not-a-uuid' };
    expect(() => evidenceItemSchema.parse(invalid)).toThrow();
  });

  it('should reject invalid memory entry UUID', () => {
    const invalid = { ...validEvidenceItem, memoryEntryId: 'not-a-uuid' };
    expect(() => evidenceItemSchema.parse(invalid)).toThrow();
  });

  it('should reject empty URL or blob reference', () => {
    const invalid = { ...validEvidenceItem, urlOrBlobRef: '' };
    expect(() => evidenceItemSchema.parse(invalid)).toThrow();
  });

  it('should reject empty label', () => {
    const invalid = { ...validEvidenceItem, label: '' };
    expect(() => evidenceItemSchema.parse(invalid)).toThrow();
  });

  it('should reject label longer than 200 characters', () => {
    const invalid = { ...validEvidenceItem, label: 'a'.repeat(201) };
    expect(() => evidenceItemSchema.parse(invalid)).toThrow();
  });

  it('should validate screenshot evidence as user-provided', () => {
    const valid = {
      ...validEvidenceItem,
      type: EvidenceType.EXECUTION,
      sourceType: SourceType.USER_PROVIDED,
      urlOrBlobRef: 'blob://screenshot-123.png',
    };
    expect(() => evidenceItemSchema.parse(valid)).not.toThrow();
  });
});

describe('MemoryEntry Schema', () => {
  const validMemoryEntry: MemoryEntry = {
    id: '880e8400-e29b-41d4-a716-446655440004',
    userId: '770e8400-e29b-41d4-a716-446655440003',
    topicId: '550e8400-e29b-41d4-a716-446655440000',
    conceptId: '660e8400-e29b-41d4-a716-446655440001',
    reflectionText: 'I learned that containers are different from VMs in fundamental ways',
    actionTaken: 'Created a Dockerfile for a simple Node.js app and built the image',
    tags: ['docker', 'containers', 'beginner', 'phase-1'],
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  it('should validate a valid memory entry with action', () => {
    expect(() => memoryEntrySchema.parse(validMemoryEntry)).not.toThrow();
  });

  it('should validate a valid memory entry without action', () => {
    const valid = { ...validMemoryEntry, actionTaken: undefined };
    expect(() => memoryEntrySchema.parse(valid)).not.toThrow();
  });

  it('should reject invalid user UUID', () => {
    const invalid = { ...validMemoryEntry, userId: 'not-a-uuid' };
    expect(() => memoryEntrySchema.parse(invalid)).toThrow();
  });

  it('should reject invalid topic UUID', () => {
    const invalid = { ...validMemoryEntry, topicId: 'not-a-uuid' };
    expect(() => memoryEntrySchema.parse(invalid)).toThrow();
  });

  it('should reject invalid concept UUID', () => {
    const invalid = { ...validMemoryEntry, conceptId: 'not-a-uuid' };
    expect(() => memoryEntrySchema.parse(invalid)).toThrow();
  });

  it('should reject reflection text shorter than 10 characters', () => {
    const invalid = { ...validMemoryEntry, reflectionText: 'Too short' };
    expect(() => memoryEntrySchema.parse(invalid)).toThrow();
  });

  it('should reject action taken shorter than 10 characters', () => {
    const invalid = { ...validMemoryEntry, actionTaken: 'Too short' };
    expect(() => memoryEntrySchema.parse(invalid)).toThrow();
  });

  it('should accept empty tags array', () => {
    const valid = { ...validMemoryEntry, tags: [] };
    expect(() => memoryEntrySchema.parse(valid)).not.toThrow();
  });
});

describe('MemoryEntryWithEvidence Schema', () => {
  const validEvidenceItem: EvidenceItem = {
    id: '990e8400-e29b-41d4-a716-446655440005',
    memoryEntryId: '880e8400-e29b-41d4-a716-446655440004',
    type: EvidenceType.GITHUB,
    urlOrBlobRef: 'https://github.com/user/repo',
    label: 'Project repo',
    sourceType: SourceType.VERIFIABLE,
    visibility: EvidenceVisibility.PRIVATE,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const validMemoryWithEvidence: MemoryEntryWithEvidence = {
    id: '880e8400-e29b-41d4-a716-446655440004',
    userId: '770e8400-e29b-41d4-a716-446655440003',
    topicId: '550e8400-e29b-41d4-a716-446655440000',
    conceptId: '660e8400-e29b-41d4-a716-446655440001',
    reflectionText: 'Containers provide isolation while sharing the kernel',
    actionTaken: 'Built and pushed a Docker image to Docker Hub',
    tags: ['docker', 'deployment'],
    createdAt: new Date(),
    updatedAt: new Date(),
    evidenceItems: [validEvidenceItem],
    isProofBacked: true,
  };

  it('should validate memory entry with evidence (proof-backed)', () => {
    expect(() => memoryEntryWithEvidenceSchema.parse(validMemoryWithEvidence)).not.toThrow();
  });

  it('should validate memory entry without evidence (not proof-backed)', () => {
    const valid = {
      ...validMemoryWithEvidence,
      evidenceItems: [],
      isProofBacked: false,
    };
    expect(() => memoryEntryWithEvidenceSchema.parse(valid)).not.toThrow();
  });

  it('should validate memory entry with multiple evidence items', () => {
    const secondEvidence = { ...validEvidenceItem, id: '990e8400-e29b-41d4-a716-446655440006' };
    const valid = {
      ...validMemoryWithEvidence,
      evidenceItems: [validEvidenceItem, secondEvidence],
    };
    expect(() => memoryEntryWithEvidenceSchema.parse(valid)).not.toThrow();
  });
});

describe('MemoryTimeline Schema', () => {
  const validTimelineEntry = {
    memory: {
      id: '880e8400-e29b-41d4-a716-446655440004',
      userId: '770e8400-e29b-41d4-a716-446655440003',
      topicId: '550e8400-e29b-41d4-a716-446655440000',
      conceptId: '660e8400-e29b-41d4-a716-446655440001',
      reflectionText: 'Learned about Docker networking',
      actionTaken: 'Created a custom Docker network',
      tags: ['docker', 'networking'],
      createdAt: new Date(),
      updatedAt: new Date(),
      evidenceItems: [],
      isProofBacked: false,
    },
    conceptTitle: 'Docker Networking Basics',
    topicName: 'Docker',
    hasAction: true,
    isProofBacked: false,
    evidenceCount: 0,
  };

  const validTimeline = {
    entries: [validTimelineEntry],
    totalEntries: 1,
    appliedEntries: 1,
    proofBackedEntries: 0,
  };

  it('should validate a valid memory timeline', () => {
    expect(() => memoryTimelineSchema.parse(validTimeline)).not.toThrow();
  });

  it('should validate empty timeline', () => {
    const valid = {
      entries: [],
      totalEntries: 0,
      appliedEntries: 0,
      proofBackedEntries: 0,
    };
    expect(() => memoryTimelineSchema.parse(valid)).not.toThrow();
  });

  it('should reject negative entry counts', () => {
    const invalid = { ...validTimeline, totalEntries: -1 };
    expect(() => memoryTimelineSchema.parse(invalid)).toThrow();
  });
});

describe('MemoryByTopic Schema', () => {
  const validMemoryByTopic = {
    topicName: 'Docker',
    topicId: '550e8400-e29b-41d4-a716-446655440000',
    proofBackedEntries: [],
    proofBackedCount: 0,
  };

  it('should validate memory grouped by topic', () => {
    expect(() => memoryByTopicSchema.parse(validMemoryByTopic)).not.toThrow();
  });

  it('should reject invalid topic UUID', () => {
    const invalid = { ...validMemoryByTopic, topicId: 'not-a-uuid' };
    expect(() => memoryByTopicSchema.parse(invalid)).toThrow();
  });

  it('should reject negative proof-backed count', () => {
    const invalid = { ...validMemoryByTopic, proofBackedCount: -1 };
    expect(() => memoryByTopicSchema.parse(invalid)).toThrow();
  });
});

describe('MemoryBySkill Schema', () => {
  const validMemoryBySkill = {
    skillName: 'Container Management',
    proofBackedEntries: [],
    proofBackedCount: 0,
  };

  it('should validate memory grouped by skill', () => {
    expect(() => memoryBySkillSchema.parse(validMemoryBySkill)).not.toThrow();
  });

  it('should reject negative proof-backed count', () => {
    const invalid = { ...validMemoryBySkill, proofBackedCount: -1 };
    expect(() => memoryBySkillSchema.parse(invalid)).toThrow();
  });
});

describe('AdjustmentSuggestion Schema', () => {
  const validSuggestion = {
    type: AdjustmentType.PACE,
    suggestion:
      'Consider slowing down the pace slightly - you missed 3 days this week',
    reasoning: 'Skipped days pattern suggests current pace may be too ambitious',
  };

  it('should validate a valid adjustment suggestion', () => {
    expect(() => adjustmentSuggestionSchema.parse(validSuggestion)).not.toThrow();
  });

  it('should reject short suggestion text', () => {
    const invalid = { ...validSuggestion, suggestion: 'Too short' };
    expect(() => adjustmentSuggestionSchema.parse(invalid)).toThrow();
  });

  it('should reject short reasoning text', () => {
    const invalid = { ...validSuggestion, reasoning: 'Too short' };
    expect(() => adjustmentSuggestionSchema.parse(invalid)).toThrow();
  });
});

describe('WeeklyDigest Schema', () => {
  const validDigest: WeeklyDigest = {
    weekStart: new Date('2025-01-20'),
    weekEnd: new Date('2025-01-26'),
    completedDays: 5,
    skippedDays: 2,
    appliedConcepts: 3,
    readOnlyConcepts: 2,
    appliedConceptsExamples: ['Docker networking', 'Docker volumes', 'Docker compose'],
    proofBackedEntriesCount: 2,
    adjustmentSuggestion: {
      type: AdjustmentType.APPLICATION_FREQUENCY,
      suggestion: 'Great job applying concepts! Consider increasing application frequency',
      reasoning: 'High application rate shows strong hands-on learning preference',
    },
    generatedAt: new Date(),
  };

  it('should validate a valid weekly digest', () => {
    expect(() => weeklyDigestSchema.parse(validDigest)).not.toThrow();
  });

  it('should validate digest without adjustment suggestion', () => {
    const valid = { ...validDigest, adjustmentSuggestion: undefined };
    expect(() => weeklyDigestSchema.parse(valid)).not.toThrow();
  });

  it('should reject completed days greater than 7', () => {
    const invalid = { ...validDigest, completedDays: 8 };
    expect(() => weeklyDigestSchema.parse(invalid)).toThrow();
  });

  it('should reject negative completed days', () => {
    const invalid = { ...validDigest, completedDays: -1 };
    expect(() => weeklyDigestSchema.parse(invalid)).toThrow();
  });

  it('should reject skipped days greater than 7', () => {
    const invalid = { ...validDigest, skippedDays: 8 };
    expect(() => weeklyDigestSchema.parse(invalid)).toThrow();
  });

  it('should reject more than 3 applied concept examples', () => {
    const invalid = {
      ...validDigest,
      appliedConceptsExamples: ['example1', 'example2', 'example3', 'example4'],
    };
    expect(() => weeklyDigestSchema.parse(invalid)).toThrow();
  });

  it('should accept empty applied concept examples', () => {
    const valid = { ...validDigest, appliedConceptsExamples: [] };
    expect(() => weeklyDigestSchema.parse(valid)).not.toThrow();
  });

  it('should reject negative proof-backed entries count', () => {
    const invalid = { ...validDigest, proofBackedEntriesCount: -1 };
    expect(() => weeklyDigestSchema.parse(invalid)).toThrow();
  });
});

describe('AdjustmentResponse Schema', () => {
  it('should validate accepted adjustment', () => {
    const valid = {
      accepted: true,
    };
    expect(() => adjustmentResponseSchema.parse(valid)).not.toThrow();
  });

  it('should validate rejected adjustment with override', () => {
    const valid = {
      accepted: false,
      override: 'I prefer to keep the current pace for now',
    };
    expect(() => adjustmentResponseSchema.parse(valid)).not.toThrow();
  });

  it('should validate rejected adjustment without override', () => {
    const valid = {
      accepted: false,
    };
    expect(() => adjustmentResponseSchema.parse(valid)).not.toThrow();
  });
});

describe('Create Input Schemas', () => {
  it('should validate create evidence item input', () => {
    const valid = {
      memoryEntryId: '880e8400-e29b-41d4-a716-446655440004',
      type: EvidenceType.GITHUB,
      urlOrBlobRef: 'https://github.com/user/repo',
      label: 'Project repository',
      sourceType: SourceType.VERIFIABLE,
      visibility: EvidenceVisibility.PRIVATE,
    };
    expect(() => createEvidenceItemInputSchema.parse(valid)).not.toThrow();
  });

  it('should validate create memory entry input', () => {
    const valid = {
      userId: '770e8400-e29b-41d4-a716-446655440003',
      topicId: '550e8400-e29b-41d4-a716-446655440000',
      conceptId: '660e8400-e29b-41d4-a716-446655440001',
      reflectionText: 'I now understand how Docker layers work',
      actionTaken: 'Optimized a Dockerfile to reduce layers',
      tags: ['docker', 'optimization'],
    };
    expect(() => createMemoryEntryInputSchema.parse(valid)).not.toThrow();
  });

  it('should ignore if id is provided (omit strips it)', () => {
    const withId = {
      id: '880e8400-e29b-41d4-a716-446655440004',
      userId: '770e8400-e29b-41d4-a716-446655440003',
      topicId: '550e8400-e29b-41d4-a716-446655440000',
      conceptId: '660e8400-e29b-41d4-a716-446655440001',
      reflectionText: 'I learned about Docker containers and how they differ from VMs',
      tags: [],
    };
    const result = createMemoryEntryInputSchema.parse(withId);
    expect(result).not.toHaveProperty('id');
  });
});
