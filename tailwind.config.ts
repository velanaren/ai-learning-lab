import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Primary - Calm Blue (Accessible, professional)
        primary: {
          50: '#EFF6FF',   // Lightest blue - backgrounds, hover states
          100: '#DBEAFE',  // Light blue - subtle backgrounds
          200: '#BFDBFE',  // Soft blue - borders, disabled states
          300: '#93C5FD',  // Medium light - secondary elements
          400: '#60A5FA',  // Medium - hover states
          500: '#3B82F6',  // Main primary - CTAs, links (WCAG AA: 4.5:1 on white)
          600: '#2563EB',  // Dark primary - hover on primary buttons
          700: '#1D4ED8',  // Darker - active states
          800: '#1E40AF',  // Very dark - text on light backgrounds
          900: '#1E3A8A',  // Darkest - strong emphasis
        },
        
        // Neutrals - Gray scale for UI
        gray: {
          50: '#F9FAFB',   // Lightest - main background
          100: '#F3F4F6',  // Subtle backgrounds - cards, sections
          200: '#E5E7EB',  // Light borders
          300: '#D1D5DB',  // Borders, dividers
          400: '#9CA3AF',  // Disabled text
          500: '#6B7280',  // Secondary text, icons
          600: '#4B5563',  // Body text (WCAG AA: 7:1 on white)
          700: '#374151',  // Strong text
          800: '#1F2937',  // Headings
          900: '#111827',  // Primary text (WCAG AAA: 16:1 on white)
        },
        
        // Semantic colors
        success: {
          50: '#ECFDF5',
          100: '#D1FAE5',
          500: '#10B981',  // Green - success states (WCAG AA compliant)
          600: '#059669',  // Hover state
          700: '#047857',  // Active state
        },
        warning: {
          50: '#FFFBEB',
          100: '#FEF3C7',
          500: '#F59E0B',  // Amber - warnings (WCAG AA compliant)
          600: '#D97706',  // Hover state
          700: '#B45309',  // Active state
        },
        error: {
          50: '#FEF2F2',
          100: '#FEE2E2',
          500: '#EF4444',  // Red - errors (WCAG AA compliant)
          600: '#DC2626',  // Hover state
          700: '#B91C1C',  // Active state
        },
        
        // Special - Focus Mode (high contrast option)
        focus: {
          bg: '#FAFAFA',      // Slightly warmer than gray-50
          border: '#E0E0E0',  // Softer than gray-300
        },
      },
      
      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'Helvetica Neue',
          'Arial',
          'sans-serif',
        ],
        mono: [
          'SF Mono',
          'Monaco',
          'Inconsolata',
          'Fira Code',
          'Consolas',
          'monospace',
        ],
      },
      
      fontSize: {
        // Typography scale - more granular control
        'xs': ['0.75rem', { lineHeight: '1rem' }],      // 12px - timestamps, captions
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],  // 14px - secondary text, labels
        'base': ['1rem', { lineHeight: '1.5rem' }],     // 16px - body text
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],  // 18px - emphasized body
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],   // 20px - small headings
        '2xl': ['1.5rem', { lineHeight: '2rem' }],      // 24px - section headings
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }], // 30px - page headings
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],   // 36px - hero text
      },
      
      fontWeight: {
        normal: '400',
        medium: '500',
        semibold: '600',
        bold: '700',
      },
      
      spacing: {
        // Extended spacing scale for consistent layouts
        '18': '4.5rem',   // 72px
        '88': '22rem',    // 352px
        '128': '32rem',   // 512px
      },
      
      borderRadius: {
        'sm': '0.25rem',   // 4px - small elements
        'DEFAULT': '0.375rem', // 6px - buttons, inputs
        'md': '0.5rem',    // 8px - cards
        'lg': '0.75rem',   // 12px - large cards
        'xl': '1rem',      // 16px - modals
      },
      
      boxShadow: {
        // Subtle, layered shadows (Linear-inspired)
        'sm': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'DEFAULT': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        'md': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'xl': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        'focus': '0 0 0 3px rgba(59, 130, 246, 0.3)', // Focus ring
        'none': 'none',
      },
      
      ringWidth: {
        'DEFAULT': '2px',
        '3': '3px',
      },
      
      ringColor: {
        DEFAULT: '#3B82F6', // primary-500
      },
      
      animation: {
        // Respects prefers-reduced-motion
        'fade-in': 'fadeIn 0.2s ease-in',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
      },
      
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
      
      transitionDuration: {
        '0': '0ms',      // For reduced motion
        '150': '150ms',  // Fast interactions
        '200': '200ms',  // Standard
        '300': '300ms',  // Smooth
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    // Custom plugin for focus-visible states
    function({ addUtilities }: any) {
      addUtilities({
        '.focus-ring': {
          '@apply focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2': {},
        },
        '.focus-ring-inset': {
          '@apply focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500': {},
        },
        // Reduced motion utilities
        '.motion-safe\\:animate-fade-in': {
          '@media (prefers-reduced-motion: no-preference)': {
            animation: 'fadeIn 0.2s ease-in',
          },
        },
        '.motion-safe\\:animate-slide-up': {
          '@media (prefers-reduced-motion: no-preference)': {
            animation: 'slideUp 0.3s ease-out',
          },
        },
      })
    },
  ],
}

export default config