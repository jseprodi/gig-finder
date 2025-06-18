import { createStitches } from '@stitches/react';

export const { styled, css, theme, globalCss } = createStitches({
  theme: {
    colors: {
      background: '#ffffff',
      foreground: '#171717',
      card: '#fff',
      cardBorder: '#e5e7eb',
      cardShadow: 'rgba(0,0,0,0.04)',
      heading: '#1e3a8a',
      text: '#171717',
      muted: '#6b7280',
      accent: '#2563eb',
    },
    radii: {
      xl: '1rem',
      lg: '0.75rem',
    },
    space: {
      1: '0.25rem',
      2: '0.5rem',
      3: '0.75rem',
      4: '1rem',
      6: '1.5rem',
      8: '2rem',
      12: '3rem',
    },
    fontSizes: {
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.5rem',
      '2xl': '2.25rem',
      '4xl': '2.5rem',
    },
    fonts: {
      sans: 'Arial, Helvetica, sans-serif',
    },
    fontWeights: {
      normal: '400',
      medium: '500',
      bold: '700',
    },
  },
});
