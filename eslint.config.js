import js from "@eslint/js";
import { defineConfig } from "eslint/config";
import globals from "globals";
import tsPlugin from "@typescript-eslint/eslint-plugin";
import importPlugin from "eslint-plugin-import";
import jsxA11y from "eslint-plugin-jsx-a11y";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";

export default defineConfig([
  {
    ignores: ["build/**", ".cache/**", ".react-router/**", ".idea/**", ".vscode/**"],
  },
  {
    files: ["**/*.{js,mjs,cjs,jsx,ts,tsx}"],
    extends: [js.configs.recommended],
    languageOptions: {
      globals: { ...globals.browser },
    },
  },
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    extends: [
      react.configs.flat.recommended,
      react.configs.flat["jsx-runtime"],
      jsxA11y.flatConfigs.recommended,
    ],
    plugins: { "react-hooks": reactHooks },
    rules: reactHooks.configs.recommended.rules,
    settings: {
      react: { version: "detect" },
      formComponents: ["Form"],
      linkComponents: [
        { name: "Link", linkAttribute: "to" },
        { name: "NavLink", linkAttribute: "to" },
      ],
    },
  },
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      tsPlugin.configs["flat/recommended"],
      importPlugin.flatConfigs.recommended,
      importPlugin.flatConfigs.typescript,
    ],
    settings: {
      "import/internal-regex": "^~/",
      "import/resolver": {
        node: { extensions: [".ts", ".tsx"] },
        typescript: { alwaysTryTypes: true },
      },
    },
  },
  {
    files: ["eslint.config.js", "*.config.ts", "**/*.cjs", "**/*.server.{ts,tsx}", "**/.server/**/*.{ts,tsx}"],
    languageOptions: {
      globals: { ...globals.node },
    },
  },
]);
