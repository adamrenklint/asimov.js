test([

  '../../lib/updaters/StyleSheetHandler',
  '../../lib/core/Collection',
  'lodash'

], function (test) {

  var instance, _;

  test.beforeEach(function () {
    instance = new test.deps.StyleSheetHandler({
      'pages': new test.deps.Collection(),
      'templates': new test.deps.Collection(),
      'styleSheets': new test.deps.Collection()
    });
    _ = test.deps.lodash;
  });

  test.afterEach(function () {
    instance.destroy();
  });

  test.spec('modified (string path, array graph)', function () {

    test.when('graph contains a script', function () {

      test.when('the script matches the modified path', function () {

        test.it('should call fetch() on the page', function () {

          var modified = new instance.options.styleSheets.model({
            'path': '/foo/bar/script.js'
          });
          var spy = sinon.spy(modified, 'fetch');

          instance.modified('/foo/bar/script.js', [modified]);

          expect(spy).to.have.been.calledOnce;
          modified.fetch.restore();
        });
      });

      // test.when('the styleSheet doesn\'t match the modified path', function () {

      //   test.it('should defer trigger "change:raw" on styleSheet', function (done) {

      //     var notModified = instance.options.pages.create({
      //       'path': '/foo/bar2/main.styl'
      //     });

      //     instance.modified('/foo/bar/main.styl', [notModified]);

      //     notModified.on('change:raw', function () {
      //       done();
      //     });
      //   });
      // });
    });
  });

  test.spec('deleted (string path, array graph)', function () {

    test.when('graph contains a page', function () {

      test.when('page matches the deleted path', function () {

        test.it('should call destroy() on the deleted page', function () {

          var deleted = new instance.options.pages.model({
            'path': '/foo/bar/script.js'
          });
          var spy = sinon.spy(deleted, 'destroy');

          instance.deleted('/foo/bar/script.js', [deleted]);

          expect(spy).to.have.been.calledOnce;
          deleted.destroy.restore();
        });
      });

      // test.when('page doesn\'t match the deleted path', function () {

      //   test.it('should defer trigger "change:raw" with page', function (done) {

      //     var notDeleted = instance.options.pages.create({
      //       'path': '/foo/bar2/page.txt'
      //     });

      //     instance.deleted('/foo/bar/page.txt', [notDeleted]);

      //     notDeleted.on('change:raw', function () {
      //       done();
      //     });
      //   });
      // });
    });
  });
});