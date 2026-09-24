const js = require('@eslint/js');

module.exports = [
  { ignores: ['examples/**', '**/*.node*.js'] },
  js.configs.recommended,
  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: 'commonjs',
      globals: {
        console: 'readonly',
        URL: 'readonly',
        URLSearchParams: 'readonly',
        __dirname: 'readonly',
      },
    },
  },
  {
    files: ['**/*ForWorkers*.js'],
    languageOptions: {
      globals: { fetch: 'readonly', Response: 'readonly' },
    },
  },
];
