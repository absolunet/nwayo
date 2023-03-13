//--------------------------------------------------------
//-- Manager
//--------------------------------------------------------
"use strict";

/* eslint-disable node/no-unpublished-require */

const { fsSync, fsAsync } = require("@valtech-commerce/fs");
const manager = require("@absolunet/manager");

const ROOT = ".";
const PACKAGES = `${ROOT}/packages`;
const CLI_BINARY = `${PACKAGES}/cli/bin/nwayo`;
const BOILER = `${PACKAGES}/grow-project/boilerplate`;
const EXTENSION_BOILER = `${PACKAGES}/grow-extension/boilerplate`;
const TOOLBOX = `${PACKAGES}/toolbox`;
const WORKFLOW = `${PACKAGES}/workflow`;
const DOCUMENTATION_BUILDER = `${ROOT}/ressources/docs-builder`;

const BOILER_PACKAGE = `${BOILER}/package.json`;
const BOILER_VENDOR = `${BOILER}/vendor`;
const BOILER_VENDOR_PACKAGE = `${BOILER_VENDOR}/package.json`;
const BOILER_INDEX = `${BOILER}/SAMPLE-HTML/index.html`;

manager.multiScriptsRunner({
	tasks: {
		postinstall: {
			postRun: async ({ terminal }) => {
				// Install grow-project boilerplate from current workflow
				terminal.print("Install static current version of workflow to grow-project boilerplate").spacer();

				await terminal.runPromise(`npm pack ${WORKFLOW} --pack-destination=${ROOT}`);
				const [workflowPackage] = await fsAsync.scandir(ROOT, "file", {
					fullPath: true,
					pattern: "absolunet-nwayo-workflow-*.tgz",
				});

				terminal.print("npm install").spacer();
				await terminal.runPromise(`cd ${BOILER}; npm install ${workflowPackage} --save=false`);
				await fsAsync.remove(workflowPackage);

				// Install grow-project boilerplate toolbox from current toolbox
				terminal.print("Install static current version of toolbox to grow-project boilerplate").spacer();

				await terminal.runPromise(`npm pack ${TOOLBOX} --pack-destination=${ROOT}`);
				const [toolboxPackage] = await fsAsync.scandir(ROOT, "file", {
					fullPath: true,
					pattern: "absolunet-nwayo-toolbox-*.tgz",
				});

				terminal.print("npm install").spacer();
				await terminal.runPromise(`cd ${BOILER_VENDOR}; npm install ${toolboxPackage} --save=false`);
				await fsAsync.remove(toolboxPackage);

				await manager.installPackage(BOILER_VENDOR);

				// Install grow-extension boilerplate
				await manager.installPackage(EXTENSION_BOILER);

				// Install documentation builder
				await manager.installPackage(DOCUMENTATION_BUILDER);

				// Make sure CLI binary is executable
				await terminal.runPromise(`chmod +x ${CLI_BINARY}`);
			},
		},

		outdated: {
			postRun: async () => {
				// Check grow-project boilerplate vendors / grow-extension boilerplate / documentation
				for (const path of [BOILER_VENDOR, EXTENSION_BOILER, DOCUMENTATION_BUILDER]) {
					await manager.testOutdated(path); // eslint-disable-line no-await-in-loop
				}
			},
		},

		build: {
			postRun: async ({ terminal }) => {
				//-- Version bump
				terminal.print(`Version bump: grow-project boilerplate 'package.json'`).spacer();
				const boilerPackage = await fsAsync.readJson(BOILER_PACKAGE);
				boilerPackage.dependencies["@absolunet/nwayo-workflow"] = manager.version;
				await fsAsync.writeJson(BOILER_PACKAGE, boilerPackage, { space: 2 });

				terminal.print(`Version bump: grow-project boilerplate vendor 'package.json'`).spacer();
				const boilerVendor = await fsAsync.readJson(BOILER_VENDOR_PACKAGE);
				boilerVendor.dependencies["@absolunet/nwayo-toolbox"] = manager.version;
				await fsAsync.writeJson(BOILER_VENDOR_PACKAGE, boilerVendor, { space: 2 });

				terminal.print(`Version bump: grow-project boilerplate 'SAMPLE-HTML/index.html'`).spacer();
				const boilerIndex = await fsAsync.readFile(BOILER_INDEX, "utf8");
				await fsAsync.writeFile(
					BOILER_INDEX,
					boilerIndex.replaceAll(
						/nwayo (v?(?:0|[1-9]\d*)\.(?:0|[1-9]\d*)\.(?:0|[1-9]\d*)(?:-[\da-z-]+(?:\.[\da-z-]+)*)?(?:\+[\da-z-]+(?:\.[\da-z-]+)*)?)/gu, // eslint-disable-line prefer-named-capture-group
						`nwayo ${manager.version}`
					)
				);

				//-- Update grow-extension
				await manager.updatePackageMeta(EXTENSION_BOILER);

				//-- Counter old manager
				const packages = await fsAsync.scandir(PACKAGES, "dir", {
					fullPath: true,
					pattern: "*",
				});
				packages.shift();
				packages.push(EXTENSION_BOILER);

				packages.forEach((directory) => {
					const content = fsSync.readJson(`${directory}/package.json`);
					content.engines.node = ">= 16";
					fsSync.writeJson(`${directory}/package.json`, content, { space: 2 });
				});

				const licenses = fsSync
					.scandir(ROOT, "file", { recursive: true, pattern: "license", fullPath: true })
					.filter((file) => !file.includes("node_modules"));

				licenses.forEach((file) => {
					const temporary = `${file}_${Date.now()}`;
					fsSync.move(file, temporary);
					fsSync.move(temporary, `${file.slice(0, "license".length * -1)}LICENSE`);
				});

				//-- grow-project boilerplate 'nwayo rebuild'
				terminal.print(`grow-project boilerplate 'nwayo rebuild'`).spacer();
				terminal.run(`cd ${BOILER} && ../../cli/bin/nwayo rebuild`);
				terminal.spacer();

				//-- Documentation rebuild
				terminal.print(`Documentation rebuild`).spacer();
				terminal.run(`cd ${DOCUMENTATION_BUILDER} && npm run build`);
			},
		},
	},
});
