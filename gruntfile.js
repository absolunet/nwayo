module.exports = function(grunt) {
	var
		src        = 'src',
		tmp        = src+'/.tmp-nwayo',
		skeleton   = tmp+'/skeleton',
		src_tmpl   = src+'/tmpl',
		src_nwayo  = src+'/nwayo',
		out_root   = './',
		out_build  = 'build',
		out_doc    = 'doc',


		tasks = { default:[] },
		
		flavours = grunt.file.readJSON(src_nwayo+'/flavours.json'),



		config = {
			pkg: grunt.file.readJSON('package.json'),

			requirejs:    {},
			jshint:       {},
			markdown:     {},
			less:         {},
			cssmin:       {},
			copy:         {},
			preprocess:   {},
			nwayo_delete: {
				tmp:   { path:tmp },
				build: { path:out_build }
			},
			watch:        { all: { files: ['gruntfile.js', 'package.json'], tasks: 'default' } }
		}
	;

	grunt.task.registerTask('nwayo_createtree', '', function(id) {
		(function(dir) { for (var i in dir) {
			grunt.file.write(skeleton+'/'+dir[i]+'/.gitignore', '', { force:true });
		}})([
			'builds',
			'stubs',
			'sources/assets/data-uri',
			'sources/assets/fonts',
			'sources/assets/images',
			'sources/assets/images/vendor',
			'sources/css/vendor/',
			'sources/js/vendor/',
			'sources/libs/',
			'sources/tmpl/'
		]);
	});

	grunt.task.registerMultiTask('nwayo_delete', '', function() {
		grunt.log.writeln('Deleting '+this.data.path);
		grunt.file.delete(this.data.path, {force:true});
	});





	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-markdown');
	grunt.loadNpmTasks('grunt-preprocess');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-requirejs');
	grunt.loadNpmTasks('grunt-contrib-less');
	grunt.loadNpmTasks('grunt-contrib-cssmin');




// get foundatino from github





	// Build nwayo
	config.copy.skeleton = {files: [
		// static
		{
			expand: true,
			cwd:    src_nwayo+'/',
			src:    ['css/**/*','js/**/*','misc/**/*'],
			dest:   skeleton+'/sources/',
			filter: 'isFile'
		},
		// icons
		{
			expand: true,
			cwd:    src_nwayo+'/icons',
			src:    '**',
			dest:   skeleton+'/sources/assets/icons/',
			filter: 'isFile'
		},
		// examples
		{
			expand: true,
			cwd:    src_nwayo+'/examples',
			src:    '**',
			dest:   skeleton+'/',
			filter: 'isFile'
		},
		// grunt
		{
			expand: true,
			cwd:    src_nwayo+'/grunt',
			src:    ['*','.gitignore'],
			dest:   skeleton+'/sources/',
			filter: 'isFile'
		}
	]};

	tasks.skeleton = ['nwayo_delete:build', 'nwayo_delete:tmp', 'copy:skeleton', 'nwayo_createtree'];
	tasks.default.push('skeleton');



	flavours = {basic: flavours.basic};

	for (var id in flavours) {
		var
			data  = flavours[id],
			local = tmp+'/'+id,
			out   = out_build+'/'+id
		;

		data.responsive = (data.foundation);

		// copy skeleton
		config.copy['tmp_'+id] = {
			expand: true,
			cwd:    skeleton+'/',
			src:    ['**/*','**/.gitignore'],
			dest:   local+'/',
			filter: 'isFile'
		};


		// process this flavour
		config.preprocess['flavour_'+id] = {
			options: { context:data, inline:true },
			src:     [local+'**/*.*']
		};


		// copy to build
		config.copy['build_'+id] = {
			expand: true,
			cwd:    local+'/',
			src:    ['**/*','**/.gitignore'],
			dest:   out+'/',
			filter: 'isFile'
		};


		tasks['flavour_'+id] = ['copy:tmp_'+id, 'preprocess:flavour_'+id, 'copy:build_'+id];

		tasks.default.push('flavour_'+id);
	}


	tasks.default.push('nwayo_delete:tmp');


	// --------------------------------
	// GRUNT
	// --------------------------------
	grunt.initConfig(config);

	// tasks
	for (var name in tasks) {
		grunt.registerTask(name, tasks[name]);
	}
};
