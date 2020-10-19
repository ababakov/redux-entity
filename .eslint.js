module.exports = {
  "env": {
		"browser": true,
		"es6": true,
		"es2017": true
  },
  "extends": [
		"eslint:recommended",
		"plugin:@typescript-eslint/eslint-recommended",
		"plugin:@typescript-eslint/recommended",
		"plugin:@typescript-eslint/recommended-requiring-type-checking"
  ],
  "rules": {},
  "globals": {},
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
      "project": "tsconfig.json",
      "sourceType": "module",
      "tsconfigRootDir": ".",
  },
  "plugins": [
      "@typescript-eslint",
      "@typescript-eslint/tslint"
  ]
};