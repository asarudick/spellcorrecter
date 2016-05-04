import _ from 'lodash';
import { vowelReplace, eliminateRepeats, lowercaseChars } from '../wordTransformers';

export default class SpellCorrecter {
	constructor (words) {
		this.words = {};

		_.each(words, (word) => {
			this.words[word] = true;
		});
	}

	/**
	 * Attempts to correct your spelling by generating variants of the butchery
	 * you've produced to get a hit in the dictionary.
	 * @param  {string} word The misspelled word.
	 * @return {string}      A correctly spelled word that may or may not be
	 *                       what you intended to type.
	 */
	correct (word) {

		// Error if not initialized. Inform the uninformed user.
		if (!Object.keys(this.words).length)
		{
			throw new Error('No words provided. Make sure to initialize the SpellCorrecter with words.');
		}

		const pushed = {};
		const stack = [];
		const words = this.words;

		// Kickoff the process.
		stack.push(word);

		while (stack.length) {
			const value = stack.pop();

			const transformers = [ lowercaseChars(value), eliminateRepeats(value), vowelReplace(value) ];

			// For each transformer, apply it, and...
			//
			// ..if the word is a hit in the dictionary, return it.
			// Otherwise, push result onto stack to use as generator food when
			// we get to it.
			//
			for (let i = 0, length = transformers.length; i < length; i++) {
				let next = null;
				while ((next = transformers[i].next().value) && next !== undefined) {
					if (next in words) {
						return next;
					}

					if (!(next in pushed)) {
						pushed[next] = true;
						stack.push(next);
					}
				}
			}
		}
	}
}
