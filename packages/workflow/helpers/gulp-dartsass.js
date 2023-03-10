//-------------------------------------
//-- Gulp plugin - Dart Sass global standalone
//-------------------------------------
"use strict";

const { execSync } = require("node:child_process");
const eventStream = require("event-stream");

module.exports = ({ loadPath }) => {
	const compile = function (file, callback) {
		if (file.isBuffer()) {
			const out = execSync(
				["sass", "--color", "--unicode", "--verbose", `--load-path=${loadPath}`, "--stdin"].join(" "),
				{
					input: file.contents,
					stdio: ["pipe"],
				}
			);

			file.contents = out;
			file.extname = ".css";
		}

		return callback(null, file);
	};

	return eventStream.map(compile);
};
