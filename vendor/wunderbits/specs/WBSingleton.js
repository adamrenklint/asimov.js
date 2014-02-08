// define([
// 
//   'vendor/underscore',
// 
//   'wunderbits/lib/events',
//   'wunderbits/WBSingleton',
//   'wunderbits/WBAssertionHelper'
// 
// ], function (_, events, WBSingleton, WBAssertionHelper, undefined) {
// 
//   'use strict';
// 
//   var _itShould = WBAssertionHelper;
// 
//   describe('WBSingleton', function () {
// 
//     var SubSingleton = WBSingleton.extend({
//       foo: 'bar'
//     });
// 
//     _itShould.applyMixin(WBSingleton, events, 'WBEventsMixin (actually lib/events)');
//     _itShould.applyMixin(SubSingleton, events, 'WBEventsMixin on subclass (actually lib/events)');
// 
//     describe('@extend', function () {
// 
//       var SingletonSubClass = WBSingleton.extend({
//         foo: 'bar'
//       });
// 
//       var SingletonSubClass2 = SingletonSubClass.extend({
//         foo: 'moBar'
//       });
// 
//       it('should have @extend class method', function () {
//         expect(_.isFunction(SingletonSubClass.extend)).toBeTruthy();
//         expect(_.isFunction(SingletonSubClass2.extend)).toBeTruthy();
//       });
// 
//       it('should return extended class', function () {
//         expect(_.isFunction(SingletonSubClass)).toBeTruthy();
//         expect(_.isFunction(SingletonSubClass2)).toBeTruthy();
//       });
// 
//       it('should return extendable class', function () {
//         expect(_.isFunction(SingletonSubClass.extend)).toBeTruthy();
//         expect(_.isFunction(SingletonSubClass2.extend)).toBeTruthy();
//       });
// 
//       it('should extend the subclass with passed options', function () {
//         expect(SingletonSubClass.foo).toEqual('bar');
//         expect(SingletonSubClass2.foo).toEqual('moBar');
//       });
//     });
// 
//     describe('#initialize', function () {
// 
//       var error = 'Cannot create instance of singleton class';
// 
//       _itShould.throwErrorIf('trying to create instance', error, function () {
//         new WBSingleton();
//       });
// 
//       _itShould.throwErrorIf('trying to create instance of subclass', error, function () {
//         var SubSingleton = WBSingleton.extend({
//           foo: 'bar'
//         });
//         new SubSingleton();
//       });
//     });
//   });
// });