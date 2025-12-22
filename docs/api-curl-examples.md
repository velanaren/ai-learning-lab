# API Curl Test Examples

Complete curl examples for testing all onboarding API endpoints.

## Prerequisites

1. Start the development server:
```bash
npm run dev
```

2. Set your API key (if using Groq for contract generation):
```bash
export GROQ_API_KEY="your_groq_api_key_here"
```

3. Base URL for local testing:
```bash
BASE_URL="http://localhost:3000"
```

---

## 1. POST /api/onboarding/topic

Save the user's selected topic.

### Success Case

```bash
curl -X POST http://localhost:3000/api/onboarding/topic \
  -H "Content-Type: application/json" \
  -H "x-user-id: temp-user-123" \
  -d '{
    "topicId": "123e4567-e89b-12d3-a456-426614174000",
    "topicName": "Docker"
  }'
```

**Expected Response (201):**
```json
{
  "success": true,
  "data": {
    "topicId": "123e4567-e89b-12d3-a456-426614174000",
    "topicName": "Docker",
    "savedAt": "2025-01-15T10:30:00.000Z"
  },
  "message": "Topic saved successfully"
}
```

### Error Cases

**Invalid UUID:**
```bash
curl -X POST http://localhost:3000/api/onboarding/topic \
  -H "Content-Type: application/json" \
  -H "x-user-id: temp-user-123" \
  -d '{
    "topicId": "invalid-uuid",
    "topicName": "Docker"
  }'
```

**Missing Authentication:**
```bash
curl -X POST http://localhost:3000/api/onboarding/topic \
  -H "Content-Type: application/json" \
  -d '{
    "topicId": "123e4567-e89b-12d3-a456-426614174000",
    "topicName": "Docker"
  }'
```

---

## 2. POST /api/onboarding/questionnaire

Save complete questionnaire responses.

### Success Case

```bash
curl -X POST http://localhost:3000/api/onboarding/questionnaire \
  -H "Content-Type: application/json" \
  -H "x-user-id: temp-user-123" \
  -d '{
    "role": "DevOps-SRE",
    "baselineSkills": ["Linux CLI", "Git"],
    "priorExperience": "Used basics",
    "goals": ["Improve current role"],
    "outcomes": ["Build real apps", "Troubleshoot"],
    "masteryLevel": "devops-grade mastery",
    "learningFlow": "mix",
    "complexityPref": "gradually one layer",
    "troubleshooting": "very important",
    "platform": "Linux",
    "toolInstallComfort": "yes",
    "dailyMinutes": 30,
    "weeklyHours": 5,
    "pacingPref": "recap+continue",
    "learningStyle": ["step-by-step labs", "visuals"],
    "frustrationPref": "too much theory without practice",
    "depthPref": "never compromise on accuracy",
    "comfortPrefs": {
      "learningFormats": ["text-first", "step-by-step labs"],
      "videoPreference": "short clips only",
      "overwhelmTriggers": ["too many new terms"],
      "sessionStyle": "one concept + small application",
      "contentOrder": "TL;DR → details",
      "skipBehavior": "gentle recap",
      "uiToggles": ["Focus Mode"]
    },
    "applicationPref": ["running commands", "linking GitHub"],
    "trackingPref": "learning + applications + evidence links",
    "evidencePref": "very important"
  }'
```

**Expected Response (201):**
```json
{
  "success": true,
  "data": {
    "profileId": "temp-user-123",
    "savedAt": "2025-01-15T10:32:00.000Z",
    "isComplete": true,
    "nextStep": "generate-contract"
  },
  "message": "Questionnaire responses saved successfully"
}
```

### Minimal Example (Student Profile)

