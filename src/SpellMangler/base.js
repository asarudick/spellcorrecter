import _ from 'lodash';
import {
    vowelReplace,
    addRepeats,
    uppercaseChars
} from '../wordTransformers';

export default class SpellMangler {
    constructor(words) {
        this.words = {};

        _.each(words, (word) => {
            this.words[word] = true;
        });
    }

    *mangle(word) {
        const yielded = {};

        function* gen(value) {

            const stack = [];

            stack.push(value);

            while (stack.length) {

                const item = stack.pop();
				console.log(`item: ${item}`);
                const transformers = [ uppercaseChars(item), vowelReplace(item), addRepeats(item) ];
                for (let i = 0, length = transformers.length; i < length; i++) {

                    let next = null;
                    while ((next = transformers[i].next().value) && next !== undefined) {
                        if (!(next in yielded)) {
                            yielded[next] = true;
                            yield next;
                        }
                        stack.push(next);
                    }
                }
            }
        }
            // 	function* recurse (value) {
            //
            // 		const transformers = [ uppercaseChars(value), vowelReplace(value), addRepeats(value) ];
            //
            // 		for (let i = 0, length = transformers.length; i < length; i++) {
            // 			let next = null;
            // 			while ((next = transformers[i].next().value) && next !== undefined) {
            // 				if (!(next in yielded)) {
            // 					yielded[next] = true;
            // 					yield next;
            // 				}
            // 				yield* recurse(next);
            // 			}
            // 		}
            //
            // 		return;
            // 	}
            //
            // 	yield* recurse(word);
            // }
        const generator = gen(word);

        yield* generator;
    }
}
