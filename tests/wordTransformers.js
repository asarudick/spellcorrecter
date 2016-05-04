import _ from 'lodash';
import { vowelReplace, eliminateRepeats, lowercaseChars, uppercaseChars, addRepeats } from '../src/wordTransformers';
import SpellCorrecter from '../src/SpellCorrecter/base.js';
import { describe, it } from 'mocha';
import { assert, expect } from 'chai';

describe('wordTransformers', () => {
	describe('lowercaseChars', () => {
		it('`A`', () => {
			const transformer = lowercaseChars('A');
			assert.equal(transformer.next().value, 'a');
			assert.equal(transformer.next().value, undefined);
		});
		it('`AA`', () => {
			const transformer = lowercaseChars('AA');
			assert.equal(transformer.next().value, 'aA');
			assert.equal(transformer.next().value, 'Aa');
			assert.equal(transformer.next().value, 'aa');
			assert.equal(transformer.next().value, undefined);
		});
		it('``', () => {
			const transformer = lowercaseChars('');
			assert.equal(transformer.next().value, undefined);
		});
	});

	describe('uppercaseChars', () => {
		it('`a`', () => {
			const transformer = uppercaseChars('a');
			assert.equal(transformer.next().value, 'A');
			assert.equal(transformer.next().value, undefined);
		});
		it('`aa`', () => {
			const transformer = uppercaseChars('aa');
			assert.equal(transformer.next().value, 'Aa');
			assert.equal(transformer.next().value, 'aA');
			assert.equal(transformer.next().value, 'AA');
			assert.equal(transformer.next().value, undefined);
		});
		it('``', () => {
			const transformer = uppercaseChars('');
			assert.equal(transformer.next().value, undefined);
		});
	});

	describe('vowelReplace', () => {
		it('`a`', () => {
			const transformer = vowelReplace('a');
			assert.equal(transformer.next().value, 'e');
			assert.equal(transformer.next().value, 'i');
			assert.equal(transformer.next().value, 'o');
			assert.equal(transformer.next().value, 'u');
			assert.equal(transformer.next().value, 'y');
			assert.equal(transformer.next().value, undefined);
		});
		it('`e`', () => {
			const transformer = vowelReplace('e');
			assert.equal(transformer.next().value, 'i');
			assert.equal(transformer.next().value, 'o');
			assert.equal(transformer.next().value, 'u');
			assert.equal(transformer.next().value, 'y');
			assert.equal(transformer.next().value, 'a');
			assert.equal(transformer.next().value, undefined);
		});
		it('`aa`', () => {
			const transformer = vowelReplace('aa');
			assert.equal(transformer.next().value, 'ea');
			assert.equal(transformer.next().value, 'ia');
			assert.equal(transformer.next().value, 'oa');
			assert.equal(transformer.next().value, 'ua');
			assert.equal(transformer.next().value, 'ya');
			assert.equal(transformer.next().value, 'ae');
			assert.equal(transformer.next().value, 'ai');
			assert.equal(transformer.next().value, 'ao');
			assert.equal(transformer.next().value, 'au');
			assert.equal(transformer.next().value, 'ay');
			assert.equal(transformer.next().value, 'ee');
		});
		it('`shap`', () => {
			const transformer = vowelReplace('shap');
			assert.equal(transformer.next().value, 'shep');
			assert.equal(transformer.next().value, 'ship');
			assert.equal(transformer.next().value, 'shop');
			assert.equal(transformer.next().value, 'shup');
			assert.equal(transformer.next().value, 'shyp');
			assert.equal(transformer.next().value, undefined);
		});
		it('``', () => {
			const transformer = vowelReplace('');
			assert.equal(transformer.next().value, undefined);
		});
	});

	describe('addRepeats', () => {
		const maximum = 3;
		it('`a`', () => {
			const transformer = addRepeats('a', maximum);
			assert.equal(transformer.next().value, 'aa');
			assert.equal(transformer.next().value, 'aaa');
			assert.equal(transformer.next().value, undefined);
		});
		it('`ab`', () => {
			const transformer = addRepeats('ab', maximum);
			assert.equal(transformer.next().value, 'aab');
			assert.equal(transformer.next().value, 'abb');
			assert.equal(transformer.next().value, 'aaab');
			assert.equal(transformer.next().value, 'abbb');
			assert.equal(transformer.next().value, 'aabb');
			assert.equal(transformer.next().value, 'aabbb');
			assert.equal(transformer.next().value, 'aaabb');
			assert.equal(transformer.next().value, 'aaabbb');
			assert.equal(transformer.next().value, undefined);
		});
		it('`aaa`', () => {
			const transformer = addRepeats('aaa', maximum);
			assert.equal(transformer.next().value, undefined);
		});
		it('`aaaa`', () => {
			const transformer = addRepeats('aaaa', maximum);
			assert.equal(transformer.next().value, undefined);
		});
		it('``', () => {
			const transformer = addRepeats('', maximum);
			assert.equal(transformer.next().value, undefined);
		});
	});

	describe('eliminateRepeats', () => {
		it('`aa`', () => {
			const transformer = eliminateRepeats('aa');
			assert.equal(transformer.next().value, 'a');
			assert.equal(transformer.next().value, undefined);
		});
		it('`aaa`', () => {
			const transformer = eliminateRepeats('aaa');
			assert.equal(transformer.next().value, 'aa');
			assert.equal(transformer.next().value, 'a');
			assert.equal(transformer.next().value, undefined);
		});
		it('`baa`', () => {
			const transformer = eliminateRepeats('baa');
			assert.equal(transformer.next().value, 'ba');
			assert.equal(transformer.next().value, undefined);
		});
		it('`aab`', () => {
			const transformer = eliminateRepeats('aab');
			assert.equal(transformer.next().value, 'ab');
			assert.equal(transformer.next().value, undefined);
		});
		it('`baab`', () => {
			const transformer = eliminateRepeats('baab');
			assert.equal(transformer.next().value, 'bab');
			assert.equal(transformer.next().value, undefined);
		});
		it('`aaabbc`', () => {
			const transformer = eliminateRepeats('aaabbc');
			assert.equal(transformer.next().value, 'aabbc');
			assert.equal(transformer.next().value, 'abbc');
			assert.equal(transformer.next().value, 'aaabc');
			assert.equal(transformer.next().value, 'aabc');
			assert.equal(transformer.next().value, 'abc');
			assert.equal(transformer.next().value, undefined);
		});
		it('`baaabbc`', () => {
			const transformer = eliminateRepeats('baaabbc');
			assert.equal(transformer.next().value, 'baabbc');
			assert.equal(transformer.next().value, 'babbc');
			assert.equal(transformer.next().value, 'baaabc');
			assert.equal(transformer.next().value, 'baabc');
			assert.equal(transformer.next().value, 'babc');
			assert.equal(transformer.next().value, undefined);
		});
		it('``', () => {
			const transformer = eliminateRepeats('');
			assert.equal(transformer.next().value, undefined);
		});
	});
});
