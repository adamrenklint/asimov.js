test([

  '../../lib/helpers/Script'

], function (test) {

  var instance;

  beforeEach(function () {

    var collection = new test.deps.Collection();

    instance = new test.deps.Script({
      'name': 'script',
      // 'queue': collection,
      // 'pages': collection
    });

    instance.currentUrl = '/blog';
  });

  test.spec('run (string url)', function () {

    test.when('url is not a string', function () {

      test.itShould.throwError(function () {
        instance.run(null, 'string');
      });
    });

    test.when('url is a string', function () {

      test.when('value is a string', function () {

        // test.when('url matches the rendering page', function () {

        //   test.it('should return the passed value', function () {
        //     var result = instance.run('/blog', 'string');
        //     expect(result).to.equal('string');
        //   });
        // });

        // test.when('url doesn\'t match rendering page', function () {

        //   test.it('should return an empty string', function () {
        //     var result = instance.run('/blog2', 'string');
        //     expect(result).to.equal('');
        //   });
        // });
      });
    });
  });
});