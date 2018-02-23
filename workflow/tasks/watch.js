//-------------------------------------
//-- Watch
//-------------------------------------
'use strict';

// const debug    = require('gulp-debug');
const gulp       = require('gulp');
const requireDir = require('require-dir');
const env        = require('../helpers/env');
const flow       = require('../helpers/flow');
const paths      = require('../helpers/paths');

requireDir(paths.workflow.tasks);






//-- Watch
gulp.task('watch', () => {

	env.setToWatching();

	// Assets
	//	gulp.watch([paths.files.fonts],  flow.watcherSequence('assets-fonts'));
	//	gulp.watch([paths.files.images], flow.watcherSequence('assets-images'));
	//	gulp.watch([paths.files.raw],    flow.watcherSequence('assets-raw'));

	// Icons
	flow.watchSequence([paths.files.iconsFavicon], ['icons-favicon']);
	flow.watchSequence([paths.files.iconsTouch],   ['icons-touch']);
	//gulp.watch([paths.files.iconsIcon],    ['icons-icon']);
	//gulp.watch([paths.files.iconsLarge],   ['icons-large']);
	//gulp.watch([paths.files.iconsTile],    ['icons-tile']);

	// Scripts
	//	gulp.watch([paths.files.bundles, paths.files.scripts, paths.files.templates, paths.files.bowerScripts], flow.watcherSequence('scripts-compile'));
	//
	//	// Styles
	//	gulp.watch([paths.files.inline],                      flow.watcherSequence('styles-images', 'styles-compile'));
	//	gulp.watch([paths.files.bundles, paths.files.styles], flow.watcherSequence('styles-compile'));

	flow.startWatchSpinner('Watching...');
});
