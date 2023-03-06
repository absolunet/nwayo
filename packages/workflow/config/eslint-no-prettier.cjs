/* eslint-env node */
"use strict";

module.exports = {
	rules: {
		"no-extra-parens": [
			"error",
			"all",
			{
				nestedBinaryExpressions: false,
				ignoreJSX: "all",
				enforceForFunctionPrototypeMethods: false,
			},
		],
		"no-extra-semi": ["error"],
		"no-unexpected-multiline": ["error"],
		curly: ["error", "all"],
		"dot-location": ["error", "property"],
		"no-floating-decimal": ["error"],
		"no-multi-spaces": ["off"],
		"wrap-iife": [
			"error",
			"inside",
			{
				functionPrototypeMethods: true,
			},
		],
		"array-bracket-newline": ["error", "consistent"],
		"array-bracket-spacing": ["error", "never"],
		"array-element-newline": ["error", "consistent"],
		"block-spacing": ["error", "always"],
		"brace-style": [
			"error",
			"1tbs",
			{
				allowSingleLine: true,
			},
		],
		"comma-dangle": ["error", "never"],
		"comma-spacing": [
			"error",
			{
				before: false,
				after: true,
			},
		],
		"comma-style": ["error", "last"],
		"computed-property-spacing": [
			"error",
			"never",
			{
				enforceForClassMembers: true,
			},
		],
		"eol-last": ["error", "always"],
		"func-call-spacing": ["error", "never"],
		"function-call-argument-newline": ["error", "consistent"],
		"function-paren-newline": ["error", "multiline"],
		"implicit-arrow-linebreak": ["off"],
		indent: [
			"error",
			"tab",
			{
				SwitchCase: 1,
				VariableDeclarator: "first",
				outerIIFEBody: 1,
				MemberExpression: 1,
				FunctionDeclaration: {
					parameters: 1,
					body: 1,
				},
				FunctionExpression: {
					parameters: 1,
					body: 1,
				},
				CallExpression: {
					arguments: 1,
				},
				ArrayExpression: 1,
				ImportDeclaration: 1,
				ObjectExpression: 1,
				ignoreComments: true,
			},
		],
		"jsx-quotes": ["error", "prefer-double"],
		"key-spacing": [
			"error",
			{
				singleLine: {
					beforeColon: false,
					afterColon: true,
				},
				multiLine: {
					beforeColon: false,
					afterColon: true,
					mode: "minimum",
				},
			},
		],
		"keyword-spacing": [
			"error",
			{
				before: true,
				after: true,
			},
		],
		"linebreak-style": ["error", "unix"],
		"lines-around-comment": [
			"error",
			{
				beforeBlockComment: true,
				afterBlockComment: false,
				beforeLineComment: false,
				afterLineComment: false,
			},
		],
		"max-len": ["off"],
		"multiline-ternary": ["off"],
		"new-parens": ["error", "always"],
		"newline-per-chained-call": ["off"],
		"no-mixed-operators": [
			"error",
			{
				allowSamePrecedence: true,
			},
		],
		"no-mixed-spaces-and-tabs": ["error"],
		"no-multiple-empty-lines": [
			"error",
			{
				max: 100,
				maxEOF: 1,
				maxBOF: 0,
			},
		],
		"no-tabs": ["off"],
		"no-trailing-spaces": [
			"error",
			{
				skipBlankLines: false,
			},
		],
		"no-whitespace-before-property": ["error"],
		"nonblock-statement-body-position": ["error", "beside"],
		"object-curly-newline": [
			"error",
			{
				multiline: true,
				consistent: true,
			},
		],
		"object-curly-spacing": ["error", "always"],
		"object-property-newline": ["off"],
		"one-var-declaration-per-line": ["error", "always"],
		"operator-linebreak": [
			"error",
			"after",
			{
				overrides: {
					"?": "before",
					":": "before",
				},
			},
		],
		"padded-blocks": [
			"error",
			{
				classes: "always",
				switches: "always",
			},
		],
		"quote-props": [
			"error",
			"consistent-as-needed",
			{
				keywords: true,
			},
		],
		quotes: [
			"error",
			"single",
			{
				avoidEscape: true,
				allowTemplateLiterals: true,
			},
		],
		semi: ["error", "always"],
		"semi-spacing": [
			"error",
			{
				before: false,
				after: true,
			},
		],
		"semi-style": ["off"],
		"space-before-blocks": ["error", "always"],
		"space-before-function-paren": [
			"error",
			{
				anonymous: "never",
				named: "never",
				asyncArrow: "always",
			},
		],
		"space-in-parens": ["error", "never"],
		"space-infix-ops": [
			"error",
			{
				int32Hint: false,
			},
		],
		"space-unary-ops": [
			"error",
			{
				words: true,
				nonwords: false,
			},
		],
		"switch-colon-spacing": [
			"error",
			{
				before: false,
				after: true,
			},
		],
		"template-tag-spacing": ["error", "never"],
		"unicode-bom": ["error", "never"],
		"wrap-regex": ["error"],
		"arrow-parens": ["error", "always"],
		"arrow-spacing": [
			"error",
			{
				before: true,
				after: true,
			},
		],
		"generator-star-spacing": ["error", "before"],
		"no-confusing-arrow": [
			"error",
			{
				allowParens: false,
			},
		],
		"rest-spread-spacing": ["error", "never"],
		"template-curly-spacing": ["error", "never"],
		"yield-star-spacing": ["error", "before"],
		"unicorn/empty-brace-spaces": ["error"],
		"unicorn/no-nested-ternary": ["off"],
		"unicorn/number-literal-case": ["error"],
	},
};
