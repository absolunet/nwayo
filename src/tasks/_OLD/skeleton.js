grunt.loadNpmTasks('grunt-contrib-copy');
config.copy = {};

grunt.task.registerTask('createtree', '', function() {
	var tree = [
		"builds",
		"stubs",
		"sources/assets/data-uri",
		"sources/assets/fonts",
		"sources/assets/images",
		"sources/assets/images/vendor",
		"sources/css/vendor/",
		"sources/js/vendor/",
		"sources/tmpl/"
	];

	for (var i in tree) {
		grunt.file.write(skeleton+'/'+tree[i]+'/.gitignore', '', { force:true });
	}
});

// skeleton
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

tasks.skeleton = ['copy:skeleton', 'createtree'];














