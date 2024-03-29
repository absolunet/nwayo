//-------------------------------------
//-- Collection starter kit
//-------------------------------------

//= require vendor/node_modules/@absolunet/nwayo-toolbox/scripts/exclusion-starter

/* eslint-disable no-unused-vars, no-redeclare, prefer-destructuring */
const PROJECT = global.nwayo.project;
const app = global[PROJECT];
const konstan = app.konstan;

const DOM_PARSED = global.nwayo.vows.DOMParsed;
const DOCUMENT_LOADED = global.nwayo.vows.documentLoaded;
const GLOBAL_JQUERY_LOADED = global.nwayo.vows.globaljqueryLoaded;

const __ = global.nwayo.shortcuts;
const toolbox = global.nwayo.helpers;

const jQuery = global.nwayo.vendor.jQuery;
const $ = global.nwayo.vendor.jQuery;
const _ = global.nwayo.vendor.lodash;
const Modernizr = global.nwayo.vendor.Modernizr;
const pinki = global.nwayo.vendor.pinki;
