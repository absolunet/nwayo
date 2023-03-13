//--------------------------------------------------------
//-- SassDoc builder
//--------------------------------------------------------
"use strict";

/* eslint-disable node/no-unpublished-require */
const path = require("path");
const { fsSync } = require("@valtech-commerce/fs");
const sassdoc = require("sassdoc");

const paths = {};
paths.root = fsSync.realpath(path.join(__dirname, "..", ".."));
paths.toolbox = `${paths.root}/packages/toolbox`;
paths.source = `${paths.toolbox}/styles/`;
paths.output = `${paths.root}/docs/toolbox/styles`;

sassdoc(paths.source, {
	dest: paths.output, // eslint-disable-line unicorn/prevent-abbreviations
	package: `${paths.toolbox}/package.json`,
	strict: true,
	verbose: true,
	display: {
		access: ["public"],
	},
	basePath: "https://github.com/absolunet/nwayo/blob/main/packages/toolbox/styles",
});

// Add CSS
