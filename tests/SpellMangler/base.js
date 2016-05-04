import _ from 'lodash';
import SpellMangler from '../../src/SpellMangler/base';
import SpellCorrecter from '../../src/SpellCorrecter/base';
import { describe, it } from 'mocha';
import { assert, expect } from 'chai';

describe('SpellMangler', () => {
	let mangler, correcter;
	const words = [ 'sheep', 'conspiracy', 'inside', 'job', 'wake' ];
	const maxVariations = 100;

	beforeEach(() => {
		mangler = new SpellMangler();
		correcter = new SpellCorrecter(words);
	});

	describe('mangle', () => {
		it(`should mangle and have corrected ${maxVariations} variations of sheep`, () => {
			const word = 'sheep';
			let count = 0;
			for (const item of mangler.mangle(word)) {
				assert.equal(correcter.correct(item), word);
				if (++count >= maxVariations)
				{
					break;
				}
			}
		});
		it(`should mangle and have corrected ${maxVariations} variations of conspiracy`, () => {
			const word = 'conspiracy';
			let count = 0;
			for (const item of mangler.mangle(word)) {
				assert.equal(correcter.correct(item), word);
				if (++count >= maxVariations)
				{
					break;
				}
			}
		});
		it(`should mangle and have corrected ${maxVariations} variations of inside`, () => {
			const word = 'inside';
			let count = 0;
			for (const item of mangler.mangle(word)) {
				assert.equal(correcter.correct(item), word);
				if (++count >= maxVariations)
				{
					break;
				}
			}
		});
		it(`should mangle and have corrected ${maxVariations} variations of job`, () => {
			const word = 'job';
			let count = 0;
			for (const item of mangler.mangle(word)) {
				assert.equal(correcter.correct(item), word);
				if (++count >= maxVariations)
				{
					break;
				}
			}
		});
		it(`should mangle and have corrected ${maxVariations} variations of wake`, () => {
			const word = 'wake';
			let count = 0;
			for (const item of mangler.mangle(word)) {
				assert.equal(correcter.correct(item), word);
				if (++count >= maxVariations)
				{
					break;
				}
			}
		});
	});
});
