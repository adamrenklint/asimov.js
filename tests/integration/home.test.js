test(function (test) {

  var instance;

  test.beforeEach(function () {
    instance = null;
  });

  test.spec('test (string name, array dependencies, function callback)', function () {

    test.when('name is not a string', function () {

      test.it('should throw an error', function () {

        expect(function () {
          instance.test(null, [], function () {});
        }).to.throw(Error);
      });
    });

  });

  test.integration('/', function () {

    test.itShould.loadPage();
  });
});