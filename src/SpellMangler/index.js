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

function sleep (milliseconds) {
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			resolve();
		}, milliseconds);
	});
}

commander
	.version('0.0.1')
	.usage('<path>')
	.description('An unnnhalpppfol epp firrr curracteng yoour atricyous spellleng.')
	.arguments('<path>')
	.action(async function (path) {

		try {
			words = await readLines(path);
			mangler = new SpellMangler();

			for (let i = 0, length = words.length; i < length; i++) {
				let value = null;
				const gen = mangler.mangle(words[i]);
				while ((value = gen.next().value) && value !== undefined)
				{
					process.stdout.write(value + '\n');
					await sleep(200);
				}
			}
		} catch (e) {
			process.stdout.write(e.message + '\n');
		}
	})
	.parse(process.argv);



process.on('SIGINT', () => {
	process.exit(0);
});
