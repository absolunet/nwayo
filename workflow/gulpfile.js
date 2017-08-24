//--------------------------------------------------------
//-- Gulpfile
//--------------------------------------------------------
'use strict';

global.nwayo = {};

require('colors');

require('./helpers/path');
require('./helpers/util');
require('./helpers/env');



require('./tasks/default');

require('./tasks/assets');
require('./tasks/icons');
require('./tasks/local');
require('./tasks/scripts');
require('./tasks/styles');

require('./tasks/rebuild');
require('./tasks/watch');
