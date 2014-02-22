// define([
//
//   'vendor/underscore',
//   'vendor/backbone',
//
//   'wunderbits/WBAssertionHelper',
//   'wunderbits/WBCollection',
//   'wunderbits/mixins/WBInstanceUtilitiesMixin'
//
// ], function (_, Backbone, WBAssertionHelper, WBCollection, WBInstanceUtilitiesMixin, undefined) {
//
//   'use strict';
//
//   var _itShould = WBAssertionHelper;
//
//   describe('WBCollection', function () {
//
//     _itShould.beSubClassOf(WBCollection, Backbone.Collection, 'Backbone.Collection');
//
//     describe('#initialize', function () {
//
//       _itShould.assignEachInstanceUniqueAttribute(WBCollection, 'uid');
//
//       _itShould.applyMixin(new WBCollection(), WBInstanceUtilitiesMixin, 'WBInstanceUtilitiesMixin');
//     });
//   });
// });