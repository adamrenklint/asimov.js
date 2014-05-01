var libPath = '../../lib/';
var Test = require(libPath + 'runner/Test');

Test.run('integration/home', function (test) {

  var instance;

  test.beforeEach(function () {
    instance = null;
  });

  test.integration('/', function () {

    test.itShould.loadPage();

    test.it('should have the correct title', function () {

      expect(this.browser.text('H1')).to.contain('asimov.js');
    });

    // test.itShould.containLinkTo('asimovjs.org');
  });

  test.integration('/the-alias-for-home', function () {

    test.itShould.loadPage();

    test.it('should have the correct title', function () {

      expect(this.browser.text('H1')).to.contain('asimov.js');
    });
  });
});