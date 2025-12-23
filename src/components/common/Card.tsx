import React from 'react';

export interface CardProps {
  /** Card content */
  children: React.ReactNode;
  /** Optional header content */
  header?: React.ReactNode;
  /** Optional footer content */
  footer?: React.ReactNode;
  /** Visual variant */
  variant?: 'default' | 'bordered' | 'elevated' | 'flat';
  /** Make card interactive (hover effects, clickable) */
  interactive?: boolean;
  /** Click handler - automatically makes card interactive */
  onClick?: () => void;
  /** Padding size */
  padding?: 'none' | 'sm' | 'md' | 'lg';
  /** Additional class names */
  className?: string;
  /** Header class names */
  headerClassName?: string;
  /** Footer class names */
  footerClassName?: string;
  /** Body class names */
  bodyClassName?: string;
}

/**
 * Card Component
 * 
 * Flexible container for content with optional header and footer.
 * Follows AI Learning Lab design system with subtle, calm aesthetics.
 * 
 * @example
 * // Basic card
 * <Card>
 *   <p>Card content goes here</p>
 * </Card>
 * 
 * @example
 * // With header and footer
 * <Card
 *   header={<h3 className="font-semibold">Card Title</h3>}
 *   footer={<Button>Action</Button>}
 * >
 *   Card body content
 * </Card>
 * 
 * @example
 * // Interactive card
 * <Card interactive onClick={() => console.log('clicked')}>
 *   Click me!
 * </Card>
 */
export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  (
    {
      children,
      header,
      footer,
      variant = 'default',
      interactive = false,
      onClick,
      padding = 'md',
      className = '',
      headerClassName = '',
      footerClassName = '',
      bodyClassName = '',
    },
    ref
  ) => {
    // Determine if card should be interactive
    const isInteractive = interactive || !!onClick;

    // Base styles
    const baseStyles = `
      bg-white
      rounded-md
      transition-all duration-200
    `.trim().replace(/\s+/g, ' ');

    // Variant styles
    const variantStyles = {
      default: `
        border border-gray-200
        shadow-sm
        ${isInteractive ? 'hover:shadow-md hover:border-primary-300' : ''}
      `.trim().replace(/\s+/g, ' '),
      
      bordered: `
        border-2 border-gray-300
        ${isInteractive ? 'hover:border-primary-500' : ''}
      `.trim().replace(/\s+/g, ' '),
      
      elevated: `
        border border-gray-100
        shadow-md
        ${isInteractive ? 'hover:shadow-lg hover:-translate-y-0.5' : ''}
      `.trim().replace(/\s+/g, ' '),
      
      flat: `
        border border-gray-100
        ${isInteractive ? 'hover:bg-gray-50' : ''}
      `.trim().replace(/\s+/g, ' '),
    };

    // Padding styles
    const paddingStyles = {
      none: '',
      sm: 'p-4',
      md: 'p-6',
      lg: 'p-8',
    };

    // Interactive styles
    const interactiveStyles = isInteractive
      ? 'cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2'
      : '';

    // Combine card classes
    const cardClasses = [
      baseStyles,
      variantStyles[variant],
      interactiveStyles,
      className,
    ]
      .filter(Boolean)
      .join(' ');

    // Header border and padding
    const headerClasses = `
      ${header && padding !== 'none' ? paddingStyles[padding] : ''}
      ${footer || children ? 'border-b border-gray-200' : ''}
      ${headerClassName}
    `.trim();

    // Body padding
    const bodyClasses = `
      ${padding !== 'none' ? paddingStyles[padding] : ''}
      ${bodyClassName}
    `.trim();

    // Footer border and padding
    const footerClasses = `
      ${footer && padding !== 'none' ? paddingStyles[padding] : ''}
      border-t border-gray-200
      bg-gray-50
      ${footerClassName}
    `.trim();

    // Render as button if interactive with onClick
    const Component = isInteractive && onClick ? 'button' : 'div';
    const buttonProps = isInteractive && onClick
      ? {
          onClick,
          type: 'button' as const,
          role: 'button',
          tabIndex: 0,
          onKeyDown: (e: React.KeyboardEvent) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              onClick();
            }
          },
        }
      : {};

    return (
      <Component
        ref={ref as any}
        className={cardClasses}
        {...buttonProps}
      >
        {/* Header */}
        {header && (
          <div className={headerClasses}>
            {header}
          </div>
        )}

        {/* Body */}
        {children && (
          <div className={bodyClasses}>
            {children}
          </div>
        )}

        {/* Footer */}
        {footer && (
          <div className={footerClasses}>
            {footer}
          </div>
        )}
      </Component>
    );
  }
);

Card.displayName = 'Card';

