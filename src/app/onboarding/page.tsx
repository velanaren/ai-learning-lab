'use client';

import { TopicSelection } from '@/components/onboarding/TopicSelection';

export default function OnboardingPage() {
  const handleTopicSelected = (topicId: string) => {
    console.log('Selected topic:', topicId);
    // TODO: Navigate to questionnaire
  };

  return <TopicSelection onTopicSelected={handleTopicSelected} />;
}