module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    fontFamily: {
      sans: ['var(--font-roboto)'],
    },
    extend: {
      colors: {
        transparent: 'transparent',
        white: '#FFFFFF',
        black: '#000000',

        // System
        red: '#EE4A3F',
        green: '#1BE484',
        orange: '#EE933F',
        blue: '#247CFF',
        darkred: '#B8393E',
        darkgreen: '#00773E',
        darkorange: '#C77F4B',
        yellow: '#EED658',

        // Pink
        primary: '#E62058',
        secondary: '#F7ECEF',
      },
    },
  },
  plugins: [],
};
