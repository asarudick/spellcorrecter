
const vowels = [ 'a', 'e', 'i', 'o', 'u', 'y' ];

export function* uppercaseChars (word) {
		// Prefix/suffix combination previously evaluated.
		const evaluated = {};

		// Previously yielded prefix + suffix
		const yielded = {};

		const stack = [];

		function toKey(a, b) { return a + ',' + b; }
		//
		// function* recurse (prefix, suffix) {
		// 	if (toKey(prefix, suffix) in evaluated) {
		// 		return;
		// 	}
		//
		// 	// Mark as evaluated to prevent duplicate recursion.
		// 	evaluated[toKey(prefix, suffix)] = true;
		//
		// 	// If we haven't already produced this string(prefix + suffix),
		// 	// yield it, and mark as yielded.
		// 	if (!(prefix + suffix in yielded)) {
		// 		yielded[prefix + suffix] = true;
		// 		yield prefix + suffix;
		// 	}
		//
		// 	// If we have no suffix this call, then we are done.
		// 	if (!suffix) {
		// 		return;
		// 	}
		//
		// 	const char = suffix[0];
		// 	suffix = suffix.substr(1);
		//
		// 	if (!(toKey(prefix + char.toUpperCase(), suffix) in evaluated)) {
		// 		yield* recurse(prefix + char.toUpperCase(), suffix);
		// 	}
		//
		// 	if (!(toKey(prefix + char, suffix) in evaluated)) {
		// 		yield* recurse(prefix + char, suffix);
		// 	}
		// }

		function* generate (value) {

			stack.push([ '', value ]);

			let prefix = null,
				suffix = null;

			while (stack.length)
			{
				[ prefix, suffix ] = stack.pop();

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

				if (!(toKey(prefix + char.toUpperCase(), suffix) in evaluated)) {
					stack.push([ prefix + char.toUpperCase(), suffix ]);
				}

				if (!(toKey(prefix + char, suffix) in evaluated)) {
					stack.push([ prefix + char, suffix ]);
				}
			}
		}

		const generator = generate('', word);

		// The first result is the actual word itself, so we can skip.
		generator.next();

		yield* generator;
}

export function* lowercaseChars (word) {
		// Prefix/suffix combination previously evaluated.
		const evaluated = {};

		// Previously yielded prefix + suffix
		const yielded = {};

		function toKey(a, b) { return a + ',' + b; }

		function* recurse (prefix, suffix) {
			if (toKey(prefix, suffix) in evaluated) {
				return;
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
				return;
			}

			const char = suffix[0];
			suffix = suffix.substr(1);

			if (!(toKey(prefix + char.toLowerCase(), suffix) in evaluated)) {
				yield* recurse(prefix + char.toLowerCase(), suffix);
			}

			if (!(toKey(prefix + char, suffix) in evaluated)) {
				yield* recurse(prefix + char, suffix);
			}
		}

		const generator = recurse('', word);

		// The first result is the actual word itself, so we can skip.
		generator.next();

		yield* generator;
}

export function* addRepeats (word) {
		// Prefix/suffix combination previously evaluated.
		const evaluated = {};

		// Previously yielded prefix + suffix
		const yielded = {};

		function toKey(a, b) { return a + ',' + b; }

		function* recurse (prefix, suffix) {
			if (toKey(prefix, suffix) in evaluated) {
				return;
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
				return;
			}

			const char = suffix[0];
			const normalizedChar = char.toLowerCase();
			const normalizedSuffix = suffix.toLowerCase();
			const normalizedPrefix = prefix.toLowerCase();
			const fullyRepeated = normalizedSuffix.length >= 3 && normalizedChar === normalizedSuffix[1] && normalizedChar === normalizedSuffix[2]
						|| 	normalizedSuffix.length >= 2 && normalizedPrefix.length && normalizedPrefix[normalizedPrefix.length - 1] === normalizedChar && normalizedSuffix[1] === normalizedChar
						|| 	normalizedPrefix.length >= 2 && normalizedPrefix[normalizedPrefix.length - 2] === normalizedChar && normalizedPrefix[normalizedPrefix.length - 1] === normalizedChar;

			// If it hasn't already repeated 3 times, repeat it.
			if (!fullyRepeated && !(toKey(prefix + char, suffix) in evaluated)) {
				yield* recurse(prefix + char, suffix);
			}

			suffix = suffix.substr(1);
			if (!(toKey(prefix + char, suffix) in evaluated)) {
				yield* recurse(prefix + char, suffix);
			}
		}

		const generator = recurse('', word);

		// The first result is the actual word itself, so we can skip.
		generator.next();

		yield* generator;
}

export function* eliminateRepeats (word) {
		// Prefix/suffix combination previously evaluated.
		const evaluated = {};

		// Previously yielded prefix + suffix
		const yielded = {};

		function toKey(a, b) { return a + ',' + b; }

		function* recurse (prefix, suffix) {
			if (toKey(prefix, suffix) in evaluated) {
				return;
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
				return;
			}

			const char = suffix[0];
			suffix = suffix.substr(1);

			if (!(toKey(prefix + char, suffix) in evaluated)) {
				yield* recurse(prefix + char, suffix);
			}

			if (prefix[prefix.length - 1] === char && !(toKey(prefix, suffix) in evaluated)) {
				yield* recurse(prefix, suffix);
			}
		}

		const generator = recurse('', word);

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
