module.exports = {
  extends: ['airbnb', 'airbnb-typescript', 'prettier'],
  plugins: ['react', 'react-hooks', '@typescript-eslint', 'formatjs'],
  parserOptions: {
    project: './tsconfig.json',
  },
  rules: {
    'object-curly-newline': ['error', { consistent: true }],
    'implicit-arrow-linebreak': 'off',
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
    'react/react-in-jsx-scope': 'off',
    'react/jsx-props-no-spreading': 'off',
    'react/function-component-definition': 'off',
    'react/require-default-props': 'off',
    'react/style-prop-object': 'warn',
    'import/prefer-default-export': 'off',
    'import/no-extraneous-dependencies': [
      'error',
      {
        devDependencies: [
          '**/*.stories.tsx',
          '**/*.test.ts',
          '**/*.spec.ts',
          '**/*.test.tsx',
          '**/*.spec.tsx',
        ],
      },
    ],
    'formatjs/no-complex-selectors': [
      'error',
      {
        limit: 3,
      },
    ],
    'formatjs/enforce-id': [
      'error',
      {
        idInterpolationPattern: '[sha512:contenthash:base64:6]',
      },
    ],
  },
  overrides: [
    {
      // Because redux is special: https://redux-toolkit.js.org/usage/immer-reducers#linting-state-mutations
      files: ['src/**/*.slice.ts'],
      rules: { 'no-param-reassign': ['error', { props: false }] },
    },
  ],
};
