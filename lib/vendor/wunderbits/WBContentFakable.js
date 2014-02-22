define([

  './WBRuntime',

  './helpers/selection',

  './WBView',
  './WBModel',
  './WBExpandableTextareaView',

  './mixins/LinkingViewMixin',
  './mixins/EmailLinkingViewMixin',
  './mixins/UnicodeEmojiViewMixin',

  './helpers/strings',
  'style!WBContentFakable'

], function (
  WBRuntime,
  Selection,
  WBView, WBModel, WBTextarea,
  LinkingViewMixin, EmailLinkingViewMixin, UnicodeEmojiViewMixin,
  Strings,
  contentFakableStyle,
  undefined
) {

  'use strict';

  var $ = WBRuntime.$;
  var _ = WBRuntime._;

  var _super = WBView.prototype;

  return WBView.extend({

    'className': 'content-fakable',

    'styles': [contentFakableStyle],

    'events': function () {

      var events = {
        'click .display-view span': '_onClickWord',
        'keydown .edit-view textarea': '_onEditKeydown',
        'keyup .edit-view textarea': '_debouncedOnEditKeyup',
        'blur .edit-view textarea': '_onEditBlur'
      };

      if (WBRuntime.env.isTouchDevice()) {

        var touchEvents = {
          'ontouchstart .display-view span': '_onClickWord',
          'mousedown .display-view span': '_override',
          'mouseup .display-view span': '_override'
        };

        _.extend({}, events, touchEvents);
      }

      return events;
    },

    '_override': function () {},

    'initialize': function () {

      var self = this;

      self.rendered = new $.Deferred();

      _super.initialize.apply(self, arguments);

      self.model = new WBModel();
      self.bindTo(self.model, 'change:content', self._onUpdateContent);

      LinkingViewMixin.applyTo(self);
      EmailLinkingViewMixin.applyTo(self);
      UnicodeEmojiViewMixin.applyTo(self);

      self.textareaView = self.addSubview(new WBTextarea(self.options));

      // debounced handler for auto saving and rendering
      self._debouncedOnEditKeyup = _.debounce(self._editKeyUpHandler, 1000);
      self._debouncedRenderDisplay = _.debounce(self.renderDisplayView, 10000);
    },

    'render': function (options) {

      // options: {
      //   content: 'My awesome content.',
      //   convertLinks: true,
      //   maxLength: 255,
      //   autoSave: true,
      //   saveOnEnter: false,
      //   showLoading: false,
      //   scrollContainer: el
      // }

      var self = this;
      var content, loadText;

      // kill all zombies!
      self.$el && self.$el.children().remove();

      _super.render.apply(self, arguments);

      self._options =  options || {};
      self._options.context = options.context || self;

      self._options.markupDelay = self._options.markupDelay || 0;

      // sets initial visible state if a scroll container is passed
      self._isVisible = self._options.scrollContainer ? false : true;

      self.model.set({
        'content': self._options.content,
        'maxLength': self._options.maxLength
      }, { 'silent': true });

      content = self.model.attributes.content;
      loadText = !content || !options.showLoading ? _.escape(self.model.attributes.content) : 'Loading ...';

      // I don't think this markup warrants its own template:
      // Styling should be handled by the parent view, WBExpandableTextarea has its own tmpl and style
      self.$el.empty().append('<div class="display-view"/><div class="edit-view hidden"/>');

      self.$('.display-view').empty().append(loadText);
      self.$('.edit-view').empty()[0].appendChild(self.textareaView.render({
        'content': content,
        'maxLength': self.model.attributes.maxLength,
        'spanProccessor': self._markupForDisplay
      }).el);

      // handle marking up links, removing markup, etc.
      // push out of current call stack
      _.defer(function () {

        if (self.destroyed) {
          return;
        }

        if (self._options.scrollContainer) {
          self.scrollCheck();
        }
        else {
          self.renderDisplayView();
        }
      });

      self._isEditing = false;
      self.rendered.resolve();

      return self;
    },

    'renderDisplayView': function () {

      var self = this;

      if (self.destroyed) {
        return;
      }

      var $display = self.$('.display-view');
      var $payload = $('<span/>');

      // render original text
      var text = self.model.attributes.content || '';
      $payload.text(text);

      self.wrapTextNodesInSpan($payload);
      $display.html($payload.html());

      self._isVisible = true;

      $payload.remove();
      $payload = null;

      var $content = self.$('.display-view span');
      if (self._options.convertLinks) {
        self.renderEmails($content);
        self.renderLinks($content);
      }

      self.renderEmoji($content);
    },

    'onDestroy': function () {

      var self = this;

      self.destroySubviews();
    },

    'wrapTextNodesInSpan': function (text) {

      var contents = text.contents().filter(function () {

        return this.nodeType === 3;
      });

      var wrappedText = $.each(contents, function () {

        $(this).wrap('<span>');
      });

      return wrappedText;
    },

    'onRemove': function () {

      var self = this;

      self.model.off('change:content', self._onUpdateContent);

      if (self._options.scrollContainer) {

        $(self._options.scrollContainer).off('scroll');
      }
    },

    // UI event handlers
    'onShowEditMode': function () {

      var self = this;
      var options = self._options || {};

      if (options.disableEdit) {

        return;
      }

      var $edit = self.$('.edit-view');
      var $display = self.$('.display-view');

      if (typeof options.breaker === 'function') {
        if (options.breaker.call(options.context)) {
          return;
        }
      }

      self._isEditing = true;

      $display.addClass('hidden');
      $edit.removeClass('hidden').find('textarea').focus();

      if (typeof options.onShowEdit === 'function') {
        options.onShowEdit.call(options.context);
      }
    },

    '_onHideEditMode': function () {

      var self = this;
      var options = self._options || {};
      var $edit = self.$('.edit-view');
      var $display = self.$('.display-view');

      self._isEditing = false;

      $display.removeClass('hidden');
      $edit.addClass('hidden');

      if (typeof options.onShowDisplay === 'function') {
        options.onShowDisplay.call(options.context);
      }
    },

    '_onEditKeydown': function (e) {

      var self = this;
      var options = self._options;
      // handle keys ent/ret = save, esc = cancel
      if (options.saveOnEnter && e.which === 13) {

        // if shift was pressed, don't do anything
        if (options.multiLine && e.shiftKey) {
          return;
        }

        e.preventDefault();
        self._onHideEditMode();
        self._onSaveChanges();
      }
      else if (e.which === 27) {

        self._onCancelChanges();
      }
    },

    '_onClickWord': function (ev) {

      // calculate the number of chars a clicked view char span corresponds to
      var self = this;
      var options = self._options;

      var targetSpan = $(ev.target).closest('span');

      if ((typeof options.breaker === 'function' && options.breaker.call(options.context)) || options.disableEdit) {
        return;
      }

      var previousLength = targetSpan.prevAll().text().length;
      self.editCursorPosition = (self._getSelectionOffset(targetSpan[0]) || 0) + previousLength;

      self.delay(self._moveCursorToNewPosition, 50);
    },

    '_getSelectionOffset': function (element) {

      var caretOffset = 0;
      var range;

      if (window.getSelection) {

        var selection = window.getSelection();

        if (selection.rangeCount === 0) {

          return;
        }

        range = selection.getRangeAt(0);

        var preCaretRange = range.cloneRange();
        preCaretRange.selectNodeContents(element);
        preCaretRange.setEnd(range.endContainer, range.endOffset);

        caretOffset = preCaretRange.toString().length;
      }
      else if (document.selection && document.selection.type) {

        var textRange = document.selection.createRange();
        var preCaretTextRange = document.body.createTextRange();
        preCaretTextRange.moveToElementText(element);
        preCaretTextRange.setEndPoint('EndToEnd', textRange);
        caretOffset = preCaretTextRange.text.length;
      }

      return caretOffset;
    },

    '_moveCursorToNewPosition': function () {

      var oldTop;
      var self = this;
      var options = self._options || {};

      var $display = self.$('.display-view');
      var $edit = self.$('.edit-view');

      if ((typeof options.breaker === 'function' && options.breaker.call(options.context)) || options.disableEdit) {
        return;
      }

      self._isEditing = true;

      if (options.scrollContainer) {
        oldTop = options.scrollContainer.scrollTop();
      }

      $display.addClass('hidden');
      $edit.removeClass('hidden');

      var textarea = $edit.find('textarea').focus();

      Selection.setCaretToPos(textarea[0], self.editCursorPosition);
      oldTop && options.scrollContainer.scrollTop(oldTop);

      if (typeof options.onShowEdit === 'function') {
        options.onShowEdit.call(options.context);
      }
    },

    '_onEditBlur': function () {

      var self = this;

      self._onHideEditMode();
      self._onSaveChanges();

      self.defer(self.renderDisplayView);
    },

    'scrollCheck': function () {

      var self = this;
      var buffer = 100;
      var $container, $el, containerOffset, containerHeight, elOffset, elHeight, elTop, visible;
      var bottomBound, topBound;

      // no reason to run the calculations if the content is already rendered!
      if (self._isVisible) {

        return;
      }

      $container = $(self._options.scrollContainer);

      if (!$container.length) {
        return;
      }
      
      $el = self.$el;
      containerOffset = $container.position();
      containerHeight = $container.height();
      elOffset = $el.offset();
      elHeight = 0;
      elTop = elOffset.top;
      visible = false;
      bottomBound = containerOffset.top + containerHeight;
      topBound = containerOffset.top;

      if (bottomBound >= elTop - buffer) {

        visible = true;

        if (visible !== self._isVisible && visible === true) {

          self.renderDisplayView();
        }
      }
    },

    // model reactions
    '_onUpdateContent': function () {

      var self = this;
      var $textarea = self.$('textarea');
      var modelContent = self.model.attributes.content;

      if (!self._isEditing && $.trim($textarea.val()) !== modelContent) {

        $textarea.val(modelContent);
        $textarea.text(modelContent);
        self.$('pre').text(modelContent + "\n");
      }

      self.renderDisplayView();
    },

    '_onEditKeyup': function () {

      // skeleton
    },

    // save handlers
    '_editKeyUpHandler': function () {

      var self = this;

      if (self._options.autoSave) {

        self._onSaveChanges();
        // if user leaves the content fakable on edit mode but doesn't type for a while, go a head and render the display mode
        self._debouncedRenderDisplay();
      }
    },

    '_onCancelChanges': function () {

      var self = this;

      self.$('textarea').val(self.model.attributes.content);
      self._onHideEditMode();
    },

    '_onSaveChanges': function () {

      var self = this;
      var content = $.trim(self.$('textarea').val());
      //content = content.replace(/<(?:.|\n)*?>/gm,'');
      content = Strings.emojiTokensToUnicode(content);

      if (content !== self.model.attributes.content) {

        self.model.set('content', content);
      }
    }
  });
});