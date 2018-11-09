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
