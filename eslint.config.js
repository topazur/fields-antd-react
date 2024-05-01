const antfu = require('@antfu/eslint-config').default

module.exports = antfu(
  {
    typescript: true,
    react: {
      overrides: {
        'react-hooks/exhaustive-deps': 'off',
        'react-hooks/rules-of-hooks': 'off',
      },
    },
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
      'style/max-statements-per-line': ['error', { max: 2 }],
      // [import/order](https://github.com/import-js/eslint-plugin-import/blob/main/docs/rules/order.md)
      'import/order': ['error', {
        'groups': ['builtin', 'external', ['internal', 'parent', 'sibling', 'index'], 'unknown', 'object', 'type'],
        'newlines-between': 'always',
        'pathGroupsExcludedImportTypes': [],
        'warnOnUnassignedImports': false,
      }],
      'regexp/no-misleading-capturing-group': 'off',
      // React
      'react/prop-types': 'off',
      'react/no-unknown-property': 'off',
      'react/prefer-shorthand-boolean': 'off',
      'react/no-children-to-array': 'off',
      'react-refresh/only-export-components': 'off',
    },
  },
)
