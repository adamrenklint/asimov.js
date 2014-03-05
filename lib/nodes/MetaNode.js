/*

  meta node model class

  contains all and formatted meta data

*/

define([

  '../core/FilesystemModel',
  'lodash',
  'path'

], function (FilesystemModel, _, npath) {

  var _super = FilesystemModel.prototype;

  return FilesystemModel.extend({

    'defaults': {
      'type': 'meta',
      'raw': null,
      'path': null
    },

    'parseRaw': function () {

      var self = this;
      var attributes = self.attributes;

      attributes = self.parseRawMeta(attributes.raw, attributes);

      self.set(attributes);
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

      var delimiters = {
        'long': '\n-----\n',
        'medium': '\n----\n',
        'short': '\n---\n'
      };

      var delimiter = raw.indexOf(delimiters.long) > 0 ? delimiters.long : raw.indexOf(delimiters.medium) > 0 ? delimiters.medium : delimiters.short;
      var parts = raw.split(delimiter);

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