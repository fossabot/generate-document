const path = require('path');
const fs = require('fs');
const acorn = require('acorn');
const promisify = require('@nlib/promisify');
const readFile = promisify(fs.readFile);
const walk = require('../walk');
const isImport = require('../is-import');
const Comment = require('../-comment');
const Method = require('../-method');
const Class = require('../-class');

module.exports = class FileParser {

	constructor(file, options) {
		Object.assign(
			this,
			{
				file,
				options,
			}
		);
	}

	start() {
		return this.readFile(this.file)
		.then(() => {
			this.getAbstractSyntaxTree();
			this.walkAbstractSyntaxTree();
		});
	}

	readFile() {
		return readFile(this.file, 'utf8')
		.then((code) => {
			this.code = code;
		});
	}

	getAbstractSyntaxTree() {
		const comments = [];
		this.ast = acorn.parse(
			this.code,
			Object.assign(
				this.options,
				{
					onComment(block, text, start, end) {
						if (block && text.trim().startsWith('*')) {
							comments.push(new Comment(text, start, end));
						}
					},
				}
			)
		);
		this.comments = comments;
	}

	resolve(relativePath) {
		return require.resolve(path.join(path.dirname(this.file), relativePath));
	}

	get unmarkedComments() {
		return this.comments
		.filter((comment) => {
			return !comment.node;
		});
	}

	get fileDependencies() {
		const fileDependencies = new Set();
		for (const dependency of this.dependencies) {
			if (path.isAbsolute(dependency)) {
				fileDependencies.add(dependency);
			}
		}
		return fileDependencies;
	}

	walkAbstractSyntaxTree() {
		this.classes = new Set();
		this.others = new Set();
		this.dependencies = new Set();
		walk(
			this.ast,
			(node) => {
				if (!node) {
					return;
				}
				for (const comment of this.unmarkedComments) {
					if (comment.end <= node.start) {
						comment.assign(node);
					}
				}
				switch (node.type) {
				case 'ClassExpression':
				case 'ClassDeclaration':
					this.classes.add(node);
					break;
				default:
					if (node.comment) {
						this.others.add(node);
					}
				}
				const dependency = isImport(node);
				if (dependency) {
					this.addDependency(dependency);
				}
			},
			{
				ClassExpression: Class,
				ClassDeclaration: Class,
				MethodDefinition: Method,
			}
		);
	}

	addDependency(dependency) {
		if (dependency.startsWith('.')) {
			dependency = this.resolve(dependency);
		}
		this.dependencies.add(dependency);
	}

};
