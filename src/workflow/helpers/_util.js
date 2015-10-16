//-------------------------------------
//-- Utils
//-------------------------------------
'use strict';

const echo = console.log;

let watchableTaskCompletedCounter = 0;


class Util {

	//-- Image optimization parameters
	static get imageminParams() {
		return {
			optimizationLevel: 7,
			progressive: true,
			interlaced:  true,
			svgoPlugins: [{
				removeViewBox: false
				//removeUselessStrokeAndFill: false
			}]
		};
  }



  //-- Read and parse a YAML file
	static readYAML(file) {
		let fs   = require('fs');
		let yaml = require('js-yaml');

		return yaml.safeLoad(fs.readFileSync(file, 'utf8'));
	}


	//-- Create a vinyl stream from a text
	static vinylStream(filename, string) {
		let Vinyl = require('vinyl');
		let src   = require('stream').Readable({ objectMode: true });

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
	static parseKonstan(type, rootUrl) {
		const PATH = global.nwayo.path;
		const ENV  = global.nwayo.env;

		let _ = require('lodash');

		let parseItem = item => `data['${item.split('.').join(`']['`)}']`;
		let options   = _.clone(ENV.konstan.options[type], true);
		let paths     = _.clone(PATH.build, true);
		let data      = _.clone(ENV.konstan.data, true);

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

		return data;
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


	//-- Assets rename
	static assetsRename(path) {
		let elements = path.split('/');
		return `${elements[3]}/${elements[1]}/${elements.slice(4).join('/')}`;
	}


	//-- Assets processing pattern
	static assetsProcess(files, customPiping, taskName) {
		const PATH = global.nwayo.path;
		const ENV  = global.nwayo.env;

		let _     = require('lodash');
		let gulp  = require('gulp');
		let merge = require('merge-stream');

		let streams = [];

		for (let component of ENV.bundlesComponents) {

			// Create stream for component
			let stream = gulp.src(files.replace(PATH.pattern.anytree, component), {base:PATH.dir.root});
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

		return merge.apply(null, streams).on('end', () => {
			if (taskName) {
				Util.watchableTaskCompleted(taskName);
			}
		});
	}


	//-- Task grouper
	static taskGrouper(options) {
		const ENV       = global.nwayo.env;
		let del         = require('del');
		let runsequence = require('run-sequence');

		// Global paths to delete
		let list = options.cleanPaths || [];

		// Bundles paths to delete
		for (let name of Object.keys(ENV.bundles)) {
			Array.prototype.push.apply(list, options.cleanBundle(name, ENV.bundles[name]) );
		}

		del.sync(list, {force:true});
		runsequence(options.tasks, function() {
			Util.watchableTaskCompleted(options.taskName);
			options.cb.apply(null, arguments);
		});
	}


	//-- Task completed message
	static watchableTaskCompleted(name) {
		const ENV = global.nwayo.env;

		if (ENV.watching) {
			echo(`\n\uD83C\uDF30  #${++watchableTaskCompletedCounter} `.bold.green + `${name} completed`.green);
		}
	}
}

global.nwayo.util = Util;
