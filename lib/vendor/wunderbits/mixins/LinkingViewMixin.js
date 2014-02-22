define([
  '../helpers/links',
  './DomTreeMixin'
], function (
  LinkHelper,
  DomTreeMixin,
  undefined
) {

  'use strict';

  return DomTreeMixin.extend({
    'renderLinks': function ($el) {
      return this.renderTokens($el, LinkHelper);
    }
  });
});
