describe('LinkingViewMixin', function () {

  'use strict';

  var view;

  beforeEach(function (done) {

    requirejs([
      'wunderbits/WBView',
      'wunderbits/mixins/LinkingViewMixin',
      'wunderbits/specs/templates/title'
    ], function (WBView, LinkingViewMixin, template) {

      var View = WBView.extend({
        'className': 'hidden',
        'template': template
      });

      view = new View();
      LinkingViewMixin.applyTo(view);

      done();
    });
  });

  afterEach(function () {
    view.destroy();
  });

  function setTitle (title) {
    view.render({ 'title': title });
    view.$el.appendTo('body');
    view.renderLinks();
    return view.$el.html();
  }

  describe('finds and marks up links', function () {

    describe('http, https & ftp links', function () {

      var texts = {
        'http': 'asdf http://google.com lorem',
        'https': 'oiu https://google.net ipsum',
        'ftp': 'slkj ftp://google.org potato'
      };

      var expected = {
        'http': ' href="http://google.com">http://google.com</a>',
        'https': ' href="https://google.net">https://google.net</a>',
        'ftp': ' href="ftp://google.org">ftp://google.org</a>'
      };

      Object.keys(texts).forEach(function(key) {
        var text = texts[key];
        it('should find and markup ' + key + ':// links in plain text', function () {
          var markup = setTitle(text);
          expect(markup).to.contain(expected[key]);
        });
      });
    });

    describe('regular links', function () {
      var urls = [
        'http://www.potato.com',
        'https://www.chiken.com',
        'ftp://lecker.butter.com/blah'
      ];

      urls.forEach(function (url) {
        it(url, function () {
          var text = 'hello ' + url + ' world';
          var expected = ' href="' + url + '">' + url + '</a>';
          var markup = setTitle(text);
          expect(markup).to.contain(expected);
        });
      });
    });

    describe('links without protocol', function () {
      var urls = [
        'my.potato.com',
        'your.chiken.com',
        'fatty.butter.com/blah'
      ];

      urls.forEach(function (url) {
        it(url, function () {
          var text = 'hello ' + url + ' world';
          var expected = ' href="http://' + url + '">' + url + '</a>';
          var markup = setTitle(text);
          expect(markup).to.contain(expected);
        });
      });
    });

    describe('links with valid TLDs', function () {
      var validTLDs = [
        'co.uk',
        'com',
        'se',
        'org'
      ];

      validTLDs.forEach(function(tld) {

        it('should find and markup valid .' + tld + ' TLD links in plain text', function () {
          var text = 'blabla http://www.baloon.' + tld + ' lol';
          var expected = ' href="http://www.baloon.' + tld + '">http://www.baloon.' + tld + '</a>';
          var markup = setTitle(text);
          expect(markup).to.contain(expected);
        });

        it('should find and markup valid .' + tld + ' TLD links without protocol, in plain text', function () {
          var text = 'blabla www.baloon.' + tld + ' lol';
          var expected = ' href="http://www.baloon.' + tld + '">www.baloon.' + tld + '</a>';
          var markup = setTitle(text);
          expect(markup).to.contain(expected);
        });

        it('should find and markup valid .' + tld + ' TLD links without protocol & www, in plain text', function () {
          var text = 'blabla baloon.' + tld + ' lol';
          var expected = ' href="http://baloon.' + tld + '">baloon.' + tld + '</a>';
          var markup = setTitle(text);
          expect(markup).to.contain(expected);
        });
      });
    });

    describe('links with invalid TLDs', function () {
      var invalidTLDs = [
        'pow',
        'sewage',
        'www'
      ];

      invalidTLDs.forEach(function(tld) {

        it('should not find and markup invalid .' + tld + ' TLD links in plain text', function () {
          var text = 'blabla http://www.baloon.' + tld + ' lol';
          var expected = ' href="http://www.baloon.' + tld + '">http://www.baloon.' + tld + '</a>';
          var markup = setTitle(text);
          expect(markup).to.not.contain(expected);
        });

        it('should not find and markup invalid .' + tld + ' TLD links without protocol, in plain text', function () {
          var text = 'blabla www.baloon.' + tld + ' lol';
          var expected = ' href="http://www.baloon.' + tld + '">www.baloon.' + tld + '</a>';
          var markup = setTitle(text);
          expect(markup).to.not.contain(expected);
        });
      });
    });
  });

  describe('target on the links', function () {
    it('should be set only for non-wunderlist urls', function () {
      var markup = setTitle('hello http://hakuna.matata.com/me/and/you world');
      expect(markup).to.contain(' target="_blank"');
    });

    it('should not be set for internal links', function () {
      var markup = setTitle('hello http://www.wunderlist.com/#/list/inbox world');
      expect(markup).to.not.contain(' target="_blank"');
    });
  });

  describe('long urls', function () {
    xit('should be trimmed, on the display, if a limit parameter is set', function () {
      var markup = setTitle('hello http://www.google.com world', 10);
      expect(markup).to.contain('>http://www...</a>');
    });
  });

  describe('existing links', function () {
    it('should not get overridden', function () {
      var original = 'asdasd <a href="http://yolo.org">http://yolo.org</a> lkajsda';
      view.$el.appendTo('body').html(original);
      view.renderLinks();
      var markup = view.$el.html();
      expect(markup).to.equal(original);
    });
  });

  describe('links inside parenthesis', function () {
    it('should not wrap the url in the parenthesis', function () {
      var text = 'asdasd (http://google.com) asdasd';
      var expected = 'href="http://google.com"';
      var markup = setTitle(text);
      expect(markup).to.contain(expected);
    });
  });

  describe('wrapping tokens', function () {
    var validsInsideOf = {
      'angular brackets': '<%>',
      'brackets': '[%]',
      'parentheses': '(%)',
      'curlyBraces': '{%}',
      'doubleQuotes': '"%"'
    };

    Object.keys(validsInsideOf).forEach(function (name) {
      var template = validsInsideOf[name];
      it('should extract urls within ' + name, function () {
        var expected = ' href="http://yolo.org">yolo.org<';
        var markup = setTitle('beer ' + template.replace('%', 'yolo.org') + ' becks');
        expect(markup).to.contain(expected);
      });
    });
  });

});
