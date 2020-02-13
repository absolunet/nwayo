//-------------------------------------
//-- Components tests
//-------------------------------------
'use strict';

const fss      = require('@absolunet/fss');
const Reporter = require('../../../classes/reporter');
const Tests    = require('../../../classes/tests');
const paths    = require('../../paths');
const toolbox  = require('../../toolbox');
const assert   = require('../assertions');


const reports = new Reporter();
const root    = paths.folder.components;


const assetsFonts = (component) => {
	const FOLDER = `${component}/${paths.folder.assets}/${paths.folder.fonts}`;

	reports.add(assert.hasNoDirectories(FOLDER, { root }));

	const files       = fss.scandir(`${paths.directory.components}/${FOLDER}`, 'file', { recursive: true, pattern: `*.${paths.extension.fonts}` });
	const differences = toolbox.compareLists(fss.scandir(`${paths.directory.components}/${FOLDER}`, 'file', { recursive: true }), files);

	reports.add({
		success:     differences.superfluous.length === 0,
		message:     `${Reporter.theme.title(FOLDER)}: Must only contain ${paths.extension.fonts} files`,
		differences: { superfluous: differences.superfluous }
	});

	reports.add(assert.areFilesGitTracked(files, FOLDER, { root }));
};


const assetsIcons = (component) => {
	const FOLDER = `${component}/${paths.folder.assets}/${paths.folder.icons}`;

	reports.add(assert.hasNoDirectories(FOLDER, { root }));

	const files       = fss.scandir(`${paths.directory.components}/${FOLDER}`, 'file', { recursive: true });
	const differences = toolbox.compareLists(fss.scandir(`${paths.directory.components}/${FOLDER}`, 'file', { recursive: true }), [paths.filename.iconsFavicon, paths.filename.iconsTouch, paths.filename.iconsIcon, paths.filename.iconsLarge, paths.filename.iconsTile]);

	reports.add({
		success:     differences.pass,
		message:     `${Reporter.theme.title(FOLDER)}: Must only contain certain files`,
		differences
	});

	reports.add(assert.areFilesGitTracked(files, FOLDER, { root }));
};


const assetsImages = (component, type) => {
	const FOLDER = `${component}/${paths.folder.assets}/${type}`;

	const files       = fss.scandir(`${paths.directory.components}/${FOLDER}`, 'file', { recursive: true, pattern: `**/*.${paths.extension.images}` });
	const differences = toolbox.compareLists(fss.scandir(`${paths.directory.components}/${FOLDER}`, 'file', { recursive: true }), files);

	reports.add({
		success:     differences.superfluous.length === 0,
		message:     `${Reporter.theme.title(FOLDER)}: Must only contain ${paths.extension.images} files`,
		differences: { superfluous: differences.superfluous }
	});

	reports.add(assert.areFilesGitTracked(files, FOLDER, { root }));
};


const assets = (component) => {
	const FOLDER = `${component}/${paths.folder.assets}`;

	// No files on root
	reports.add(assert.hasNoFiles(FOLDER, { root }));

	const types            = fss.scandir(`${paths.directory.components}/${FOLDER}`, 'dir');
	const typesDifferences = toolbox.compareLists(types, [paths.folder.fonts, paths.folder.icons, paths.folder.images, paths.folder.inlineImages, paths.folder.raw]);
	reports.add({
		success:     typesDifferences.superfluous.length === 0,
		message:     `${Reporter.theme.title(FOLDER)}: Assets must only contain certains directories`,
		differences: { superfluous: typesDifferences.superfluous }
	});

	//-- Fonts
	if (types.includes(paths.folder.fonts)) {
		assetsFonts(component);
	}

	//-- Icons
	if (types.includes(paths.folder.icons)) {
		assetsIcons(component);
	}

	//-- Images
	if (types.includes(paths.folder.images)) {
		assetsImages(component, paths.folder.images);
	}

	//-- Inline images
	if (types.includes(paths.folder.inlineImages)) {
		assetsImages(component, paths.folder.inlineImages);
	}
};


