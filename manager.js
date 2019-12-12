//--------------------------------------------------------
//-- Manager
//--------------------------------------------------------
'use strict';

const path        = require('path');
const fss         = require('@absolunet/fss');
const fsp         = require('@absolunet/fsp');
const { manager } = require('@absolunet/manager');

const ROOT                            = __dirname;
const CLI_ROOT                        = `${ROOT}/packages/cli`;
const CORE_ROOT                       = `${ROOT}/packages/core`;
const GROW_PROJECT_ROOT               = `${ROOT}/packages/grow-project/boilerplate`;
const PROJECT_BOILERPLATE_ROOT        = `${ROOT}/packages/grow-project/boilerplate`;
const PROJECT_BOILERPLATE_SOURCE_ROOT = `${GROW_PROJECT_ROOT}/src`;
const DOCUMENTATION_BUILDER           = `${ROOT}/ressources/docs-builder`;

const GROW_PROJECT_PACKAGE               = `${GROW_PROJECT_ROOT}/package.json`;
const PROJECT_BOILERPLATE_SOURCE_PACKAGE = `${PROJECT_BOILERPLATE_SOURCE_ROOT}/package.json`;
const PROJECT_SAMPLE_INDEX               = `${PROJECT_BOILERPLATE_ROOT}/SAMPLE-HTML/index.html`;
const PROJECT_CORE_EXTENSION             = `${PROJECT_BOILERPLATE_ROOT}/node_modules/@nwayo/core`;
const NODE_IOC_CLI_PACKAGE               = `${CLI_ROOT}/node_modules/@absolunet/ioc`;
const NODE_IOC_CORE_PACKAGE              = `${CORE_ROOT}/node_modules/@absolunet/ioc`;





manager.init({
	repositoryType: 'multi-package',

	dist: {
		node: true
	},

	tasks: {
		install: {
			postRun: async ({ terminal }) => {
				terminal.println('Symlink @absolunet/ioc package to @nwayo/core node_modules to ensure singletons');
				await fsp.remove(NODE_IOC_CORE_PACKAGE);
				await fsp.ensureDir(path.dirname(NODE_IOC_CORE_PACKAGE));
				await fsp.symlink(NODE_IOC_CLI_PACKAGE, NODE_IOC_CORE_PACKAGE);

				terminal.println('Symlink @nwayo/core extension to grow-project boilerplate');
				await fsp.remove(PROJECT_CORE_EXTENSION);
				await fsp.ensureDir(path.dirname(PROJECT_CORE_EXTENSION));
				await fsp.symlink(CORE_ROOT, PROJECT_CORE_EXTENSION);

				terminal.println('Install grow-project boilerplate vendors');
				await manager.installPackage(PROJECT_BOILERPLATE_SOURCE_ROOT);

				terminal.println('Install documentation builder');
				await manager.installPackage(DOCUMENTATION_BUILDER);
			}
		},


		outdated: {
			postRun: async () => {
				// Check grow-project boilerplate vendors / grow-extension boilerplate / documentation
				for (const packagePath of [PROJECT_BOILERPLATE_ROOT, PROJECT_BOILERPLATE_SOURCE_ROOT, DOCUMENTATION_BUILDER]) {
					await manager.testOutdated(packagePath); // eslint-disable-line no-await-in-loop
				}
			}
		},


		build: {
			postRun: async ({ terminal }) => {

				//-- Version bump
				terminal.println(`Version bump: grow-project boilerplate 'package.json'`);
				const boilerPackage = await fsp.readJson(GROW_PROJECT_PACKAGE);
				boilerPackage.dependencies['@absolunet/nwayo-workflow'] = manager.version;
				await fsp.writeJson(GROW_PROJECT_PACKAGE, boilerPackage, { space: 2 });

				terminal.println(`Version bump: grow-project boilerplate vendor 'package.json'`);
				const boilerVendor = await fsp.readJson(PROJECT_BOILERPLATE_SOURCE_PACKAGE);
				boilerVendor.dependencies['@absolunet/nwayo-toolbox'] = manager.version;
				await fsp.writeJson(PROJECT_BOILERPLATE_SOURCE_PACKAGE, boilerVendor, { space: 2 });

				terminal.println(`Version bump: grow-project boilerplate 'SAMPLE-HTML/index.html'`);
				const boilerIndex = await fsp.readFile(PROJECT_SAMPLE_INDEX, 'utf-8');
				await fsp.writeFile(PROJECT_SAMPLE_INDEX, boilerIndex.replace(/nwayo (v?(?:0|[1-9]\d*)\.(?:0|[1-9]\d*)\.(?:0|[1-9]\d*)(?:-[\da-z-]+(?:\.[\da-z-]+)*)?(?:\+[\da-z-]+(?:\.[\da-z-]+)*)?)/ug, `nwayo ${manager.version}`));  // eslint-disable-line prefer-named-capture-group



				//-- Documentation rebuild
				terminal.println(`Documentation rebuild`);
				terminal.run(`cd ${DOCUMENTATION_BUILDER} && npm run build`);
			}
		}
	}
});
