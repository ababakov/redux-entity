module.exports = {
  "env": {
    // Проект для браузера
		"browser": true,
		// Включаем возможности ES6
		"es6": true,
		// Добавляем возможности ES2017
		"es2017": true
  },
  "extends": [
    // Базовый набор правил eslint
		"eslint:recommended",
		// Отключаем правила из базового набора
		"plugin:@typescript-eslint/eslint-recommended",
		// Базовые правила для TypeScript
		"plugin:@typescript-eslint/recommended",
		 // Правила TS, требующие инфо о типах
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