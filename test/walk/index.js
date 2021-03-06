const assert = require('assert');
const acorn = require('acorn');
const {base} = require('acorn/dist/walk');
const test = require('@nlib/test');
const walk = require('../../lib/walk');
const groups = new Set([
	'Class',
	'Expression',
	'ForInit',
	'Function',
	'MemberPattern',
	'Pattern',
	'ScopeBody',
	'ScopeExpression',
	'Statement',
	'VariablePattern',
]);
const coverage = new Map(
	[
		...Object.keys(base),
		'ClassBody',
		'ExportSpecifier',
		'SwitchCase',
		'TemplateElement',
	]
	.filter((type) => {
		return !groups.has(type);
	})
	.sort()
	.map((type) => {
		return [type, 0];
	})
);
coverage.delete('Statement');

test('walk', (test) => {

	[
		[
			'',
			[
				{type: 'Program'},
			],
		],
		[
			'[]',
			[
				{type: 'Program'},
				{type: 'ExpressionStatement'},
				{type: 'ArrayExpression'},
			],
		],
		[
			'[]=[]',
			[
				{type: 'Program'},
				{type: 'ExpressionStatement'},
				{type: 'AssignmentExpression'},
				{type: 'ArrayPattern'},
				{type: 'ArrayExpression'},
			],
		],
		[
			'()=>{}',
			[
				{type: 'Program'},
				{type: 'ExpressionStatement'},
				{type: 'ArrowFunctionExpression'},
				{type: 'BlockStatement'},
			],
		],
		[
			'(foo=0)=>{}',
			[
				{type: 'Program'},
				{type: 'ExpressionStatement'},
				{type: 'ArrowFunctionExpression'},
				{type: 'AssignmentPattern'},
				{type: 'Identifier', name: 'foo'},
				{type: 'Literal', value: 0},
				{type: 'BlockStatement'},
			],
		],
		[
			'async()=>{await 0}',
			[
				{type: 'Program'},
				{type: 'ExpressionStatement'},
				{type: 'ArrowFunctionExpression', async: true},
				{type: 'BlockStatement'},
				{type: 'ExpressionStatement'},
				{type: 'AwaitExpression'},
				{type: 'Literal', value: 0},
			],
		],
		[
			'0+1',
			[
				{type: 'Program'},
				{type: 'ExpressionStatement'},
				{type: 'BinaryExpression', operator: '+'},
				{type: 'Literal', value: 0},
				{type: 'Literal', value: 1},
			],
		],
		[
			'foo:{break foo}',
			[
				{type: 'Program'},
				{type: 'LabeledStatement'},
				{type: 'Identifier', name: 'foo'},
				{type: 'BlockStatement'},
				{type: 'BreakStatement'},
				{type: 'Identifier', name: 'foo'},
			],
		],
		[
			'foo()',
			[
				{type: 'Program'},
				{type: 'ExpressionStatement'},
				{type: 'CallExpression'},
				{type: 'Identifier', name: 'foo'},
			],
		],
		[
			'try{}catch(foo){}finally{}',
			[
				{type: 'Program'},
				{type: 'TryStatement'},
				{type: 'BlockStatement'},
				{type: 'CatchClause'},
				{type: 'Identifier', name: 'foo'},
				{type: 'BlockStatement'},
				{type: 'BlockStatement'},
			],
		],
		[
			'class Foo extends Bar{}',
			[
				{type: 'Program'},
				{type: 'ClassDeclaration'},
				{type: 'Identifier', name: 'Foo'},
				{type: 'Identifier', name: 'Bar'},
				{type: 'ClassBody'},
			],
		],
		[
			'(class Foo{})',
			[
				{type: 'Program'},
				{type: 'ExpressionStatement'},
				{type: 'ClassExpression'},
				{type: 'Identifier', name: 'Foo'},
				{type: 'ClassBody'},
			],
		],
		[
			'0?1:2',
			[
				{type: 'Program'},
				{type: 'ExpressionStatement'},
				{type: 'ConditionalExpression'},
				{type: 'Literal', value: 0},
				{type: 'Literal', value: 1},
				{type: 'Literal', value: 2},
			],
		],
		[
			'foo:while(0)continue foo',
			[
				{type: 'Program'},
				{type: 'LabeledStatement'},
				{type: 'Identifier', name: 'foo'},
				{type: 'WhileStatement'},
				{type: 'Literal', value: 0},
				{type: 'ContinueStatement'},
				{type: 'Identifier', name: 'foo'},
			],
		],
		[
			'debugger',
			[
				{type: 'Program'},
				{type: 'DebuggerStatement'},
			],
		],
		[
			'do{}while(0)',
			[
				{type: 'Program'},
				{type: 'DoWhileStatement'},
				{type: 'BlockStatement'},
				{type: 'Literal', value: 0},
			],
		],
		[
			';',
			[
				{type: 'Program'},
				{type: 'EmptyStatement'},
			],
		],
		[
			'export * from \'foo\'',
			[
				{type: 'Program'},
				{type: 'ExportAllDeclaration'},
				{type: 'Literal', value: 'foo'},
			],
		],
		[
			'export default 0',
			[
				{type: 'Program'},
				{type: 'ExportDefaultDeclaration'},
				{type: 'Literal', value: 0},
			],
		],
		[
			'export let foo',
			[
				{type: 'Program'},
				{type: 'ExportNamedDeclaration'},
				{type: 'VariableDeclaration', kind: 'let'},
				{type: 'VariableDeclarator'},
				{type: 'Identifier', name: 'foo'},
			],
		],
		[
			'export {foo as bar}',
			[
				{type: 'Program'},
				{type: 'ExportNamedDeclaration'},
				{type: 'ExportSpecifier'},
				{type: 'Identifier', name: 'foo'},
				// {type: 'Identifier', name: 'bar'},
			],
		],
		[
			'for(foo in 0){}',
			[
				{type: 'Program'},
				{type: 'ForInStatement'},
				{type: 'Identifier', name: 'foo'},
				{type: 'Literal', value: 0},
				{type: 'BlockStatement'},
			],
		],
		[
			'for(foo of 0){}',
			[
				{type: 'Program'},
				{type: 'ForOfStatement'},
				{type: 'Identifier', name: 'foo'},
				{type: 'Literal', value: 0},
				{type: 'BlockStatement'},
			],
		],
		[
			'for(;;){}',
			[
				{type: 'Program'},
				{type: 'ForStatement'},
				{type: 'BlockStatement'},
			],
		],
		[
			'function foo(){}',
			[
				{type: 'Program'},
				{type: 'FunctionDeclaration'},
				{type: 'Identifier', name: 'foo'},
				{type: 'BlockStatement'},
			],
		],
		[
			'(function(){})',
			[
				{type: 'Program'},
				{type: 'ExpressionStatement'},
				{type: 'FunctionExpression'},
				{type: 'BlockStatement'},
			],
		],
		[
			'if(0){}else{}',
			[
				{type: 'Program'},
				{type: 'IfStatement'},
				{type: 'Literal', value: 0},
				{type: 'BlockStatement'},
				{type: 'BlockStatement'},
			],
		],
		[
			'import foo from \'foo\'',
			[
				{type: 'Program'},
				{type: 'ImportDeclaration'},
				{type: 'ImportDefaultSpecifier'},
				{type: 'Identifier', name: 'foo'},
				{type: 'Literal', value: 'foo'},
			],
		],
		[
			'import {foo as bar} from \'foo\'',
			[
				{type: 'Program'},
				{type: 'ImportDeclaration'},
				{type: 'ImportSpecifier'},
				// {type: 'Identifier', name: 'foo'},
				{type: 'Identifier', name: 'bar'},
				{type: 'Literal', value: 'foo'},
			],
		],
		[
			'import * as bar from \'foo\'',
			[
				{type: 'Program'},
				{type: 'ImportDeclaration'},
				{type: 'ImportNamespaceSpecifier'},
				{type: 'Identifier', name: 'bar'},
				{type: 'Literal', value: 'foo'},
			],
		],
		[
			'0&&1',
			[
				{type: 'Program'},
				{type: 'ExpressionStatement'},
				{type: 'LogicalExpression', operator: '&&'},
				{type: 'Literal', value: 0},
				{type: 'Literal', value: 1},
			],
		],
		[
			'foo.bar',
			[
				{type: 'Program'},
				{type: 'ExpressionStatement'},
				{type: 'MemberExpression'},
				{type: 'Identifier', name: 'foo'},
				{type: 'Identifier', name: 'bar'},
			],
		],
		[
			'function foo(){new.target}',
			[
				{type: 'Program'},
				{type: 'FunctionDeclaration'},
				{type: 'Identifier', name: 'foo'},
				{type: 'BlockStatement'},
				{type: 'ExpressionStatement'},
				{type: 'MetaProperty'},
				// {type: 'Identifier', name: 'new'},
				// {type: 'Identifier', name: 'target'},
			],
		],
		[
			'class Foo {foo(){}}',
			[
				{type: 'Program'},
				{type: 'ClassDeclaration'},
				{type: 'Identifier', name: 'Foo'},
				{type: 'ClassBody'},
				{type: 'MethodDefinition', kind: 'method'},
				{type: 'Identifier', name: 'foo'},
				{type: 'FunctionExpression'},
				{type: 'BlockStatement'},
			],
		],
		[
			'new Foo(foo)',
			[
				{type: 'Program'},
				{type: 'ExpressionStatement'},
				{type: 'NewExpression'},
				{type: 'Identifier', name: 'Foo'},
				{type: 'Identifier', name: 'foo'},
			],
		],
		[
			'({foo:bar})',
			[
				{type: 'Program'},
				{type: 'ExpressionStatement'},
				{type: 'ObjectExpression'},
				{type: 'Property'},
				{type: 'Identifier', name: 'foo'},
				{type: 'Identifier', name: 'bar'},
			],
		],
		[
			'({foo}={bar})',
			[
				{type: 'Program'},
				{type: 'ExpressionStatement'},
				{type: 'AssignmentExpression'},
				{type: 'ObjectPattern'},
				{type: 'Property'},
				{type: 'Identifier', name: 'foo'},
				{type: 'Identifier', name: 'foo'},
				{type: 'ObjectExpression'},
				{type: 'Property'},
				{type: 'Identifier', name: 'bar'},
				{type: 'Identifier', name: 'bar'},
			],
		],
		[
			'(0)',
			[
				{type: 'Program'},
				{type: 'ExpressionStatement'},
				{type: 'ParenthesizedExpression'},
				{type: 'Literal', value: 0},
			],
			{
				preserveParens: true,
			},
		],
		[
			'[...foo]=0',
			[
				{type: 'Program'},
				{type: 'ExpressionStatement'},
				{type: 'AssignmentExpression'},
				{type: 'ArrayPattern'},
				{type: 'RestElement'},
				{type: 'Identifier', name: 'foo'},
				{type: 'Literal', value: 0},
			],
		],
		[
			'function foo(){return bar}',
			[
				{type: 'Program'},
				{type: 'FunctionDeclaration'},
				{type: 'Identifier', name: 'foo'},
				{type: 'BlockStatement'},
				{type: 'ReturnStatement'},
				{type: 'Identifier', name: 'bar'},
			],
		],
		[
			'foo,bar',
			[
				{type: 'Program'},
				{type: 'ExpressionStatement'},
				{type: 'SequenceExpression'},
				{type: 'Identifier', name: 'foo'},
				{type: 'Identifier', name: 'bar'},
			],
		],
		[
			'[...foo]',
			[
				{type: 'Program'},
				{type: 'ExpressionStatement'},
				{type: 'ArrayExpression'},
				{type: 'SpreadElement'},
				{type: 'Identifier', name: 'foo'},
			],
		],
		[
			'class Foo{foo(){super.foo}}',
			[
				{type: 'Program'},
				{type: 'ClassDeclaration'},
				{type: 'Identifier', name: 'Foo'},
				{type: 'ClassBody'},
				{type: 'MethodDefinition'},
				{type: 'Identifier', name: 'foo'},
				{type: 'FunctionExpression'},
				{type: 'BlockStatement'},
				{type: 'ExpressionStatement'},
				{type: 'MemberExpression'},
				{type: 'Super'},
				{type: 'Identifier', name: 'foo'},
			],
		],
		[
			'switch(foo){case 0:bar;case 1:default:}',
			[
				{type: 'Program'},
				{type: 'SwitchStatement'},
				{type: 'Identifier', name: 'foo'},
				{type: 'SwitchCase'},
				{type: 'Literal', value: 0},
				{type: 'ExpressionStatement'},
				{type: 'Identifier', name: 'bar'},
				{type: 'SwitchCase'},
				{type: 'Literal', value: 1},
				{type: 'SwitchCase'},
			],
		],
		[
			'foo`${1}\\u0032${3}\\u0034`',
			[
				{type: 'Program'},
				{type: 'ExpressionStatement'},
				{type: 'TaggedTemplateExpression'},
				{type: 'Identifier', name: 'foo'},
				{type: 'TemplateLiteral'},
				{type: 'TemplateElement', value: {raw: '', cooked: ''}},
				{type: 'Literal', value: 1},
				{type: 'TemplateElement', value: {raw: '\\u0032', cooked: '2'}},
				{type: 'Literal', value: 3},
				{type: 'TemplateElement', value: {raw: '\\u0034', cooked: '4'}},
			],
		],
		[
			'this',
			[
				{type: 'Program'},
				{type: 'ExpressionStatement'},
				{type: 'ThisExpression'},
			],
		],
		[
			'throw foo',
			[
				{type: 'Program'},
				{type: 'ThrowStatement'},
				{type: 'Identifier', name: 'foo'},
			],
		],
		[
			'+foo',
			[
				{type: 'Program'},
				{type: 'ExpressionStatement'},
				{type: 'UnaryExpression', operator: '+', prefix: true},
				{type: 'Identifier', name: 'foo'},
			],
		],
		[
			'++foo',
			[
				{type: 'Program'},
				{type: 'ExpressionStatement'},
				{type: 'UpdateExpression', operator: '++', prefix: true},
				{type: 'Identifier', name: 'foo'},
			],
		],
		[
			'with(foo)bar',
			[
				{type: 'Program'},
				{type: 'WithStatement'},
				{type: 'Identifier', name: 'foo'},
				{type: 'ExpressionStatement'},
				{type: 'Identifier', name: 'bar'},
			],
			{
				sourceType: 'script',
			},
		],
		[
			'function* foo(){yield* bar}',
			[
				{type: 'Program'},
				{type: 'FunctionDeclaration', generator: true},
				{type: 'Identifier', name: 'foo'},
				{type: 'BlockStatement'},
				{type: 'ExpressionStatement'},
				{type: 'YieldExpression', delegate: true},
				{type: 'Identifier', name: 'bar'},
			],
		],
	]
	.forEach(([code, expectedNodes, options]) => {
		test(code, (test) => {
			const ast = acorn.parse(
				code,
				Object.assign(
					{
						ecmaVersion: 8,
						sourceType: 'module',
					},
					options
				)
			);
			let count = 0;
			walk(ast, (node) => {
				const expected = expectedNodes.shift();
				if (node) {
					const {type} = node;
					coverage.set(type, coverage.get(type) + 1);
					test(`${++count} ${type}`, (test) => {
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

	test('coverage', (test) => {
		for (const [type, count] of coverage) {
			test(`${type}: ${count}`, () => {
				assert(0 < count);
			});
		}
	});

});
