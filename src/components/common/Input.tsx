import React, { useId } from 'react';

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  /** Label text displayed above input */
  label?: string;
  /** Helper text displayed below input */
  helperText?: string;
  /** Error message - displays in red and adds error styling */
  error?: string;
  /** Input size */
  size?: 'sm' | 'md' | 'lg';
  /** Full width input */
  fullWidth?: boolean;
  /** Icon to display on the left side */
  leftIcon?: React.ReactNode;
  /** Icon to display on the right side */
  rightIcon?: React.ReactNode;
  /** Optional wrapper class name */
  wrapperClassName?: string;
}

/**
 * Input Component
 * 
 * Accessible text input with label, helper text, and error states.
 * Supports keyboard navigation and screen readers.
 * 
 * @example
 * // Basic usage
 * <Input
 *   label="Email address"
 *   type="email"
 *   placeholder="you@example.com"
 * />
 * 
 * @example
 * // With error
 * <Input
 *   label="Password"
 *   type="password"
 *   error="Password must be at least 8 characters"
 * />
 * 
 * @example
 * // With helper text
 * <Input
 *   label="Topic name"
 *   helperText="Choose a topic you want to master"
 *   placeholder="e.g., Docker, Kubernetes"
 * />
 */
export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      helperText,
      error,
      size = 'md',
      fullWidth = false,
      leftIcon,
      rightIcon,
      disabled,
      required,
      className = '',
      wrapperClassName = '',
      id: providedId,
      type = 'text',
      ...props
    },
    ref
  ) => {
    // Generate unique IDs for accessibility
    const generatedId = useId();
    const id = providedId || generatedId;
    const helperTextId = `${id}-helper`;
    const errorId = `${id}-error`;

    // Base input styles
    const baseStyles = `
      w-full
      bg-white
      border rounded
      text-gray-900 placeholder:text-gray-400
      transition-colors duration-200
      focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-0
      disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed
    `.trim().replace(/\s+/g, ' ');

    // Error state styles
    const errorStyles = error
      ? 'border-error-500 focus:ring-error-500'
      : 'border-gray-300 focus:border-primary-500';

    // Size styles
    const sizeStyles = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-3 py-2 text-base',
      lg: 'px-4 py-3 text-base',
    };

    // Icon padding adjustments
    const iconPaddingStyles = {
      left: leftIcon ? 'pl-10' : '',
      right: rightIcon ? 'pr-10' : '',
    };

    // Width style
    const widthStyle = fullWidth ? 'w-full' : '';

    // Combine input classes
    const inputClasses = [
      baseStyles,
      errorStyles,
      sizeStyles[size],
      iconPaddingStyles.left,
      iconPaddingStyles.right,
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <div className={`${fullWidth ? 'w-full' : ''} ${wrapperClassName}`}>
        {/* Label */}
        {label && (
          <label
            htmlFor={id}
            className="block text-sm font-medium text-gray-700 mb-1.5"
          >
            {label}
            {required && (
              <span className="text-error-500 ml-1" aria-label="required">
                *
              </span>
            )}
          </label>
        )}

        {/* Input Container */}
        <div className="relative">
          {/* Left Icon */}
          {leftIcon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
              {leftIcon}
            </div>
          )}

          {/* Input */}
          <input
            ref={ref}
            type={type}
            id={id}
            disabled={disabled}
            required={required}
            className={inputClasses}
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={
              error ? errorId : helperText ? helperTextId : undefined
            }
            {...props}
          />

          {/* Right Icon */}
          {rightIcon && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-400">
              {rightIcon}
            </div>
          )}
        </div>

        {/* Helper Text */}
        {helperText && !error && (
          <p id={helperTextId} className="mt-1.5 text-sm text-gray-500">
            {helperText}
          </p>
        )}

        {/* Error Message */}
        {error && (
          <p id={errorId} className="mt-1.5 text-sm text-error-600" role="alert">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

// Example usage component
export const InputExamples = () => {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [searchQuery, setSearchQuery] = React.useState('');

  return (
    <div className="space-y-8 p-8 bg-gray-50 max-w-2xl">
      {/* Basic Inputs */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Basic Inputs</h3>
        
        <Input
          label="Email address"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <Input
          label="Password"
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          helperText="Must be at least 8 characters"
        />

        <Input
          label="Required field"
          placeholder="This field is required"
          required
        />
      </div>

      {/* Input Sizes */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Sizes</h3>
        
        <Input
          label="Small input"
          size="sm"
          placeholder="Small size"
        />

        <Input
          label="Medium input (default)"
          size="md"
          placeholder="Medium size"
        />

        <Input
          label="Large input"
          size="lg"
          placeholder="Large size"
        />
      </div>

      {/* With Icons */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">With Icons</h3>
        
        <Input
          label="Search"
          placeholder="Search for topics..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          leftIcon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          }
        />

        <Input
          label="Email with validation"
          type="email"
          placeholder="you@example.com"
          rightIcon={
            <svg className="w-5 h-5 text-success-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          }
        />
      </div>

      {/* States */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">States</h3>
        
        <Input
          label="Error state"
          placeholder="Invalid input"
          error="This field is required"
        />

        <Input
          label="Disabled state"
          placeholder="Cannot edit"
          disabled
          value="Disabled input"
        />

        <Input
          label="Read-only"
          placeholder="Read-only"
          readOnly
          value="Read-only value"
          helperText="This field cannot be edited"
        />
      </div>

      {/* Different Input Types */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Input Types</h3>
        
        <Input
          label="Text"
          type="text"
          placeholder="Enter text"
        />

        <Input
          label="Email"
          type="email"
          placeholder="email@example.com"
        />

        <Input
          label="Password"
          type="password"
          placeholder="••••••••"
        />

        <Input
          label="Number"
          type="number"
          placeholder="0"
          min="0"
          max="100"
        />

        <Input
          label="Date"
          type="date"
        />

        <Input
          label="URL"
          type="url"
          placeholder="https://example.com"
        />
      </div>

      {/* Full Width */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Full Width</h3>
        
        <Input
          label="Full width input"
          placeholder="This input spans the full width"
          fullWidth
        />
      </div>
    </div>
  );
};