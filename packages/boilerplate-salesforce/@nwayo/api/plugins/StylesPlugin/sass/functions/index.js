'use strict';

const toCase = require('to-case');

const absolutePath   = require('./absolutePath');
const checksum       = require('./checksum');
const fileExists     = require('./fileExists');
const inlineFile     = require('./inlineFile');
const pathFromSource = require('./pathFromSource');
const readFile       = require('./readFile');


const prefix = 'nwayo-api-';

const sassFunctions = [
	absolutePath,
	checksum,
	fileExists,
	inlineFile,
	pathFromSource,
	readFile
];


module.exports = (...parameters) => {
	const javaScriptFunctions = {};

	return Object.fromEntries(sassFunctions.flatMap((functionMapping) => {
		const functionMappingObject = typeof functionMapping === 'function' ? functionMapping(...parameters) : functionMapping;

		return Object.entries(functionMappingObject).map(([key, value]) => {
			const boundValue                                              = value.bind(javaScriptFunctions);
			javaScriptFunctions[toCase.camel(key.replace(/\(.*\)/u, ''))] = boundValue;

			boundValue.js = function(...parameters) {
				return this(...parameters);
			};

			return [
				`${prefix}${key}`,
				boundValue
			];
		});
	}));
};
