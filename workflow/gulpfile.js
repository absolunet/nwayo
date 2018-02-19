//--------------------------------------------------------
//-- Gulpfile
//--------------------------------------------------------
'use strict';

const events = require('events');

//-- Boost max listeners
events.EventEmitter.prototype._maxListeners = 100;


require('./tasks/default');

require('./tasks/assets');
require('./tasks/icons');
require('./tasks/local');
require('./tasks/scripts');
require('./tasks/styles');

require('./tasks/rebuild');
require('./tasks/watch');
