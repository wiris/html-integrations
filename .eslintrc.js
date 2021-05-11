module.exports = {
  env: {
    browser: true,
    es6: true,
    jest: true,
    node: true,
  },
  plugins: [
    'jest',
  ],
  extends: [
    'airbnb-base',
  ],
  parser: 'babel-eslint',
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
    WirisPlugin: 'readonly',
    tinymce: 'readonly',
    CKEDITOR: 'readonly',
    FroalaEditor: 'readonly',
  },
  parserOptions: {
    ecmaVersion: 6, // We use version-based naming instead of year-based naming.
    sourceType: 'module', // This project's code is in ECMAScript modules.
  },
  rules: {
    'jest/no-disabled-tests': 'warn',
    'jest/no-focused-tests': 'error',
    'jest/no-identical-title': 'error',
    'jest/prefer-to-have-length': 'warn',
    'jest/valid-expect': 'error',
    'max-len': [
      'error',
      {
        code: 200,
        ignoreComments: true,
        ignoreTrailingComments: true,
      },
    ],
    'no-console': [
      'error',
      {
        allow: [
          'warn',
          'error',
        ],
      },
    ],
    eqeqeq: [
      'error',
      'smart',
    ],
    'func-names': [
      'error',
      'never',
    ],
    'no-throw-literal': 'off',
    'no-restricted-syntax': [
      'error',
      'LabeledStatement',
      'WithStatement',
    ],
    'no-plusplus': [
      'error',
      {
        allowForLoopAfterthoughts: true,
      },
    ],
    'no-mixed-operators': [
      'error',
      {
        groups: [
          [
            '==',
            '!=',
            '===',
            '!==',
            '>',
            '>=',
            '<',
            '<=',
          ],
          [
            'in',
            'instanceof',
          ],
        ],
        allowSamePrecedence: true,
      },
    ],
    'import/no-extraneous-dependencies': 'off',
    'no-underscore-dangle': [
      'error',
      {
        allow: [
          '__BROWSER_GLOBAL__',
        ],
      },
    ],
  },
  overrides: [
    {
      files: [
        'packages/**/*.js',
      ],
      rules: {
        'no-underscore-dangle': 'off',
        'no-param-reassign': 'off',
        'import/no-cycle': 'off',
        'no-shadow': 'off',
        'prefer-destructuring': 'off',
      },
      globals: {
        _wrs_int_wirisProperties: 'readonly',
        event: 'readonly',
        com: 'readonly',
        ActiveXObject: 'readonly',
      },
    },
  ],
};