var FileCollection = require('asimov-collection').FileCollection;
var Script = require('../models/Script');
var _super = FileCollection.prototype;

module.exports = FileCollection.extend({

	'filetype': 'script',
	'extension': 'js',

	'model': Script
});
