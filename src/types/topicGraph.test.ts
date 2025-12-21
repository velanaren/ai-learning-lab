/**
 * Topic Graph Types - Unit Tests
 *
 * Tests Zod schema validation for topic graph types.
 */

import {
  Difficulty,
  DLUPartType,
  topicSchema,
  conceptSchema,
  dailyLearningUnitSchema,
  dailyPlanSchema,
  topicGraphSchema,
  conceptWithProgressSchema,
  dailyPlanProgressSchema,
  createTopicInputSchema,
  createConceptInputSchema,
  createDailyPlanInputSchema,
  type Topic,
  type Concept,
  type DailyLearningUnit,
  type DailyPlan,
  type TopicGraph,
} from './topicGraph';

describe('Topic Graph Enums', () => {
  describe('Difficulty', () => {
    it('should have all expected difficulty values', () => {
      expect(Object.values(Difficulty)).toContain('beginner');
      expect(Object.values(Difficulty)).toContain('intermediate');
      expect(Object.values(Difficulty)).toContain('advanced');
    });
  });

  describe('DLUPartType', () => {
    it('should have all 4 DLU parts', () => {
      expect(Object.values(DLUPartType)).toContain('concept');
      expect(Object.values(DLUPartType)).toContain('example');
      expect(Object.values(DLUPartType)).toContain('reflection');
      expect(Object.values(DLUPartType)).toContain('application');
      expect(Object.values(DLUPartType)).toHaveLength(4);
    });
  });
});

