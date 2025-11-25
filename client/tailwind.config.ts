import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'christmas-blue': '#1A73E8',
        'festive-gold': '#FFD966',
      },
      backgroundImage: {
        'snowflakes': "url('/path-to-your-snowflake-background.svg')", // I will add a placeholder path for now
      },
    },
  },
  plugins: [],
}
export default config
