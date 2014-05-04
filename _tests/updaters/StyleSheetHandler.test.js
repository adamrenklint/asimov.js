var libPath = '../../lib/';
var StyleSheetHandler = require(libPath + 'updaters/StyleSheetHandler');
var Collection = require(libPath + 'core/Collection');
var Test = require(libPath + 'runner/Test');
var _ = require('lodash');

Test.run('updaters/StyleSheetHandler', function (test) {

  var instance;

  test.beforeEach(function () {
    instance = new StyleSheetHandler({
      'pages': new Collection(),
      'templates': new Collection(),
      'styleSheets': new Collection()
    });
  });

  test.afterEach(function () {
    instance.destroy();
  });

  test.spec('modified (string path, array graph)', function () {

    test.when('graph contains a styleSheet', function () {

      test.when('the styleSheet matches the modified path', function () {

        test.it('should call fetch() on the page', function () {

          var modified = new instance.options.styleSheets.model({
            'path': '/foo/bar/main.styl'
          });
          var spy = sinon.spy(modified, 'fetch');

          instance.modified('/foo/bar/main.styl', [modified]);

          expect(spy).to.have.been.calledOnce;
          modified.fetch.restore();
        });
      });

      test.when('the styleSheet doesn\'t match the modified path', function () {

        test.it('should defer trigger "change:raw" on styleSheet', function (done) {

          var notModified = instance.options.pages.create({
            'path': '/foo/bar2/main.styl'
          });

          instance.modified('/foo/bar/main.styl', [notModified]);

          notModified.on('change:raw', function () {
            done();
          });
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

          notDeleted.on('change:raw', function () {
            done();
          });
        });
      });
    });
  });
});