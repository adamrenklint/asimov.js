define([
  '../helpers/email',
  './DomTreeMixin'
], function (
  EmailHelper,
  DomTreeMixin,
  undefined
) {

  'use strict';

  return DomTreeMixin.extend({
    'renderEmails': function ($el) {
      return this.renderTokens($el, EmailHelper);
    }
  });
});
