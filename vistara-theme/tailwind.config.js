/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['selector', '[data-theme="dark"]'],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  corePlugins: {
    preflight: false,
  },
  theme: {
    extend: {
      colors: {
        // ── Premium Corporate Finance Palette (Vishtara Capital) ──
        // Updated with #304B70 as primary accent color
        primary: '#304B70',
        dark: '#253854',
        navy: {
          DEFAULT: '#304B70',
          dark: '#253854',
          soft: '#4a6b9a',
        },
        gold: {
          DEFAULT: '#C89A3D',
          soft: '#D9B86A',
        },
        ink: {
          DEFAULT: '#0F172A',
          muted: '#64748B',
        },
        canvas: '#FEFEFE',
        hairline: '#E2E8F0',
        // Legacy aliases kept for compatibility
        background: '#FEFEFE',
        surface: '#FFFFFF',
        secondary: '#64748B',
        accent: '#304B70',
        danger: '#DC2626',
        card: '#FEFEFE',
      },
      fontFamily: {
        heading: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        body: ['Inter', '"Segoe UI"', 'system-ui', 'sans-serif'],
        inter: ['Inter', '"Segoe UI"', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        card: '20px',
        input: '12px',
        btn: '14px',
      },
      boxShadow: {
        soft: '0 4px 24px rgba(31, 45, 68, 0.06)',
        'soft-lg': '0 12px 40px rgba(31, 45, 68, 0.10)',
        'soft-xl': '0 24px 60px rgba(31, 45, 68, 0.12)',
        nav: '0 1px 0 rgba(31, 45, 68, 0.06), 0 8px 30px rgba(31, 45, 68, 0.05)',
      },
      transitionDuration: {
        '200': '200ms',
        '300': '300ms',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'scale-in': {
          '0%': { opacity: '0', transform: 'scale(0.97)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        // Hero section animations
        'hero-pulse': {
          '0%, 100%': { transform: 'scale(1)', opacity: 1 },
          '50%': { transform: 'scale(1.02)', opacity: 0.95 },
        },
        'hero-glow-pulse': {
          '0%, 100%': { transform: 'translate(-50%, -50%) scale(1)', opacity: 0.8 },
          '50%': { transform: 'translate(-50%, -50%) scale(1.1)', opacity: 0.6 },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0) rotate(0deg)' },
          '33%': { transform: 'translateY(-20px) rotate(120deg)' },
          '66%': { transform: 'translateY(-10px) rotate(240deg)' },
        },
        'gradient-shift': {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
        'pulse-glow': {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.7 },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.3s ease-out',
        'scale-in': 'scale-in 0.2s ease-out',
        // Hero section animations
        'hero-pulse': 'hero-pulse 12s ease-in-out infinite',
        'hero-glow': 'hero-glow-pulse 8s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'gradient-shift': 'gradient-shift 8s ease infinite',
        'pulse-glow': 'pulse-glow 4s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}