```bash
curl -X POST http://localhost:3000/api/onboarding/questionnaire \
  -H "Content-Type: application/json" \
  -H "x-user-id: temp-user-123" \
  -d '{
    "role": "Student",
    "baselineSkills": ["None"],
    "priorExperience": "Never",
    "goals": ["Fundamentals"],
    "outcomes": ["Understand internals"],
    "masteryLevel": "use confidently",
    "learningFlow": "concepts-first",
    "complexityPref": "gradually one layer",
    "troubleshooting": "some",
    "platform": "macOS Apple Silicon",
    "toolInstallComfort": "prefer minimal setup",
    "dailyMinutes": 45,
    "weeklyHours": 10,
    "pacingPref": "ask before adjusting",
    "learningStyle": ["analogies"],
    "frustrationPref": "oversimplified explanations",
    "depthPref": "never compromise on accuracy",
    "comfortPrefs": {
      "learningFormats": ["text-first"],
      "videoPreference": "5–10 min occasionally",
      "overwhelmTriggers": ["long explanations without checkpoints"],
      "sessionStyle": "one concept per day",
      "contentOrder": "TL;DR → details",
      "skipBehavior": "ask before changing pace",
      "uiToggles": []
    },
    "applicationPref": ["writing short reflections"],
    "trackingPref": "learning only",
    "evidencePref": "nice-to-have"
  }'
```

---

## 3. POST /api/onboarding/generate-contract

Generate personalized learning contract using Groq AI.

### Success Case

**Note:** This endpoint requires a full UserProfile object including `id`, `createdAt`, and `updatedAt`.

```bash
curl -X POST http://localhost:3000/api/onboarding/generate-contract \
  -H "Content-Type: application/json" \
  -H "x-user-id: temp-user-123" \
  -d '{
    "userProfile": {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "role": "DevOps-SRE",
      "baselineSkills": ["Linux CLI", "Bash scripting", "Git"],
      "priorExperience": "Used basics",
      "goals": ["Improve current role", "Fundamentals"],
      "outcomes": ["Build real apps", "Use in CI-CD", "Troubleshoot"],
      "masteryLevel": "devops-grade mastery",
      "learningFlow": "mix",
      "complexityPref": "gradually one layer",
      "troubleshooting": "very important",
      "platform": "Linux",
      "toolInstallComfort": "yes",
      "dailyMinutes": 30,
      "weeklyHours": 5,
      "pacingPref": "recap+continue",
      "learningStyle": ["step-by-step labs", "visuals"],
      "frustrationPref": "too much theory without practice",
      "depthPref": "never compromise on accuracy",
      "comfortPrefs": {
        "learningFormats": ["text-first", "step-by-step labs"],
        "videoPreference": "short clips only",
        "overwhelmTriggers": ["too many new terms", "too many links"],
        "sessionStyle": "one concept + small application",
        "contentOrder": "TL;DR → details",
        "skipBehavior": "gentle recap",
        "uiToggles": ["Focus Mode"]
      },
      "applicationPref": ["running commands", "linking GitHub", "code/config snippets"],
      "trackingPref": "learning + applications + evidence links",
      "evidencePref": "very important",
      "createdAt": "2025-01-15T10:00:00.000Z",
      "updatedAt": "2025-01-15T10:00:00.000Z"
    }
  }'
```

**Expected Response (200):**
```json
{
  "success": true,
  "data": {
    "contract": {
      "profileSummary": "You're a DevOps/SRE professional with experience in Linux CLI, Bash scripting, and Git...",
      "learningApproach": "- Mix concepts and hands-on practice throughout\n- Increase complexity gradually...",
      "contentFormat": "- Text-first learning\n- Step-by-step hands-on labs...",
      "dailyStructure": "- 20-30 minute sessions (concept + example + reflection)...",
      "skipBehavior": "- Gentle recap (1-3 minutes) before resuming after missed days...",
      "tracking": "- Every concept you learn (automatic memory entry created)...",
      "emphasis": [
        "Building real-world applications and projects",
        "CI/CD pipeline integration and automation workflows",
        "Troubleshooting common issues and debugging"
      ],
      "skipped": [
        "Windows and macOS-specific features",
        "Extended theoretical explanations without hands-on"
      ],
      "generatedAt": "2025-01-15T10:35:00.000Z"
    },
    "userId": "123e4567-e89b-12d3-a456-426614174000",
    "nextStep": "confirm-contract"
  },
  "message": "Learning contract generated successfully"
}
```

### Alternative: Using userId (Not Yet Implemented)

```bash
# This will return an error until database is implemented
curl -X POST http://localhost:3000/api/onboarding/generate-contract \
  -H "Content-Type: application/json" \
  -H "x-user-id: temp-user-123" \
  -d '{
    "userId": "123e4567-e89b-12d3-a456-426614174000"
  }'
```

---

