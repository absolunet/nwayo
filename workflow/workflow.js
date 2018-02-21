//--------------------------------------------------------
//-- Workflow bootstrap
//--------------------------------------------------------
'use strict';

const events = require('events');
const env    = require('./helpers/env');


//-- Boost max listeners
events.EventEmitter.prototype._maxListeners = 100;

//-- Init env
env.initWorkflow();





// gulp-hub

//-- Load tasks
// require('./tasks/default');
// require('./tasks/assets');
// require('./tasks/icons');
// require('./tasks/local');
// require('./tasks/scripts');
// require('./tasks/styles');
// require('./tasks/rebuild');
require('./tasks/watch');
