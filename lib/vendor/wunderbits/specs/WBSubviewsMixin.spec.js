describe('WBSubviewsMixin', function () {

  var topic, Topic, View, $, Backbone;

  beforeEach(function (done) {
    requirejs([
      'vendor/backbone',
      'vendor/jquery',
      'wunderbits/mixins/WBSubviewsMixin'
    ], function (_backbone, _$, WBSubviewsMixin) {

      $ = _$;
      Backbone = _backbone;

      if (!topic) {
        sinon.spy($, 'cleanData');
      }

      Topic = WBSubviewsMixin;
      topic = Topic.applyTo(new Backbone.View());

      View = Backbone.View.extend({
        'className' : 'test-subview',
        'initialize': function () {
          Backbone.View.prototype.initialize.apply(this, arguments);
          Topic.applyTo(this);
        },
        'events': {
          'click': 'noop'
        },
        noop: function() {}
      });

      done();
    });
  });

  describe('#addSubview', function () {

    it('should throw error if valid subview is not passed', function () {

      var fn1 = function () {
        topic.addSubview();
      };

      var fn2 = function () {
        topic.addSubview({});
      };

      var fn3 = function () {
        topic.addSubview('foo');
      };

      fn1.should.throw('Cannot add invalid or undefined subview');
      fn2.should.throw('Cannot add invalid or undefined subview');
      fn3.should.throw('Cannot add invalid or undefined subview');
    });

    it('should not throw error if valid subview is passed', function () {

      var fn = function () {
        topic.addSubview(new View());
      };

      fn.should.not.throw();
    });

    it('should return added subview', function () {

      var child = new View();
      var ret = topic.addSubview(child);

      ret.should.deep.equal(child);
    });

    it('should add reference to parent view on child', function () {

      var child = new View();
      topic.addSubview(child);

      child._superView.should.deep.equal(topic);
    });

    it('should attach name to child', function () {

      var c = new View();
      topic.addSubview(c, 'namespace');

      c._name.should.equal('namespace');
    });

    it('should grow anonymous map when adding subview', function () {

      var c1 = new View();
      var c2 = new View();
      topic.addSubview(c1);
      topic.addSubview(c2, 'namespace');

      topic._subviews.length.should.equal(2);
      topic._subviews.should.include(c1);
      topic._subviews.should.include(c2);
    });

    it('should grow named map when adding named subview', function () {

      var c1 = new View();
      var namespace = 'namespace';
      topic.addSubview(c1, namespace);

      _.size(topic._namedSubviews).should.equal(1);
      topic._namedSubviews.should.include.keys(namespace);
      topic._namedSubviews[namespace].should.deep.equal(c1);
    });

    it('should not grow named map when adding anonymous subview', function () {

      var c1 = new View();
      topic.addSubview(c1);
      var size = topic._namedSubviews ? _.size(topic._namedSubviews) : 0;

      size.should.equal(0);
    });

    it('should not grow anonymous map when re-adding named view', function () {

      var n1 = new View();
      var n2 = new View();
      topic.addSubview(n1, 'namespace');
      topic.addSubview(n2, 'namespace');

      topic._subviews.length.should.equal(1);
      topic._subviews[0].should.deep.equal(n2);
    });

    it('should not grow named map when re-adding named view', function () {

      var n1 = new View();
      var n2 = new View();
      var namespace = 'namespace';
      topic.addSubview(n1, namespace);
      topic.addSubview(n2, namespace);

      _.size(topic._namedSubviews).should.equal(1);
      topic._namedSubviews[namespace].should.deep.equal(n2);
    });
  });

  describe('#destroySubview', function () {

    it('should shrink anonymous map when removing anonymous subview', function () {

      var c = new View();
      topic.addSubview(c);
      topic.destroySubview(c);

      topic._subviews.length.should.equal(0);
    });

    it('should shrink anonymous map when removing named subview', function () {

      topic.addSubview(new View(), 'anyName');
      topic.destroySubview('anyName');

      topic._subviews.length.should.equal(0);
    });

    it('should shrink named map when removing named view', function () {

      topic.addSubview(new View(), 'thenamespace');
      topic.destroySubview('thenamespace');
      var size = topic._namedSubviews ? _.size(topic._namedSubviews) : 0;

      size.should.equal(0);
    });

    it('should not shrink named map when removing anonymous view', function () {

      var named = new View();
      var anon = new View();
      var namespace = '989ajsda';

      topic.addSubview(named, namespace);
      topic.addSubview(anon);
      topic.destroySubview(anon);

      var size = topic._namedSubviews ? _.size(topic._namedSubviews) : 0;

      size.should.equal(1);
      topic._namedSubviews.should.contain.keys(namespace);
      topic._namedSubviews[namespace].should.deep.equal(named);
    });
  });

  describe('#destroySubviews', function () {

    it('should destroy all subviews', function () {

      topic.addSubview(new View());
      topic.addSubview(new View(), 'namespace');
      topic.destroySubviews();

      topic._subviews.length.should.equal(0);
      _.size(topic._namedSubviews).should.equal(0);
    });
  });

  describe('#getSubview', function () {

    it('should return named subview when requesting with name', function () {

      var named = new View();
      topic.addSubview(named, 'anyName');
      var ret = topic.getSubview('anyName');

      ret.should.deep.equal(named);
    });

    it('should return undefined subview if subview does not exist', function () {

      var ret = topic.getSubview('anyName');
      expect(ret).to.equal(undefined);
    });
  });

  describe('#detach', function () {

    it('should flag view as detached', function () {

      topic.detach();
      topic._detached.should.be.true;
    });

    it('should actually detach view', function () {

      var view = new View({ id: 'detachable' });
      $('body').append(topic.addSubview(view).el);

      $('#detachable').size().should.equal(1);
      view.detach();
      $('#detachable').size().should.equal(0);
    });
  });

  describe('#destroy', function () {

    it('should delete references to child on parent', function () {

      var c = new View();
      topic.addSubview(c, 'namespace');
      c.destroy();

      expect(topic.getSubview('namespace')).to.equal(undefined);
    });

    it('should delete references to parent on child', function () {

      var c = new View();
      topic.addSubview(c, 'namespace');
      c.destroy();

      c.should.not.include.keys('_superView');
    });

    it('should delete references to model, collection and options', function () {

      var c = new View({
        model: 'foo',
        collection: 'bar'
      });
      c.destroy();

      c.should.not.contain.keys('options');
      c.should.not.contain.keys('model');
      c.should.not.contain.keys('collection');
    });

    it('should delete its own element', function () {

      var c = new View();
      c.destroy();

      c.should.not.contain.keys('el');
      c.should.not.contain.keys('$el');
    });

    it('should execute #onDestroy callback', function () {

      var c = new View();
      var onDestroy = c.onDestroy = sinon.spy();
      topic.addSubview(c, 'namespace');
      c.destroy();

      onDestroy.should.have.been.calledOnce;
    });

    it('should call $.cleanData on detached view', function () {

      $.cleanData.reset();
      topic.detach();
      topic.destroy();

      $.cleanData.should.have.been.called;
    });

    it('should unbind any events bound to itself', function () {

      var v = new View();
      var spy = sinon.spy();

      v.on('custom:event', spy);
      v.destroy();
      v.trigger('custom:event');

      spy.should.not.have.been.called;
    });

    it('should trigger destroyed:subview event on parent', function () {

      var spy = sinon.spy();
      var view1 = new View();
      view1.on('destroyed:subview', spy);
      var view2 = new View();
      view1.addSubview(view2);

      view2.destroy();

      expect(spy).to.have.been.calledOnce;
      expect(spy).to.have.been.calledWith(view2);
    });

    it('should actually remove the element from DOM', function () {

      var v = new View({ id: 'removable' });
      $('body').append(topic.addSubview(v).el);

      $('#removable').size().should.equal(1);
      v.destroy();
      $('#removable').size().should.equal(0);
    });

    it('should delete all object properties, except for uid', function () {

      var uid = topic.uid = '78aysdas';
      topic.foo = 'bar';
      topic.fn = function () {};
      topic.model = new Backbone.Model();
      topic.collection = new Backbone.Collection();

      topic.destroy();

      topic.should.include.keys('uid');
      topic.uid.should.equal(uid);
      topic.should.not.include.keys('foo');
      topic.should.not.include.keys('fn');
      topic.should.not.include.keys('model');
      topic.should.not.include.keys('collection');
    });

    it('should trigger "destroy" event', function () {

      var callback = sinon.spy();
      topic.on('destroy', callback);

      topic.destroy();

      callback.should.have.been.calledOnce;
    });

    it('should flag target as destroyed', function () {

      topic.destroy();
      topic.destroyed.should.be.true;
    });
  });

  describe('#cleanData', function () {

    it('should do nothing if view has no element', function () {

      $.cleanData.reset();
      var v = new View();
      v.el = null;
      v.cleanData();

      $.cleanData.should.not.have.been.called;
    });

    it('should execute $.cleanData with its own element', function () {

      $.cleanData.reset();
      var v = new View();
      v.$el.html('<p id="the_el">I am the element itself</p>');
      v.cleanData();

      $.cleanData.should.have.been.calledWith([v.el]);
    });
  });

  describe('jQuery cache related leaks', function () {

    // these tests will show leaks that can be caused by jQuery cache not being
    // cleared properly and thus forever keeping the views and all other objects
    // they reference in memory

    it('should create leak when a subview with delegated events created in initialize was never attached to the DOM', function () {

      if (isNode) {

        // leak does not occur in jsdom
        return;
      }

      var startCacheSize = _.size($.cache);
      var view = new (View.extend({
        initialize: function() {
          this.constructor.__super__.initialize.apply(this, arguments);
          this.subview = new View();
        }
      }))();

      $('body').append(view.render().el);
      view.destroy();

      startCacheSize.should.be.below(_.size($.cache));
    });

    // to fix the above, we need to use #addSubview and #detach
    it('should not create leak when a subview with delegated events created in initialize was never attached to the DOM, using addSubview and detached method', function () {

      var startCacheSize = _.size($.cache);
      var view = new (View.extend({
        initialize: function() {
          this.constructor.__super__.initialize.apply(this, arguments);
          this.subview = this.addSubview(new View()).detach();
        }
      }))();

      $('body').append(view.render().el);
      view.destroy();

      startCacheSize.should.equal(_.size($.cache));
    });

    it('should create leak when subview attached to DOM is removed with jQuery detach', function () {

      if (isNode) {

        // leak does not occur in jsdom
        return;
      }

      var startCacheSize = _.size($.cache);
      var view = new (View.extend({
        initialize: function() {
          this.constructor.__super__.initialize.apply(this, arguments);
          this.subview = new View();
        },
        render: function () {
          this.$el.append(this.subview.render().el);
          return this;
        }
      }))();

      $('body').append(view.render().el);
      view.subview.$el.detach();
      view.destroy();

      startCacheSize.should.be.below(_.size($.cache));
    });

    it('should not create leak when subview attached to DOM is added with #addSubview and removed with #detach', function () {

      var startCacheSize = _.size($.cache);
      var view = new (View.extend({
        initialize: function() {
          this.constructor.__super__.initialize.apply(this, arguments);
          this.subview = this.addSubview(new View());
        },
        render: function() {
          this.$el.append(this.subview.render().el);
          return this;
        }
      }))();

      $('body').append(view.render().el);
      view.subview.detach();
      view.destroy();

      startCacheSize.should.equal(_.size($.cache));
    });
  });

  describe('Persistent resource related leaks', function () {

    function _getCallbacksCount (eventsObject) {

      if (!eventsObject._events) {
        return 0;
      }

      var callbacks = 0, key, callback;

      for (key in eventsObject._events) {
        for (callback in eventsObject._events[key]) {
          callbacks++;
        }
      }

      return callbacks;
    }

    it('should create leak when adding subview with persistent collection or model without cleaning up bindings', function () {

      var persistentCollection = new Backbone.Collection();
      var ViewClass = View.extend({
        initialize: function (options) {
          this.constructor.__super__.initialize.apply(this, arguments);
          this.collection = options.collection;
          this.collection.on('change', this.foo);
          this.collection.on('reset', this.foo);
          this.collection.on('add', this.foo);
        },
        foo: function () {}
      });

      _getCallbacksCount(persistentCollection).should.equal(0);

      new ViewClass({ collection: persistentCollection }).destroy();
      new ViewClass({ collection: persistentCollection }).destroy();
      new ViewClass({ collection: persistentCollection }).destroy();

      // the collections callbacks count is equal to to the amount of events bound
      // keeping the views still in memory, in other words leaking
      _getCallbacksCount(persistentCollection).should.equal(9);
    });

    it('should not create leak when adding subview with persistent collection or model and cleaning up bindings using #onDestroy', function () {

      var persistentCollection = new Backbone.Collection();

      var ViewClass = View.extend({
        'initialize': function (options) {
          this.constructor.__super__.initialize.apply(this, arguments);
          this.collection = options.collection;
          this.collection.on('change', this.foo);
          this.collection.on('reset', this.foo);
          this.collection.on('add', this.foo);
        },
        'onDestroy': function () {
          this.collection.off('change', this.foo);
          this.collection.off('reset', this.foo);
          this.collection.off('add', this.foo);
        },
        'foo': function () {}
      });

      _getCallbacksCount(persistentCollection).should.equal(0);

      new ViewClass({ 'collection': persistentCollection }).destroy();
      new ViewClass({ 'collection': persistentCollection }).destroy();
      new ViewClass({ 'collection': persistentCollection }).destroy();

      _getCallbacksCount(persistentCollection).should.equal(0);
    });
  });
});