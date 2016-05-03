
// # Word Correction Take-Home
//
// Write a program in JavaScript that reads a large list of English words (e.g. from /usr/share/dict/words on a unix system) into memory,
// and then reads words from stdin, and prints either the best spelling correction, or "NO CORRECTION" if no suitable correction can be found.
//
// The program should print "> " as a prompt before reading each word, and should loop until killed.
//
// For example:
//
//     $node ./spellcorrecter.js
//     > sheeeeep
//     sheep
//     > CUNsperrICY
//     conspiracy
//     > sheeple
//     NO CORRECTION
//
// The class of spelling mistakes to be corrected is as follows:
//
// 1. Case (upper/lower) errors `inSIDE -> inside`
// 2. Repeated letters `jjoobbb -> job`
// 3. Incorrect vowels `weke -> wake`
// 4. Any combination of the above types of errors `CUNsperrICY -> conspiracy`
//
//
// Your solution should be faster than O(n) per word checked, where n is the length of the dictionary.
// That is to say, you can't scan the dictionary every time you want to spellcheck a word.

// If there are many possible corrections of an input word, your program can choose one in any way you like,
// however your results *must* match the examples above (e.g. "sheeeeep" should return "sheep" and not "shap").
//
// ## Incorrect Word Generator
//
// Write a second program that generates words with spelling mistakes of the above form, starting with correctly spelled English words.
// Pipe its output into the first program and verify that there are no occurrences of "NO CORRECTION" in the output.


import commander from 'commander';
import Cli from '../cli';
import readline from 'readline';
import fs from 'fs';
import SpellCorrecter from './base';

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

let words, correcter;

commander
	.version('0.0.1')
	.usage('<path>')
	.description('A helpful app for correcting your atrocious spelling.')
	.arguments('<path>')
	.action(async function (path) {
		words = await readLines(path);
		correcter = new SpellCorrecter(Array.isArray(words) ? words : []);
	})
	.parse(process.argv);


const cli = new Cli();

cli
	.connect(process.stdin, process.stdout)
	.action((line) => {
		return correcter.correct(line) || 'NO CORRECTION';
	})
	.on('end', () => process.exit(0))
	.start();
