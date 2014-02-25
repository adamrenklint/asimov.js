/*

  page node model class

  contains all raw and formatted page data

*/

define([

  './MetaNode',
  'lodash',
  'path'

], function (MetaNode, _, npath) {

  var _super = MetaNode.prototype;

  return MetaNode.extend({

    'idAttribute': 'url',

    'defaults': function () {

      var self = this;

      return {
        'type': 'page',
        'raw': null,
        'path': null,
        'url': null,
        'template': null,
        'langCode': self.options.localization.defaultLangCode,
        'text': null,
        'title': null,
        'position': null
      };
    },

    'parseRaw': function () {

      var self = this;
      _super.parseRaw.apply(self, arguments);
      var attributes = self.attributes;

      console.log(attributes)
      var newUrl = self.getUrl(attributes.path);
      attributes.url = attributes.url || newUrl;

      self.set(attributes);
    },

    'getUrl': function (path) {

      var self = this;

      path = path.replace(npath.join(process.cwd(), self.options.paths.content), '').replace(npath.join(process.cwd(), self.options.paths.frameworkPages), '');

      var parts = path.split('/');
      var filename = parts.pop();
      self.parseTemplate(filename);
      parts[parts.length - 1] = self.parsePosition(parts[parts.length - 1]);

      var filenameParts = filename.split('.');
      if (filenameParts.length > 2) {
        var langCode = filenameParts[filenameParts.length - 2];
        if (langCode !== self.options.localization.defaultLangCode) {
          self.set('langCode', langCode);
          parts = _.compact([langCode].concat(parts));
        }
      }

      path = parts.join('/') || '/';
      if (path[0] !== '/') {
        path = '/' + path;
      }

      return path;
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
    }
  });
});