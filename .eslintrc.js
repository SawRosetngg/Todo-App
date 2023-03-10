module.exports = {
  env: {
    node: true,
    // browser: true,
    commonjs: true,
    es6: true
  },
  extends: "eslint:recommended",
  globals: {
    Atomics: "readonly",
    SharedArrayBuffer: "readonly"
  },
  parserOptions: {
    ecmaVersion: 2018
  },
  rules: {
    // indent: ["error", "tab"],
    "linebreak-style": ["error", "unix"],
    semi: ["error", "always"],
    quotes: ["error", "double"],
  }
};
