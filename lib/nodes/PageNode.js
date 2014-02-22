/*

  page node class

  container of all page data,
  including a collection of translations

*/

define([

  '../core/Model',
  'lodash',
  'path'

], function (Model, _, npath) {

  var _super = Model.prototype;

  return Model.extend({

    'defaults': function () {

      var self = this;

      return {
        'type': 'page',
        'raw': null,
        'path': null,
        'url': null,
        'langCode': self.options.localization.defaultLangCode,
        'updatedAt': null,
        'renderedAt': null,
        'text': null,
        'title': null,
        'position': null
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

      attributes.url = self.getUrl(attributes.path);
      attributes = self.parseRawMeta(attributes.raw, attributes);
      attributes.updatedAt = new Date();

      self.set(attributes);
    },

    'getUrl': function (path) {

      var self = this;

      path = path.replace(npath.join(process.cwd(), self.options.paths.content), '');

      var parts = path.split('/');
      var filename = parts.pop();
      self.parseTemplate(filename);
      parts[parts.length - 1] = self.parsePosition(parts[parts.length - 1]);

      var filenameParts = filename.split('.');
      if (filenameParts.length > 2) {
        parts.push(filenameParts[filenameParts.length - 2]);
      }
      path = parts.join('/') || '/';

      return path;
    },

    'validate': function () {

      var self = this;
    },

    'parsePosition': function (string) {

      var self = this;
      var matches = string.match(/(\d)+-/);
      var match = matches && matches[0];

      if (match && typeof match === 'string') {

        var position = parseInt(match.replace('/', '').replace('-', ''), 10);

        if (typeof position === 'number') {
          self.set('position', position);
          string = string.replace(match, '');
        }
      }

      return string;
    },

    'parseTemplate': function (filename) {

      var self = this;
      var parts = filename.replace('.txt', '').split('.');
      if (parts.length > 1) {
        parts.pop();
      }

      self.set('template', parts.join('.'));
    },

    'parseRawMeta': function (raw, meta) {

      var self = this;
      meta = meta || {};
      var parts = raw.split('\n---\n');

      _.each(parts, function (part) {

        try {

          var doc = yaml.safeLoad(part);

          if (doc.hasOwnProperty('text')) {
            throw new Error('Should not read "text" block as YAML');
          }

          _.each(doc, function (value, key) {

            key = key.split('\n').join('');
            meta[key.toLowerCase()] = value;
          });
        }
        catch (e) {

          var separator = part.indexOf(':');
          var key = part.substr(0, separator).toLowerCase();
          var value = part.substr(separator + 1).trim();

          meta[key.replace('\n', '')] = value;
        }
      });

      return meta;
    }
  });
});