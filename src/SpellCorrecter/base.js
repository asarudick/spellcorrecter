import _ from 'lodash';
import { vowelReplace, eliminateRepeats, lowercaseChars } from '../wordTransformers';

export default class SpellCorrecter {
	constructor (words) {
		this.words = {};

		_.each(words, (word) => {
			this.words[word] = true;
		});
	}

	correct (word) {

		const evaluated = {};

		function recurse (value, words) {

			evaluated[value] = true;

			const transformers = [ lowercaseChars(value), eliminateRepeats(value), vowelReplace(value) ];

			for (let i = 0, length = transformers.length; i < length; i++) {
				let next = null;
				while ((next = transformers[i].next().value) && next !== undefined) {
					if (next in words)
					{
						return next;
					}

					if (next in evaluated)
					{
						continue;
					}

					const result = recurse(next, words);

					if (result)
					{
						return result;
					}
				}
			}

			return;
		}

		return recurse(word, this.words);
	}
}
