//-------------------------------------
//-- Utils
//-------------------------------------
'use strict';

const _           = require('lodash');
const fs          = require('fs');
const del         = require('del');
const glob        = require('glob');
const yaml        = require('js-yaml');
const crypto      = require('crypto');
const Vinyl       = require('vinyl');
const merge       = require('merge-stream');
const runsequence = require('run-sequence');
const gulp        = require('gulp');
const babel       = require('babel-core');

const echo = console.log;
const PATH = global.nwayo.path;


//-- Image optimization parameters
let imageminParams = {
	optimizationLevel: 7,
	progressive: true,
	interlaced:  true,
	svgoPlugins: [{
		removeViewBox: false
		//removeUselessStrokeAndFill: false
	}]
};


//-- Emoji
let emoji = {
	chestnut: '\uD83C\uDF30' // 🌰
};


let watchableTaskCompletedCounter = 0;
let cache = {};




class Util {
	static get imageminParams() { return imageminParams; }
	static get emoji()          { return emoji; }


	//-- Read and parse a YAML file
	static readYAML(file) {
		return yaml.safeLoad(fs.readFileSync(file, 'utf8'));
	}


	//-- Compare value with current cache if different
	static cache(key, value, process) {
		let digest = crypto.createHash('sha1').update(value).digest('hex');

		if (!cache[key] || cache[key] && cache[key].digest !== digest) {
			value = process(value);
			cache[key] = {
				digest:  digest,
				content: value
			};
		} else {
			value = cache[key].content;
		}

		return value;
	}


	//-- Create a vinyl stream from a text
	static vinylStream(filename, string) {
		let src = require('stream').Readable({ objectMode: true });

		src._read = function() {
			this.push(new Vinyl({
				path: filename,
				contents: new Buffer(string)
			}));
			this.push(null);
		};

		return src;
	}


	//-- Constants
	static parseKonstan(type, bundle, rootUrl) {
		const ENV = global.nwayo.env;

		let parseItem = item => `data['${item.split('.').join(`']['`)}']`;
		let options   = _.cloneDeep(ENV.konstan.options[type]) || {};
		let paths     = _.cloneDeep(PATH.build);
		let data      = _.cloneDeep(ENV.konstan.data);

		// Retrieve bundles
		data.bundles = _.cloneDeep(ENV.konstan.bundles);

		// Output url paths
		data.path = { root: rootUrl };

		if (type === 'styles') {
			options.escape = options.escape || [];
			options.escape.push('path.root');
			paths.inline = PATH.dir.cacheInline;
		}

		for (let key of Object.keys(paths)) {
			data.path[key] = (key !== 'inline' ? `${data.path.root}/` : '') + paths[key];

			if (options.escape && options.escape.indexOf('path.root') !== -1) {
				options.escape.push(`path.${key}`);
			}
		}

		// Option escape strings
		if (options.escape) {
			for (let item of options.escape) {
				item = parseItem(item);

				// jshint evil: true
				eval(`${item} = "'"+${item}.replace("'","\\\\\'")+"'"`);
				// jshint evil: false
			}
		}

		// Option excluse items
		if (options.exclude) {
			for (let item of options.exclude) {
				item = parseItem(item);

				// jshint evil: true
				eval(`delete ${item}`);
				// jshint evil: false
			}
		}

		if (data.bundles && data.bundles[bundle]) {
			data.current = _.cloneDeep(data.bundles[bundle]);
			delete data.bundles[bundle];
		} else {
			data.current = {};
		}

		return data;
	}


	//-- Parse lodash config
	static parseLodash() {
		let config = yaml.safeLoad(fs.readFileSync(PATH.config.lodash, 'utf8'));
		let cli = '';

		for (let option of Object.keys(config)) {
			if (config[option].length) {
				cli += ` ${option}=${config[option].join(',')}`;
			}
		}

		return cli;
	}


	//-- GraphicsMagick optimization
	static gmOptimization(gmfile, info) {
		if (info.format === 'JPG') {
			gmfile.noProfile().quality(95);
		}

		if (info.format === 'PNG' && info.depth === 8) {
			gmfile.dither(false).colors(256);
		}

		return gmfile;
	}


