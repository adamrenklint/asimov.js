test([

  '../../lib/updaters/PageHandler',
  '../../lib/core/Collection',
  'lodash'

], function (test) {

  var instance, _;

  test.beforeEach(function () {
    instance = new test.deps.PageHandler({
      'pages': new test.deps.Collection(),
      'templates': new test.deps.Collection(),
      'watcher': new test.deps.Collection()
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

      test.when('the page matches the modified path', function () {

        test.it('should call fetch() on the page', function () {

          var modified = new instance.options.pages.model({
            'path': '/foo/bar/page.txt'
          });
          var spy = sinon.spy(modified, 'fetch');

          instance.modified('/foo/bar/page.txt', [modified]);

          expect(spy).to.have.been.calledOnce;
          modified.fetch.restore();
        });
      });

      test.when('the page doesn\'t match the modified path', function () {

        test.it('should defer trigger "change:raw" with page', function (done) {

          var notModified = instance.options.pages.create({
            'path': '/foo/bar2/page.txt'
          });

          instance.modified('/foo/bar/page.txt', [notModified]);

          var handleChange = instance.options.watcher.handleChange;
          instance.options.watcher.handleChange = function (path, oldS, newS, type) {

            expect(path).to.equal('/foo/bar2/page.txt');
            expect(type).to.equal('modified');

            instance.options.watcher.handleChange = handleChange;

            // done();
          };
        });
      });
    });
  });

  test.spec('deleted (string path, array graph)', function () {

    test.when('graph contains a page', function () {

      test.when('page matches the deleted path', function () {

        test.it('should call destroy() on the deleted page', function () {

          var deleted = new instance.options.pages.model({
            'path': '/foo/bar/page.txt'
          });
          var spy = sinon.spy(deleted, 'destroy');

          instance.deleted('/foo/bar/page.txt', [deleted]);

          expect(spy).to.have.been.calledOnce;
          deleted.destroy.restore();
        });
      });

      test.when('page doesn\'t match the deleted path', function () {

        test.it('should defer trigger "change:raw" with page', function (done) {

          var notDeleted = instance.options.pages.create({
            'path': '/foo/bar2/page.txt'
          });

          instance.deleted('/foo/bar/page.txt', [notDeleted]);

          var handleChange = instance.options.watcher.handleChange;
          instance.options.watcher.handleChange = function (path, oldS, newS, type) {

            expect(path).to.equal('/foo/bar2/page.txt');
            expect(type).to.equal('modified');

            instance.options.watcher.handleChange = handleChange;

            // done();
          };
        });
      });
    });
  });
});