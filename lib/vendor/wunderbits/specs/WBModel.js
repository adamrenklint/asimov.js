// define([
//
//   'vendor/underscore',
//   'vendor/backbone',
//
//   'wunderbits/WBAssertionHelper',
//   'wunderbits/mixins/WBInstanceUtilitiesMixin',
//   'wunderbits/WBModel'
//
// ], function (_, Backbone, WBAssertionHelper, WBInstanceUtilitiesMixin, WBModel, undefined) {
//
//   'use strict';
//
//   var _itShould = WBAssertionHelper;
//
//   describe('WBModel', function () {
//
//     _itShould.beSubClassOf(WBModel, Backbone.Model, 'Backbone.Model');
//
//     describe('#initialize', function () {
//
//       _itShould.assignEachInstanceUniqueAttribute(WBModel, 'uid');
//
//       _itShould.applyMixin(new WBModel(), WBInstanceUtilitiesMixin, 'WBInstanceUtilitiesMixin');
//     });
//   });
// });