test([

  '../../lib/helpers/Children',
  '../../lib/core/Collection',
  '../../lib/nodes/PageNodesCollection'

], function (test) {

  var instance;

  beforeEach(function () {

    var pages = new test.deps.PageNodesCollection([{
      'type': 'page',
      'path': process.cwd() + '/content/page.txt'
    }, {
      'type': 'page',
      'path': process.cwd() + '/content/sub/page.txt'
    }, {
      'type': 'page',
      'path': process.cwd() + '/content/sub/sub2/page.txt'
    }, {
      'type': 'page',
      'path': process.cwd() + '/content/foo/page.txt'
    }, {
      'type': 'page',
      'path': process.cwd() + '/content/foo/bar/page.txt'
    }], {
      'localization': {
        'defaultLangCode': 'en'
      },
      'paths': {
        'content': 'content',
        'frameworkPages': 'not-a-real-url'
      }
    });

    pages.logger.log('count before ' + pages.models.length)

    pages.mediator.unpublish('collection:pages').publish('collection:pages', pages);

    pages.logger.log('count after ' + pages.models.length)

    var queue = new test.deps.Collection();

    instance = new test.deps.Children({
      'name': 'active',
      'queue': queue,
      'pages': pages
    });

    instance.setUrl('/sub');
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
            expect(spy).to.have.been.calledWith({
              'type': 'page',
              'url': '/foo/bar'
            });
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

            expect(result).to.equal('::/sub::/foo');
          });
        });

        test.when('options.fn is not function', function () {

          test.itShouldThrowError(function () {
            instance.run('/foo', {
              'hash': {},
              'fn': null
            });
          });
        });
      });

      test.when('no page exists for url', function () {

        test.itShouldThrowError(function () {
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

          expect(result).to.equal('::/sub/sub2');
        });
      });
    });
  });
});