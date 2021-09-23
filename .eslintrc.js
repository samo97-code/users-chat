module.exports = {
  root: true,
  env: {
    browser: true,
    node: true
  },
  parserOptions: {
    parser: "babel-eslint"
  },
  rules: {
    "vue/no-use-v-if-with-v-for": "off"
  },
  extends: [
    "plugin:vue/recommended",
    "prettier",
    "prettier/vue",
    "plugin:prettier/recommended"
  ],
  plugins: ["prettier"]
};
