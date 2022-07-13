//-------------------------------------
//-- Rebuild
//-------------------------------------
"use strict";

// const debug = require('gulp-debug');
const gulp = require("gulp");
const fss = require("@absolunet/fss");
const env = require("../helpers/env"); // eslint-disable-line unicorn/prevent-abbreviations
const flow = require("../helpers/flow");
const paths = require("../helpers/paths");
const toolbox = require("../helpers/toolbox");
const util = require("../helpers/util");

module.exports = () => {
	util.loadAllTasks();

	//-- Rebuild scripts & styles
	flow.createSequence("rebuild-ss", gulp.series("scripts", "styles"));

	//-- Rebuild
	flow.createSequence(
		"rebuild",
		gulp.series(
			() => {
				return toolbox.fakeStream((callback) => {
					for (const name of Object.keys(env.bundles)) {
						fss.outputFile(
							`${paths.directory.root}/${env.bundles[name].output.build}/readme-${env.id}.md`,
							`# ${util.getGeneratedBanner(name, "text")}\n`
						);
					}
					callback();
				});
			},
			"assets",
			"icons",
			"local",
			"scripts",
			"styles"
		)
	);
};
