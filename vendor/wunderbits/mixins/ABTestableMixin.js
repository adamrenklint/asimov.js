define([

  '../WBMixin'

], function(WBMixin, undefined) {

  'use strict';

  return WBMixin.extend({

    'makeABTestable': function(weight, userId) {

      var self = this;
      var index, id;

      // probability of A over B.. defaults to 50%
      weight = weight || 0.5;
      if(typeof weight !== 'number' || weight <= 0 || weight >= 1) {
        throw new Error('weight for A/B testing should be a number between 0 & 1 , excluding those values');
      }

      // Always use the same mode for a logged-in user
      if(userId) {
        id = parseInt(userId, 16);
        if(!isNaN(id)) {
          index = Math.floor(id % (1 / weight));
        }
      }

      // Use a random mode for a non-logged in user
      if(!index) {
        index = Math.floor(Math.random() / weight);
      }

      // if index < 1 is A anything greater is B
      self.ABMode = 'AB'.substr((index < 1) ? 0 : 1, 1);

      // Call initializeA or initializeB
      var extraInit = self['initialize' + self.ABMode];
      if(typeof extraInit === 'function') {
        return extraInit.apply(self);
      }
    },

    'renderAB': function() {

      var self = this;

      // Call renderA or renderB
      var extraRender = self['render' + self.ABMode];
      if(typeof extraRender === 'function') {
        return extraRender.apply(self);
      }
      else {
        return self;
      }
    },

    'forceInitOfType': function (type) {

      var self = this;
      self.ABMode = type;
      var extraInit = self['initialize' + type];
      if(typeof extraInit === 'function') {
        return extraInit.apply(self);
      }
    },

    'forceRenderOfType': function (type) {

      var self = this;
      self.ABMode = type;
      var extraRender = self['render' + type];
      if(typeof extraRender === 'function') {
        return extraRender.apply(self);
      }
      else {
        return self;
      }
    }
  });

});