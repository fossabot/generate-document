const console = require('console');
module.exports = Object.assign(
	walk,
	{
		ArrayExpression(node, fn, ancestors) {
			for (const child of node.elements) {
				walk(child, fn, ancestors);
			}
		},
		ArrayPattern(node, fn, ancestors) {
			for (const child of node.elements) {
				walk(child, fn, ancestors);
			}
		},
		ArrowFunctionExpression(node, fn, ancestors) {
			walk(node.id, fn, ancestors);
			for (const child of node.params) {
				walk(child, fn, ancestors);
			}
			walk(node.body, fn, ancestors);
		},
		AssignmentExpression(node, fn, ancestors) {
			walk(node.left, fn, ancestors);
			walk(node.right, fn, ancestors);
		},
		AssignmentPattern(node, fn, ancestors) {
			walk(node.left, fn, ancestors);
			walk(node.right, fn, ancestors);
		},
		AwaitExpression(node, fn, ancestors) {
			walk(node.argument, fn, ancestors);
		},
		BinaryExpression(node, fn, ancestors) {
			walk(node.left, fn, ancestors);
			walk(node.right, fn, ancestors);
		},
		BlockStatement(node, fn, ancestors) {
			for (const child of node.body) {
				walk(child, fn, ancestors);
			}
		},
		BreakStatement(node, fn, ancestors) {
			walk(node.label, fn, ancestors);
		},
		CallExpression(node, fn, ancestors) {
			walk(node.callee, fn, ancestors);
			for (const child of node.arguments) {
				walk(child, fn, ancestors);
			}
		},
		CatchClause(node, fn, ancestors) {
			walk(node.param, fn, ancestors);
			walk(node.body, fn, ancestors);
		},
		ClassBody(node, fn, ancestors) {
			for (const child of node.body) {
				walk(child, fn, ancestors);
			}
		},
		ClassDeclaration(node, fn, ancestors) {
			walk(node.id, fn, ancestors);
			walk(node.superClass, fn, ancestors);
			walk(node.body, fn, ancestors);
		},
		ClassExpression(node, fn, ancestors) {
			walk(node.id, fn, ancestors);
			walk(node.superClass, fn, ancestors);
			walk(node.body, fn, ancestors);
		},
		ConditionalExpression(node, fn, ancestors) {
			walk(node.test, fn, ancestors);
			walk(node.consequent, fn, ancestors);
			walk(node.alternate, fn, ancestors);
		},
		ContinueStatement(node, fn, ancestors) {
			walk(node.label, fn, ancestors);
		},
		DebuggerStatement: skip,
		DoWhileStatement(node, fn, ancestors) {
			walk(node.body, fn, ancestors);
			walk(node.test, fn, ancestors);
		},
		EmptyStatement: skip,
		ExportAllDeclaration(node, fn, ancestors) {
			walk(node.source, fn, ancestors);
		},
		ExportDefaultDeclaration(node, fn, ancestors) {
			walk(node.declaration, fn, ancestors);
		},
		ExportNamedDeclaration(node, fn, ancestors) {
			walk(node.declaration, fn, ancestors);
			for (const child of node.specifiers) {
				walk(child, fn, ancestors);
			}
			walk(node.source, fn, ancestors);
		},
		ExportSpecifier(node, fn, ancestors) {
			walk(node.local, fn, ancestors);
			// walk(node.exported, fn, ancestors);
		},
		ExpressionStatement(node, fn, ancestors) {
			walk(node.expression, fn, ancestors);
		},
		ForInStatement(node, fn, ancestors) {
			walk(node.left, fn, ancestors);
			walk(node.right, fn, ancestors);
			walk(node.body, fn, ancestors);
		},
		ForOfStatement(node, fn, ancestors) {
			walk(node.left, fn, ancestors);
			walk(node.right, fn, ancestors);
			walk(node.body, fn, ancestors);
		},
		ForStatement(node, fn, ancestors) {
			walk(node.init, fn, ancestors);
			walk(node.test, fn, ancestors);
			walk(node.update, fn, ancestors);
			walk(node.body, fn, ancestors);
		},
		FunctionDeclaration(node, fn, ancestors) {
			walk(node.id, fn, ancestors);
			for (const child of node.params) {
				walk(child, fn, ancestors);
			}
			walk(node.body, fn, ancestors);
		},
		FunctionExpression(node, fn, ancestors) {
			walk(node.id, fn, ancestors);
			for (const child of node.params) {
				walk(child, fn, ancestors);
			}
			walk(node.body, fn, ancestors);
		},
		Identifier: skip,
		IfStatement(node, fn, ancestors) {
			walk(node.test, fn, ancestors);
			walk(node.consequent, fn, ancestors);
			walk(node.alternate, fn, ancestors);
		},
		ImportDeclaration(node, fn, ancestors) {
			for (const child of node.specifiers) {
				walk(child, fn, ancestors);
			}
			walk(node.source, fn, ancestors);
		},
		ImportDefaultSpecifier(node, fn, ancestors) {
			walk(node.local, fn, ancestors);
		},
		ImportNamespaceSpecifier(node, fn, ancestors) {
			walk(node.local, fn, ancestors);
		},
		ImportSpecifier(node, fn, ancestors) {
			// walk(node.imported, fn, ancestors);
			walk(node.local, fn, ancestors);
		},
		LabeledStatement(node, fn, ancestors) {
			walk(node.label, fn, ancestors);
			walk(node.body, fn, ancestors);
		},
		Literal: skip,
		LogicalExpression(node, fn, ancestors) {
			walk(node.left, fn, ancestors);
			walk(node.right, fn, ancestors);
		},
		MemberExpression(node, fn, ancestors) {
			walk(node.object, fn, ancestors);
			walk(node.property, fn, ancestors);
		},
		// MetaProperty(node, fn, ancestors) {
		// 	walk(node.meta, fn, ancestors);
		// 	walk(node.property, fn, ancestors);
		// },
		MetaProperty: skip,
		MethodDefinition(node, fn, ancestors) {
			walk(node.key, fn, ancestors);
			walk(node.value, fn, ancestors);
		},
		NewExpression(node, fn, ancestors) {
			walk(node.callee, fn, ancestors);
			for (const child of node.arguments) {
				walk(child, fn, ancestors);
			}
		},
		ObjectExpression(node, fn, ancestors) {
			for (const child of node.properties) {
				walk(child, fn, ancestors);
			}
		},
		ObjectPattern(node, fn, ancestors) {
			for (const child of node.properties) {
				walk(child, fn, ancestors);
			}
		},
		ParenthesizedExpression(node, fn, ancestors) {
			walk(node.expression, fn, ancestors);
		},
		Program(node, fn, ancestors) {
			for (const child of node.body) {
				walk(child, fn, ancestors);
			}
		},
		Property(node, fn, ancestors) {
			walk(node.key, fn, ancestors);
			walk(node.value, fn, ancestors);
		},
		RestElement(node, fn, ancestors) {
			walk(node.argument, fn, ancestors);
		},
		ReturnStatement(node, fn, ancestors) {
			walk(node.argument, fn, ancestors);
		},
		SequenceExpression(node, fn, ancestors) {
			for (const child of node.expressions) {
				walk(child, fn, ancestors);
			}
		},
		SpreadElement(node, fn, ancestors) {
			walk(node.argument, fn, ancestors);
		},
		Super: skip,
		SwitchCase(node, fn, ancestors) {
			walk(node.test, fn, ancestors);
			for (const child of node.consequent) {
				walk(child, fn, ancestors);
			}
		},
		SwitchStatement(node, fn, ancestors) {
			walk(node.discriminant, fn, ancestors);
			for (const child of node.cases) {
				walk(child, fn, ancestors);
			}
		},
		TaggedTemplateExpression(node, fn, ancestors) {
			walk(node.tag, fn, ancestors);
			walk(node.quasi, fn, ancestors);
		},
		TemplateElement: skip,
		TemplateLiteral({expressions, quasis}, fn, ancestors) {
			for (let i = 0; i < quasis.length; i++) {
				walk(quasis[i], fn, ancestors);
				walk(expressions[i], fn, ancestors);
			}
		},
		ThisExpression: skip,
		ThrowStatement(node, fn, ancestors) {
			walk(node.argument, fn, ancestors);
		},
		TryStatement(node, fn, ancestors) {
			walk(node.block, fn, ancestors);
			walk(node.handler, fn, ancestors);
			walk(node.finalizer, fn, ancestors);
		},
		UnaryExpression(node, fn, ancestors) {
			walk(node.argument, fn, ancestors);
		},
		UpdateExpression(node, fn, ancestors) {
			walk(node.argument, fn, ancestors);
		},
		VariableDeclaration(node, fn, ancestors) {
			for (const child of node.declarations) {
				walk(child, fn, ancestors);
			}
		},
		VariableDeclarator(node, fn, ancestors) {
			walk(node.id, fn, ancestors);
			walk(node.init, fn, ancestors);
		},
		WhileStatement(node, fn, ancestors) {
			walk(node.test, fn, ancestors);
			walk(node.body, fn, ancestors);
		},
		WithStatement(node, fn, ancestors) {
			walk(node.object, fn, ancestors);
			walk(node.body, fn, ancestors);
		},
		YieldExpression(node, fn, ancestors) {
			walk(node.argument, fn, ancestors);
		},
	}
);

function walk(node, fn, ancestors = []) {
	if (!node || fn(node, ancestors.slice())) {
		return;
	}
	const walker = walk[node.type];
	if (walker) {
		walker(node, fn, ancestors.concat(node));
	} else {
		console.error(node);
		throw new Error(`Unknown type: ${node.type}`);
	}
}

function skip() {}
