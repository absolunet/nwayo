//--------------------------------------------------------
//-- MyExtension - MyTask
//--------------------------------------------------------
'use strict';

const path     = require('path');
const fss      = require('@absolunet/fss');
const nwayo    = require('@absolunet/nwayo-workflow');
const myHelper = require('../helpers/my-helper');

const { toolbox, util } = nwayo.helpers;

const TASK      = 'my-task';
const ROOT      = fss.realpath(`${path.dirname(__filename)}/..`);
const RESOURCES = `${ROOT}/resources`;






module.exports = (extension) => {

	const log = (id, message) => {
		extension.log(TASK, `${id} - ${message}`);
	};

	extension.createTask(TASK, () => {
		return toolbox.fakeStream((callback) => {

			/* eslint-disable no-console */
			console.log(extension.options);
			console.log(util.getKonstan(extension.options.bundle));
			console.log(util.getScriptsUrl(extension.options.bundle, extension.options.collection));
			console.log(fss.readYaml(`${RESOURCES}/data.yaml`));
			console.log(extension.getGeneratedBanner(extension.options.id, 'text'));
			/* eslint-enable no-console */

			log(extension.options.id, `${myHelper.doIt(1, 2, 3)} built`);

			callback();
		});
	});

};
