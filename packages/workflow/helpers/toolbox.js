//-------------------------------------
//-- Toolbox
//-------------------------------------
'use strict';

const chalk        = require('chalk');
const deepKeys     = require('deep-keys');
const log          = require('fancy-log');
const plumber      = require('gulp-plumber');
const gutil        = require('gulp-util');
const Jimp         = require('jimp');
const without      = require('lodash.without');
const merge        = require('merge-stream');
const emoji        = require('node-emoji');
const path         = require('path');
const prettyBytes  = require('pretty-bytes');
const stream       = require('stream');
const through2     = require('through2');
const toIco        = require('to-ico');
const Vinyl        = require('vinyl');
const fss          = require('@absolunet/fss');
const { terminal } = require('@absolunet/terminal');


class Toolbox {

	//-- Create a vinyl stream from a text
	vinylStream(filename, string) {
		const source = stream.Readable({ objectMode: true });

		source._read = function() {
			this.push(new Vinyl({
				path:     filename,
				contents: Buffer.from(string)
			}));
			this.push(null);
		};

		return source;
	}


	//-- Return merged streams or self-closing stream
	mergeStreams(streams) {
		return streams.length !== 0 ? merge(...streams) : this.selfClosingStream();
	}


	//-- Fakes a stream waiting for a callback
	fakeStream(callback) {
		const fake = stream.Writable({ write: (chunk, encoding, callback2) => { callback2(); } });

		callback(() => {
			fake.end('End fake stream');
		});

		return fake;
	}


	//-- Get a self-closing stream
	selfClosingStream() {
		const selfClosing = stream.Writable({ write: (chunk, encoding, callback) => { callback(); } });
		selfClosing.end('End self-closing stream');

		return selfClosing;
	}


	//-- Jimp wrapper
	jimp(custom) {
		return through2.obj(function(file, encoding, callback) {

			Jimp.read(file.contents).then((original) => {
				const image = original.clone();

				// Type shenanigans
				let mimeType;

				switch (path.extname(file.path).slice(1).toLowerCase()) {

					case 'jpg':
						mimeType = Jimp.MIME_JPEG;
						image.quality(100);
						break;

					case 'png':
						mimeType = Jimp.MIME_PNG;
						image.rgba(true);
						break;

					default: break;

				}

				custom(Jimp, image);

				image.getBuffer(mimeType, (error, buffer) => {
					this.push(new gutil.File({
						base:     file.base,
						path:     file.path,
						contents: buffer
					}));

					return callback(error);
				});
			});

		});
	}


	//-- Ico generator
	ico(sizes) {
		return through2.obj(function(file, encoding, callback) {

			toIco(file.contents, { resize: true, sizes }).then((buffer) => {
				this.push(new gutil.File({
					base:     file.base,
					path:     file.path.replace(/\.png$/u, '.ico'),
					contents: buffer
				}));

				return callback();
			});

		});
	}


	//-- Get human-readable filesize
	filesize(file) {
		return prettyBytes(fss.stat(file).size);
	}


	//-- Task logging
	log(task, message, extra) {
		log(`${task}: ${message} ${extra ? chalk.dim(`(${extra})`) : ''}`);
	}


	//-- Plumber
	plumber() {
		return plumber((error) => {
			terminal
				.spacer(2)
				.echo(`${emoji.get('monkey')}  ${error.toString()}`)
				.exit()
			;
		});
	}


	//-- Compare lists
	compareLists(assertion, expectation) {
		const superfluous = without(assertion, ...expectation);
		const missing     = without(expectation, ...assertion);

		return {
			pass:        superfluous.length === 0 && missing.length === 0,
			superfluous,
			missing
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
		return (/^(?<kebab1>[a-z][a-z0-9]*)(?<kebab2>-[a-z0-9]+)*$/u).test(text);
	}

}


module.exports = new Toolbox();
