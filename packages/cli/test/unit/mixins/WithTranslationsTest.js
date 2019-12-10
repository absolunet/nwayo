//--------------------------------------------------------
//-- nwayo - Test - Unit - Mixins - WithTranslationsTest
//--------------------------------------------------------
'use strict';

const TestCase         = require('../../TestCase');
const withTranslations = require('../../../dist/node/bootstrap/mixins/withTranslations');
const fakeTranslator   = require('./stubs/fakeTranslator');


class WithTranslationsTest extends TestCase {

	beforeEach() {
		super.beforeEach();
		this.givenNoTranslationArguments();
		this.givenFakeTranslator();
		this.givenInstanceWithTranslation();
	}

	testExposesTranslator() {
		this.whenGettingTranslatorProperty();
		this.thenShouldHaveReceivedFakeTranslator();
	}

	testCanTranslate() {
		this.givenTranslationArguments('foo', { bar: 'baz' }, 3);
		this.whenCallingTranslateWithGivenArguments();
		this.thenShouldHaveCalledFakeTranslatorTranslateWithGivenArguments();
	}


	//-- Given
	//--------------------------------------------------------

	givenFakeTranslator() {
		this.app.singleton('translator', fakeTranslator);
	}

	givenInstanceWithTranslation() {
		this.instance = this.app.make(withTranslations(class {}));
	}

	givenNoTranslationArguments() {
		this.translationArguments = [];
	}

	givenTranslationArguments(...parameters) {
		this.translationArguments = parameters;
	}


	//-- When
	//--------------------------------------------------------

	whenGettingTranslatorProperty() {
		this.attempt(() => {
			this.setResult(this.instance.translator);
		});
	}

	whenCallingTranslateWithGivenArguments() {
		this.attempt(() => {
			this.setResult(this.instance.t(...this.translationArguments));
		});
	}


	//-- Then
	//--------------------------------------------------------

	thenShouldHaveReceivedFakeTranslator() {
		this.thenResultShouldBe(fakeTranslator);
	}

	thenShouldHaveCalledFakeTranslatorTranslateWithGivenArguments() {
		this.thenShouldNotHaveThrown();
		this.expect(fakeTranslator.translate).toHaveBeenCalledTimes(1);
		this.expect(fakeTranslator.translate).toHaveBeenCalledWith(...this.translationArguments);
	}

}


module.exports = WithTranslationsTest;