describe('Topic Schema', () => {
  const validTopic: Topic = {
    id: '550e8400-e29b-41d4-a716-446655440000',
    name: 'Docker',
    description: 'Learn containerization with Docker from basics to production',
    tags: ['containers', 'devops', 'infrastructure'],
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  it('should validate a valid topic', () => {
    expect(() => topicSchema.parse(validTopic)).not.toThrow();
  });

  it('should reject invalid UUID', () => {
    const invalid = { ...validTopic, id: 'not-a-uuid' };
    expect(() => topicSchema.parse(invalid)).toThrow();
  });

  it('should reject empty name', () => {
    const invalid = { ...validTopic, name: '' };
    expect(() => topicSchema.parse(invalid)).toThrow();
  });

  it('should reject name longer than 100 characters', () => {
    const invalid = { ...validTopic, name: 'a'.repeat(101) };
    expect(() => topicSchema.parse(invalid)).toThrow();
  });

  it('should reject description shorter than 10 characters', () => {
    const invalid = { ...validTopic, description: 'Too short' };
    expect(() => topicSchema.parse(invalid)).toThrow();
  });

  it('should reject description longer than 1000 characters', () => {
    const invalid = { ...validTopic, description: 'a'.repeat(1001) };
    expect(() => topicSchema.parse(invalid)).toThrow();
  });

  it('should accept empty tags array', () => {
    const valid = { ...validTopic, tags: [] };
    expect(() => topicSchema.parse(valid)).not.toThrow();
  });
});

describe('Concept Schema', () => {
  const validConcept: Concept = {
    id: '660e8400-e29b-41d4-a716-446655440001',
    topicId: '550e8400-e29b-41d4-a716-446655440000',
    title: 'What is a Docker container?',
    prereqIds: [],
    difficulty: Difficulty.BEGINNER,
    whyItMatters: 'Containers enable consistent deployment across environments',
    commonConfusions: [
      'Confusing containers with virtual machines',
      'Thinking containers are less secure than VMs',
    ],
    exampleTemplate:
      'Run your first container: docker run hello-world\nThis pulls and runs a simple test image.',
    applicationTemplate:
      'Create a Dockerfile for a simple Node.js app and build your first custom container image.',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  it('should validate a valid concept', () => {
    expect(() => conceptSchema.parse(validConcept)).not.toThrow();
  });

  it('should reject invalid concept UUID', () => {
    const invalid = { ...validConcept, id: 'not-a-uuid' };
    expect(() => conceptSchema.parse(invalid)).toThrow();
  });

  it('should reject invalid topic UUID', () => {
    const invalid = { ...validConcept, topicId: 'not-a-uuid' };
    expect(() => conceptSchema.parse(invalid)).toThrow();
  });

  it('should reject title shorter than 5 characters', () => {
    const invalid = { ...validConcept, title: 'Test' };
    expect(() => conceptSchema.parse(invalid)).toThrow();
  });

  it('should reject title longer than 200 characters', () => {
    const invalid = { ...validConcept, title: 'a'.repeat(201) };
    expect(() => conceptSchema.parse(invalid)).toThrow();
  });

  it('should accept concept with prerequisites', () => {
    const valid = {
      ...validConcept,
      prereqIds: ['660e8400-e29b-41d4-a716-446655440002'],
    };
    expect(() => conceptSchema.parse(valid)).not.toThrow();
  });

  it('should reject invalid prerequisite UUID', () => {
    const invalid = {
      ...validConcept,
      prereqIds: ['not-a-uuid'],
    };
    expect(() => conceptSchema.parse(invalid)).toThrow();
  });

  it('should reject more than 2 common confusions', () => {
    const invalid = {
      ...validConcept,
      commonConfusions: ['confusion1', 'confusion2', 'confusion3'],
    };
    expect(() => conceptSchema.parse(invalid)).toThrow();
  });

  it('should accept 0 common confusions', () => {
    const valid = { ...validConcept, commonConfusions: [] };
    expect(() => conceptSchema.parse(valid)).not.toThrow();
  });

  it('should reject short example template', () => {
    const invalid = { ...validConcept, exampleTemplate: 'Too short' };
    expect(() => conceptSchema.parse(invalid)).toThrow();
  });

  it('should reject short application template', () => {
    const invalid = { ...validConcept, applicationTemplate: 'Too short' };
    expect(() => conceptSchema.parse(invalid)).toThrow();
  });
});

describe('DailyLearningUnit Schema', () => {
  const validConcept: Concept = {
    id: '660e8400-e29b-41d4-a716-446655440001',
    topicId: '550e8400-e29b-41d4-a716-446655440000',
    title: 'Docker Images vs Containers',
    prereqIds: [],
    difficulty: Difficulty.BEGINNER,
    whyItMatters: 'Understanding the difference is fundamental to using Docker effectively',
    commonConfusions: ['Thinking images and containers are the same thing'],
    exampleTemplate: 'Pull an image, run a container from it, and see the difference',
    applicationTemplate: 'Create a custom image and run multiple containers from it',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const validDLU: DailyLearningUnit = {
    concept: validConcept,
    conceptExplanation:
      'A Docker image is a read-only template containing application code, libraries, and dependencies. A container is a running instance of an image. Think of an image as a class and a container as an object instantiated from that class.',
    concreteExample:
      'Let\'s pull the nginx image and run two containers from it:\n1. docker pull nginx\n2. docker run -d -p 8080:80 nginx\n3. docker run -d -p 8081:80 nginx\nYou now have one image and two running containers.',
    reflectionPrompts: [
      'How is a Docker image similar to a Git repository?',
      'Why might you want to run multiple containers from the same image?',
    ],
    applicationMoment:
      'Create a simple Dockerfile for a web app, build the image, and run two containers on different ports.',
    estimatedMinutes: 25,
  };

  it('should validate a valid DLU with application', () => {
    expect(() => dailyLearningUnitSchema.parse(validDLU)).not.toThrow();
  });

  it('should validate a valid DLU without application', () => {
    const valid = { ...validDLU, applicationMoment: undefined };
    expect(() => dailyLearningUnitSchema.parse(valid)).not.toThrow();
  });

  it('should reject short concept explanation', () => {
    const invalid = { ...validDLU, conceptExplanation: 'Too short' };
    expect(() => dailyLearningUnitSchema.parse(invalid)).toThrow();
  });

  it('should reject short concrete example', () => {
    const invalid = { ...validDLU, concreteExample: 'Too short' };
    expect(() => dailyLearningUnitSchema.parse(invalid)).toThrow();
  });

  it('should reject empty reflection prompts', () => {
    const invalid = { ...validDLU, reflectionPrompts: [] };
    expect(() => dailyLearningUnitSchema.parse(invalid)).toThrow();
  });

  it('should reject more than 2 reflection prompts', () => {
    const invalid = {
      ...validDLU,
      reflectionPrompts: ['prompt1', 'prompt2', 'prompt3'],
    };
    expect(() => dailyLearningUnitSchema.parse(invalid)).toThrow();
  });

  it('should reject estimated minutes less than 10', () => {
    const invalid = { ...validDLU, estimatedMinutes: 5 };
    expect(() => dailyLearningUnitSchema.parse(invalid)).toThrow();
  });

  it('should reject estimated minutes more than 60', () => {
    const invalid = { ...validDLU, estimatedMinutes: 65 };
    expect(() => dailyLearningUnitSchema.parse(invalid)).toThrow();
  });
});

describe('DailyPlan Schema', () => {
  const validDailyPlan: DailyPlan = {
    id: '770e8400-e29b-41d4-a716-446655440003',
    userId: '880e8400-e29b-41d4-a716-446655440004',
    topicId: '550e8400-e29b-41d4-a716-446655440000',
    generatedAt: new Date(),
    conceptSequence: [
      '660e8400-e29b-41d4-a716-446655440001',
      '660e8400-e29b-41d4-a716-446655440002',
      '660e8400-e29b-41d4-a716-446655440003',
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  it('should validate a valid daily plan', () => {
    expect(() => dailyPlanSchema.parse(validDailyPlan)).not.toThrow();
  });

  it('should reject invalid plan UUID', () => {
    const invalid = { ...validDailyPlan, id: 'not-a-uuid' };
    expect(() => dailyPlanSchema.parse(invalid)).toThrow();
  });

  it('should reject invalid user UUID', () => {
    const invalid = { ...validDailyPlan, userId: 'not-a-uuid' };
    expect(() => dailyPlanSchema.parse(invalid)).toThrow();
  });

  it('should reject invalid topic UUID', () => {
    const invalid = { ...validDailyPlan, topicId: 'not-a-uuid' };
    expect(() => dailyPlanSchema.parse(invalid)).toThrow();
  });

  it('should reject empty concept sequence', () => {
    const invalid = { ...validDailyPlan, conceptSequence: [] };
    expect(() => dailyPlanSchema.parse(invalid)).toThrow();
  });

  it('should reject invalid concept UUID in sequence', () => {
    const invalid = {
      ...validDailyPlan,
      conceptSequence: ['not-a-uuid'],
    };
    expect(() => dailyPlanSchema.parse(invalid)).toThrow();
  });
});

describe('TopicGraph Schema', () => {
  const validTopic: Topic = {
    id: '550e8400-e29b-41d4-a716-446655440000',
    name: 'Docker',
    description: 'Learn containerization with Docker',
    tags: ['containers'],
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const beginnerConcept: Concept = {
    id: '660e8400-e29b-41d4-a716-446655440001',
    topicId: validTopic.id,
    title: 'What is Docker?',
    prereqIds: [],
    difficulty: Difficulty.BEGINNER,
    whyItMatters: 'Foundation of containerization',
    commonConfusions: [],
    exampleTemplate:
      'Run your first Docker command: docker --version\nThis verifies Docker is installed correctly.',
    applicationTemplate:
      'Install Docker on your system and verify the installation by running docker --version',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const intermediateConcept: Concept = {
    ...beginnerConcept,
    id: '660e8400-e29b-41d4-a716-446655440002',
    title: 'Docker Compose',
    prereqIds: [beginnerConcept.id],
    difficulty: Difficulty.INTERMEDIATE,
  };

  const validTopicGraph: TopicGraph = {
    topic: validTopic,
    concepts: [beginnerConcept, intermediateConcept],
    totalConcepts: 2,
    conceptsByDifficulty: {
      beginner: [beginnerConcept],
      intermediate: [intermediateConcept],
      advanced: [],
    },
  };

  it('should validate a valid topic graph', () => {
    expect(() => topicGraphSchema.parse(validTopicGraph)).not.toThrow();
  });

  it('should reject empty concepts array', () => {
    const invalid = {
      ...validTopicGraph,
      concepts: [],
      totalConcepts: 0,
      conceptsByDifficulty: { beginner: [], intermediate: [], advanced: [] },
    };
    expect(() => topicGraphSchema.parse(invalid)).toThrow();
  });

  it('should reject negative total concepts', () => {
    const invalid = { ...validTopicGraph, totalConcepts: -1 };
    expect(() => topicGraphSchema.parse(invalid)).toThrow();
  });
});

describe('Create Input Schemas', () => {
  it('should validate create topic input without id and timestamps', () => {
    const valid = {
      name: 'Kubernetes',
      description: 'Learn container orchestration with Kubernetes',
      tags: ['orchestration', 'devops'],
    };
    expect(() => createTopicInputSchema.parse(valid)).not.toThrow();
  });

  it('should validate create concept input without id and timestamps', () => {
    const valid = {
      topicId: '550e8400-e29b-41d4-a716-446655440000',
      title: 'Kubernetes Pods',
      prereqIds: [],
      difficulty: Difficulty.BEGINNER,
      whyItMatters: 'Pods are the smallest deployable units',
      commonConfusions: [],
      exampleTemplate:
        'Create a simple pod: kubectl run nginx --image=nginx\nVerify it is running: kubectl get pods',
      applicationTemplate:
        'Create a multi-container pod with nginx and a sidecar container using a YAML manifest',
    };
    expect(() => createConceptInputSchema.parse(valid)).not.toThrow();
  });

  it('should validate create daily plan input without id and timestamps', () => {
    const valid = {
      userId: '880e8400-e29b-41d4-a716-446655440004',
      topicId: '550e8400-e29b-41d4-a716-446655440000',
      generatedAt: new Date(),
      conceptSequence: ['660e8400-e29b-41d4-a716-446655440001'],
    };
    expect(() => createDailyPlanInputSchema.parse(valid)).not.toThrow();
  });
});

describe('ConceptWithProgress Schema', () => {
  it('should validate concept with progress tracking', () => {
    const valid = {
      id: '660e8400-e29b-41d4-a716-446655440001',
      topicId: '550e8400-e29b-41d4-a716-446655440000',
      title: 'Docker Basics',
      prereqIds: [],
      difficulty: Difficulty.BEGINNER,
      whyItMatters: 'Foundation',
      commonConfusions: [],
      exampleTemplate:
        'Run your first Docker container: docker run hello-world\nThis demonstrates basic Docker functionality',
      applicationTemplate:
        'Create a simple Dockerfile for a web application and build an image from it',
      createdAt: new Date(),
      updatedAt: new Date(),
      completed: true,
      completedAt: new Date(),
      prerequisitesSatisfied: true,
    };
    expect(() => conceptWithProgressSchema.parse(valid)).not.toThrow();
  });

  it('should validate incomplete concept without completedAt', () => {
    const valid = {
      id: '660e8400-e29b-41d4-a716-446655440001',
      topicId: '550e8400-e29b-41d4-a716-446655440000',
      title: 'Docker Basics',
      prereqIds: [],
      difficulty: Difficulty.BEGINNER,
      whyItMatters: 'Foundation',
      commonConfusions: [],
      exampleTemplate:
        'Run your first Docker container: docker run hello-world\nThis demonstrates basic Docker functionality',
      applicationTemplate:
        'Create a simple Dockerfile for a web application and build an image from it',
      createdAt: new Date(),
      updatedAt: new Date(),
      completed: false,
      prerequisitesSatisfied: true,
    };
    expect(() => conceptWithProgressSchema.parse(valid)).not.toThrow();
  });
});

describe('DailyPlanProgress Schema', () => {
  const validProgress = {
    plan: {
      id: '770e8400-e29b-41d4-a716-446655440003',
      userId: '880e8400-e29b-41d4-a716-446655440004',
      topicId: '550e8400-e29b-41d4-a716-446655440000',
      generatedAt: new Date(),
      conceptSequence: ['660e8400-e29b-41d4-a716-446655440001'],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    totalConcepts: 10,
    completedConcepts: 3,
    currentConceptIndex: 3,
    progressPercentage: 30,
  };

  it('should validate daily plan progress', () => {
    expect(() => dailyPlanProgressSchema.parse(validProgress)).not.toThrow();
  });

  it('should reject negative completed concepts', () => {
    const invalid = { ...validProgress, completedConcepts: -1 };
    expect(() => dailyPlanProgressSchema.parse(invalid)).toThrow();
  });

  it('should reject progress percentage less than 0', () => {
    const invalid = { ...validProgress, progressPercentage: -5 };
    expect(() => dailyPlanProgressSchema.parse(invalid)).toThrow();
  });

  it('should reject progress percentage greater than 100', () => {
    const invalid = { ...validProgress, progressPercentage: 105 };
    expect(() => dailyPlanProgressSchema.parse(invalid)).toThrow();
  });
});
