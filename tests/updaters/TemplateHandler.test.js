test([

  '../../lib/updaters/TemplateHandler',
  '../../lib/core/Model',
  'lodash'

], function (test) {

  var instance, _;

  test.beforeEach(function () {
    instance = new test.deps.TemplateHandler({
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

    test.it('should call fetch() on self.options.templates', function () {

      var spy = sinon.spy(instance.options.templates, 'fetch');

      instance.created('/any/path/template.tmpl', []);

      expect(spy).to.have.been.calledOnce;
      instance.options.templates.fetch.restore();
    });
  });

  test.spec('modified (string path, array graph)', function () {

    test.when('graph contains a page', function () {

      test.it('should defer call watcher.handleChange() with page path', function (done) {

        var notModified = instance.options.pages.create({
            'path': '/foo/bar2/page.txt'
          });

        instance.modified('/barabaz/something.tmpl', [notModified]);

        var handleChange = instance.options.watcher.handleChange;
        instance.options.watcher.handleChange = function (path, oldS, newS, type) {

          expect(path).to.equal('/foo/bar2/page.txt');
          expect(type).to.equal('modified');

          instance.options.watcher.handleChange = handleChange;

          done();
        };
      });
    });

    test.when('graph contains a template', function () {

      test.when('template matches the modified path', function () {

        test.it('should call fetch() on the modified template');
      });

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