describe('WBBindableMixin', function () {

  'use strict';

  var topic, model, model2;

  beforeEach(function (done) {
    requirejs([
      'lib/createUID',
      'mixins/WBEventsMixin',
      'mixins/WBBindableMixin'
    ], function (createUID, WBEventsMixin, WBBindableMixin) {

      model = {
        'uid': createUID()
      };

      model2 = {
        'uid': createUID()
      };

      topic = {
        'uid': createUID()
      };

      WBEventsMixin.applyTo(model);
      WBEventsMixin.applyTo(model2);
      WBEventsMixin.applyTo(topic);
      WBBindableMixin.applyTo(topic);

      done();
    });
  });

  describe('#bindTo', function () {

    it('should throw error if called without target', function () {

      var fn = function () {
        topic.bindTo();
      };

      fn.should.throw('Cannot bind to undefined target or target without #on');
    });

    it('should throw error if called without event name', function () {

      var fn = function () {
        topic.bindTo(model);
      };

      fn.should.throw('Cannot bind to target event without event name');
    });

    it('should throw error if called without callback', function () {

      var fn = function () {
        topic.bindTo(model, 'event');
      };

      fn.should.throw('Cannot bind to target event without a function or method name as callback');
    });

    it('should throw error if called with a mothod name as callback does not exist for the context', function () {

      var fn = function () {
        topic.bindTo(model, 'event', 'sdlfksdjflksjdflkj');
        fn.should.throw('Cannot bind to target using a method name that does not exist for the context');
      };
    });

    it('should return binding object', function () {

      var callback = function () {};
      var binding = topic.bindTo(model, 'custom', callback);

      binding.should.be.a('object');
      binding.uid.should.be.a('string');
      binding.target.should.equal(model);
      binding.event.should.equal('custom');
      binding.callback.should.equal(callback);
    });

    it('should actually bind callback to target event', function () {

      var callback = sinon.spy();
      topic.bindTo(model, 'custom', callback);
      model.trigger('custom');

      callback.should.have.been.calledOnce;
    });

    it('should actually bind method name callback to target event and call callback with provided context', function (done) {

      var obj = {
        'id': 'myLittlePony'
      };

      obj.callback = function () {

        expect(this.id).to.equal('myLittlePony');
        done();
      };

      topic.bindTo(model, 'custom', 'callback', obj);
      model.trigger('custom');
    });

    it('should actually bind method name callback to target event and call callback with default context', function (done) {

      topic.id = 'iAmAHappyCamper';

      topic.callback = function () {

        expect(this.id).to.equal('iAmAHappyCamper');
        done();
      };

      topic.bindTo(model, 'custom', 'callback');
      model.trigger('custom');
    });

    it('should store the binding in a private map', function () {

      var callback = function () {};
      var binding = topic.bindTo(model, 'custom', callback);

      topic._bindings.should.be.a('object');
      topic._bindings.should.include.keys(binding.uid);
      topic._bindings[binding.uid].should.equal(binding);
    });

    describe('given that the same callback is bound more than once', function () {

      it('should actually only bind the callback once', function () {

        var callback = sinon.spy();

        topic.bindTo(model, 'justone', callback);
        topic.bindTo(model, 'justone', callback);

        model.trigger('justone');
        expect(callback).to.have.been.calledOnce;

        var callback2 = sinon.spy();
        var obj = {};
        obj.callback = callback2;

        topic.bindTo(model, 'justonename', 'callback', obj);
        topic.bindTo(model, 'justonename', 'callback', obj);

        model.trigger('justonename');

        expect(obj.callback).to.have.been.calledOnce;

      });

      it('should return the same binding object', function () {

        var callback = sinon.spy();

        var binding1 = topic.bindTo(model, 'justone', callback);
        var binding2 = topic.bindTo(model, 'justone', callback);

        expect(binding1.uid).to.equal(binding2.uid);

        var callback2 = sinon.spy();
        var obj = {};
        obj.callback = callback2;

        var binding3 = topic.bindTo(model, 'justone', 'callback', obj);
        var binding4 = topic.bindTo(model, 'justone', 'callback', obj);

        expect(binding3.uid).to.equal(binding4.uid);
      });
    });

    describe('given that the same callback is passed for two different events', function () {

      it('should actually bind each callback', function () {

        var callback = sinon.spy();

        topic.bindTo(model, 'eve1', callback);
        topic.bindTo(model, 'eve2', callback);

        model.trigger('eve1');
        model.trigger('eve2');
        expect(callback).to.have.been.calledTwice;
      });
    });

    describe('given that the same callback is passed for two different targets', function () {

      it('should actually bind each callback', function () {

        var callback = sinon.spy();

        topic.bindTo(model, 'evex', callback);
        topic.bindTo(model2, 'evex', callback);

        model.trigger('evex');
        model2.trigger('evex');
        expect(callback).to.have.been.calledTwice;
      });
    });
  });

  describe('#bindOnceTo', function () {

    it('should return binding object', function () {

      var callback = function () {};
      var binding = topic.bindOnceTo(model, 'custom', callback);

      binding.should.be.a('object');
      binding.uid.should.be.a('string');
      binding.target.should.equal(model);
      binding.event.should.equal('custom');
      binding.callback.should.be.a('function');
    });

    it('should actually bind callback to target event', function () {

      var callback = sinon.spy();
      topic.bindOnceTo(model, 'custom', callback);
      model.trigger('custom');

      callback.should.have.been.calledOnce;
    });

    it('should only allow trigger of callback once', function () {

      var callback = sinon.spy();
      topic.bindOnceTo(model, 'custom', callback);
      model.trigger('custom').trigger('custom');

      callback.should.have.been.calledOnce;
    });

    it('should use #unbindFrom to unbind binding after first trigger', function () {

      var callback = function () {};
      topic.unbindFrom = sinon.spy();

      var binding = topic.bindOnceTo(model, 'customOnce', callback);
      model.trigger('customOnce');

      topic.unbindFrom.should.have.been.calledOnce;
      topic.unbindFrom.should.have.been.calledWith(binding);
    });
  });

  describe('#unbindFrom', function () {

    it('should throw error if called without valid binding', function () {

      var callback = function () {};
      var binding = topic.bindTo(model, 'event', callback);

      var fn1 = function () {
        topic.unbindFrom();
      };

      var fn2 = function () {
        delete binding.uid;
        topic.unbindFrom(binding);
      };

      fn1.should.throw('Cannot unbind from undefined or invalid binding');
      fn2.should.throw('Cannot unbind from undefined or invalid binding');
    });

    it('should actually unbind callback from target event', function () {

      var callback = sinon.spy();
      var binding = topic.bindTo(model, 'custom', callback);
      topic.unbindFrom(binding);
      model.trigger('custom');

      callback.should.not.have.been.called;
    });

    it('should remove binding from private map', function () {

      var callback = function () {};
      var binding = topic.bindTo(model, 'custom', callback);

      topic._bindings[binding.uid].should.equal(binding);
      topic.unbindFrom(binding);
      topic._bindings.should.not.include.keys(binding.uid);
    });

    it('should remove binding from events map', function () {

      var callback = function () {};
      var binding = topic.bindTo(model, 'asdas', callback);
      topic.unbindFrom(binding);

      var exists = false;
      var events = topic._namedEvents.asdas;
      events.forEach(function (_binding) {
        if (_binding.uid === binding.uid) {
          exists = true;
        }
      });

      expect(exists).to.be.false;
    });

    it('should clean up binding object, but leave uid', function () {

      var callback = function () {};
      var binding = topic.bindTo(model, 'custom', callback);
      topic.unbindFrom(binding);

      binding.should.include.keys('uid');
      binding.should.not.include.keys('callback');
      binding.should.not.include.keys('target');
      binding.should.not.include.keys('event');
    });
  });

  describe('#unbindFromTarget', function () {

    it('should throw error if called without valid target', function () {

      var callback = function () {};
      topic.bindTo(model, 'event', callback);

      var fn1 = function () {
        topic.unbindFromTarget();
      };

      var fn2 = function () {
        topic.unbindFromTarget({});
      };

      fn1.should.throw('Cannot unbind from undefined or invalid binding target');
      fn2.should.throw('Cannot unbind from undefined or invalid binding target');
    });

    it('should actually unbind all the views callback from target', function () {

      var callback = sinon.spy();
      topic.bindTo(model, 'testing-bind-target', callback);
      topic.bindTo(model, 'testing-target-unbind', callback);
      topic.unbindFromTarget(model);
      model.trigger('testing-bind-target');
      model.trigger('testing-target-unbind');

      callback.should.not.have.been.called;
    });

    it('should remove bindings from private map', function () {

      var callback = function () {};
      var bind1 = topic.bindTo(model, 'testing-bind-target', callback);
      var bind2 = topic.bindTo(model, 'testing-target-unbind', callback);

      topic._bindings.should.include.keys(bind1.uid);
      topic._bindings.should.include.keys(bind2.uid);

      topic.unbindFromTarget(model);

      topic._bindings.should.not.include.keys(bind1.uid);
      topic._bindings.should.not.include.keys(bind2.uid);
    });

    it('should clean up binding object, but keep uid', function () {

      var callback = function () {};
      var binding = topic.bindTo(model, 'custom', callback);
      topic.unbindFromTarget(model);

      binding.should.include.keys('uid');
      binding.should.not.include.keys('callback');
      binding.should.not.include.keys('target');
      binding.should.not.include.keys('event');
    });
  });

  describe('#unbindAll', function () {

    it('should actually unbind all bindings', function () {

      var callback = sinon.spy();
      topic.bindTo(model, 'custom1', callback);
      topic.bindTo(model, 'custom2', callback);

      topic.unbindAll();
      model.trigger('custom1');
      model.trigger('custom2');

      callback.should.not.have.been.called;
    });

    it('should use #unbindFrom for each binding', function () {

      var callback = function () {};
      topic.unbindFrom = sinon.spy();
      var binding1 = topic.bindTo(model, 'custom1', callback);
      var binding2 = topic.bindTo(model, 'custom2', callback);

      topic.unbindAll();

      topic.unbindFrom.should.have.been.calledTwice;
      topic.unbindFrom.should.have.been.calledWith(binding1);
      topic.unbindFrom.should.have.been.calledWith(binding2);
    });
  });
});