test([

  '../../lib/updaters/PageHandler',
  '../../lib/core/Model',
  'lodash'

], function (test) {

  var instance, _;

  test.beforeEach(function () {
    instance = new test.deps.PageHandler();
    _ = test.deps.lodash;
  });

  test.afterEach(function () {
    instance.destroy();
  });

  test.spec('created (string path, array graph)', function () {

    test.it('should call fetch() on self.options.pages');
  });

  test.spec('modified (string path, array graph)', function () {

    test.when('graph contains a page', function () {

      test.it('should call fetch() on the modified page');

      test.when('the page doesn\'t match the modified path', function () {

        test.it('should defer call watcher.handleChange() with page path');
      });
    });
  });

  test.spec('deleted (string path, array graph)', function () {

    test.when('graph contains a page', function () {

      test.it('should call destroy() on the page');
    });
  });
});