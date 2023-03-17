/* eslint-env node */
"use strict";

module.exports = {
	rules: {
		// Color
		"color-hex-case": "lower",

		// Function
		"function-comma-newline-after": "always-multi-line",
		"function-comma-newline-before": "never-multi-line",
		"function-comma-space-after": "always",
		"function-comma-space-before": "never",
		"function-max-empty-lines": 0,
		"function-parentheses-newline-inside": "always-multi-line",
		"function-parentheses-space-inside": "never",
		"function-whitespace-after": "always",

		// Number
		"number-leading-zero": "never",
		"number-no-trailing-zeros": true,

		// String
		"string-quotes": [
			"single",
			{
				avoidEscape: true,
			},
		],

		// Unit
		"unit-case": "lower",

		// Value list
		"value-list-comma-newline-after": "never-multi-line",
		"value-list-comma-newline-before": "never-multi-line",
		"value-list-comma-space-after": "always",
		"value-list-comma-space-before": "never",
		"value-list-max-empty-lines": 0,

		// Property
		"property-case": "lower",

		// Declaration
		"declaration-bang-space-after": "never",
		"declaration-bang-space-before": "always",
		"declaration-colon-newline-after": "always-multi-line",
		"declaration-colon-space-after": "always",
		"declaration-colon-space-before": "never",

		// Declaration block
		"declaration-block-semicolon-newline-after": "always",
		"declaration-block-semicolon-newline-before": "never-multi-line",
		"declaration-block-semicolon-space-after": null,
		"declaration-block-semicolon-space-before": "never",
		"declaration-block-trailing-semicolon": "always",

		// Block
		"block-closing-brace-empty-line-before": null,
		"block-closing-brace-newline-after": [
			"always",
			{
				ignoreAtRules: ["if", "else"],
			},
		],
		"block-closing-brace-newline-before": "always",
		"block-closing-brace-space-after": null,
		"block-closing-brace-space-before": null,
		"block-opening-brace-newline-after": "always",
		"block-opening-brace-newline-before": null,
		"block-opening-brace-space-after": null,
		"block-opening-brace-space-before": [
			"always",
			{
				ignoreAtRules: ["if", "else"],
			},
		],

		// Selector
		"selector-attribute-brackets-space-inside": "never",
		"selector-attribute-operator-space-after": "never",
		"selector-attribute-operator-space-before": "never",
		"selector-combinator-space-after": "always",
		"selector-combinator-space-before": "always",
		"selector-descendant-combinator-no-non-space": true,
		"selector-max-empty-lines": 0,
		"selector-pseudo-class-case": "lower",
		"selector-pseudo-class-parentheses-space-inside": "never",
		"selector-pseudo-element-case": "lower",

		// Selector list
		"selector-list-comma-newline-after": "always-multi-line",
		"selector-list-comma-newline-before": "never-multi-line",
		"selector-list-comma-space-after": "always-single-line",
		"selector-list-comma-space-before": "never",

		// Media feature
		"media-feature-colon-space-after": "always",
		"media-feature-colon-space-before": "never",
		"media-feature-name-case": "lower",
		"media-feature-parentheses-space-inside": "never",
		"media-feature-range-operator-space-after": "always",
		"media-feature-range-operator-space-before": "always",

		// Media query list
		"media-query-list-comma-newline-after": "always-multi-line",
		"media-query-list-comma-newline-before": "never-multi-line",
		"media-query-list-comma-space-after": "always-single-line",
		"media-query-list-comma-space-before": "never",

		// At-rule
		"at-rule-name-case": "lower",
		"at-rule-name-newline-after": null,
		"at-rule-name-space-after": "always-single-line",
		"at-rule-semicolon-newline-after": "always",
		"at-rule-semicolon-space-before": "never",

		// General / Sheet
		indentation: "tab",
		linebreaks: "unix",
		"max-empty-lines": null,
		"max-line-length": null,
		"no-empty-first-line": true,
		"no-eol-whitespace": true,
		"no-extra-semicolons": true,
		"no-missing-end-of-source-newline": true,
		"unicode-bom": "never",
	},
};
