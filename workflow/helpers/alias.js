//-------------------------------------
//-- Alias
//-------------------------------------
'use strict';

const fs          = require('fs');
const moduleAlias = require('module-alias');


moduleAlias.addAlias('~', fs.realpathSync(`${__dirname}/..`));
