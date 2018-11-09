//-------------------------------------
//-- Content
//-------------------------------------
import React from 'react';

import { tree } from '../helpers/generated';
import paths    from '../helpers/paths';
import Util     from '../helpers/util';


const ROOT     = '__root__';
const ERROR404 = '__404__';

const contentData = (data, fullTitle) => {
	return {
		sourceFile: data.source,
		title:      `${data.title}${!fullTitle ? ' - nwayo' : ''}`
	};
};






class Content extends React.Component {

	constructor(props) {
		super(props);
		this.state = {};
	}


	static getDerivedStateFromProps(props) {
		return { url:props.path };
	}


	render() {
		const util    = new Util(this);
		const { url } = this.state;
		const parts   = url.replace(/^\//u, '').replace(/\/$/u, '').split('/');

		let sourceFile;
		let title;
		let isError = false;
		try {
			if (url === '/') {
				({ sourceFile, title } = contentData(tree[ROOT], true));
			} else if (parts.length === 1) {
				({ sourceFile, title } = contentData(tree[parts[0]]));
			} else if (parts.length === 2) {
				({ sourceFile, title } = contentData(tree[parts[0]].children[parts[1]]));
			} else {
				({ sourceFile, title } = contentData(tree[ERROR404], true));
				isError = true;
			}
		} catch (error) {
			({ sourceFile, title } = contentData(tree[ERROR404], true));
			isError = true;
		}

		const source = `${paths.root}/static/content/${sourceFile}.html`;
		let content;
		if (!util.isCached(source)) {
			util.fetchAndUpdate(source);

			content = (
				<div className="loading">Loading...</div>
			);

		} else {

			document.title = title;

			content = (
				<React.Fragment>

					{util.getCache(source)}

					{!isError &&
						<p className="edit-page"><a href={`${paths.githubSource}/${sourceFile}.md`} rel="external">Edit this page</a></p>
					}
				</React.Fragment>
			);
		}

		return (
			<main>{content}</main>
		);
	}


	componentDidUpdate() {
		window.Prism.highlightAll();  // eslint-disable-line no-restricted-globals

		document.querySelectorAll('a[rel="external"]').forEach((link) => {
			link.target = '_blank';
		});
	}

}


export default Content;
