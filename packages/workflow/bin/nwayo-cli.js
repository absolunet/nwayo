#!/usr/bin/env node

"use strict";

const path = require("node:path");

require(path.join("..", "cli", "index"))({
	cliPkg: require(path.join("..", "package.json")), // eslint-disable-line node/global-require, unicorn/prevent-abbreviations
	cliPath: __dirname,
	cliUsage: { tasks: {} },
});
