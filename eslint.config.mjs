/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import nextPlugin from '@next/eslint-plugin-next';
import reactPlugin from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import globals from 'globals';

export default tseslint.config(
  {
    ignores: ['node_modules', '.next']
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    plugins: {
      react: reactPlugin,
      'react-hooks': reactHooks,
      '@next/next': nextPlugin
    },
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node
      }
    },
    settings: {
      react: {
        version: 'detect'
      }
    },
  rules: {
  ...reactPlugin.configs.recommended.rules,
  ...reactHooks.configs.recommended.rules,
  ...nextPlugin.configs['core-web-vitals'].rules,
  'react/react-in-jsx-scope': 'off',
  '@typescript-eslint/no-explicit-any': 'off',
  '@typescript-eslint/no-unused-vars': 'off',
  '@typescript-eslint/no-empty-object-type': 'off',
  'react/no-unescaped-entities': 'off',
  'react/prop-types': 'off',
  'react/require-render-return': 'error' // Change this line
}
  }
);
