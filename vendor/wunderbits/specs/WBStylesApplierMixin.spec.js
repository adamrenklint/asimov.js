describe('WBStylesApplierMixin', function () {

  'use strict';

  var Topic, View, WBStyleApplier;

  beforeEach(function (done) {
    requirejs([
      'wunderbits/mixins/WBStylesApplierMixin',
      'wunderbits/WBStyleApplier',
      'wunderbits/lib/dependencies'
    ], function (WBStylesApplierMixin, _WBStyleApplier, dependencies) {

      Topic = WBStylesApplierMixin;
      WBStyleApplier = _WBStyleApplier;

      // setup sinon spy's only once
      if (!View) {
        sinon.spy(Topic.Behavior, 'applyStyles');
      }

      Topic.Behavior.applyStyles.reset();

      View = dependencies.Backbone.View.extend({
        'initialize': function () {
          Topic.applyTo(this);
          dependencies.Backbone.View.prototype.initialize.apply(this, arguments);
        }
      });

      done();
    });
  });

  describe('#initialize', function () {

    it('should execute #applyStyles', function () {

      new View();
      Topic.Behavior.applyStyles.should.have.been.calledOnce;
    });

    it('should not execute #applyStyles if self.autoApplyStyles is FALSE', function () {

      new (View.extend({
        'autoApplyStyles': false
      }))();
      Topic.Behavior.applyStyles.should.not.have.been.called;
    });
  });

  describe('#applyStyles', function () {

    it('should iterate self.styles and execute applier functions', function () {

      var style1 = new WBStyleApplier('whatever', 'body{display:block}');
      var style2 = new WBStyleApplier('whatever', 'body{display:block}');
      style1.apply = sinon.spy();
      style2.apply = sinon.spy();
      new (View.extend({
        'styles': [style1, style2]
      }))();

      style1.apply.should.have.been.calledOnce;
      style2.apply.should.have.been.calledOnce;
    });

    xit('should iterate self.styles and throw error if any object is not a subclass of WBStyleApplier', function () {

      var Target1 = View.extend({
        'styles': ['string']
      });

      var Target2 = View.extend({
        'styles': [{}]
      });

      var Target3 = View.extend({
        'styles': [7832]
      });

      var func = sinon.spy();
      var Target4 = View.extend({
        'styles': [func]
      });

      (function () {
        new Target1();
      }).should.throw();

      (function () {
        new Target2();
      }).should.throw();

      (function () {
        new Target3();
      }).should.throw();

      (function () {
        new Target4();
      }).should.throw();
    });

    it('should pass self (target) as first argument to applier #apply method', function () {

      var style1 = new WBStyleApplier('whatever', 'body{display:block}');
      style1.apply = sinon.spy();
      var variables = {
        'foo': 'bar',
        'value': 983
      };
      var target = new (View.extend({
        'styleVariables': variables,
        'styles': [style1]
      }))();

      style1.apply.should.have.been.calledOnce;
      style1.apply.should.have.been.calledWith(target, variables);
    });

    it('should pass self.styleVariables as second argument to applier #apply method', function () {

      var style1 = new WBStyleApplier('whatever', 'body{display:block}');
      style1.apply = sinon.spy();
      var variables = {
        'foo': 'bar',
        'value': 983
      };
      var target = new (View.extend({
        'styleVariables': variables,
        'styles': [style1]
      }))();

      style1.apply.should.have.been.calledOnce;
      style1.apply.should.have.been.calledWith(target, variables);
    });


    it('should pass empty object to applier function if self.styleVariables is not existing', function () {

      var style1 = new WBStyleApplier('whatever', 'body{display:block}');
      style1.apply = sinon.spy();

      var target = new (View.extend({
        'styles': [style1]
      }))();

      style1.apply.should.have.been.calledOnce;
      style1.apply.should.have.been.calledWith(target, {});
    });
  });
});