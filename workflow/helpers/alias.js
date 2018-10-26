//-------------------------------------
//-- Alias
//-------------------------------------
'use strict';

const fs          = require('fs');
const moduleAlias = require('module-alias');


module.exports = () => {
	moduleAlias.addAlias('~', fs.realpathSync(`${__dirname}/..`));
};
