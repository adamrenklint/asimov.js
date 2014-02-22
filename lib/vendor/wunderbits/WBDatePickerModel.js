define([

  './lib/dependencies',
  'vendor/moment',

  './WBModel'

], function (dependencies, moment, WBModel) {

  'use strict';

  var $ = dependencies.$;
  var _ = dependencies._;

  var _repeatPatterns = [];
  var _repeatTypes = { d: "Day", w: "Week", m: "Month", y: "Year" };

  return WBModel.extend({

    defaults: {
      'date': null,
      'interval': null,
      'frequency': null
    },

    initialize: function (options) {

      var self = this;
      self._options = options || {};

      self._settingsModel = self._options.settingsModel;

      self._createSmartPatterns();

      self.on('error', self._onError);
    },

    validate: function (attrs) {

      var self = this;
      var validIntervals = ['days', 'weeks', 'months', 'years'];

      // no loops !
      if (!attrs.date && !self.attributes.date && (attrs.interval || attrs.frequency)) {

        return 'not possible to set repeat data without a date';
      }
      else if ((attrs.date || self.attributes.date) && (!self.attributes.interval || !self.attributes.frequency) && (attrs.interval && !attrs.frequency) || (!attrs.interval && attrs.frequency)) {

        return 'not possible to set repeat data without both attribute pairs present on the model or in the save attrs ' + self._attrsToString(attrs);
      }
      else if (attrs.interval && !_.include(validIntervals, attrs.interval)) {

        return attrs.interval + ' is not a valid value for interval ' + self._attrsToString(attrs);
      }
      else if (attrs.frequency && (!_.isNumber(attrs.frequency) || _.isNaN(attrs.frequency))) {

        return attrs.frequency + ' is not a valid value for frequency ' + self._attrsToString(attrs);

      }else if (_.isNaN(attrs.date)) {

        return attrs.date + ' is not a valid value for date ' + self._attrsToString(attrs);
      }
    },

    _attrsToString: function (attrs) {

      return '{date: ' + attrs.date + ', interval: ' + attrs.interval + ', frequency: ' + attrs.frequency +'}';
    },

    _onError: function (model, e) {

      throw new Error(e);
    },

    parse: function (string, format) {

      var self = this;
      var date = moment(string, format).toDate().getTime();
      date = Math.floor(date);

      if (string.length === 0) {

        return self.set({ 'date': null });
      }

      if (date) {

        self.set({ date: date });
      }
    },

    parseSmartDate: function (string, futureOnly, ignoreRepeats, fromInput) {

      var self = this;
      var date;

      string = $.trim(string);

      if (string.length === 0) {

        return self.set({ 'date': null });
      }

      if (!ignoreRepeats) {
        // try for repeat patterns: every 1 days, etc.
        string = self.processRepeatPatterns(string);
        if (string === '') {

          // empty string is a breaker, we out
          return;
        }
      }

      // try for basic keywords: today, next thursday, etc.
      date = self.processDateKeywords(string);

      // try processing user formatted dates (based on format string setting)
      if (!_.isNumber(date) || _.isNaN(date)) {

        date = self.processUserFormattedDate(string);
      }

      if (date && date > moment().startOf('year').valueOf() && !_.isNaN(date)) {

        if (futureOnly) {

          if (moment(date) < moment().sod()) {

            return;
          }
        }

        self.set({ 'date': date}, {'fromInput': fromInput});
      }
    },

    processUserFormattedDate: function (string) {

      var self = this;
      var format = self._settingsModel.attributes.date_format;
      var separator = format.match(/\W/);
      var userParts = string.split(separator);

      string = $.trim(string);

      if (userParts.length === 3 && string.length >= 8) {

        _.each(userParts, function (val, key) {

          userParts[key] = self._pad(val, 2);
        });

        string = userParts.join(separator);

        if (string.length === format.length) {

          return moment(string, format).valueOf();
        }
      }

      return undefined;
    },

    getRepetitions: function (number) {

      var self = this;
      var dates = [];
      var type = self.attributes.frequency;
      var count = self.attributes.interval;
      var date = self.attributes.date;

      if (!date || !self.repeats()) {

        return dates;
      }

      while (number-- >= 0) {

        date = date.clone();
        date['add' + type + 's'].apply(date, [ count ]);
        dates.push(date);
      }

      return dates;
    },

    processDateKeywords: function (string) {

      var date = moment().sod();
      var daysOfTheWeek = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
      var nextWeek = false;
      var thisDay, today, offset, parts;

      // TODO translate string from international to english (reverse the localization)
      string = string.toLowerCase();
      parts = string.split(' ');

      if (parts[0] === 'next' && _.include(daysOfTheWeek, parts[1])) {

        string = parts[1];
        nextWeek = true;
      }

      // single days of the week
      if (_.include(daysOfTheWeek, string)) {

        thisDay = _.indexOf(daysOfTheWeek, string) + 1;
        today = _.indexOf(daysOfTheWeek, moment().sod().format('dddd').toLowerCase()) + 1;
        offset = thisDay - today;

        // if the day has already occured this week, select the next week's day
        if (offset <= 0) {

          offset += 7;
        }

        // if the next keyword is present and the offset doesn't already push the day to the next week
        if (nextWeek && offset <= (7 - today)) {

          offset += 7;
        }

        date = moment().sod().add('days', offset);
      }
      else {

        /* jshint indent: false */
        switch (string) {

          case 'today':
            break;

          case 'tomorrow':
            date = date.add('days', 1);
            break;

          case 'yesterday':
            date = date.subtract('days', 1);
            break;

          case 'next week':
            date = date.add('weeks', 1);
            break;

          case 'next month':
            date = date.add('months', 1);
            break;

          case 'next year':
            date = date.add('years', 1);
            break;

          default:
            return undefined;
        }
      }

      return date.valueOf();
    },

    processRepeatPatterns: function (string) {

      var self = this;
      var date, interval;

      for (var i = 0; i < _repeatPatterns.length; i ++) {

        string = string.replace(_repeatPatterns[i][0], _repeatPatterns[i][1]);
      }

      string = string.replace(/\/(\d*)(d|w|m|y)\w*/, function (match, count, type) {

        date = self.attributes.date || moment().sod().valueOf();

        if (parseInt(count, 10) === 0 || count === '' || _.isNaN(count)) {

          // not a valid parse
          return;
        }

        if(!_repeatTypes[type]) {

          // not a valid parse
          return;
        }

        interval = _repeatTypes[type].toLowerCase() + 's';

        self.set({
          'date': date,
          'interval': interval,
          'frequency': parseInt(count, 10)
        });
        return '';
      });

      return string;
    },

    repeats: function() {

      var self = this;
      var type = self.attributes.interval;

      return type && (type != 'None');
    },

    _createSmartPatterns: function () {

      var affixes = { 'every (\\d+) $': '$1', 'every $': 1, '$ly': 1, 'bi$ly': 2, 'every other $': 2 };
      var patterns = { 'daily': '/d', 'annually': '/y', 'biweekly': '/2w', 'every (\\w+)day': '/w $1day', 'every other (\\w+)day': '/2w $1day' };
      var t, affix, pattern, replacement;

      for (t in _repeatTypes) {

        for (affix in affixes) {

          pattern = affix.replace('$', _repeatTypes[t]).toLowerCase();
          patterns[pattern] = '/' + affixes[affix] + t;
        }
      }

      for (pattern in patterns) {

        replacement = patterns[pattern];
        pattern = new RegExp(pattern, 'i');
        _repeatPatterns.push([ pattern, replacement ]);
      }
    },

    _pad: function (str, pad) {

      str = String(str);

      while (str.length < pad) {

        str = '0' + str;
      }

      return str;
    }
  });
});