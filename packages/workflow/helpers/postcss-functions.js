//-------------------------------------
//-- PostCSS - Custom functions
//-------------------------------------
"use strict";

const crypto = require("crypto");
const mimeTypes = require("mime-types");
const fss = require("@absolunet/fss");

const dequote = (value) => {
	return value.replace(/^(?<start>["'])?(?<content>.*?)(?<end>["'])?$/gu, "$<content>");
};

const deserialize = (value) => {
	const list = value.split(", ");

	if (list.length === 1) {
		return list[0];
	}

	if (list[0].includes(":")) {
		return list.reduce((final, element) => {
			const [key, item] = element.split(":");
			final[key] = item;

			return final;
		}, {});
	}

	return list;
};

const buildUniqueURL = (url, file) => {
	const checksum = crypto.createHash("sha512").update(fss.readFile(file)).digest("hex");

	return `url("${url}?v=${checksum}")`;
};

//-- Public functions
const base64Image = (fileRaw = "") => {
	const file = dequote(fileRaw);

	if (fss.exists(file)) {
		const data = fss.readFile(file).toString("base64");
		const mimeType = mimeTypes.lookup(file);

		return `url('data:${mimeType};base64,${data}')`;
	}

	throw new Error(`nwayopostcss-base64-image: File '${file}' not found`);
};

const svgImage = (fileRaw = "", rawBaseColors = "", rawColors = "") => {
	const file = dequote(fileRaw);
	const baseColors = deserialize(dequote(rawBaseColors));
	const colors = deserialize(dequote(rawColors));

	if (fss.exists(file)) {
		let svg = fss.readFile(file, "utf8");

		if (typeof colors === "string" && colors.trim() !== "") {
			svg = svg.replaceAll(new RegExp(baseColors[0], "gui"), colors);
		} else if (Array.isArray(colors)) {
			svg = colors.reduce((final, color, index) => {
				return final.replaceAll(new RegExp(baseColors[index], "gui"), colors[index]);
			}, svg);
		} else if (typeof colors === "object") {
			svg = Object.entries(colors).reduce((final, [original, replacement]) => {
				return final.replaceAll(new RegExp(original, "gui"), replacement);
			}, svg);
		}

		svg = svg
			.replaceAll(`"`, "'")
			.replaceAll("%", "%25")
			.replaceAll("<", "%3C")
			.replaceAll(">", "%3E")
			.replaceAll("&", "%26")
			.replaceAll("#", "%23")
			.replaceAll("{", "%7B")
			.replaceAll("}", "%7D");

		return `url("data:image/svg+xml;charset=utf8,${svg}")`;
	}

	throw new Error(`nwayopostcss-svg-image: File '${file}' not found`);
};

const urlImage = (urlRaw = "", fileRaw = "") => {
	const url = dequote(urlRaw);
	const file = dequote(fileRaw);

	if (fss.exists(file)) {
		return buildUniqueURL(url, file);
	}

	throw new Error(`nwayopostcss-url-image: File '${file}' not found`);
};

const urlWoffWoff2 = (urlRaw = "", fileRaw = "") => {
	const url = dequote(urlRaw);
	const file = dequote(fileRaw);

	let woff2 = "";

	if (fss.exists(dequote(`${file}.woff2`))) {
		woff2 = `${buildUniqueURL(`${url}.woff2`, `${file}.woff2`)} format("woff2"), `;
	}

	if (fss.exists(dequote(`${file}.woff`))) {
		return `${woff2}${buildUniqueURL(`${url}.woff`, `${file}.woff`)}`;
	}

	throw new Error(`nwayopostcss-url-woff-woff2: File '${file}' not found`);
};

module.exports = {
	"nwayopostcss-base64-image": base64Image,
	"nwayopostcss-svg-image": svgImage,
	"nwayopostcss-url-image": urlImage,
	"nwayopostcss-url-woff-woff2": urlWoffWoff2,
};
