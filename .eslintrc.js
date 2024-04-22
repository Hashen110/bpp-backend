module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2021: true,
    node: true,
  },
  extends: [
    'airbnb-base',
    'plugin:security/recommended',
  ],
  overrides: [
    {
      env: {
        node: true,
      },
      files: [
        '.eslintrc.{js,cjs}',
      ],
      parserOptions: {
        sourceType: 'script',
      },
    },
  ],
  parserOptions: {
    ecmaVersion: 'latest',
  },
  rules: {
    'max-len': ['error', {
      code: 120,
      tabWidth: 2,
    }],
    'newline-per-chained-call': ['error', {
      ignoreChainWithDepth: 5,
    }],
    'object-curly-newline': ['error', {
      ObjectPattern: {
        multiline: true,
      },
      ExportDeclaration: {
        multiline: true,
        minProperties: 10,
      },
    }],
  },
};
