//-------------------------------------
//-- Assets
//-------------------------------------
"use strict";

// const debug = require('gulp-debug');
const gulp = require("gulp");
const imagemin = require("gulp-imagemin");
const rename = require("gulp-rename");
const flow = require("../helpers/flow");
const paths = require("../helpers/paths");
const toolbox = require("../helpers/toolbox");
const util = require("../helpers/util");

module.exports = () => {
	//-- Fonts copy
	flow.createTask("assets-fonts", () => {
		return util.assetsProcess(paths.files.fonts, (stream) => {
			return stream.pipe(toolbox.plumber()).pipe(rename(util.assetsRename()));
		});
	});

	//-- Images optimization
	flow.createTask("assets-images-optimization", () => {
		return util.assetsProcess(paths.files.images, (stream) => {
			return stream.pipe(toolbox.plumber()).pipe(imagemin()).pipe(rename(util.assetsRename()));
		});
	});

	//-- High density images generation
	flow.createTask("assets-images-highdensity", () => {
		return util.assetsProcess(paths.files.images2x, (stream) => {
			return stream

				.pipe(
					toolbox.jimp((Jimp, image) => {
						image.scale(0.5, Jimp.RESIZE_BICUBIC);
					})
				)

				.pipe(imagemin())

				.pipe(
					rename(
						util.assetsRename((filename) => {
							return filename.slice(0, -3);
						})
					)
				);
		});
	});

	//-- Raw copy
	flow.createTask("assets-raw", () => {
		return util.assetsProcess(paths.files.raw, (stream) => {
			return stream.pipe(toolbox.plumber()).pipe(rename(util.assetsRename()));
		});
	});

	//-- Rebuild images
	flow.createSequence("assets-images", gulp.parallel("assets-images-optimization", "assets-images-highdensity"), {
		cleanBundle: ({ bundle }) => {
			return [`${paths.directory.root}/${bundle.output.build}/${paths.build.images}`];
		},
	});

	//-- Rebuild
	flow.createSequence("assets", gulp.parallel("assets-fonts", "assets-images", "assets-raw"), {
		cleanBundle: ({ bundle }) => {
			return [
				`${paths.directory.root}/${bundle.output.build}/${paths.build.fonts}`,
				`${paths.directory.root}/${bundle.output.build}/${paths.build.images}`,
				`${paths.directory.root}/${bundle.output.build}/${paths.build.raw}`,
			];
		},
	});
};
