/* eslint-disable import/unambiguous, import/no-commonjs, import/no-unused-modules --
 * this is a script */
module.exports = {
  root: true,
  extends: ['@xrplf/eslint-config/base'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.eslint.json',
  },
  env: {
    browser: true,
    node: true,
    es2020: true,
    jest: true,
  },
  rules: {
    'no-shadow': [
      'error',
      {
        allow: [
          // This exception is specific to this package and must stay
          'Buffer',
        ],
      },
    ],

    // TODO We should turn on the below rule later once we have determined our docgen system
    'jsdoc/require-jsdoc': 'off',

    // The below rule must stay off because we appropriately have some runtime typechecks for javascript users that need to stay
    '@typescript-eslint/no-unnecessary-condition': 'off',
  },
  overrides: [
    // test files always look like scripts and are currently using commonjs
    {
      files: ['test/**/*.js'],
      rules: {
        'max-nested-callbacks': 'off',
        'import/unambiguous': 'off',
        'import/no-commonjs': 'off',
        '@typescript-eslint/no-require-imports': 'off',
        '@typescript-eslint/explicit-function-return-type': 'off',
        '@typescript-eslint/naming-convention': 'off',
        '@typescript-eslint/no-var-requires': 'off',
        '@typescript-eslint/no-unsafe-member-access': 'off',
        '@typescript-eslint/no-unsafe-return': 'off',
        '@typescript-eslint/no-unsafe-assignment': 'off',
        '@typescript-eslint/no-unsafe-call': 'off',
        '@typescript-eslint/restrict-template-expressions': 'off',
        '@typescript-eslint/unbound-method': 'off',
        'no-restricted-globals': 'off',
        // TODO we should probably turn this back on at some point
        'id-length': 'off',
        // TODO we should probably turn this back on at some point
        'id-blacklist': 'off',
        // TODO we should probably turn this back on at some point
        'new-cap': 'off',
        // TODO we should probably turn this back on at some point
        '@typescript-eslint/no-magic-numbers': 'off',
      },
    },
  ],
}
