import js from '@eslint/js';
import pluginVue from 'eslint-plugin-vue';
import tseslint from 'typescript-eslint';

const tsOnly = (config) => ({ ...config, files: config.files ?? ['**/*.ts', '**/*.tsx'] });

export default [
  js.configs.recommended,
  ...pluginVue.configs['flat/recommended'],
  ...tseslint.configs.recommended.map(tsOnly),
  {
    languageOptions: {
      parserOptions: {
        extraFileExtensions: ['.vue'],
      },
    },
    plugins: {
      '@typescript-eslint': tseslint.plugin,
    },
    rules: {
      'vue/multi-word-component-names': 'off',
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/no-explicit-any': 'warn',
    },
  },
  {
    ignores: ['dist', 'node_modules', 'coverage', '*.cjs', 'jest.config.cjs'],
  },
];
