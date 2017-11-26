module.exports = function tokenizeComment(comment) {
	const tokens = [];
	const chars = [...comment];
	consumeLinePrefix();
	const preamble = consume(/[^@]/).trim();
	if (preamble) {
		tokens.push({type: '_', text: preamble});
	}
	while (0 < chars.length) {
		consume(/@/);
		const token = {type: consumeNonSpaces()};
		consumeSpaces();
		let next = consumeNonSpaces();
		if (/^\{\S+\}$/.test(next)) {
			consumeSpaces();
			token.param = {
				type: next.slice(1, -1),
				name: consume(/[^\s-]/),
			};
			next = '';
			consume(/[\s*-]/);
		}
		token.text = `${next}${consume(/[^@]/)}`.trim();
		tokens.push(token);
	}
	return tokens;
	function consume(regExp) {
		const buffer = [];
		while (0 < chars.length && regExp.test(chars[0])) {
			const char = chars.shift();
			switch (char) {
			case '\\':
				buffer.push(chars.shift());
				break;
			case '\r':
				buffer.push(char);
				if (chars[0] !== '\n') {
					consumeLinePrefix();
				}
				break;
			case '\n':
				buffer.push(char);
				consumeLinePrefix();
				break;
			default:
				buffer.push(char);
			}
		}
		return buffer.join('');
	}
	function consumeLinePrefix() {
		consumeSpaces();
		consume(/\*/);
		consumeSpaces();
	}
	function consumeSpaces() {
		return consume(/\s/);
	}
	function consumeNonSpaces() {
		return consume(/\S/);
	}
};
