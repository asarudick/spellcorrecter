import { vowelReplace, addRepeats, uppercaseChars } from '../wordTransformers';

const MAXIMUM_REPEATS = 3;

export default class SpellMangler {

	/**
	 * Yields incorrect spellings of the given word by applying
	 * uppercaseChars, addRepeats, and vowelReplace transforms.
	 * @param  {string} word	The word to apply transforms upon.
	 */
	*mangle(word) {

		const yielded = {};
		const queued = {};
		const queue = [];

		function wasYielded(item) {
			return item in yielded;
		}

		/**
		 * Queues a string if not already queued.
		 * @param  {string} str The string to enqueue.
		 */
		function uniqueEnqueue(str) {
			if (!(str in queued)) {
				queued[str] = true;
				queue.push(str);
			}
		}

		// Kick start the process.
		queue.push(word);

		while (queue.length) {

			const item = queue.shift();

			const transformers = [ uppercaseChars(item), vowelReplace(item), addRepeats(item, MAXIMUM_REPEATS) ];

			// For each transform, apply the transform until it can no longer provide unique variants.
			for (let i = 0, length = transformers.length; i < length; i++) {

				let next = null;
				while ((next = transformers[i].next().value) && next !== undefined) {
					if (!wasYielded(next)) {
						yielded[next] = true;
						yield next;
					}
					uniqueEnqueue(next);
				}
			}
		}
	}
}
