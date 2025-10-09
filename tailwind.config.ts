import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // 非洲大地色系
        'terra-cotta': '#D4773C',
        'desert-gold': '#C9984C',
        'earth-brown': '#8B6F47',
        'savanna-green': '#7A9B76',
        'sunset-orange': '#E8956C',
        'amber-gold': '#F4A460',
        // 中性色
        'charcoal': '#2C2C2C',
        'warm-gray': '#5C5C5C',
        'light-gray': '#9C9C9C',
        'disabled-gray': '#BDBDBD',
        'soft-white': '#FAFAF8',
        'warm-beige': '#F5F3EF',
        'deep-charcoal': '#1A1A1A',
        'border-light': '#E0DDD6',
        'border-medium': '#D0CCC3',
      },
      fontFamily: {
        sans: ['Inter', 'Noto Sans SC', 'sans-serif'],
        serif: ['Playfair Display', 'Noto Serif SC', 'serif'],
      },
      backdropBlur: {
        xs: '2px',
      },
      boxShadow: {
        'glass-sm': '0 2px 8px rgba(139, 111, 71, 0.06)',
        'glass-md': '0 4px 16px rgba(139, 111, 71, 0.08), 0 2px 8px rgba(139, 111, 71, 0.05)',
        'glass-lg': '0 8px 32px rgba(139, 111, 71, 0.12), 0 4px 16px rgba(139, 111, 71, 0.08)',
        'glass-float': '0 4px 20px rgba(139, 111, 71, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.2) inset',
        'brand': '0 4px 12px rgba(212, 119, 60, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.2) inset',
      },
    },
  },
  plugins: [],
};

export default config;
