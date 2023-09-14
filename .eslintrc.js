module.exports = {
  extends: 'airbnb-base',
  overrides: [
    {
      env: {
        node: true,
      },
      files: [
        '.eslintrc.{js,cjs}',
      ],
      parserOptions: {
        sourceType: 'script',
      },
    },
  ],
  parserOptions: {
    ecmaVersion: 'latest',
  },
  rules: {
    'max-len': 0,
    'newline-per-chained-call': 0,
    'no-console': [1, { allow: ['info', 'warn', 'error'] }],
    'no-underscore-dangle': 0,
    'no-unused-vars': [
      2,
      {
        argsIgnorePattern: 'next',
      },
    ],
    'linebreak-style': ['error', 'unix'],
    'indent': ['error', 2],
    'quote-props': [2, 'consistent-as-needed'],
    'space-before-function-paren': [1, 'always'],
    'guard-for-in': 'off',
    'no-restricted-syntax': 'off',
    'no-param-reassign': 'off',
    'no-continue': 'off',
    'no-prototype-builtins': 'off',
    'class-methods-use-this': 'off',
    'consistent-return': 'off',
  },
};
