//-------------------------------------
//-- Dart SASS - Custom functions
//-------------------------------------
'use strict';

const mimeTypes = require('mime-types');
const sass      = require('sass');
const fss       = require('@absolunet/fss');






const custom = {};

// Check if file exists
custom['nwayodart-file-exists($file)'] = (paramFile) => {
	const file = paramFile.getValue();

	return fss.exists(file) ? sass.types.Boolean.TRUE : sass.types.Boolean.FALSE;
};


// Read file and return contents
custom['nwayodart-read-file($file)'] = (paramFile) => {
	const file = paramFile.getValue();

	if (fss.exists(file)) {
		return new sass.types.String(fss.readFile(file, 'utf8'));
	}

	throw new Error(`File '${file}' not found`);
};


// Base64 inline an file
custom['nwayodart-inline-file($file)'] = (paramFile) => {
	const file = paramFile.getValue();

	if (fss.exists(file)) {
		const data     = fss.readFile(file).toString('base64');
		const mimeType = mimeTypes.lookup(file);

		return new sass.types.String(`url('data:${mimeType};base64,${data}')`);
	}

	throw new Error(`File '${file}' not found`);
};


module.exports = custom;
