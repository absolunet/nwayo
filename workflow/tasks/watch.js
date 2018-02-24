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
const terminal   = require('../helpers/terminal');

requireDir(paths.workflow.tasks);






//-- Watch
gulp.task('watch', () => {

	env.setToWatching();

	// Assets
	// flow.watchSequence([paths.files.fonts],  gulp.series('assets-fonts'));
	// flow.watchSequence([paths.files.images], gulp.series('assets-images'));
	// flow.watchSequence([paths.files.raw],    gulp.series('assets-raw'));

	// Icons
	flow.watchSequence([paths.files.iconsFavicon], gulp.series('icons-favicon'));
	flow.watchSequence([paths.files.iconsTouch],   gulp.series('icons-touch'));
	flow.watchSequence([paths.files.iconsIcon],    gulp.series('icons-icon'));
	flow.watchSequence([paths.files.iconsLarge],   gulp.series('icons-large'));
	flow.watchSequence([paths.files.iconsTile],    gulp.series('icons-tile'));

	// Scripts
	// flow.watchSequence([paths.files.bundles, paths.files.scripts, paths.files.templates, paths.files.bowerScripts], gulp.series('scripts-compile'));

	// Styles
	// flow.watchSequence([paths.files.inline],                      gulp.series('styles-images', 'styles-compile'));
	// flow.watchSequence([paths.files.bundles, paths.files.styles], gulp.series('styles-compile'));

	terminal.spacer();
	flow.startWatchSpinner();
});
