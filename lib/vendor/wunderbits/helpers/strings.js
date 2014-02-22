define([

  '../lib/dependencies',

  '../WBSingleton',

  '../mixins/EmojiData'

], function (dependencies, WBSingleton, EmojiData, undefined) {

  'use strict';

  var $ = dependencies.$;
  var _ = dependencies._;

  return WBSingleton.extend({

    // https://gist.github.com/slevithan/2290602
    'fromCodePoint': function () {
      var chars = [], point, offset, units, i;
      for (i = 0; i < arguments.length; ++i) {
        point = arguments[i];
        offset = point - 0x10000;
        units = point > 0xFFFF ? [0xD800 + (offset >> 10), 0xDC00 + (offset & 0x3FF)] : [point];
        chars.push(String.fromCharCode.apply(null, units));
      }
      return chars.join("");
    },

    'emojiTokensToUnicode': function (string) {

      var self = this;

      string = string.replace(/:[^:|.]+:/g, function (match) {

        var name = match.replace(/:/g, '');
        var unicode = EmojiData.nameIndex[name];

        if (unicode) {
          match = self.fromCodePoint('0x' + unicode);
        }

        return match;
      });

      return string;
    },

    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/charCodeAt#Example_2.3A_Fixing_charCodeAt_to_handle_non-Basic-Multilingual-Plane_characters_if_their_presence_earlier_in_the_string_is_unknown
    'unicodeAt': function (str, idx) {
      // ex. fixedCharCodeAt ('\uD800\uDC00', 0); // 65536
      // ex. fixedCharCodeAt ('\uD800\uDC00', 1); // 65536
      idx = idx || 0;
      var code = str.charCodeAt(idx);
      var hi, low;
      if (0xD800 <= code && code <= 0xDBFF) { // High surrogate (could change last hex to 0xDB7F to treat high private surrogates as single characters)
        hi = code;
        low = str.charCodeAt(idx+1);
        if (isNaN(low)) {
          throw new Error('High surrogate not followed by low surrogate in unicodeAt()');
        }
        return ((hi - 0xD800) * 0x400) + (low - 0xDC00) + 0x10000;
      }
      if (0xDC00 <= code && code <= 0xDFFF) { // Low surrogate
        // We return false to allow loops to skip this iteration since should have already handled high surrogate above in the previous iteration
        return false;
        /*hi = str.charCodeAt(idx-1);
        low = code;
        return ((hi - 0xD800) * 0x400) + (low - 0xDC00) + 0x10000;*/
      }
      return code;
    },

    'replaceAt': function (string, position, replacer, buffer) {

      var before = string.substring(0, position);
      var after = string.substring((position + 1 + buffer));

      string = before + replacer + after;

      return string;
    },

    'contains': function (haystack, needle) {

      var self = this;

      if (_.isArray(needle)) {

        return self.containsArray(haystack, needle);
      }
      else {

        return self.containsString(haystack, needle);
      }

    },

    // accepts single needle as argument
    'containsString': function (haystack, needle) {

      var found = false;
      for (var i = 0; i < haystack.length; i++) {

        if (haystack[i] === needle) {

          found = true;
          i = haystack.length;
        }
      }

      return found;
    },

    // similar to contains, but accepts array of needles
    'containsArray': function (haystack, needleArray) {

      var self = this;
      var found = false;

      for (var i = 0; i < needleArray.length; i++) {

        if (self.containsString(haystack, needleArray[i])) {

          found = true;
          i = needleArray.length;
        }
      }

      return found;
    },

    // trims whitespace, reduces inner newlines and spaces
    // and keeps string below defined length (def: 500 chars)
    'trim': function (string, length) {

      // default length to trim by is 500 chars
      length = length || 500;

      // get rid of stacked newlines
      string = (string || '').replace(/\n{3,}/g, '\n\n');

      // get rid of redonk spaces
      string = string.replace(/\s{3,}/g, ' ');
      string = $.trim(string);

      // only trim string length if it's
      if (string.length > length) {
        string = string.substring(0, length - 3) + '...';
      }

      return string;
    },

    // returns zero padded string (for numbers) - used by date stuff
    'pad': function (str, minLength, after) {

      str = String(str);

      while (str.length < minLength) {

        str = after ? str + '0' : '0' + str;
      }

      return str;
    },

    // helper method for overriden set to convert
    // all values but null to strings.
    // used a different way for bool, check this:
    // http://jsperf.com/boolean-to-string,
    'convertValueToString': function (value) {

      if (_.isString(value)) {
        return value;
      }
      else if (_.isNull(value)) {
        return 'null';
      }
      else if (_.isBoolean(value)) {
        return value ? 'true' : 'false';
      }
      else {
        return '' + value;
      }
    },

    'capitalizeFirstLetter': function (string) {

      return string.charAt(0).toUpperCase() + string.slice(1);
    },

    'sanitizeHash': function (hash) {

      var parts = hash.split('/');
      var filterString = 'FILTERED';
      var idPattern = /([lw]?.{30,32})/;
      var accessToken = /access_token/;

      if (parts[1] === 'login') {

        if (parts[2] && accessToken.test(parts[2])) {

          parts[2] = 'FACEBOOK_LOGIN';
        }
      }
      else if ((parts[1] === 'tasks' || parts[1] === 'lists') && idPattern.test(parts[2])) {

        parts[2] = filterString;
      }
      else if ((parts[1] === 'extension' && parts[2] === 'add') || (parts[1] === 'reset' && parts[2] === 'password') || (parts[1] === 'connect' && parts[2] === 'facebook')) {

        parts[3] && (parts[3] = filterString);
        parts[4] && (parts[4] = filterString);
        parts = parts.splice(0, 5);
      }
      else if ((parts[1] === 'add' || parts[1] === 'search')) {

        parts[2] && (parts[2] = filterString);
      }
      else if (parts[1] === 'shared') {

        if (parts[2] === 'fb') {

          parts[3] && (parts[3] = filterString);
        }
        else {

          parts[2] && (parts[2] = filterString);
          parts[3] && (parts[3] = filterString);
        }
      }

      // handle fb returns on share routes
      if (parts[1] === 'lists' && /share.+/.test(parts[3])) {

        if (/access_token/.test(parts[3])) {

          parts[3] = 'share/CONNECT_FACEBOOK_RETURN';
        }
        else if (parts[3] !== 'share') {

          parts[3] = 'share/FACEBOOK_SHARE_RETURN';
        }
      }

      return parts.join('/');
    },

    'dateString': function () {

      var self = this;
      var date = new Date();
      var time = self.pad((date.getHours() + 1), 2) + ':' +
                 self.pad(date.getMinutes(), 2) + ':' +
                 self.pad(date.getSeconds(), 2);
      return date.getFullYear() + self.pad((date.getMonth() + 1), 2) + self.pad(date.getDate()) + '-' + time;
    },

    'escapeForRegex': function (s) {

      return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    }
  });
});