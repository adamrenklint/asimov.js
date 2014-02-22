describe('EmailLinkingViewMixin', function () {

  'use strict';

  var view;

  beforeEach(function (done) {

    requirejs([
      'wunderbits/WBView',
      'wunderbits/mixins/EmailLinkingViewMixin',
      'wunderbits/specs/templates/title'
    ], function (WBView, EmailLinkingViewMixin, template) {

      var View = WBView.extend({
        'className': 'hidden',
        'template': template
      });

      view = new View();
      EmailLinkingViewMixin.applyTo(view);

      done();
    });
  });

  afterEach(function () {
    view.destroy();
  });

  function setTitle (title) {
    view.render({ 'title': title });
    view.$el.appendTo('body');
    view.renderEmails();
    return view.$el.html();
  }

  describe('find all emails in valid texts', function () {

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

    valids.forEach(function (valid) {

      it('should find and markup valid e-mails, like "' + valid + '"', function () {
        var markup = setTitle('hello ' + valid + ' world');
        var expected = ' href="mailto:' + valid + '">' + valid + '</a>';
        expect(markup).to.contain(expected);
      });
    });

    var validsInsideOf = {
      'angular brackets': '<%>',
      'brackets': '[%]',
      'parentheses': '(%)',
      'curlyBraces': '{%}',
      'doubleQuotes': '"%"'
    };

    Object.keys(validsInsideOf).forEach(function (name) {
      var template = validsInsideOf[name];
      it('should find and markup valid e-mails inside of ' + name, function () {
        var markup = setTitle('beer ' + template.replace('%', 'beerme@germany.com') + ' becks');
        var expected = ' href="mailto:beerme@germany.com">beerme@germany.com';
        expect(markup).to.contain(expected);
      });
    });

  });

  describe('existing emails', function () {
    it('should not get overridden', function () {
      var original = 'asdasd <a href="mailto:ohboy@yolo.org">ohboy@yolo.org</a> lkajsda';
      view.$el.appendTo('body').html(original);
      view.renderEmails();
      var markup = view.$el.html();
      expect(markup).to.equal(original);
    });
  });

  describe('emails inside parenthesis', function () {
    it('should not wrap the url in the parenthesis', function () {
      var text = 'asdasd (dsadas@dsadas.co.uk) asdasd';
      var expected = 'href="mailto:dsadas@dsadas.co.uk"';
      var markup = setTitle(text);
      expect(markup).to.contain(expected);
    });
  });

  describe('should skip invalid texts', function () {

    var invalids = [
      'raymond@raymond@email.com',
      'zombie@zombieland .com'
    ];

    invalids.forEach(function (invalid) {
      it('should not markup invalid e-mail, like "' + invalid + '"', function () {
        var markup = setTitle('hello ' + invalid + ' world');
        var expected = ' href="mailto:' + invalid + '>' + invalid + '</a>';
        expect(markup).to.not.contain(expected);
      });
    });
  });

  describe('should not markup e-mail that is part of a url', function () {

    var urls = [
      'ftp://www.katzeland.com/?src=paparks@cityofportaransas.org&q=no%22%3E',
      'http://www.kartoffel.de/?was=fettmann@fetthaus.org&hungry=true'
    ];

    urls.forEach(function (url) {
      it(url, function () {
        var markup = setTitle(url);
        var expected = ' href="mailto:';
        expect(markup).to.not.contain(expected);
      });
    });
  });

});
