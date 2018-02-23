//-------------------------------------
//-- Toolbox
//-------------------------------------
'use strict';

const yaml   = require('js-yaml');
const stream = require('stream');
const Vinyl  = require('vinyl');
const fss    = require('@absolunet/fss');






module.exports = class toolbox {

	//-- Safely  read and parse a YAML file
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

};
