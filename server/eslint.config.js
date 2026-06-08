module.exports = [
  {
    files: ['server.js', 'games.js', 'db.js', 'scripts/**/*.js', 'eslint.config.js'],
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: 'script'
    },
    rules: {
      'no-dupe-keys': 'error',
      'no-redeclare': 'error',
      'no-unreachable': 'error',
      'no-unused-vars': ['error', { args: 'none' }]
    }
  },
  {
    files: ['../game/src/*.js'],
    languageOptions: {
      ecmaVersion: 5,
      sourceType: 'script',
      globals: {
        alert: 'readonly',
        console: 'readonly',
        document: 'readonly',
        navigator: 'readonly',
        setInterval: 'readonly',
        setTimeout: 'readonly',
        URL: 'readonly',
        webkitURL: 'readonly',
        window: 'readonly'
      }
    },
    rules: {
      'no-dupe-keys': 'error',
      'no-redeclare': 'error',
      'no-unreachable': 'error'
    }
  }
];
