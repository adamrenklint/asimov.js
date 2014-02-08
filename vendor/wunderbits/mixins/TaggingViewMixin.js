define([
  '../helpers/tag',
  './DomTreeMixin'
], function(
  TagHelper,
  DomTreeMixin,
  undefined
) {

  'use strict';

  return DomTreeMixin.extend({
    'renderTags': function ($el) {
      return this.renderTokens($el, TagHelper);
    }
  });
});