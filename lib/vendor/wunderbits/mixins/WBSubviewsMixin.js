define([

  '../lib/dependencies',
  '../WBMixin'

], function (dependencies, WBMixin, undefined) {

  'use strict';

  var Backbone = dependencies.Backbone;
  var _ = dependencies._;
  var $ = dependencies.$;

  function onDestroySelf (self) {

    // if element isn't attached to the view we need to manually
    // take care of cleaning up all the jQuery refs if view was
    // detached, we check if it was reattached to the DOM if not
    // we manually clean up the jquery refs
    self._detached && $.cleanData([self.el]);

    // trigger event for mixins and parents to react to, before unbinding
    self.trigger && self.trigger('destroy');

    // unbind any events that could have been possibly bound to this view
    self.unbind();

    // clean up all stored event bindings
    self.unbindAll && self.unbindAll();

    // clean up all bindings from parent view
    if (self._superView && self._superView.trigger) {
      self._superView.trigger('destroyed:subview', self);
    }

    // call the onDestroy callback to do user defined cleanup
    self.onDestroy && self.onDestroy();

    // delete all properties, except for uid to make
    // sure a destroyed object is not keeping other
    // objects alive by reference
    function killEverything (obj) {

      for (var key in obj) {
        if (key !== 'uid') {
          if (key === 'renderData') {
            killEverything(obj[key]);
          }
          delete obj[key];
        }
      }
    }
    killEverything(self);

    // flag as destroyed, so objects internal methods
    // can optionally check this before execution
    self.destroyed = true;

    return self;
  }

  function clearReferencesToSubviewFromSelf (self, subview) {

    // removes name references
    subview._name && (delete self._namedSubviews[subview._name]);

    // remove the subview from the subviews collection
    self._subviews = _.without(self._subviews, subview);

    return self;
  }

  return WBMixin.extend({

    // adds subview to this view and returns it for further use
    // if passed second optional name parameter adds a subview and
    // stores a reference to that subview on an identity map;
    // names are unique and adding a view with the same name
    // destroys the old view. one can retrieve a nameed view using
    // the `getSubview` method and passing view's name
    addSubview: function (subview, name) {

      var self = this;

      if (!subview || !(subview instanceof Backbone.View)) {
        throw new Error('Cannot add invalid or undefined subview');
      }

      // if subviews collection isn't defined create it,
      //just make sure not to put it on the prototype! :)
      !self._subviews && (self._subviews = []);

      // add reference to superview to create vertical view hierarchy
      subview._superView = self;

      if (self.state && subview.state && !_.isEmpty(subview.state)) {
        subview.parentState = self.state;
      }
      else if (self.state) {
        subview.state = self.state;
      }

      // if it is a named view add the view to the named subviews collection
      if (typeof name !== 'undefined') {

        subview._name = name;

        // if the nameged subviews identity map isn't defined create it,
        // just make sure not to put it on the prototype! :)
        !self._namedSubviews && (self._namedSubviews = {});
        // destroy any existing view of same name
        self._namedSubviews[name] && self.destroySubview(name);

        // push it in
        self._namedSubviews[name] = subview;
      }

      self._subviews.push(subview);

      // this is for trying to figure out what views are growing in size that should not be
      //console.log('add: ', self.$el.context.className || self.cid, subview.cid, self._subviews.length || (self._namedSubviews && self._namedSubviews.length));

      return subview;
    },

    // returns a subview with a given name
    getSubview: function(name) {

      var self = this;
      return self._namedSubviews && self._namedSubviews[name];
    },

    // removes references to and destroys the subview with given name
    destroySubview: function(nameOrView) {

      var self = this;

      var subview = nameOrView instanceof Backbone.View ? nameOrView : self._namedSubviews && self._namedSubviews[nameOrView];

      subview && subview.destroy({'silent': true });
    },

    // removes and destroys all the subviews without removing
    // destroying the view, calls `destroy` on all the subviews
    destroySubviews: function() {

      var self = this;
      if (self._subviews) {
        var subviews = _.clone(self._subviews);
        var subview;
        for (var i = 0, len = subviews.length; i < len; i++) {
          subview = subviews[i];
          subview && !subview.destroyed && subview.destroy();
        }
      }
    },

    // calls `onDestroySelf` with each subview which takes care of triggering
    // the onDestroy for Backbone cleanup and makes sure that all the jQuery
    // event and data references/cache is cleaned up as well
    destroy: function() {

      var self = this;

      if (self.destroyed) {
        return self;
      }

      self._superView && clearReferencesToSubviewFromSelf(self._superView, self);
      self.destroySubviews();

      if (self._claimedElement) {

        self.$el && self.$el.empty();
        $.cleanData([self.el]);
      }
      else {

        self.$el && self.$el.remove();
      }

      onDestroySelf(self, true);
      self = null;

      return self;
    },

    // Maps to jQuery detach method and marks the view as detached
    // it's very important when it comes to memory menagement and
    // helping the garbage collector as all the jquery events and
    // data won't be cleaned up if the superview is destroyed while
    // subview is detached from the DOM structure.
    // Because of that we are marking the the view as detached so
    // later on in the `_onDestroy` method we can manualy call
    // the `cleanData` method to make sure we are not leaving any
    // references to jquery events and data for elements that are
    // never making it back to the DOM.
    // If you know superview is not going to be destroyed any time
    // soon (or at all) or that the view have a small chance of
    // being reattached it's better to play safe and use destroy/destroy
    // and just recreate the view when required
    detach: function() {

      var self = this;

      self._detached = true;
      self.$el.detach();

      return self;
    },

    // maps to jquery cleanData to properly clean up detached view
    cleanData: function() {

      var self = this;

      if (self.el) {

        $.cleanData(self.el.getElementsByTagName("*"));
        $.cleanData([self.el]);
      }
    },

    delegateSubviewsEvents: function () {

      var self = this;

      _.invoke(self._subviews, 'delegateSubviewEvents');
    },

    delegateSubviewEvents: function () {

      var self = this;

      self.delegateSubviewsEvents();
      self.delegateEvents();
    }
  });
});