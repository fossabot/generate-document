const isRequireCall = require('../is-require-call');
module.exports = function isImport(node) {
	if (isRequireCall(node)) {
		const [{type, value}] = node.arguments;
		return type === 'Literal' && typeof value === 'string' && value;
	}
	return false;
};
