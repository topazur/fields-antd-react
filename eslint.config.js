const antfu = require('@antfu/eslint-config').default

module.exports = antfu(
  {
    typescript: true,
    react: true,
    ignores: [
      'tsconfig.*json',
    ],
  },
  {
    // Without `files`, they are general rules for all files
    rules: {
      'no-console': 'off',
      // curly braces in object
      'curly': ['error', 'multi-line', 'consistent'],
      'max-statements-per-line': ['error', { max: 2 }],
      // [import/order](https://github.com/import-js/eslint-plugin-import/blob/main/docs/rules/order.md)
      'import/order': ['error', {
        'groups': ['builtin', 'external', ['internal', 'parent', 'sibling', 'index'], 'unknown', 'object', 'type'],
        'newlines-between': 'always',
        'pathGroupsExcludedImportTypes': [],
        'warnOnUnassignedImports': false,
      }],
      // React
      'react/prop-types': 'off',
      'react/no-unknown-property': 'off',
    },
  },
)
