//--------------------------------------------------------
//-- Manager
//--------------------------------------------------------
'use strict';

const fss     = require('@absolunet/fss');
const fsp     = require('@absolunet/fsp');
const manager = require('@absolunet/manager');

const ROOT                  = '.';
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
		postinstall: {
			postRun: async ({ terminal }) => {

				terminal.println('Symlink grow-project boilerplate workflow');
				await fsp.remove(BOILER_WORKFLOW);
				await fsp.ensureDir(`${BOILER_WORKFLOW}/..`);
				await fsp.symlink('../../../../workflow', BOILER_WORKFLOW);

				// Install grow-project boilerplate vendors
				await manager.installPackage(BOILER_VENDOR);

				terminal.println('Symlink grow-project boilerplate vendors toolbox');
				await fsp.remove(BOILER_VENDOR_TOOLBOX);
				await fsp.ensureDir(`${BOILER_VENDOR_TOOLBOX}/..`);
				await fsp.symlink('../../../../../toolbox', BOILER_VENDOR_TOOLBOX);

				// Install grow-extension boilerplate
				await manager.installPackage(EXTENSION_BOILER);

				// Install documentation builder
				await manager.installPackage(DOCUMENTATION_BUILDER);
			}
		},


		outdated: {
			postRun: async () => {

				// Check grow-project boilerplate vendors / grow-extension boilerplate / documentation
				for (const path of [BOILER_VENDOR, EXTENSION_BOILER, DOCUMENTATION_BUILDER]) {
					await manager.testOutdated(path);  // eslint-disable-line no-await-in-loop
				}
			}
		},


		build: {
			postRun: async ({ terminal }) => {

				//-- Version bump
				terminal.println(`Version bump: grow-project boilerplate 'package.json'`);
				const boilerPackage = await fsp.readJson(BOILER_PACKAGE);
				boilerPackage.dependencies['@absolunet/nwayo-workflow'] = manager.version;
				await fsp.writeJson(BOILER_PACKAGE, boilerPackage, { space: 2 });

				terminal.println(`Version bump: grow-project boilerplate vendor 'package.json'`);
				const boilerVendor = await fsp.readJson(BOILER_VENDOR_PACKAGE);
				boilerVendor.dependencies['@absolunet/nwayo-toolbox'] = manager.version;
				await fsp.writeJson(BOILER_VENDOR_PACKAGE, boilerVendor, { space: 2 });

				terminal.println(`Version bump: grow-project boilerplate 'SAMPLE-HTML/index.html'`);
				const boilerIndex = await fsp.readFile(BOILER_INDEX, 'utf-8');
				await fsp.writeFile(BOILER_INDEX, boilerIndex.replace(/nwayo (v?(?:0|[1-9]\d*)\.(?:0|[1-9]\d*)\.(?:0|[1-9]\d*)(?:-[\da-z-]+(?:\.[\da-z-]+)*)?(?:\+[\da-z-]+(?:\.[\da-z-]+)*)?)/ug, `nwayo ${manager.version}`));  // eslint-disable-line prefer-named-capture-group


				//-- Update grow-extension
				await manager.updatePackageMeta(EXTENSION_BOILER);


				//-- Workflow matrix
				terminal.println(`Update workflow matrix`);
				await fsp.remove(WORKFLOW_MATRIX);
				await fsp.ensureDir(WORKFLOW_MATRIX);

				const BOILER_FULL = fss.realpath(BOILER);
				fss.scandir(BOILER_FULL, 'file', { pattern: '!+(-gitignore|nwayo.yaml)' }).forEach((file) => {
					fss.copy(`${BOILER}/${file}`, `${WORKFLOW_MATRIX}/${file}`);
				});

				fss.scandir(BOILER_FULL, 'dir', { pattern: '!+(.nwayo-cache|node_modules)' }).forEach((directory) => {
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
