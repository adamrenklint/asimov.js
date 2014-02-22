define([

  './lib/dependencies',

  './WBView',
  './WBModel',

  './helpers/selection',

  'template!WBExpandableTextarea',
  'style!WBExpandableTextarea'

], function (dependencies, WBView, WBModel, Selection, template, expandableTextareaStyle, undefined) {

  'use strict';

  var _ = dependencies._;
  var w_ = dependencies.w_;
  var _super = WBView.prototype;

  return WBView.extend({

    'template': template,

    'styles': [expandableTextareaStyle],

    'className': 'expandingArea active',

    'events': {

      'click': '_onClick',
      'input textarea': '_onInput',
      'keydown textarea': '_onKeyDown'
    },

    'initialize': function (options) {

      var self = this;

      _super.initialize.apply(self, arguments);

      self.model = new WBModel();

      self._options = options || {};
    },

    'render': function (options) {

      var self = this;

      var json = self.model.toJSON();

      self._options = w_.merge(self._options, options || {});
      self._options.lineHeight = parseInt(self._options.lineHeight, 10) || 26;
      self._options.fontSize = parseInt(self._options.fontSize, 10) || 13;

      // defined options: className, content
      _.each(options, function (value, key) {

        json[key] = value;
      });

      _super.render.call(self, json);

      self.$('textarea, pre').css({
        'line-height': self._options.lineHeight + 'px',
        'font-size': self._options.fontSize + 'px'
      });

      var $textarea = self.$('textarea');

      if (self._options.placeholderKey) {
        $textarea.attr('data-key-placeholder', self._options.placeholderKey);
        $textarea.attr('data-key-aria-label', self._options.placeholderKey);
      }

      // copy text into span
      self.$('span').text(self.$('textarea').val());

      self.renderLocalized();

      return self;
    },

    'setEnabled': function (state) {

      var self = this;
      self.setContent('');
      self.$el.attr('disabled', !!!state).toggleClass('disabled', !!!state);
    },

    'setContent': function (content) {

      var self = this;
      self.$('span').text(content);
      self.$('textarea').val(content);

      self._onInput();
    },

    onDestroy: function () {

    },

    _onClick: function (e) {

      e.stopPropagation();
      //return false;
    },

    '_onKeyDown': function (e) {

      var self = this;
      var options = self._options || {};
      var $textarea = self.$('textarea');
      var text = $textarea.val();
      var notAllowed = [13, 27, 8, 38, 40, 37, 39];
      var allwaysAllowed = [46];

      if (!options.maxLength) {

        return;
      }
      else if (_.include(allwaysAllowed, e.which)) {
        // allways allowed do nothing or something later on ...
      }
      else if (!e.metaKey && !_.include(notAllowed, e.which) && text.length >= options.maxLength) {

        e.preventDefault();
      }
    },

    _onInput: function () {

      var self = this;
      var $pre = self.$('pre');
      var $textarea = self.$('textarea');
      var text = $textarea.val();
      var html;

      if (self._options && self._options.maxLength && text.length >= self._options.maxLength) {

        text = text.substr(0, self._options.maxLength);
      }

      if ($textarea.val() !== text) {

        var pos = $textarea[0].selectionStart;
        $textarea.val(text);
        Selection.setCaretToPos($textarea[0], pos);
      }

      if (self._options && typeof self._options.spanProcessor === 'function') {

        html = self._options.spanProcessor(_.escape(text));
      }
      else {

        html = _.escape(text);
      }

      $pre.html(html + "\n");
    }
  });
});