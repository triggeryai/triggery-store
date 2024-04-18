import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  daisyui: {
    themes: [
      {
        light: {
          ...require('daisyui/src/theming/themes')['cupcake'],
          primary: '#fbbf24',
          '.toaster-con': {
            'background-color': 'white',
            color: 'black',
          },
        },
        dark: {
          ...require('daisyui/src/theming/themes')['synthwave'],
          primary: '#fbbf24',
          '.toaster-con': {
            'background-color': 'black',
            color: 'white',
          },
        },
      },
    ],
  },
  darkMode: ['class', '["dark"]'],
  plugins: [require('daisyui')],
}
export default config
