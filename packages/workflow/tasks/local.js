//-------------------------------------
//-- Local
//-------------------------------------
"use strict";

// const debug = require('gulp-debug');
const gulp = require("gulp");
const env = require("../helpers/env"); // eslint-disable-line unicorn/prevent-abbreviations
const flow = require("../helpers/flow");
const paths = require("../helpers/paths");
const toolbox = require("../helpers/toolbox");
const util = require("../helpers/util");

module.exports = () => {
	//-- Convert constants to JSON
	flow.createTask("local-constants", ({ taskName }) => {
		const streams = [];

		for (const name of Object.keys(env.bundles)) {
			const bundle = env.bundles[name];

			const data = {
				GENERATION: util.getGeneratedBanner(name, "text"),
				[env.id]: env.workflowConfig.version,
				project: env.packageConfig.name,
				bundle: name,
				konstan: util.parseKonstan("local", name, bundle.output),
			};

			streams.push(
				toolbox
					.vinylStream(paths.filename.konstanLocal, JSON.stringify(data, null, 2))
					.pipe(toolbox.plumber())
					.pipe(gulp.dest(`${paths.directory.root}/${bundle.output.konstan}`))
					.on("finish", () => {
						toolbox.log(
							taskName,
							`'${bundle.output.konstan}/${paths.filename.konstanLocal}' written`,
							toolbox.filesize(`${paths.directory.root}/${bundle.output.konstan}/${paths.filename.konstanLocal}`)
						);
					})
			);
		}

		return toolbox.mergeStreams(streams);
	});

	//-- Rebuild
	flow.createSequence("local", gulp.series("local-constants"), {
		cleanBundle: ({ bundle }) => {
			return [`${paths.directory.root}/${bundle.output.konstan}/${paths.filename.konstanLocal}`];
		},
	});
};
