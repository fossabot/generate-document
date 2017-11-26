const path = require('path');
const fs = require('fs');
const promisify = require('@nlib/promisify');
const readFile = promisify(fs.readFile);
const FileParser = require('../-file-parser');
const MarkdownPublisher = require('../-markdown-publisher');

/**
 * @public
 * A document generator
 */
module.exports = class DocumentGenerator {

	/**
	 * @public
	 * Create a document generator
	 * @param  {String|Object} [options={}] - An object for configuration
	 * @return {undefined}
	 */
	constructor(options = {}) {
		if (typeof options === 'string') {
			options = {input: options};
		}
		let {input = path.join(process.cwd(), 'package.json')} = options;
		if (!path.isAbsolute(input)) {
			input = path.join(process.cwd(), input);
		}
		if (path.basename(input) !== 'package.json') {
			input = path.join(path.dirname(input), 'package.json');
		}
		input = require.resolve(input);
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
				input,
				Parser: options.Parser || FileParser,
				Publisher: options.Publisher || MarkdownPublisher,
				options,
			}
		);
	}

	get root() {
		return path.dirname(this.input);
	}

	/**
	 * Return a file path to package's main script.
	 * @return {String} - A path to the package's main script.
	 */
	get main() {
		return require.resolve(this.root);
	}

	/**
	 * Generate documents
	 * @return {Promise.<undefined>} - A promise resolved after process.
	 */
	start() {
		this.parsed = new Map();
		return this.loadPackageJSON()
		.then(() => {
			return this.parse(this.main);
		})
		.then(() => {
			return new this.Publisher(this)
			.publish();
		});
	}

	/**
	 * @private
	 * Load the package.json and save the parsed object to this.packageData.
	 * @param  {String} [encoding='utf8'] - Encoding used by fs.readFile.
	 * @return {Promise.<Object>} - A Promise will be resolved with parsed package.json.
	 */
	loadPackageJSON(encoding = 'utf8') {
		if (this.packageData) {
			return Promise.resolve(this.packageData);
		}
		return readFile(this.input, encoding)
		.then((jsonString) => {
			this.packageData = JSON.parse(jsonString);
			return this.packageData;
		});
	}

	parse(file) {
		if (this.parsed.has(file)) {
			return Promise.resolve(this.parsed.get(file));
		}
		const parser = new this.Parser(file, this.options.acorn);
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

	get description() {
		const {comments} = this.parsed.get(this.main);
		if (!comments) {
			return '';
		}
		for (const {tokens} of comments) {
			for (const {type, text} of tokens) {
				if (type === 'package') {
					return text;
				}
			}
		}
		return '';
	}

};
