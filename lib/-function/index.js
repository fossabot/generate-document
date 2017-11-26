const escape = require('../escape');

module.exports = class Func {

	constructor(node) {
		Object.assign(this, node);
	}

	get name() {
		return this.id.name;
	}

	getParams(...keys) {
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
		return this.getParams('param')
		.map(({name, omittable}, index) => {
			const argument = index === 0 ? `*${name}*` : `, *${name}*`;
			return omittable ? `[${argument}]` : argument;
		})
		.join('');
	}

	get syntax() {
		return `${this.name}(${this.argumentsList})`;
	}

};
