'use strict';

const fss       = require('@absolunet/fss');
const mimeTypes = require('mime-types');


module.exports = ({ sass }) => {
	return {
		'inline-file($file)'(fileParameter) {
			const filePath = this.absolutePath(fileParameter).getValue();

			if (fss.exists(filePath)) {
				const data     = fss.readFile(filePath).toString('base64');
				const mimeType = mimeTypes.lookup(filePath);

				return new sass.types.String(`url('data:${mimeType};base64,${data}')`);
			}

			throw new Error(`File '${filePath}' not found`);
		}
	};
};
