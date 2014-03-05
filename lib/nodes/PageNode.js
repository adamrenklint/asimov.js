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

    'initialize': function () {

      var self = this;
      _super.initialize.apply(self, arguments);

      self.bindOnceTo(self.mediator, 'collection:pages', self.saveAllPagesCollection);
    },

    'assertPath': function () {

      var self = this;
      var path = self.attributes.path;

      self.assert('defined', path, 'Cannot create page node without path');
      self.assert('string', path, 'Cannot create page node without path');

      if (path.indexOf('.txt') < 0) {
        throw new Error('PageNode path must point to a text file');
      }
    },

    'parseRaw': function () {

      var self = this;
      _super.parseRaw.apply(self, arguments);

      self.assertPath();

      var attributes = self.attributes;
      var newUrl = self.parseUrl(attributes.path);
      attributes.url = attributes.url || newUrl;

      self.set(attributes);
    },

    'saveAllPagesCollection': function (pages) {

      var self = this;
      self.pages = pages;
    },

    'parseUrl': function (path) {

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
      var matches = string && string.match(/(\d)+-/);
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

      var children = self.pages.filter(function (model) {

        var _url = model.attributes.url;
        if (url == _url) return false;


        var slashesInParentUrl = url.split('/').length - 1;
        if (url === '/') slashesInParentUrl = 0;
        var slashesInChildUrl = _url.split('/').length - 1;

        if (slashesInChildUrl > (slashesInParentUrl + 1)) return false;

        console.log('compare got here', url, _url);

        return true;
        return _url.indexOf(url) === 0;
      });

      // console.log(url, children.length);process.exit()

      return new self.pages.constructor(children, self.options);
    }
  });
});