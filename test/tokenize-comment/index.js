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
			{type: '_', text: 'foo'},
		],
		[
			'@foo',
			{type: 'foo', text: ''},
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
			{type: '_', text: 'foo\nbar'},
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
			{type: '_', text: 'foo\nbar'},
			{type: 'foo', text: 'bar'},
			{type: 'foo', text: 'bar\nfoo bar'},
			{type: '☺️', text: '🎵\nfoo bar'},
		],
		[
			[
				'* ',
				'* foo',
				'* bar',
				'* @foo bar',
				'@foo bar',
				'foo bar',
				'* @☺️ 🎵',
				'* foo bar',
			].join('\n'),
			{type: '_', text: 'foo\nbar'},
			{type: 'foo', text: 'bar'},
			{type: 'foo', text: 'bar\nfoo bar'},
			{type: '☺️', text: '🎵\nfoo bar'},
		],
		[
			[
				'* ',
				'* foo',
				'* bar',
				'* @foo bar',
				'@foo bar',
				'foo bar',
				'* @☺️ 🎵',
				'* foo bar',
				' * @baz {foo} baz bar',
				' * @baz {foo|bar.<baz>} [baz] - bar',
				' * @baz {foo} - baz bar',
				' * @baz {foo|bar.<baz>} [baz] - bar',
				' * - foo',
				' * - bar',
				' * *baz*',
			].join('\n'),
			{type: '_', text: 'foo\nbar'},
			{type: 'foo', text: 'bar'},
			{type: 'foo', text: 'bar\nfoo bar'},
			{type: '☺️', text: '🎵\nfoo bar'},
			{type: 'baz', text: 'bar', param: {type: 'foo', name: 'baz'}},
			{type: 'baz', text: 'bar', param: {type: 'foo|bar.<baz>', name: '[baz]'}},
			{type: 'baz', text: 'baz bar', param: {type: 'foo', name: ''}},
			{type: 'baz', text: 'bar\n- foo\n- bar\n*baz*', param: {type: 'foo|bar.<baz>', name: '[baz]'}},
		],
	]
	.forEach(([comment, ...expectedTokens]) => {
		test(comment, (test) => {
			tokenizeComment(comment)
			.forEach((token, index) => {
				test(JSON.stringify(token), () => {
					assert.deepEqual(token, expectedTokens[index]);
				});
			});
		});
	});

});
