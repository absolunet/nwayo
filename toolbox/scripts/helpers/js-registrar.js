//-------------------------------------
//-- JS Registrat
//-------------------------------------

(() => {
	'use strict';

	const __ = new WeakMap();

	/* eslint-disable no-empty-function */
	class IRegistrable {

		cache() {}

		subscribe() {}

		cacheDOM() {}

		bind() {}

		start() {}

		delayedStart() {}

	}
	/* eslint-enable no-empty-function */

	class JsRegistrar {

		constructor() {
			__.set(this, {
				registrar: []
			});
		}

		register(Registrable) {
			const registrable = Registrable.prototype ? new Registrable() : Registrable;
			this.prepareRegistrable(registrable);
			const id = __.get(this).registrar.push(registrable);
			this.bootRegistrable(registrable);

			return id;
		}

		prepareRegistrable(registrable) {
			if (!(registrable instanceof IRegistrable)) {
				Object.keys(IRegistrable.prototype).forEach((method) => {
					registrable[method] = registrable[method] || method.bind(registrable);
				});
			}
		}

		bootRegistrable(registrable) {
			registrable.cache();
			registrable.subscribe();

			pinki.vow.when(global.nwayo.vows.DOMParsed).then(() => {
				registrable.cacheDOM();
				registrable.bind();
				registrable.start();
			});

			pinki.vow.when(global.nwayo.vows.documentLoaded).then(() => {
				registrable.delayedStart();
			});
		}

		list() {
			return __.get(this).registrar;
		}

		get(id) {
			return __.get(this).registrar[id];
		}

	}

	global[global.nwayo.project].js = {
		Registrable: IRegistrable,
		registrar: new JsRegistrar()
	};

})();
