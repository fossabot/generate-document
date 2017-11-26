/**
 * @package
 * Generates /path/to/readme.md.
 *
 * ## Install
 * ```
 * npm install generate-document --save-dev
 * ```
 *
 * ## Usage
 * ```
 * generate-document /path/to/package.json
 * ```
 */
exports.DocumentGenerator = require('./-document-generator');
exports.FileParser = require('./-file-parser');
exports.MarkdownPublisher = require('./-markdown-publisher');
