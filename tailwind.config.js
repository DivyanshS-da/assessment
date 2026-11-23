/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Neo-Brutalist Palette (matching uploaded reference)
        neo: {
          bg: '#EDE8F5',       // Soft grid background
          lavender: '#C4B5FD', // Mika Sato hero lavender
          lime: '#CCFF00',     // Electric lime-green
          pink: '#FF90E8',     // Electric pastel pink
          yellow: '#FFDE59',   // Warm sunny yellow
          cyan: '#70D6FF',     // Sky cyan
          orange: '#FF8A50',   // Vibrant orange
          mint: '#99F6E4',     // Fresh mint
          dark: '#121212',     // Rich ink black
          card: '#FFFFFF',     // Clean white surface
        },
        // Bloom's Taxonomy Semantic Neo-Brutal Colors
        bloom: {
          remember: '#70D6FF',   // Cyan (Level 1)
          understand: '#C4B5FD', // Lavender (Level 2)
          apply: '#CCFF00',      // Lime (Level 3)
          analyze: '#FFDE59',    // Yellow (Level 4)
          evaluate: '#FF8A50',   // Orange (Level 5)
          create: '#FF90E8',     // Pink (Level 6)
        }
      },
      boxShadow: {
        'neo-sm': '2px 2px 0px #000',
        'neo': '4px 4px 0px #000',
        'neo-lg': '6px 6px 0px #000',
        'neo-xl': '8px 8px 0px #000',
        'neo-hover': '1px 1px 0px #000',
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
    },
  },
  plugins: [],
};
