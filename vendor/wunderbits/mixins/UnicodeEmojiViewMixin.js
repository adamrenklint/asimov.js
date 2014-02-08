define([
  '../helpers/emoji',
  './DomTreeMixin'
], function(
  EmojiHelper,
  DomTreeMixin,
  undefined
) {

  'use strict';

  return DomTreeMixin.extend({

    'renderEmoji': function ($el) {

      var self = this;
      $el = $el || self.$el;

      if ($el.length) {
        self.walkTextNodes($el[0], EmojiHelper.emojify, EmojiHelper);
      }
      return self;
    }
  });

});