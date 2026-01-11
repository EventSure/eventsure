export const theme = {
  colors: {
    // Primary blue gradient - modern blockchain feel
    primary: '#3B82F6', // Bright blue
    primaryLight: '#60A5FA',
    primaryDark: '#2563EB',

    // Secondary - cyan/teal accent
    secondary: '#06B6D4',
    secondaryLight: '#22D3EE',
    secondaryDark: '#0891B2',

    // Accent - for highlights
    accent: '#8B5CF6', // Purple accent

    // Background - deep dark blue
    background: '#030712', // Near black with blue tint
    backgroundGradient: 'linear-gradient(135deg, #030712 0%, #0c1929 50%, #111827 100%)',

    // Surface colors
    surface: '#0f172a', // Dark blue-gray
    surfaceLight: '#1e293b',
    surfaceHover: '#334155',

    // Glass effect
    glass: 'rgba(15, 23, 42, 0.8)',
    glassBorder: 'rgba(59, 130, 246, 0.2)',

    // Text
    text: '#f8fafc',
    textSecondary: '#94a3b8',
    textMuted: '#64748b',

    // Status colors
    error: '#ef4444',
    success: '#22c55e',
    warning: '#f59e0b',
    info: '#3b82f6',

    // Special - for airplane/flight
    flight: '#38bdf8', // Sky blue
    flightTrail: 'rgba(56, 189, 248, 0.3)',

    // Border
    border: '#334155',
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    xxl: '48px',
    xxxl: '64px',
  },
  borderRadius: {
    sm: '4px',
    md: '8px',
    lg: '12px',
    xl: '16px',
    xxl: '24px',
    full: '9999px',
  },
  fontSize: {
    xs: '12px',
    sm: '14px',
    md: '16px',
    lg: '18px',
    xl: '24px',
    xxl: '32px',
    xxxl: '48px',
    display: '64px',
  },
  fontWeight: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
  },
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    xxl: '1536px',
  },
  shadows: {
    sm: '0 1px 2px rgba(0, 0, 0, 0.3)',
    md: '0 4px 6px rgba(0, 0, 0, 0.4)',
    lg: '0 10px 15px rgba(0, 0, 0, 0.5)',
    glow: '0 0 20px rgba(59, 130, 246, 0.3)',
    glowStrong: '0 0 40px rgba(59, 130, 246, 0.5)',
  },
  transitions: {
    fast: '150ms ease',
    normal: '300ms ease',
    slow: '500ms ease',
  },
} as const

export type Theme = typeof theme