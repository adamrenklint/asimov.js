describe('TaggingViewMixin', function () {

  'use strict';

  var view;

  beforeEach(function (done) {

    requirejs([
      'wunderbits/WBView',
      'wunderbits/mixins/TaggingViewMixin',
      'wunderbits/specs/templates/title'
    ], function (WBView, TaggingViewMixin, template) {

      var View = WBView.extend({
        'className': 'hidden',
        'template': template
      });

      view = new View();
      TaggingViewMixin.applyTo(view);

      done();
    });
  });

  afterEach(function () {

    view.destroy();
  });

  describe('should find and markup hashtags as wunderlist search links', function () {

    var strings = [
      'sdflkj #tag',
      '#tag string #tag-230948',
      'sdflkjsdlkj#sdflkj #sdflkj',
      'укр #србрфқаз #221'
    ];

    var markedup = [
      'sdflkj <a class="hash linkout" href="#/search/%23tag">#tag</a>',
      '<a class="hash linkout" href="#/search/%23tag">#tag</a> string <a class="hash linkout" href="#/search/%23tag-230948">#tag-230948</a>',
      'sdflkjsdlkj#sdflkj <a class="hash linkout" href="#/search/%23sdflkj">#sdflkj</a>',
      'укр <a class="hash linkout" href="#/search/%23%D1%81%D1%80%D0%B1%D1%80%D1%84%D2%9B%D0%B0%D0%B7">#србрфқаз</a> <a class="hash linkout" href="#/search/%23221">#221</a>'
    ];

    strings.forEach(function (string, index) {

      it(string, function () {

        view.render({
          'title': string
        });
        view.$el.appendTo('body');
        view.renderTags();
        view.$el.html().should.equal(markedup[index]);
      });
    });
  });

  describe('should not markup HTML entities, HTML tags or escaped HTML', function () {

    var strings = [
      '&#39; #tag',
      'disable adyen&#39;s',
      'Do not delete or edit this! <script>alert("XSS from task title"); debugger;</script>'
    ];

    var markedup = [
      '&amp;#39; <a class="hash linkout" href="#/search/%23tag">#tag</a>',
      'disable adyen&amp;#39;s',
      'Do not delete or edit this! &lt;script&gt;alert("XSS from task title"); debugger;&lt;/script&gt;'
    ];

    strings.forEach(function (string, index) {

      it(string, function () {

        view.render({
          'title': string
        });
        view.$el.appendTo('body');
        view.renderTags();
        view.$el.html().should.equal(markedup[index]);
      });
    });
  });

  describe('should not mark tags that are part of links', function () {

    var strings = [
      'http://iamaurl.com/#blah',
      'http://iamaurl.com/dsagdhagdjahsdas#blah',
      'http://iamaurl.com/dsagdhagdjahsdas?#blah',
      'http://iamaurl.com/dsagdhagdjahsdas?yuyiuiuyi#blah',
      'http://iamaurl.com/dsagdhagdjahsdas?yuyiuiuyi&#blah',
    ];


    strings.forEach(function (string) {

      it(string, function () {

        view.render({
          'title': string
        });
        view.$el.appendTo('body');
        view.renderTags();
        var $el = view.$el;
        expect($el.text()).to.equal(string);
        expect($el.html()).to.not.contain('<a class="hash');
      });
    });
  });
});