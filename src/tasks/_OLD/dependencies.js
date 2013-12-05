grunt.loadNpmTasks('grunt-curl');
config.curl  = {};

grunt.loadNpmTasks('grunt-zip');
config.unzip = {};


var getDependencies = function (data) {
	grunt.task.run('csslibs','kafe','npm_imagemagick');

	for (var i in data) {
		if (data[i].layout === 'foundation') {
			grunt.task.run('foundation');
			break;
		}
	}
};




// css libs
config.curl.csslibs_elements = {
	src: 'https://raw.github.com/dmitryf/elements/master/elements.less?' + new Date().getTime(),
	dest: skeleton+'/sources/css/libs/elements.less'
};

config.curl.csslibs_html5boilerplate = {
	src: 'https://raw.github.com/h5bp/html5-boilerplate/master/css/main.css?' + new Date().getTime(),
	dest: skeleton+'/sources/css/libs/html5boilerplate.css'
};

config.curl.csslibs_normalize = {
	src: 'https://raw.github.com/necolas/normalize.css/master/normalize.css?' + new Date().getTime(),
	dest: skeleton+'/sources/css/libs/normalize.css'
};

config.curl.csslibs_reset = {
	src: 'http://meyerweb.com/eric/tools/css/reset/reset.css?' + new Date().getTime(),
	dest: skeleton+'/sources/css/libs/reset.css'
};

tasks.csslibs = ['curl:csslibs_elements','curl:csslibs_html5boilerplate','curl:csslibs_normalize','curl:csslibs_reset'];





// kafe
config.curl.kafe = {
	src: 'http://localhost/kafe.zip?' + new Date().getTime(),
	dest: dependencies+'/kafe.zip'
};

config.unzip.kafe = {
	src: dependencies+'/kafe.zip',
	dest: dependencies+'/kafe'
};

config.copy.kafe = {files: [{
	expand: true,
	cwd:    dependencies+'/kafe/kafe-master',
	src:    ['**'],
	dest:   skeleton+'/sources/libs/',
	filter: 'isFile'
}]};

config.delete.kafe = [dependencies+'/kafe.zip', dependencies+'/kafe'];

tasks.kafe = ['curl:kafe','unzip:kafe','copy:kafe','delete:kafe'];




// grunt-imagemagick
config.curl.npm_imagemagick = {
	src: 'https://github.com/icagstrout/grunt-imagemagick/archive/master.zip?' + new Date().getTime(),
	dest: skeleton+'/sources/misc/grunt-imagemagick.zip'
};
tasks.npm_imagemagick = ['curl:npm_imagemagick'];

/*
config.unzip.npm_imagemagick = {
	src: skeleton+'/sources/misc/grunt-imagemagick.zip',
	dest: dependencies+'/grunt-imagemagick'
};

config.copy.npm_imagemagick = {files: [{
	expand: true,
	cwd:    dependencies+'/grunt-imagemagick/grunt-imagemagick-master',
	src:    ['**'],
	dest:   skeleton+'/sources/node_modules/grunt-imagemagick/',
	filter: 'isFile'
}]};

config.delete.npm_imagemagick = [dependencies+'/grunt-imagemagick'];
*/





// foundation
config.curl.foundation = {
	src: 'https://github.com/zurb/foundation/archive/master.zip?' + new Date().getTime(),
	dest: dependencies+'/foundation.zip'
};

config.unzip.foundation = {
	src: dependencies+'/foundation.zip',
	dest: dependencies+'/foundation/'
};

config.copy.skeleton_foundation = {files: [{
	expand: true,
	cwd:    skeleton,
	src:    ['**/*','**/.gitignore'],
	dest:   skeleton+'-foundation',
	filter: 'isFile'
}]};

config.copy.foundation = {files: [
	{
		expand: true,
		cwd:    dependencies+'/foundation/foundation-master/scss',
		src:    ['**'],
		dest:   skeleton+'-foundation/sources/css/vendor/foundation/',
		filter: 'isFile'
	},
	{
		expand: true,
		cwd:    dependencies+'/foundation/foundation-master/js/foundation',
		src:    ['**'],
		dest:   skeleton+'-foundation/sources/js/vendor/foundation/',
		filter: 'isFile'
	}
]};

config.delete.foundation = [dependencies+'/foundation.zip', dependencies+'/foundation'];

tasks.foundation = ['curl:foundation','unzip:foundation','copy:skeleton_foundation','copy:foundation','delete:foundation'];



