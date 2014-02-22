define([

  './lib/dependencies',
  './lib/createUID',
  './lib/WBEvents',
  './WBClass'

], function (dependencies, createUID, WBEvents, WBClass, undefined) {

  'use strict';

  var _ = dependencies._;

  var Singleton = WBClass.extend({

    'initialize': function () {

      throw new Error('Cannot create instance of singleton class');
    }
  });

  Singleton.extend = function (staticProps) {

    var singleton = WBClass.extend.call(this, {});

    // apply mixins to the derived class
    staticProps = staticProps || {};
    var mixins = staticProps.mixins || [];
    staticProps.mixins = undefined;

    var mixin;
    while (mixins.length) {
      mixin = mixins.shift();
      if (typeof mixin.applyTo === 'function') {
        mixin.applyTo(singleton);
      }
    }

    // make the singleton extendable
    // Do this after applying mixins,
    // to ensure that no mixin can override `extend` method
    singleton.extend = Singleton.extend;

    // make the singleton an EventEmitter
    _.extend(singleton, WBEvents, staticProps);

    // every signleton gets a UID
    singleton.uid = createUID();

    return singleton;
  };

  _.extend(Singleton, WBEvents);

  return Singleton;
});