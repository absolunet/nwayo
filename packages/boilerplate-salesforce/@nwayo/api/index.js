'use strict';

const NwayoApi = require('./NwayoApi');
const Plugin = require('./Plugin');


module.exports = NwayoApi.make();

module.exports.Plugin = Plugin;
