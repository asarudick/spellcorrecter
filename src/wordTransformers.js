import _ from 'lodash';

// Vowels of the English language.
const vowels = 'aeiouy';

function toKey(a, b) { return a + ',' + b; }

/**
 * Returns a prefix generator (analogous to those recursive permutation
 * functions you learned in CS 3xx/4xx) that accepts a callback that itself
 * returns null, or a one-off transformation of the provided prefix, suffix, and
 * character in the form of [ prefix, suffix ]. Each produced generator comes
 * with 2 forms of memoization. One to reduce the number of queue pushes by
 * ensuring queue pushes are unique, and the other ensures that the yielded
 * results are unique.
 * @param  {Function} transform The one-off transform to apply to the current
 *                              iteration.
 * @return {Generator Function}	The prefix generator itself.
 */
function createPrefixGenerator (transform) {

	// Previously yielded prefix + suffix
	const yielded = {};
	const queue = [];

	/**
	 * Queues a prefix and suffix if not already queued.
	 * @param  {string} prefix The prefix to enqueue.
	 * @param  {string} suffix The suffix to enqueue.
	 */
	function enqueue(prefix, suffix) {
		if (!suffix)
		{
			return;
		}
		queue.push([ prefix, suffix ]);
	}

	/**
	 * Iteratively yields each possible variant according to the transformation
	 * given. (Vague wording intentional. See usage in transformations below.)
	 * @param  {string} word	The word to apply transformations to.
	 */
	const gen = function* (word) {

		queue.push([ '', word ]);

		while (queue.length)
		{
			let [ prefix, suffix ] = queue.shift();

			// If we have no suffix this call, then we are done.
			if (!suffix) {
				continue;
			}

			const char = suffix[0];
			suffix = suffix.substr(1);

			// This combination needs no yielding, as it has already been
			// yielded right after being put into the queue, or
			// it is equal to the word.
			enqueue( prefix + char, suffix );

			const result = transform(prefix, suffix, char);

			if (!result)
			{
				continue;
			}

			const [ p, s ] = result;

			enqueue( p, s );

			// If we haven't already produced this string(prefix + suffix),
			// yield it, and mark as yielded.
			if (!(p + s in yielded)) {
				yielded[p + s] = true;
				yield p + s;
			}
		}
	};

	return gen;
}

/**
 * Yields each possible uppercase variant of given word.
 * @param  {string} word The word to apply uppercasing to.
 */
export function* uppercaseChars (word) {

	const generator = createPrefixGenerator(
		(prefix, suffix, char) => [ prefix + char.toUpperCase(), suffix ]
	)(word);

	yield* generator;
}

/**
 * Yields each possible lowercase variant of given word.
 * @param  {string} word The word to apply lowercasing to.
 */
export function* lowercaseChars (word) {

	const generator = createPrefixGenerator(
		(prefix, suffix, char) => [ prefix + char.toLowerCase(), suffix ]
	)(word);

	yield* generator;
}


/**
 * Yields each possible repeated character variant of given word.
 * @param  {string} word 	The word to apply transform to.
 * @param  {int} 	maximum The maximum contiguous repetition of a single
 *                        	character.
 */
export function* addRepeats (word, maximum) {

	function isFullyRepeated(prefix, suffix, char) {
		const normalizedChar = char.toLowerCase();
		const normalizedSuffix = suffix.toLowerCase();
		const normalizedPrefix = prefix.toLowerCase();

		const pattern = _.times(maximum, _.constant(normalizedChar)).join('');

		const ends = normalizedPrefix.substr(-maximum) + normalizedChar + normalizedSuffix.substr(0, maximum - 1);

		return ends.indexOf(pattern) > -1;
	}

	const generator = createPrefixGenerator(
		(prefix, suffix, char) => {
			if (!isFullyRepeated(prefix, suffix, char))
			{
				return [ prefix + char, char + suffix ];
			}
		}
	)(word);

	yield* generator;
}

/**
 * Yields each possible eliminated repeated character variant of given word.
 * @param  {string} word 	The word to apply transform to.
 */
export function* eliminateRepeats (word) {

	const generator = createPrefixGenerator(
		(prefix, suffix, char) => {
			if ( prefix[prefix.length - 1] === char)
			{
				return [ prefix, suffix ];
			}
		}
	)(word);

	yield* generator;
}


/**
 * Yields each possible replaced vowel variant of given word.
 * @param  {string} word 	The word to apply transform to.
 */
export function* vowelReplace (word) {

	const queue = [];

	/**
	 * Queues a prefix and suffix if not already queued.
	 * @param  {string} prefix The prefix to enqueue.
	 * @param  {string} suffix The suffix to enqueue.
	 */
	function enqueue(prefix, suffix) {
		if (!suffix)
		{
			return;
		}
		queue.push([ prefix, suffix ]);
	}

	const gen = function* (value) {

		queue.push([ '', value ]);

		while (queue.length)
		{
			let [ prefix, suffix ] = queue.shift();

			// Chop off the first character of suffix;
			const char = suffix[0];
			suffix = suffix.substr(1);

			// Enqueue the same word, with current character as end of prefix.
			enqueue(prefix + char, suffix);

			const index = vowels.indexOf(char);

			// Rotate through the vowels starting at the next, and ending
			// at the previous, enqueuing each variant.
			if (index > -1) {
				let movingIndex = index;
				while ((movingIndex = (movingIndex + 1) % vowels.length) > -1 && movingIndex !== index) {
					enqueue(prefix + vowels[movingIndex], suffix);
					yield prefix + vowels[movingIndex] + suffix;
				}
			}
		}
	};

	const generator = gen(word);

	yield* generator;
}
