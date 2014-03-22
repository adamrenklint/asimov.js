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

    test.it('should call fetch() on self.options.pages');
  });

  test.spec('modified (string path, array graph)', function () {

    test.when('graph contains a page', function () {

    });
  });

  test.spec('deleted (string path, array graph)', function () {
  });
});