'use strict';

const fss    = require('@absolunet/fss');
const crypto = require('crypto');


module.exports = ({ sass }) => {
	return {
		'checksum($file)'(fileParameter) {
			const filePath = this.absolutePath(fileParameter).getValue();

			if (this.fileExists(fileParameter)) {
				return new sass.types.String(crypto.createHash('sha512').update(fss.readFile(filePath)).digest('hex'));
			}

			throw new Error(`File '${filePath}' not found`);
		}
	};
};
