define([

  '../lib/dependencies',

  './strings',
  './xss',

  '../WBSingleton',

  '../mixins/EmojiData'

], function (
  dependencies,
  StringsHelper, XSSHelper,
  WBSingleton,
  EmojiData,
  undefined
) {

  'use strict';

  var $ = dependencies.$;

  return WBSingleton.extend({

    'emojify': function (textNode) {

      var self = this;

      var text = XSSHelper.clean(textNode.nodeValue);
      text = self.getEmojifiedString(text);
      $(textNode).replaceWith($('<div/>').html(text).html());
    },

    'getEmojifiedString': function (string) {

      var self = this;
      var unicode, name;

      for (var i = 0, len = string.length; i < len; i++) {
        unicode = string && StringsHelper.unicodeAt(string, i).toString(16);
        name = EmojiData.unicodeIndex[unicode];
        if (name) {

          unicode = '<span title="' + name + '" class="emoji emoticon _' + unicode + '">&#x' + unicode + '</span>';
          string = StringsHelper.replaceAt(string, i, unicode, 1);
          string = self.getEmojifiedString(string);
        }
      }

      return string;
    }

  });
});