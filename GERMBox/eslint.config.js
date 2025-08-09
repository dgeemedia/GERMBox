import js from "@eslint/js";
import globals from "globals";

export default [
  { 
    ignores: ["node_modules/**", "dist/**", "vite.config.js"]  // Migrated from .eslintignore
  },
  {
    files: ["**/*.{js,mjs,cjs}"],
    languageOptions: {
      globals: {
        ...globals.browser
      }
    },
    rules: {
      ...js.configs.recommended.rules
    }
  }
];