import _ from 'lodash';
import SpellCorrecter from '../src/SpellCorrecter/base';
import { describe, it } from 'mocha';
import { assert, expect } from 'chai';

describe('SpellCorrecter', () => {
	let correcter;
	const words = [ 'sheep', 'conspiracy', 'inside', 'job', 'wake' ];

	beforeEach(() => {
		correcter = new SpellCorrecter(words);
	});

	describe('correct', () => {
		it('should correct sheeep -> sheep', () => {
			const result = correcter.correct('sheeep');
			assert.isNotNull(result);
			assert.equal(result, 'sheep');
		});
		it('should correct sheeeeep -> sheep', () => {
			const result = correcter.correct('sheeeeeep');
			assert.isNotNull(result);
			assert.equal(result, 'sheep');
		});
		it('should correct SHEEEEEP -> sheep', () => {
			const result = correcter.correct('SHEEEEEP');
			assert.isNotNull(result);
			assert.equal(result, 'sheep');
		});
		it('should correct SHAAAAP -> sheep', () => {
			const result = correcter.correct('SHAAAAP');
			assert.isNotNull(result);
			assert.equal(result, 'sheep');
		});
		it('should not correct shap -> sheep', () => {
			const result = correcter.correct('shap');
			assert.isUndefined(result);
		});
		it('should not correct sheeple -> sheep', () => {
			const result = correcter.correct('sheeple');
			assert.isUndefined(result);
		});
		it('should correct jjoobbb -> job', () => {
			const result = correcter.correct('jjoobbb');
			assert.isNotNull(result);
			assert.equal(result, 'job');
		});
		it('should correct CUNsperrICY -> conspiracy', () => {
			const result = correcter.correct('CUNsperrICY');
			assert.isNotNull(result);
			assert.equal(result, 'conspiracy');
		});
		it('should correct weke -> wake', () => {
			const result = correcter.correct('weke');
			assert.isNotNull(result);
			assert.equal(result, 'wake');
		});
	});
});
