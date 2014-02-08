define([

  '../lib/dependencies',

  '../helpers/xss',

  '../WBMixin',
  '../WBLanguageManager'

], function(dependencies, XSSHelper, WBMixin, WBLanguageManager, undefined) {

  'use strict';

  var $ = dependencies.$;

  return WBMixin.extend({

    'localize': function() {

      var self = this;
      self.bindTo(WBLanguageManager, 'done', self.renderLocalized);
      self.trigger('localized');
    },

    'renderLocalized': function () {

      var self = this;
      self.renderLabels();
      self.renderPlaceHolders();
      self.renderTitles();
      self.renderOptions();
      self.renderAriaAttributes();
    },

    'convertSymbols': function (value) {

      // convert single $ symbols to $1, $2 etc.
      var index = 0;
      return value.replace(/\$([^0-9]|$)/g, function ($, nextChar) {

        return '$' + (++index) + (nextChar || '');
      });
    },

    'replaceSymbols': function (value, data) {

      // Replace the $1, $2 tokens with actual values
      var index = 0;
      return value.replace(/\$([0-9])/g, function () {

        var cleanText = XSSHelper.clean(data[index]);
        var markup = '<token class="token_' + index + '" title="' + cleanText + '">' + cleanText + '</token>';
        index++;
        return markup;
      });
    },

    'renderLabels': function () {

      var self = this;
      var theLangData = WBLanguageManager.getKeys();
      var labels = self.$el && self.$el.find('text[rel]');
      var label, key, value, data;

      if (labels.length) {
        for (var i = 0, len = labels.length; i < len; i++) {

          label = $(labels[i]);
          key = label.attr('rel');
          value = theLangData[key];

          if (!value) {
            continue;
          }

          data = label.attr('data');
          if (data && data.length) {
            // split by "snowman" unicode character
            data = data.split('\u2603');
            value = self.convertSymbols(value);
            data = WBLanguageManager.localizationception(data);
            value = self.replaceSymbols(value, data);
          }

          label.html(value);
        }
      }

      theLangData = null;
      self.trigger('localized:labels');
    },

    'renderAttributes': function (attributeName, selectorString, applyAsText, reverseClean) {

      var self = this;
      var elements = self.$el && self.$el.find(selectorString) || [];
      var element, key, extraData, args, value;

      // include self element!
      if (self.$el) {
        elements.push(self.$el);
      }

      if (elements.length) {
        for (var i = 0, len = elements.length; i < len; i++) {

          element = $(elements[i]);
          key = element.attr('data-key-' + attributeName);
          if (key) {
            args = [key];
            extraData = element.attr('data-' + attributeName);
            if (extraData) {
              extraData = extraData.split('\u2603');
              args.push(extraData);
            }

            value = WBLanguageManager.getText.apply(WBLanguageManager, args) || key;

            if (reverseClean) {
              value = XSSHelper.reverseClean(value);
            }

            if (applyAsText) {
              element.text(value);
            }
            else {
              element.attr(attributeName, value);
            }
          }
        }
      }

      self.trigger('localized:' + attributeName);
    },

    'renderTitles': function () {

      var self = this;
      self.renderAttributes('title', '[data-key-title]');
    },

    'renderPlaceHolders': function () {

      var self = this;
      self.renderAttributes('placeholder', 'input[data-key-placeholder], textarea[data-key-placeholder], input[data-key-value]', false, true);
      self.renderAttributes('value',  'input[data-key-value], textarea[data-key-value]');
    },

    'renderOptions': function () {

      var self = this;
      var applyAsText = true;
      self.renderAttributes('text', 'option[data-key-text]', applyAsText);
    },

    'renderAriaAttributes': function () {

      var self = this;
      self.renderAttributes('aria-label', '[data-key-aria-label]');
    }
  });
});