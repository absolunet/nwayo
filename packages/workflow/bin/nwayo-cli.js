#!/usr/bin/env node

"use strict";

const path = require("node:path");

require(path.join("..", "cli", "index"))({
	cliPkg: require(path.join("..", "package.json")),
	cliPath: __dirname,
	cliUsage: { tasks: {} },
});
