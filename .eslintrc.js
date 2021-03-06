/*
 * @Author: xuxueliang
 * @Date: 2019-10-12 11:43:13
 * @LastEditors: xuxueliang
 * @LastEditTime: 2020-10-14 14:38:19
 */
// https://eslint.org/docs/user-guide/configuring

module.exports = {
  root: true,
  parser: "babel-eslint",
  parserOptions: {
    parser: 'babel-eslint',
    ecmaFeatures: {
      legacyDecorators: true,
      "jsx": true,
      "experimentalObjectRestSpread": true
    }
  },
  env: {
    browser: true,
  },
  extends: [
    'plugin:react/recommended',
    // https://github.com/standard/standard/blob/master/docs/RULES-en.md
    'standard'
  ],
  // add your custom rules here
  rules: {
    // allow async-await
    'generator-star-spacing': 'off',
    'template-curly-spacing': 'off',
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    // 'vue/no-parsing-error': [2, { 'x-invalid-end-tag': false }],
    "space-before-function-paren": ["error", "always"],
    'react/no-string-refs': 'off'
    // "react/jsx-uses-vars": "error"
  }, "settings": {
    "react": {
      "pragma": "Yam"
    }
  }
}
