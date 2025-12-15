import path from "node:path";
import { fileURLToPath } from "node:url";

import { defineConfig, globalIgnores } from "eslint/config";
import { fixupConfigRules, fixupPluginRules } from "@eslint/compat";
import react from "eslint-plugin-react";
import unusedImports from "eslint-plugin-unused-imports";
import _import from "eslint-plugin-import";
import typescriptEslint from "@typescript-eslint/eslint-plugin";
import jsxA11Y from "eslint-plugin-jsx-a11y";
import globals from "globals";
import tsParser from "@typescript-eslint/parser";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all,
});

export default defineConfig([
    globalIgnores([
        ".now/*",
        "**/*.css",
        "**/.changeset",
        "**/dist",
        "esm/*",
        "public/*",
        "tests/*",
        "scripts/*",
        "**/*.config.js",
        "**/.DS_Store",
        "**/node_modules",
        "**/coverage",
        "**/.next",
        "**/build",
        "!**/.commitlintrc.cjs",
        "!**/.lintstagedrc.cjs",
        "!**/jest.config.js",
        "!**/plopfile.js",
        "!**/react-shim.js",
        "!**/tsup.config.ts",
    ]),
    {
        extends: fixupConfigRules(
            compat.extends(
                "plugin:react/recommended",
                "plugin:react-hooks/recommended",
                "plugin:jsx-a11y/recommended",
                "plugin:prettier/recommended",
            ),
        ),

        plugins: {
            react: fixupPluginRules(react),
            "unused-imports": unusedImports,
            import: fixupPluginRules(_import),
            "@typescript-eslint": typescriptEslint,
            "jsx-a11y": fixupPluginRules(jsxA11Y),
        },

        languageOptions: {
            globals: {
                ...Object.fromEntries(Object.entries(globals.browser).map(([key]) => [key, "off"])),
                ...globals.node,
            },

            parser: tsParser,
            ecmaVersion: 12,
            sourceType: "module",

            parserOptions: {
                ecmaFeatures: {
                    jsx: true,
                },
            },
        },

        settings: {
            react: {
                version: "detect",
            },
        },

        files: ["**/*.ts", "**/*.tsx"],

        rules: {
            "no-console": "warn",
            "react/prop-types": "off",
            "react/jsx-uses-react": "off",
            "react/react-in-jsx-scope": "off",
            "react-hooks/exhaustive-deps": "off",
            "jsx-a11y/click-events-have-key-events": "off",
            "jsx-a11y/interactive-supports-focus": "warn",
            "prettier/prettier": "warn",
            "no-unused-vars": "off",
            "unused-imports/no-unused-vars": "off",
            "unused-imports/no-unused-imports": "warn",
            "jsx-a11y/no-static-element-interactions": "off",
            "jsx-a11y/mouse-events-have-key-events": "off",

            "no-restricted-imports": [
                "error",
                {
                    paths: [
                        {
                            name: "@headlessui/react",
                            importNames: ["Link"],
                            message: "Use @tanstack/react-router Link instead",
                        },
                    ],
                },
            ],

            "@typescript-eslint/no-unused-vars": [
                "warn",
                {
                    args: "after-used",
                    ignoreRestSiblings: false,
                    argsIgnorePattern: "^_.*?$",
                },
            ],

            "import/order": [
                "error",
                {
                    groups: [
                        "builtin",
                        "external",
                        "internal",
                        "parent",
                        "sibling",
                        "index",
                        "object",
                        "type",
                    ],
                    pathGroups: [
                        // Side effect imports
                        { pattern: "\u0000", group: "builtin", position: "before" },

                        // React packages
                        {
                            pattern: "react?(|-dom|-router|-router-dom)",
                            group: "external",
                            position: "before",
                        },

                        // Internal aliases
                        { pattern: "~/**", group: "external", position: "after" },
                        { pattern: "@/config/**", group: "internal", position: "after" },
                        { pattern: "@/common/**", group: "internal", position: "after" },
                        { pattern: "@/modules/**", group: "internal", position: "after" },
                        {
                            pattern: "@/containers/**",
                            group: "internal",
                            position: "after",
                        },
                        { pattern: "@/layouts/**", group: "internal", position: "after" },
                        { pattern: "@/pages/**", group: "internal", position: "after" },
                        {
                            pattern: "@/components/**",
                            group: "internal",
                            position: "after",
                        },
                        {
                            pattern: "@/translations/**",
                            group: "internal",
                            position: "after",
                        },
                        { pattern: "@/assets/**", group: "internal", position: "after" },

                        // Image files
                        {
                            pattern: "**/*.+(svg|jpg|png)",
                            group: "index",
                            position: "after",
                        },

                        // Styles
                        { pattern: "**/*.s?(a|c)ss", group: "index", position: "after" },
                    ],
                    pathGroupsExcludedImportTypes: ["react"],
                    alphabetize: {
                        order: "asc",
                        caseInsensitive: true,
                    },
                    "newlines-between": "always",
                },
            ],

            "react/self-closing-comp": "warn",

            "react/jsx-sort-props": [
                "warn",
                {
                    callbacksLast: true,
                    shorthandFirst: true,
                    noSortAlphabetically: false,
                    reservedFirst: true,
                },
            ],

            "padding-line-between-statements": [
                "warn",
                {
                    blankLine: "always",
                    prev: "*",
                    next: "return",
                },
                {
                    blankLine: "always",
                    prev: ["const", "let", "var"],
                    next: "*",
                },
                {
                    blankLine: "any",
                    prev: ["const", "let", "var"],
                    next: ["const", "let", "var"],
                },
            ],
        },
    },
    {
        files: ["src/components/Editor/**"],
        rules: {
            "import/order": "off",
        },
    },
]);
