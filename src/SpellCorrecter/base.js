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
        const stack = [];
		const words = this.words;

        stack.push(word);

		while (stack.length) {
			const value = stack.pop();

			const transformers = [ lowercaseChars(value), eliminateRepeats(value), vowelReplace(value) ];

			for (let i = 0, length = transformers.length; i < length; i++) {
				let next = null;
				while ((next = transformers[i].next().value) && next !== undefined) {
					if (next in words)
					{
						return next;
					}

					if (!(next in evaluated))
					{
						evaluated[next] = true;
						stack.push(next);
					}

				}
			}
		}
	}
}
