// tailwind.config.ts
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'bass-green': '#2D5A27',
        'action-yellow': '#F9B824',
        'splash-blue': '#4FB2E1',
        'carbon-black': '#1A1A1A',
        'bone-white': '#F4F4F4',
      },
    },
  },
  plugins: [],
};
export default config;