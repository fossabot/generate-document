const path = require('path');
module.exports = function getMarkdownDestination(filePath) {
	const fileName = path.basename(filePath, '.js');
	return path.join(path.dirname(filePath), fileName === 'index' ? 'readme.md' : `${fileName}.md`);
};
