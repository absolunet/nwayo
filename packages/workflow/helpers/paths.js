//-------------------------------------
//-- Paths
//-------------------------------------
"use strict";

const path = require("path");
const slash = require("slash");

const VENDORS = "vendor";
const CACHE = ".nwayo-cache";
const NOLINT = "vendor";
const ROOT = slash(process.cwd());

const pattern = {};
pattern.anytree = "**";
pattern.babel = `^\\/?##includes##(\\${CACHE}|${VENDORS}|components\\/.*\\/scripts\\/${NOLINT}\\/)`; // https://regex101.com/r/kIKuJW/1

const extension = {};
extension.bundles = "yaml";
extension.fonts = "{woff,woff2}";
extension.images = "{gif,jpg,png,svg}";
extension.images2x = "{jpg,png}";
extension.scripts = "js";
extension.styles = "scss";
extension.stylesBuild = "css";
extension.templates = "jshtml";

const build = {};
build.fonts = "fonts";
build.icons = "icons";
build.images = "images";
build.raw = "raw";
build.scripts = "scripts";
build.styles = "styles";

const folder = {};
folder.cache = CACHE;
folder.cacheInline = `${folder.cache}/inline-images`;
folder.cacheScripts = `${folder.cache}/${build.scripts}`;
folder.cacheStyles = `${folder.cache}/${build.styles}`;
folder.vendors = VENDORS;
folder.vendorsDependencies = `${folder.vendors}/node_modules`;
folder.bundles = "bundles";
folder.components = "components";
folder.assets = "assets";
folder.fonts = "fonts";
folder.icons = "icons";
folder.images = "images";
folder.inlineImages = "inline-images";
folder.raw = "raw";
folder.extensions = "extensions";
folder.scripts = "scripts";
folder.styles = "styles";
folder.templates = "templates";
folder.misc = "misc";
folder.workflowDependencies = "node_modules";
folder.nolint = NOLINT;

const filename = {};
filename.konstan = "konstan";
filename.konstanLocal = `${filename.konstan}.json`;
filename.konstanScripts = `${filename.konstan}.${extension.scripts}`;
filename.konstanStyles = `${filename.konstan}.${extension.styles}`;
filename.lodash = `lodash`;
filename.modernizr = `modernizr`;
filename.polyfill = `polyfill`;
filename.mainConfig = `nwayo.yaml`;
filename.iconsFavicon = `favicon.png`;
filename.iconsTouch = `touch.png`;
filename.iconsIcon = `icon.png`;
filename.iconsLarge = `large.png`;
filename.iconsTile = `tile.png`;

const directory = {};
directory.root = ROOT;
directory.cache = `${directory.root}/${folder.cache}`;
directory.cacheInline = `${directory.root}/${folder.cacheInline}`;
directory.cacheScripts = `${directory.root}/${folder.cacheScripts}`;
directory.cacheStyles = `${directory.root}/${folder.cacheStyles}`;
directory.bundles = `${directory.root}/${folder.bundles}`;
directory.components = `${directory.root}/${folder.components}`;
directory.assets = `${directory.components}/${pattern.anytree}/${folder.assets}`;
directory.fonts = `${directory.assets}/${folder.fonts}`;
directory.icons = `${directory.assets}/${folder.icons}`;
directory.images = `${directory.assets}/${folder.images}`;
directory.inline = `${directory.assets}/${folder.inlineImages}`;
directory.raw = `${directory.assets}/${folder.raw}`;
directory.extensions = `${directory.components}/${pattern.anytree}/${folder.extensions}`;
directory.scripts = `${directory.components}/${pattern.anytree}/${folder.scripts}`;
directory.styles = `${directory.components}/${pattern.anytree}/${folder.styles}`;
directory.templates = `${directory.components}/${pattern.anytree}/${folder.templates}`;
directory.vendors = `${directory.root}/${folder.vendors}`;
directory.vendorsDependencies = `${directory.root}/${folder.vendorsDependencies}`;
directory.misc = `${directory.root}/${folder.misc}`;
directory.resources = `${directory.misc}/resources`;
directory.stubs = `${directory.misc}/stubs`;

const files = {};
files.bundles = `${directory.bundles}/${pattern.anytree}/*.${extension.bundles}`;
files.fonts = `${directory.fonts}/${pattern.anytree}/*.${extension.fonts}`;
files.iconsFavicon = `${directory.icons}/${filename.iconsFavicon}`;
files.iconsTouch = `${directory.icons}/${filename.iconsTouch}`;
files.iconsIcon = `${directory.icons}/${filename.iconsIcon}`;
files.iconsLarge = `${directory.icons}/${filename.iconsLarge}`;
files.iconsTile = `${directory.icons}/${filename.iconsTile}`;
files.images = `${directory.images}/${pattern.anytree}/*.${extension.images}`;
files.images2x = `${directory.images}/${pattern.anytree}/*@2x.${extension.images2x}`;
files.inline = `${directory.inline}/${pattern.anytree}/*.${extension.images}`;
files.raw = `${directory.raw}/${pattern.anytree}/*`;
files.scripts = `${directory.scripts}/${pattern.anytree}/*.${extension.scripts}`;
files.scriptsLint = [files.scripts, `!${directory.scripts}/${NOLINT}/${pattern.anytree}/*`];
files.styles = `${directory.styles}/${pattern.anytree}/*.${extension.styles}`;
files.stylesLint = [files.styles, `!${directory.styles}/${NOLINT}/${pattern.anytree}/*`];
files.templates = `${directory.templates}/${pattern.anytree}/*.${extension.templates}`;
files.vendorsScripts = `${directory.vendorsDependencies}/${pattern.anytree}/*.${extension.scripts}`;

const workflow = {};
workflow.root = slash(path.normalize(path.join(__dirname, "..")));
workflow.cliTasks = `${workflow.root}/cli`;
workflow.tasks = `${workflow.root}/tasks`;
workflow.ressources = `${workflow.root}/ressources`;

const config = {};
config.main = `${directory.root}/${filename.mainConfig}`;
config.vendors = `${directory.vendors}/package.json`;
config.konstan = `${directory.root}/konstan.yaml`;
config.projectPackage = `${directory.root}/package.json`;
config.workflowPackage = `${workflow.root}/package.json`;
config.stylelint = `${directory.root}/.stylelintrc.yaml`;
config.modernizr = `${directory.root}/modernizr.yaml`;
config.lodash = `${directory.root}/lodash.yaml`;
config.lodashBin = slash(require.resolve("lodash-cli"));
config.babelPreset = slash(require.resolve("@babel/preset-env"));
config.regeneratorRuntime = slash(require.resolve("regenerator-runtime"));

class Paths {
	get pattern() {
		return pattern;
	}

	get extension() {
		return extension;
	}

	get build() {
		return build;
	}

	get folder() {
		return folder;
	}

	get directory() {
		return directory;
	}

	get files() {
		return files;
	}

	get filename() {
		return filename;
	}

	get workflow() {
		return workflow;
	}

	get config() {
		return config;
	}
}

module.exports = new Paths();
