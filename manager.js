//--------------------------------------------------------
//-- Manager
//--------------------------------------------------------
'use strict';

const fss     = require('@absolunet/fss');
const fsp     = require('@absolunet/fsp');
const manager = require('@absolunet/manager');

const ROOT                  = __dirname;
const BOILER                = `${ROOT}/packages/grow-project/boilerplate`;
const EXTENSION_BOILER      = `${ROOT}/packages/grow-extension/boilerplate`;
const WORKFLOW_MATRIX       = `${ROOT}/packages/workflow/ressources/doctor-matrix`;
const DOCUMENTATION_BUILDER = `${ROOT}/ressources/docs-builder`;

const GLOBAL_BOWER    = `${ROOT}/bower.json`;
const BOILER_BOWER    = `${BOILER}/bower.json`;
const BOILER_PACKAGE  = `${BOILER}/package.json`;
const BOILER_INDEX    = `${BOILER}/SAMPLE-HTML/index.html`;
const BOILER_TOOLBOX  = `${BOILER}/bower_components/nwayo-toolbox`;
const BOILER_WORKFLOW = `${BOILER}/node_modules/@absolunet/nwayo-workflow`;






manager.multiScriptsRunner({
	tasks: {

		postinstall: {
			postRun: async ({ terminal }) => {

				terminal.println('Symlink grow-project boilerplate workflow');
				await fsp.remove(BOILER_WORKFLOW);
				await fsp.ensureDir(`${BOILER_WORKFLOW}/..`);
				await fsp.symlink('../../../../workflow', BOILER_WORKFLOW);

				terminal.println('Install grow-project boilerplate vendors');
				terminal.run(`cd ${BOILER} && nwayo install vendors`);

				terminal.println('Symlink grow-project boilerplate toolbox');
				await fsp.remove(BOILER_TOOLBOX);
				await fsp.ensureDir(BOILER_TOOLBOX);
				await fsp.symlink('../../../../../toolbox', `${BOILER_TOOLBOX}/toolbox`);

				// Install grow-extension boilerplate
				await manager.installPackage(EXTENSION_BOILER);

				// Install documentation builder
				await manager.installPackage(DOCUMENTATION_BUILDER);
			}
		},

		outdated: {
			postRun: async () => {

				// Check grow-extension boilerplate / documentation
				for (const path of [EXTENSION_BOILER, DOCUMENTATION_BUILDER]) {
					await manager.testOutdated(path);  // eslint-disable-line no-await-in-loop
				}
			}
		},


		build: {
			postRun: async ({ terminal }) => {

				//-- Version bump
				terminal.println(`Version bump: global 'bower.json'`);
				const globalBower = await fsp.readJson(GLOBAL_BOWER);
				globalBower.version = manager.version;
				await fsp.writeJson(GLOBAL_BOWER, globalBower, { space: 2 });

				terminal.println(`Version bump: grow-project boilerplate 'bower.json'`);
				const boilerBower = await fsp.readFile(BOILER_BOWER, 'utf-8');
				await fsp.writeFile(BOILER_BOWER, boilerBower.replace(/(?<name>"nwayo-toolbox":\s+").+(?<closing>")/u, `$<name>${manager.version}$<closing>`));

				terminal.println(`Version bump: grow-project boilerplate 'package.json'`);
				const boilerPackage = await fsp.readJson(BOILER_PACKAGE);
				boilerPackage.dependencies['@absolunet/nwayo-workflow'] = manager.version;
				await fsp.writeJson(BOILER_PACKAGE, boilerPackage, { space: 2 });

				terminal.println(`Version bump: grow-project boilerplate 'SAMPLE-HTML/index.html'`);
				const boilerIndex = await fsp.readFile(BOILER_INDEX, 'utf-8');
				await fsp.writeFile(BOILER_INDEX, boilerIndex.replace(/nwayo (v?(?:0|[1-9]\d*)\.(?:0|[1-9]\d*)\.(?:0|[1-9]\d*)(?:-[\da-z-]+(?:\.[\da-z-]+)*)?(?:\+[\da-z-]+(?:\.[\da-z-]+)*)?)/ug, `nwayo ${manager.version}`));  // eslint-disable-line prefer-named-capture-group


				//-- Update grow-extension
				await manager.updatePackageMeta(EXTENSION_BOILER);


				//-- Workflow matrix
				terminal.println(`Update workflow matrix`);
				await fsp.remove(WORKFLOW_MATRIX);
				await fsp.ensureDir(WORKFLOW_MATRIX);

				fss.scandir(BOILER, 'file', { pattern: '!+(-gitignore|nwayo.yaml)' }).forEach((file) => {
					fss.copy(`${BOILER}/${file}`, `${WORKFLOW_MATRIX}/${file}`);
				});

				fss.scandir(BOILER, 'dir', { pattern: '!+(.nwayo-cache|node_modules)' }).forEach((directory) => {
					fss.ensureFile(`${WORKFLOW_MATRIX}/${directory}/.gitkeep`);
				});


				//-- grow-project boilerplate 'nwayo rebuild'
				terminal.println(`grow-project boilerplate 'nwayo rebuild'`);
				terminal.run(`cd ${BOILER} && nwayo rebuild`);
				terminal.spacer();


				//-- Documentation rebuild
				terminal.println(`Documentation rebuild`);
				terminal.run(`cd ${DOCUMENTATION_BUILDER} && npm run build`);
			}
		}
	}
});
