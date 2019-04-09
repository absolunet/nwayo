//--------------------------------------------------------
//-- Manager
//--------------------------------------------------------
'use strict';

const fss     = require('@absolunet/fss');
const fsp     = require('@absolunet/fsp');
const manager = require('@absolunet/manager');

const ROOT            = __dirname;
const BOILER          = `${ROOT}/packages/grow-project/boilerplate`;
const WORKFLOW_MATRIX = `${ROOT}/packages/workflow/ressources/doctor-matrix`;

const BOILER_PACKAGE  = `${BOILER}/package.json`;
const BOILER_VENDOR   = `${BOILER}/vendor/package.json`;
const BOILER_INDEX    = `${BOILER}/SAMPLE-HTML/index.html`;
const BOILER_TOOLBOX  = `${BOILER}/vendor/node_modules/@absolunet/nwayo-toolbox`;
const BOILER_WORKFLOW = `${BOILER}/node_modules/@absolunet/nwayo-workflow`;






manager.multiScriptsRunner({
	tasks: {
		build: {
			postRun: async () => {

				//-- Version bump
				// Boilerplate vendor 'package.json'
				const boilerVendor = await fsp.readJson(BOILER_VENDOR);
				boilerVendor.dependencies['@absolunet/nwayo-toolbox'] = manager.version;
				await fsp.writeJson(BOILER_VENDOR, boilerVendor, { space:2 });

				// Boilerplate 'package.json'
				const boilerPackage = await fsp.readJson(BOILER_PACKAGE);
				boilerPackage.dependencies['@absolunet/nwayo-workflow'] = manager.version;
				await fsp.writeJson(BOILER_PACKAGE, boilerPackage, { space:2 });

				// Boilerplate 'SAMPLE-HTML/index.html'
				const boilerIndex = await fsp.readFile(BOILER_INDEX, 'utf-8');
				await fsp.writeFile(BOILER_INDEX, boilerIndex.replace(/nwayo (v?(?:0|[1-9]\d*)\.(?:0|[1-9]\d*)\.(?:0|[1-9]\d*)(?:-[\da-z-]+(?:\.[\da-z-]+)*)?(?:\+[\da-z-]+(?:\.[\da-z-]+)*)?)/ug, `nwayo ${manager.version}`));  // eslint-disable-line unicorn/no-unsafe-regex



				//-- Workflow matrix
				await fsp.remove(WORKFLOW_MATRIX);
				await fsp.ensureDir(WORKFLOW_MATRIX);

				fss.scandir(BOILER, 'file', { pattern:'!+(-gitignore|nwayo.yaml)' }).forEach((file) => {
					fss.copy(`${BOILER}/${file}`, `${WORKFLOW_MATRIX}/${file}`);
				});

				fss.scandir(BOILER, 'dir', { pattern:'!+(.nwayo-cache|node_modules)' }).forEach((dir) => {
					fss.ensureFile(`${WORKFLOW_MATRIX}/${dir}/.gitkeep`);
				});



				//-- Symlinks for dev
				// Toolbox in boilerplate
				await fsp.remove(BOILER_TOOLBOX);
				await fsp.ensureDir(`${BOILER_TOOLBOX}/..`);
				await fsp.symlink('../../../../../toolbox', BOILER_TOOLBOX);

				// Workflow in boilerplate
				await fsp.remove(BOILER_WORKFLOW);
				await fsp.ensureDir(`${BOILER_WORKFLOW}/..`);
				await fsp.symlink('../../../../workflow', BOILER_WORKFLOW);
			}
		}
	}
});
