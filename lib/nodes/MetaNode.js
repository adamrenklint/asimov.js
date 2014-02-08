/*
  
  ▲ asimov.js meta data node class

  representation of one language or set
  of data to be used by a page node

*/

define([

  '../core/Base',
  '../core/Filesystem',
  'lodash',
  'js-yaml'

], function (Base, Filesystem, _, yaml) {

  var _super = Base.prototype;

  var filesystem = new Filesystem();

  return Base.extend({

    'nodeType': 'meta',

    'initialize': function (options) {

      var self = this;
      _super.initialize.apply(self, arguments);

      self.meta = self.readMeta();
      self.parsePath();
    },

    'readMeta': function () {

      var self = this;
      var file = filesystem.readFile(self.options.nodePath);
      var meta = {};
      var parts = file.split('---\n');

      _.each(parts, function (part) {

        try {

          var doc = yaml.safeLoad(part);
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
    },

    'parsePath': function () {

      var self = this;
      var path = self.options.nodePath;
      var parts = path.split('/');
      var filename = parts[parts.length - 1];
      var fragments = filename.split('.');
      var templateEnd = 1;

      if (fragments.length > 2) {
        self.meta.langCode = fragments[fragments.length - 2];
        templateEnd = 2;
      }
      else {
        self.meta.langCode = self.options.localization.defaultLangCode;
      }

      self.meta.template = fragments.slice(0, fragments.length - templateEnd).join('.');
    }
  });
});