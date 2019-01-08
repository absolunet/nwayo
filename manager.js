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

const GLOBAL_BOWER    = `${ROOT}/bower.json`;
const BOILER_BOWER    = `${BOILER}/bower.json`;
const BOILER_PACKAGE  = `${BOILER}/package.json`;
const BOILER_INDEX    = `${BOILER}/SAMPLE-HTML/index.html`;
const BOILER_TOOLBOX  = `${BOILER}/bower_components/nwayo-toolbox`;
const BOILER_WORKFLOW = `${BOILER}/node_modules/@absolunet/nwayo-workflow`;






manager.multiScriptsRunner({
	tasks: {
		build: {
			postRun: async () => {

				//-- Version bump
				// Global 'bower.json'
				const globalBower = await fsp.readJson(GLOBAL_BOWER);
				globalBower.version = manager.version;
				await fsp.writeJson(GLOBAL_BOWER, globalBower, { space:2 });

				// Boilerplate 'bower.json'
				const boilerBower = await fsp.readFile(BOILER_BOWER, 'utf-8');
				await fsp.writeFile(BOILER_BOWER, boilerBower.replace(/("nwayo-toolbox":\s+").+(")/u, `$1${manager.version}$2`));

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
				await fsp.ensureDir(BOILER_TOOLBOX);
				await fsp.symlink('../../../../../toolbox', `${BOILER_TOOLBOX}/toolbox`);

				// Workflow in boilerplate
				await fsp.remove(BOILER_WORKFLOW);
				await fsp.ensureDir(`${BOILER_WORKFLOW}/..`);
				await fsp.symlink('../../../../workflow', BOILER_WORKFLOW);
			}
		}
	}
});
