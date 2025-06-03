import js from "@eslint/js";
import ts from "typescript-eslint";
import prettier from "eslint-config-prettier";
import prettierPluginRecommended from "eslint-plugin-prettier/recommended";
import globals from "globals";

/** @type {import('eslint').Linter.Config[]} */
export default [
  js.configs.recommended,
  ...ts.configs.recommended,
  prettier,
  prettierPluginRecommended,
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
  },
  {
    ignores: ["build/", "dist/", "temp/"],
  },
  {
    rules: {
      "no-unused-vars": 1,
      "@typescript-eslint/no-unused-vars": 1,
      "@typescript-eslint/no-explicit-any": 0,
      "@typescript-eslint/ban-ts-comment": 0,
      "@typescript-eslint/no-wrapper-object-types": 0,
      "prettier/prettier": 1,
    },
  },
];
