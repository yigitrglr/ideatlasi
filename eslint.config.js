import js from '@eslint/js'
import react from 'eslint-plugin-react'
import reactRefresh from 'eslint-plugin-react-refresh'
import jsxA11y from 'eslint-plugin-jsx-a11y'
import globals from 'globals'

export default [
  {
    ignores: ['dist/**', 'dev-dist/**', 'node_modules/**', '*.config.js', '*.config.mjs', '*.config.cjs'],
  },
  {
    files: ['**/*.{js,jsx}'],
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
      ...js.configs.recommended.rules,
      ...react.configs.recommended.rules,
      ...react.configs['jsx-runtime'].rules,
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true, allowExportNames: ['usePhilosophers', 'useTheme'] },
      ],
      'react/prop-types': 'off',
      'react/no-unescaped-entities': 'warn',
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      'react/jsx-key': 'warn',
    },
  },
  {
    files: ['**/context/**/*.jsx'],
    rules: {
      'react-refresh/only-export-components': 'off',
    },
  },
  {
    files: ['**/components/ui/dialog.jsx', '**/components/ui/sheet.jsx'],
    rules: {
      'react-hooks/set-state-in-effect': 'off', // Needed for animation exit transitions
    },
  },
  {
    files: ['**/context/PhilosopherContext.jsx'],
    rules: {
      'react-hooks/set-state-in-effect': 'off', // Syncing derived state from computed values
    },
  },
]

