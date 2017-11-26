# Classes

## Class DocumentGenerator

A document generator

### constructor

Create a document generator

Syntax:<br>
new DocumentGenerator([*options={}*])

Arguments:<br>
**options** (={})  {String|Object} An object for configuration

### root

Syntax:<br>
myDocumentGenerator.root

### main

Return a file path to package's main script.

Syntax:<br>
myDocumentGenerator.main

Returns: {String} A path to the package's main script.

### start

Generate documents

Syntax:<br>
myDocumentGenerator.start()

Returns: {Promise.&lt;undefined&gt;} A promise resolved after process.

### loadPackageJSON

Load the package.json and save the parsed object to this.packageData.

Syntax:<br>
myDocumentGenerator.loadPackageJSON([*encoding='utf8'*])

Arguments:<br>
**encoding** (='utf8')  {String} Encoding used by fs.readFile.

Returns: {Promise.&lt;Object&gt;} A Promise will be resolved with parsed package.json.

### parse

Syntax:<br>
myDocumentGenerator.parse(undocumented)

### description

Syntax:<br>
myDocumentGenerator.description


Documented: 1/1 (100%)
