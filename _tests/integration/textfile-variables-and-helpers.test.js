var libPath = '../../lib/';
var Test = require(libPath + 'runner/Test');

Test.run('integration/textfile-variables-and-helpers', function (test) {

  var instance;

  test.beforeEach(function () {
    instance = null;
  });

  test.integration('/textfile-variables-and-helpers', function () {

    test.itShould.loadPage();

    test.spec('Page', function () {

      test.it('should include the page.title', function () {
        expect(this.browser.html('li')).to.contain('page.title: I am the mighty page title!');
      });

      test.it('should include the page.list array', function () {
        expect(this.browser.html('li')).to.contain('page.list array: onetwothree');
      });
    });
  });
});