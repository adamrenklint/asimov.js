describe('WBStyleApplier', function () {

  'use strict';

  var Topic, Backbone, uid;

  beforeEach(function (done) {
    requirejs([
      'wunderbits/WBStyleApplier',
      'wunderbits/lib/dependencies',
      'wunderbits/lib/createUID'
    ], function (WBStyleApplier, dependencies, createUID) {

      Topic = WBStyleApplier;
      Backbone = dependencies.Backbone;
      uid = createUID;

      done();
    });
  });

  describe('#initialize', function () {

    it('should throw error if no name is passed', function () {

      (function () {
        new Topic();
      }).should.throw();
    });

    it('should throw error if no raw styles is passed', function () {

      (function () {
        new Topic(uid());
      }).should.throw();
    });

    it('should not throw error if both name and raw styles are passed', function () {

      (function () {
        new Topic(uid(), 'body{display:none;}');
      }).should.not.throw();
    });
  });

  describe('#getElementId', function () {

    it('should return a string', function () {

      var topic = new Topic(uid(), '#any{opacity:0;}');
      var id = topic.getElementId({});
      id.should.be.a('string');
    });

    it('should return the same id, given the same name and variables', function () {

      var topic = new Topic(uid(), '#any{opacity:0;}');
      var variables = {
        'foo': 'bar'
      };

      var first = topic.getElementId(variables);
      var second = topic.getElementId(variables);

      first.should.equal(second);
    });

    it('should not return the same id, given different name but same variables', function () {

      var topic = new Topic(uid(), '#any{opacity:0;}');
      var variables = {
        'foo': 'bar'
      };

      var first = topic.getElementId(variables);
      topic.name = uid();
      var second = topic.getElementId(variables);

      first.should.not.equal(second);
    });

    it('should not return the same id, give the same name but different variables', function () {

      var topic = new Topic(uid(), '#any{opacity:0;}');
      var first = topic.getElementId({ 'foo': 'bar' });
      var second = topic.getElementId({ 'foo': 'baz' });

      first.should.not.equal(second);
    });
  });

  describe('#apply', function () {

    it('should throw error if no target is passed', function () {

      (function () {
        var topic = new Topic(uid(), '#any{opacity:0;}');
        topic.apply();
      }).should.throw();
    });

    it('should add styles to <head>', function () {

      var css = '#any{opacity:0;}';
      var topic = new Topic(uid(), css);
      var view = new Backbone.View();

      topic.apply(view);

      var style = document.getElementById(topic.getElementId());
      $(style).text().should.equal(css);
    });

    it('should only add styles with same ID to <head> once', function () {

      var css = '#any{opacity:0;}';
      var topic = new Topic(uid(), css);
      var view = new Backbone.View();

      topic.apply(view);
      topic.apply(view);

      var styles = document.getElementsByTagName('style');
      var elementId = topic.getElementId();

      styles = _.filter(styles, function (style) {
        return $(style).text() === css && style.id === elementId;
      });

      styles.length.should.equal(1);
    });

    it('should bind its removal to the targets "destroy" event', function () {

      var view = new Backbone.View();
      var css = '#any{opacity:0;}';
      var topic = new Topic(uid(), css);

      topic.apply(view);
      view.trigger('destroy');

      var styles = document.getElementsByTagName('style');
      var elementId = topic.getElementId();

      styles = _.filter(styles, function (style) {
        return $(style).text() === css && style.id === elementId;
      });

      styles.length.should.equal(0);
    });
  });

  describe('#remove', function () {

    it('should remove the styles from <head>', function () {

      var view = new Backbone.View();
      var css = '#any{opacity:0;}';
      var topic = new Topic(uid(), css);

      topic.apply(view);
      topic.remove();

      var styles = document.getElementsByTagName('style');
      var elementId = topic.getElementId();

      styles = _.filter(styles, function (style) {
        return $(style).text() === css && style.id === elementId;
      });

      styles.length.should.equal(0);
    });

    it('should only remove the styles when the last target is destroyed', function () {

      var view1 = new Backbone.View();
      var view2 = new Backbone.View();
      var css = '#any{opacity:0;}';
      var name = uid();
      var topic1 = new Topic(name, css);
      var topic2 = new Topic(name, css);

      topic1.apply(view1);
      topic2.apply(view2);
      view1.trigger('destroy');

      var styles = document.getElementsByTagName('style');
      var elementId = topic1.getElementId();

      styles = _.filter(styles, function (style) {
        return $(style).text() === css && style.id === elementId;
      });

      styles.length.should.equal(1);
    });
  });
});