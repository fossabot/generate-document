module.exports = function markdownSyntax($function, writer) {
	writer.write(`\nSyntax:<br>\n${$function.syntax}\n`);
	const args = $function.getParams('param');
	if (0 < args.length) {
		writer.write(`\nArguments:<br>\n${
			args
			.map(({name, type, omittable, text}) => {
				const [argumentName, defaultValue = 'undefined'] = name.split('=');
				return `**${argumentName}** ${omittable ? `(=${defaultValue}) ` : ''} {${type}}${text ? ` ${text.replace(/\s*[\r\n]+\s*/, ' ')}` : ''}`;
			})
			.join('<br>\n')
		}\n`);
	}
	if ($function.kind !== 'constructor') {
		const returns = $function.getParams('return', 'returns');
		if (0 < returns.length) {
			writer.write(`\n${
				returns
				.map(({type, text}) => {
					return `Returns: {${type}}${text ? ` ${text}` : ''}`;
				})
				.join('\n')
			}\n`);
		}
	}
};
