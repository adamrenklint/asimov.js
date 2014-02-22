describe('wunderbits/helpers/links', function () {

  'use strict';

  var Topic;

  beforeEach(function (done) {

    requirejs([
      'wunderbits/helpers/links'
    ], function (LinkHelper) {

      Topic = LinkHelper;

      done();
    });
  });

  describe('#extractLinks', function () {

    describe('should preserve the protocol', function () {
      [
        'http://dasdasdas.com/dasdasdas',
        'ftp://dadsad.com/',
      ].forEach(function (text) {
        it(text, function () {
          var tokens = Topic.extractLinks(text);
          expect(tokens.length).to.equal(1);
          expect(tokens[0]).to.equal(text);
        });
      });
    });

    describe('should extract possible links, & return multiple text fragments', function () {
      [
        'dsadasda https://fffff.org/kkljjjk fsdfds.dsfds',
        '#abcd p.q.r.st #mno',
        '#abcd http://p.q.r.st #mno'
      ].forEach(function (text) {
        it(text, function () {
          var tokens = Topic.extractLinks(text);
          expect(tokens.length).to.not.be.equal(1);
          expect(tokens[0]).to.not.be.equal(text);
        });
      });
    });

    describe('should not extract links, if they have a unacceptable characters before them', function () {
      [
        '#dasda #2.3.1.4 #blah',
        '#abcd #p.q.r.45 #mno',
        '#abcd #p.q.r.st #mno',
        'blah blah @blah.com',
        'pow chow@mow.org now, holy cow'
      ].forEach(function (text) {
        it(text, function () {
          var tokens = Topic.extractLinks(text);
          expect(tokens.length).to.be.equal(0);
        });
      });
    });
  });

});
