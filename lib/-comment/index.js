const tokenizeComment = require('../tokenize-comment');

module.exports = class Comment extends Map {

	constructor(source, start, end) {
		const tokens = tokenizeComment(source);
		Object.assign(
			super(),
			{
				source,
				tokens,
				start,
				end,
			}
		);
		for (const token of tokens) {
			if (!this.has(token.type)) {
				this.set(token.type, new Set());
			}
			this.get(token.type).add(token);
		}
	}

	assign(node) {
		if (node.type === 'ExpressionStatement') {
			const {expression: {type, right}} = node;
			if (type === 'AssignmentExpression') {
				node = right;
			}
		}
		this.node = node;
		node.comment = this;
	}

	get(key) {
		return super.get(key) || new Set();
	}

	getArray(...keys) {
		return [].concat(...keys.map((key) => {
			return Array.from(this.get(key));
		}))
		.sort(({start: a}, {start: b}) => {
			return a < b ? 1 : -1;
		});
	}

	getArrayOf(key) {
		return Array.from(this.get(key));
	}

	getText(key) {
		return this.getArrayOf(key)
		.map((token) => {
			return token.text;
		})
		.join('\n');
	}

	toString() {
		return [
			'_',
			'public',
			'private',
		]
		.map((key) => {
			return this.getText(key);
		})
		.join('\n')
		.trim();
	}

};
