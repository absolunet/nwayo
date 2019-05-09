//--------------------------------------------------------
//-- Manager
//--------------------------------------------------------
'use strict';

const fss          = require('@absolunet/fss');
const fsp          = require('@absolunet/fsp');
const manager      = require('@absolunet/manager');
const { terminal } = require('@absolunet/terminal');

const ROOT                  = __dirname;
const BOILER                = `${ROOT}/packages/grow-project/boilerplate`;
const EXTENSION_BOILER      = `${ROOT}/packages/grow-extension/boilerplate`;
const WORKFLOW_MATRIX       = `${ROOT}/packages/workflow/ressources/doctor-matrix`;
const DOCUMENTATION_BUILDER = `${ROOT}/ressources/docs-builder`;

const BOILER_PACKAGE        = `${BOILER}/package.json`;
const BOILER_VENDOR         = `${BOILER}/vendor`;
const BOILER_VENDOR_PACKAGE = `${BOILER_VENDOR}/package.json`;
const BOILER_VENDOR_TOOLBOX = `${BOILER_VENDOR}/node_modules/@absolunet/nwayo-toolbox`;
const BOILER_INDEX          = `${BOILER}/SAMPLE-HTML/index.html`;
const BOILER_WORKFLOW       = `${BOILER}/node_modules/@absolunet/nwayo-workflow`;






manager.multiScriptsRunner({
	tasks: {
		install: {
			postRun: async () => {

				// Symlink grow-project boilerplate workflow
				await fsp.remove(BOILER_WORKFLOW);
				await fsp.ensureDir(`${BOILER_WORKFLOW}/..`);
				await fsp.symlink('../../../../workflow', BOILER_WORKFLOW);

				// Install grow-project boilerplate vendors
				await manager.installPackage({ path: BOILER_VENDOR });

				// Symlink grow-project boilerplate vendors toolbox
				await fsp.remove(BOILER_VENDOR_TOOLBOX);
				await fsp.ensureDir(`${BOILER_VENDOR_TOOLBOX}/..`);
				await fsp.symlink('../../../../../toolbox', BOILER_VENDOR_TOOLBOX);

				// Install grow-extension boilerplate
				await manager.installPackage({ path: EXTENSION_BOILER });

				// Install documentation builder
				await manager.installPackage({ path: DOCUMENTATION_BUILDER });
			}
		},


		outdated: {
			postRun: async () => {

				// Check grow-project boilerplate vendors / grow-extension boilerplate / documentation
				for (const path of [BOILER_VENDOR, EXTENSION_BOILER, DOCUMENTATION_BUILDER]) {
					await manager.testOutdated({ path });  // eslint-disable-line no-await-in-loop
				}
			}
		},


		build: {
			postRun: async () => {

				//-- Version bump
				// grow-project boilerplate 'package.json'
				const boilerPackage = await fsp.readJson(BOILER_PACKAGE);
				boilerPackage.dependencies['@absolunet/nwayo-workflow'] = manager.version;
				await fsp.writeJson(BOILER_PACKAGE, boilerPackage, { space: 2 });

				// grow-project boilerplate vendor 'package.json'
				const boilerVendor = await fsp.readJson(BOILER_VENDOR_PACKAGE);
				boilerVendor.dependencies['@absolunet/nwayo-toolbox'] = manager.version;
				await fsp.writeJson(BOILER_VENDOR_PACKAGE, boilerVendor, { space: 2 });

				// grow-project boilerplate 'SAMPLE-HTML/index.html'
				const boilerIndex = await fsp.readFile(BOILER_INDEX, 'utf-8');
				await fsp.writeFile(BOILER_INDEX, boilerIndex.replace(/nwayo (v?(?:0|[1-9]\d*)\.(?:0|[1-9]\d*)\.(?:0|[1-9]\d*)(?:-[\da-z-]+(?:\.[\da-z-]+)*)?(?:\+[\da-z-]+(?:\.[\da-z-]+)*)?)/ug, `nwayo ${manager.version}`));  // eslint-disable-line prefer-named-capture-group


				//-- Update grow-extension
				await manager.updatePackageMeta({ path: EXTENSION_BOILER });


				//-- Workflow matrix
				await fsp.remove(WORKFLOW_MATRIX);
				await fsp.ensureDir(WORKFLOW_MATRIX);

				fss.scandir(BOILER, 'file', { pattern: '!+(-gitignore|nwayo.yaml)' }).forEach((file) => {
					fss.copy(`${BOILER}/${file}`, `${WORKFLOW_MATRIX}/${file}`);
				});

				fss.scandir(BOILER, 'dir', { pattern: '!+(.nwayo-cache|node_modules)' }).forEach((directory) => {
					fss.ensureFile(`${WORKFLOW_MATRIX}/${directory}/.gitkeep`);
				});


				//-- grow-project boilerplate 'nwayo rebuild'
				terminal.run(`cd ${BOILER} && nwayo rebuild`);


				//-- Documentation rebuild
				terminal.run(`cd ${DOCUMENTATION_BUILDER} && npm run build`);
			}
		}
	}
});
