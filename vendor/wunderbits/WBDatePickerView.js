define([

  './WBRuntime',
  'vendor/moment',

  './WBDatePickerModel',
  './WBView',
  './WBBlurHelper',

  'template!WBDatePicker',
  'template!WBDatePickerMonth',

  'style!_datepicker'

], function (WBRuntime, moment, DatePickerModel, WBView, WBBlurHelper, baseTemplate, monthTemplate, datePickerStyle, undefined) {

  'use strict';

  var $ = WBRuntime.$;
  var _ = WBRuntime._;
  var window = WBRuntime.global;

  var _super = WBView.prototype;
  var _monthPad = 3;
  var _blur = WBBlurHelper;

  $.fn.selectOptions = function(value) {

    this.each( function () {

      if (this.nodeName.toLowerCase() !== "select") {

        return;
      }

      // get number of options
      var optionsLength = this.options.length;

      for (var i = 0; i < optionsLength; i++) {

        this.options[i].selected = (this.options[i].value == value);
      }
    });

    this.change();
    return this;
  };

  moment.fn.moveToFirstDayOfMonth = function () {

    return moment([
      this.year(),
      this.month(),
      1
    ]);
  };

  moment.fn.moveToLastDayOfMonth = function () {

    return moment([
      this.year(),
      this.month(),
      this.daysInMonth()
    ]);
  };

  return WBView.extend({

    className: 'datepicker',

    'styles': [datePickerStyle],

    events: {

      'mousedown .showNextMonth': '_cancel',
      'mousedown .showPrevMonth': '_cancel',

      'click .no-date': 'noDate',
      'click .cancel': '_cancelDate',
      'click .showNextMonth': 'showNextMonth',
      'click .showPrevMonth': 'showPrevMonth',
      'click a.day': 'selectDay',
    },

    initialize: function (options) {

      var self = this;
      _super.initialize.apply(self, arguments);

      self.options = options || {};

      if (!self.model) {

        self.model = new DatePickerModel(options);
      }

      self.setStartDay(options.startDay);
      self.monthsRenderedDeferred = new $.Deferred();

      self.debouncedRenderPrev = _.debounce(self.renderPrev, 250);
      self.debouncedRenderNext = _.debounce(self.renderNext, 250);
    },

    setStartDay: function (day) {

      var self = this;

      if (_.isNumber(day)) {

        self.startDay = day;
      }
      else {

        var fromString = self.convertStartDayStringToNumber(day);
        self.startDay = _.isNumber(fromString) ? fromString : 1;
      }
    },

    convertStartDayStringToNumber: function (day) {

      var days = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
      var index = _.indexOf(days, day);
      index = index >= 0 ? index : undefined;

      return index;
    },

    renderMonth: function (date, options) {

      var self = this;
      var data = {
        'date': date.format('MMMM YYYY'),
        'liRel': date.format('YYYY-MM')
      };
      var fragment = monthTemplate(data);
      var appendPrepend = options && options.prepend ? 'prepend' : 'append';
      var monthPrefix = date.format('YYYY-MM-');
      var i, e;

      fragment = $(fragment.replace(/\{\{([a-z]+)\}\}/ig, function (match, token) {

        return data[token] || '';
      }));

      // set up headings to correct start of week setting
      if (self.startDay !== 0) {

        var $header = fragment.find('thead');
        var $headerCells = $header.find('tr th');

        if (self.startDay === 6) {

          $header.find('tr').prepend($headerCells.last());
        }
        else if (self.startDay === 1) {

          $header.find('tr').append($headerCells.first());
        }
      }

      // render days
      var cellCount = 0;
      var advanceCellCount = function () {

        cellCount = (cellCount === 6 ? 0 : cellCount + 1);
      };
      var firstDayOfWeek = date.moveToFirstDayOfMonth().day();
      var startDayOfWeek = self.startDay;
      var $tbody = fragment.find('tbody');
      var $tr;

      // handle empty cells before first day

      if (firstDayOfWeek !== startDayOfWeek) {

        var placeholders;
        if (startDayOfWeek === 0) {

          placeholders = firstDayOfWeek + 0;
        }
        else if (startDayOfWeek === 1) {

          placeholders = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;
        }
        else if (startDayOfWeek === 6) {

          placeholders = firstDayOfWeek + 1;
        }

        for (i = 1, e = placeholders; i <= e; i++) {

          (cellCount === 0) && $tbody.append('<tr/>');

          $tr = $tbody.find('tr').last();
          $tr.append('<td><span class="day">&nbsp;</span></td>');
          advanceCellCount();
        }
      }

      // render dates
      for (i = 1, e = date.moveToLastDayOfMonth().date(); i <= e; i++) {

        (cellCount === 0) && $tbody.append('<tr/>');

        $tr = $tbody.find('tr').last();
        $tr.append('<td><a data-date="' + monthPrefix + i + '" class="day">' + i + '</a></td>');
        advanceCellCount();
      }

      self.$('.months')[appendPrepend](fragment);
    },

    render: function() {

      var self = this;
      var d;


      if (!self.isRendered) {
        _super.render.apply(self, arguments);
        self.$el.html(baseTemplate(self.model.toJSON()));
        for (d = moment().subtract('months', 3); d < moment().add('months', 3); d.add('months', 1)) {
          self.renderMonth(d);
        }
      }

      self.options.hideNoDate && self.$el.find('.no-date').addClass('hidden');
      self.options.hideCancel && self.$el.find('.cancel').addClass('hidden');

      if (self.options.hideCancel && self.options.hideNoDate) {

        self.$el.find('.datepicker-actions').addClass('no-actions');
      }

      self.getDayEl(moment().toDate()).addClass('today');

      self.onChangeDate();

      self.bindTo(self.model, 'change:date', self.onChangeDate);
      self.bindTo(self.model, 'change:interval', self._onChangeRepeats);
      self.bindTo(self.model, 'change:frequency', self._onChangeRepeats);

      // scroll does not work as a backbone event, manual bind here:
      self.scrollBind && self.unbindFrom(self.scrollBind);
      self.scrollBind = self.bindTo(self.$('ol.months'), 'scroll', function (e) {

        self.onScrolled(e);
      });

      self.renderLocalized();
      self.delegateEvents();

      return self;
    },

    setDate: function (date) {

      var self = this;
      if (date === 0) {

        date = null;
      }
      self.model.set({ date: date }, { silent: true });

      return self;
    },

    onChangeDate: function() {

      var self = this;
      var date = self.model.attributes.date;
      var dayEl = self.getDayEl(moment(date));

      self.$('.selected').removeClass('selected');

      if (date && dayEl.length !== 0) {

        date = moment(date).toDate();
        self.getDayEl(date).addClass('selected');
        self._onChangeRepeats();
        $.when(self.monthsRenderedDeferred).then(function() {
          self.scrollToMonth(date);
        });
      }
      else if (date) {

        self.renderDate(moment(date));
      }
      else if (!date) {

        self._onChangeRepeats();

        $.when(self.monthsRenderedDeferred).then(function() {
          self.scrollToMonth(moment().sod().toDate());
        });
      }
    },

    selectDay: function (ev) {

      var self = this;
      var text = $(ev.target).data('date');

      if (self.options.futureOnly) {

        if (moment(text, 'YYYY-MM-D') < moment().sod()) {

          return;
        }
      }
      self.model.parse(text, 'YYYY-MM-D');
    },

    _onChangeRepeats: function () {

      var self = this;
      var format = "YYYY-MM-D";
      var date = self.model.attributes.date;
      var interval = self.model.attributes.interval;
      var frequency = self.model.attributes.frequency;
      var lastDay = self.$el.find('ol.months li:last a:last').data('date');
      var day;

      self.$('a.highlighted').removeClass('highlighted');

      if (interval !== null && frequency !== null && date !== null) {

        for (day = moment(date); day < moment(lastDay, format); day.add(interval, frequency)) {

          self.$('a[data-date="' + day.format(format) + '"]').addClass('highlighted');
        }
      }
      else if (interval === null && frequency === null) {
        self.$('#edit-repeat option').attr('selected', false);
        self.$('#edit-repeat option').first().attr('selected', true);
      }
    },

    noDate: function () {

      var self = this;

      self.model.set({

        'date': null,
        'interval': null,
        'frequency': null,
      });

      _blur.run();
    },

    showNextMonth: function (ev) {

      var self = this;
      var monthEl = $(ev.target).closest('li');

      // safari returns invalid date if date is not appended
      var month = moment(monthEl.data('month') + '-01');
      var nextMonth = moment(month.add('months', 1));

      // if next month does not exist render it
      if (self.getMonthEl(nextMonth).length === 0) {

        self.renderMonth(nextMonth);

        // render some padding
        for (var i = 1; i <= _monthPad; i++) {

          self.renderMonth(month.add('months', 1));
        }
      }

      self._cleanupNodes(nextMonth, 'before');
      self._onChangeRepeats();
      self.scrollToMonth(nextMonth.valueOf(), 150);
    },

    showPrevMonth: function (ev) {

      var self = this;
      var monthEl = $(ev.target).closest('li');

      // safari returns invalid date if date is not appended
      var month = moment(monthEl.data('month') + '-01');
      var prevMonth = moment(month.subtract('months', 1));

      // if next month does not exist render it
      if (self.getMonthEl(prevMonth).length === 0) {

        self.renderMonth(prevMonth, {'prepend': true});

        // render some padding
        for (var i = 1; i <= _monthPad; i++) {

          self.renderMonth(month.subtract('months', 1), {'prepend': true});
        }
      }

      self._cleanupNodes(prevMonth, 'after');
      self._onChangeRepeats();
      self.scrollToMonth(prevMonth.toDate(), 150);
    },

    getDayEl: function (day) {

      var self = this;
      if (!day) {

        return $();
      }
      return self.$('a[data-date="' + moment(day).format('YYYY-MM-D') + '"]');
    },

    getMonthEl: function (month) {

      var self = this;

      if (!month) {
        return $();
      }

      return self.$('li[data-month="' + moment(month).format('YYYY-MM') + '"]');
    },

    renderDate: function (date) {

      var self = this;
      var lastMonth = moment(self.$el.find('ol.months').find('li:last').data('month')).sod();
      var firstMonth = moment(self.$el.find('ol.months').find('li:first').data('month')).sod();
      var thisDay, thisMonth;

      if (!date) {

        return;
      }

      thisDay = moment(date.valueOf());

      // render months including date + padding
      if (date < firstMonth) {

        date = date.subtract('months', _monthPad);

        for (thisMonth = firstMonth.subtract('months', 1); thisMonth >= date; thisMonth.subtract('months', 1)) {

          self.renderMonth(thisMonth, {'prepend': true});
        }

        self._cleanupNodes(thisDay, 'after');
      }
      else if (date > lastMonth) {

        date = date.add('months', _monthPad);

        for (thisMonth = lastMonth.add('months', 1); thisMonth <= date; thisMonth.add('months', 1)) {

          self.renderMonth(thisMonth);
        }

        self._cleanupNodes(thisDay, 'before');
      }

      self._onChangeRepeats();
      self.getDayEl(thisDay.toDate()).addClass('selected');
      $.when(self.monthsRenderedDeferred).then(function() {
        self.scrollToMonth(thisDay.sod().toDate());
      });
    },

    renderPrev: function () {

      var self = this;
      var scrollContainer = self.$('ol.months');
      var oldScrollTop = scrollContainer.scrollTop();
      var $oldFirstMonth = scrollContainer.find('li:first');
      var month = moment($oldFirstMonth.data('month'));
      var oldFirstMonth = moment(month); // need to break reference
      var totalHeightAdded = 0;

      if (!self._rendering) {

        self._rendering = true;

        for (var i = 1; i <= _monthPad; i++) {

          self.renderMonth(month.subtract('months', 1), {'prepend': true});
        }

        self._cleanupNodes(oldFirstMonth, 'after');
        self._onChangeRepeats();
        self.lastScrollToMonth = oldFirstMonth.toDate();

        self.renderLabels();

        $oldFirstMonth.prevAll().each(function () {

          totalHeightAdded += $(this).outerHeight();
        });

        scrollContainer.scrollTop(oldScrollTop + totalHeightAdded); //brings scroll back to where we were
        self._rendering = false;
      }
    },

    renderNext: function () {

      var self = this;
      var month = moment(self.$('ol.months').find('li:last').data('month'));
      var thisMonth = moment(month); // need to break reference

      if (!self._rendering) {

        self._rendering = true;

        for (var i = 1; i <= _monthPad; i++) {

          self.renderMonth(month.add('months', 1));
        }

        self._cleanupNodes(thisMonth, 'before');
        self._onChangeRepeats();
        self.renderLabels();

        self._rendering = false;
      }
    },

    scrollToMonth: function (month, speed) {

      var self = this;
      var scrollContainer = self.$('ol.months');
      var monthEl, distance;

      self.internalScrollTimer && window.clearTimeout(self.internalScrollTimer);
      self.internalScroll = true;

      if (typeof month === "number" && month > 0) {

        month = moment(month).toDate();
      }
      else{

        month = (month instanceof Date) ? month : moment().toDate(); // was month = month || moment().toDate();
      }

      monthEl = self.getMonthEl(month);

      if (!monthEl || monthEl.length === 0) {

        self.internalScroll = false;
        return;
      }

      distance =  monthEl[0].offsetTop;

      self.lastScrollToMonth = month;

      if (speed) {

        scrollContainer.stop().animate({ 'scrollTop': distance }, speed, function () {

          self._updateHeights(monthEl);
          self.internalScrollTimer = window.setTimeout(function () {

            self.internalScroll = false;
          }, 1000);
        });
      }
      else {

        scrollContainer.scrollTop(distance);
        self._updateHeights(monthEl);
        self.internalScrollTimer = window.setTimeout(function () {

          self.internalScroll = false;
        }, 1000);
      }
    },

    _updateHeights: function (monthEl) {

      var self = this;
      var $monthScrollContainer = self.$('ol.months');
      var monthHeight = $(monthEl).height();

      $monthScrollContainer.css('height', monthHeight);

      // IE font rendering/lineheight is smaller, subtract 5 pixels
      if (WBRuntime.env.isIE()) {

        $monthScrollContainer.css({
          'height': (monthHeight - 5) + 'px'
        });
      }
    },

    onScrolled: function () {

      var self = this;
      var scrollContainer = self.$el.find('ol.months');
      var currentScroll = scrollContainer.scrollTop();
      var scrollContainerHeight = scrollContainer[0].scrollHeight;
      var monthHeight = scrollContainer.find('li:first').height();

      if (currentScroll < self._lastScrollTop && currentScroll <= monthHeight) {

        self.debouncedRenderPrev();
      }
      else if (currentScroll > self._lastScrollTop && currentScroll >= scrollContainerHeight - (_monthPad * monthHeight)) {

        self.debouncedRenderNext();
      }

      self._lastScrollTop = scrollContainer.scrollTop();
    },

    _cancel: function (ev) {

      ev.preventDefault();
    },

    _cancelDate: function () {

      // does nothing right now in this view ...

    },

    onDestroy: function () {

      var self = this;

      $(document).off('.' + self.cid);
    },

    _cleanupNodes: function (thisMonth, direction) {

      var self = this;
      var scrollContainer = self.$('ol.months');
      var oldScrollTop = scrollContainer.scrollTop();
      var maxNodes = 24;
      var $months = self.$('ol.months li');
      var nodes = $months.size();
      var $thisMonth = self.$('ol.months li[data-month="' + moment(thisMonth).format('YYYY-MM') + '"]');
      var thisIndex = _.indexOf($months, $thisMonth[0]);
      var i;

      direction = (direction === 'before') ? direction : 'after' ;

      if (direction === 'after' && nodes > maxNodes) {

        i = nodes;

        while (i > thisIndex + maxNodes) {
          $($months[i]).remove();
          $months[i] = null;
          i--;
        }
      }
      else if (nodes > maxNodes) {

        i = 0;
        var totalHeightRemoved = 0;

        while (i < thisIndex - maxNodes) {
          totalHeightRemoved += $($months[i]).outerHeight();
          $($months[i]).remove();
          $months[i] = null;
          i++;
        }

        scrollContainer.scrollTop(oldScrollTop - totalHeightRemoved);
      }
    }
  });
});
