test([

  '../../lib/helpers/Children',
  '../../lib/core/Collection',
  '../../lib/nodes/PageNodesCollection'

], function (test) {

  var instance, pages;

  test.before(function (done) {

    _ = test.deps.lodash;

    pages = new test.deps.PageNodesCollection(null, {
      'localization': {
        'defaultLangCode': 'en'
      },
      'paths': {
        'content': 'tests/mocks/pages',
        'frameworkPages': 'tests/mocks/pages'
      },
      'muteLog': true
    });

    pages.mediator.publish('collection:pages', pages);

    pages.fetch('tests/mocks/pages').done(function () {
      done();
    });
  });

  beforeEach(function () {

    var queue = new test.deps.Collection();

    instance = new test.deps.Children({
      'name': 'active',
      'queue': queue,
      'pages': pages
    });

    instance.setUrl('/foo');
  });

  test.spec('run (string url, object options)', function () {

    test.when('url is a string', function () {

      test.when('a page exists for url', function () {

        test.when('options.fn is a function', function () {

          test.it('should execute function with each child', function () {

            var spy = sinon.spy();
            instance.run('/foo', {
              'hash': {},
              'fn': spy
            });

            expect(spy).to.have.been.calledOnce;
            expect(spy.firstCall.args[0].url).to.equal('/foo/bar');
          });

          test.it('should return the value of all function calls', function () {

            var result = instance.run('/foo', {
              'hash': {},
              'fn': function (obj) {
                return '::' + obj.url;
              }
            });

            expect(result).to.equal('::/foo/bar');
          });

          test.it('should only include direct children', function () {

            var result = instance.run('/', {
              'hash': {},
              'fn': function (obj) {
                return '::' + obj.url;
              }
            });

            expect(result).to.equal('::/foo::/zoo');
          });
        });

        test.when('options.fn is not function', function () {

          test.itShould.throwError(function () {
            instance.run('/foo', {
              'hash': {},
              'fn': null
            });
          });
        });
      });

      test.when('no page exists for url', function () {

        test.itShould.throwError(function () {
            instance.run('/foos', {
              'hash': {},
              'fn': function () {}
            });
          });
      });
    });

    test.when('url is not a string', function () {

      test.when('options.url is a string', function () {

        test.it('should use options.url as url', function () {

          var result = instance.run({
            'hash': {
              'url': '/foo'
            },
            'fn': function (obj) {
              return '::' + obj.url;
            }
          });

          expect(result).to.equal('::/foo/bar');
        });
      });

      test.when('options.hash.url is not a string', function () {

        test.it('should use self.currentUrl as url', function () {

          var result = instance.run({
            'hash': {},
            'fn': function (obj) {
              return '::' + obj.url;
            }
          });

          expect(result).to.equal('::/foo/bar');
        });
      });
    });
  });
});