//-------------------------------------
//-- Styles
//-------------------------------------
"use strict";

// const debug = require('gulp-debug');
const autoprefixer = require("autoprefixer");
const cssnano = require("cssnano");
const gulp = require("gulp");
const cache = require("gulp-cached");
const gulpif = require("gulp-if");
const imagemin = require("gulp-imagemin");
const postcss = require("gulp-postcss");
const rename = require("gulp-rename");
const gulpsass = require("gulp-sass")(require("sass"));
const sourcemaps = require("gulp-sourcemaps");
const cloneDeep = require("lodash.clonedeep");
const pluralize = require("pluralize");
const slash = require("slash");
const jsonToScss = require("@absolunet/json-to-scss");
const stylelint = require("@ronilaukkarinen/gulp-stylelint");
const env = require("../helpers/env"); // eslint-disable-line unicorn/prevent-abbreviations
const flow = require("../helpers/flow");
const paths = require("../helpers/paths");
const toolbox = require("../helpers/toolbox");
const util = require("../helpers/util");

module.exports = () => {
	//-- Inline images optimization
	flow.createTask("styles-images", () => {
		return gulp
			.src(paths.files.inline, { base: paths.directory.root })
			.pipe(toolbox.plumber())
			.pipe(imagemin())
			.pipe(rename(util.assetsRename()))
			.pipe(gulp.dest(paths.directory.cache));
	});

	//-- Lint SCSS
	flow.createTask("styles-lint", ({ taskName }) => {
		let hasErrors = false;

		return (
			gulp
				.src(paths.files.stylesLint)
				// .pipe(toolbox.plumber())   // skip cuz of watch

				.pipe(cache("styles", { optimizeMemory: true }))

				.pipe(
					stylelint({
						configFile: paths.config.stylelint,
						customSyntax: "postcss-scss",
						failAfterError: true,
						reporters: [
							{
								formatter: (results) => {
									hasErrors = false;

									results.forEach((item) => {
										if (
											item.warnings.length > 0 ||
											item.deprecations.length > 0 ||
											item.invalidOptionWarnings.length > 0
										) {
											delete cache.caches.styles[item.source];

											if (!hasErrors) {
												item.warnings.forEach((flag) => {
													if (flag.severity === "error") {
														hasErrors = true;
													}
												});
											}
										}
									});

									if (!hasErrors) {
										toolbox.log(taskName, `${pluralize("file", results.length, true)} linted`);
									}
								},
							},
							{
								formatter: "string",
								console: true,
							},
						],
					})
				)
		);
	});

	//-- Convert constants to SCSS
	flow.createTask("styles-constants", ({ taskName }) => {
		const streams = [];

		for (const name of Object.keys(env.bundles)) {
			const data = util.parseKonstan("styles", name, env.bundles[name].output);
			data.bundle = `'${name}'`;

			const konstanJson = JSON.stringify({ konstan: data });

			streams.push(
				toolbox
					.vinylStream(paths.filename.konstanStyles, jsonToScss.convert(konstanJson))
					.pipe(gulp.dest(`${paths.directory.cacheStyles}/${name}`))
			);
		}

		return toolbox.mergeStreams(streams).on("finish", () => {
			flow.skipOnWatch(taskName);
			toolbox.log(taskName, `${pluralize("file", streams.length, true)} generated`);
		});
	});

	//-- Compile
	flow.createTask(
		"styles-compile",

		({ taskName }) => {
			const sassFunctions = require(paths.config.sassFunctions); // eslint-disable-line node/global-require

			const streams = [];

			for (const name of Object.keys(env.bundles)) {
				const bundle = env.bundles[name];

				// For each collection
				for (const collection of Object.keys(bundle.styles.collections)) {
					const list = cloneDeep(bundle.styles.collections[collection]);

					// Add konstan
					list.unshift(slash(`${paths.directory.cacheStyles}/${name}/${paths.filename.konstan}`));

					// Require each file
					list.forEach((file, index) => {
						list[index] = `@import '${file}';`;
					});

					const toMinify = (bundle.styles.options.minify && !env.watching) || env.production;
					const toSourcemaps = bundle.styles.options.sourcemaps && !env.production;
					const filename = `${collection}.${paths.extension.build}`;
					const filenameBuild = `${collection}.${paths.extension.stylesBuild}`;
					const destination = `${bundle.output.build}/${paths.build.styles}`;
					const source = `${util.getGeneratedBanner(name)}${list.join("\n")}\n`;

					const postCssPlugins = [autoprefixer({ overrideBrowserslist: bundle.styles.options.autoprefixer })];
					if (toMinify) {
						postCssPlugins.push(
							cssnano({
								autoprefixer: false,
								discardUnused: false,
								mergeIdents: false,
								reduceIdents: false,
								zindex: false,
							})
						);
					}

					streams.push(
						toolbox
							.vinylStream(filename, source)
							.pipe(toolbox.plumber())

							.pipe(gulpif(toSourcemaps, sourcemaps.init()))

							.pipe(
								gulpsass({
									includePaths: [paths.directory.root],
									functions: sassFunctions,
									// sourcemaps  (bundle.styles.options.sourcemaps)
								}).on("error", gulpsass.logError)
							)

							.pipe(postcss(postCssPlugins))

							.pipe(
								gulpif(
									toSourcemaps,
									sourcemaps.write("maps", {
										includeContent: false,
										sourceRoot: "source",
									})
								)
							)

							.pipe(gulp.dest(`${paths.directory.root}/${destination}`))

							.on("finish", () => {
								toolbox.log(
									taskName,
									`'${destination}/${filenameBuild}' written`,
									toolbox.filesize(`${paths.directory.root}/${destination}/${filenameBuild}`)
								);
							})
					);
				}
			}

			return toolbox.mergeStreams(streams);
		},

		gulp.parallel("styles-lint", "styles-constants")
	);

	//-- Rebuild
	flow.createSequence("styles", gulp.series("styles-images", "styles-compile"), {
		cleanPaths: [paths.directory.cacheInline],
		cleanBundle: ({ name, bundle }) => {
			const buildPath = `${paths.directory.root}/${bundle.output.build}/${paths.build.styles}`;
			const cachePath = `${paths.directory.cacheStyles}/${name}`;

			if (env.isScopeSubbundle) {
				return Object.keys(bundle.styles.collections).flatMap((collection) => {
					return [
						`${buildPath}/${collection}.${paths.extension.stylesBuild}`,
						`${cachePath}/${collection}.${paths.extension.stylesBuild}`,
					];
				});
			}

			return [buildPath, cachePath];
		},
	});
};
