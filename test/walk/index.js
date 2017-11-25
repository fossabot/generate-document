const assert = require('assert');
const acorn = require('acorn');
const test = require('@nlib/test');
const walk = require('../../lib/walk');
test('walk', (test) => {

	[
		[
			'var foo;',
			{type: 'Program'},
			{type: 'VariableDeclaration', kind: 'var'},
			{type: 'VariableDeclarator'},
			{type: 'Identifier', name: 'foo'},
		],
		[
			'let foo;',
			{type: 'Program'},
			{type: 'VariableDeclaration', kind: 'let'},
			{type: 'VariableDeclarator'},
			{type: 'Identifier', name: 'foo'},
		],
		[
			'const foo = 1;',
			{type: 'Program'},
			{type: 'VariableDeclaration', kind: 'const'},
			{type: 'VariableDeclarator'},
			{type: 'Identifier', name: 'foo'},
			{type: 'Literal', value: 1},
		],
		[
			'const [foo, bar] = [1, 2];',
			{type: 'Program'},
			{type: 'VariableDeclaration', kind: 'const'},
			{type: 'VariableDeclarator'},
			{type: 'ArrayPattern'},
			{type: 'Identifier', name: 'foo'},
			{type: 'Identifier', name: 'bar'},
			{type: 'ArrayExpression'},
			{type: 'Literal', value: 1},
			{type: 'Literal', value: 2},
		],
		[
			'const [,, foo = 3, bar = 4] = [1, 2];',
			{type: 'Program'},
			{type: 'VariableDeclaration', kind: 'const'},
			{type: 'VariableDeclarator'},
			{type: 'ArrayPattern'},
			null,
			null,
			{type: 'AssignmentPattern'},
			{type: 'Identifier', name: 'foo'},
			{type: 'Literal', value: 3},
			{type: 'AssignmentPattern'},
			{type: 'Identifier', name: 'bar'},
			{type: 'Literal', value: 4},
			{type: 'ArrayExpression'},
			{type: 'Literal', value: 1},
			{type: 'Literal', value: 2},
		],
		[
			'class Foo extends Bar {static get bar() {} constructor(){} async baz() {}}',
			{type: 'Program'},
			{type: 'ClassDeclaration'},
			{type: 'Identifier', name: 'Foo'},
			{type: 'ClassBody'},
			{type: 'MethodDefinition', kind: 'get', static: true, computed: false},
			{type: 'Identifier', name: 'bar'},
			{type: 'FunctionExpression', async: false, generator: false, expression: false},
			null,
			{type: 'BlockStatement'},
			{type: 'MethodDefinition', kind: 'constructor', static: false, computed: false},
			{type: 'Identifier', name: 'constructor'},
			{type: 'FunctionExpression', async: false, generator: false, expression: false},
			null,
			{type: 'BlockStatement'},
			{type: 'MethodDefinition', kind: 'method', static: false, computed: false},
			{type: 'Identifier', name: 'baz'},
			{type: 'FunctionExpression', async: true, generator: false, expression: false},
			null,
			{type: 'BlockStatement'},
		],
		// [
		// 	'{foo(){},bar:()=>{},* baz(){}}',
		// 	{type: 'Program'},
		// 	{type: 'ObjectExpression'},
		// ],
	]
	.forEach(([code, ...expectedNodes]) => {
		test(code, (test) => {
			const ast = acorn.parse(code, {
				ecmaVersion: 8,
				sourceType: 'module',
			});
			walk(ast, (node) => {
				const expected = expectedNodes.shift();
				if (expected) {
					test(node.type, (test) => {
						for (const key of Object.keys(expected)) {
							test(`${key}: ${node[key]}`, () => {
								assert.deepEqual(node[key], expected[key]);
							});
						}
					});
				} else {
					test(`${node}`, () => {
						assert.equal(node, expected);
					});
				}
			});
		});
	});

});
