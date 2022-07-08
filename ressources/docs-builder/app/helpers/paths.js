//-------------------------------------
//-- Paths
//-------------------------------------

class Paths {
	get root() {
		return "/nwayo";
	}

	get github() {
		return `https://github.com/absolunet/nwayo`;
	}

	get githubSource() {
		return `${this.github}/blob/production/documentation`;
	}
}

export default new Paths();