## 4. POST /api/onboarding/confirm-contract

Confirm and persist the learning contract.

### Success Case - Confirmed

```bash
curl -X POST http://localhost:3000/api/onboarding/confirm-contract \
  -H "Content-Type: application/json" \
  -H "x-user-id: temp-user-123" \
  -d '{
    "userId": "temp-user-123",
    "contract": {
      "profileSummary": "You are a DevOps/SRE professional with experience in Linux CLI, Bash scripting, and Git. You want to learn Docker to improve in your current role and build a foundation for advanced concepts. You can commit 30 minutes daily, about 5 hours per week.",
      "learningApproach": "Mix concepts and hands-on practice throughout\nIncrease complexity gradually, one layer at a time\nInclude extensive troubleshooting practice\nTarget \"devops-grade mastery\" mastery level",
      "contentFormat": "Text-first learning\nDiagrams and mental models for complex concepts\nStep-by-step hands-on labs\nShort video clips (≤3 min) only when truly needed\nLimit new technical terms per concept\nMinimal external links to avoid distraction\nStart with TL;DR, then dive into details",
      "dailyStructure": "20-30 minute sessions (concept + example + reflection)\nOptional 5-10 minute application moments\nOne concept per day to keep sessions finishable\nAiming for 5 hours per week total",
      "skipBehavior": "Gentle recap (1-3 minutes) before resuming after missed days\nContinue where you left off after recap",
      "tracking": "Every concept you learn (automatic memory entry created)\nApplication moments you complete\nEvidence links (GitHub repos, code snippets, command outputs) when you choose to attach them",
      "emphasis": [
        "Building real-world applications and projects",
        "CI/CD pipeline integration and automation workflows",
        "Troubleshooting common issues and debugging",
        "Technical accuracy and deep understanding",
        "Hands-on step-by-step practical exercises",
        "Visual diagrams and mental models"
      ],
      "skipped": [
        "Windows and macOS-specific features",
        "Extended theoretical explanations without hands-on"
      ],
      "generatedAt": "2025-01-15T10:35:00.000Z"
    },
    "confirmed": true,
    "corrections": ""
  }'
```

**Expected Response (200):**
```json
{
  "success": true,
  "data": {
    "contractId": "contract-1234567890",
    "userId": "temp-user-123",
    "confirmedAt": "2025-01-15T10:40:00.000Z",
    "onboardingComplete": true,
    "nextStep": "day-1"
  },
  "message": "Learning contract confirmed! Onboarding complete."
}
```

### Success Case - Corrections Requested

```bash
curl -X POST http://localhost:3000/api/onboarding/confirm-contract \
  -H "Content-Type: application/json" \
  -H "x-user-id: temp-user-123" \
  -d '{
    "userId": "temp-user-123",
    "contract": {
      "profileSummary": "You are a DevOps/SRE professional...",
      "learningApproach": "Mix concepts and hands-on practice...",
      "contentFormat": "Text-first learning...",
      "dailyStructure": "20-30 minute sessions...",
      "skipBehavior": "Gentle recap...",
      "tracking": "Every concept you learn...",
      "emphasis": ["CI/CD integration"],
      "skipped": ["Windows features"],
      "generatedAt": "2025-01-15T10:35:00.000Z"
    },
    "confirmed": false,
    "corrections": "I would like more emphasis on troubleshooting production issues and less on CI/CD pipelines."
  }'
```

**Expected Response (200):**
```json
{
  "success": true,
  "data": {
    "contractId": "contract-1234567890",
    "userId": "temp-user-123",
    "confirmedAt": "2025-01-15T10:40:00.000Z",
    "onboardingComplete": false,
    "nextStep": "revise-contract"
  },
  "message": "Corrections received. We will revise your contract."
}
```

### Error Case - User ID Mismatch

```bash
curl -X POST http://localhost:3000/api/onboarding/confirm-contract \
  -H "Content-Type: application/json" \
  -H "x-user-id: temp-user-123" \
  -d '{
    "userId": "different-user-456",
    "contract": {
      "profileSummary": "...",
      "learningApproach": "...",
      "contentFormat": "...",
      "dailyStructure": "...",
      "skipBehavior": "...",
      "tracking": "...",
      "emphasis": [],
      "skipped": [],
      "generatedAt": "2025-01-15T10:35:00.000Z"
    },
    "confirmed": true
  }'
```

