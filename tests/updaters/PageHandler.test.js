test([

  '../../lib/updaters/PageHandler',
  '../../lib/core/Collection',
  'lodash'

], function (test) {

  var instance, _;

  test.beforeEach(function () {
    instance = new test.deps.PageHandler({
      'pages': new test.deps.Collection(),
      'templates': new test.deps.Collection()
    });
    _ = test.deps.lodash;
  });

  test.afterEach(function () {
    instance.destroy();
  });

  test.spec('created (string path, array graph)', function () {

    test.it('should call fetch() on self.options.pages', function () {

      var spy = sinon.spy(instance.options.pages, 'fetch');

      instance.created('/any/path/page.txt', []);

      expect(spy).to.have.been.calledOnce;
      instance.options.pages.fetch.restore();
    });
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