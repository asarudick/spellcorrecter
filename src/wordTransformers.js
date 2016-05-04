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

	// Prefix/suffix combination previously evaluated.
	const queued = {};

	// Previously yielded prefix + suffix
	const yielded = {};
	const queue = [];

	/**
	 * Queues a prefix and suffix if not already queued.
	 * @param  {string} prefix The prefix to enqueue.
	 * @param  {string} suffix The suffix to enqueue.
	 */
	function uniqueEnqueue(prefix, suffix) {
		if ( !(toKey(prefix, suffix) in queued) ) {
			queued[toKey(prefix, suffix)] = true;
			queue.push([ prefix, suffix ]);
		}
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

			// If we haven't already produced this string(prefix + suffix),
			// yield it, and mark as yielded.
			if (!(prefix + suffix in yielded)) {
				yielded[prefix + suffix] = true;
				yield prefix + suffix;
			}

			// If we have no suffix this call, then we are done.
			if (!suffix) {
				continue;
			}

			const char = suffix[0];
			suffix = suffix.substr(1);

			uniqueEnqueue( prefix + char, suffix );

			const result = transform(prefix, suffix, char);

			if (!result)
			{
				continue;
			}

			const [ p, s ] = result;

			uniqueEnqueue( p, s );
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

	// The first result is the actual word itself, so we can skip.
	generator.next();

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

	// The first result is the actual word itself, so we can skip.
	generator.next();

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

	// The first result is the actual word itself, so we can skip.
	generator.next();

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

	// The first result is the actual word itself, so we can skip.
	generator.next();

	yield* generator;
}


/**
 * Yields each possible replaced vowel variant of given word.
 * @param  {string} word 	The word to apply transform to.
 */
export function* vowelReplace (word) {

	const queue = [];

	// Prefix/suffix combination previously evaluated.
	const queued = {};

	// Previously yielded prefix + suffix
	const yielded = {};

	function wasYielded(prefix, suffix) {
		return prefix + suffix in yielded;
	}

	/**
	 * Queues a prefix and suffix if not already queued.
	 * @param  {string} prefix The prefix to enqueue.
	 * @param  {string} suffix The suffix to enqueue.
	 */
	function uniqueEnqueue(prefix, suffix) {
		if ( !(toKey(prefix, suffix) in queued) ) {
			queued[toKey(prefix, suffix)] = true;
			queue.push([ prefix, suffix ]);
		}
	}

	const gen = function* (value) {

		queue.push([ '', value ]);

		while (queue.length)
		{
			let [ prefix, suffix ] = queue.shift();

			// Ensure we have something unique. If so, yield it.
			if (!wasYielded(prefix, suffix) && prefix + suffix !== value) {
				yielded[prefix + suffix] = true;
				yield prefix + suffix;
			}

			// If we have no suffix this call, then we are done.
			if (!suffix) {
				continue;
			}

			// Chop off the first character of suffix;
			const char = suffix[0];
			suffix = suffix.substr(1);

			// Enqueue the same word, with current character as end of prefix.
			uniqueEnqueue(prefix + char, suffix);

			const index = vowels.indexOf(char);

			// Rotate through the vowels starting at the next, and ending
			// at the previous, enqueuing each variant.
			if (index > -1) {
				let movingIndex = index;
				while ((movingIndex = (movingIndex + 1) % vowels.length) > -1 && movingIndex !== index) {
					uniqueEnqueue(prefix + vowels[movingIndex], suffix);
				}
			}
		}
	};

	const generator = gen(word);

	yield* generator;
}
