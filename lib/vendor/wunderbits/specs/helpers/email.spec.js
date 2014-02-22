describe('wunderbits/helpers/email', function () {

  'use strict';

  var Topic;

  beforeEach(function (done) {

    requirejs([
      'wunderbits/helpers/email'
    ], function (EmailHelper) {

      Topic = EmailHelper;

      done();
    });
  });

  describe('#isValidEmail', function () {

    describe('given valid email, should return true', function () {

      var valids = [
        'adam@adamadsa.com',
        'b@bwh.me',
        'ren-kpi@i.ua',
        'sdlfkj@sdlfkj.sdlfkj.sdlfkj.sdlfkj.net',
        'ahoy+man+wecoy@ping.pong.com'
      ];

      valids.forEach(function (text) {
        it(text, function () {
          expect(Topic.isValidEmail(text)).to.be.true;
        });
      });
    });

    describe('given an invalid e-mail adress, should return false', function () {
      var invalids = [
        'asdasd',
        'asdas adaasd@asdasd.com',
        'adam@adamadsa.com asdasd',
        'adam@adadam.com adam@adadauau.se',
        'adam@@asdadas.com',
        'adam@assdsadsadasda',
        'adam@website.pop',
        'pakoda@makoda.lemur',
        'http://www.kartoffel.de/?was=fettmann@fetthaus.org&hungry=true'
      ];

      invalids.forEach(function (text) {
        it(text, function () {
          expect(Topic.isValidEmail(text)).to.be.false;
        });
      });
    });
  });

  describe('#extractEmails', function () {

    describe('should extract emails from valid text', function () {

      var valids = [
        'zombie@katzeland.com',
        'zombie.wombie@katzeland.com',
        'zombie-wombie@katzeland.com',
        'zombie+wombie@katzeland.com',
        'zombie{zomba@katzeland.com',
        'zombie}zomba@katzeland.com',
        'zombie(zomba@katzeland.com',
        'zombie)zomba@katzeland.com',
        'zombie[zomba@katzeland.com',
        'zombie]zomba@katzeland.com',
        'zombie/zomba@katzeland.com'
      ];

      valids.forEach(function (text) {
        var longtext = 'hello ' + text + ' world';
        it(longtext, function () {
          var tokens = Topic.extractEmails(longtext);
          expect(tokens).to.be.an('Array');
          expect(tokens.length).to.be.equal(3);
          expect(tokens[1]).to.be.equal(text);
        });
      });
    });

    describe('should not extract emails from invalid text', function () {
      var urls = [
        'ftp://www.katzeland.com/?src=paparks@cityofportaransas.org&q=no%22%3E',
        'http://www.kartoffel.de/?was=fettmann@fetthaus.org&hungry=true'
      ];

      urls.forEach(function (text) {
        it(text, function () {
          var tokens = Topic.extractEmails(text);
          expect(tokens.length).to.be.equal(0);
        });
      });
    });

    describe('should retain new line characters', function () {

      it('if a match is found', function () {
        var text = 'abcd\n\ndsadasdas@dasdasda.org\npqrs\n';
        var tokens = Topic.extractEmails(text);
        expect(tokens.length).to.equal(3);
        expect(tokens.join('').split(/\n/).length).to.equal(5);
      });
    });

    it('should not remove qoutes from the incoming text', function () {
      var text = ' "y@g.co" "was@wo.net" ';
      var tokens = Topic.extractEmails(text);
      expect(tokens.length).to.equal(5);
      var expected = [' "', 'y@g.co', '" "', 'was@wo.net', '" '];
      expected.forEach(function (token, index) {
        expect(tokens[index]).to.equal(token);
      });
    });

  });

});
