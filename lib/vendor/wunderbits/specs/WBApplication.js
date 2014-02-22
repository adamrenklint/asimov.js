// describe('WBApplication', function () {
//
//   var _, runtime, _itShould, WBAssertionHelper, WBApplication, WBClass;
//
//   modules([
//
//     'vendor/underscore',
//
//     'wunderbits/WBAssertionHelper',
//     'wunderbits/WBApplication',
//     'wunderbits/WBClass'
//
//   ], function (underscore, Mediator, WBAssertionHelper, _WBApplication, _WBClass) {
//
//     _ = underscore;
//     runtime = Mediator;
//     _itShould = WBAssertionHelper;
//     WBApplication = _WBApplication;
//     WBClass = _WBClass;
//   });
//
//
//   // _itShould.beSubClassOf(WBApplication, WBClass, 'WBClass');
//
//   describe('#start', function () {
//
//     it('should trigger "application:ready" event on mediator, if exists', function () {
//       console.log(_itShould)
//       var instance = new WBApplication();
//       var callback = sinon.spy();
//       var mediator = new WBClass();
//       instance.mediator = runtime;
//       runtime.on('application:ready', callback);
//       instance.start();
//       expect(callback.called).toBeTruthy();
//     });
//   });
// });