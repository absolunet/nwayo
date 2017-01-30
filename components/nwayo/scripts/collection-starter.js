//-------------------------------------
//-- Collection starter kit
//-------------------------------------

//= require components/nwayo/scripts/exclusion-starter

/* eslint-disable strict, no-unused-vars, no-redeclare, prefer-destructuring */
const PROJECT = global.nwayo.project;
const app     = global[PROJECT];
const konstan = app.konstan;

const DOM_PARSE     = global.nwayo.promises.DOMParse;
const DOCUMENT_LOAD = global.nwayo.promises.documentLoad;

const __ = global.nwayo.shortcuts;

const jQuery    = global.nwayo.vendor.jQuery;
const $         = global.nwayo.vendor.jQuery;
const $Global   = global.nwayo.vendor.jQueryGlobal;
const _         = global.nwayo.vendor.lodash;
const Modernizr = global.nwayo.vendor.Modernizr;
const PubSub    = global.nwayo.vendor.PubSub;
