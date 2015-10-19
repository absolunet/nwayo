//-------------------------------------
//-- Icons
//-------------------------------------
'use strict';

//let debug    = require('gulp-debug');
let gulp     = require('gulp');
let gulpif   = require('gulp-if');
let rename   = require('gulp-rename');
let imagemin = require('gulp-imagemin');
let gm       = require('gulp-gm');
let merge    = require('merge-stream');

const PATH = global.nwayo.path;
const Util = global.nwayo.util;




//-- Favicon.ico
// https://mathiasbynens.be/notes/rel-shortcut-icon


//-- Share icons
// https://mathiasbynens.be/notes/touch-icons
// https://developer.apple.com/library/ios/documentation/UserExperience/Conceptual/MobileHIG/IconMatrix.html
// https://developer.chrome.com/multidevice/android/installtohomescreen
// http://operacoast.com/developer
gulp.task('icons-share', () => {
	let sizes = [
		 57,  // For non-Retina (@1× display) iPhone, iPod Touch, and Android 2.1+ devices
		 72,  // For the iPad mini and the first- and second-generation iPad (@1× display) on iOS ≤ 6
		 76,  // For the iPad mini and the first- and second-generation iPad (@1× display) on iOS ≥ 7
		114,  // For iPhone with @2× display running iOS ≤ 6:
		120,  // For iPhone with @2× display running iOS ≥ 7
		144,  // For iPad with @2× display running iOS ≤ 6
		152,  // For iPad with @2× display running iOS ≤ 7
		167,  // For iPad Pro with @2× display running iOS ≤ 9
		180,  // For iPhone 6 Plus with @3× display
		192,  // For Chrome for Android
		228,  // For Coast for iOS
		 64,  // Windows site icons, Safari Reading List, Modern browsers
		 96,  // Google TV Favicon
		195,  // Opera Speed Dial icon
		512   // General share icon
	];

	let streams = [];

	// Foreach each sizes
	for (let size of sizes) {

		streams.push(
			Util.assetsProcess(PATH.files.iconsIcon, stream => {

				return stream
					.pipe( gulpif(size !== 512, gm( (gmfile, done) => {
						gmfile.identify( (err, info) => {
							gmfile = Util.gmOptimization(gmfile.resize(size,size), info);
							done(null, gmfile);
						});
					})))

					.pipe( rename(Util.assetsRename(`icon-${size}`)) )

					.pipe( imagemin(Util.imageminParams) )
				;
			})
		);
	}

	// Large
	streams.push(
		Util.assetsProcess(PATH.files.iconsLarge, stream => {
			return stream
				.pipe( rename(Util.assetsRename('large')))
				.pipe( imagemin(Util.imageminParams) )
			;
		})
	);

	return merge.apply(null, streams).on('end', () => {
		Util.watchableTaskCompleted('Share icons generation');
	});
});


//-- Windows metro tile
// http://msdn.microsoft.com/en-us/library/ie/dn455106(v=vs.85).aspx
// http://msdn.microsoft.com/en-us/library/ie/bg183312(v=vs.85).aspx
gulp.task('icons-tile', () => {
	let sizes = {
		small:  [128, 128],  // Officially:  70 x  70 | Recommended: 128 x 128
		medium: [270, 270],  // Officially: 150 x 150 | Recommended: 270 x 270
		large:  [558, 558],  // Officially: 310 x 310 | Recommended: 558 x 558
		wide:   [558, 270]   // Officially: 310 x 150 | Recommended: 558 x 270
	};

	let streams = [];

	// Foreach each sizes
	for (let name of Object.keys(sizes)) {
		let size = sizes[name];

		streams.push(
			Util.assetsProcess(PATH.files.iconsTile, stream => {

				return stream
					.pipe( gm( (gmfile, done) => {
						gmfile.identify( (err, info) => {

							gmfile = Util.gmOptimization(gmfile.resize(size[0], size[1]), info);

							if (name === 'wide') {
								gmfile.background('transparent').gravity('Center').extent(size[0], size[1]);
							}

							done(null, gmfile);
						});
					}))

					.pipe( rename(Util.assetsRename(`tile-${name}`)) )

					.pipe( imagemin(Util.imageminParams) )
				;
			})
		);
	}

	return merge.apply(null, streams).on('end', () => {
		Util.watchableTaskCompleted('Windows metro tile generation');
	});
});


//-- Rebuild
gulp.task('icons', cb => {
	Util.taskGrouper({ cb,
		tasks:       [['icons-share', 'icons-tile']],
		cleanBundle: (name, bundle) => {
			return [`${bundle.output.build}/${PATH.build.icons}`];
		}
	});
});

