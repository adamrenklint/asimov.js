var Base = require('../core/Base');
var _ = require('lodash');
var handlebars = require('handlebars');
var _super = Base.prototype;

module.exports = Base.extend({

  'initialize': function () {

    var self = this;
    _super.initialize.apply(self, arguments);

    if (typeof self.run !== 'function') {
      throw new Error('Cannot register template helper without callback:' + JSON.stringify(self.attributes));
    }

    handlebars.registerHelper(self.options.name, self.execute);

    self.bindTo(self.mediator, 'rendering:page', self.setCurrentPage);

    self.pages = self.options.pages;
    self.templates = self.options.templates;
    self.scripts = self.options.scripts;
    self.stylesheets = self.styleSheets = self.options.styleSheets;
  },

  'registerDependency': function (target, dependency) {

    var self = this;
    self.mediator.trigger('register', target, dependency);
    self.mediator.trigger('register', dependency, dependency);
  },

  'setCurrentPage': function (page) {

    var self = this;
    self.currentPage = page;
    self.currentUrl = page.attributes.url;
  },

  'vent': function () {

    var self = this;
    var args = _.toArray(arguments);
    args[0] = 'vent:' + args[0];
    self.trigger.apply(self, args);
  },

  'execute': function () {

    var self = this;
    var args = self.args(arguments);

    self.registerDependency(self.currentPage, self.options.model);

    var result = self.run.apply(self, args);
    return _.isString(result) ? new handlebars.SafeString(result) : result;
  },

  'args': function (_args) {

    var self = this;
    _args = _.toArray(_args);
    var args = [];

    _args.forEach(function (argument, index) {
      if (_.isObject(argument) && argument.hash) {

        argument.hash.page = self.currentPage.attributes;
        args.push(argument.hash);

        _.isFunction(argument.fn) && args.push(self.wrapFunction(argument.fn));
      }
      else {
        args.push(argument);
      }
    });

    return args;
  },

  'wrapFunction': function (fn) {

    var self = this;
    var current = self.currentPage;

    return function (data) {
      data = data || {};
      data.page = current.attributes;
      return fn(data);
    };
  },

  'html': function (tagName, data) {

    var self = this;

    if (!tagName) {
      throw new Error('Cannot format HTML tag without declaring its tagName');
    }

    data || (data = {});

    var markup = '<' + tagName;
    var attributes = [];

    var nonAttributes = ['text', 'html', 'tagName'];
    var booleanAttributes = ['allowfullscreen', 'enabled', 'disabled'];
    _.each(data, function (attribute, key) {
      if (attribute && nonAttributes.indexOf(key) < 0) {

        if (booleanAttributes.indexOf(key) >= 0) {
          attributes.push(key);
        }
        else {
          attributes.push(key + '="' + attribute + '"');
        }
      }
    });

    attributes = _.sortBy(attributes, function (value) {
      return value;
    });

    attributes.length && (markup += ' ' + attributes.join(' '));

    markup += '>';

    if (data.html) {
     markup += data.html;
    }
    else if (data.text) {
      markup += _.escape(data.text);
    }

    markup += '</' + tagName + '>';

    return markup;
  }
});