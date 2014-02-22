describe('WBEventsMixin', function () {

  'use strict';

  var topic, Topic;

  beforeEach(function (done) {
    requirejs([
      'mixins/WBEventsMixin'
    ], function (WBEventsMixin) {

      Topic = WBEventsMixin;
      topic = Topic.applyTo({});
      done();
    });
  });

  describe('#on', function () {

    it('should throw error if called without event name(s)', function () {

      expect(function () {
        topic.on();
      }).to.throw(Error);
    });

    it('should throw error if called without callback', function () {

      expect(function () {
        topic.on('event');
      }).to.throw(Error);
    });

    it('should subscribe callback to single event', function () {

      var callback = sinon.spy();

      topic.on('any:event', callback);
      topic.trigger('any:event');

      expect(callback).to.have.been.calledOnce;
    });

    it('should subscribe callback to multiple events', function () {

      var callback = sinon.spy();

      topic.on('any:event other:event', callback);

      topic.trigger('any:event');
      expect(callback).to.have.been.calledOnce;

      topic.trigger('other:event');
      expect(callback).to.have.been.calledTwice;
    });

    it('should pass through single argument', function () {

      var foo = 'bar';
      var callback = sinon.spy();

      topic.on('TEST:event:ONCE', callback);
      topic.trigger('TEST:event:ONCE', foo);

      expect(callback).to.have.been.calledWith(foo);
    });

    it('should pass through multiple arguments', function () {

      var foo = 'bar';
      var play = 'work';
      var callback = sinon.spy();

      topic.on('TEST:event:ONCE', callback);
      topic.trigger('TEST:event:ONCE', foo, play);

      expect(callback).to.have.been.calledWith(foo, play);
    });

    it('should be chainable', function () {

      var callback = sinon.spy();
      var newTopic = topic.on('any:event', callback);

      expect(newTopic.on).to.be.a('function');
      expect(newTopic).to.equal(topic);
    });
  });

  describe('#off', function () {

    it('should unsubscribe all callbacks from event', function () {

      var callback1 = sinon.spy();
      var callback2 = sinon.spy();

      topic.on('first:event', callback1);
      topic.on('first:event', callback2);
      topic.off('first:event');
      topic.trigger('first:event');

      expect(callback1).to.not.have.been.called;
      expect(callback2).to.not.have.been.called;
    });

    it('should unsubscribe only passed callback from event', function () {

      var callback1 = sinon.spy();
      var callback2 = sinon.spy();

      topic.on('first:event', callback1);
      topic.on('first:event', callback2);
      topic.off('first:event', callback1);
      topic.trigger('first:event');

      expect(callback1).to.not.have.been.called;
      expect(callback2).to.have.been.calledOnce;
    });

    it('should unsubscribe all events if no event name is passed', function () {

      var callback1 = sinon.spy();
      var callback2 = sinon.spy();

      topic.on('first:event', callback1);
      topic.on('first:event', callback2);
      topic.off();
      topic.trigger('first:event');

      expect(callback1).to.not.have.been.called;
      expect(callback2).to.not.have.been.called;
    });

    it('should throw error if with invalid event name', function () {

      var fn1 = function () {
        topic.off({});
      };

      var fn2 = function () {
        topic.off([]);
      };

      expect(fn1).to.throw(Error);
      expect(fn2).to.throw(Error);
    });

    it('should be chainable', function () {

      var callback = sinon.spy();
      var newTopic = topic.off('any:event', callback);

      expect(newTopic.off).to.be.a('function');
      expect(newTopic).to.equal(topic);
    });
  });

  describe('#once', function () {

    it('should only trigger callback once', function () {

      var callback = sinon.spy();

      topic.once('any:event', callback);
      topic.trigger('any:event');
      topic.trigger('any:event');

      expect(callback).to.have.been.calledOnce;
    });

    it('should trigger callback with correct context', function () {

      var callback = sinon.spy();

      topic.once('any:event', callback);
      topic.trigger('any:event');

      expect(callback).to.have.been.calledOn(topic);
    });

    it('should be chainable', function () {

      var callback = sinon.spy();
      var newTopic = topic.once('any:event', callback);

      expect(newTopic.once).to.be.a('function');
      expect(newTopic).to.equal(topic);
    });

    it('should pass through single argument', function () {

      var foo = 'bar';
      var callback = sinon.spy();

      topic.once('TEST:event:ONCE', callback);
      topic.trigger('TEST:event:ONCE', foo);

      expect(callback).to.have.been.calledWith(foo);
    });

    it('should pass through multiple arguments', function () {

      var foo = 'bar';
      var play = 'work';
      var callback = sinon.spy();

      topic.once('TEST:event:ONCE', callback);
      topic.trigger('TEST:event:ONCE', foo, play);

      expect(callback).to.have.been.calledWith(foo, play);
    });
  });

  describe('#trigger', function () {

    it('should throw error if called without event name(s)', function () {

      var fn = function () {
        topic.trigger();
      };

      expect(fn).to.throw(Error);
    });

    it('should trigger callback', function () {

      var callback = sinon.spy();

      topic.on('any:event', callback);
      topic.trigger('any:event');
      topic.trigger('any:event');

      expect(callback).to.have.been.calledTwice;
    });

    it('should trigger callback with correct context', function () {

      var callback = sinon.spy();

      topic.on('any:event', callback);
      topic.trigger('any:event');

      expect(callback).to.have.been.calledOn(topic);
    });

    it('should trigger callback of subscribed parent event', function () {

      var callback1 = sinon.spy();
      var callback2 = sinon.spy();

      topic.on('parent', callback1);
      topic.on('parent:child', callback2);
      topic.trigger('parent:child:detail', 'one', 'two');

      expect(callback1).to.have.been.called;
      expect(callback2).to.have.been.called;
    });

    it('should trigger multiple events if multiple eventNames are passed', function () {

      var callback1 = sinon.spy();
      var callback2 = sinon.spy();

      topic.on('one:two', callback1);
      topic.on('three', callback2);
      topic.trigger('three one:two');

      expect(callback1).to.have.been.called;
      expect(callback2).to.have.been.called;
    });

    it('should trigger multiple events up the chain if multiple eventNames are passed', function () {

      var callback1 = sinon.spy();
      var callback2 = sinon.spy();

      topic.on('one:two', callback1);
      topic.on('three', callback2);
      topic.trigger('three:five:eight one:two:any:thing');

      expect(callback1).to.have.been.called;
      expect(callback2).to.have.been.called;
    });

    it('should execute callback with all passed data as arguments', function (done) {

      var data1 = { foo: 'bar' };
      var data2 = { foo: 'baz' };
      var data3 = { foo: 'bam' };

      var callback = function (first, second, third) {

        expect(first).to.deep.equal(data1);
        expect(second).to.deep.equal(data2);
        expect(third).to.deep.equal(data3);

        done();
      };

      topic.on('pass:data', callback);
      topic.trigger('pass:data', data1, data2, data3);
    });

    it('should use trailing channel fragment as argument when triggering event on parent', function (done) {

      var data1 = { foo: 'bar' };
      var data2 = { foo: 'baz' };
      var data3 = { foo: 'bam' };

      var callback = function (fragments, d1, d2, d3) {

        expect(fragments).to.deep.equal(['child', 'detail']);

        expect(d1).to.deep.equal(data1);
        expect(d2).to.deep.equal(data2);
        expect(d3).to.deep.equal(data3);

        done();
      };

      topic.on('parent', callback);
      topic.trigger('parent:child:detail', data1, data2, data3);
    });


    it('should not use trailing channel fragment as argument when triggering event on target', function (done) {

      var data1 = { foo: 'bar' };
      var data2 = { foo: 'baz' };
      var data3 = { foo: 'bam' };

      var callback = function (d1, d2, d3) {

        expect(d1).to.deep.equal(data1);
        expect(d2).to.deep.equal(data2);
        expect(d3).to.deep.equal(data3);

        done();
      };

      topic.on('parent:child:detail', callback);
      topic.trigger('parent:child:detail', data1, data2, data3);
    });

    it('should not cache arguments', function () {

      var callback = sinon.spy();
      var argument1 = 'the blue or red pill?';
      var argument2 = 'follow the rabbit!';
      var eventName = 'test:cache';

      topic.on(eventName, callback);

      topic.trigger(eventName, argument1);
      expect(callback).to.have.been.calledWith(argument1);

      topic.trigger(eventName, argument2);
      expect(callback).to.have.been.calledWith(argument2);
    });

    it('should be chainable', function () {

      var newTopic = topic.trigger('any:event');

      expect(newTopic.trigger).to.be.a('function');
      expect(newTopic).to.equal(topic);
    });
  });

  describe('#publish', function () {

    it('should throw error if called without event name(s)', function () {

      var fn = function () {
        topic.publish();
      };

      expect(fn).to.throw(Error);
    });

    it('should trigger event and pass arguments, like #trigger', function () {

      var callback = sinon.spy();
      var eventName = 'test:argcache';
      var argument = 'string as arg';

      topic.on(eventName, callback);
      topic.publish(eventName, argument);

      expect(callback).to.have.been.calledWith(argument);
    });

    it('should cache arguments', function () {

      var callback = sinon.spy();
      var eventName = 'test:argcache';
      var argument = 'string as arg';

      topic.publish(eventName, argument);
      topic.on(eventName, callback);

      expect(callback).to.have.been.calledWith(argument);
    });

    it('should not overwrite cached arguments', function () {

      var callback = sinon.spy();
      var eventName = 'test:argcache';
      var argument = 'string as arg';

      topic.publish(eventName, argument);
      topic.publish(eventName, 'wrong arg');

      topic.on(eventName, callback);

      expect(callback).to.have.been.calledWith(argument);
    });

    it('should be chainable', function () {

      var newTopic = topic.publish('any:event');

      expect(newTopic.publish).to.be.a('function');
      expect(newTopic).to.equal(topic);
    });
  });

  describe('#unpublish', function () {

    it('should throw error if called without event name(s)', function () {

      var fn = function () {
        topic.unpublish();
      };

      expect(fn).to.throw(Error);
    });

    it('should unpublish arguments', function () {

      var callback = sinon.spy();
      var eventName = 'test:unpub';
      var argument = 'old mcdonald had a field of grass';

      topic.publish(eventName, argument);
      topic.unpublish(eventName);
      topic.on(eventName, callback);

      expect(callback).to.not.have.been.called;
    });

    it('should allow re-publishing of new arguments', function () {

      var callback = sinon.spy();
      var eventName = 'test:unpub';
      var oldArgument = 'old mcdonald had a field of grass';
      var newArgument = 'just something else';

      topic.publish(eventName, oldArgument);
      topic.unpublish(eventName);
      topic.publish(eventName, newArgument);
      topic.on(eventName, callback);

      expect(callback).to.have.been.calledWith(newArgument);
    });

    it('should unpublish multiple events, divided by space', function () {

      var callback = sinon.spy();
      var eventName1 = 'first:event';
      var eventName2 = 'second:event';

      topic.publish(eventName1, eventName1);
      topic.publish(eventName2, eventName2);
      topic.unpublish(eventName1 + ' ' + eventName2);
      topic.on(eventName1, callback);

      expect(callback).to.not.have.been.called;
    });

    it('should be chainable', function () {

      var newTopic = topic.unpublish('any:event');

      expect(newTopic.unpublish).to.be.a('function');
      expect(newTopic).to.equal(topic);
    });
  });

  describe('#unpublishAll', function () {

    it('should unpublish all published events', function () {

      topic.publish('first:event').publish('second:event');
      topic.unpublishAll();

      var callback = sinon.spy();
      topic.on('first:event', callback);
      topic.on('second:event', callback);

      expect(callback).to.not.have.been.called;
    });

    it('should be chainable', function () {

      var newTopic = topic.unpublishAll();

      expect(newTopic.unpublishAll).to.be.a('function');
      expect(newTopic).to.equal(topic);
    });
  });
});
