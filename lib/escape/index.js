module.exports = function escape(string) {
	return string
	.split('<').join('&lt;')
	.split('>').join('&gt;');
};
