var FilesystemModel = require('../core/FilesystemModel');
var _ = require('lodash');
var handlebars = require('handlebars');
var npath = require('path');
var _super = FilesystemModel.prototype;

module.exports = FilesystemModel.extend({

  'idAttribute': 'name',

  'cacheRaw': false,

  'defaults': function () {

    var self = this;

    return {
      'type': 'template',
      'name': null,
      'path': null,
      'raw': null,
      'compiled': null
    };
  },

  'parseRaw': function () {

    var self = this;
    var attributes = self.attributes;

    attributes.name = self.getName(attributes.path);

    try {

      attributes.compiled = handlebars.compile(attributes.raw);
    }
    catch (e) {

      throw new Error('Invalid template @ ' + attributes.path);
    }

    self.set(attributes);
  },

  'getName': function (path) {

    var self = this;

    _.each(self.options.paths.templates, function (templatePath) {
      templatePath = npath.join(process.cwd(), templatePath);
      path = path.replace(templatePath + '/', '').replace('.tmpl', '');
    });

    return path;
  }
});