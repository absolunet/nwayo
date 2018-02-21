//-------------------------------------
//-- Toolbox
//-------------------------------------
'use strict';

const yaml = require('js-yaml');
const fss  = require('@absolunet/fss');






module.exports = class toolbox {

	static readYAML(file) {
		return yaml.safeLoad(fss.readFile(file, 'utf8'));
	}

};
