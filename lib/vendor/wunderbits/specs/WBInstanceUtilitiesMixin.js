// define([
//
//   'vendor/underscore',
//
//   'wunderbits/WBClass',
//   'wunderbits/mixins/WBInstanceUtilitiesMixin'
//
// ], function (_, WBClass, WBInstanceUtilitiesMixin, undefined) {
//
//   'use strict';
//
//   describe('WBInstanceUtilitiesMixin', function () {
//
//     describe('#isInstanceOf', function () {
//
//       var instance = new WBClass();
//
//       it('should have an #isInstanceOf method', function () {
//         expect(_.isFunction(instance.isInstanceOf)).toBeTruthy();
//       });
//
//       it('should return TRUE when checking if instance is instance of constructor class', function () {
//         expect(instance.isInstanceOf(WBClass)).toBeTruthy();
//       });
//
//       it('should return TRUE when checking if subclass instance is instance of base class', function () {
//         var AnotherClass = WBClass.extend({ foo: 'bar' });
//         var anotherInstance = new AnotherClass();
//         expect(anotherInstance.isInstanceOf(WBClass)).toBeTruthy();
//       });
//
//       it('should return FALSE when checking if instance is instance of other class', function () {
//         var AnotherClass = WBClass.extend({ foo: 'bar' });
//         var YetAnotherClass = WBClass.extend({ foo: 'anyOtherBar' });
//         var anotherInstance = new AnotherClass();
//         expect(anotherInstance.isInstanceOf(YetAnotherClass)).toBeFalsy();
//       });
//     });
//   });
// });