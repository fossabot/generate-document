const Func = require('../-function');

module.exports = class Method extends Func {

	constructor(node) {
		super(node).class.methods.add(this);
	}

	get class() {
		return this.ancestors[this.ancestors.length - 2];
	}

	get name() {
		return this.key.name;
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
