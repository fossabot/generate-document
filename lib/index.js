/**
 * @root
 * ```
 * generate-document /path/to/package.json
 * ```
 * The command generates /path/to/readme.md.
 */
exports.DocumentGenerator = require('./-document-generator');
exports.FileParser = require('./-file-parser');
exports.MarkdownPublisher = require('./-markdown-publisher');
