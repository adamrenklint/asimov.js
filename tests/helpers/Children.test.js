var libPath = '../../lib/';
var Children = require(libPath + 'helpers/Children');
var Collection = require(libPath + 'core/Collection');
var PageNodesCollection = require(libPath + 'nodes/PageNodesCollection');
var Test = require(libPath + 'runner/Test');

Test.run('helpers/Children', function (test) {

  var instance, pages;

  test.before(function (done) {

    pages = new PageNodesCollection(null, {
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

    var queue = new Collection();

    instance = new Children({
      'name': 'active',
      'queue': queue,
      'pages': pages
    });

    instance.currentUrl = '/foo';
  });

  test.spec('run (string url, object options)', function () {

    test.when('url is a string', function () {

      test.when('a page exists for url', function () {

        test.when('options.fn is a function', function () {

          test.it('should execute function with each child', function () {

            var spy = sinon.spy();
            instance.run('/foo', {}, spy);

            expect(spy).to.have.been.calledOnce;
            expect(spy.firstCall.args[0].url).to.equal('/foo/bar');
          });

          test.it('should return the value of all function calls', function () {

            var result = instance.run('/foo', {}, function (obj) {
              return '::' + obj.url;
            });

            expect(result).to.equal('::/foo/bar');
          });

          test.it('should only include direct children', function () {

            var result = instance.run('/', {}, function (obj) {
              return '::' + obj.url;
            });

            expect(result).to.equal('::/foo::/zoo');
          });

          test.when('hash.limit is a number', function () {

            test.it('should limit the result length', function () {

              var result = instance.run('/', {
                'limit': 1
                }, function (obj) {
                return '::' + obj.url;
              });

              expect(result).to.equal('::/foo');
            });
          });

          test.when('hash.offset is a number', function () {

            test.it('should not include pages before offset', function () {

              var result = instance.run('/', {
                'offset': 1
              }, function (obj) {
                return '::' + obj.url;
              });

              expect(result).to.equal('::/zoo');
            });
          });

          test.when('hash.sortBy is a string', function () {

            test.it('should sort the result by that attribute', function () {

              var result = instance.run('/', {
                'sortBy': 'foo'
              }, function (obj) {
                return '::' + obj.url;
              });

              expect(result).to.equal('::/zoo::/foo');
            });
          });

          test.when('hash.order is the string "DESC"', function () {

            test.it('should sort the results in descending order', function () {

              var result = instance.run('/', {
                'hash': {
                  'order': 'DESC'
                },
                'fn': function (obj) {
                  return '::' + obj.url;
                }
              });

              expect(result).to.equal('::/zoo::/foo');
            });
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