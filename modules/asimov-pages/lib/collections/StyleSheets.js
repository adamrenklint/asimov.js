var FileCollection = require('asimov-collection').FileCollection;
var StyleSheet = require('../models/StyleSheet');
var _super = FileCollection.prototype;

module.exports = FileCollection.extend({

	'filetype': 'styleSheet',
	'extension': 'styl',

	'model': StyleSheet
});
