const path = require('path');
const fs = require('fs');
const promisify = require('@nlib/promisify');
const readFile = promisify(fs.readFile);
const FileParser = require('../-file-parser');
const REGEXP_TRIM = require('../regexp-trim');

module.exports = class DocumentGenerator {

	/**
	 * Create a document generator
	 * @param  {String} file A file path to package.json
	 * @param  {Object} [options={}] An object for configuration
	 * @return {undefined}
	 */
	constructor(file, options = {}) {
		if (!path.isAbsolute(file)) {
			file = path.join(process.cwd(), file);
		}
		if (path.basename(file) !== 'package.json') {
			file = path.join(file, 'package.json');
		}
		file = require.resolve(file);
		options.acorn = Object.assign(
			{
				ecmaVersion: 8,
				sourceType: 'module',
			},
			options.acorn
		);
		Object.assign(
			this,
			{
				file,
				options,
			}
		);
	}

	get root() {
		return path.dirname(this.file);
	}

	/**
	 * Return a file path to package's main script.
	 * @return {String} A path to the package's main script.
	 */
	get main() {
		return require.resolve(this.root);
	}

	/**
	 * Generate documents
	 * @return {Promise.<undefined>} A promise resolved after process.
	 */
	start() {
		this.parsed = new Map();
		return this.loadJSON()
		.then(() => {
			return this.parse(this.main);
		})
		.then(() => {
			this.comments = new Set();
			for (const [, {comments}] of this.parsed) {
				for (const comment of comments) {
					this.addComment(comment);
				}
			}
			// for (const comment of this.comments) {
			// 	console.log(comment);
			// }
		});
	}

	addComment({text}) {
		const lines = text.replace(REGEXP_TRIM, '').split(/\r\n|\r|\n/)
		.map((line) => {
			return line.replace(REGEXP_TRIM, '');
		});
		this.comments.add(lines.join('\n'));
	}

	/**
	 * Load the package.json and save the parsed object to this.package.
	 * @param  {String} [encoding='utf8'] Encoding used by fs.readFile.
	 * @return {Promise.<Object>} A Promise will be resolved with parsed package.json.
	 */
	loadJSON(encoding = 'utf8') {
		if (this.package) {
			return Promise.resolve(this.package);
		}
		return readFile(this.file, encoding)
		.then((jsonString) => {
			this.package = JSON.parse(jsonString);
			return this.package;
		});
	}

	parse(file) {
		if (this.parsed.has(file)) {
			return Promise.resolve(this.parsed.get(file));
		}
		const parser = new FileParser(file, this.options.acorn);
		return parser.start()
		.then(() => {
			this.parsed.set(file, parser);
			return Promise.all(
				Array.from(parser.fileDependencies)
				.map((dependency) => {
					return this.parse(dependency);
				})
			);
		});
	}

};
