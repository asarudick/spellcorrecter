import SpellMangler from './base';
import commander from 'commander';
import readline from 'readline';
import fs from 'fs';

process.on('SIGINT', () => {
	process.exit(0);
});

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

let words;

function sleep (milliseconds) {
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			resolve();
		}, milliseconds);
	});
}




async function init () {
	let filePath;
	commander
		.version('0.0.1')
		.usage('<path to words file>')
		.description('An unnnhalpppfol epp firrr curracteng yoour atricyous spellleng.')
		.arguments('<path>')
		.option('-d, --delay <duration>', 'Interval at which to yield results')
		.action((path) => {
			try {
				filePath = path;
			} catch (e) {
				process.stdout.write(e.message + '\n');
			}
		})
		.parse(process.argv);

	// Error and abort when no path is given.
	if (filePath === undefined) {
		console.error('No path to words file given! Use --help or -h for usage instructions.');
		process.exit(1);
	}

	// Attempt to read file and load the lines into the words array.
	words = await readLines(filePath);

	const mangler = new SpellMangler();

	for (let i = 0, length = words.length; i < length; i++) {
		let value = null;
		const gen = mangler.mangle(words[i]);
		while ((value = gen.next().value) && value !== undefined)
		{
			process.stdout.write(value + '\n');
			await sleep(commander.delay || 0);
		}
	}
};

init();
