//-------------------------------------
//-- Env
//-------------------------------------

const ADJECTIVES = ["❤︎", "hard work", "heated debates", "cold sweats", "bad puns", "coffee & tea"];

// eslint-disable-next-line unicorn/prevent-abbreviations
class Env {
	//-- Year
	// eslint-disable-next-line class-methods-use-this
	get year() {
		return new Date().getFullYear();
	}

	//-- Adjective
	// eslint-disable-next-line class-methods-use-this
	get adjective() {
		return ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
	}
}

export default new Env();
