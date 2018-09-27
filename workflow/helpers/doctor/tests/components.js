//-------------------------------------
//-- Components tests
//-------------------------------------
'use strict';

const fss      = require('@absolunet/fss');
const Reporter = require('~/classes/reporter');
const Tests    = require('~/classes/tests');
const paths    = require('~/helpers/paths');
const toolbox  = require('~/helpers/toolbox');
const assert   = require('~/helpers/doctor/assertions');


const reports = new Reporter();
const root    = paths.folder.components;


const assetsFonts = (component) => {
	const FOLDER = `${component}/${paths.folder.assets}/${paths.folder.fonts}`;

	reports.add(assert.hasNoDirs(FOLDER, { root }));

	const files       = fss.scandir(`${paths.dir.components}/${FOLDER}`, 'file', { recursive:true, pattern:`*.${paths.ext.fonts}` });
	const differences = toolbox.compareLists(fss.scandir(`${paths.dir.components}/${FOLDER}`, 'file', { recursive:true }), files);

	reports.add({
		success:     differences.superfluous.length === 0,
		message:     `${Reporter.theme.title(FOLDER)}: Must only contain ${paths.ext.fonts} files`,
		differences: { superfluous:differences.superfluous }
	});

	reports.add(assert.areFilesGitTracked(files, FOLDER, { root }));
};


const assetsIcons = (component) => {
	const FOLDER = `${component}/${paths.folder.assets}/${paths.folder.icons}`;

	reports.add(assert.hasNoDirs(FOLDER, { root }));

	const files       = fss.scandir(`${paths.dir.components}/${FOLDER}`, 'file', { recursive:true });
	const differences = toolbox.compareLists(fss.scandir(`${paths.dir.components}/${FOLDER}`, 'file', { recursive:true }), [paths.filename.iconsFavicon, paths.filename.iconsTouch, paths.filename.iconsIcon, paths.filename.iconsLarge, paths.filename.iconsTile]);

	reports.add({
		success:     differences.pass,
		message:     `${Reporter.theme.title(FOLDER)}: Must only contain certain files`,
		differences: differences
	});

	reports.add(assert.areFilesGitTracked(files, FOLDER, { root }));
};


const assetsImages = (component, type) => {
	const FOLDER = `${component}/${paths.folder.assets}/${type}`;

	const files       = fss.scandir(`${paths.dir.components}/${FOLDER}`, 'file', { recursive:true, pattern:`**/*.${paths.ext.images}` });
	const differences = toolbox.compareLists(fss.scandir(`${paths.dir.components}/${FOLDER}`, 'file', { recursive:true }), files);

	reports.add({
		success:     differences.superfluous.length === 0,
		message:     `${Reporter.theme.title(FOLDER)}: Must only contain ${paths.ext.images} files`,
		differences: { superfluous:differences.superfluous }
	});

	reports.add(assert.areFilesGitTracked(files, FOLDER, { root }));
};


const assets = (component) => {
	const FOLDER = `${component}/${paths.folder.assets}`;

	// No files on root
	reports.add(assert.hasNoFiles(FOLDER, { root }));

	const types            = fss.scandir(`${paths.dir.components}/${FOLDER}`, 'dir');
	const typesDifferences = toolbox.compareLists(types, [paths.folder.fonts, paths.folder.icons, paths.folder.images, paths.folder.inlineImages, paths.folder.raw]);
	reports.add({
		success:     typesDifferences.superfluous.length === 0,
		message:     `${Reporter.theme.title(FOLDER)}: Assets must only contain certains directories`,
		differences: { superfluous:typesDifferences.superfluous }
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
	const files       = fss.scandir(`${paths.dir.components}/${FOLDER}`, 'file', { recursive:true, pattern:`**/*.${paths.ext.scripts}` });
	const differences = toolbox.compareLists(fss.scandir(`${paths.dir.components}/${FOLDER}`, 'file', { recursive:true }), files);

	reports.add({
		success:     differences.superfluous.length === 0,
		message:     `${Reporter.theme.title(FOLDER)}: Must only contain *.${paths.ext.scripts} files`,
		differences: { superfluous:differences.superfluous }
	});

	reports.add(assert.exists(`${FOLDER}/${component}.${paths.ext.scripts}`, { root }));

	reports.add(assert.areFilesGitTracked(files, FOLDER, { root }));
};


const styles = (component) => {
	const FOLDER      = `${component}/${paths.folder.styles}`;
	const files       = fss.scandir(`${paths.dir.components}/${FOLDER}`, 'file', { recursive:true, pattern:`**/*.${paths.ext.styles}` });
	const differences = toolbox.compareLists(fss.scandir(`${paths.dir.components}/${FOLDER}`, 'file', { recursive:true }), files);

	reports.add({
		success:     differences.superfluous.length === 0,
		message:     `${Reporter.theme.title(FOLDER)}: Must only contain *.${paths.ext.styles} files`,
		differences: { superfluous:differences.superfluous }
	});

	reports.add(assert.exists(`${FOLDER}/${component}.${paths.ext.styles}`, { root }));
	reports.add(assert.exists(`${FOLDER}/config.${paths.ext.styles}`, { root }));
	reports.add(assert.exists(`${FOLDER}/config`, { root }));

	reports.add(assert.areFilesGitTracked(files, FOLDER, { root }));
};


const templates = (component) => {
	const FOLDER = `${component}/${paths.folder.templates}`;
	reports.add(assert.hasNoDirs(FOLDER, { root }));

	const files       = fss.scandir(`${paths.dir.components}/${FOLDER}`, 'file', { recursive:true, pattern:`*.${paths.ext.templates}` });
	const differences = toolbox.compareLists(fss.scandir(`${paths.dir.components}/${FOLDER}`, 'file', { recursive:true }), files);

	reports.add({
		success:     differences.superfluous.length === 0,
		message:     `${Reporter.theme.title(FOLDER)}: Must only contain *.${paths.ext.templates} files`,
		differences: { superfluous:differences.superfluous }
	});

	reports.add(assert.areFilesGitTracked(files, FOLDER, { root }));
};


const componentDir = (component) => {

	// No files on root
	reports.add(assert.hasNoFiles(component, { root }));

	//-- Sources
	const sources = fss.scandir(`${paths.dir.components}/${component}`, 'dir');
	const sourcesDifferences = toolbox.compareLists(sources, [paths.folder.assets, paths.folder.scripts, paths.folder.styles, paths.folder.templates]);
	reports.add({
		success:     sourcesDifferences.superfluous.length === 0,
		message:     `${Reporter.theme.title(component)}: Component must only contain certains directories`,
		differences: { superfluous:sourcesDifferences.superfluous }
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

	run() {
		return new Promise((resolve) => {

			// No files on root
			reports.add(assert.hasNoFiles('/', { root }));

			//-- Components
			const components = fss.scandir(`${paths.dir.components}`, 'dir');
			components.forEach((component) => {
				componentDir(component);
			});

			resolve(reports);

		});
	}

}


module.exports = new ComponentsTests();
