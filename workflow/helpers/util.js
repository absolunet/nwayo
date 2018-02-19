//-------------------------------------
//-- Utils
//-------------------------------------
'use strict';

// const debug = require('gulp-debug');
const babel       = require('babel-core');
const crypto      = require('crypto');
const del         = require('del');
const emoji       = require('emoji');
const fs          = require('fs');
const glob        = require('glob');
const gulp        = require('gulp');
const yaml        = require('js-yaml');
const _           = require('lodash');
const merge       = require('merge-stream');
const path        = require('path');
const runsequence = require('run-sequence');
const stream      = require('stream');
const Vinyl       = require('vinyl');
const terminal    = require('@absolunet/terminal');
const env         = require('../helpers/env');
const paths       = require('../helpers/paths');


//-- Static properties
const STATIC = global.___NwayoUtil___ ? global.___NwayoUtil___ : global.___NwayoUtil___ = {
	cache:            {},
	watchableCounter: 0
};


// Logo
const logo = emoji.get('chestnut'); // 🌰

//-- Escape for regex usage
const escapeForRegex = (string) => {
	return string.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
};

//-- Compare value with current cache if different
const cache = (key, value, process) => {
	const digest = crypto.createHash('sha1').update(value).digest('hex');
	let val;

	if (!STATIC.cache[key] || (STATIC.cache[key] && STATIC.cache[key].digest !== digest)) {
		val = process(value);
		STATIC.cache[key] = {
			digest:  digest,
			content: val
		};
	} else {
		val = STATIC.cache[key].content;
	}

	return val;
};






module.exports = class {

	//-- Create a vinyl stream from a text
	static vinylStream(filename, string) {
		const src = stream.Readable({ objectMode:true });

		src._read = function() {
			this.push(new Vinyl({
				path:     filename,
				contents: Buffer.from(string)
			}));
			this.push(null);
		};

		return src;
	}


	//-- Constants
	static parseKonstan(type, bundle, rootUrl) {
		const parseItem = (item) => { return `data['${item.split('.').join(`']['`)}']`; };
		const options   = _.cloneDeep(env.konstan.options[type]) || {};
		const urls      = _.cloneDeep(paths.build);
		const data      = _.cloneDeep(env.konstan.data);

		// Retrieve bundles
		data.bundles = _.cloneDeep(env.konstan.bundles);

		// Output url paths
		data.path = { root:rootUrl };

		if (type === 'styles') {
			options.escape = options.escape || [];
			options.escape.push('path.root');
			urls.inline = paths.dir.cacheInline;
			urls.nwayoroot = paths.dir.root;
		}

		for (const key of Object.keys(urls)) {
			data.path[key] = (!['inline', 'nwayoroot'].includes(key) ? `${data.path.root}/` : '') + urls[key];

			if (options.escape && options.escape.indexOf('path.root') !== -1) {
				options.escape.push(`path.${key}`);
			}
		}

		// Option escape strings
		if (options.escape) {
			for (let item of options.escape) {
				item = parseItem(item);

				eval(`${item} = "'"+${item}.replace("'","\\\\\'")+"'"`); // eslint-disable-line no-eval, no-useless-escape
			}
		}

		// Option excluse items
		if (options.exclude) {
			for (let item of options.exclude) {
				item = parseItem(item);

				eval(`delete ${item}`); // eslint-disable-line no-eval
			}
		}

		return data;
	}


	//-- Parse Lodash config
	static parseLodash() {
		const config = yaml.safeLoad(fs.readFileSync(paths.config.lodash, 'utf8'));
		let cliParams = '';

		for (const option of Object.keys(config)) {
			if (config[option].length) {
				cliParams += ` ${option}=${config[option].join(',')}`;
			}
		}

		return cliParams;
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


	//-- Babel allowed rules
	static getBabelAllowedRules(includedFiles) {
		let includes = '';
		if (Boolean(includedFiles) && includedFiles.length) {
			const includesLength = includedFiles.length - 1;
			includedFiles.forEach((file, i) => {
				includes += (i === 0 ? '(?!' : '|') + escapeForRegex(file) + (i === includesLength ? ')' : '');
			});
		}

		return new RegExp(paths.pattern.babel.replace('##includes##', includes));
	}


	//-- Babel processing
	static babelProcess(options, targets, allowed) {
		const { fullPath, rawPath } = options;
		let { content } = options;
		if (fullPath.substr(-3) === '.js') {
			if (!allowed.test(rawPath)) {
				const targetsDigest = crypto.createHash('sha1').update(JSON.stringify(targets)).digest('hex');
				content = cache(`babel:${fullPath}:${targetsDigest}`, content, (data) => {

					return babel.transform(data, {
						presets: [
							[
								paths.config.babelPresetEnv, {
									modules: false,
									targets: { browsers:targets }
								}
							]
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

			return false;
		};
	}


	//-- Assets processing pattern
	static assetsProcess(files, customPiping, taskName) {
		const streams = [];
		for (const component of env.bundlesComponents) {

			// Check if component has assets
			const componentFiles = files.replace(paths.pattern.anytree, component);
			if (glob.sync(componentFiles).length) {

				// Create stream for component
				let componentStream = gulp.src(componentFiles, { base:paths.dir.root });
				componentStream = customPiping(componentStream);

				// Output to each bundle
				for (const name of Object.keys(env.bundles)) {
					const bundle = env.bundles[name];

					if (_.includes(bundle.assets.components, component)) {
						componentStream.pipe(gulp.dest(`${paths.dir.root}/${bundle.output.build}`));
					}
				}

				streams.push(componentStream);
			}
		}

		return merge(...streams).on('end', () => {
			if (taskName) {
				this.watchableTaskCompleted(taskName);
			}
		});
	}


	//-- Task grouper
	static taskGrouper(options) {
		// Global paths to delete
		const list = options.cleanPaths || [];

		// Bundles paths to delete
		for (const name of Object.keys(env.bundles)) {
			list.push(...options.cleanBundle(name, env.bundles[name]));
		}

		del.sync(list, { force:true });
		options.tasks.push((...args) => {
			this.watchableTaskCompleted(options.taskName);
			options.cb(...args);
		});

		runsequence(...options.tasks);
	}


	//-- Task completed message
	static watchableTaskCompleted(name) {
		if (env.watching) {
			terminal.echo(`\n${logo}  #${++STATIC.watchableCounter} `.bold.green + `${name} completed`.green);
		}
	}


	//-- Generation banner in build
	static getGeneratedBanner(name, type) {
		const banner = `Generated by nwayo ${env.workflowPkg.version} for ${env.pkg.name}:${name}`;

		switch (type) {

			case 'text': return `${banner}`;
			default:     return `/*!\n * @preserve ${banner}\n */\n\n`;

		}
	}



};