const scripts = (component) => {
	const FOLDER      = `${component}/${paths.folder.scripts}`;
	const files       = fss.scandir(`${paths.directory.components}/${FOLDER}`, 'file', { recursive: true, pattern: `**/*.${paths.extension.scripts}` });
	const differences = toolbox.compareLists(fss.scandir(`${paths.directory.components}/${FOLDER}`, 'file', { recursive: true }), files);

	reports.add({
		success:     differences.superfluous.length === 0,
		message:     `${Reporter.theme.title(FOLDER)}: Must only contain *.${paths.extension.scripts} files`,
		differences: { superfluous: differences.superfluous }
	});

	reports.add(assert.exists(`${FOLDER}/${component}.${paths.extension.scripts}`, { root }));

	reports.add(assert.areFilesGitTracked(files, FOLDER, { root }));
};


const styles = (component) => {
	const FOLDER      = `${component}/${paths.folder.styles}`;
	const files       = fss.scandir(`${paths.directory.components}/${FOLDER}`, 'file', { recursive: true, pattern: `**/*.${paths.extension.styles}` });
	const differences = toolbox.compareLists(fss.scandir(`${paths.directory.components}/${FOLDER}`, 'file', { recursive: true }), files);

	reports.add({
		success:     differences.superfluous.length === 0,
		message:     `${Reporter.theme.title(FOLDER)}: Must only contain *.${paths.extension.styles} files`,
		differences: { superfluous: differences.superfluous }
	});

	reports.add(assert.exists(`${FOLDER}/${component}.${paths.extension.styles}`, { root }));
	reports.add(assert.exists(`${FOLDER}/config.${paths.extension.styles}`, { root }));
	reports.add(assert.exists(`${FOLDER}/config`, { root }));

	reports.add(assert.areFilesGitTracked(files, FOLDER, { root }));
};


const templates = (component) => {
	const FOLDER = `${component}/${paths.folder.templates}`;
	reports.add(assert.hasNoDirectories(FOLDER, { root }));

	const files       = fss.scandir(`${paths.directory.components}/${FOLDER}`, 'file', { recursive: true, pattern: `*.${paths.extension.templates}` });
	const differences = toolbox.compareLists(fss.scandir(`${paths.directory.components}/${FOLDER}`, 'file', { recursive: true }), files);

	reports.add({
		success:     differences.superfluous.length === 0,
		message:     `${Reporter.theme.title(FOLDER)}: Must only contain *.${paths.extension.templates} files`,
		differences: { superfluous: differences.superfluous }
	});

	reports.add(assert.areFilesGitTracked(files, FOLDER, { root }));
};


const componentDirectory = (component) => {

	// No files on root
	reports.add(assert.hasNoFiles(component, { root }));

	//-- Sources
	const sources = fss.scandir(`${paths.directory.components}/${component}`, 'dir');
	const sourcesDifferences = toolbox.compareLists(sources, [paths.folder.assets, paths.folder.scripts, paths.folder.styles, paths.folder.templates]);
	reports.add({
		success:     sourcesDifferences.superfluous.length === 0,
		message:     `${Reporter.theme.title(component)}: Component must only contain certains directories`,
		differences: { superfluous: sourcesDifferences.superfluous }
	});

	//-- Assets
	if (sources.includes(paths.folder.assets)) {
		assets(component);
	}

	//-- Scripts
	if (sources.includes(paths.folder.scripts)) {
		scripts(component);
	}

	//-- Styles
	if (sources.includes(paths.folder.styles)) {
		styles(component);
	}

	//-- Templates
	if (sources.includes(paths.folder.templates)) {
		templates(component);
	}
};






class ComponentsTests extends Tests {

	// eslint-disable-next-line require-await
	async run() {

		// No files on root
		reports.add(assert.hasNoFiles('/', { root }));

		//-- Components
		const components = fss.scandir(`${paths.directory.components}`, 'dir');
		components.forEach((component) => {
			componentDirectory(component);
		});

		return reports;
	}

}


module.exports = new ComponentsTests();
