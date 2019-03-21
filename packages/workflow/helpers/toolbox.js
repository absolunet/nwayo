//-------------------------------------
//-- Toolbox
//-------------------------------------
'use strict';

const chalk        = require('chalk');
const deepKeys     = require('deep-keys');
const log          = require('fancy-log');
const plumber      = require('gulp-plumber');
const without      = require('lodash.without');
const merge        = require('merge-stream');
const emoji        = require('node-emoji');
const prettyBytes  = require('pretty-bytes');
const stream       = require('stream');
const Vinyl        = require('vinyl');
const fss          = require('@absolunet/fss');
const { terminal } = require('@absolunet/terminal');


class Toolbox {

	//-- Create a vinyl stream from a text
	vinylStream(filename, string) {
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


	//-- Return merged streams or self-closing stream
	mergeStreams(streams) {
		return streams.length !== 0 ? merge(...streams) : this.selfClosingStream();
	}


	//-- Fakes a stream waiting for a callback
	fakeStream(cb) {
		const fake = stream.Writable({ write:(chunk, encoding, callback) => { callback(); } });

		cb(() => {
			fake.end('End fake stream');
		});

		return fake;
	}


	//-- Get a self-closing stream
	selfClosingStream() {
		const selfClosing = stream.Writable({ write:(chunk, encoding, callback) => { callback(); } });
		selfClosing.end('End self-closing stream');

		return selfClosing;
	}


	//-- GraphicsMagick optimization
	gmOptimization(gmfile, info) {
		if (info.format === 'JPG') {
			gmfile.noProfile().quality(95);
		}

		if (info.format === 'PNG' && info.depth === 8) {
			gmfile.dither(false).colors(256);
		}

		return gmfile;
	}


	//-- Get human-readable filesize
	filesize(file) {
		return prettyBytes(fss.stat(file).size);
	}


	//-- Task logging
	log(task, msg, extra) {
		log(`${task}: ${msg} ${extra ? chalk.dim(`(${extra})`) : ''}`);
	}


	//-- Plumber
	plumber() {
		return plumber((e) => {
			terminal.spacer(2);
			terminal.echo(`${emoji.get('monkey')}  ${e.toString()}`);
			terminal.exit();
		});
	}


	//-- Compare lists
	compareLists(assertion, expectation) {
		const superfluous = without(assertion, ...expectation);
		const missing     = without(expectation, ...assertion);

		return {
			pass:        superfluous.length === 0 && missing.length === 0,
			superfluous: superfluous,
			missing:     missing
		};
	}


	//-- Flatten keys
	flattenKeys(data, { depth = '' } = {}) {
		return deepKeys(data, true).filter((key) => {
			return new RegExp(`^[a-z0-9-]+(\\.[a-z0-9-]+){0,${depth}}$`, 'ui').test(key);
		});
	}


	//-- Is kebab-case
	isKebabCase(text) {
		return (/^([a-z][a-z0-9]*)(-[a-z0-9]+)*$/u).test(text);  // eslint-disable-line unicorn/no-unsafe-regex
	}

}


module.exports = new Toolbox();
