import _ from 'lodash';
import { vowelReplace, addRepeats, uppercaseChars } from '../wordTransformers';

export default class SpellMangler {
	constructor (words) {
		this.words = {};

		_.each(words, (word) => {
			this.words[word] = true;
		});
	}

	*mangle (word) {
		const yielded = {};
		function* recurse (value) {

			const transformers = [ uppercaseChars(value), vowelReplace(value), addRepeats(value) ];

			for (let i = 0, length = transformers.length; i < length; i++) {
				let next = null;
				while ((next = transformers[i].next().value) && next !== undefined) {
					if (!(next in yielded)) {
						yielded[next] = true;
						yield next;
					}
					yield* recurse(next);
				}
			}

			return;
		}

		yield* recurse(word);
	}
}
