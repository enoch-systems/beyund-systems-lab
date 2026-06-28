/**
 * Beyund Labs Academy - Design System
 * Unified design tokens for consistent UI
 */

export const colors = {
  // Base colors
  background: {
    primary: 'var(--color-bg-primary)',
    secondary: 'var(--color-bg-secondary)',
    tertiary: 'var(--color-bg-tertiary)',
    elevated: 'var(--color-bg-elevated)',
  },
  text: {
    primary: 'var(--color-text-primary)',
    secondary: 'var(--color-text-secondary)',
    tertiary: 'var(--color-text-tertiary)',
    disabled: 'var(--color-text-disabled)',
  },
  border: {
    default: 'var(--color-border-default)',
    subtle: 'var(--color-border-subtle)',
    strong: 'var(--color-border-strong)',
  },
  accent: {
    teal: 'var(--color-accent-teal)',
    tealLight: 'var(--color-accent-teal-light)',
    blue: 'var(--color-accent-blue)',
    purple: 'var(--color-accent-purple)',
  },
  status: {
    success: 'var(--color-status-success)',
    successLight: 'var(--color-status-success-light)',
    warning: 'var(--color-status-warning)',
    warningLight: 'var(--color-status-warning-light)',
    error: 'var(--color-status-error)',
    errorLight: 'var(--color-status-error-light)',
    info: 'var(--color-status-info)',
    infoLight: 'var(--color-status-info-light)',
  },
  sidebar: {
    background: 'var(--color-sidebar-bg)',
    active: 'var(--color-sidebar-active)',
    hover: 'var(--color-sidebar-hover)',
  },
};

export const spacing = {
  xs: '4px',
  sm: '8px',
  md: '12px',
  lg: '16px',
  xl: '20px',
  '2xl': '24px',
  '3xl': '32px',
};

export const typography = {
  fontFamily: {
    sans: 'var(--font-sans)',
    mono: 'var(--font-mono)',
  },
  fontSize: {
    xs: '11px',
    sm: '12px',
    base: '13px',
    lg: '14px',
    xl: '16px',
    '2xl': '18px',
    '3xl': '20px',
    '4xl': '24px',
  },
  fontWeight: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
  },
};

export const borderRadius = {
  sm: '6px',
  md: '8px',
  lg: '10px',
  xl: '12px',
  '2xl': '14px',
  full: '9999px',
};

export const shadows = {
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
};

export const transitions = {
  fast: '150ms cubic-bezier(0.4, 0, 0.2, 1)',
  normal: '200ms cubic-bezier(0.4, 0, 0.2, 1)',
  slow: '300ms cubic-bezier(0.4, 0, 0.2, 1)',
};

export const zIndex = {
  dropdown: 1000,
  sticky: 1020,
  fixed: 1030,
  modal: 1040,
  popover: 1050,
  tooltip: 1060,
};

export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
};

export const components = {
  button: {
    height: {
      sm: '30px',
      md: '36px',
      lg: '44px',
    },
    padding: {
      sm: '0 12px',
      md: '0 16px',
      lg: '0 20px',
    },
  },
  input: {
    height: {
      sm: '30px',
      md: '36px',
      lg: '44px',
    },
  },
  card: {
    padding: {
      sm: '12px',
      md: '16px',
      lg: '20px',
    },
  },
};

export const designSystem = {
  colors,
  spacing,
  typography,
  borderRadius,
  shadows,
  transitions,
  zIndex,
  breakpoints,
  components,
};

export default designSystem;