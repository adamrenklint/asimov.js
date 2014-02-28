test('watcher/TemplateParser', [

  '../../lib/watcher/TemplateParser',
  // '../../lib/core/Model',
  'lodash'

], function (test) {

  var instance, _;

  test.beforeEach(function () {
    instance = new test.deps.TemplateParser({
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

  test.spec('parse (object model, string raw, object dependencies)', function () {

    test.it('should add model as a dependency of itself');

    test.when('the template includes a partial', function () {

      test.it('should add model as a dependency for the partial');
    });

    test.when('the template includes multiple levels of partials', function () {

      test.it('should add model as a dependency for the all partials');
    });

    test.when('the template uses the site variable', function () {

      test.it('should add model as a dependency for all loaded config files');
    });
  });
});