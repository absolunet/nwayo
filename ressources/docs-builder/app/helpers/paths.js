//-------------------------------------
//-- Paths
//-------------------------------------

class Paths {
	// eslint-disable-next-line class-methods-use-this
	get root() {
		return "/nwayo";
	}

	// eslint-disable-next-line class-methods-use-this
	get github() {
		return `https://github.com/valtech-commerce/nwayo`;
	}

	get githubSource() {
		return `${this.github}/blob/main/documentation`;
	}
}

export default new Paths();
