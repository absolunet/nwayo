grunt.loadNpmTasks('grunt-prompt');
config.prompt = {};

grunt.loadNpmTasks('grunt-preprocess');
config.preprocess = {};


var processFlavour = function(id,params,suffix) {

	var
		data       = merge(options.default, options.cms[ params.cms ], params ),
		local      = tmp+'/'+id,
		out        = out_build+'/'+id+suffix,
		css_common = [],
		todelete   = []
	;

	data.space = '';
	data.root += (data.theme) ? '/'+config.pkg.name : '';

	data.build  = data.root+'/builds';

	data.package   = config.pkg.name;
	data.version   = config.pkg.version;
	data.author    = config.pkg.author.name;
	data.copyright = '\n\t<!-- '+config.pkg.name+' '+config.pkg.version+' (c) '+grunt.template.today('yyyy')+' '+config.pkg.author.name+' -->';

	data.title   = (data.title)   ? data.title   : '{TODO}';
	data.ga      = (data.ga)      ? data.ga      : '{TODO}';
	data.addthis = (data.addthis) ? data.addthis : '{TODO}';
	data.domain  = (data.domain)  ? data.domain  : '{TODO}';

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

	// layout
	if (data.layout == 'foundation') {
		todelete.push(
			local+'/sources/css/libs/reset.css',
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



	


	// process var
	for (var j in data) {
		if (grunt.util.kindOf(data[j]) == 'string') {
			data[j] = grunt.template.process(data[j], {data:data});
		}
	}



	// copy skeleton
	config.copy['tmp_'+id] = {
		expand: true,
		cwd:    skeleton+((data.layout == 'foundation') ? '-foundation' : '')+'/',
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
	todelete.push(out);
	config.delete['flavour_'+id] = todelete;


	// copy to build
	config.copy['build_'+id] = {
		expand: true,
		cwd:    local+'/',
		src:    ['**/*','**/.gitignore'],
		dest:   out+'/',
		filter: 'isFile'
	};


	grunt.registerTask('flavour_'+id, ['copy:tmp_'+id, 'preprocess:flavour_'+id, 'delete:flavour_'+id, 'copy:build_'+id]);
	grunt.task.run('flavour_'+id);
};






grunt.task.registerTask('custom_flavour', '', function() {
	var data = grunt.config('custom_flavour');
	getDependencies([data]);
	processFlavour(data.name, data, grunt.template.today('_yyyy.mm.dd-HH.MM.ss'));
});

grunt.task.registerTask('default_flavours', '', function() {
	var
		flavours = options.flavours,
		custom = root+'/flavours-custom.json'
	;

	if (grunt.file.exists(custom)) {
		flavours = merge(flavours,grunt.file.readJSON(custom));
	}

	getDependencies(flavours);

	for (var id in flavours) {
		flavours[id].name = id;
		processFlavour(id, flavours[id], '');
	}
});








// custom build by default
config.prompt.custom_flavour = { options: { questions:[
	{
		name:    'custom_flavour.cms',
		message: 'Which cms:',
		type:    'list',
		choices: [
			{ name:'None',     value:'' },
			{ name:'Drupal',   value:'drupal' },
			{ name:'Magento',  value:'magento' },
			{ name:'Sitecore', value:'sitecore' }
		]
	},
	{
		name:    'custom_flavour.layout',
		message: 'Which layout:',
		type:    'list',
		choices: [
			{ name:'Desktop',                 value:'desktop' },
			{ name:'Mobile',                  value:'mobile' },
			{ name:'Responsive',              value:'responsive' },
			{ name:'Responsive (Foundation)', value:'foundation' }
		]
	},
	{
		name:    'custom_flavour.theme',
		message: 'Has theme:',
		type:    'confirm'
	},
	{
		name:    'custom_flavour.name',
		message: 'Project slug name:',
		type:    'input'
	},
	{
		name:    'custom_flavour.title',
		message: 'Project readable name:',
		type:    'input'
	},
	{
		name:    'custom_flavour.addthis',
		message: 'Addthis pubid:',
		type:    'input'
	},
	{
		name:    'custom_flavour.ga',
		message: 'Google Analytics key:',
		type:    'input'
	},
	{
		name:    'custom_flavour.domain',
		message: 'Public domain:',
		type:    'input'
	}
]}};
tasks.default = ['prompt:custom_flavour', 'skeleton', 'custom_flavour'];


// all defined flavours
tasks.flavours = ['skeleton', 'default_flavours'];
