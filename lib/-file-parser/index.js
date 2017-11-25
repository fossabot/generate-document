const path = require('path');
const fs = require('fs');
const acorn = require('acorn');
const promisify = require('@nlib/promisify');
const readFile = promisify(fs.readFile);
const walk = require('../walk');
const isImport = require('../is-import');

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
							comments.push({text, start, end});
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
		this.classes = new Map();
		this.others = new Set();
		this.dependencies = new Set();
		walk(this.ast, (node, ancestors) => {
			if (!node) {
				return;
			}
			node.ancestors = ancestors;
			for (const comment of this.unmarkedComments) {
				if (comment.end < node.start) {
					comment.node = node;
					node.comment = comment;
				}
			}
			if (node.type === 'MethodDefinition') {
				this.addClassMethod(node);
			} else if (node.comment) {
				this.addOthers(node);
			}
			const dependency = isImport(node);
			if (dependency) {
				this.addDependency(dependency);
			}
		});
	}

	addClassMethod(node) {
		const classNode = node.ancestors[node.ancestors.length - 2];
		if (!this.classes.has(classNode)) {
			this.classes.set(classNode, new Set());
		}
		const methods = this.classes.get(classNode);
		methods.add(node);
	}

	addOthers(node) {
		this.others.add(node);
	}

	addDependency(dependency) {
		if (dependency.startsWith('.')) {
			dependency = this.resolve(dependency);
		}
		this.dependencies.add(dependency);
	}

};
