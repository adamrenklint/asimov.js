var DependencyParser = require('./DependencyParser');
var _ = require('lodash');
var _super = DependencyParser.prototype;

module.exports = DependencyParser.extend({

  'namespace': 'Parser',

  'initialize': function () {

    var self = this;
    _super.initialize.apply(self, arguments);

    self.assert('array', self.options.templates && self.options.templates.models, 'Cannot create PageParser without a template collection');

    self.bindTo(self.mediator, 'register:page', 'register');
  },

  'register': function (model, dependency) {

    var self = this;
    self.add(model, dependency.attributes.path, self.dependencies);
  },

  'parse': function (model, raw, dependencies) {

    var self = this;
    self.dependencies = dependencies;
    var attributes = model.attributes;
    self.assertAttributes(attributes);

    var regExp = /\{\{(#)?import "((\w|\.|\/)+)"/;

    self.add(model, model.attributes.path, dependencies);

    var template = self.options.templates.find(function (tmpl) {
      return tmpl.attributes.path.indexOf(attributes.template) >= 0;
    });

    self.assert('object', template, 'Page is referencing a template that doesn\'t exist @ ' + model.attributes.path);

    self.add(model, template.attributes.path, dependencies);

    self.recursiveParseAttributes(model, attributes, dependencies);

    if (attributes.inherits) {
      var page = self.options.pages.get(attributes.inherits);
      self.assert('object', page, 'Invalid reference in page attribute "inherits" @ ' + model.attributes.path);
      self.add(model, page.attributes.path, dependencies);
    }

    self.registerSiteData(model, dependencies);
  },

  'registerSiteData': function (model, dependencies) {

    var self = this;
    self.options.siteData && self.options.siteData.each(function (data) {
      self.add(model, data.attributes.path, dependencies);
      self.add(data, data.attributes.path, dependencies);
    });
  },

  'parseSingleAttribute': function (model, key, value, dependencies) {

    var self = this;

    if (key === 'page') return;

    var matches = typeof value === 'string' && value.match(/\{\{(#)?import "(\w)+/);
    var match = matches && matches[0];

    if (match && typeof match === 'string') {

      var filename = match.split('"')[1];
      var template = self.options.templates.find(function (tmpl) {
        return tmpl.attributes.path.indexOf(filename) >= 0;
      });

      self.assert('object', template, 'Page attribute "' + key + '" is referencing a partial that doesn\'t exist @ ' + model.attributes.path);

      self.add(model, template.attributes.path, dependencies);
    }
  },

  'recursiveParseAttributes': function (model, attributes, dependencies) {

    var self = this;
    _.each(attributes, function (value, key) {

      if (_.isPlainObject(value) && key !== 'page') {
        self.recursiveParseAttributes(model, value, dependencies);
      }
      else {
        self.parseSingleAttribute(model, key, value, dependencies);
      }
    });
  },
});