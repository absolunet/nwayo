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
	flow.watchSequence('Fonts copy',        [paths.files.fonts],  gulp.series('assets-fonts'));
	flow.watchSequence('Images generation', [paths.files.images], gulp.series('assets-images'));
	flow.watchSequence('Raw copy',          [paths.files.raw],    gulp.series('assets-raw'));

	// Icons
	flow.watchSequence('Favicon generation',           [paths.files.iconsFavicon], gulp.series('icons-favicon'));
	flow.watchSequence('iOS icons generation',         [paths.files.iconsTouch],   gulp.series('icons-touch'));
	flow.watchSequence('Share icons generation',       [paths.files.iconsIcon],    gulp.series('icons-icon'));
	flow.watchSequence('Large share image generation', [paths.files.iconsLarge],   gulp.series('icons-large'));
	flow.watchSequence('Windows tiles generation',     [paths.files.iconsTile],    gulp.series('icons-tile'));

	// Scripts
	flow.watchSequence(
		'Scripts generation',
		[
			paths.files.scripts,
			paths.files.templates,
			paths.files.bowerScripts
		],
		gulp.series('scripts-compile')
	);

	// Styles
	flow.watchSequence('Styles generation',                    [paths.files.styles], gulp.series('styles-compile'));
	flow.watchSequence('Styles generation with inline images', [paths.files.inline], gulp.series('styles-images', 'styles-compile'));


	flow.startWatchSpinner();
});
