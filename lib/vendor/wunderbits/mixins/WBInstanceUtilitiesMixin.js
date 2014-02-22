define([

  '../lib/isInstanceOf',
  '../WBMixin'

], function (isInstanceOf, WBMixin, undefined) {

  'use strict';

  return WBMixin.extend({

    'isInstanceOf': isInstanceOf
  });
});