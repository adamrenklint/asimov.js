define([

  // added back runtime here, this view is app specific
  // should not be part of wunderbits
  'application/runtime',
  './WBViewPresenter',
  './WBModalViewController',

  'template!dialog'

], function (
  runtime,
  WBViewPresenter,
  WBModalViewController,
  dialogTemplate,
  undefined) {

  'use strict';

  var Backbone = runtime.Backbone;
  var _ = runtime._;

  var _super = WBViewPresenter.prototype;

  return WBViewPresenter.extend({

    // need markup before implementing
    // template should not show okay and cancel buttons when set to false
    //template: WBmodalTemplate

    'template': dialogTemplate,

    'className': 'dialog-wrapper',

    'implements': [
      WBModalViewController
    ],

    'emits': {
      'click .close': 'click:close'
    },

    'observes': {
      
      'runtime': {
        'window:resize': 'checkScrolling'
      }
    },

    initialize: function (options) {

      var self = this;
      _super.initialize.apply(self, arguments);

      // model optional at base class level
      // if no model is supplied a data object will be required for render()
      if (!!(options && options.model instanceof Backbone.Model)) {
        self.model = options.model;
      }

      if (options && options.opaque) {
        self.$el.addClass('opaque');
      }

      self.returnFocus = runtime.focus;
    },

    render: function (data) {

      // example data object:
      /*
      var example = {
        'title': 'Most Awesome Dialog!',
        'content': '<div class="html">This modal dialog is the bee\'s knees!</div>',
        'confirm': 'Okay!',
        'cancel': 'Nuh uh!'
      };
      */

      var self = this;
      var modal;

      if (_.isEmpty(data) && self.model instanceof Backbone.Model) {
        data = self.model.toJSON();
      }
      else if (_.isEmpty(data)) {
        throw new Error('Cannot render modal view without data.');
      }

      data.name = self.options.name;
      
      _super.render.call(self, data);

      // compile template
      modal = dialogTemplate(data);

      self.$el.html(modal);

      self.scrollCheckBinding && self.unbindFrom(self.scrollCheckBinding);
      self.scrollCheckBinding = self.bindTo(self.$el.parent(), 'scrollcheck', self.checkScrolling);

      return self;
    },

    'renderUpdatedTitle': function (newTitle) {

      var self = this;
      self.$('h2.title').html(newTitle);
    },

    'addScrolling': function() {

      var self = this;
      self.$('.dialog').addClass('scroll');
    },

    'removeScrolling': function() {

      var self = this;
      self.$el && self.$('.dialog').removeClass('scroll');
    },

    'checkScrolling': function() {

      var self = this;
      var $dialog = self.$el && self.$('.dialog');
      var modalHeight, wrapperHeight;

      if (!$dialog || !self.isVisible()) {
        return;
      }

      // remove scroll before checking heights!
      self.removeScrolling();

      modalHeight = $dialog.height();
      // if the height is null, it means the modal has not yet been in the dom
      // and if it's less than 94 px, only the header and the tabs has rendered yet
      // and if it has the "hidden" class, it has been in the dom, but not anymore
      if (modalHeight < 94 && modalHeight !== null && !self.$el.parent().hasClass('hidden')) {
        $dialog.addClass('invisible');
        _.delay(self.checkScrolling, 500);
      }
      else {

        wrapperHeight = self.$el.height() - 100;
        if (modalHeight > wrapperHeight) {
          self.addScrolling();
        }

        $dialog.removeClass('invisible');
      }
    },

    'isVisible': function () {

      var self = this;
      return self.$el.is(':visible');
    },
  });
});