var FilesystemModel = require('../core/FilesystemModel')
var _ = require('lodash');
var npath = require('path');
var _super = FilesystemModel.prototype;

module.exports = FilesystemModel.extend({

  'idAttribute': 'url',

  'defaults': {
    'type': 'script',
    'contentType': 'text/javascript',
    'name': null,
    'raw': null,
    'path': null,
    'url': null,
    'bundle': false,
    'classId': null
  },

  'initialize': function () {

    var self = this;
    _super.initialize.apply(self, arguments);

    self.bindTo(self, 'change:name', 'parseName');
    self.attributes.name && self.parseName();
  },

  'parseName': function () {

    var self = this;
    var attributes = self.attributes;

    attributes.path = self.filesystem.findFirstMatch(attributes.name, self.options.paths.scripts);

    self.assert('string', attributes.path, 'Invalid script node path @ ' + attributes.name);

    if (attributes.path.indexOf(process.cwd()) < 0) {
      attributes.path = npath.join(process.cwd(), attributes.path);
    }

    attributes.url = attributes.path.replace(process.cwd(), '');
    attributes.classId = attributes.name.replace(/\//g, '_');

    self.set(attributes);
  }
});