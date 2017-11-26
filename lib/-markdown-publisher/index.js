const fs = require('fs');
const path = require('path');
const getMarkdownDestination = require('../get-markdown-destination');
const markdownSyntax = require('../markdown-syntax');

module.exports = class MarkdownPublisher {

	constructor(generator) {
		this.generator = generator;
	}

	publish() {
		const {root, packageData, description} = this.generator;
		const writer = fs.createWriteStream(path.join(root, 'readme.md'));
		writer.write(`# ${packageData.name}\n`);
		if (description) {
			writer.write(`\n${description}\n`);
		}
		this.publicClasses = new Map();
		this.publicFunctions = new Set();
		for (const [, parser] of this.generator.parsed) {
			this.publishFile(parser);
		}
		if (0 < this.publicClasses.size) {
			writer.write('\n# Classes\n');
			for (const [$class, publicMethods] of this.publicClasses) {
				this.markdownClass($class, writer, true);
				for (const $method of publicMethods) {
					this.markdownMethodNode($method, writer);
				}
			}
			writer.write('\n');
		}
		if (0 < this.publicFunctions.size) {
			writer.write('\n# Functions\n');
			for (const $function of this.publicFunctions) {
				this.markdownFunction($function, true);
			}
			writer.write('\n');
		}
		writer.end('\n');
	}

	markdownMethodNode($method, writer) {
		writer.write(`\n### ${$method.name}\n`);
		if ($method.comment) {
			if ($method.comment.has('public') && this.publicClasses.has($method.class)) {
				this.publicClasses.get($method.class).add($method);
			}
			writer.write(`\n${$method.comment}\n`);
			$method.covered++;
		}
		markdownSyntax($method, writer);
	}

	markdownClass($class, writer, skipMethods = false) {
		$class.total = 0;
		$class.covered = 0;
		writer.write(`\n## Class ${$class.name}`);
		if ($class.superClass) {
			writer.write(` extends ${$class.superClass.name}`);
		}
		writer.write('\n');
		$class.total++;
		if ($class.comment) {
			writer.write(`\n${$class.comment}\n`);
			if ($class.comment.has('public')) {
				this.publicClasses.set($class, new Set());
			}
			$class.covered++;
		}
		if (!skipMethods) {
			for (const $method of $class.methods) {
				this.markdownMethodNode($method, writer);
			}
		}
	}

	markdownFunction($function, writer) {
		writer.write(`\n### ${$function.name}\n`);
		if ($function.comment) {
			if ($function.comment.has('public')) {
				this.publicFunctions.add($function);
			}
			writer.write(`\n${$function.comment}\n`);
		}
		markdownSyntax($function, writer);
	}

	publishFile(parser) {
		const writer = fs.createWriteStream(getMarkdownDestination(parser.file));
		parser.total = 0;
		parser.covered = 0;
		if (0 < parser.classes.size) {
			writer.write('# Classes\n');
			for (const $class of parser.classes) {
				this.markdownClass($class, writer);
				parser.total += $class.total;
				parser.covered += $class.covered;
			}
			writer.write('\n');
		}
		if (0 < parser.functions.size) {
			writer.write('# Functions\n');
			for (const $function of parser.functions) {
				parser.total++;
				if ($function.comment) {
					parser.covered++;
				}
				this.markdownFunction($function, writer);
			}
			writer.write('\n');
		}
		if (0 < parser.total) {
			writer.write(`\nDocumented: ${parser.covered}/${parser.total} (${(parser.covered / parser.total * 100).toFixed(0)}%)`);
		}
		writer.end('\n');
	}

};
