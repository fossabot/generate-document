module.exports = function isImport(node) {
	if (node.type === 'CallExpression' && node.callee.name === 'require') {
		const [{type, value}] = node.arguments;
		return type === 'Literal' && typeof value === 'string' && value;
	} else if (node.type === 'ImportDeclaration') {
		return node.source.value;
	}
	return false;
};
