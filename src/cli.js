import readline from 'readline';
import EventEmitter from 'events';
import { Readable, Writable, Duplex, Transform } from 'stream';


export class CliError {
    constructor (message) {
        this.name = 'CliError';
        this.message = message;
        this.stack = (new Error()).stack;
    }
}

export default class Cli extends EventEmitter {
	constructor (datastore) {
		super();

		// Streams.
		this.src = null;
		this.dest = null;

		// To be our readline instance.
		this.rl = null;

		this._action = null;
	}

	/**
	 * Terminates the CLI.
	 */
	end () {
		this.emit('end');
	}

	/**
	 * Sets the src/dest streams to read and write from.
	 * @param  {Stream} src  The stream to read from. e.g. process.stdin
	 * @param  {Stream} dest The stream to write to. e.g. process.stdout
	 */
	connect (src, dest) {

		if (!(src instanceof Readable || src instanceof Duplex || src instanceof Transform)) {
			throw new CliError('Source stream is not a readable stream.');
		}

		if (!(dest instanceof Writable || dest instanceof Duplex || dest instanceof Transform)) {
			throw new CliError('Destination stream is not a writable stream.');
		}

		this.src = src;
		this.dest = dest;
		this.rl = readline.createInterface(src, dest);
		return this;
	}

	action (cb) {
		this._action = cb;
		return this;
	}

	/**
	 * Starts the CLI for the datastore.
	 */
	start () {
		this.rl.setPrompt('> ');
		this.rl.prompt();

		this.rl
			.on('line', (line) => {
				this._onLine(line);
			})
			.on('close', () => {
				this.emit('end');
			});

		return this;
	}

	/**
	 * Handles one line of input.
	 * @param  {string} line The line to process.
	 */
	_onLine (line) {

		let result;

		try {
			if (this._action)
			{
				result = this._action(line);
				this.dest.write(result + '\n');
			}
		}
		catch (e) {
			this.dest.write(e.message + '\n');
		}

		this.rl.prompt();
	}
}
