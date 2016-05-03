import _ from 'lodash';
import Cli, { CliError } from '../src/Cli';
import { describe, it } from 'mocha';
import { assert, expect } from 'chai';
import { PassThrough } from 'stream';

describe('Cli', () => {
	let cli;

	beforeEach(() => {
		cli = new Cli();
	});

	describe('end', () => {
		it(`should send 'end' event`, () => {
			let called = false;

			cli.on('end', () => {
				called = true;
			});

			cli.end();

			assert.isTrue(called);
		});
	});

	describe('connect', () => {
		it('should throw error if src is not readable.', () => {
            expect(() => {
				cli.connect(null, process.stdout);
            }).to.throw(CliError);
		});
		it('should throw error if dest is not writable.', () => {
            expect(() => {
				cli.connect(process.stdin, null);
            }).to.throw(CliError);
		});
		it('should not throw error if src is readable.', () => {
            expect(() => {
				cli.connect(process.stdin, process.stdout);
            }).to.not.throw(CliError);
		});
		it('should not throw error if dest is writable.', () => {
            expect(() => {
				cli.connect(process.stdin, process.stdout);
            }).to.not.throw(CliError);
		});
		it('should set src, dest, and rl properties', () => {
			const src = new PassThrough();
			const dest = new PassThrough();

			cli.connect(src, dest);

			assert.isNotNull(cli.src);
			assert.isNotNull(cli.dest);
			assert.isNotNull(cli.rl);
		});
	});
});
