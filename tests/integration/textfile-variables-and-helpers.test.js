var libPath = '../../lib/';
var Test = require(libPath + 'runner/Test');

Test.run('integration/home', function (test) {

  var instance;

  test.beforeEach(function () {
    instance = null;
  });

  test.integration('/test', function () {

    test.itShould.loadPage();
  });
});