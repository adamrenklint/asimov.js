/*

  script nodes collection class

*/

define([

  '../core/FilesystemCollection',
  './ScriptNode'

], function (FilesystemCollection, ScriptNode) {

  var _super = FilesystemCollection.prototype;

  return FilesystemCollection.extend({

    'filetype': 'script',
    'extension': 'js',

    'model': ScriptNode
  });
});