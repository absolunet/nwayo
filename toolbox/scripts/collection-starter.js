//-------------------------------------
//-- Collection starter kit
//-------------------------------------

//= require bower_components/nwayo-toolbox/toolbox/scripts/exclusion-starter

/* eslint-disable strict, no-unused-vars, no-redeclare, prefer-destructuring */
const PROJECT = global.nwayo.project;
const app     = global[PROJECT];
const konstan = app.konstan;

const DOM_PARSE          = global.nwayo.promises.DOMParse;
const DOCUMENT_LOAD      = global.nwayo.promises.documentLoad;
const GLOBAL_JQUERY_LOAD = global.nwayo.promises.globalJQueryLoad;

const __ = global.nwayo.shortcuts;

const jQuery    = global.nwayo.vendor.jQuery;
const $         = global.nwayo.vendor.jQuery;
const _         = global.nwayo.vendor.lodash;
const Modernizr = global.nwayo.vendor.Modernizr;
const PubSub    = global.nwayo.vendor.PubSub;
