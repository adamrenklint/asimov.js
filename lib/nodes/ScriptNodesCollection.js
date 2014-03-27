var FilesystemCollection = require('../core/FilesystemCollection');
var ScriptNode = require('./ScriptNode');
var _super = FilesystemCollection.prototype;

module.exports = FilesystemCollection.extend({

  'filetype': 'script',
  'extension': 'js',

  'model': ScriptNode
});