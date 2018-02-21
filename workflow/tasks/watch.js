//-------------------------------------
//-- Watch
//-------------------------------------
'use strict';

const debug    = require('gulp-debug');
const gulp     = require('gulp');
const terminal = require('@absolunet/terminal');
const env      = require('../helpers/env');
const flow     = require('../helpers/flow');
const paths    = require('../helpers/paths');






flow.createTask('allo', () => {
	return gulp.src(paths.files.stylesLint)
		.pipe(debug())
	;
});

flow.createTask('bonjour', () => {
	return gulp.src(paths.files.scriptsLint)
		.pipe(debug())
	;
});

flow.createTask('ciao', () => {
	return gulp.src(paths.files.fonts)
		.pipe(debug())
	;
});

flow.createSequence('grouper',  gulp.series('allo', 'bonjour'), 'ciao');
flow.createSequence('grouper2', gulp.parallel('allo', 'bonjour'), 'ciao');




//-- Watch
gulp.task('watch', () => {

	env.setToWatching();

	gulp.watch([paths.files.scripts], gulp.series('grouper2'));

	//	// Assets
	//	gulp.watch([paths.files.fonts],  ['assets-fonts']);
	//	gulp.watch([paths.files.images], ['assets-images']);
	//	gulp.watch([paths.files.raw],    ['assets-raw']);
	//
	//	// Icons
	//	gulp.watch([paths.files.iconsFavicon],                      ['icons-favicon']);
	//	gulp.watch([paths.files.iconsIcon, paths.files.iconsLarge], ['icons-share']);
	//	gulp.watch([paths.files.iconsTile],                         ['icons-tile']);
	//
	//	// Scripts
	//	gulp.watch([paths.files.bundles, paths.files.scripts, paths.files.templates, paths.files.bowerScripts], ['scripts-compile']);
	//
	//	// Styles
	//	gulp.watch([paths.files.inline],                      ['styles-images', 'styles-compile']);
	//	gulp.watch([paths.files.bundles, paths.files.styles], ['styles-compile']);

	terminal.echo('Watching...');

});
