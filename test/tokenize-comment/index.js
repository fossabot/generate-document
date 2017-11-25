const assert = require('assert');
const test = require('@nlib/test');
const tokenizeComment = require('../../lib/tokenize-comment');

test('tokenizeComment', (test) => {

	[
		[
			'',
		],
		[
			'foo',
			{text: 'foo'},
		],
		[
			'@foo',
			{type: 'foo'},
		],
		[
			'@foo bar',
			{type: 'foo', text: 'bar'},
		],
		[
			[
				'foo',
				'bar',
				'@foo bar',
				'@foo bar',
				'foo bar',
			].join('\n'),
			{text: 'foo\nbar'},
			{type: 'foo', text: 'bar'},
			{type: 'foo', text: 'bar\nfoo bar'},
		],
		[
			[
				'foo',
				'bar',
				'@foo bar',
				'@foo bar',
				'foo bar',
				'@☺️ 🎵',
				'foo bar',
			].join('\n'),
			{text: 'foo\nbar'},
			{type: 'foo', text: 'bar'},
			{type: 'foo', text: 'bar\nfoo bar'},
			{type: '☺️', text: '🎵\nfoo bar'},
		],
	]
	.forEach(([comment, ...expectedTokens]) => {
		test(JSON.stringify(comment), (test) => {
			tokenizeComment(comment, (token) => {
				test(JSON.stringify(token), () => {
					assert.deepEqual(token, expectedTokens.shift());
				});
			});
		});
	});

});
