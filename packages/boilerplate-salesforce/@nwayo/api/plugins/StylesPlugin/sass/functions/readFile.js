'use strict';

const fss = require('@absolunet/fss');


module.exports = function({ sass }) {
	return {
		'read-file($file)'(fileParameter) {
			const filePath = this.absolutePath(fileParameter).getValue();

			if (this.fileExists(fileParameter)) {
				return new sass.types.String(fss.readFile(filePath, 'utf8'));
			}

			throw new Error(`File '${filePath}' not found`);
		}
	};
};
