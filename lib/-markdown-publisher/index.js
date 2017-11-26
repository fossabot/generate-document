const fs = require('fs');
const path = require('path');
const getMarkdownDestination = require('../get-markdown-destination');

module.exports = class MarkdownPublisher {

	constructor(generator) {
		this.generator = generator;
	}

	publish() {
		const {root, packageData} = this.generator;
		const writer = fs.createWriteStream(path.join(root, 'readme.md'));
		writer.write(`# ${packageData.name}\n`);
		this.publicClasses = new Map();
		for (const [, parser] of this.generator.parsed) {
			this.publishFile(parser);
		}
		for (const [$class, publicMethods] of this.publicClasses) {
			writer.write(`## ${$class.name}\n`);
			for (const $method of publicMethods) {
				writer.write(`### ${$class.name}.${$method.name}\n`);
			}
		}
		writer.end('\n');
	}

	markdownMethodNode($class, $method, writer) {
		writer.write(`\n### ${$method.name}\n`);
		$class.total++;
		if ($method.comment) {
			if ($method.comment.has('public') && this.publicClasses.has($class)) {
				this.publicClasses.get($class).add($method);
			}
			writer.write(`\n${$method.comment}\n`);
			$method.covered++;
		}
		writer.write(`\nSyntax:<br>\n${$method.syntax}\n`);
		const args = $method.params('param');
		if (0 < args.length) {
			writer.write(`\nArguments:<br>\n${
				args
				.map(({name, type, omittable, text}) => {
					const [argumentName, defaultValue = 'undefined'] = name.split('=');
					return `**${argumentName}** ${omittable ? `(=${defaultValue}) ` : ''} {${type}}${text ? ` ${text.replace(/\s*[\r\n]+\s*/, ' ')}` : ''}`;
				})
				.join('<br>\n')
			}\n`);
		}
		if ($method.kind !== 'constructor') {
			const returns = $method.params('return', 'returns');
			if (0 < returns.length) {
				writer.write(`\n${
					returns
					.map(({type, text}) => {
						return `Returns: {${type}}${text ? ` ${text}` : ''}`;
					})
					.join('\n')
				}\n`);
			}
		}
	}

	markdownClass($class, writer) {
		$class.total = 0;
		$class.covered = 0;
		writer.write(`# Class ${$class.name}`);
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
		for (const $method of $class.methods) {
			this.markdownMethodNode($class, $method, writer);
		}
	}

	publishFile(parser) {
		const writer = fs.createWriteStream(getMarkdownDestination(parser.file));
		parser.total = 0;
		parser.covered = 0;
		for (const $class of parser.classes) {
			this.markdownClass($class, writer);
			parser.total += $class.total;
			parser.covered += $class.covered;
		}
		if (0 < parser.total) {
			writer.write(`\nDocumented: ${parser.covered}/${parser.total} (${(parser.covered / parser.total * 100).toFixed(0)}%)`);
		}
		writer.end('\n');
	}

};
