describe('SafeParse Helper', function () {

  'use strict';

  var Topic;

  beforeEach(function (done) {

    requirejs([
      'wunderbits/helpers/SafeParse'
    ], function (SafeParse) {

      Topic = SafeParse;
      done();
    });
  });


  describe('#json', function () {

    it('should parse valid json', function () {

      var json = '{"key": "value"}';
      var result = Topic.json(json);
      expect(result.key).to.equal('value');
    });

    it('should return undefined for invalid json without throwing an error', function () {

      var json = '<><><><><><>LOLOLOL!!!!@#@##@#@><><><><><><><><><><><><';
      var result;

      var spy = sinon.spy();

      try {
        result = Topic.json(json);
      }
      catch (e) {
        spy(e);
      }

      expect(spy).to.not.have.been.called;
      expect(result).to.equal(undefined);
    });
  });
});