	//-- Babel processing
	static babelProcess(options) {
		let fullPath = options.fullPath;
		let rawPath  = options.rawPath;
		let content  = options.content;

		if (fullPath.substr(-3) === '.js') {
			if (!PATH.pattern.babel.test(rawPath)) {

				content = Util.cache(`babel:${fullPath}`, content, (data) => {
					return babel.transform(data, {
						// es2015 preset
						plugins: [
							'check-es2015-constants',
							'transform-es2015-arrow-functions',
							'transform-es2015-block-scoped-functions',
							'transform-es2015-block-scoping',
							'transform-es2015-classes',
							'transform-es2015-computed-properties',
							'transform-es2015-destructuring',
							'transform-es2015-for-of',
							'transform-es2015-function-name',
							'transform-es2015-literals',
							//'transform-es2015-modules-commonjs', // Adds use strict
							'transform-es2015-object-super',
							'transform-es2015-parameters',
							'transform-es2015-shorthand-properties',
							'transform-es2015-spread',
							'transform-es2015-sticky-regex',
							'transform-es2015-template-literals',
							'transform-es2015-typeof-symbol',
							'transform-es2015-unicode-regex',
							'transform-regenerator'
						],
						compact:       false,
						highlightCode: false,
						ast:           false,
						retainLines:   true
					}).code;
				});
			}
		}

		return content;
	}


	//-- Assets rename
	static assetsRename(filename) {
		return path => {
			let elements = path.dirname.split('/');
			path.dirname = `${elements[3]}/${elements[1]}/${elements.slice(4).join('/')}`;

			if (typeof filename === 'string') {
				path.basename = filename;
			} else if (typeof filename === 'function') {
				path.basename = filename(path.basename);
			}

			return;
		};
	}


	//-- Assets processing pattern
	static assetsProcess(files, customPiping, taskName) {
		const ENV = global.nwayo.env;

		let streams = [];
		for (let component of ENV.bundlesComponents) {

			// Check if component has assets
			let componentFiles = files.replace(PATH.pattern.anytree, component);
			if (glob.sync(componentFiles).length) {

				// Create stream for component
				let stream = gulp.src(componentFiles, {base:PATH.dir.root});
				stream = customPiping(stream);

				// Output to each bundle
				for (let name of Object.keys(ENV.bundles)) {
					let bundle = ENV.bundles[name];

					if ( _.includes(bundle.assets.components, component) ) {
						stream.pipe( gulp.dest(bundle.output.build) );
					}
				}

				streams.push(stream);
			}
		}

		return merge.apply(null, streams).on('end', () => {
			if (taskName) {
				Util.watchableTaskCompleted(taskName);
			}
		});
	}


	//-- Task grouper
	static taskGrouper(options) {
		const ENV = global.nwayo.env;

		// Global paths to delete
		let list = options.cleanPaths || [];

		// Bundles paths to delete
		for (let name of Object.keys(ENV.bundles)) {
			Array.prototype.push.apply(list, options.cleanBundle(name, ENV.bundles[name]) );
		}

		del.sync(list, {force:true});
		options.tasks.push(function() {
			Util.watchableTaskCompleted(options.taskName);
			options.cb.apply(null, arguments);
		});

		runsequence.apply(null, options.tasks);
	}


	//-- Task completed message
	static watchableTaskCompleted(name) {
		const ENV = global.nwayo.env;

		if (ENV.watching) {
			echo(`\n${Util.emoji.chestnut}  #${++watchableTaskCompletedCounter} `.bold.green + `${name} completed`.green);
		}
	}


	//-- Generation banner in build
	static getGeneratedBanner(name, type) {
		const ENV  = global.nwayo.env;
		let banner = `Generated by nwayo ${ENV.pkg.nwayo.version} for ${ENV.pkg.name}:${name}`;

		switch (type) {
			case 'text': return `${banner}`;
			default:     return `/*!\n * ${banner}\n */\n\n`;
		}
	}
}

global.nwayo.util = Util;
