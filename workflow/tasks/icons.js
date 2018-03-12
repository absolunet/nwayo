//-------------------------------------
//-- Icons
//-------------------------------------
'use strict';

// const debug = require('gulp-debug');
const gulp     = require('gulp');
const gm       = require('gulp-gm');
const gulpif   = require('gulp-if');
const imagemin = require('gulp-imagemin');
const rename   = require('gulp-rename');
const terminal = require('@absolunet/terminal');
const flow     = require('../helpers/flow');
const paths    = require('../helpers/paths');
const toolbox  = require('../helpers/toolbox');
const util     = require('../helpers/util');






// https://github.com/gleero/grunt-favicons
// https://github.com/audreyr/favicon-cheat-sheet


//-- Favicon.ico
// https://mathiasbynens.be/notes/rel-shortcut-icon
flow.createTask('icons-favicon', () => {
	const sizes = [
		16,  // IE9 address bar, Pinned site Jump List/Toolbar/Overlay
		24,  // IE9 Pinned site browser UI
		32,  // New tab page in IE, taskbar button in Win 7+, Safari Read Later sidebar
		48,  // Windows site icons
		64   // Windows site icons, Safari Reading List sidebar in HiDPI/Retina
	];

	return util.assetsProcess(paths.files.iconsFavicon, (stream) => {

		return stream
			.pipe(gm((gmfile) => {
				return gmfile
					.define(`icon:auto-resize=${sizes.join(',')}`)
					.setFormat('ico')
				;
			}, { imageMagick:true }))

			.pipe(rename(util.assetsRename()))
		;
	});
});


//-- Share icons
// https://mathiasbynens.be/notes/touch-icons
// https://developer.apple.com/ios/human-interface-guidelines/graphics/app-icon/
// https://developer.chrome.com/multidevice/android/installtohomescreen
// http://operacoast.com/developer

//-- Touch
flow.createTask('icons-touch', () => {
	const touchSizes = [
		57,   // For non-Retina (@1× display) iPhone, iPod Touch, and Android 2.1+ devices
		72,   // For the iPad mini and the first- and second-generation iPad (@1× display) on iOS ≤ 6
		76,   // For the iPad mini and the first- and second-generation iPad (@1× display) on iOS ≥ 7
		114,  // For iPhone with @2× display running iOS ≤ 6:
		120,  // For iPhone with @2× display running iOS ≥ 7
		144,  // For iPad with @2× display running iOS ≤ 6
		152,  // For iPad with @2× display running iOS ≤ 7
		167,  // For iPad Pro with @2× display running iOS ≤ 9
		180,  // For iPhone 6 Plus with @3× display
		512   // General share icon
	];

	const streams = [];

	// Foreach each sizes
	for (const size of touchSizes) {

		/* eslint-disable function-paren-newline */
		streams.push(
			util.assetsProcess(paths.files.iconsTouch, (stream) => {

				return stream
					.pipe(gulpif(size !== 512, gm((gmfile, done) => {
						gmfile.identify((err, info) => {
							if (err) {
								terminal.error(err);
							}
							done(null, toolbox.gmOptimization(gmfile.resize(size, size), info));
						});
					})))

					.pipe(rename(util.assetsRename(`touch-${size}`)))

					.pipe(imagemin())
				;
			})
		);
		/* eslint-disable function-paren-newline */
	}

	return toolbox.mergeStreams(streams);
});


//-- Icons
flow.createTask('icons-icon', () => {
	const iconSizes = [
		64,   // Windows site icons, Safari Reading List, Modern browsers
		96,   // Google TV Favicon
		192,  // For Chrome for Android
		195,  // Opera Speed Dial icon
		196,  // For Chrome for Android home screen icon
		228   // For Coast for iOS
	];

	const streams = [];

	// Foreach each sizes
	for (const size of iconSizes) {

		/* eslint-disable function-paren-newline */
		streams.push(
			util.assetsProcess(paths.files.iconsIcon, (stream) => {

				return stream
					.pipe(gulpif(size !== 256, gm((gmfile, done) => {
						gmfile.identify((err, info) => {
							if (err) {
								terminal.error(err);
							}
							done(null, toolbox.gmOptimization(gmfile.resize(size, size), info));
						});
					})))

					.pipe(rename(util.assetsRename(`icon-${size}`)))

					.pipe(imagemin())
				;
			})
		);
		/* eslint-disable function-paren-newline */
	}

	return toolbox.mergeStreams(streams);
});


//-- Large
flow.createTask('icons-large', () => {
	return util.assetsProcess(paths.files.iconsLarge, (stream) => {
		return stream
			.pipe(rename(util.assetsRename('large')))
			.pipe(imagemin())
		;
	});
});


//-- Windows metro tile
// http://msdn.microsoft.com/en-us/library/ie/dn455106(v=vs.85).aspx
// http://msdn.microsoft.com/en-us/library/ie/bg183312(v=vs.85).aspx
flow.createTask('icons-tile', () => {
	const sizes = {
		small:  [128, 128],  // Officially:  70 x  70 | Recommended: 128 x 128
		medium: [270, 270],  // Officially: 150 x 150 | Recommended: 270 x 270
		large:  [558, 558],  // Officially: 310 x 310 | Recommended: 558 x 558
		wide:   [558, 270]   // Officially: 310 x 150 | Recommended: 558 x 270
	};

	const streams = [];

	// Foreach each sizes
	for (const name of Object.keys(sizes)) {
		const size = sizes[name];

		/* eslint-disable function-paren-newline */
		streams.push(
			util.assetsProcess(paths.files.iconsTile, (stream) => {

				return stream
					.pipe(gm((gmfile, done) => {
						gmfile.identify((err, info) => {
							if (err) {
								terminal.error(err);
							}

							const file = toolbox.gmOptimization(gmfile.resize(size[0], size[1]), info);

							if (name === 'wide') {
								file.background('transparent').gravity('Center').extent(size[0], size[1]);
							}

							done(null, file);
						});
					}))

					.pipe(rename(util.assetsRename(`tile-${name}`)))

					.pipe(imagemin())
				;
			})
		);
		/* eslint-enable function-paren-newline */
	}

	return toolbox.mergeStreams(streams);
});






//-- Rebuild
flow.createSequence('icons', gulp.parallel('icons-favicon', 'icons-touch', 'icons-icon', 'icons-large', 'icons-tile'), {
	cleanBundle: ({ bundle }) => {
		return [`${paths.dir.root}/${bundle.output.build}/${paths.build.icons}`];
	}
});
