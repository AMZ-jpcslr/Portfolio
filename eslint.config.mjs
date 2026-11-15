export default [{
  files: ['scripts/*.mjs', 'site/notebook/**/*.{js,mjs}'],
  languageOptions: { ecmaVersion: 2024, sourceType: 'module' },
  rules: {
    'constructor-super': 'error',
    'for-direction': 'error',
    'no-constant-binary-expression': 'error',
    'no-debugger': 'error',
    'no-dupe-args': 'error',
    'no-dupe-keys': 'error',
    'no-duplicate-case': 'error',
    'no-empty': 'error',
    'no-fallthrough': 'error',
    'no-self-assign': 'error',
    'no-unreachable': 'error',
    'no-unused-vars': ['error', { args: 'after-used', argsIgnorePattern: '^_' }],
    'valid-typeof': 'error'
  }
}];