// Example usage component
export const CardExamples = () => {
  const [selectedCard, setSelectedCard] = React.useState<string | null>(null);

  return (
    <div className="space-y-8 p-8 bg-gray-50">
      {/* Basic Cards */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Basic Cards</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <h4 className="font-semibold text-gray-900 mb-2">Simple Card</h4>
            <p className="text-gray-600 text-sm">
              This is a basic card with default styling.
            </p>
          </Card>

          <Card variant="bordered">
            <h4 className="font-semibold text-gray-900 mb-2">Bordered Card</h4>
            <p className="text-gray-600 text-sm">
              This card has a thicker border.
            </p>
          </Card>

          <Card variant="elevated">
            <h4 className="font-semibold text-gray-900 mb-2">Elevated Card</h4>
            <p className="text-gray-600 text-sm">
              This card has more prominent shadow.
            </p>
          </Card>

          <Card variant="flat">
            <h4 className="font-semibold text-gray-900 mb-2">Flat Card</h4>
            <p className="text-gray-600 text-sm">
              This card has minimal shadow.
            </p>
          </Card>
        </div>
      </div>

      {/* Cards with Header and Footer */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">With Header & Footer</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card
            header={
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-gray-900">Daily Learning Unit</h4>
                <span className="text-xs text-gray-500">5-7 min</span>
              </div>
            }
            footer={
              <div className="flex justify-end gap-2">
                <button className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900">
                  Skip
                </button>
                <button className="px-3 py-1.5 text-sm bg-primary-500 text-white rounded hover:bg-primary-600">
                  Start
                </button>
              </div>
            }
          >
            <p className="text-gray-600 text-sm">
              Learn about Docker containers and how they differ from virtual machines.
            </p>
          </Card>

          <Card
            header={<h4 className="font-semibold text-gray-900">Memory Entry</h4>}
            footer={
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <span className="inline-flex items-center px-2 py-0.5 bg-success-100 text-success-800 rounded-full">
                  Proof-backed
                </span>
                <span>·</span>
                <span>2 hours ago</span>
              </div>
            }
          >
            <p className="text-gray-600 text-sm mb-3">
              Today I learned how to use docker-compose to orchestrate multiple containers.
            </p>
            <div className="flex items-center gap-2 text-xs">
              <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded">Docker</span>
              <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded">Intermediate</span>
            </div>
          </Card>
        </div>
      </div>

      {/* Interactive Cards */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Interactive Cards</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {['Docker', 'Kubernetes', 'Python'].map((topic) => (
            <Card
              key={topic}
              interactive
              onClick={() => setSelectedCard(topic)}
              variant={selectedCard === topic ? 'bordered' : 'default'}
              className={selectedCard === topic ? 'ring-2 ring-primary-500' : ''}
            >
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-gray-900">{topic}</h4>
                <svg
                  className={`w-5 h-5 transition-colors ${
                    selectedCard === topic ? 'text-primary-500' : 'text-gray-400'
                  }`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <p className="text-sm text-gray-600 mt-2">
                Click to select this topic for learning
              </p>
            </Card>
          ))}
        </div>
        {selectedCard && (
          <p className="text-sm text-gray-600">Selected: <strong>{selectedCard}</strong></p>
        )}
      </div>

      {/* Padding Variations */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Padding Variations</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card padding="sm">
            <p className="text-sm text-gray-600">Small padding (16px)</p>
          </Card>

          <Card padding="md">
            <p className="text-sm text-gray-600">Medium padding (24px - default)</p>
          </Card>

          <Card padding="lg">
            <p className="text-sm text-gray-600">Large padding (32px)</p>
          </Card>

          <Card padding="none" className="p-0">
            <div className="p-4 border-b border-gray-200">
              <p className="text-sm font-medium text-gray-900">Custom padding</p>
            </div>
            <div className="p-6">
              <p className="text-sm text-gray-600">
                Use padding="none" for full control over spacing
              </p>
            </div>
          </Card>
        </div>
      </div>

      {/* Content Examples */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Real-World Examples</h3>
        
        {/* Concept Card */}
        <Card
          header={
            <div>
              <div className="flex items-center justify-between mb-1">
                <h4 className="font-semibold text-gray-900">Today's Concept</h4>
                <span className="text-xs text-gray-500">Day 3 of 30</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Docker Images vs Containers</h3>
            </div>
          }
          footer={
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Estimated: 5-7 minutes</span>
              <button className="px-4 py-2 bg-primary-500 text-white rounded text-sm hover:bg-primary-600">
                Start Learning
              </button>
            </div>
          }
        >
          <p className="text-gray-600 mb-4">
            Understanding the difference between images and containers is fundamental to working with Docker effectively.
          </p>
          <div className="bg-primary-50 border-l-4 border-primary-500 p-3 rounded">
            <p className="text-sm text-primary-900">
              <strong>Why it matters:</strong> This concept is the foundation for understanding how Docker manages application lifecycle.
            </p>
          </div>
        </Card>

        {/* Progress Card */}
        <Card variant="flat">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-semibold text-gray-900">Weekly Progress</h4>
            <span className="text-2xl font-semibold text-primary-600">5/7</span>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Completed days</span>
              <span className="font-medium text-gray-900">5</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Proof-backed entries</span>
              <span className="font-medium text-gray-900">3</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Current streak</span>
              <span className="font-medium text-gray-900">3 days</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};