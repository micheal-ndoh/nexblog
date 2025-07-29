import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      "@next/next/no-img-element": "warn", // Downgrade to warning instead of error
      "@typescript-eslint/no-unused-vars": ["warn", { "argsIgnorePattern": "^_" }], // Allow unused variables that start with _
      "@typescript-eslint/no-explicit-any": "warn", // Downgrade to warning instead of error
      "@typescript-eslint/ban-ts-comment": "warn", // Downgrade to warning instead of error
    },
  },
];

export default eslintConfig;
