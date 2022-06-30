module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'plugin:react/recommended',
    'airbnb',
  ],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: [
    'react',
  ],
  rules: {
    "new-cap": 1,
    "valid-typeof": 1,
    "no-useless-escape": 0,
    "react/jsx-filename-extension": 0,
    "import/prefer-default-export": 0,
    "consistent-return": 0,
    "class-methods-use-this": 0,
    "no-useless-constructor": 0,
  },
};
