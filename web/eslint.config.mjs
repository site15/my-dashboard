// @ts-check

import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import pluginImport from 'eslint-plugin-import';
import pluginJsdoc from 'eslint-plugin-jsdoc';
import pluginPreferArrow from 'eslint-plugin-prefer-arrow';

export default tseslint.config(
  {
    ignores: ['dist/', 'node_modules/', 'src/app/generated/', 'src/server/generated/', '.vercel/'],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: {
      import: pluginImport,
      jsdoc: pluginJsdoc,
      'prefer-arrow': pluginPreferArrow,
    },
    rules: {
      '@typescript-eslint/consistent-type-assertions': 'error',
      '@typescript-eslint/no-unused-vars': 'error',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-non-null-assertion': 'warn',
      'import/order': [
        'error',
        {
          groups: ['builtin', 'external', 'internal'],
          'newlines-between': 'always',
          alphabetize: {
            order: 'asc',
            caseInsensitive: true,
          },
        },
      ],
      // 'prefer-arrow/prefer-arrow-functions': [
      //   'error',
      //   {
      //     disallowPrototype: true,
      //     singleReturnOnly: false,
      //     classPropertiesAllowed: false,
      //   },
      // ],
      // 'jsdoc/check-alignment': 'error',
      // 'jsdoc/check-indentation': 'error',
    },
  },
);