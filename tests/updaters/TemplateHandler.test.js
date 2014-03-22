test([

  '../../lib/updaters/TemplateHandler',
  '../../lib/core/Model',
  'lodash'

], function (test) {

  var instance, _;

  test.beforeEach(function () {
    instance = new test.deps.TemplateHandler();
    _ = test.deps.lodash;
  });

  test.afterEach(function () {
    instance.destroy();
  });

  test.spec('created (string path, array graph)', function () {

    test.it('should call fetch() on self.options.templates');
  });

  test.spec('modified (string path, array graph)', function () {

    test.it('should call fetch() on the modified template');

    test.when('graph contains a page', function () {

      test.it('should defer call watcher.handleChange() with page path');
    });

    test.when('graph contains a template', function () {

      test.when('template doesn\'t match the modified path', function () {

        test.it('should defer call watcher.handleChange() with template path');
      });
    });
  });

  test.spec('deleted (string path, array graph)', function () {

    test.it('should call destroy() on the deleted template');

    test.when('graph contains a page', function () {

      test.it('should defer call watcher.handleChange() with page path');
    });

    test.when('graph contains a template', function () {

      test.when('template doesn\'t match the deleted path', function () {

        test.it('should defer call watcher.handleChange() with template path');
      });
    });
  });
});