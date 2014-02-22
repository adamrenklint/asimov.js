// define([
// 
//   'vendor/backbone',
//   'vendor/underscore',
// 
//   'wunderbits/lib/events',
//   'wunderbits/lib/isInstanceOf',
//   'wunderbits/WBAssertionHelper',
//   'wunderbits/WBModalView'
// 
// ], function (Backbone, _, events, isInstanceOf, WBAssertionHelper, WBModalView, undefined) {
// 
//   'use strict';
// 
//   var _itShould = WBAssertionHelper;
// 
//   describe('WBModalView', function () {
// 
//     describe('#render', function () {
// 
//       var instance, error;
// 
//       beforeEach(function () {
//         instance = new WBModalView();
//       });
// 
//       error = 'Cannot render modal view without data.';
// 
//       _itShould.throwErrorIf('data IS empty', error, function () {
//         instance.render();
//       });
// 
//       _itShould.notThrowErrorIf('data IS NOT empty', error, function () {
//         instance.render({'title': 'BLAH', 'close': 'sdlfkj', 'id': 'awesomeid'});
//       });
// 
//       error = 'Cannot render WBModalView without a template.';
// 
//       _itShould.notThrowErrorIf('template function IS present', error, function () {
//         instance.template = function () {};
//         instance.render({'title': 'BLAH'});
//       });
//     });
//   });
// });