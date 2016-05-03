import _ from 'lodash';
import {
    vowelReplace,
    addRepeats,
    uppercaseChars
} from '../wordTransformers';

const maximumRepeats = 3;

export default class SpellMangler {
    constructor(words) {
        this.words = {};

        _.each(words, (word) => {
            this.words[word] = true;
        });
    }

    *mangle(word) {
        const yielded = {};
		const evaluated = {};

		function wasEvaluated(item) {
			return item in evaluated;
		}
		function wasYielded(item) {
			return item in yielded;
		}

        function* gen(value) {

            const queue = [];

            queue.push(value);

            while (queue.length) {

                const item = queue.shift();
				evaluated[item] = true;

                const transformers = [ uppercaseChars(item), vowelReplace(item), addRepeats(item, maximumRepeats) ];
                for (let i = 0, length = transformers.length; i < length; i++) {

                    let next = null;
                    while ((next = transformers[i].next().value) && next !== undefined) {
                        if (!wasYielded(next)) {
                            yielded[next] = true;
                            yield next;
                        }
						if (!wasEvaluated(next))
						{
							queue.push(next);
						}
                    }
                }
            }
        }

        const generator = gen(word);

        yield* generator;
    }
}
