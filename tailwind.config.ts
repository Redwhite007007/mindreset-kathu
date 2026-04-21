import type { Config } from "tailwindcss";

/**
 * Tailwind v4 is driven by CSS `@theme` in `src/app/globals.css`.
 * This file exists only to help editor tooling discover the content glob.
 */
const config: Config = {
  content: ["./src/**/*.{ts,tsx,mdx}"],
};

export default config;
