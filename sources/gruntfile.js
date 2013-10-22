module.exports = function(grunt) {
	grunt.log.writeln('\n---- nwayo report -----');

	var
		// flags
		foundation = grunt.file.exists('css/vendor/foundation/foundation.scss'),
		jshtml     = !!(grunt.file.expand('tmpl/**/*.jshtml').length),

		editor     = grunt.file.exists('css/misc/editor.less'),
		newsletter = grunt.file.exists('misc/newsletter.html'),

		theme      = false,



		// Project configuration.
		tasks = {
			default: ['core_js', 'core_css']
		},
		
		config = {
			pkg: grunt.file.readJSON('package.json'),

			nwayo_copy: {},
			imagemin: {},
			'imagemagick-resize': {},
			'imagemagick-convert': {},

			// cleaner
			clean: {
				tmp_css: {
					src: ['.tmp-nwayo/*.css'], options: { force: true }
				},
				tmp_js: {
					src: ['.tmp-nwayo/*.js'], options: { force: true }
				}
			},

			// watcher
			watch: {
				all: {
					files: ['gruntfile.js', 'package.json'],
					tasks: 'default'
				},
			}
		},


		// check list report
		checklist = function(name, found) {
			grunt.log.writeln('['+ ((found) ? 'X' : ' ') +'] '+name);
		},

		// get css static libs
		getCssLibs = function(file) {
			var css = [];

			if (foundation) {
				css = [
					'css/libs/normalize.css',
					'.tmp-nwayo/foundation-scss.css'
				];
			
			} else if (!theme) {
				css = [
					'css/libs/reset.css',
					'css/libs/normalize.css',
					'css/libs/html5boilerplate.css'
				];
			}

			css.push(file);

			return css;
		}
	;

	grunt.loadNpmTasks('grunt-contrib-imagemin');
	grunt.loadNpmTasks('grunt-imagemagick');

	grunt.task.registerMultiTask('nwayo_copy', '', function() {
		for (var i in this.data) {
			grunt.file.copy(this.data[i],i);
		}
	});






	checklist('Has theme?', theme);


	// --------------------------------
	// JS
	// --------------------------------
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-requirejs');


	// js hint
	config.jshint = {
		core: {
			src: ['js/**/*.js', '!libs/**/*.js', '!js/vendor/**/*.js']
		}
	};

	// requirejs
	config.requirejs = {
		core: {
			options: {
				baseUrl:  './',
				name:     'js/core',
				include:  ['js/variants'],
				out:      '../builds/js/core.js',
				optimize: 'uglify', // 'none'
				preserveLicenseComments: false,
				skipModuleInsertion:     true,
				findNestedDependencies:  true,
				pragmasOnSave:           { excludeRequire: true }
			}
		}
	};


	// tasks
	tasks.core_js = [
		'jshint:core',
		'requirejs:core',
		'clean:tmp_js'
	];

	config.watch.core_js = {
		files: [
			'js/**/*.js',
			'libs/**/*.js'
		],
		tasks: 'core_js'
	};



	// --------------------------------
	// CSS
	// --------------------------------
	grunt.loadNpmTasks('grunt-contrib-less');
	grunt.loadNpmTasks('grunt-contrib-cssmin');

	// data-uri images
	config.imagemin.datauri = {
		options: { optimizationLevel:7, progressive:false, interlaced:false, pngquant:true, force:true },
		files: [{
			expand: true,
			cwd: 'assets/data-uri/',
			src: ['**/*.{png,jpg,gif}'],
			dest: '.tmp-nwayo/data-uri/'
		}]
	};


	// less
	config.less = {
		core: { files: { '.tmp-nwayo/core-less.css': 'css/loader.less' } }
	};


	// css
	config.cssmin = {
		core: { files: { '../builds/css/core.css': getCssLibs('.tmp-nwayo/core-less.css') } },
	};


	// task
	tasks.core_css = [
		'imagemin:datauri',
		'less:core',
		'cssmin:core',
		'clean:tmp_css'
	];

	config.watch.core_css = {
		files: [
			'assets/data-uri/**/*.{png,jpg,gif}',
			'css/**/*.css',
			'css/**/*.less',
			'!css/misc/**/*'
		],
		tasks: 'core_css'
	};



	// --------------------------------
	// ICONS
	// --------------------------------
	(function(sizes) {
		tasks.icons = [];

		// apple touch icons
		var applecopytasks = [];

		for (var i in sizes) {
			var size = sizes[i];

			config['imagemagick-resize']['apple-'+size] = {
				from:  'assets/icons/',
				to:    '.tmp-nwayo/icons/apple-'+size+'/',
				files: 'share.png',
				props: { width:size, height:size }
			};

			config.nwayo_copy['apple-'+size] = {};
			config.nwayo_copy['apple-'+size]['../builds/touch-icon-'+size+'.png'] = '.tmp-nwayo/icons/apple-'+size+'/share.png';

			tasks.icons.push('imagemagick-resize:apple-'+size);
			applecopytasks.push('nwayo_copy:apple-'+size);
		}

		config.imagemin.icons_apple = {
			options: { optimizationLevel:7, progressive:false, interlaced:false, pngquant:true, force:true },
			files: [{
				expand: true,
				cwd: '.tmp-nwayo/icons/',
				src: ['**/*.{png,jpg,gif}'],
				dest: '.tmp-nwayo/icons/'
			}]
		};
		tasks.icons.push('imagemin:icons_apple');
		tasks.icons = tasks.icons.concat(applecopytasks);


		// share
		config.imagemin.icons_share = {
			options: { optimizationLevel:7, progressive:false, interlaced:false, pngquant:true, force:true },
			files: {'../builds/share-icon.png' : 'assets/icons/share.png'}
		};
		tasks.icons.push('imagemin:icons_share');


		// favicon
		config['imagemagick-convert'].favicon = {
			args: ['assets/icons/favicon.png', '../builds/favicon.ico']
		};
		tasks.icons.push('imagemagick-convert:favicon');


		// tasks
		config.watch.icons = {
			files: ['assets/icons/**/*.png'],
			tasks: 'icons'
		};

		config.clean.tmp_icons = { src: ['.tmp-nwayo/icons'], options: { force: true }};
		tasks.icons.push('clean:tmp_icons');

	})([57,72,76,114,120,144,152]);





	
	// --------------------------------
	// IMAGES
	// --------------------------------

	// clean up dir

	config.imagemin.images = {
		options: { optimizationLevel:7, progressive:false, interlaced:false, pngquant:true, force:true },
		files: [{
			expand: true,
			cwd: 'assets/images/',
			src: ['**/*.{png,jpg,gif}'],
			dest: '../builds/images/'
		}]
	};

	config.watch.images_images = {
		files: [ 'assets/images/**/*.{png,jpg,gif}'],
		tasks: 'imagemin:images'
	};

	tasks.default.push('imagemin:images');



	// --------------------------------
	// FOUNDATION
	// --------------------------------
	checklist('Foundation', foundation);

	if (foundation) {

		grunt.loadNpmTasks('grunt-contrib-sass');

		config.sass = {
			foundation: { files: { '.tmp-nwayo/foundation-scss.css': 'css/vendor/foundation/foundation.scss' } },
		};

		tasks.core_css.unshift('sass:foundation');

		config.watch.core_css.files.push('css/**/*.scss');
	}





	// --------------------------------
	// JSHTML
	// --------------------------------
	checklist('JSRender templates', jshtml);

	if (jshtml) {
		grunt.loadNpmTasks('grunt-template-client');
		
		config.templateclient = {
			core: {
				options: {
					variable: 'nwayo_jshtml',
					prefix: 'window.kafe.dependencies.jQuery.templates(',
					suffix: ')'
				},
				src: ['tmpl/**/*.jshtml'],
				dest: '.tmp-nwayo/templateclient.js'
			}
		};

		tasks.core_js.unshift('templateclient:core');

		config.watch.core_js.files.push('tmpl/**/*.jshtml');
	}



	// --------------------------------
	// EDITOR
	// --------------------------------
	checklist('Editor styles', editor);

	if (editor) {
		config.less.editor   = { files: { '.tmp-nwayo/editor-less.css': 'css/misc/editor.less' } };
		config.cssmin.editor = { files: { '../builds/css/editor.css': getCssLibs('.tmp-nwayo/editor-less.css') }, };

		tasks.editor = [
			'less:editor',
			'cssmin:editor',
			'clean:tmp_css'
		];

		tasks.core_css.push('editor');

		config.watch.editor = {
			files: ['css/misc/editor.less'],
			tasks: 'editor'
		};
	}



	// --------------------------------
	// NEWSLETTER
	// --------------------------------
	checklist('Static newsletter', newsletter);

	if (newsletter) {
		grunt.loadNpmTasks('grunt-inline-css');

		config.less.newsletter = { files: { '.tmp-nwayo/newsletter-less.css': 'css/misc/newsletter.less' } };
		config.inlinecss = { newsletter: {
			files: { '../builds/misc/newsletter.html': 'misc/newsletter.html' }
		}};

		tasks.newsletter = [
			'less:newsletter',
			'inlinecss:newsletter',
			'clean:tmp_css'
		];

		tasks.core_css.push('newsletter');

		config.watch.newsletter = {
			files: ['css/misc/newsletter.less','misc/newsletter.html'],
			tasks: 'newsletter'
		};
	}








	// --------------------------------
	// GRUNT
	// --------------------------------
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-watch');

	grunt.initConfig(config);

	// tasks
	for (var name in tasks) {
		grunt.registerTask(name, tasks[name]);
	}

	grunt.log.writeln('-----------------------\n');
};

