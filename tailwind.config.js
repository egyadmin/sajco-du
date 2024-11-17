/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'green': {
          100: '#dcfce7',
          600: '#16a34a',
          700: '#15803d',
        },
        'yellow': {
          100: '#fef9c3',
          600: '#ca8a04',
          700: '#a16207',
        },
        'blue': {
          100: '#dbeafe',
          600: '#2563eb',
          700: '#1d4ed8',
        },
        'indigo': {
          100: '#e0e7ff',
          600: '#4f46e5',
          700: '#4338ca',
        },
        'purple': {
          100: '#f3e8ff',
          600: '#9333ea',
          700: '#7e22ce',
        },
        'red': {
          100: '#fee2e2',
          600: '#dc2626',
          700: '#b91c1c',
        },
      },
    },
  },
  plugins: [],
  safelist: [
    'bg-green-100',
    'text-green-600',
    'text-green-700',
    'bg-yellow-100',
    'text-yellow-600',
    'text-yellow-700',
    'bg-blue-100',
    'text-blue-600',
    'text-blue-700',
    'bg-indigo-100',
    'text-indigo-600',
    'text-indigo-700',
    'bg-purple-100',
    'text-purple-600',
    'text-purple-700',
    'bg-red-100',
    'text-red-600',
    'text-red-700',
  ],
}