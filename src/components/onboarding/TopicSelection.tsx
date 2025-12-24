'use client';

import React, { useState, useEffect } from 'react';

// Topic data structure
export interface Topic {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  gradient: string;
  comingSoon?: boolean;
}

interface TopicSelectionProps {
  onTopicSelected?: (topicId: string) => void;
}

// Available topics
const TOPICS: Topic[] = [
  {
    id: 'docker',
    name: 'Docker',
    description: 'Master containerization from fundamentals to production deployments. Build, ship, and run applications anywhere.',
    gradient: 'from-blue-500 to-cyan-500',
    icon: (
      <svg className="w-12 h-12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
      </svg>
    ),
  },
  {
    id: 'kubernetes',
    name: 'Kubernetes',
    description: 'Orchestrate containers at scale. Learn cluster management, deployments, and cloud-native architectures.',
    gradient: 'from-indigo-500 to-purple-500',
    icon: (
      <svg className="w-12 h-12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 2v20M2 12h20" />
        <path d="M6.34 6.34l11.32 11.32M17.66 6.34L6.34 17.66" />
      </svg>
    ),
  },
  {
    id: 'python',
    name: 'Python',
    description: 'From scripting to systems programming. Build automation, APIs, and powerful applications.',
    gradient: 'from-green-500 to-emerald-500',
    comingSoon: true,
    icon: (
      <svg className="w-12 h-12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M9 3h6l3 3v12l-3 3H9l-3-3V6l3-3z" />
        <path d="M9 12h6M12 9v6" />
      </svg>
    ),
  },
];

