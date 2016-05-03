
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

	// Callbacks that are considered 'rules' to apply to each iteration.
	const rules = Array.prototype.slice.call(arguments);

	const gen = function* (value) {
		const stack = [];

		stack.push([ '', value ]);

		while (stack.length)
		{
			let [ prefix, suffix ] = stack.pop();

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
				stack.push([ prefix + char, suffix ]);
			}

			const result = transform(prefix, suffix, char);

			if (!result)
			{
				continue;
			}

			const [ p, s ] = result;

			if ( !wasEvaluated(p, s) ) {
				stack.push([ p, s ]);
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

export function* addRepeats (word) {

	const generator = createPrefixGenerator(
		(prefix, suffix, char) => {
			const normalizedChar = char.toLowerCase();
			const normalizedSuffix = suffix.toLowerCase();
			const normalizedPrefix = prefix.toLowerCase();
			const fullyRepeated = normalizedSuffix.length >= 2 && normalizedChar === normalizedSuffix[0] && normalizedChar === normalizedSuffix[1]
						|| normalizedSuffix.length >= 1 && normalizedPrefix.length && normalizedPrefix[normalizedPrefix.length - 1] === normalizedChar && normalizedSuffix[0] === normalizedChar
						|| normalizedPrefix.length >= 2 && normalizedPrefix[normalizedPrefix.length - 2] === normalizedChar && normalizedPrefix[normalizedPrefix.length - 1] === normalizedChar
						|| normalizedPrefix.length >= 3 && normalizedPrefix[normalizedPrefix.length - 3] === normalizedChar && normalizedPrefix[normalizedPrefix.length - 2] === normalizedChar && normalizedPrefix[normalizedPrefix.length - 1] === normalizedChar;

			if (!fullyRepeated)
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
	function* recurse (prefix, suffix) {
		if (!suffix) {
			yield prefix;
			return;
		}

		const char = suffix[0];
		suffix = suffix.substr(1);

		const index = vowels.indexOf(char);

		yield* recurse(prefix + char, suffix);

		if (index > -1) {
			let movingIndex = index;
			while ((movingIndex = (movingIndex + 1) % vowels.length) > -1 && movingIndex !== index) {
				yield* recurse(prefix + vowels[movingIndex], suffix);
			}
		}
	}

	const generator = recurse('', word);

	// The first result is the actual word itself, so we can skip.
	generator.next();

	yield* generator;
}
