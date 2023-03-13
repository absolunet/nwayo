//--------------------------------------------------------
//-- Docs builder
//--------------------------------------------------------
"use strict";

/* eslint-disable node/no-unpublished-require */
const gulp = require("gulp");
const cssnano = require("gulp-cssnano");
const gulpsass = require("gulp-dart-sass");
const postcss = require("gulp-postcss");
const uglify = require("gulp-uglify");
const MarkdownIt = require("markdown-it");
const anchor = require("markdown-it-anchor");
const externalLinks = require("markdown-it-external-links");
const path = require("path");
const postcssFunctions = require("postcss-functions");
const scandirectory = require("scandirectory");
const babel = require("@babel/core");
const { fsSync } = require("@valtech-commerce/fs");
const include = require("../../packages/workflow/helpers/gulp-include");
const customPostCSSFunctions = require("../../packages/workflow/helpers/postcss-functions");

const paths = {};
paths.root = fsSync.realpath(path.join(__dirname, "..", ".."));
paths.ressources = `${paths.root}/ressources`;
paths.builder = `${paths.ressources}/docs-builder`;
paths.assets = `${paths.builder}/assets`;
paths.static = `${paths.root}/docs/static`;

const ROOT = "/nwayo";

const parseTitle = (string) => {
	return (string
		.split("\n")
		.shift()
		.match(/^# (?<title>[^[]+)/u) || ["", "Untitled"])[1];
};

const isBeingWritten = (string) => {
	return /> Being written/u.test(string);
};

const processNav = (tree, section = "") => {
	const data = {};

	Object.keys(tree).forEach((page) => {
		const name = page.replace(".md", "");
		const content = tree[page];
		const url = `${section}/${name}`;

		if (!isBeingWritten(content) && !isBeingWritten(content["readme.md"])) {
			if (typeof content === "string") {
				if (page !== "readme.md") {
					data[name] = {
						source: url.slice(1),
						title: parseTitle(content),
					};
				}
			} else {
				data[name] = {
					source: `${url.slice(1)}/readme`,
					title: parseTitle(content["readme.md"]),
				};

				if (Object.keys(content).length > 1) {
					data[name].children = processNav(content, url);
				}
			}
		}
	});

	return data;
};

//-- Cleanup
fsSync.remove(paths.static);
fsSync.ensureDir(paths.static);

//-- Pages
scandirectory(`${paths.root}/documentation`, { readFiles: true }, (error, list, tree) => {
	// eslint-disable-next-line unicorn/no-negated-condition
	if (!error) {
		const mainReadme = fsSync.readFile(`${paths.root}/readme.md`, "utf8");
		list["readme.md"] = mainReadme;
		tree["readme.md"] = mainReadme;

		//-- Build nav
		const { version } = fsSync.readJson(`${paths.root}/lerna.json`);
		const navTree = processNav(tree);
		navTree.__root__ = { source: "readme", title: `nwayo ${version} - Documentation` };
		navTree.__404__ = navTree["404"];
		delete navTree["404"];

		fsSync.outputFile(
			`${paths.builder}/app/helpers/generated/index.js`,
			`
			export const tree = ${JSON.stringify(navTree)};
			export const version = '${version}';
		`
		);

		//-- Markdown conversion
		const md = new MarkdownIt();
		md.normalizeLink = (link) => {
			if (/^(?<protocol>http|\/)/u.test(link)) {
				return link;
			}

			return link
				.replace(/(?<extension>.md)$/u, "")
				.replace(/^(?<path>\.\.\/\.\.\/ressources\/images\/)/u, `${ROOT}/static/images/`);
		};

		md.use(anchor, {
			level: 2,
			permalink: anchor.permalink.linkInsideHeader({
				class: "anchor",
				symbol: "⚭",
				placement: "before",
			}),
		});

		md.use(externalLinks, {
			externalClassName: "external",
			externalRel: "external", // eslint-disable-line unicorn/prevent-abbreviations
		});

		Object.keys(list).forEach((file) => {
			let content = list[file];

			// Exceptions for main readme
			if (file === "readme.md") {
				md.set({ html: true });
				content = content
					.replaceAll("](documentation/", `](${ROOT}/`)
					.replaceAll(
						/https:\/\/github.com\/absolunet\/nwayo\/raw\/main\/ressources\/images\//gu,
						`${ROOT}/static/images/`
					)
					.replaceAll("nwayo.png", `nwayo.svg`)
					.replaceAll(/\[\/\/\]: # \(Doc\)(?<spaces>[\s\S]*?)\[\/\/\]: # \(\/Doc\)/gu, "");
			} else {
				md.set({ html: false });
			}

			if (content !== "dir" && !isBeingWritten(content)) {
				const outFile = `${paths.static}/content/${file.replace(".md", ".html")}`;
				fsSync.outputFile(outFile, md.render(content));
			}
		});
	} else {
		throw error;
	}
});

//-- Build assets
fsSync.copy(`${paths.ressources}/images`, `${paths.static}/images`);
fsSync.copy(`${paths.root}/test/fixtures/build/icons/site`, `${paths.static}/icons`);

// SCSS
gulp
	.src(`${paths.assets}/styles/main.scss`)
	.pipe(
		gulpsass
			.sync({
				includePaths: [paths.assets],
			})
			.on("error", gulpsass.logError)
	)
	.pipe(
		postcss([
			postcssFunctions({
				functions: {
					...customPostCSSFunctions,
					"docspostcss-svg-image": (fileRaw = "", baseColors, colors) => {
						const file = fileRaw.replaceAll(/^(?<start>["'])?(?<content>.*?)(?<end>["'])?$/gu, "$<content>");

						return customPostCSSFunctions["nwayopostcss-svg-image"](path.resolve(file), baseColors, colors);
					},
				},
			}),
		])
	)
	.pipe(cssnano({ reduceIdents: false, zindex: false }))
	.pipe(gulp.dest(`${paths.static}/styles`));

// JS
gulp
	.src(`${paths.assets}/scripts/main.js`)
	.pipe(
		include({
			basePath: paths.assets,
			autoExtension: true,
			partialPrefix: true,
			fileProcess: (options) => {
				return babel.transform(options.content, {
					presets: [
						[
							require.resolve("@babel/preset-env"),
							{
								modules: false,
								targets: {
									browsers: ["> 0.25%"],
								},
							},
						],
					],
					compact: false,
					highlightCode: false,
					ast: false,
					retainLines: true,
				}).code;
			},
		})
	)
	.pipe(uglify({ output: { comments: "some" } }))
	.pipe(gulp.dest(`${paths.static}/scripts`));
