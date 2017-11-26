const path = require('path');
/**
 * @private
 * Return a file path markdown is written.
 * @param {String} filePath - A file path to a script file.
 * @return {String} - A file path where the document of the file is written to.
 */
module.exports = function getMarkdownDestination(filePath) {
	const fileName = path.basename(filePath, '.js');
	return path.join(path.dirname(filePath), fileName === 'index' ? 'readme.md' : `${fileName}.md`);
};
