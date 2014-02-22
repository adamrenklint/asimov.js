define([

  './WBRuntime',
  './WBView',

  'style!_popover'

], function (WBRuntime, WBView, popoverStyle, undefined) {

  'use strict';

  var _ = WBRuntime._;
  var $ = WBRuntime.$;
  var Backbone = WBRuntime.Backbone;
  var window = WBRuntime.global;

  var _super = WBView.prototype;

  return WBView.extend({

    'className': 'popover',

    'styles': [popoverStyle],

    //Require a WBView as content and a jquery object as target
    initialize: function (options) {

      var self = this;

      _super.initialize.apply(self, arguments);

      if (!(self.options.content instanceof Backbone.View)) {

        throw new Error('Cannot init class without a Backbone view as content');
      }

      if (!(self.options.target instanceof $)) {

        throw new Error('Cannot init class without a Jquery object as target');
      }

      self.name = options.name;
      self.content = self.options.content;
      self.$target = self.options.target;
      self.ignoredElements = self.options.ignoredElements;
      self._bindPopoverEvents();
      self._bindTargetEvents();
      self.popoverOpened = false;
      self.forceTop = options.forceTop;

      if (options.id) {

        self.id = 'error-handle';
      }

      self.debouncedClose = _.debounce(function (source) {

        self.popoverOpened && self.trigger('popover:close', source);
      }, 500, true);

      self.bindTo(WBRuntime, 'interface:scroll', self.debouncedClose);
    },

    //Creates the dom for show the arrow and apppend on the popover
    //Renders the content view and append to the popover
    //Appends the popover to the body
    //If hover options is set, binds the events related
    renderToDOM: function () {

      var self = this;
      var arrow = $('<div>').addClass('arrow');
      var $selfEl = $(self.el);

      $selfEl.html(arrow);
      $selfEl.append(self.options.prerenderedContent === true ? self.content.el : self.content.render().el);
      $('body').append(self.el);

      if (self.options.hover) {

        self._bindHoverEventsOnPopover();
      }

      return self;
    },

    onDestroy: function () {

      var self = this;

      $(document).unbind('click.' + self.cid);

      self.options = null;
      self.content = null;
      self.$target = null;
    },

    toggleVisible: function () {

      var self = this;

      if (self.popoverOpened) {

        self.trigger('popover:close');
      }
      else {

        self.trigger('popover:open');
      }
    },

    // helper to determine if outside click event is on an element for which we need to ignore
    isEventOnIgnoredElement: function (e) {

      var self = this;
      var onIgnoredElement = false;

      if (!e) {
        return false;
      }

      // ignore optional elements e.g. an input that expects user interaction along with the popover
      _.each(self.ignoredElements, function ($el) {

        if ($(e.target)[0] === $el[0]) {

          onIgnoredElement = true;
        }
      });

      return onIgnoredElement;
    },

    //Binds hover events if the options is set, otherwise use
    //click events as default
    _bindTargetEvents: function () {

      var self = this;

      if (self.options.bindToTarget !== false) {

        if (self.options.hover) {

          self._bindHoverEventsOnTarget();
          return;
        }
        self._bindClickEventsOnTarget();
      }
    },

    //Verify if the click was outside of the popover
    //if true, just trigger the popover close event
    _bindOutsideClick: function () {

      var self = this;

      self.outsideClick = self.bindTo($(document), 'click.' + self.cid, function (e) {

        if (self.destroyed || self.isEventOnIgnoredElement(e)) {

          return;
        }

        // Verify if the click was on the popover itself or in the popver's content
        if (e.target === self.el || $(e.target).parents('.popover').size()) {

          return;
        }

        var options = self.options;
        if (typeof options.onBlur === 'function') {

          options.onBlur.call(options.context);
        }

        self.trigger('popover:close');
      });
    },

    //Sets the toggle behavior,
    //If popover is it open, then close,
    //otherwise open it
    _bindClickEventsOnTarget: function () {

      var self = this;
      // var onIgnoredElement = false;

      self.bindTo(self.$target, 'click', function (e) {

        if (self.isEventOnIgnoredElement(e)) {

          return;
        }

        self.toggleVisible();

        e.stopPropagation();
      });
    },

    _bindHoverEventsOnTarget: function () {

      var self = this;
      var timeOpen, delay; //, timeClose

      //Sets the default delay to 500 on hover event
      delay = self.options.delay || 500;

      self.bindTo(self.$target, 'mouseenter', function () {

        timeOpen = window.setTimeout(function () {
          self.trigger('popover:open');
        }, delay);

        //Prevent a previous mouse leave to trigger the closing event
        window.clearTimeout(self.timeClose);
      });

      self.bindTo(self.$target, 'mouseleave', function () {

        //using self here is needed to set properly the mouseleave on the popover every render
        self.timeClose = window.setTimeout(function () {
          self.trigger('popover:close');
        }, delay);

        //Prevent a previuos mouse enter to trigger the closing event
        window.clearTimeout(timeOpen);
      });
    },

    //Binds the main events to the popover
    _bindPopoverEvents: function () {

      var self = this;

      self.on('popover:open', self._openPopover, self);
      self.on('popover:close', self._closePopover, self);
    },

    //Gets info about the target object (position and size),
    _getTargetInfo: function () {

      var self = this;

      return _.extend(self.$target.offset(), {
        'width': self.$target.outerWidth(),
        'height': self.$target.outerHeight()
      });
    },

    //Calculates the position of the popover
    _setPopoverLocation: function () {

      var self = this;
      var absoluteLocation, position;

      //Distance between the popover and the target
      self.margin = self.options.margin || 20;

      //Gives you the target's size and position
      self.targetInfo = self._getTargetInfo();

      //Gives you the popover dimentions
      self.popoverSize = {
        'width': $(self.el).width(),
        'height':$(self.el).height()
      };

      //Default position
      position = self.options.position || self._getDefaultPosition();
      //Gets the offset value passed in the options
      self.offset = self._getOffset();

      //Gets  the quadrat where the target is
      self.quadrant = self._getQuadrant();

      //Based on the position passed in the options, chooses the proper calculation method
      //These methods calculate the position considering the quadrant where the target is
      //That is necessary to permit the popover to move with the window resizing
      //Defining which css property to use to get the correct absolute positoning

      /* jshint indent: false */
      switch (position) {

        case 'top':
          absoluteLocation = self._getTopPosition();
          break;

        case 'right':
          absoluteLocation = self._getRightPosition();
          break;

        case 'left':
          absoluteLocation = self._getLeftPosition();
          break;

        case 'bottom':
          absoluteLocation = self._getBottomPosition();
          break;

        default:
          absoluteLocation = self.getDefaultLocation();
          break;
      }

      //Sets the css position and adds the position on the the dom
      self.$el
        .css(absoluteLocation)
        .addClass(position);

      //Calculates the arrow position
      self._setArrowLocation(position, self.options.arrowPosition, self.options.arrowOffset);
    },

    _getTopPosition: function () {

      var self = this;
      var position = {};

      if (self.quadrant.vertical === 'top' || self.forceTop) {

        position.top = self.targetInfo.top - self.popoverSize.height - self.margin;
      }
      else {

        position.bottom = $(document).height() - self.targetInfo.top + self.margin;
      }

      if (self.quadrant.horizontal === 'left') {

        position.left = self.targetInfo.left + self.targetInfo.width / 2 - self.popoverSize.width / 2 + self.offset;
      }
      else {

        position.right = $('.main-interface').width() - self.targetInfo.left - self.targetInfo.width / 2 - self.popoverSize.width / 2 - self.offset;
      }

      return position;
    },

    _getRightPosition: function () {

      var self = this;
      var position = {};

      if (self.quadrant.vertical === 'top') {

        position.top = self.targetInfo.top + self.targetInfo.height / 2 - self.popoverSize.height / 2;

        if (position.top < 0) {

          self.offset = position.top - 10;
          position.top -= self.offset;
        }

      }
      else {
        position.bottom = $(document).height() - self.targetInfo.top - self.popoverSize.height / 2 - self.targetInfo.height / 2;

        if (position.bottom < 0) {

          self.offset = (position.bottom - 10) * -1;
          position.bottom += self.offset;
        }
      }

      if (self.quadrant.horizontal === 'left') {

        position.left = self.targetInfo.left + self.targetInfo.width + self.margin;
      }
      else {
        position.right = $('.main-interface').width() - self.targetInfo.left - self.targetInfo.width - self.popoverSize.width - self.margin;
      }

      return position;
    },

    _getBottomPosition: function () {

      var self = this;
      var position = {};

      if (self.quadrant.vertical === 'top') {

        position.top = self.targetInfo.top + self.targetInfo.height + self.margin;
      }
      else {

        position.bottom = $(document).height() - self.targetInfo.top - self.targetInfo.height - self.popoverSize.height - self.margin;
      }

      if (self.quadrant.horizontal === 'left') {

        position.left = self.targetInfo.left + self.targetInfo.width / 2 - self.popoverSize.width / 2 + self.offset;
      }
      else {
        //
        position.right = $('.main-interface').width() - self.targetInfo.left - self.targetInfo.width / 2 - self.popoverSize.width / 2 - self.offset;

      }

      return position;
    },

    _getLeftPosition: function () {

      var self = this;
      var position = {};

      if (self.quadrant.vertical === 'top') {

        position.top = self.targetInfo.top + self.targetInfo.height / 2 - self.popoverSize.height / 2;
        if (position.top < 0) {

          self.offset = position.top - 10;
          position.top -= self.offset;
        }
      }
      else {

        position.bottom = $(document).height() - self.targetInfo.top - self.popoverSize.height / 2 - self.targetInfo.height / 2;
        if (position.bottom < 0) {

          self.offset = (position.bottom - 10) * -1;
          position.bottom += self.offset;
        }
      }

      if (self.quadrant.horizontal === 'left') {

        position.left = self.targetInfo.left - self.popoverSize.width - self.margin;
      }
      else{

        position.right = $('.main-interface').width() - self.targetInfo.left + self.margin;
      }

      return position;
    },

    //Returns the quadrant where the target is.
    //Necessary to calculate correctly the absolute position of popover.
    _getQuadrant: function () {

      var self = this;
      return {

        vertical: self.targetInfo.top > $(document).height() * 0.5 ? 'bottom':'top',
        horizontal: self.targetInfo.left > $(document).width() * 0.5 ? 'right':'left'
      };
    },

    //Chosses the best position according the target's location
    //If the target is on the top half of the window, it will return the bottom position
    //otherwise returns top position.
    _getDefaultPosition: function () {

      var self = this;

      return self.targetInfo.top > $(document).height() * 0.5 ? 'top':'bottom';
    },

    //Define the arrow location considering the offset option
    //Always sets the arrow on the middle of the target element
    _setArrowLocation: function (position, arrowPosition, arrowOffset) {

      var self = this;
      var arrowSize = 12; // Defined on the css
      var $arrow = self.$el.find('.arrow');
      var offset;

      if (position === 'top' || position === 'bottom') {

        if (arrowPosition === 'left') {

          offset = $arrow.outerWidth() + self.offset;
        }
        else if (arrowPosition === 'right') {

          offset = self.popoverSize.width - $arrow.outerWidth() + self.offset;
        }
        else if (arrowPosition === 'center') {

          offset = self.popoverSize.width / 2 + self.offset;
        }
        else {

          offset = self.popoverSize.width / 2;
        }

        $arrow.css('left', (offset + arrowOffset) + 'px');
        $arrow.css('margin-left', - self.offset - arrowSize);
      }
      else{

        offset = self.popoverSize.height / 2;
        $arrow.css('top', (offset + arrowOffset) + 'px');
        $arrow.css('margin-top', + self.offset - arrowSize);
      }
    },

    //Get the offset according with the option passed
    //Uses options.position (string or negative/positive value) to set popover offset
    //Strings for options.position could be 'top', 'right', 'left' or 'bottom'
    _getOffset: function () {

      var self = this;
      var offset = self.options.offset;
      offset = typeof(offset) === 'undefined' ? 0 : _.isFunction(offset) ? offset() : offset;

      if ( typeof(offset) === 'string' ) {

        /* jshint indent: false */
        switch (offset) {
          case 'top':
            offset = self.popoverSize.height /2 - self.targetInfo.height / 2;
            break;

          case 'right':
            offset = self.popoverSize.width /2 - self.targetInfo.width / 2;
            break;

          case 'bottom':
            offset = -(self.popoverSize.height /2 - self.targetInfo.height / 2);
            break;

          case 'left':
            offset = - (self.popoverSize.width /2 - self.targetInfo.width / 2);
            break;
        }
      }

      return offset;
    },

    //Set the flag used on the toggle behavior method
    //Called when the 'popover:open' event is trigged
    _openPopover: function () {

      var self = this;
      var options = self.options;
      var context = options.context;

      // close any popovers left in a open state
      if (options.closeOthers) {
        $('body').click();
      }

      if (typeof options.preventOpen === 'function') {
        if (options.preventOpen.call(context)) {
          return;
        }
      }

      self.popoverOpened = true;
      self.renderToDOM();
      self._bindOutsideClick(self.ignoredElements);
      self._setPopoverLocation();
      self._show();

      if (options.onShow) {
        options.onShow.call(context);
      }
    },

    //Verify if the animation option is set, if true, use the fade animation
    _closePopover: function (options) {

      var self = this;

      // this is hack around an FF scroll bug
      // https://wunderlist.lighthouseapp.com/projects/97517-web/tickets/1718-Firefox-Datepicker-in-Detail-View-flashing#ticket-1718-2
      if ((self.name === 'detail-date' || self.name === 'detail-assign') && options === 'lists') {

        return;
      }

      options || (options = {});
      self.options || (self.options = {});

      self.popoverOpened = false;
      self.outsideClick && self.unbindFrom(self.outsideClick);

      if (self.options.onClose) {
        self.options.onClose.call(self.options.context);
      }

      if (self.options && !self.options.animation) {

        if (options.fadeOut) {
          self.$el.fadeOut(150, function () {
            self._cleanUpAndRemovePopover();
          });
        }
        else {
          self._cleanUpAndRemovePopover();
        }

        return;
      }

      self.$el && self.$el.fadeOut('fast', _.bind(self._cleanUpAndRemovePopover,self));
    },

    //Makes some clean up, then remove the element
    //even removing the element sometimes keeps the properties
    _cleanUpAndRemovePopover: function () {

      var self = this;

      if(!self.destroyed) {

        self.$el.removeClass('top right bottom left');
        self.$el.css({top: '', bottom: '', right: '', left: ''});
        self.$el.remove();
      }
    },

    //Verify the animation option, if true, use the fade animation
    _show: function () {

      var self = this;

      if (!self.options.animation) {

        self.$el.show();
        return;
      }

      self.$el.fadeIn('fast');
    },

    //When the hover option is set, prevent the popover closing
    //when moving the mouse to inside the popover
    _bindHoverEventsOnPopover: function () {

      var self = this;
      self.$el.on({

        mouseenter: _.bind(function () {
          window.clearTimeout(self.timeClose);
        }, self),

        mouseleave: _.bind(function () {
          self.trigger('popover:close');
        }, self)
      });
    }
  });
});