const escape = require('../escape');

module.exports = class Method {

	constructor(node) {
		Object.assign(this, node);
		this.class.methods.add(this);
	}

	get class() {
		return this.ancestors[this.ancestors.length - 2];
	}

	get name() {
		return this.key.name;
	}

	params(...keys) {
		if (!this.comment) {
			return [];
		}
		return this.comment.getArray(...keys)
		.map(({text, param: {name, type}}) => {
			const omittable = name.startsWith('[') && name.endsWith(']');
			if (omittable) {
				name = name.slice(1, -1);
			}
			return {
				name: escape(name),
				type: escape(type),
				omittable,
				text,
			};
		});
	}

	get argumentsList() {
		if (!this.comment) {
			return 'undocumented';
		}
		return this.params('param')
		.map(({name, omittable}, index) => {
			const argument = index === 0 ? `*${name}*` : `, *${name}*`;
			return omittable ? `[${argument}]` : argument;
		})
		.join('');
	}

	get syntax() {
		switch (this.kind) {
		case 'get':
			return `${this.class.instanceName}.${this.name}`;
		case 'static':
			return `${this.class.name}.${this.name}(${this.argumentsList})`;
		case 'method':
			return `${this.class.instanceName}.${this.name}(${this.argumentsList})`;
		case 'constructor':
			return `new ${this.class.name}(${this.argumentsList})`;
		default:
			throw new Error(`Unknown kind: ${this.kind}`);
		}
	}

};
