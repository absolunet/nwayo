//-------------------------------------
//-- Util
//-------------------------------------

import React from "react";

import axios from "axios";
import HtmlToReact from "html-to-react";

class Util {
	constructor(component) {
		this.component = component;
	}

	fetchAndUpdate(url) {
		axios.get(url).then((result) => {
			const { data } = result;
			const { cache = {} } = this.component.state;

			const htmlToReactParser = new HtmlToReact.Parser();
			const processNodeDefinitions = new HtmlToReact.ProcessNodeDefinitions(React);
			const processingInstructions = [
				{
					shouldProcessNode: () => true,
					processNode: processNodeDefinitions.processDefaultNode,
				},
			];

			cache[url] = htmlToReactParser.parseWithInstructions(data, () => true, processingInstructions);

			this.component.setState({ cache });
		});
	}

	getCache(id) {
		return this.component.state.cache[id];
	}

	isCached(id) {
		const { cache = {} } = this.component.state;

		return Boolean(cache[id]);
	}
}

export default Util;
