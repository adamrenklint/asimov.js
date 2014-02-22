describe('lib/events', function () {

  'use strict';

  var topic;
  beforeEach(function (done) {
    requirejs([
      'WBClass',
      'lib/events'
    ], function (WBClass, events) {
      topic = new (WBClass.extend(events))();
      done();
    });
  });

  var validationErrors = {
    'trigger': 'Cannot trigger event(s) without event name(s)',
    'events': 'Cannot bind/unbind without valid event name(s)',
    'callback': 'Cannot bind/unbind to an event without valid callback'
  };

  describe('#on', function () {

    it('should throw error if called without event name(s)', function () {

      var fn = function () {
        topic.on();
      };

      fn.should.throw(validationErrors.events);
    });

    it('should throw error if called without callback', function () {

      var fn = function () {
        topic.on('event');
      };

      fn.should.throw(validationErrors.callback);
    });

    it('should subscribe callback to single event', function () {

      var callback = sinon.spy();

      topic.on('any:event', callback);
      topic.trigger('any:event');

      callback.should.have.been.calledOnce;
    });

    it('should subscribe callback to multiple events', function () {

      var callback = sinon.spy();

      topic.on('any:event other:event', callback);

      topic.trigger('any:event');
      callback.should.have.been.calledOnce;

      topic.trigger('other:event');
      callback.should.have.been.calledTwice;
    });

    it('should pass through single argument', function () {

      var foo = 'bar';
      var callback = sinon.spy();

      topic.on('TEST:event:ONCE', callback);
      topic.trigger('TEST:event:ONCE', foo);

      callback.should.have.been.calledWith(foo);
    });

    it('should pass through multiple arguments', function () {

      var foo = 'bar';
      var play = 'work';
      var callback = sinon.spy();

      topic.on('TEST:event:ONCE', callback);
      topic.trigger('TEST:event:ONCE', foo, play);

      callback.should.have.been.calledWith(foo, play);
    });

    it('should be chainable', function () {

      var callback = sinon.spy();
      var newTopic = topic.on('any:event', callback);

      newTopic.on.should.be.a('function');
      newTopic.should.equal(topic);
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

      callback1.should.not.have.been.called;
      callback2.should.not.have.been.called;
    });

    it('should unsubscribe only passed callback from event', function () {

      var callback1 = sinon.spy();
      var callback2 = sinon.spy();

      topic.on('first:event', callback1);
      topic.on('first:event', callback2);
      topic.off('first:event', callback1);
      topic.trigger('first:event');

      callback1.should.not.have.been.called;
      callback2.should.have.been.calledOnce;
    });

    it('should unsubscribe all events if no event name is passed', function () {

      var callback1 = sinon.spy();
      var callback2 = sinon.spy();

      topic.on('first:event', callback1);
      topic.on('first:event', callback2);
      topic.off();
      topic.trigger('first:event');

      callback1.should.not.have.been.called;
      callback2.should.not.have.been.called;
    });

    it('should throw error if with invalid event name', function () {

      var fn1 = function () {
        topic.off({});
      };

      var fn2 = function () {
        topic.off([]);
      };

      fn1.should.throw(validationErrors.events);
      fn2.should.throw(validationErrors.events);
    });

    it('should be chainable', function () {

      var callback = sinon.spy();
      var newTopic = topic.off('any:event', callback);

      newTopic.off.should.be.a('function');
      newTopic.should.equal(topic);
    });
  });

  describe('#once', function () {

    it('should only trigger callback once', function () {

      var callback = sinon.spy();

      topic.once('any:event', callback);
      topic.trigger('any:event');
      topic.trigger('any:event');

      callback.should.have.been.calledOnce;
    });

    it('should trigger callback with correct context', function () {

      var callback = sinon.spy();

      topic.once('any:event', callback);
      topic.trigger('any:event');

      callback.should.have.been.calledOn(topic);
    });

    it('should be chainable', function () {

      var callback = sinon.spy();
      var newTopic = topic.once('any:event', callback);

      newTopic.once.should.be.a('function');
      newTopic.should.equal(topic);
    });

    it('should pass through single argument', function () {

      var foo = 'bar';
      var callback = sinon.spy();

      topic.once('TEST:event:ONCE', callback);
      topic.trigger('TEST:event:ONCE', foo);

      callback.should.have.been.calledWith(foo);
    });

    it('should pass through multiple arguments', function () {

      var foo = 'bar';
      var play = 'work';
      var callback = sinon.spy();

      topic.once('TEST:event:ONCE', callback);
      topic.trigger('TEST:event:ONCE', foo, play);

      callback.should.have.been.calledWith(foo, play);
    });
  });

  describe('#trigger', function () {

    it('should throw error if called without event name(s)', function () {

      var fn = function () {
        topic.trigger();
      };

      fn.should.throw(validationErrors.trigger);
    });

    it('should trigger callback', function () {

      var callback = sinon.spy();

      topic.on('any:event', callback);
      topic.trigger('any:event');
      topic.trigger('any:event');

      callback.should.have.been.calledTwice;
    });

    it('should trigger callback with correct context', function () {

      var callback = sinon.spy();

      topic.on('any:event', callback);
      topic.trigger('any:event');

      callback.should.have.been.calledOn(topic);
    });

    it('should trigger callback of subscribed parent event', function () {

      var callback1 = sinon.spy();
      var callback2 = sinon.spy();

      topic.on('parent', callback1);
      topic.on('parent:child', callback2);
      topic.trigger('parent:child:detail', 'one', 'two');

      callback1.should.have.been.called;
      callback2.should.have.been.called;
    });

    it('should trigger multiple events if multiple eventNames are passed', function () {

      var callback1 = sinon.spy();
      var callback2 = sinon.spy();

      topic.on('one:two', callback1);
      topic.on('three', callback2);
      topic.trigger('three one:two');

      callback1.should.have.been.called;
      callback2.should.have.been.called;
    });

    it('should trigger multiple events up the chain if multiple eventNames are passed', function () {

      var callback1 = sinon.spy();
      var callback2 = sinon.spy();

      topic.on('one:two', callback1);
      topic.on('three', callback2);
      topic.trigger('three:five:eight one:two:any:thing');

      callback1.should.have.been.called;
      callback2.should.have.been.called;
    });

    it('should execute callback with all passed data as arguments', function (done) {

      var data1 = { foo: 'bar' };
      var data2 = { foo: 'baz' };
      var data3 = { foo: 'bam' };

      var callback = function (first, second, third) {

        (JSON.stringify(first)).should.equal(JSON.stringify(data1));
        (JSON.stringify(second)).should.equal(JSON.stringify(data2));
        (JSON.stringify(third)).should.equal(JSON.stringify(data3));

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

        fragments.should.deep.equal(['child', 'detail']);

        (JSON.stringify(d1)).should.equal(JSON.stringify(data1));
        (JSON.stringify(d2)).should.equal(JSON.stringify(data2));
        (JSON.stringify(d3)).should.equal(JSON.stringify(data3));

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

        (JSON.stringify(d1)).should.equal(JSON.stringify(data1));
        (JSON.stringify(d2)).should.equal(JSON.stringify(data2));
        (JSON.stringify(d3)).should.equal(JSON.stringify(data3));

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
      callback.should.have.been.calledWith(argument1);

      topic.trigger(eventName, argument2);
      callback.should.have.been.calledWith(argument2);
    });

    it('should be chainable', function () {

      var newTopic = topic.trigger('any:event');

      newTopic.trigger.should.be.a('function');
      newTopic.should.equal(topic);
    });
  });

  describe('#publish', function () {

    it('should throw error if called without event name(s)', function () {

      var fn = function () {
        topic.publish();
      };

      fn.should.throw(validationErrors.events);
    });

    it('should trigger event and pass arguments, like #trigger', function () {

      var callback = sinon.spy();
      var eventName = 'test:argcache';
      var argument = 'string as arg';

      topic.on(eventName, callback);
      topic.publish(eventName, argument);

      callback.should.have.been.calledWith(argument);
    });

    it('should cache arguments', function () {

      var callback = sinon.spy();
      var eventName = 'test:argcache';
      var argument = 'string as arg';

      topic.publish(eventName, argument);
      topic.on(eventName, callback);

      callback.should.have.been.calledWith(argument);
    });

    it('should not overwrite cached arguments', function () {

      var callback = sinon.spy();
      var eventName = 'test:argcache';
      var argument = 'string as arg';

      topic.publish(eventName, argument);
      topic.publish(eventName, 'wrong arg');

      topic.on(eventName, callback);

      callback.should.have.been.calledWith(argument);
    });

    it('should be chainable', function () {

      var newTopic = topic.publish('any:event');

      newTopic.publish.should.be.a('function');
      newTopic.should.equal(topic);
    });
  });

  describe('#unpublish', function () {

    it('should throw error if called without event name(s)', function () {

      var fn = function () {
        topic.unpublish();
      };

      fn.should.throw(validationErrors.events);
    });

    it('should unpublish arguments', function () {

      var callback = sinon.spy();
      var eventName = 'test:unpub';
      var argument = 'old mcdonald had a field of grass';

      topic.publish(eventName, argument);
      topic.unpublish(eventName);
      topic.on(eventName, callback);

      callback.should.not.have.been.called;
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

      callback.should.have.been.calledWith(newArgument);
    });

    it('should unpublish multiple events, divided by space', function () {

      var callback = sinon.spy();
      var eventName1 = 'first:event';
      var eventName2 = 'second:event';

      topic.publish(eventName1, eventName1);
      topic.publish(eventName2, eventName2);
      topic.unpublish(eventName1 + ' ' + eventName2);
      topic.on(eventName1, callback);

      callback.should.not.have.been.called;
    });

    it('should be chainable', function () {

      var newTopic = topic.unpublish('any:event');

      newTopic.unpublish.should.be.a('function');
      newTopic.should.equal(topic);
    });
  });

  describe('#unpublishAll', function () {

    it('should unpublish all published events', function () {

      topic.publish('first:event').publish('second:event');
      topic.unpublishAll();

      var callback = sinon.spy();
      topic.on('first:event', callback);
      topic.on('second:event', callback);

      callback.should.not.have.been.called;
    });

    it('should be chainable', function () {

      var newTopic = topic.unpublishAll();

      newTopic.unpublishAll.should.be.a('function');
      newTopic.should.equal(topic);
    });
  });
});