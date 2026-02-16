/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts}'],
  theme: {
    extend: {
      colors: {
        // 背景层级
        void: '#0a0e14',
        abyss: '#0d1117',
        deep: '#151b23',
        surface: '#1c242e',
        elevated: '#242d39',

        // 边框
        'border-subtle': '#2d3748',
        'border-active': '#4a5568',

        // 文本
        'text-primary': '#e6edf3',
        'text-secondary': '#8b949e',
        'text-muted': '#6e7681',
        'text-accent': '#58a6ff',

        // 强调色
        accent: {
          primary: '#00d9ff',
          secondary: '#0ea5e9',
          glow: 'rgba(0, 217, 255, 0.15)',
        },

        // Agent颜色
        agent: {
          blue: '#60a5fa',
          green: '#34d399',
          yellow: '#fbbf24',
          purple: '#a78bfa',
          orange: '#fb923c',
          pink: '#f472b6',
          cyan: '#22d3ee',
          red: '#f87171',
        },
      },
      boxShadow: {
        'glow-sm': '0 0 10px currentColor',
        'glow-md': '0 0 20px currentColor',
        'glow-lg': '0 0 30px currentColor',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        glow: {
          '0%': { opacity: '0.6' },
          '100%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};
