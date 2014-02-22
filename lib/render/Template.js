/*

  template class

  pre-compiles raw template and registers partial

*/

define([

  '../core/Model',
  'lodash',
  'handlebars',
  'path'

], function (Model, _, handlebars, npath) {

  var _super = Model.prototype;

  return Model.extend({

    'idAttribute': 'name',

    'defaults': function () {

      var self = this;

      return {
        'type': 'template',
        'name': null,
        'path': null,
        'updatedAt': null,
        'renderedAt': null,
        'raw': null,
        'compiled': null
      };
    },

    'initialize': function () {

      var self = this;
      _super.initialize.apply(self, arguments);

      self.on('change', self.parseRaw);
      self.parseRaw();
    },

    'parseRaw': function () {

      var self = this;
      var attributes = self.attributes;

      attributes.name = self.getName(attributes.path);
      attributes.updatedAt = new Date();

      try {

        handlebars.registerPartial(attributes.name, attributes.raw);
        attributes.compiled = handlebars.compile(attributes.raw);
      }
      catch (e) {

        throw new Error('Invalid template @ ' + attributes.path);
      }

      self.set(attributes);
    },

    'getName': function (path) {

      var self = this;

      var parts = path.split('/');
      var filename = parts[parts.length - 1];
      return filename.replace('.tmpl', '');
    }
  });
});