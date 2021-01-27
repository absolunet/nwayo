//--------------------------------------------------------
//-- Manager
//--------------------------------------------------------
'use strict';

const path        = require('path');
const fsp         = require('@absolunet/fsp');
const { manager } = require('@absolunet/manager');

const ROOT                            = __dirname;
const PACKAGE_JSON                    = 'package.json';
const CLI_ROOT                        = `${ROOT}/packages/cli`;
const CORE_ROOT                       = `${ROOT}/packages/core`;
const API_ROOT                        = `${ROOT}/packages/api`;
const GROW_PROJECT_ROOT               = `${ROOT}/packages/grow-project`;
const PROJECT_BOILERPLATE_ROOT        = `${ROOT}/packages/grow-project/boilerplate`;
const PROJECT_BOILERPLATE_SOURCE_ROOT = `${PROJECT_BOILERPLATE_ROOT}/src`;
const DOCUMENTATION_BUILDER           = `${ROOT}/ressources/docs-builder`;

const GROW_PROJECT_PACKAGE               = `${GROW_PROJECT_ROOT}/${PACKAGE_JSON}`;
const PROJECT_BOILERPLATE_SOURCE_PACKAGE = `${PROJECT_BOILERPLATE_SOURCE_ROOT}/${PACKAGE_JSON}`;
const PROJECT_SAMPLE_INDEX               = `${PROJECT_BOILERPLATE_ROOT}/SAMPLE-HTML/index.html`;
const PROJECT_CLI                        = `${PROJECT_BOILERPLATE_ROOT}/node_modules/@nwayo/cli`;
const PROJECT_API                        = `${PROJECT_BOILERPLATE_ROOT}/node_modules/@nwayo/api`;



manager.init({
	repositoryType: 'multi-package',

	dist: {
		node: true
	},

	tasks: {
		install: {
			postRun: async ({ terminal }) => {
				terminal.print('Install used Webpack plugins from grow-project boilerplate and core in grow-project boilerplate');

				const webpackPlugins = await Promise.all([API_ROOT, CORE_ROOT].map(async (root) => {
					const { dependencies } = await fsp.readJson(path.join(root, PACKAGE_JSON));

					return dependencies;
				}))
					.then((plugins) => {
						return Object.assign({}, ...plugins);
					});

				const formattedWebpackPlugins = Object.entries(webpackPlugins)
					.map(([name, version]) => {
						if (['laravel-mix', '@nwayo/api'].includes(name)) {
							return null;
						}

						return `${name}@${version}`;
					})
					.filter(Boolean)
					.join(' ');

				await Promise.all([PROJECT_BOILERPLATE_ROOT].map(async (root) => {
					await terminal.process.runAsync(`cd ${root} && npm i --no-save ${formattedWebpackPlugins}`);
				}));

				await Promise.all([PROJECT_BOILERPLATE_ROOT].map(async (folder) => {
					terminal.print(`Symlink @nwayo/core to ${path.basename(folder)}`);
					const folderCore = `${folder}/node_modules/@nwayo/core`;
					await fsp.remove(folderCore);
					await fsp.ensureDir(path.dirname(folderCore));
					await fsp.symlink(CORE_ROOT, folderCore);
				}));

				terminal.print('Install grow-project boilerplate vendors');
				await manager.installPackage(PROJECT_BOILERPLATE_SOURCE_ROOT);

				terminal.print('Symlink @nwayo/cli to grow-project boilerplate');
				await fsp.remove(PROJECT_CLI);
				await fsp.ensureDir(path.dirname(PROJECT_CLI));
				await fsp.symlink(CLI_ROOT, PROJECT_CLI);

				terminal.print('Symlink @nwayo/api to grow-project boilerplate');
				await fsp.remove(PROJECT_API);
				await fsp.ensureDir(path.dirname(PROJECT_API));
				await fsp.symlink(API_ROOT, PROJECT_API);

				terminal.print('Install documentation builder');
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
				terminal.print(`Version bump: grow-project boilerplate 'package.json'`);
				const boilerPackage = await fsp.readJson(GROW_PROJECT_PACKAGE);
				boilerPackage.dependencies['@absolunet/nwayo-workflow'] = manager.version;
				await fsp.writeJson(GROW_PROJECT_PACKAGE, boilerPackage, { space: 2 });

				terminal.print(`Version bump: grow-project boilerplate vendor 'package.json'`);
				const boilerVendor = await fsp.readJson(PROJECT_BOILERPLATE_SOURCE_PACKAGE);
				boilerVendor.dependencies['@absolunet/nwayo-toolbox'] = manager.version;
				await fsp.writeJson(PROJECT_BOILERPLATE_SOURCE_PACKAGE, boilerVendor, { space: 2 });

				terminal.print(`Version bump: grow-project boilerplate 'SAMPLE-HTML/index.html'`);
				const boilerIndex = await fsp.readFile(PROJECT_SAMPLE_INDEX, 'utf-8');
				await fsp.writeFile(PROJECT_SAMPLE_INDEX, boilerIndex.replace(/nwayo (v?(?:0|[1-9]\d*)\.(?:0|[1-9]\d*)\.(?:0|[1-9]\d*)(?:-[\da-z-]+(?:\.[\da-z-]+)*)?(?:\+[\da-z-]+(?:\.[\da-z-]+)*)?)/ug, `nwayo ${manager.version}`));  // eslint-disable-line prefer-named-capture-group



				//-- Documentation rebuild
				terminal.print(`Documentation rebuild`);
				terminal.process.run(`cd ${DOCUMENTATION_BUILDER} && npm run build`);
			}
		}
	}
});
