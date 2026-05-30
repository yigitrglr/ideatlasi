import js from '@eslint/js'
import react from 'eslint-plugin-react'
import reactRefresh from 'eslint-plugin-react-refresh'
import jsxA11y from 'eslint-plugin-jsx-a11y'
import tseslint from 'typescript-eslint'
import globals from 'globals'

export default tseslint.config(
  {
    ignores: ['dist/**', 'dev-dist/**', 'node_modules/**', '*.config.js', '*.config.ts', '*.config.mjs', '*.config.cjs'],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2021,
      },
    },
    settings: {
      react: {
        version: '19.0',
      },
    },
    plugins: {
      react,
      'react-refresh': reactRefresh,
      'jsx-a11y': jsxA11y,
    },
    rules: {
      ...react.configs.recommended.rules,
      ...react.configs['jsx-runtime'].rules,
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true, allowExportNames: ['usePhilosophers', 'useTheme'] },
      ],
      'react/prop-types': 'off',
      'react/no-unescaped-entities': 'warn',
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      'no-unused-vars': 'off',
      'react/jsx-key': 'warn',
    },
  },
  {
    files: ['**/context/**/*.{jsx,tsx}'],
    rules: {
      'react-refresh/only-export-components': 'off',
    },
  },
  {
    files: ['**/components/ui/dialog.{jsx,tsx}', '**/components/ui/sheet.{jsx,tsx}'],
    rules: {
      'react-hooks/set-state-in-effect': 'off',
    },
  },
  {
    files: ['**/context/PhilosopherContext.{jsx,tsx}'],
    rules: {
      'react-hooks/set-state-in-effect': 'off',
    },
  },
)
