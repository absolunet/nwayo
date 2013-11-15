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
			nwayo_delete: {
				tmp:   { path:tmp },
				build: { path:out_build }
			},
			nwayo_process: {},
			watch:        { all: { files: ['gruntfile.js', 'package.json'], tasks: 'default' } }
		},

		processTmpl = function(src,keepers,type) {
			var delimeters = {
				cssjs: ['/* {{','}} */'],
				html:  ['<!-- {{','}} -->']
			};

			for (var i in keepers) {
				src = src.replace( new RegExp(delimeters[type][0]+'/?'+keepers[i]+delimeters[type][1],'g') ,'');
			}

			var	parts = src.split(new RegExp(delimeters[type][0]+'/?[a-z0-9]+'+delimeters[type][1],'g'));
			for (var j=1; j<parts.length; j=j+2) {
				parts[j] = '';
			}

			return parts.join('');
		}
	;
//	grunt.file.write(skeleton+'/'+dir[i]+'/.gitignore', '', { force:true });

	grunt.template.addDelimiters('jscsscomment', '/* {%', '%} */');
	grunt.template.addDelimiters('htmlcomment', '<!-- {%', '%} -->');

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

	grunt.task.registerMultiTask('nwayo_process', '', function() {
		for (var i in this.data) {
			grunt.file.write(this.data[i].src, processTmpl(grunt.file.read(this.data[i].src), this.data[i].keepers.toUpperCase(), this.data[i].type), {force:true});
		}
	});




	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-markdown');
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




	for (var id in flavours) {
		var
			data  = flavours[id],
			local = tmp+'/'+id,
			out   = out_build+'/'+id,
			flags = []
		;

		if (data.drupal)     { flags.push('drupal'); }
		if (data.magento)    { flags.push('magento'); }
		if (data.sitecore)   { flags.push('sitecore'); }
		if (data.theme)      { flags.push('theme'); }
		if (data.foundation) {
			flags.push('foundation','responsive');
		} else {
			flags.push('static');
		}

		// copy skeleton
		config.copy['tmp_'+id] = {
			expand: true,
			cwd:    skeleton+'/',
			src:    ['**/*','**/.gitignore'],
			dest:   tmp+'/'+id+'/',
			filter: 'isFile'
		};


		// process this flavour
		config.nwayo_process['flavour_'+id] = [
			{
				src:     out+'/index.html',
				keepers: flags,
				type:    'html'
			}
		];


		// copy to build
		config.copy['build_'+id] = {
			expand: true,
			cwd:    local+'/',
			src:    ['**/*','**/.gitignore'],
			dest:   out+'/',
			filter: 'isFile'
		};


		tasks['flavour_'+id] = ['copy:tmp_'+id, 'copy:build_'+id];

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
