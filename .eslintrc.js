module.exports = {
  env: {
    browser: true,
    es6: true
  },
  extends: ['standard'],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly'
  },
  parser: 'babel-eslint',
  parserOptions: {
    ecmaVersion: 2018,
  },
  rules: {
    semi: ['error', 'always'],
    indent: ['error', 2],
    quotes: [2, 'single']
  }
};
