//-------------------------------------
//-- Dart SASS - Custom functions
//-------------------------------------
"use strict";

const crypto = require("crypto");
const mimeTypes = require("mime-types");
const sass = require("sass");
const fss = require("@absolunet/fss");

const PREFIX = "nwayodart";
const custom = {};

// Check if file exists
custom[`${PREFIX}-file-exists($file)`] = (parameterFile) => {
	const file = parameterFile.getValue();

	return fss.exists(file) ? sass.types.Boolean.TRUE : sass.types.Boolean.FALSE;
};

// Read file and return contents
custom[`${PREFIX}-read-file($file)`] = (parameterFile) => {
	const file = parameterFile.getValue();

	if (fss.exists(file)) {
		return new sass.types.String(fss.readFile(file, "utf8"));
	}

	throw new Error(`File '${file}' not found`);
};

// Base64 inline an file
custom[`${PREFIX}-inline-file($file)`] = (parameterFile) => {
	const file = parameterFile.getValue();

	if (fss.exists(file)) {
		const data = fss.readFile(file).toString("base64");
		const mimeType = mimeTypes.lookup(file);

		return new sass.types.String(`url('data:${mimeType};base64,${data}')`);
	}

	throw new Error(`File '${file}' not found`);
};

// Get file checksum
custom[`${PREFIX}-checksum($file)`] = (parameterFile) => {
	const file = parameterFile.getValue();

	if (fss.exists(file)) {
		return new sass.types.String(crypto.createHash("sha512").update(fss.readFile(file)).digest("hex"));
	}

	throw new Error(`File '${file}' not found`);
};

module.exports = custom;