export const TopicSelection: React.FC<TopicSelectionProps> = ({ onTopicSelected }) => {
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [hoveredTopic, setHoveredTopic] = useState<string | null>(null);
  const [focusedIndex, setFocusedIndex] = useState<number>(-1);
  const [mounted, setMounted] = useState(false);

  // Entrance animation
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleTopicSelect = (topicId: string, comingSoon?: boolean) => {
    if (comingSoon) return;
    setSelectedTopic(topicId);
  };

  const handleContinue = () => {
    if (selectedTopic && onTopicSelected) {
      onTopicSelected(selectedTopic);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    const availableTopics = TOPICS.filter(t => !t.comingSoon);
    
    switch (e.key) {
      case 'ArrowRight':
      case 'ArrowDown':
        e.preventDefault();
        setFocusedIndex(prev => {
          const next = (prev + 1) % availableTopics.length;
          return next;
        });
        break;
      case 'ArrowLeft':
      case 'ArrowUp':
        e.preventDefault();
        setFocusedIndex(prev => {
          const next = prev <= 0 ? availableTopics.length - 1 : prev - 1;
          return next;
        });
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        if (focusedIndex >= 0 && focusedIndex < availableTopics.length) {
          handleTopicSelect(availableTopics[focusedIndex].id);
        }
        break;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-50 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div 
        className={`w-full max-w-5xl transition-all duration-700 ${
          mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
      >
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16">
          <h1 
            className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 tracking-tight"
            style={{
              animation: mounted ? 'fadeInUp 0.6s ease-out' : 'none',
            }}
          >
            Choose Your Path
          </h1>
          <p 
            className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto"
            style={{
              animation: mounted ? 'fadeInUp 0.6s ease-out 0.1s both' : 'none',
            }}
          >
            Select a technology to master. We'll create a personalized learning journey tailored to your experience and goals.
          </p>
        </div>

        {/* Topics Grid */}
        <div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12"
          onKeyDown={handleKeyDown}
          role="radiogroup"
          aria-label="Choose a topic"
        >
          {TOPICS.map((topic, index) => {
            const isSelected = selectedTopic === topic.id;
            const isHovered = hoveredTopic === topic.id;
            const isFocused = focusedIndex === index && !topic.comingSoon;
            
            return (
              <div
                key={topic.id}
                style={{
                  animation: mounted ? `fadeInUp 0.6s ease-out ${0.2 + index * 0.1}s both` : 'none',
                }}
              >
                <TopicCard
                  topic={topic}
                  isSelected={isSelected}
                  isHovered={isHovered}
                  isFocused={isFocused}
                  onSelect={handleTopicSelect}
                  onHover={setHoveredTopic}
                  tabIndex={topic.comingSoon ? -1 : 0}
                />
              </div>
            );
          })}
        </div>

        {/* Continue Button */}
        <div 
          className="flex justify-center"
          style={{
            animation: mounted ? 'fadeInUp 0.6s ease-out 0.5s both' : 'none',
          }}
        >
          <button
            onClick={handleContinue}
            disabled={!selectedTopic}
            className={`
              group relative px-8 py-4 rounded-xl font-semibold text-base
              transition-all duration-300 transform
              focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
              ${selectedTopic
                ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/30 hover:bg-primary-600 hover:shadow-xl hover:shadow-primary-500/40 hover:-translate-y-0.5'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }
            `}
          >
            <span className="relative z-10">Continue to Questionnaire</span>
            {selectedTopic && (
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary-400 to-primary-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            )}
            {selectedTopic && (
              <svg 
                className="inline-block w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform duration-300" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            )}
          </button>
        </div>
      </div>

      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

// Separate TopicCard component for reusability
interface TopicCardProps {
  topic: Topic;
  isSelected: boolean;
  isHovered: boolean;
  isFocused: boolean;
  onSelect: (id: string, comingSoon?: boolean) => void;
  onHover: (id: string | null) => void;
  tabIndex?: number;
}

const TopicCard: React.FC<TopicCardProps> = ({
  topic,
  isSelected,
  isHovered,
  isFocused,
  onSelect,
  onHover,
  tabIndex = 0,
}) => {
  return (
    <button
      onClick={() => onSelect(topic.id, topic.comingSoon)}
      onMouseEnter={() => onHover(topic.id)}
      onMouseLeave={() => onHover(null)}
      onFocus={() => onHover(topic.id)}
      onBlur={() => onHover(null)}
      disabled={topic.comingSoon}
      tabIndex={tabIndex}
      role="radio"
      aria-checked={isSelected}
      aria-label={`${topic.name}: ${topic.description}${topic.comingSoon ? ' (Coming soon)' : ''}`}
      className={`
        relative w-full text-left p-8 rounded-2xl
        bg-white
        transition-all duration-300 transform
        focus:outline-none
        ${topic.comingSoon 
          ? 'opacity-60 cursor-not-allowed' 
          : 'cursor-pointer hover:-translate-y-1'
        }
        ${isSelected && !topic.comingSoon
          ? 'ring-2 ring-primary-500 shadow-xl shadow-primary-500/20'
          : 'border-2 border-gray-200 hover:border-gray-300 shadow-md hover:shadow-lg'
        }
        ${isFocused && !topic.comingSoon
          ? 'ring-2 ring-primary-500 ring-offset-2'
          : ''
        }
      `}
    >
      {/* Selected indicator */}
      {isSelected && !topic.comingSoon && (
        <div className="absolute top-4 right-4">
          <div className="w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
      )}

      {/* Coming Soon Badge */}
      {topic.comingSoon && (
        <div className="absolute top-4 right-4">
          <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-semibold rounded-full">
            Coming Soon
          </span>
        </div>
      )}

      {/* Icon with gradient background */}
      <div className="mb-6">
        <div 
          className={`
            inline-flex p-4 rounded-xl bg-gradient-to-br ${topic.gradient}
            text-white transition-transform duration-300
            ${isHovered && !topic.comingSoon ? 'scale-110 rotate-3' : ''}
          `}
        >
          {topic.icon}
        </div>
      </div>

      {/* Content */}
      <h3 className="text-2xl font-bold text-gray-900 mb-3">
        {topic.name}
      </h3>
      <p className="text-gray-600 leading-relaxed">
        {topic.description}
      </p>

      {/* Hover indicator */}
      {!topic.comingSoon && (
        <div 
          className={`
            mt-6 flex items-center text-primary-600 font-medium
            transition-all duration-300
            ${isHovered || isSelected ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2'}
          `}
        >
          <span className="text-sm">
            {isSelected ? 'Selected' : 'Select this topic'}
          </span>
          <svg 
            className="w-4 h-4 ml-2" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      )}
    </button>
  );
};

// Export both components
export { TopicCard };