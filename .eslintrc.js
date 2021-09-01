module.exports = {
  extends: [
    '@xrplf/eslint-config/base',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.eslint.json',
    sourceType: 'module',
    ecmaFeatures: {
      impliedStrict: true,
    },
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
          'Buffer'
        ],
      },
    ],

    // TODO We should turn on the below rule later once we have determined our docgen system
    'jsdoc/require-jsdoc': 'off',

    // The below rule must stay off because we appropriately have some runtime typechecks for javascript users that need to stay
    '@typescript-eslint/no-unnecessary-condition': 'off',
  },
}
