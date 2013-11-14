module.exports = function(grunt) {
	var
		src        = 'src',
		tmp        = src+'/.tmp-nwayo',
		src_tmpl   = src+'/tmpl',
		src_nwayo  = src+'/nwayo',
		out_root   = './',
		out_build  = 'build',
		out_doc    = 'doc',


		tasks = { default:[/*'doc'*/] },
		
		flavours = {
			'basic':               {},
//			'basic-foundation':    { theme:true },
//			'drupal-basic':        { drupal:true },
//			'drupal-foundation':   { drupal:true, foundation:true },
//			'drupal-theme':        { drupal:true, theme:true },
//			'magento-basic':       { magento:true },
//			'magento-foundation':  { magento:true, foundation:true },
//			'magento-theme':       { magento:true, theme:true },
//			'sitecore-basic':      { sitecore:true },
//			'sitecore-foundation': { sitecore:true, foundation:true }
		},

		config = {
			pkg: grunt.file.readJSON('package.json'),

			requirejs: {},
			jshint:    {},
			markdown:  {},
			less:      {},
			cssmin:    {},
			copy:      {},
			clean:     { build:{src: [out_build+'/**/*'],  options: { force:true }} },
			watch:     { all: { files: ['gruntfile.js', 'package.json'], tasks: 'default' } }
		},

		processReadme = function(src,keep,remove) {
			var	parts = src.split(new RegExp("{{/?"+remove+"}}",'g'));
			for (var i=1; i<parts.length; i=i+2) {
				parts[i] = '';
			}
			return parts.join('').replace(new RegExp("{{/?"+keep+"}}",'g'),'');
		}
	;

	grunt.template.addDelimiters('jscsscomment', '/* {%', '%} */');
	grunt.template.addDelimiters('htmlcomment', '<!-- {%', '%} -->');

	grunt.task.registerTask('nwayo_createdir', '', function(id) {
		(function(dir) { for (var i in dir) {
			grunt.file.write(out_build+'/'+id+'/'+dir[i]+'/.gitignore', '', { force:true });
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



	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-markdown');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-requirejs');
	grunt.loadNpmTasks('grunt-contrib-less');
	grunt.loadNpmTasks('grunt-contrib-cssmin');








	for (var id in flavours) {
		var
			data = flavours[id],
			out  = out_build+'/'+id
		;

		// Delete build
		config.clean[id] = { build:{src: [out+'/**/*'],  options: { force:true }} };

		// Build nwayo
		config.copy[id] = {files: [
			// static
			{
				expand: true,
				cwd:    src_nwayo+'/',
				src:    ['css/**/*','js/**/*','misc/**/*'],
				dest:   out+'/sources/',
				filter: 'isFile'
			},
			// icons
			{
				expand: true,
				cwd:    src_nwayo+'/icons',
				src:    '**',
				dest:   out+'/sources/assets/icons/',
				filter: 'isFile'
			},
			// examples
			{
				expand: true,
				cwd:    src_nwayo+'/examples',
				src:    '**',
				dest:   out+'/',
				filter: 'isFile'
			},
			// grunt
			{
				expand: true,
				cwd:    src_nwayo+'/grunt',
				src:    ['*','.gitignore'],
				dest:   out+'/sources/',
				filter: 'isFile'
			}
		]};


		tasks['flavour_'+id] = ['clean:'+id, 'copy:'+id, 'nwayo_createdir:'+id];

		grunt.log.writeln(out+'/**');

		tasks.default.push('flavour_'+id);
	}


	// --------------------------------
	// GRUNT
	// --------------------------------
	grunt.initConfig(config);

	// tasks
	for (var name in tasks) {
		grunt.registerTask(name, tasks[name]);
	}
};
