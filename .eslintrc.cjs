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
    "no-useless-escape": 0,
    "react/jsx-filename-extension": 0,
    "new-cap": 1,
    "import/prefer-default-export": 0,
    "consistent-return": 0,
  },
};
