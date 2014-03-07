test(function (test) {

  var instance;

  test.beforeEach(function () {
    instance = null;
  });

  test.integration('/', function () {

    test.itShould.loadPage();
  });
});