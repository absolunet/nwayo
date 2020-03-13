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
const EXTENSION_JS_ROOT               = `${ROOT}/packages/extension-js`;
const EXTENSION_SCSS_ROOT             = `${ROOT}/packages/extension-scss`;
const PRESET_DEFAULT_ROOT             = `${ROOT}/packages/preset-default`;
const GROW_PROJECT_ROOT               = `${ROOT}/packages/grow-project`;
const PROJECT_BOILERPLATE_ROOT        = `${ROOT}/packages/grow-project/boilerplate`;
const PROJECT_BOILERPLATE_SOURCE_ROOT = `${PROJECT_BOILERPLATE_ROOT}/src`;
const DOCUMENTATION_BUILDER           = `${ROOT}/ressources/docs-builder`;

const GROW_PROJECT_PACKAGE               = `${GROW_PROJECT_ROOT}/${PACKAGE_JSON}`;
const PROJECT_BOILERPLATE_SOURCE_PACKAGE = `${PROJECT_BOILERPLATE_SOURCE_ROOT}/${PACKAGE_JSON}`;
const PROJECT_SAMPLE_INDEX               = `${PROJECT_BOILERPLATE_ROOT}/SAMPLE-HTML/index.html`;
const PROJECT_CLI                        = `${PROJECT_BOILERPLATE_ROOT}/node_modules/@nwayo/cli`;
const PROJECT_PRESET_DEFAULT             = `${PROJECT_BOILERPLATE_ROOT}/node_modules/@nwayo/preset-default`;
const PROJECT_EXTENSION_JS               = `${PROJECT_BOILERPLATE_ROOT}/node_modules/@nwayo/extension-js`;
const PROJECT_EXTENSION_SCSS             = `${PROJECT_BOILERPLATE_ROOT}/node_modules/@nwayo/extension-scss`;
const PRESET_DEFAULT_EXTENSION_JS        = `${PRESET_DEFAULT_ROOT}/node_modules/@nwayo/extension-js`;
const PRESET_DEFAULT_EXTENSION_SCSS      = `${PRESET_DEFAULT_ROOT}/node_modules/@nwayo/extension-scss`;



manager.init({
	repositoryType: 'multi-package',

	dist: {
		node: true
	},

	tasks: {
		install: {
			postRun: async ({ terminal }) => {
				terminal.print('Install used Webpack plugins in grow-project boilerplate and in core');

				const webpackPlugins = await Promise.all([EXTENSION_JS_ROOT, EXTENSION_SCSS_ROOT].map(async (root) => {
					const { dependencies } = await fsp.readJson(path.join(root, PACKAGE_JSON));

					return dependencies;
				}))
					.then((plugins) => {
						return Object.assign({}, ...plugins);
					});

				const formattedWebpackPlugins = Object.entries(webpackPlugins)
					.map(([name, version]) => {
						return `${name}@${version}`;
					})
					.join(' ');

				await Promise.all([PROJECT_BOILERPLATE_ROOT, CORE_ROOT].map(async (root) => {
					await terminal.process.runAsync(`cd ${root} && npm i --no-save ${formattedWebpackPlugins}`);
				}));


				terminal.print('Symlink @nwayo/preset-default to grow-project boilerplate');
				await fsp.remove(PROJECT_PRESET_DEFAULT);
				await fsp.ensureDir(path.dirname(PROJECT_PRESET_DEFAULT));
				await fsp.symlink(PRESET_DEFAULT_ROOT, PROJECT_PRESET_DEFAULT);

				await Promise.all([PROJECT_BOILERPLATE_ROOT, EXTENSION_JS_ROOT, EXTENSION_SCSS_ROOT, PRESET_DEFAULT_ROOT].map(async (folder) => {
					terminal.print(`Symlink @nwayo/core to ${path.basename(folder)}`);
					const folderCore = `${folder}/node_modules/@nwayo/core`;
					await fsp.remove(folderCore);
					await fsp.ensureDir(path.dirname(folderCore));
					await fsp.symlink(CORE_ROOT, folderCore);
				}));

				terminal.print('Symlink @nwayo/extension-js to preset-default');
				await fsp.remove(PRESET_DEFAULT_EXTENSION_JS);
				await fsp.ensureDir(path.dirname(PRESET_DEFAULT_EXTENSION_JS));
				await fsp.symlink(EXTENSION_JS_ROOT, PRESET_DEFAULT_EXTENSION_JS);

				terminal.print('Symlink @nwayo/extension-scss to preset-default');
				await fsp.remove(PRESET_DEFAULT_EXTENSION_SCSS);
				await fsp.ensureDir(path.dirname(PRESET_DEFAULT_EXTENSION_SCSS));
				await fsp.symlink(EXTENSION_SCSS_ROOT, PRESET_DEFAULT_EXTENSION_SCSS);

				terminal.print('Install grow-project boilerplate vendors');
				await manager.installPackage(PROJECT_BOILERPLATE_SOURCE_ROOT);

				terminal.print('Symlink @nwayo/cli to grow-project boilerplate');
				await fsp.remove(PROJECT_CLI);
				await fsp.ensureDir(path.dirname(PROJECT_CLI));
				await fsp.symlink(CLI_ROOT, PROJECT_CLI);

				terminal.print('Symlink @nwayo/extension-js to grow-project boilerplate');
				await fsp.remove(PROJECT_EXTENSION_JS);
				await fsp.ensureDir(path.dirname(PROJECT_EXTENSION_JS));
				await fsp.symlink(EXTENSION_JS_ROOT, PROJECT_EXTENSION_JS);

				terminal.print('Symlink @nwayo/extension-scss to grow-project boilerplate');
				await fsp.remove(PROJECT_EXTENSION_SCSS);
				await fsp.ensureDir(path.dirname(PROJECT_EXTENSION_SCSS));
				await fsp.symlink(EXTENSION_SCSS_ROOT, PROJECT_EXTENSION_SCSS);

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
