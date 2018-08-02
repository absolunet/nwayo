//-------------------------------------
//-- Components tests
//-------------------------------------
'use strict';

const fss      = require('@absolunet/fss');
const paths    = require('../../paths');
const toolbox  = require('../../toolbox');
const assert   = require('../assertions');
const Reporter = require('../reporter');


const reports = new Reporter();
const root    = 'components';


const assetsFonts = (component) => {
	reports.add(assert.hasNoDirs(`${component}/assets/fonts`, { root }));

	const files       = fss.scandir(`${paths.dir.components}/${component}/assets/fonts`, 'file', { recursive:true, pattern:'*.+(woff|woff2)' });
	const differences = toolbox.compareLists(fss.scandir(`${paths.dir.components}/${component}/assets/fonts`, 'file', { recursive:true }), files);

	reports.add({
		success:     differences.superfluous.length === 0,
		message:     `${Reporter.theme.title(`${component}/styles`)}: Must only contain *.woff or *.woff2 files`,
		differences: { superfluous:differences.superfluous }
	});

	reports.add(assert.areFilesGitTracked(files, `${component}/assets/fonts`, { root }));
};


const assetsIcons = (component) => {
	reports.add(assert.hasNoDirs(`${component}/assets/icons`, { root }));

	const files       = fss.scandir(`${paths.dir.components}/${component}/assets/icons`, 'file', { recursive:true });
	const differences = toolbox.compareLists(fss.scandir(`${paths.dir.components}/${component}/assets/icons`, 'file', { recursive:true }), ['favicon.png', 'icon.png', 'large.png', 'tile.png', 'touch.png']);

	reports.add({
		success:     differences.pass,
		message:     `${Reporter.theme.title(`${component}/assets/icons`)}: Must only contain certain files`,
		differences: differences
	});

	reports.add(assert.areFilesGitTracked(files, `${component}/assets/icons`, { root }));
};


const assetsImages = (component, type) => {
	const files       = fss.scandir(`${paths.dir.components}/${component}/assets/${type}`, 'file', { recursive:true, pattern:'**/*.+(gif|jpg|png|svg)' });
	const differences = toolbox.compareLists(fss.scandir(`${paths.dir.components}/${component}/assets/${type}`, 'file', { recursive:true }), files);

	reports.add({
		success:     differences.superfluous.length === 0,
		message:     `${Reporter.theme.title(`${component}/styles`)}: Must only contain *.gif, *.jpg, *.png, *.svg files`,
		differences: { superfluous:differences.superfluous }
	});

	reports.add(assert.areFilesGitTracked(files, `${component}/assets/${type}`, { root }));
};


const assets = (component) => {

	// No files on root
	reports.add(assert.hasNoFiles(`${component}/assets`, { root }));

	const types            = fss.scandir(`${paths.dir.components}/${component}/assets`, 'dir');
	const typesDifferences = toolbox.compareLists(types, ['fonts', 'icons', 'images', 'inline-images', 'raw']);
	reports.add({
		success:     typesDifferences.superfluous.length === 0,
		message:     `${Reporter.theme.title(`${component}/assets`)}: Assets must only contain certains directories`,
		differences: { superfluous:typesDifferences.superfluous }
	});

	//-- Fonts
	if (types.includes('fonts')) {
		assetsFonts(component);
	}

	//-- Icons
	if (types.includes('icons')) {
		assetsIcons(component);
	}

	//-- Images
	if (types.includes('images')) {
		assetsImages(component, 'images');
	}

	//-- Inline images
	if (types.includes('inline-images')) {
		assetsImages(component, 'inline-images');
	}
};


const scripts = (component) => {
	const files       = fss.scandir(`${paths.dir.components}/${component}/scripts`, 'file', { recursive:true, pattern:'**/*.js' });
	const differences = toolbox.compareLists(fss.scandir(`${paths.dir.components}/${component}/scripts`, 'file', { recursive:true }), files);

	reports.add({
		success:     differences.superfluous.length === 0,
		message:     `${Reporter.theme.title(`${component}/scripts`)}: Must only contain *.js files`,
		differences: { superfluous:differences.superfluous }
	});

	reports.add(assert.exists(`${component}/scripts/${component}.js`, { root }));

	reports.add(assert.areFilesGitTracked(files, `${component}/scripts`, { root }));
};


const styles = (component) => {
	const files       = fss.scandir(`${paths.dir.components}/${component}/styles`, 'file', { recursive:true, pattern:'**/*.scss' });
	const differences = toolbox.compareLists(fss.scandir(`${paths.dir.components}/${component}/styles`, 'file', { recursive:true }), files);

	reports.add({
		success:     differences.superfluous.length === 0,
		message:     `${Reporter.theme.title(`${component}/styles`)}: Must only contain *.scss files`,
		differences: { superfluous:differences.superfluous }
	});

	reports.add(assert.exists(`${component}/styles/${component}.scss`, { root }));
	reports.add(assert.exists(`${component}/styles/config.scss`, { root }));
	reports.add(assert.exists(`${component}/styles/config`, { root }));

	reports.add(assert.areFilesGitTracked(files, `${component}/styles`, { root }));
};


const templates = (component) => {
	reports.add(assert.hasNoDirs(`${component}/templates`, { root }));

	const files       = fss.scandir(`${paths.dir.components}/${component}/templates`, 'file', { recursive:true, pattern:'*.jshtml' });
	const differences = toolbox.compareLists(fss.scandir(`${paths.dir.components}/${component}/templates`, 'file', { recursive:true }), files);

	reports.add({
		success:     differences.superfluous.length === 0,
		message:     `${Reporter.theme.title(`${component}/templates`)}: Must only contain *.jshtml files`,
		differences: { superfluous:differences.superfluous }
	});

	reports.add(assert.areFilesGitTracked(files, `${component}/templates`, { root }));
};


const componentDir = (component) => {

	// No files on root
	reports.add(assert.hasNoFiles(component, { root }));

	//-- Sources
	const sources = fss.scandir(`${paths.dir.components}/${component}`, 'dir');
	const sourcesDifferences = toolbox.compareLists(sources, ['assets', 'scripts', 'styles', 'templates']);
	reports.add({
		success:     sourcesDifferences.superfluous.length === 0,
		message:     `${Reporter.theme.title(component)}: Component must only contain certains directories`,
		differences: { superfluous:sourcesDifferences.superfluous }
	});

	//-- Assets
	if (sources.includes('assets')) {
		assets(component);
	}

	//-- Scripts
	if (sources.includes('scripts')) {
		scripts(component);
	}

	//-- Styles
	if (sources.includes('styles')) {
		styles(component);
	}

	//-- Templates
	if (sources.includes('templates')) {
		templates(component);
	}
};






class ComponentsTests {

	run() {

		// No files on root
		reports.add(assert.hasNoFiles('/', { root }));

		//-- Components
		const components = fss.scandir(`${paths.dir.components}`, 'dir');
		components.forEach((component) => {
			componentDir(component);
		});

		return reports;
	}

}


module.exports = new ComponentsTests();
