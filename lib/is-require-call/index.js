module.exports = function isRequireCall(node) {
	return node.type === 'CallExpression' && node.callee.name === 'require';
};
