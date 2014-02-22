define([
  'wunderbits/WBSingleton',
  'wunderbits/data/tld'
], function (WBSingleton, TLDData, undefined) {

  'use strict';

  var TLDs = TLDData.list;
  var tldExtractionRegExp = /\.(\w{2,6})(?:\/|:|$)/;

  function noAccess () {
    throw new Error('not implemented');
  }

  return WBSingleton.extend({

    'createLink': noAccess,

    'isValidMatch': function (text) {

      var self = this;
      var validationRegExp = self.validationRegExp;

      // skip validationm, if no regexp defined for is
      if (!validationRegExp) {
        return true;
      }

      // else validate the text, if any
      if (!text || !self.validationRegExp.test(text)) {
        return false;
      }

      // format looks fine, validate the TLD, if the helper asked for it
      if (self.validateTLD) {
        var tldMatch = text.match(tldExtractionRegExp);
        return !!(tldMatch && tldMatch[1] && TLDs.indexOf(tldMatch[1]) >= 0);
      }
      else {
        return true;
      }
    },

    'extractTokens': function (text) {

      if (text && text.length) {

        var self = this;
        var tokens = [];
        var lastIndex = 0;

        // extract the matches
        text.replace(self.extractionRegExp, function (match, index , original) {

          var invalidLeadingChars = self.invalidLeadingChars;
          // ignore if the leading character before the match was invalid
          if (index > 0 && invalidLeadingChars && invalidLeadingChars.test(original[index - 1])) {
            return;
          }

          // extract the text before the match, if any
          if (index > 0) {
            var before = original.substring(lastIndex, index);
            // move the marker
            lastIndex += before.length;
            tokens.push(before);
          }

          // the match itself
          tokens.push(match);

          // move the marker
          lastIndex += match.length;
        });

        // extract the last remaining bits, if any
        if (lastIndex > 0 && lastIndex < text.length) {
          tokens.push(text.substring(lastIndex));
        }

        return tokens;
      }
    },

    'tokenize': function (node) {

      var self = this;

      // skip text nodes immediately under an existing link
      if (node.parentNode && node.parentNode.nodeName.toLowerCase() === 'a') {
        return;
      }

      var text = node.nodeValue;
      var sections = self.extractTokens(text);

      // skip procesing nodes that aren't valid matches
      if (!sections || !sections.length || (sections.length === 1 && !self.isValidMatch(sections[0]))) {
        return;
      }

      var section, nodes = [];

      // loop over the sections
      while (sections.length) {

        // pick the leading fragment
        section = sections.shift();

        if (!section.length) {
          continue;
        }

        // valid token, mark it
        if (self.isValidMatch(section)) {
          nodes.push(self.createLink(section));
        }
        // otherwise save the fragment in a text node
        else {
          section && nodes.push(document.createTextNode(section));
        }
      }

      return nodes;
    }
  });
});