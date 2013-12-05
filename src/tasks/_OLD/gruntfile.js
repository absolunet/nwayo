module.exports = function(grunt) {
	grunt.loadNpmTasks('grunt-contrib-watch');


	/*
	"grunt-markdown":          "~0.4.0",
	"grunt-contrib-jshint":    "~0.6.4",
	"grunt-contrib-requirejs": "~0.4.1",
	"grunt-contrib-less":      "~0.7.0",
	"grunt-contrib-cssmin":    "~0.6.2",

	grunt.loadNpmTasks('grunt-markdown');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-requirejs');
	grunt.loadNpmTasks('grunt-contrib-less');
	grunt.loadNpmTasks('grunt-contrib-cssmin');

	markdown:     {},
	jshint:       {},
	requirejs:    {},
	less:         {},
	cssmin:       {},

	*/


	var
		root         = '.',
		src          = 'src',
		tmp          = src+'/.tmp-nwayo',
		skeleton     = tmp+'/.skeleton',
		dependencies = tmp+'/.dependencies',
		src_tasks    = src+'/tasks',
		src_tmpl     = src+'/tmpl',
		src_nwayo    = src+'/nwayo',
		out_build    = 'build',
		out_doc      = 'doc',

		options = grunt.file.readJSON(src_tasks+'/config.json'),
		
		tasks = {},
		config = {
			pkg:    grunt.file.readJSON('package.json'),
			watch:  { all: { files: ['gruntfile.js'], tasks: 'flavours' } }
		},

		merge = function (obj1,obj2,obj3) {
			var obj = {};
			for (var attrname1 in obj1) { obj[attrname1] = obj1[attrname1]; }
			for (var attrname2 in obj2) { obj[attrname2] = obj2[attrname2]; }
			if (obj3) { for (var attrname3 in obj3) { obj[attrname3] = obj3[attrname3]; } }
			return obj;
		}
	;


	config.delete = { tmp:[tmp] };

	grunt.task.registerMultiTask('delete', '', function() {
		for (var i in this.data) {
			grunt.file.delete(this.data[i], {force:true});
		}
	});






	eval(
		grunt.file.read(src_tasks+'/skeleton.js') + ' ' +
		grunt.file.read(src_tasks+'/dependencies.js') + ' ' +
		grunt.file.read(src_tasks+'/flavour.js') + ' '
	);






	grunt.initConfig(config);

	(function(name){
		for (var i in name) {
			tasks[name[i]].unshift('delete:tmp');
			tasks[name[i]].push('delete:tmp');
		}
	})(['default','flavours']);


	// tasks
	for (var name in tasks) {
		grunt.registerTask(name, tasks[name]);
	}
};
