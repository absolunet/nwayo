//-------------------------------------
//-- Toolbox
//-------------------------------------
'use strict';

const chalk       = require('chalk');
const log         = require('fancy-log');
const plumber     = require('gulp-plumber');
const yaml        = require('js-yaml');
const merge       = require('merge-stream');
const emoji       = require('node-emoji');
const prettyBytes = require('pretty-bytes');
const stream      = require('stream');
const Vinyl       = require('vinyl');
const fss         = require('@absolunet/fss');
const terminal    = require('@absolunet/terminal');






module.exports = class toolbox {

	//-- Safely read and parse a YAML file
	static readYAML(file) {
		return yaml.safeLoad(fss.readFile(file, 'utf8'));
	}


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


	//-- Return merged streams or self-closing stream
	static mergeStreams(streams) {
		return streams.length ? merge(...streams) : toolbox.selfClosingStream();
	}


	//-- Fakes a stream waiting for a callback
	static fakeStream(cb) {
		const fake = stream.Writable({ write:(chunk, encoding, callback) => { callback(); } });

		cb(() => {
			fake.end('End fake stream');
		});

		return fake;
	}


	//-- Get a self-closing stream
	static selfClosingStream() {
		const selfClosing = stream.Writable({ write:(chunk, encoding, callback) => { callback(); } });
		selfClosing.end('End self-closing stream');

		return selfClosing;
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


	//-- Get human-readable filesize
	static filesize(file) {
		return prettyBytes(fss.stat(file).size);
	}


	//-- Task logging
	static log(task, msg, extra) {
		log(`${task}: ${msg} ${extra ? chalk.dim(`(${extra})`) : ''}`);
	}


	//-- Plumber
	static plumber() {
		return plumber((e) => {
			terminal.spacer(2);
			terminal.echo(`${emoji.get('monkey')}  ${e.toString()}`);
			terminal.exit();
		});
	}

};
