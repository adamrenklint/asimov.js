describe('WBViewPresenter', function () {

  'use strict';

  var Topic, WBView, WBViewController, runtime, Backbone;

  beforeEach(function (done) {
    requirejs([
      'wunderbits/lib/dependencies',
      'wunderbits/WBViewPresenter',
      'wunderbits/WBViewController',
      'wunderbits/WBView',
      'application/runtime'
    ], function (dependencies, WBViewPresenter, _WBViewController, _WBView, _runtime) {

      Backbone = dependencies.Backbone;
      Topic = WBViewPresenter;
      WBViewController = _WBViewController;
      WBView = _WBView;
      runtime = _runtime;
      done();
    });
  });

  it('should be a subclass of WBView', function () {

    (new Topic()).should.be.instanceOf(WBView);
  });

  describe('#createObserveBindings', function () {

    function testMergeSuperClassData (key) {

      it('should implement "observes.' + key + '" from every SuperClass when subclassing', function () {

        var onDataChangeSpy = sinon.spy();
        var onCountUpdateSpy = sinon.spy();
        var onConfusedSpy = sinon.spy();
        var onDataChangeSpy2 = sinon.spy();

        var firstClassData = {
          'observes': {},
          'onDataChange': onDataChangeSpy,
          'onCountUpdate': onCountUpdateSpy
        };
        firstClassData.observes[key] = {
          'change:data': 'onDataChange',
          'change:count': 'onCountUpdate'
        };
        var FirstClass = Topic.extend(firstClassData);

        var secondClassData = {
          'observes': {},
          'onConfused': onConfusedSpy
        };
        secondClassData.observes[key] = {
          'change:mind': 'onConfused'
        };
        var SecondClass = FirstClass.extend(secondClassData);

        var thirdClassData = {
          'observes': {},
          'onChangeData2': onDataChangeSpy2,
          'initialize': function (options) {
            this[key] = options[key];
            SecondClass.prototype.initialize.apply(this, arguments);
          }
        };
        thirdClassData.observes[key] = {
          'change:data': 'onChangeData2'
        };
        var ThirdClass = SecondClass.extend(thirdClassData);

        var thirdClassOptions = {};
        var model;
        if (key !== 'events') {
          model = key === 'runtime' ? runtime : new Backbone.Model();
          thirdClassOptions[key] = model;
        }

        var instance = new ThirdClass(thirdClassOptions);

        if (key === 'runtime') {
          runtime.trigger('change:count').trigger('change:data').trigger('change:mind');
        }
        else if (key === 'events') {
          instance.trigger('change:count').trigger('change:data').trigger('change:mind');
        }
        else {
          model.set({
            'data': 'alskjdaklsd',
            'count': 989032,
            'mind': 'un poco loco'
          });
        }

        expect(onDataChangeSpy).to.have.been.called;
        expect(onCountUpdateSpy).to.have.been.calledOnce;
        expect(onConfusedSpy).to.have.been.calledOnce;
        expect(onDataChangeSpy2).to.have.been.calledOnce;
      });

      it('should allow "observes.' + key + '" to define an array of methods for each event', function () {

        var onDataChangeSpy = sinon.spy();
        var onCountUpdateSpy = sinon.spy();

        var firstClassData = {
          'observes': {},
          'onDataChange': onDataChangeSpy,
          'onCountUpdate': onCountUpdateSpy,
          'initialize': function (options) {
            if (key !== 'events') {
              this[key] = options[key];
            }
            Topic.prototype.initialize.apply(this, arguments);
          }
        };
        firstClassData.observes[key] = {
          'change:data': ['onDataChange', 'onCountUpdate']
        };
        var FirstClass = Topic.extend(firstClassData);

        var classOptions = {};
        var model;
        if (key !== 'events') {
          model = key === 'runtime' ? runtime : new Backbone.Model();
          classOptions[key] = model;
        }

        var instance = new FirstClass(classOptions);
        if (key === 'runtime') {
          runtime.trigger('change:data');
        }
        else if (key === 'events') {
          instance.trigger('change:data');
        }
        else {
          model.set({
            'data': 'alskjdaklsd'
          });
        }

        expect(onDataChangeSpy).to.have.been.calledOnce;
        expect(onCountUpdateSpy).to.have.been.calledOnce;
      });
    }

    _.each(['runtime', 'random', 'events'], testMergeSuperClassData);

    describe('observe.runtime', function () {

      it('should allow runtime events to be piped to events on self using >', function () {

        var spy = sinon.spy();

        var PipeClass = Topic.extend({
          'observes': {
            'events': {
              'pipedEvent': spy
            },
            'runtime': {
              'originalEvent': '>pipedEvent'
            }
          }
        });

        new PipeClass();
        runtime.trigger('originalEvent');

        expect(spy).to.have.been.calledOnce;
      });
    });

    describe('*parents and *children', function () {

      it('should trigger event from parent view on child view', function () {

        var spy1 = sinon.spy();
        var spy2 = sinon.spy();

        var parent = new Topic();
        var middle = new Topic();
        var child = new (Topic.extend({
          'observes': {
            '*parents': {
              'fromGrandDad': spy1
            },
            'fromGrandDad': spy2
          }
        }))();

        parent.addSubview(middle);
        middle.addSubview(child);

        parent.trigger('fromGrandDad', 'foo');

        expect(spy1).to.have.been.calledOnce;
        expect(spy1).to.have.been.calledWith('foo');

        expect(spy2).not.to.have.been.called;
      });

      it('should trigger event from child view on parent view', function () {

        var spy1 = sinon.spy();
        var spy2 = sinon.spy();

        var parent = new (Topic.extend({
          'observes': {
            '*children': {
              'fromBabyBear:anEvent': spy1
            },
            'events': {
              'fromBabyBear': spy2
            }
          }
        }))();
        var middle = new Topic();
        var child = new Topic();

        parent.addSubview(middle);
        middle.addSubview(child);

        child.trigger('fromBabyBear:anEvent', 'foo');

        expect(spy1).to.have.been.calledOnce;
        expect(spy1).to.have.been.calledWith('foo');

        expect(spy2).not.to.have.been.called;
      });

      it('should trigger events from child view and parent view on middle view', function () {

        var spy1 = sinon.spy();
        var spy2 = sinon.spy();

        var parent = new Topic();
        var middle = new (Topic.extend({
          'observes': {
            '*children': {
              'fromBabyBear': spy1
            },
            '*parents': {
              'fromGrandDad': spy2
            }
          }
        }))();
        var child = new Topic();

        parent.addSubview(middle);
        middle.addSubview(child);

        child.trigger('fromBabyBear', 'foo');
        parent.trigger('fromGrandDad', 'bar');

        expect(spy1).to.have.been.calledOnce;
        expect(spy1).to.have.been.calledWith('foo');

        expect(spy2).to.have.been.calledOnce;
        expect(spy2).to.have.been.calledWith('bar');
      });
    });
  });

  describe('#delegateEvents', function () {

    it('should allow for more than one DOM event to trigger the same view event', function () {

      var topic = new (Topic.extend({
        'emits': {
          'tip': 'stomp',
          'top': 'stomp'
        }
      }))();

      var spy = sinon.spy();
      topic.on('stomp', spy);
      topic.$el.trigger('tip');
      expect(spy).to.have.been.calledOnce;
      topic.$el.trigger('top');
      expect(spy).to.have.been.calledTwice;
    });

    it('should pass all arguments from DOM event to view event', function () {

      var topic = new (Topic.extend({
        'emits': {
          'click .something': 'stomp'
        },

        'render': function () {
          var self = this;
          Topic.prototype.render.apply(self, arguments);
          self.$el.append('<div class="something"/>');
          return self;
        }
      }))();

      var spy = sinon.spy();
      var ev;

      topic.bindTo(topic, 'stomp', function () {
        ev = arguments[0];
        spy.apply(spy, arguments);
      });

      topic.render();
      topic.$('.something').trigger('click', ['foo', 'bar']);

      expect(spy).to.have.been.calledOnce;
      expect(spy).to.have.been.calledWith(ev, 'foo', 'bar');
    });
  });

  describe('#createControllerInstances', function () {

    it('should not implement a controller if a subclass of that controller has already been implemented', function () {

      var ControllerClass1 = WBViewController.extend();
      var ControllerClass2 = ControllerClass1.extend();
      var ControllerClass3 = ControllerClass2.extend();

      var PresenterClass1 = Topic.extend({
        'implements': [ControllerClass1]
      });

      var PresenterClass2 = PresenterClass1.extend({
        'implements': [ControllerClass3]
      });

      var presenter = new PresenterClass2();

      expect(presenter.controllers.length).to.equal(1);
      expect(presenter.controllers[0].constructor.toString()).to.equal(ControllerClass3.toString());
    });
  });

  describe('#mapEventProxies', function () {

    var topic, events;

    beforeEach(function () {

      topic = new (Topic.extend({
        'emits': {
          'tap': 'tap:this'
        }
      }))();

      events = topic.getEvents();
      events = topic.mapEventProxies(events);
    });

    it('should create an event trigger for each proxy', function () {

      expect(events.click).to.equal('tap:this');
      expect(events.touchstart).to.equal('tap:this');
    });

    it('should remove the proxy event', function () {
      expect(events.tap).to.be.undefined;
    });

    it('should actually trigger the event', function () {

      var spy = sinon.spy();
      topic.on('tap:this', spy);
      topic.$el.trigger('click');
      expect(spy).to.have.been.calledOnce;
    });
  });

  describe('#destroy', function () {

    it('should call destroy on each Controller', function () {

      var spy = sinon.spy();

      var ControllerClass = WBViewController.extend({
        'initialize': function () {
          WBViewController.prototype.initialize.apply(this, arguments);
          this.destroy = spy;
        }
      });
      var ViewClass = Topic.extend({
        'implements': [ControllerClass]
      });

      var view = new ViewClass();
      view.destroy();

      expect(spy).to.have.been.calledOnce;
    });
  });
});