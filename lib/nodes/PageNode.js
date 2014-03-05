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

    'initialize': function (attributes, options) {

      var self = this;
      self.options = options;
      self.attributes = attributes || {};

      self.assert('defined', 'string', self.attributes.path, 'Cannot create page node without path');

      console.log('PageNode.initialize', 'path', self.attributes.path, )

      var newUrl = self.getUrl(self.attributes.path);
      self.attributes.url = self.attributes.url || newUrl;

      attributes = _.clone(self.attributes);
      self.attributes = {};

      // console.log('ZZZETTZZZ url: ' + attributes.url + ' from ' + self.attributes.path);

      _super.initialize.call(self, attributes, options);

      self.bindOnceTo(self.mediator, 'collection:pages', self.saveAllPagesCollection);
    },

    'saveAllPagesCollection': function (pages) {

      var self = this;
      self.pages = pages;
    },

    'getUrl': function (path) {

      var self = this;

      if (!path) {
        return false;
      }

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
    },

    'children': function () {

      var self = this;
      var url = self.attributes.url;

      self.assert('object', self.pages, 'No collection with all pages defined - where am I supposed to look for the children?');

      var children = self.pages.find(function (model) {
        var _url = model.attributes.url;
        // self.logger.log('model : ' + model.id);
        if (_url.indexOf(url) === 0 && _url !== url) {
          _url = _url.replace(url, '').replace('/', '');
          return _url.indexOf('/') < 0;
        }
        return false;
      }) || [];

      // console.log(url, children.length);process.exit()

      // return new self.pages.constructor(children, self.options);
    }
  });
});