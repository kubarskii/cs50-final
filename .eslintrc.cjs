module.exports = {
    env: {
        browser: true,
        es2021: true,
        "jest/globals": true
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
        'jest',
        'react',
    ],
    rules: {
        "react/prop-types": 0,
        "react/no-array-index-key": 0,
        "react/jsx-props-no-spreading": 1,
        "jsx-a11y/no-noninteractive-tabindex": 1,
        "jsx-a11y/no-noninteractive-element-interactions": 1,
        "import/no-extraneous-dependencies": 1,
        "jsx-a11y/label-has-for": 1,
        "no-shadow": 1,
        "jsx-a11y/label-has-associated-control": 1,
        "jsx-a11y/media-has-caption": 1,
        "no-unused-vars": 1,
        "new-cap": 1,
        "jsx-a11y/click-events-have-key-events": 1,
        "no-param-reassign": 1,
        "valid-typeof": 1,
        "jsx-a11y/no-static-element-interactions": 1,
        "no-use-before-define": 0,
        "no-useless-escape": 0,
        "consistent-return": 0,
        "class-methods-use-this": 0,
        "no-useless-constructor": 0,
        "react/jsx-filename-extension": 0,
        "import/prefer-default-export": 0
    }
};
