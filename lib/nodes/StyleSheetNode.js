var FilesystemModel = require('../core/FilesystemModel');
var _ = require('lodash');
var npath = require('path');
var _super = FilesystemModel.prototype;

module.exports = FilesystemModel.extend({

  'idAttribute': 'url',

  'defaults': {
    'type': 'styleSheet',
    'contentType': 'text/css',
    'name': null,
    'raw': null,
    'path': null,
    'url': null
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
    var paths = [].concat(self.options.paths.styles);

    var pageUrl = attributes.pageUrl;
    var page = pageUrl && self.options.pages.get(attributes.pageUrl);
    page && page.attributes.folderPath && (paths.unshift(page.attributes.folderPath));

    attributes.path = self.filesystem.findFirstMatch(attributes.name + '.styl', paths);

    self.assert('string', attributes.path, 'Invalid styleSheet, couldn\'t find ' + attributes.name);

    if (attributes.path.indexOf(process.cwd()) < 0 && (attributes.frameworkDir < 0)) {
      attributes.path = npath.join(process.cwd(), attributes.path);
    }

    attributes.url = attributes.path.replace('.styl', '.css').replace(process.cwd(), '');

    self.set(attributes);
  }
});