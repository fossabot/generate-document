const Method = require('../-method');
module.exports = class Class {

	constructor(node) {
		Object.assign(
			this,
			node,
			{
				methods: new Set(),
			}
		);
	}

	get name() {
		return this.id.name;
	}

	get instanceName() {
		return `my${this.name}`;
	}

	addMethod(node) {
		const method = new Method(node);
		this.methods.add(method, this);
		return method;
	}

};
