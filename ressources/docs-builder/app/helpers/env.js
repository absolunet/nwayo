//-------------------------------------
//-- Env
//-------------------------------------

const ADJECTIVES = [
	'❤︎',
	'hard work',
	'heated debates',
	'cold sweats',
	'bad puns',
	'coffee & tea'
];





// eslint-disable-next-line unicorn/prevent-abbreviations
class Env {

	//-- Year
	get year() {
		return new Date().getFullYear();
	}

	//-- Adjective
	get adjective() {
		return ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
	}

}


export default new Env();
