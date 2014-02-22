describe('XSS Helper', function () {

  'use strict';

  var XSSHelper;
  var specialChars = ['&', '<', '>', '"', '\'', '/'];
  var specialEntities = ['&amp;', '&lt;', '&gt;', '&quot;', '&#39;', '&#x27;', '&#x2F;', '&#37;'];

  beforeEach(function (done) {

    requirejs([
      'wunderbits/helpers/xss'
    ], function (XSS) {

      XSSHelper = XSS;
      done();
    });
  });

  describe('#clean', function () {

    it('should convert certain special chars to entities', function () {

      _.each(specialChars, function (char) {

        var result = XSSHelper.clean(char);
        var type = typeof result;

        expect(type).to.equal('string');
        result.should.not.equal(char);
      });
    });
  });

  describe('#reverseClean', function () {

    it('should convert certain entities to chars', function () {

      _.each(specialEntities, function (entity) {

        var result = XSSHelper.reverseClean(entity);
        var type = typeof result;

        expect(type).to.equal('string');
        result.should.not.equal(entity);
      });
    });
  });
});