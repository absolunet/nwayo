//-------------------------------------
//-- Utils
//-------------------------------------
'use strict';

const _           = require('lodash');
const path        = require('path');
const fs          = require('fs');
const del         = require('del');
const glob        = require('glob');
const stream      = require('stream');
const yaml        = require('js-yaml');
const crypto      = require('crypto');
const Vinyl       = require('vinyl');
const merge       = require('merge-stream');
const runsequence = require('run-sequence');
const gulp        = require('gulp');
const babel       = require('babel-core');

const echo = console.log; // eslint-disable-line no-console
const PATH = global.nwayo.path;
const regexEscapePattern = /[-\/\\^$*+?.()|[\]{}]/g;


//-- Emoji
const emoji = {
	chestnut: '\uD83C\uDF30' // 🌰
};


let watchableTaskCompletedCounter = 0;
const cache = {};




class Util {
	static get emoji() { return emoji; }


	//-- Read and parse a YAML file
	static readYAML(file) {
		return yaml.safeLoad(fs.readFileSync(file, 'utf8'));
	}


	//-- Compare value with current cache if different
	static cache(key, value, process) {
		const digest = crypto.createHash('sha1').update(value).digest('hex');
		let val;

		if (!cache[key] || cache[key] && cache[key].digest !== digest) {
			val = process(value);
			cache[key] = {
				digest:  digest,
				content: val
			};
		} else {
			val = cache[key].content;
		}

		return val;
	}


	//-- Create a vinyl stream from a text
	static vinylStream(filename, string) {
		const src = stream.Readable({ objectMode: true });

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

		const parseItem = (item) => { return `data['${item.split('.').join(`']['`)}']`; };
		const options   = _.cloneDeep(ENV.konstan.options[type]) || {};
		const paths     = _.cloneDeep(PATH.build);
		const data      = _.cloneDeep(ENV.konstan.data);

		// Retrieve bundles
		data.bundles = _.cloneDeep(ENV.konstan.bundles);

		// Output url paths
		data.path = { root: rootUrl };

		if (type === 'styles') {
			options.escape = options.escape || [];
			options.escape.push('path.root');
			paths.inline = PATH.dir.cacheInline;
		}

		for (const key of Object.keys(paths)) {
			data.path[key] = (key !== 'inline' ? `${data.path.root}/` : '') + paths[key];

			if (options.escape && options.escape.indexOf('path.root') !== -1) {
				options.escape.push(`path.${key}`);
			}
		}

		// Option escape strings
		if (options.escape) {
			for (let item of options.escape) {
				item = parseItem(item);

				eval(`${item} = "'"+${item}.replace("'","\\\\\'")+"'"`); // eslint-disable-line no-eval
			}
		}

		// Option excluse items
		if (options.exclude) {
			for (let item of options.exclude) {
				item = parseItem(item);

				eval(`delete ${item}`); // eslint-disable-line no-eval
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
		const config = yaml.safeLoad(fs.readFileSync(PATH.config.lodash, 'utf8'));
		let cli = '';

		for (const option of Object.keys(config)) {
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


	//-- Babel rules
	static getBabelRules(includedFiles) {
		let includes = '';
		if (Boolean(includedFiles) && includedFiles.length){
			const includesLength = includedFiles.length - 1;
			includedFiles.forEach((file, i) => {
				includes += (i === 0 ? '(?!' : '|') + Util.escapeForRegex(file) + (i === includesLength ? ')' : '');
			});
		}
		return new RegExp(PATH.pattern.babel.replace('##includes##', includes));
	}


	//-- Babel processing
	static babelProcess(options, rules) {
		const fullPath = options.fullPath;
		const rawPath  = options.rawPath;
		let content  = options.content;
		if (fullPath.substr(-3) === '.js') {
			if (!rules.test(rawPath)) {
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
		return (pathname) => {
			const elements = pathname.dirname.split(path.sep);
			pathname.dirname = `${elements[3]}/${elements[1]}/${elements.slice(4).join('/')}`;

			if (typeof filename === 'string') {
				pathname.basename = filename;
			} else if (typeof filename === 'function') {
				pathname.basename = filename(pathname.basename);
			}

			return;
		};
	}


	//-- Assets processing pattern
	static assetsProcess(files, customPiping, taskName) {
		const ENV = global.nwayo.env;

		const streams = [];
		for (const component of ENV.bundlesComponents) {

			// Check if component has assets
			const componentFiles = files.replace(PATH.pattern.anytree, component);
			if (glob.sync(componentFiles).length) {

				// Create stream for component
				let componentStream = gulp.src(componentFiles, {base:PATH.dir.root});
				componentStream = customPiping(componentStream);

				// Output to each bundle
				for (const name of Object.keys(ENV.bundles)) {
					const bundle = ENV.bundles[name];

					if ( _.includes(bundle.assets.components, component) ) {
						componentStream.pipe( gulp.dest(bundle.output.build) );
					}
				}

				streams.push(componentStream);
			}
		}

		return merge(...streams).on('end', () => {
			if (taskName) {
				Util.watchableTaskCompleted(taskName);
			}
		});
	}


	//-- Task grouper
	static taskGrouper(options) {
		const ENV = global.nwayo.env;

		// Global paths to delete
		const list = options.cleanPaths || [];

		// Bundles paths to delete
		for (const name of Object.keys(ENV.bundles)) {
			list.push(...options.cleanBundle(name, ENV.bundles[name]));
		}

		del.sync(list, {force:true});
		options.tasks.push((...args) => {
			Util.watchableTaskCompleted(options.taskName);
			options.cb(...args);
		});

		runsequence(...options.tasks);
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
		const banner = `Generated by nwayo ${ENV.pkg.nwayo.version} for ${ENV.pkg.name}:${name}`;

		switch (type) {
			case 'text': return `${banner}`;
			default:     return `/*!\n * ${banner}\n */\n\n`;
		}
	}

	//-- Escape for regex usage
	static escapeForRegex(string) {
		return string.replace(regexEscapePattern, '\\$&');
	}
}

global.nwayo.util = Util;
