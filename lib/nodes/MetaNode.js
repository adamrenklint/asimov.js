var FilesystemModel = require('../core/FilesystemModel');
var _ = require('lodash');
var npath = require('path');
var _super = FilesystemModel.prototype;
var yaml = require('yaml-js');

module.exports = FilesystemModel.extend({

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

    meta.raw = raw.toString();

    _.each(meta.raw.split(/\n(-)+\n/), function (part) {

      if (part.indexOf(':') < 0) {
        return;
      }

      try {

        var doc = yaml.load(part);

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