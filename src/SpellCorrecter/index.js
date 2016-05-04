import commander from 'commander';
import Cli from '../cli';
import readline from 'readline';
import fs from 'fs';
import SpellCorrecter from './base';

process.on('SIGINT', () => {
	process.exit(0);
});

function readLines (path) {
	return new Promise( (resolve, reject) => {
		const lines = [];

		const lineReader = readline.createInterface({
			input: fs.createReadStream(path)
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

async function init () {
	let words;

	// Wait for file load before doing anything else.
	await new Promise(async function (resolve, reject) {
		let filePath;
		commander
			.version('0.0.1')
			.usage('<path to words file>')
			.description('A helpful app for correcting your atrocious spelling.')
			.arguments('<path>')
			.action((path) => {
				filePath = path;
			})
			.parse(process.argv);

			// Error and abort when no path is given.
			if (filePath === undefined) {
				console.error('No path to words file given! Use --help or -h for usage instructions.');
				process.exit(1);
			}

			// Attempt to read file and load the lines into the words array.
			words = await readLines(filePath);
			console.log('Using words file:', filePath);

			// Continue what we were doing!
			resolve();
	});

	const correcter = new SpellCorrecter(Array.isArray(words) ? words : []);

	// Initialize CLI.
	const cli = new Cli();

	cli
		.connect(process.stdin, process.stdout)
		.action((line) => {
			return correcter.correct(line) || 'NO CORRECTION';
		})
		.on('end', () => process.exit(0))
		.start();
};

init();
