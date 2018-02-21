//-------------------------------------
//-- Watch
//-------------------------------------
'use strict';

const debug = require('gulp-debug');
const gulp  = require('gulp');
const env   = require('../helpers/env');
const paths = require('../helpers/paths');



const createTask = (name, task) => {
	gulp.task(name, () => {
		const start = new Date();
		console.log(`${name} Start`);

		return task().on('end', () => {
			console.log(`/${name} End - [${(new Date() - start) / 1000}s]`);
		});
	});
};



createTask('allo', () => {
	return gulp.src(paths.files.stylesLint)
		.pipe(debug())
	;
});

createTask('bonjour', () => {
	return gulp.src(paths.files.scriptsLint)
		.pipe(debug())
	;
});

createTask('ciao', () => {
	return gulp.src(paths.files.assets)
		.pipe(debug())
	;
});



gulp.task('grouper', () => {
	console.log("Grouper start");

	gulp.series('allo', 'bonjour', 'ciao', () => {
		console.log("/Grouper end");
	})();

});



// gulp-hub

//-- Watch
gulp.task('watch', () => {

	env.setToWatching();

	gulp.watch([paths.files.scripts], gulp.series('grouper'));

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

	console.log('Watching...');

});
