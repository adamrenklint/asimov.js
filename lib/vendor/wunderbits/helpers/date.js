define([

  'vendor/moment',

  '../WBLanguageManager',
  '../WBSingleton'

  // TODO implement language and settings

], function (moment, WBLanguageManager, WBSingleton, undefined) {

  'use strict';

  return WBSingleton.extend({

    'humanizeDueDate': function (date, format, justKey) {

      var now = moment().sod();
      var due = moment(date).sod();
      var diff = now.diff(due, 'days');

      // pass user setting as format string to this function
      var fullDate = format || 'DD.MM.YYYY';
      var key;

      if (diff === 0) {

        key = 'today';
      }
      else if (diff === 1) {

        key = 'yesterday';
      }
      else if (diff === -1) {

        key = 'tomorrow';
      }
      else {

        return moment(date).format(fullDate);
      }

      key = 'label_relative_date_' + key;

      return justKey ? key : WBLanguageManager.getLabel(key).toString();
    },

    'isHumanizeable': function (date) {

      var now = moment().sod();
      var due = moment(date).sod();
      var diff = now.diff(due, 'days');

      if (diff === 0 || diff === 1 || diff === -1) {

        return true;
      }

      return false;
    },

    'humanizeDueIn': function (date) {

      var now = moment();
      var due = moment(date);

      var minutes = due.diff(now, 'minutes');

      return moment.duration(minutes, 'minutes').humanize();
    },

    'isOverdue': function (date) {

      var now = moment().sod().unix();
      var due = moment(date).sod().unix();

      return now > due;
    },

    'now': function (date) {

      date || (date = new Date());

      date.setHours(0);
      date.setMinutes(0);
      date.setSeconds(0);
      date.setMilliseconds(0);

      return Math.floor((date).getTime()/1000);
    },

    'getServerNow': function () {

      var serverTimestamp = moment()
        .add('minutes', moment().zone())
        .format('YYYY-MM-DDTHH:mm:ss');

      return serverTimestamp + 'Z';
    },

    'getServerNowWithMilliseconds': function () {

      var serverTimestamp = moment()
        .add('minutes', moment().zone())
        .format('YYYY-MM-DDTHH:mm:ss.SSS');

      return serverTimestamp + 'Z';
    },

    'convertLocalTimeToServerTime': function (timeStamp) {

      var serverTimestamp = moment(timeStamp)
        .add('minutes', moment(timeStamp, 'YYYY-MM-DDTHH:mm:ss').zone())
        .format('YYYY-MM-DDTHH:mm:ss');

      return serverTimestamp + 'Z';
    },

    'convertServerTimeToLocalTime': function (timeStamp) {

      timeStamp = timeStamp.replace('Z', '');

      var locaTimestamp = moment(timeStamp)
        .subtract('minutes', moment(timeStamp, 'YYYY-MM-DDTHH:mm:ss').zone())
        .format('YYYY-MM-DDTHH:mm:ss');

      return locaTimestamp;
    },

    'convertHourTo24HourTime': function (hour, ampm) {

      // takes hour plus 'am' or 'pm' and returns an hour in 24 hour time 0 - 23

      ampm = ampm ? ampm.toLowerCase() : null;

      var afterNoon = (hour !== 12 && ampm === 'pm');
      // 12:00 AM
      var midnight = hour === 12 && ampm === 'am';
      // we dont need to care about the time between midnight and noon
      // because that time is naturally handled (ex: 3:00am, 11:00am)

      hour = afterNoon ? hour + 12 : midnight ? 0 : hour;

      return hour;
    },

    'convertServerDateToLocalDate': function (date) {

      return date;

      // if (!date) {

      //   return date;
      // }

      // console.log('date in', date);

      // date = moment(date, 'YYYY-MM-DD').sod();

      // var offset = date.zone();
      // console.log('date offset', offset);

      // if (offset > 0 ) {

      //   date.subtract('days', 1);
      // }

      // console.log('date out', date.format('YYYY-MM-DD'))

      // return date.format('YYYY-MM-DD');
    },

    'convertLocalDateToServerDate': function (date) {

      return date;

      // if (!date) {

      //   return date;
      // }

      // date = moment(date, 'YYYY-MM-DD').sod();

      // var offset = date.zone();

      // if (offset > 0) {

      //   date.add('days', 1);
      // }

      // return date.format('YYYY-MM-DD');
    },

    'ISOString': function (date) {

      if(date) {
        !(date instanceof Date) && (date = new Date(date));
      }
      else {
        date = new Date();
      }
      date.setMilliseconds(0);
      return date.toISOString().replace('.000Z', 'Z');
    },

    'getDatesFromNow': function (momentDates, key) {

      var calucalatedDates = {};
      key = key + 'Date';

      calucalatedDates.today = momentDates[key].diff(momentDates.today, 'days') === 0;
      calucalatedDates.yesterday = momentDates[key].diff(momentDates.today, 'days') === -1;
      calucalatedDates.earlier = momentDates[key].diff(momentDates.thisYear) < 0;

      return calucalatedDates;
    }
  });
});