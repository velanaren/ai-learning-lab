import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual style variant */
  variant?: 'primary' | 'secondary' | 'ghost';
  /** Size of the button */
  size?: 'sm' | 'md' | 'lg';
  /** Show loading spinner and disable interaction */
  isLoading?: boolean;
  /** Full width button */
  fullWidth?: boolean;
  /** Icon to display before text */
  leftIcon?: React.ReactNode;
  /** Icon to display after text */
  rightIcon?: React.ReactNode;
  /** Children (button text/content) */
  children: React.ReactNode;
}

/**
 * Button Component
 * 
 * Accessible, keyboard-navigable button with multiple variants and states.
 * Follows AI Learning Lab design system (Linear/Stripe inspired).
 * 
 * @example
 * // Primary button
 * <Button variant="primary" onClick={handleSubmit}>
 *   Continue to Day 1
 * </Button>
 * 
 * @example
 * // Loading state
 * <Button variant="primary" isLoading disabled>
 *   Generating contract...
 * </Button>
 * 
 * @example
 * // With icon
 * <Button variant="secondary" leftIcon={<ArrowLeftIcon />}>
 *   Back
 * </Button>
 */
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      isLoading = false,
      fullWidth = false,
      leftIcon,
      rightIcon,
      disabled,
      className = '',
      children,
      type = 'button',
      ...props
    },
    ref
  ) => {
    // Base styles - always applied
    const baseStyles = `
      inline-flex items-center justify-center
      font-medium
      rounded
      transition-colors duration-200
      focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
      disabled:cursor-not-allowed
    `.trim().replace(/\s+/g, ' ');

    // Variant styles
    const variantStyles = {
      primary: `
        bg-primary-500 hover:bg-primary-600 active:bg-primary-700
        text-white
        shadow-sm
        disabled:bg-gray-300 disabled:text-gray-500 disabled:shadow-none
      `.trim().replace(/\s+/g, ' '),
      
      secondary: `
        bg-white hover:bg-gray-50 active:bg-gray-100
        text-gray-700 hover:text-gray-900
        border border-gray-300 hover:border-gray-400
        shadow-sm
        disabled:bg-gray-50 disabled:text-gray-400 disabled:border-gray-200
      `.trim().replace(/\s+/g, ' '),
      
      ghost: `
        bg-transparent hover:bg-gray-100 active:bg-gray-200
        text-gray-600 hover:text-gray-900
        disabled:text-gray-400 disabled:hover:bg-transparent
      `.trim().replace(/\s+/g, ' '),
    };

    // Size styles
    const sizeStyles = {
      sm: 'px-3 py-1.5 text-sm gap-1.5',
      md: 'px-4 py-2 text-sm gap-2',
      lg: 'px-6 py-3 text-base gap-2.5',
    };

    // Width style
    const widthStyle = fullWidth ? 'w-full' : '';

    // Loading spinner component
    const LoadingSpinner = () => (
      <svg
        className="animate-spin h-4 w-4"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
    );

    // Combine all classes
    const buttonClasses = [
      baseStyles,
      variantStyles[variant],
      sizeStyles[size],
      widthStyle,
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled || isLoading}
        className={buttonClasses}
        aria-busy={isLoading}
        {...props}
      >
        {isLoading ? (
          <>
            <LoadingSpinner />
            <span>{children}</span>
          </>
        ) : (
          <>
            {leftIcon && <span className="flex-shrink-0">{leftIcon}</span>}
            <span>{children}</span>
            {rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';

// Example usage in Storybook or documentation
export const ButtonExamples = () => {
  return (
    <div className="space-y-8 p-8 bg-gray-50">
      {/* Primary Buttons */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Primary Buttons</h3>
        <div className="flex flex-wrap gap-4">
          <Button variant="primary" size="sm">Small Primary</Button>
          <Button variant="primary" size="md">Medium Primary</Button>
          <Button variant="primary" size="lg">Large Primary</Button>
          <Button variant="primary" disabled>Disabled</Button>
          <Button variant="primary" isLoading>Loading...</Button>
        </div>
      </div>

      {/* Secondary Buttons */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Secondary Buttons</h3>
        <div className="flex flex-wrap gap-4">
          <Button variant="secondary" size="sm">Small Secondary</Button>
          <Button variant="secondary" size="md">Medium Secondary</Button>
          <Button variant="secondary" size="lg">Large Secondary</Button>
          <Button variant="secondary" disabled>Disabled</Button>
        </div>
      </div>

      {/* Ghost Buttons */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Ghost Buttons</h3>
        <div className="flex flex-wrap gap-4">
          <Button variant="ghost" size="sm">Small Ghost</Button>
          <Button variant="ghost" size="md">Medium Ghost</Button>
          <Button variant="ghost" size="lg">Large Ghost</Button>
          <Button variant="ghost" disabled>Disabled</Button>
        </div>
      </div>

      {/* With Icons */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">With Icons</h3>
        <div className="flex flex-wrap gap-4">
          <Button 
            variant="primary" 
            leftIcon={
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            }
          >
            Back
          </Button>
          <Button 
            variant="primary" 
            rightIcon={
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            }
          >
            Continue
          </Button>
          <Button 
            variant="secondary" 
            leftIcon={
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            }
          >
            Add Item
          </Button>
        </div>
      </div>

      {/* Full Width */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Full Width</h3>
        <Button variant="primary" fullWidth>
          Continue to Day 1
        </Button>
        <Button variant="secondary" fullWidth>
          Skip for Today
        </Button>
      </div>
    </div>
  );
};