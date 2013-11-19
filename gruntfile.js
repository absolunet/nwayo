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

		options = grunt.file.readJSON(src_nwayo+'/nwayo.json'),
		
		config = {
			pkg:    grunt.file.readJSON('package.json'),

			requirejs:    {},
			jshint:       {},
			markdown:     {},
			less:         {},
			cssmin:       {},
			copy:         {},
			preprocess:   {},
			nwayo_delete: {
				tmp:   { path:[tmp] },
				build: { path:[out_build] }
			},
			watch: { all: { files: ['gruntfile.js', 'package.json'], tasks: 'default' } }
		},

		merge = function (obj1,obj2,obj3) {
			var obj = {};
			for (var attrname1 in obj1) { obj[attrname1] = obj1[attrname1]; }
			for (var attrname2 in obj2) { obj[attrname2] = obj2[attrname2]; }
			for (var attrname3 in obj3) { obj[attrname3] = obj3[attrname3]; }
			return obj;
		}
	;

	grunt.task.registerTask('nwayo_createtree', '', function(id) {
		for (var i in options.tree) {
			grunt.file.write(skeleton+'/'+options.tree[i]+'/.gitignore', '', { force:true });
		}
	});

	grunt.task.registerMultiTask('nwayo_delete', '', function() {
		for (var i in this.data.path) {
			grunt.log.writeln('Deleting '+this.data.path[i]);
			grunt.file.delete(this.data.path[i], {force:true});
		}
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



	//var flavours = {basic: options.flavours.basic};
	var flavours = options.flavours;

	for (var id in flavours) {
		var
			data       = merge(options.default, options.cms[ flavours[id].cms ], flavours[id] ),
			local      = tmp+'/'+id,
			out        = out_build+'/'+id,
			css_common = [],
			todelete   = []
		;

		data.space = '';
		data.root += (data.theme) ? '/'+config.pkg.name : '';

		data.build  = data.root+'/builds';

		data.package   = config.pkg.name;
		data.version   = config.pkg.version;
		data.author    = config.pkg.author.name;
		data.copyright = '\n\t<!-- '+config.pkg.name+' '+config.pkg.version+' (c) '+new Date().getFullYear()+' '+config.pkg.author.name+' -->';

		data.ga      = (data.ga) ? '{{GA}}' : undefined;
		data.addthis = '{{ADDTHIS}}';
		data.domain  = '{{DOMAIN}}';

		data.css_common = '';



		// theme
		if (!data.theme) {
			css_common.push('nwayo-boilerplate');
		} else {
			todelete.push(
				local+'/sources/css/libs/reset.css',
				local+'/sources/css/libs/normalize.css',
				local+'/sources/css/libs/html5boilerplate.css',
				local+'/sources/css/libs/nwayo-boilerplate.less'
			);
		}


		// drupal
		if (data.cms == 'drupal') {
			css_common.push('cms-drupal');

			if (data.layout == 'foundation') {
				css_common.push('cms-drupal-zurbfoundation');
			} else {
				todelete.push(local+'/sources/css/libs/cms-drupal-zurbfoundation.less');
			}

		} else {
			todelete.push(local+'/sources/css/libs/cms-drupal.less', local+'/sources/css/libs/cms-drupal-zurbfoundation.less');
		}


		// magento
		if (data.cms == 'magento') {
			css_common.push('cms-magento');
		} else {
			todelete.push(local+'/sources/css/libs/cms-magento.less');
		}


		// sitecore
		if (data.cms == 'sitecore') {
			css_common.push('cms-sitecore');
		} else {
			todelete.push(local+'/sources/css/libs/cms-sitecore.less');
		}


		// none
		if (data.cms === '') {
			todelete.push(local+'/sources/css/misc/editor.less');
		}



		// css / less
		for (var i in css_common) {
			data.css_common += '@import \'libs/'+css_common[i]+'\';\n';
		}





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
			src:     [local+'/**/*.*']
		};

		// delete unnecessary files 
		config.nwayo_delete['flavour_'+id] = { path:todelete };


		// copy to build
		config.copy['build_'+id] = {
			expand: true,
			cwd:    local+'/',
			src:    ['**/*','**/.gitignore'],
			dest:   out+'/',
			filter: 'isFile'
		};


		tasks['flavour_'+id] = ['copy:tmp_'+id, 'preprocess:flavour_'+id, 'nwayo_delete:flavour_'+id, 'copy:build_'+id];

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
