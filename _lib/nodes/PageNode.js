var MetaNode = require('./MetaNode');
var _ = require('lodash');
var npath = require('path');
var _super = MetaNode.prototype;

module.exports = MetaNode.extend({

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

    self.bindTo(self, 'change:path', self.parseSortablePath);
    self.attributes.path && self.parseSortablePath();

    self.bindTo(self, 'change', 'transmitChange');
  },

  'transmitChange': function () {

    var self = this;
    var changed = self.changedAttributes();
    if (changed.length && changed.indexOf('rendered') < 0 && changed.indexOf('raw') < 0) {
      _.defer(function () {
        self.trigger('forced:change', self);
      });
    }
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

    var parts = attributes.path.split('/');
    parts.pop();
    attributes.folderPath = parts.join('/');

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

    path = path
      .replace(npath.join(process.cwd(), self.options.paths.content), '')
      .replace(self.options.paths.content, '')
      .replace(npath.join(process.cwd(), self.options.paths.frameworkPages), '')
      .replace(/\/_/g, '/');

    path = self.parsePosition(path);

    var parts = path.split('/');
    var filename = parts.pop();
    self.parseTemplate(filename);

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

  'parseSortablePath': function () {

    var self = this;
    var path = self.attributes.path;
    var padding = '00000';
    var limit = 5;

    var sortablePath = path.replace(/(\d)+-/g, function (match) {
      var number = parseInt(match.replace('-', ''), 10);
      return (padding + number).slice(-limit) + '-';
    });

    self.set('sortablePath', sortablePath);
  },

  'parsePosition': function (string) {

    var self = this;
    var parts = string.split('/');
    var index = 0;
    var part;

    while (parts.length) {

      part = parts.pop();
      index++;

      var matches = part && part.match(/(\d)+-/);
      var match = matches && matches[0];

      if (match && typeof match === 'string') {

        var position = parseInt(part.replace('/', '').replace('-', ''), 10);

        if (typeof position === 'number') {

          if (index === 2) {
            self.set('position', position);
          }

          string = string.replace(match, '');
        }
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

  'children': function (options) {

    var self = this;
    var url = self.attributes.url;

    self.assert('defined string', url, 'PageNode has no valid url to compare children against');
    self.assert('object', self.pages, 'No collection with all pages defined - where am I supposed to look for the children?');

    return self.pages.childrenOf(url, options);
  },

  'template': function () {

    var self = this;
    return self.options.templates.find(function (template) {
      return template.attributes.name === self.attributes.template;
    });
  }
});