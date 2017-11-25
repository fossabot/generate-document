const STATE_END = 0;
const STATE_TEXT = 1;
const STATE_TYPE = 2;

module.exports = function tokenizeComment(comment, fn) {
	const chars = [...comment];
	let state = STATE_TEXT;
	let buffer = [];
	let token = {};
	while (0 < chars.length) {
		const char = chars.shift();
		switch (char) {
		case '\\':
			buffer.push(chars.shift());
			break;
		case '@':
			changeState(STATE_TYPE);
			break;
		case ' ':
			switch (state) {
			case STATE_TYPE:
				changeState(STATE_TEXT);
				break;
			default:
				buffer.push(char);
			}
			break;
		default:
			buffer.push(char);
		}
	}
	changeState(STATE_END);
	function changeState(newState) {
		const buffered = buffer.join('').trim();
		switch (state) {
		case STATE_TEXT:
			token.text = buffered;
			break;
		case STATE_TYPE:
			token.type = buffered;
			break;
		default:
			throw new Error(`Unknown state: ${state}`);
		}
		state = newState;
		buffer = [];
		switch (state) {
		case STATE_TYPE:
		case STATE_END:
			if (token.type || token.text) {
				fn(token);
			}
			token = {};
			break;
		default:
		}
	}
};
