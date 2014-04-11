module.exports = function(grunt) {
	grunt.log.writeln('\n\n');

	var
		tmp    = '.tmp-nwayo',
		builds = '../builds',
		assets = 'assets',
		line   = Array(80).join('-'),

		// flags
		foundation = grunt.file.exists('css/foundation.scss'),
		jshtml     = !!(grunt.file.expand('tmpl/**/*.jshtml').length),

		editor     = grunt.file.exists('css/misc/editor.less'),
		staticHtml = !!(grunt.file.expand('misc/static/**/*.html').length),

		theme      = false,



		// Project configuration.
		tasks = {
			default: [],
			rebuild: ['default'],
			report:  ['nwayo_report']
		},
		
		config = {
			pkg: grunt.file.readJSON('package.json'),

			includes: {
				options: {
					includeRegexp:  /^\s*\/\/\s@import\s'([^']+)'\s*$/,
					duplicates:     false,
					filenameSuffix: '.js'
				}
			},
			uglify: {
				options: {
					preserveComments:'some',
					compress: {
						global_defs: {
							DEBUG:false
						}
					}
				}
			},
			jshint:                {},
			templateclient:        {},
			less:                  {},
			sass:                  {},
			svgmin:                {},
			svg2png:               {},
			cssmin:                {},
			imagemin:              {},
			copy:                  {},
			inlinecss:             {},
			nwayo_copy:            {},
			'imagemagick-resize':  {},
			'imagemagick-convert': {},

			// cleaner
			clean: {
				tmp_css: { src: [tmp+'/*.css'], options: { force:true } },
				tmp_js:  { src: [tmp+'/*.js'],  options: { force:true } },
				builds:  { src: [builds+'/*'],  options: { force:true } }
			},

			// watcher
			watch: {
				all: {
					files: ['gruntfile.js', 'package.json'],
					tasks: 'default'
				}
			}
		},


		// check list report
		checklist = [],

		// get css static libs
		getCssLibs = function(file) {
			var css = [];

			if (foundation) {
				css = [
					'css/libs/normalize.css',
					tmp+'/foundation-scss.css'
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



	// grunt general modules
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-imagemin');
	grunt.loadNpmTasks('grunt-imagemagick');
	grunt.loadNpmTasks('grunt-svg2png');
	grunt.loadNpmTasks('grunt-svgmin');


	// grunt custom tasks
	grunt.task.registerMultiTask('nwayo_copy', '', function() {
		for (var i in this.data.files) {
			grunt.log.writeln('Copying '+this.data.files[i].src+'\nto      '+this.data.files[i].dest);
			grunt.file.copy(this.data.files[i].src, this.data.files[i].dest);
		}
	});

	grunt.task.registerTask('nwayo_report', '', function() {
		grunt.log.subhead(line+'\n NWAYO\n'+line);
		for (var i in checklist) {
			grunt.log.writeln(' '+ ((checklist[i][1]) ? '✔' : ' ') +'  '+checklist[i][0]);
		}

		grunt.log.subhead(' Available tasks');
		for (var name in tasks) {
			grunt.log.writeln(' •  '+name);
		}
	});

	grunt.task.registerTask('nwayo_loghead', '', function(title) {
		grunt.log.subhead('\n\n'+line+'\n '+title.toUpperCase()+'\n'+line);
	});

	grunt.task.registerTask('nwayo_mkdir', '', function() {
		grunt.file.mkdir(tmp+'/images/');
	});


	checklist.push(['Has theme?',theme]);




	// --------------------------------
	// JS
	// --------------------------------
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-includes');
	grunt.loadNpmTasks('grunt-contrib-uglify');

	// js hint
	config.jshint.core = {
		src: ['js/**/*.js', '!libs/**/*.js', '!js/vendor/**/*.js'],
		options: {
			//'-W061': true   // eval can be harmful
		}
	};

	// includes js
	config.includes.core = {
		options: { includePath: './' },
		files: [{
			src: 'js/bundle_core.js',
			dest: tmp+'/core.js'
		}]
	};
	config.uglify.core = { files: [{
		src:  tmp+'/core.js',
		dest: builds+'/js/core.js'
	}]};


	// tasks
	tasks.core_js = [
		'jshint:core',
		'includes:core',
		'uglify:core',
		'clean:tmp_js'
	];
	tasks.default.push('core_js');

	config.watch.core_js = {
		files: [
			'js/**/*.js',
			'libs/**/*.js'
		],
		tasks: 'core_js'
	};


	// polyfill
	config.uglify.polyfill = { files: [
		{
			src:  [
				'js/vendor/polyfill/html5shiv-printshiv.js',
				'js/vendor/polyfill/nwmatcher.js',
				'js/vendor/polyfill/selectivizr.js',
				'js/vendor/polyfill/respond.js',
			],
			dest: builds+'/js/polyfill-oldie-top.js'
		},
		{
			src:  [
				'js/vendor/polyfill/rem.js'
			],
			dest: builds+'/js/polyfill-oldie-bottom.js'
		}
	]};

	tasks.polyfill_js = ['uglify:polyfill'];
	config.watch.polyfill_js = {
		files: [ 'js/vendor/polyfill/**/*.js' ],
		tasks: 'polyfill_js'
	};
	tasks.default.push('polyfill_js');



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
			cwd: assets+'/data-uri/',
			src: ['**/*.{png,jpg,gif}'],
			dest: tmp+'/data-uri/'
		}]
	};

	config.svgmin.datauri = {
		expand: true,
		cwd:    assets+'/data-uri/',
		src:    '**/*.svg',
		dest:   tmp+'/data-uri/',
		filter: 'isFile'
	};

	
	config.svg2png.datauri = { files: [{ src:assets+'/data-uri/**/*.svg', dest:builds+'/imgdata/' }] };

	config.imagemin.datauri_fallback = {
		options: { optimizationLevel:7, progressive:false, interlaced:false, pngquant:true, force:true },
		files: [{
			expand: true,
			cwd: builds+'/imgdata/',
			src: ['**/*.png'],
			dest: builds+'/imgdata/'
		}]
	};


	// less
	config.less.core = { files: [
		{ src:'css/loader.less', dest:tmp+'/core-less.css' }
	]};

	// css
	config.cssmin.core = { files: [
		{ src: getCssLibs(tmp+'/core-less.css'), dest: builds+'/css/core.css' }
	]};




	// task
	tasks.core_css = [
		'imagemin:datauri',
		'svgmin:datauri',
		'svg2png:datauri',
		'imagemin:datauri_fallback',
		'less:core',
		'cssmin:core',
		'clean:tmp_css'
	];
	tasks.default.push('core_css');

	config.watch.core_css = {
		files: [
			assets+'/data-uri/**/*.{png,jpg,gif,svg}',
			'css/**/*.css',
			'css/**/*.less',
			'!css/misc/**/*'
		],
		tasks: 'core_css'
	};



	// --------------------------------
	// FOUNDATION
	// --------------------------------
	checklist.push(['Foundation',foundation]);

	if (foundation) {

		grunt.loadNpmTasks('grunt-contrib-sass');

		config.sass.foundation = { files: [{
			src:  'css/foundation.scss',
			dest: tmp+'/foundation-scss.css'
		}]};

		tasks.core_css.unshift('sass:foundation');

		config.watch.core_css.files.push('css/**/*.scss');
	}



	// --------------------------------
	// JSHTML
	// --------------------------------
	checklist.push(['JSRender templates',jshtml]);

	if (jshtml) {
		grunt.loadNpmTasks('grunt-template-client');
		
		config.templateclient.core = {
			options: {
				variable: 'nwayo_jshtml',
				prefix: '$.templates(',
				suffix: ')'
			},
			src: ['tmpl/**/*.jshtml'],
			dest: tmp+'/templateclient.js'
		};

		tasks.core_js.unshift('templateclient:core');

		config.watch.core_js.files.push('tmpl/**/*.jshtml');
	}



	// --------------------------------
	// EDITOR
	// --------------------------------
	checklist.push(['Editor styles',editor]);

	if (editor) {
		config.less.editor = { files: [{
			src:  'css/misc/editor.less',
			dest: tmp+'/editor-less.css'
		}]};

		config.cssmin.editor = { files: [{
			src:  getCssLibs(tmp+'/editor-less.css'),
			dest: builds+'/css/editor.css'
		}]};

		tasks.editor = [
			'nwayo_loghead:editor styles',
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
	// RAW
	// --------------------------------
	config.copy.raw = {
		expand: true,
		cwd:    assets+'/raw/',
		src:    '**',
		dest:   builds+'/raw/',
		filter: 'isFile'
	};

	tasks.raw = [
		'nwayo_loghead:raw',
		'copy:raw'
	];
	tasks.rebuild.push('raw');

	config.watch.raw = {
		files: [assets+'/raw/**/*'],
		tasks: 'raw'
	};




	// --------------------------------
	// IMAGES
	// --------------------------------
	config.svgmin.options = { plugins: [{
		removeViewBox: false // ie scaling
	}]};

	config.copy.svg = {
		expand: true,
		cwd:    assets+'/images/',
		src:    '**/*.svg',
		dest:   tmp+'/svg/',
		filter: 'isFile'
	};
	config.svgmin.images = {
		expand: true,
		cwd:    tmp+'/svg/',
		src:    '**/*.svg',
		dest:   builds+'/images/',
		filter: 'isFile'
	};

	
	config.svg2png.images = { files: [{ src:tmp+'/svg/**/*.svg' }] };

	(function(images) {
		tasks.images_2x = ['nwayo_mkdir'];
		for (var i in images) {
			config['imagemagick-convert'][images[i]] = {
				args:[images[i],'-resize', '50%', images[i].replace('@2x.','.').replace(assets,tmp)]
			};
			tasks.images_2x.push('imagemagick-convert:'+images[i]);
		}
	})(grunt.file.expand(assets+'/images/**/*@2x.*'));

	config.imagemin.images = {
		options: { optimizationLevel:7, progressive:false, interlaced:false, pngquant:true, force:true },
		files: [
			{
				expand: true,
				cwd: assets+'/images/',
				src: ['**/*.{png,jpg,gif}'],
				dest: builds+'/images/'
			},
			{
				expand: true,
				cwd: tmp+'/svg/',
				src: ['**/*.png'],
				dest: builds+'/images/'
			},
			{
				expand: true,
				cwd: tmp+'/images/',
				src: ['**/*.{png,jpg,gif}'],
				dest: builds+'/images/'
			},
		]
	};



	config.clean.svg = { src: [tmp+'/svg', tmp+'/images'],  options: { force:true }};

	tasks.images = [
		'nwayo_loghead:image optimization',
		'copy:svg',
		'svgmin:images',
		'svg2png:images',
		'images_2x',
		'imagemin:images',
		'clean:svg'
	];
	tasks.rebuild.push('images');

	config.watch.images = {
		files: [ assets+'/images/**/*.{png,jpg,gif,svg}'],
		tasks: 'images'
	};


	// --------------------------------
	// ICONS
	// --------------------------------
	(function(sizes) {
		tasks.icons = ['nwayo_loghead:icons'];

		// apple touch icons
		var applecopytasks = [];

		for (var i in sizes) {
			var size = sizes[i];

			config['imagemagick-resize']['apple-'+size] = {
				from:  assets+'/icons/',
				to:    tmp+'/icons/apple-'+size+'/',
				files: 'share.png',
				props: { width:size, height:size }
			};

			config.nwayo_copy['apple-'+size] = { files: [{
				src:  tmp+'/icons/apple-'+size+'/share.png',
				dest: builds+'/touch-icon-'+size+'.png'
			}]};

			tasks.icons.push('imagemagick-resize:apple-'+size);
			applecopytasks.push('nwayo_copy:apple-'+size);
		}

		config.imagemin.icons_apple = {
			options: { optimizationLevel:7, progressive:false, interlaced:false, pngquant:true, force:true },
			files: [{
				expand: true,
				cwd: tmp+'/icons/',
				src: ['**/*.{png,jpg,gif}'],
				dest: tmp+'/icons/'
			}]
		};
		tasks.icons.push('imagemin:icons_apple');
		tasks.icons = tasks.icons.concat(applecopytasks);


		// share
		config.imagemin.icons_share = {
			options: { optimizationLevel:7, progressive:false, interlaced:false, pngquant:true, force:true },
			files: [{
				src:  assets+'/icons/share.png',
				dest: builds+'/share-icon.png'
			}]
		};
		tasks.icons.push('imagemin:icons_share');


		// favicon
		config['imagemagick-convert'].favicon = {
			args: [assets+'/icons/favicon.png', '(', '-clone', '0', '-resize', '16x16', ')', '(', '-clone', '0', '-resize', '32x32', ')', '-delete', '0', builds+'/favicon.ico']
		};

		tasks.icons.push('imagemagick-convert:favicon');


		// grunt
		config.clean.tmp_icons = { src: [tmp+'/icons'], options: { force: true }};
		tasks.icons.push('clean:tmp_icons');

		tasks.rebuild.push('icons');

		config.watch.icons = {
			files: [assets+'/icons/**/*.png'],
			tasks: 'icons'
		};

	})([57,72,76,114,120,144,152]);



	// --------------------------------
	// HTML STATIC
	// --------------------------------
	checklist.push(['Static HTML',staticHtml]);

	if (staticHtml) {
		grunt.loadNpmTasks('grunt-inline-css');

		config.less.static_html = { files: [{
			expand: true,
			cwd: 'css/misc/static/',
			src: ['**/*.less'],
			dest: tmp+'/',
			ext: '-less.css'
		}]};
		
		config.inlinecss.static_html = { files: [{
			expand: true,
			cwd: 'misc/static/',
			src: ['**/*.html'],
			dest: builds+'/static/'
		}]};

		tasks.static_html = [
			'nwayo_loghead:static html',
			'less:static_html',
			'inlinecss:static_html',
			'clean:tmp_css'
		];

		tasks.rebuild.push('static_html');

		config.watch.static_html = {
			files: ['css/misc/static/**/*.less','misc/static/**/*.html'],
			tasks: 'static_html'
		};
	}








	// --------------------------------
	// GRUNT
	// --------------------------------
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-watch');

	tasks.core_css.unshift('nwayo_loghead:css');
	tasks.core_js.unshift('nwayo_loghead:js');
	tasks.rebuild.unshift('nwayo_loghead:rebuilding site','clean:builds');

	grunt.initConfig(config);

	// tasks
	for (var name in tasks) {
		grunt.registerTask(name, tasks[name]);
	}
};