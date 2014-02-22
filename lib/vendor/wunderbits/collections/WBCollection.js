define([

  '../lib/dependencies',
  '../lib/createUID'

], function (dependencies, createUID, undefined) {

  'use strict';

  var Backbone = dependencies.Backbone;
  var _ = dependencies._;
  var $ = dependencies.$;

  // cache all the collection instances for better memory management
  var allCollectionsMap = {};

  function WBCollection (url, options) {

    if (!(_.isString(url)) || !/(\/[a-z0-9]+)+\/?/.test(url)) {
      throw new Error('Every collections has to have a URL');
    }

    var collectionMap = allCollectionsMap;

    // if the collection exists, use it
    if (collectionMap[url] instanceof WBCollection) {
      return collectionMap[url];
    }
    // else create an instance of a new one
    else {
      Backbone.Collection.call(this, [], options);
      this.url = url;
      collectionMap[url] = this;
      this.trigger('change:url');
    }

    collectionMap = null;
  }

  var CollectionPrototype = Backbone.Collection.prototype;
  _.extend(WBCollection.prototype, CollectionPrototype, {

    '_altIdName': 'online_id',

    '_onAdd': function (model) {

      var self = this;
      var _oid = model.attributes[self._altIdName];
      _oid && (this._byOid[_oid] = model.id);
    },

    '_onRemove': function (model) {

      var self = this;
      var _oid = model.attributes[self._altIdName];
      _oid && (delete this._byOid[_oid]);
    },

    '_onReset': function () {

      var self = this;
      self._byOid = {};
      for (var i=0, len=self.models.length; i<len; i++) {
        self._onAdd(self.models[i]);
      }
    },

    'getIdByAltId': function (oid) {

      return oid && this._byOid[oid];
    },

    'isFull': function () {

      return this.limit ? this.models.length >= this.limit : false;
    },

    'initialize': function (models, options) {

      var self = this;

      self.storeName = self.storeName || options.storeName;
      self.model = self.model || options.model;

      if (!self.storeName) {
        throw new Error('No store defined');
      }

      self.models = [];
      self._byOid = {};

      self.on('add', self._onAdd, self);
      self.on('change:' + self._altIdName, self._onAdd, self);
      self.on('remove', self._onRemove, self);
      self.on('reset', self._onReset, self);

      self.uid = createUID();

      return CollectionPrototype.initialize.apply(self, arguments);
    },

    'hasUrl': function () {

      var self = this;
      var hasUrl = new $.Deferred();

      if (self.url !== undefined) {

        hasUrl.resolve();
      }
      else {

        self.on('change:url', function () {

          (self.url !== undefined) && hasUrl.resolve();
          self.off('change:url');
        });
      }

      return hasUrl.promise();
    },
  });

  // Since WBCollection doesn't extend Backbone collection
  // we have to write an extend method
  function Dummy() {}

  WBCollection.extend = function extend (protoProps) {
    var parent = this;

    var child = function() {
      return parent.apply(this, arguments);
    };

    _.extend(child, parent);

    Dummy.prototype = parent.prototype;
    child.prototype = new Dummy();

    if (protoProps) {
      _.extend(child.prototype, protoProps);
    }

    child.prototype.constructor = child;
    child.__super__ = parent.prototype;

    return child;
  };

  return WBCollection;
});