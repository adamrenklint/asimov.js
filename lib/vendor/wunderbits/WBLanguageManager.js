define([

  './lib/dependencies',
  'vendor/handlebars',

  'languages/available',

  './mixins/WBBindableMixin',
  './mixins/WBEventsMixin',
  './WBSingleton',
  './helpers/xss'

], function (dependencies, Handlebars, available, WBBindableMixin, WBEventsMixin, WBSingleton, XSSHelper, undefined) {

  'use strict';

  var global = window;
  var _ = dependencies._;

  var defaultLanguage = 'en_US';
  var availableLanguages = available.data || {};
  var languageAliases = availableLanguages.aliases || {};
  delete availableLanguages.aliases;

  var _langData = {};

  // This converts languages codes from RFC 4646 to ISO format
  function _convert (code) {

    if(code[2] === '-') {
      code = code.split('-');
      code[1] = code[1].toUpperCase();
      code = code.join('_');
    }

    return code;
  }

  var WBLanguageManager = WBSingleton.extend({

    'mixins': [
      WBBindableMixin,
      WBEventsMixin
    ],

    'getKeys': function () {
      return _langData.keys;
    },

    // Cross-broswer language detection
    'detectLang': function  () {

      var navigator = global.navigator;
      var langCode = _convert(navigator.userLanguage || navigator.language || defaultLanguage);

      // Resolve aliases
      while (langCode in languageAliases) {
        langCode = _convert(languageAliases[langCode]);
      }

      return langCode;
    },

    'fetchData': function (code) {

      var self = this;
      var available = availableLanguages;

      // default language if no code was passed
      code = code || defaultLanguage;

      // try 5 char code followed by 2 char code
      var meta = (available[code] || available[code.substr(0, 2)]);

      // if language isn't available, try the same as above for the default language
      meta = meta || available[defaultLanguage] || available[defaultLanguage.substr(0, 2)];

      require([
        'languages/' + meta.file
      ], function (data) {
        self._dataLoaded(code, meta, data);
      });
    },

    'getLabel': function () {

      var data = _.toArray(arguments);

      // localization key
      var key  = data.shift();

      // handlebars would send an options object as the last param
      var options = data[data.length - 1];
      if(options && options.hash) {
        options = data.pop();
      }

      // Just return blank placeholders right now, rendering will fill in the values
      var str = '<text rel="' + key + '"';
      if(data.length) {
        // seperate data with the "snowman" unicode character
        str += ' data="' + data.join('\u2603') + '"';
      }
      str += '></text>';
      return new Handlebars.SafeString(str);
    },

    'getText': function () {

      var self = this;
      var data = _.toArray(arguments);
      var theLangData = _langData.keys;

      // localization key
      var key  = data.shift();
      var value = theLangData[key];

      if (!value) {

        // console.error(key);
        return;
      }

      if (data && data.length) {

        // convert single $ symbols to $1, $2 etc.
        var index = 0;
        value = value.replace(/\$([^0-9]|$)/g, function ($, nextChar) {

          return '$' + (++index) + (nextChar || '');
        });

        data = self.localizationception(data);

        // Replace the $1, $2 tokens with actual values
        index = 0;
        value = value.replace(/\$([0-9])/g, function () {

          var cleanText = XSSHelper.clean(data[index].toString());
          var markup = cleanText;
          index++;

          return markup;
        });

        return value;
      }

      return value;
    },

    'localizationception': function (data) {

      var theLangData = _langData.keys;
      var param, value;

      // localizationception
      for (var i = 0, len = data.length; i < len; i++) {
        param = data[i].toString();
        value = theLangData[param.substr(1)];
        if (param[0] === '$' && value) {
          data[i] = value;
        }
      }

      return data;
    },

    '_dataLoaded': function (code, meta, lang) {

      var self = this;

      // store the data a local cache
      _langData.name = lang.name;
      _langData.keys = lang.data;

      // announce the ready event
      self.trigger('done', code, meta, lang);
    }
  });

  // getLabel is also the "localized" handlebars helper
  Handlebars.registerHelper('localized', WBLanguageManager.getLabel);

  return WBLanguageManager;
});
