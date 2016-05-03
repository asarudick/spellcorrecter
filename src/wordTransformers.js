
import _ from 'lodash';

const vowels = 'aeiouy';

function toKey(a, b) { return a + ',' + b; }

function createPrefixGenerator (transform) {

	// Prefix/suffix combination previously evaluated.
	const evaluated = {};

	// Previously yielded prefix + suffix
	const yielded = {};

	function wasEvaluated(prefix, suffix) {
		return toKey(prefix, suffix) in evaluated;
	}

	const gen = function* (value) {
		const queue = [];

		queue.push([ '', value ]);

		while (queue.length)
		{
			let [ prefix, suffix ] = queue.shift();

			// console.log(`prefix: ${prefix}, suffix: ${suffix}`);

			if (toKey(prefix, suffix) in evaluated) {
				continue;
			}

			// Mark as evaluated to prevent duplicate recursion.
			evaluated[toKey(prefix, suffix)] = true;

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

			if ( !wasEvaluated(prefix + char, suffix) ) {
				queue.push([ prefix + char, suffix ]);
			}

			const result = transform(prefix, suffix, char);

			if (!result)
			{
				continue;
			}

			const [ p, s ] = result;

			if ( !wasEvaluated(p, s) ) {
				queue.push([ p, s ]);
			}
		}
	};

	return gen;
}
export function* uppercaseChars (word) {

	const generator = createPrefixGenerator(
		(prefix, suffix, char) => [ prefix + char.toUpperCase(), suffix ]
	)(word);

	// The first result is the actual word itself, so we can skip.
	generator.next();

	yield* generator;
}

export function* lowercaseChars (word) {

	const generator = createPrefixGenerator(
		(prefix, suffix, char) => [ prefix + char.toLowerCase(), suffix ]
	)(word);

	// The first result is the actual word itself, so we can skip.
	generator.next();

	yield* generator;
}

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

export function* vowelReplace (word) {

	// Prefix/suffix combination previously evaluated.
	const evaluated = {};

	// Previously yielded prefix + suffix
	const yielded = {};

	function wasEvaluated(prefix, suffix) {
		const result = toKey(prefix, suffix) in evaluated;
		return result;
	}

	function wasYielded(prefix, suffix) {
		const result = prefix + suffix in yielded;
		return result;
	}

	const gen = function* (value) {
		const queue = [];

		queue.push([ '', value ]);

		while (queue.length)
		{
			let [ prefix, suffix ] = queue.shift();

			if (wasEvaluated(prefix, suffix)) {
				continue;
			}

			// Mark as evaluated to prevent duplicate recursion.
			evaluated[toKey(prefix, suffix)] = true;

			if (!wasYielded(prefix, suffix) && prefix + suffix !== value) {
				yielded[prefix + suffix] = true;
				yield prefix + suffix;
			}

			// If we have no suffix this call, then we are done.
			if (!suffix) {
				continue;
			}

			const char = suffix[0];
			suffix = suffix.substr(1);

			if ( !wasEvaluated(prefix + char, suffix) ) {
				queue.push([ prefix + char, suffix ]);
			}

			const index = vowels.indexOf(char);

			if (index > -1) {
				let movingIndex = index;
				while ((movingIndex = (movingIndex + 1) % vowels.length) > -1 && movingIndex !== index) {
					if ( !wasEvaluated(prefix + vowels[movingIndex], suffix) ) {
						queue.push([ prefix + vowels[movingIndex], suffix ]);
					}
				}
			}
		}
	};

	const generator = gen(word);

	yield* generator;
}
