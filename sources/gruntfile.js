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

			// cleaner
			clean: {
				builds_tmp: {
					src: ['../assets/builds/*.tmp.*'],
					options: {
						force: true
					}
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
					'../assets/builds/foundation-scss.tmp.css'
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
				out:      '../assets/builds/core.js',
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
		'clean:builds_tmp'
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


	// less
	config.less = {
		core: { files: { '../assets/builds/core-less.tmp.css': 'css/loader.less' } }
	};


	// css
	config.cssmin = {
		core: { files: { '../assets/builds/core.css': getCssLibs('../assets/builds/core-less.tmp.css') } },
	};


	// task
	tasks.core_css = [
		'less:core',
		'cssmin:core',
		'clean:builds_tmp'
	];

	config.watch.core_css = {
		files: [
			'css/**/*.css',
			'css/**/*.less',
			'!css/misc/**/*'
		],
		tasks: 'core_css'
	};




	// --------------------------------
	// FOUNDATION
	// --------------------------------
	checklist('Foundation', foundation);

	if (foundation) {

		grunt.loadNpmTasks('grunt-contrib-sass');

		config.sass = {
			foundation: { files: { '../assets/builds/foundation-scss.tmp.css': 'css/vendor/foundation/foundation.scss' } },
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
				dest: '../assets/builds/templateclient.tmp.js'
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
		config.less.editor   = { files: { '../assets/builds/editor-less.tmp.css': 'css/misc/editor.less' } };
		config.cssmin.editor = { files: { '../assets/builds/editor.css': getCssLibs('../assets/builds/editor-less.tmp.css') }, };

		grunt.registerTask('editor', [
			'less:editor',
			'cssmin:editor',
			'clean:builds_tmp'
		]);

		tasks.default.push('editor');

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

		config.less.newsletter = { files: { '../assets/builds/newsletter-less.tmp.css': 'css/misc/newsletter.less' } };
		config.inlinecss = { newsletter: {
			files: { '../assets/builds/newsletter.html': 'misc/newsletter.html' }
		}};


		tasks.newsletter = [
			'less:newsletter',
			'inlinecss:newsletter',
			'clean:builds_tmp'
		];

		tasks.default.push('newsletter');

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

