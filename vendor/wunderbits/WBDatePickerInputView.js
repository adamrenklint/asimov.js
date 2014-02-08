define([

  './lib/dependencies',
  'vendor/moment',

  './helpers/keycodes',

  './helpers/date',
  './helpers/selection',

  './WBView'

], function (dependencies, moment, keycodes, DateHelper, Selection, WBView, undefined) {

  'use strict';

  var $ = dependencies.$;
  var _ = dependencies._;

  var _super = WBView.prototype;

  return WBView.extend({

    'tagName': 'input',

    'attributes': {

      'type': 'text'
    },

    'className': 'datepicker-input medium',

    'events': {

      'input': '_debouncedUpdateInput',
      'keydown': '_handleKeydown'
    },

    initialize: function (options) {

      // expects a ref to a settings model with a date_format attribute
      // and a DatePicker model with a date attribute

      var self = this;
      _super.initialize.apply(self, arguments);

      self._options = options || {};

      self.settingsModel = self._options.settingsModel;
      self.datePickerModel = self._options.datePickerModel;

      // model binds
      self.bindTo(self.datePickerModel, 'change:date', self.updateOnChangeModel);

      // debouncers
      self._debouncedUpdateInput = _.debounce(self._updateInput, 50);
    },

    render: function () {

      var self = this;
      var date = self.datePickerModel.attributes.date;
      var formattedDate;

      _super.render.call(self, {});

      if (!date || _.isNaN(date)) {

        self.$el.val(null).attr('data-key-value', null);
      }
      else {

        formattedDate = DateHelper.humanizeDueDate(new Date(date), self.settingsModel.attributes.date_format, true);

        if (formattedDate !== self.$el.val()) {

          self.$el.val(null).attr('data-key-value', formattedDate);
          self.renderPlaceHolders();
        }
      }

      return self;
    },

    'updateOnChangeModel': function (model, change, options) {

      var self = this;

      options = options || {};

      if (!options.fromInput) {
        self.render();
      }
    },

    _updateInput: function () {

      var self = this;
      var string = $.trim(self.$el.val());
      var currentRenderedDate = $.trim(DateHelper.humanizeDueDate(new Date(self.datePickerModel.attributes.date), self.settingsModel.attributes.date_format)).toLowerCase();

      if (string === currentRenderedDate) {
        return;
      }

      self.datePickerModel.parseSmartDate(string, self.options.futureOnly, self.options.noRepeats, true);
    },

    _handleKeydown: function (e) {

      var self = this;

      if (e.which === 37 || e.which === 38 || e.which === 39 || e.which === 40) {

        self._handleDateInputArrows(e);
      }
    },

    _handleDateInputArrows: function (e) {

      // holy vars batman!
      var self = this;
      var date = self.datePickerModel.attributes.date;
      var dateFormat = self.settingsModel.attributes.date_format;
      // var formattedDate = DateHelper.humanizeDueDate(new Date(date), dateFormat);
      var $dateInput = self.$el;
      var yearPos = dateFormat.indexOf('YYYY');
      var monthPos = dateFormat.indexOf('MM');
      var dayPos = dateFormat.indexOf('DD');
      var cursorPos = Selection.getCaretPos($dateInput[0]);
      var newDate;


      if (e.which === keycodes.up || e.which === keycodes.down) {

        e.preventDefault();
      }

      if (!date) {

        return;
      }

      var increment = e.shiftKey ? 5 : 1;

      // handle up and down
      var isHumanizeable = DateHelper.isHumanizeable(new Date(date));
      if (isHumanizeable || (cursorPos >= dayPos && cursorPos <= dayPos + 2)) {

        if (isHumanizeable && (e.which === keycodes.up || e.which === keycodes.down)) {

          cursorPos = 0;
        }

        if (e.which === keycodes.up) {

          newDate = moment(date).add('days', increment);
        }
        else if (e.which === keycodes.down) {

          newDate = moment(date).subtract('days', increment);
        }
      }
      else if (cursorPos >= yearPos && cursorPos <= yearPos + 4) {

        if (e.which === keycodes.up) {

          newDate = moment(date).add('years', increment);
        }
        else if (e.which === keycodes.down) {

          newDate = moment(date).subtract('years', increment);
        }
      }
      else if (cursorPos >= monthPos && cursorPos <= monthPos + 2) {

        if (e.which === keycodes.up) {

          newDate = moment(date).add('months', increment);
        }
        else if (e.which === keycodes.down) {

          newDate = moment(date).subtract('months', increment);
        }
      }

      // handle left and right
      if (cursorPos === $dateInput.val().length && e.which === keycodes.right) {

        newDate = moment(date).add('days', increment);
      }
      else if (cursorPos === 0 && e.which === keycodes.left) {

        newDate = moment(date).subtract('days', increment);
      }

      if (newDate) {

        if (self.options.futureOnly) {

          if (newDate < moment().sod()) {

            return;
          }
        }

        self.datePickerModel.set('date', newDate.valueOf());

        // reset cursor !
        Selection.setCaretToPos($dateInput[0], cursorPos);
      }
    }
  });
});