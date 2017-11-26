const assert = require('assert');
const acorn = require('acorn');
const test = require('@nlib/test');
const isImport = require('../../lib/is-import');

test('isImport', (test) => {

	[
		[
			'require(\'./foo\')',
			'./foo',
		],
		[
			'require(foo)',
			false,
		],
		[
			'import \'./foo\'',
			'./foo',
		],
		[
			'import foo from \'./foo\'',
			'./foo',
		],
		[
			'import {foo} from \'./foo\'',
			'./foo',
		],
	]
	.forEach(([code, expected]) => {
		test(`${JSON.stringify(code)} → ${JSON.stringify(expected)}`, () => {
			const {body: [statement]} = acorn.parse(code, {
				ecmaVersion: 8,
				sourceType: 'module',
			});
			let target;
			switch (statement.type) {
			case 'ExpressionStatement':
				target = statement.expression;
				break;
			case 'ImportDeclaration':
				target = statement;
				break;
			default:
			}
			assert.equal(isImport(target), expected);
		});
	});

});
