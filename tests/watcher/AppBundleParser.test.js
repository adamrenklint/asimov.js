test('watcher/AppBundleParser', [

  '../../lib/watcher/AppBundleParser',
  // '../../lib/core/Model',
  'lodash'

], function (test) {

  var instance, _;

  test.beforeEach(function () {
    instance = new test.deps.AppBundleParser({
      // 'paths': {
      //   'styles': ['tests/mocks/styles']
      // }
    });
    _ = test.deps.lodash;
  });

  test.afterEach(function () {
    instance.destroy();
  });

  test.spec('initialize (object options)', function () {

    // test.when('options.paths.styles is not an array', function () {

    //   test.it('should throw an error', function () {

    //     expect(function () {
    //       new test.deps.StyleSheetParser();
    //     }).to.throw(Error);
    //   });
    // });
  });

  test.spec('parse (object model, string rendered, object dependencies)', function () {

    test.it('should add model as a dependency of itself');

    test.it('should add model as a dependency every other included module');
  });
});