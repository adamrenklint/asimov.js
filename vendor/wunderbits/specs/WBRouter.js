// describe('wunderbits/WBRouter', function () {

//   var modules = {};

//   load(modules, [

//     'wunderbits/WBRouter',
//     'vendor/backbone'

//   ]);

//   itShould.beSubClassOf(modules, 'WBRouter', 'backbone.Router');
// });

// define([
//
//   'vendor/backbone',
//   'vendor/underscore',
//
//   'wunderbits/WBAssertionHelper',
//   'wunderbits/WBRouter',
//   'wunderbits/mixins/WBInstanceUtilitiesMixin'
//
// ], function (Backbone, _, WBAssertionHelper, WBRouter, WBInstanceUtilitiesMixin) {
//
//   'use strict';
//
//   var _itShould = WBAssertionHelper;
//
//   describe('WBRouter', function () {
//
//     _itShould.beSubClassOf(WBRouter, Backbone.Router, 'Backbone.Router');
//
//     var RouterClass = WBRouter.extend({
//       routes: {
//         'master/:id': 'openMasterWithID'
//       },
//       openMasterWithID: function () {}
//     });
//     var router = new RouterClass();
//
//     sinon.spy(Backbone.history, 'start');
//
//     describe('#initialize', function () {
//
//       _itShould.applyMixin(router, WBInstanceUtilitiesMixin, 'WBInstanceUtilitiesMixin');
//     });
//
//     describe('#start', function () {
//
//       it('should trigger Backbone.history.start', function () {
//         Backbone.history.start.reset();
//         router.start();
//         expect(Backbone.history.start.called).toBeTruthy();
//       });
//     });
//
//     describe('#setRoute', function () {
//
//       it('should change location when triggered', function () {
//         var original = window.location.href;
//         if (window.location.hash) {
//           original = original.replace('#/', '');
//         }
//         router.setRoute('master/thing');
//         var current = window.location.href;
//         expect(current).toEqual(original + '#/master/thing');
//         router.setRoute();
//       });
//
//       it('should change location to home when triggered without route', function () {
//         router.setRoute('master/thing');
//         var original = window.location.href;
//         router.setRoute();
//         var current = window.location.href;
//         var comparator = original.replace('master/thing', '');
//         expect(current).toEqual(comparator);
//       });
//     });
//   });
// });