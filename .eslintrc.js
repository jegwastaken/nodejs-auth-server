module.exports = {
  extends: ['panadero'],
  rules: {'no-console': 'off', 'new-cap': 'warn', 'no-mixed-operators': 'off'},
  parserOptions: {ecmaVersion: 8},
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx', '.d.ts'],
        moduleDirectory: ['node_modules', 'src'],
      },
    },
  },
  overrides: [
    {
      files: ['.*.js', '__*.js'],
      rules: {indent: ['error', 2]},
    },
  ],
};
