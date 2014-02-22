define([

  './lib/dependencies',
  'vendor/md5',

  'urls',

  './WBEventEmitter',
  './lib/createUID'

], function (
  dependencies, md5,
  urls,
  WBEventEmitter, createUID,
  undefined
) {

  'use strict';

  var _ = dependencies._;

  var urlMap = urls.urlMap;
  var baseUrl = urls.baseUrl || '/';

  var _super = WBEventEmitter.prototype;

  var applierMap = {};

  return WBEventEmitter.extend({

    'initialize': function (name, style) {

      var self = this;

      _super.initialize.apply(self, arguments);

      if (!_.isString(name)) {
        throw new Error('Cannot initialize WBStyleApplier without a namespace');
      }

      if (!_.isString(style)) {
        throw new Error('Cannot initialize WBStyleApplier without styles');
      }

      self.name = name;
      self.rawStyle = style;
    },

    'getElementId': function (variables) {

      var self = this;
      variables || (variables = {});
      var string = self.name + JSON.stringify(variables);
      return md5(string);
    },

    'remove': function () {

      var self = this;
      var elementId = self.getElementId();

      if (applierMap[elementId] && self.target) {

        applierMap[elementId] = _.without(applierMap[elementId], self.target.uid);

        if (!applierMap[elementId].length) {
          var element = document.getElementById(elementId);
          element.parentNode.removeChild(element);
        }
      }

      self.target.off('destroy', self.remove);
    },

    'apply': function (target, variables) {

      var self = this;
      variables || (variables = {});

      if (!target || !_.isFunction(target.on)) {
        throw new Error('Cannot apply styles without valid target');
      }

      if (!target.uid) {
        target.uid = createUID();
      }

      self.target = target;

      var elementId = self.getElementId(variables);
      var existingEl = document.getElementById(elementId);

      if (existingEl) {

        if (!~applierMap[elementId].indexOf(target.uid)) {
          applierMap[elementId].push(target.uid);
          target.on('destroy', self.remove);
        }

        return;
      }

      var headEl = document.getElementsByTagName('head')[0];

      // TODO: replace variables
      // var css = formatStyles(self.rawStyle, variables);
      // should be cached
      var css = self.rawStyle;

      var style = document.createElement('style');
      style.id = elementId;
      style.type = 'text/css';
      style.setAttribute('data-requiremodule', self.name);
      style.setAttribute('data-requirecontext', 'styles');

      css = css.replace(/url\(\"([^\"]+)/g, function (match) {
        return match.replace(/url\(\"([^\"]+)/, function (all, url) {
          if(/^(https?:)?\/\//.test(url)) {
            return 'url(\"' + url;
          }
          if(!!urlMap) {
            url = urlMap[url];
          }
          return 'url(\"' + baseUrl + url;
        });
      });

      var rules = document.createTextNode(css);

      if (style.styleSheet) {
        style.styleSheet.cssText = rules.nodeValue;
      }
      else {
        style.appendChild(rules);
      }

      headEl.appendChild(style);

      applierMap[elementId] = [target.uid];
      target.on('destroy', self.remove);
    }
  });
});