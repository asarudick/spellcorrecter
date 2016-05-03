import SpellMangler from './base';
import _ from 'lodash';
import commander from 'commander';
import readline from 'readline';
import fs from 'fs';

function readLines (path) {
	return new Promise( (resolve, reject) => {
		const lines = [];
		const stream = fs.createReadStream(path);

		const lineReader = readline.createInterface({
			input: stream
		});

		lineReader
			.on('line', (line) => {
				lines.push(line);
			})
			.on('close', () => {
				resolve(lines);
			});
	});
}
let words, mangler;

commander
	.version('0.0.1')
	.usage('<path>')
	.description('An unnnhalpppfol epp firrr curracteng yoour atricyous spellleng.')
	.arguments('<path>')
	.action(async function (path) {

		try {
			words = await readLines(path);
			mangler = new SpellMangler();
			_.each(words, (word) => {
				let value = null;
				const gen = mangler.mangle(word);
				while ((value = gen.next().value) && value !== undefined)
				{
					console.log(value);

				}
			});
		} catch (e) {
			console.log(e.message);
		}
	})
	.parse(process.argv);