**Expected Response (403):**
```json
{
  "success": false,
  "error": {
    "code": "FORBIDDEN",
    "message": "User ID mismatch"
  }
}
```

---

## Complete Onboarding Flow Example

Here's a complete shell script to test the entire onboarding flow:

```bash
#!/bin/bash

# Complete Onboarding Flow Test Script
# Tests all endpoints in sequence

BASE_URL="http://localhost:3000"
USER_ID="temp-user-123"

echo "=== Step 1: Save Topic ==="
curl -X POST $BASE_URL/api/onboarding/topic \
  -H "Content-Type: application/json" \
  -H "x-user-id: $USER_ID" \
  -d '{
    "topicId": "123e4567-e89b-12d3-a456-426614174000",
    "topicName": "Docker"
  }' | jq

echo -e "\n=== Step 2: Save Questionnaire ==="
curl -X POST $BASE_URL/api/onboarding/questionnaire \
  -H "Content-Type: application/json" \
  -H "x-user-id: $USER_ID" \
  -d '{
    "role": "DevOps-SRE",
    "baselineSkills": ["Linux CLI", "Git"],
    "priorExperience": "Used basics",
    "goals": ["Improve current role"],
    "outcomes": ["Build real apps"],
    "masteryLevel": "devops-grade mastery",
    "learningFlow": "mix",
    "complexityPref": "gradually one layer",
    "troubleshooting": "very important",
    "platform": "Linux",
    "toolInstallComfort": "yes",
    "dailyMinutes": 30,
    "weeklyHours": 5,
    "pacingPref": "recap+continue",
    "learningStyle": ["step-by-step labs"],
    "frustrationPref": "too much theory without practice",
    "depthPref": "never compromise on accuracy",
    "comfortPrefs": {
      "learningFormats": ["text-first"],
      "videoPreference": "short clips only",
      "overwhelmTriggers": ["too many new terms"],
      "sessionStyle": "one concept + small application",
      "contentOrder": "TL;DR → details",
      "skipBehavior": "gentle recap",
      "uiToggles": []
    },
    "applicationPref": ["running commands"],
    "trackingPref": "learning + applications + evidence links",
    "evidencePref": "very important"
  }' | jq

echo -e "\n=== Complete! ==="
```

Save this as `test-onboarding.sh`, make it executable with `chmod +x test-onboarding.sh`, and run it with `./test-onboarding.sh`.

---

## Testing with HTTPie (Alternative)

If you prefer HTTPie over curl:

```bash
# Install HTTPie
brew install httpie  # macOS
# or
pip install httpie   # Python

# Test topic endpoint
http POST localhost:3000/api/onboarding/topic \
  x-user-id:temp-user-123 \
  topicId="123e4567-e89b-12d3-a456-426614174000" \
  topicName="Docker"
```

---

## Common Issues & Troubleshooting

### 1. GROQ_API_KEY not set

**Error:**
```json
{
  "success": false,
  "error": {
    "code": "EXTERNAL_API_ERROR",
    "message": "GROQ_API_KEY environment variable is not set"
  }
}
```

**Solution:**
```bash
export GROQ_API_KEY="your_api_key_here"
npm run dev  # Restart server
```

### 2. Invalid JSON

**Error:**
```json
{
  "success": false,
  "error": {
    "code": "INTERNAL_ERROR",
    "message": "Invalid JSON in request body"
  }
}
```

**Solution:** Validate your JSON with `jq`:
```bash
echo '{ "your": "json" }' | jq
```

### 3. Validation Errors

**Error:**
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed. Please check your input.",
    "details": [
      {
        "path": "role",
        "message": "Invalid enum value",
        "code": "invalid_enum_value"
      }
    ]
  }
}
```

**Solution:** Check the valid enum values in `/src/types/userProfile.ts`

---

## Next Steps

After successful onboarding:
1. The frontend should redirect to `/today` (Day 1)
2. The user can start their first Daily Learning Unit
3. Progress tracking begins automatically

For more information, see:
- API Documentation: `/docs/api-documentation.md`
- PRD: `/docs/prd-ai-learning-lab.md`
- Type Definitions: `/src/types/`
