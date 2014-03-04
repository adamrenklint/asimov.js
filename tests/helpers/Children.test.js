test([

  '../../lib/helpers/Children',
  '../../lib/core/Collection'

], function (test) {

  var instance;

  beforeEach(function () {

    var collection = new test.deps.Collection();

    instance = new test.deps.Children({
      'name': 'active',
      'queue': collection,
      'pages': collection
    });

    instance.setUrl('/blog');
  });

  test.spec('run (string url, object options)', function () {

    test.when('url is a string', function () {

      test.when('a page exists for url', function () {

        test.when('options.fn is a function', function () {

          test.it('should execute function with each child');
          test.it('should return the value of all function calls');
        });

        test.when('options.fn is not function', function () {

          test.itShouldThrowError();
        });
      });

      test.when('no page exists for url', function () {

        test.itShouldThrowError();
      });
    });

    test.when('url is not a string', function () {

      test.when('options.url is a string', function () {

        test.it('should use options.url as url');
        test.it('should execute function with each child');
        test.it('should return the value of all function calls');
      });

      test.when('options.hash.url is not a string', function () {

        test.it('should use self.currentUrl as url');
        test.it('should execute function with each child');
        test.it('should return the value of all function calls');
      });
    });
  });
});