describe('Date Helper', function () {

  'use strict';

  var DateHelper, moment, model;

  beforeEach(function (done) {

    requirejs([

      'vendor/moment',
      'wunderbits/lib/dependencies',
      'wunderbits/helpers/date'

    ], function (_moment, dependencies, dateHelper, undefined) {

      moment = _moment;
      DateHelper = dateHelper;
      model = new dependencies.Backbone.Model();

      done();
    });
  });


  describe('#humanizeDueDate', function () {

    it('should return "Today" when the date is equivilant to today', function () {

      var today = DateHelper.humanizeDueDate(moment().sod());
      today.should.be.equal('<text rel="label_relative_date_today"></text>');
    });

    it('should return "Tomorrow" when the date is equivilant to tomorrow', function () {

      var tomorrow = DateHelper.humanizeDueDate(moment().sod().add('days', 1));
      tomorrow.should.be.equal('<text rel="label_relative_date_tomorrow"></text>');
    });

    it('should return "Yesterday" when the date is equivilant to yesterday', function () {

      var yesterday = DateHelper.humanizeDueDate(moment().sod().subtract('days', 1));
      yesterday.should.be.equal('<text rel="label_relative_date_yesterday"></text>');
    });

    it('should return a DD.MM.YYYY formatted date if not euiv. to today, tomorrow, or yesterday and no format is passed', function () {

      var expected = '31.12.1999';
      var date = DateHelper.humanizeDueDate(moment(expected, 'DD.MM.YYYY').sod());

      date.should.be.equal(expected);
    });

    it('should return a custom formatted date when not equiv. to today, tomorrow or yesterday and a custom format is passed', function () {

      var expected = '01-01/1999';
      var format = 'DD-MM/YYYY';
      var date = DateHelper.humanizeDueDate(moment('01-01/1999', format).sod(), format);

      date.should.be.equal(expected);
    });
  });


  describe('#isHumanizeable', function () {

    it('should return true when the date is equivilant to today', function () {

      var today = moment().sod();
      DateHelper.isHumanizeable(today).should.be.true;
    });

    it('should return true when the date is equivilant to tomorrow', function () {

      var tomorrow = moment().sod().add('days', 1);
      DateHelper.isHumanizeable(tomorrow).should.be.true;
    });

    it('should return true when the date is equivilant to yesterday', function () {

      var yesterday = moment().sod().subtract('days', 1);
      DateHelper.isHumanizeable(yesterday).should.be.true;
    });

    it('should return false when the date is not equivilant to today, tomorrow, or yesterday', function () {

      var date = moment().sod().add('days', 7);
      DateHelper.isHumanizeable(date).should.not.be.true;
    });
  });


  describe('#isOverdue', function () {

    it('should return true when date is in the past', function () {

      var overdueDate = moment().sod().subtract('days', 1);
      DateHelper.isOverdue(overdueDate).should.be.true;
    });

    it('should return false when date is today or the future', function () {

      var date = moment().sod();
      DateHelper.isOverdue(date).should.be.false;
      DateHelper.isOverdue(date.add('days', 23)).should.be.false;
    });
  });


  describe('#convertLocalTimeToServerTime, #convertServerTimeToLocalTime', function () {

    it('should convert timestamp to and from server time', function () {

      // test a full 24 hour clock
      for (var i = 0; i < 24; i++) {

        var hour = i < 10 ? i = '0' + i : i;

        var time = '2012-01-01T' + hour + ':00:00';
        var serverTime = DateHelper.convertLocalTimeToServerTime(time);
        var localTime = DateHelper.convertServerTimeToLocalTime(serverTime);

        time.should.be.equal(localTime);
      }
    });
  });


  describe('#convertHourTo24HourTime', function () {

    it('should convert 12 am to 0', function () {

      DateHelper.convertHourTo24HourTime(12, 'am').should.be.equal(0);
    });

    it('should convert 12 pm to 12', function () {

      DateHelper.convertHourTo24HourTime(12, 'pm').should.be.equal(12);
    });

    it('should convert 0 am to 0', function () {

      DateHelper.convertHourTo24HourTime(0, 'am').should.be.equal(0);
    });

    it('should convert 3 am to 3', function () {

      DateHelper.convertHourTo24HourTime(3, 'am').should.be.equal(3);
    });

    it('should convert 6 pm to 18', function () {

      DateHelper.convertHourTo24HourTime(6, 'pm').should.be.equal(18);
    });
  });


  describe('#getDatesFromNow', function () {

    var calucalatedDates;
    var momentDates;

    describe('given "createdAt" as argument for [key]', function () {

      beforeEach(function () {

        momentDates = {
          'createdAtDate': moment(model.attributes.created_at).startOf('day'),
          'thisYear': moment().startOf('year'),
          'today': moment().startOf('day')
        };

        calucalatedDates = DateHelper.getDatesFromNow(momentDates, 'createdAt');
        model.clear();
      });

      it('should return an object', function () {

        calucalatedDates.should.be.an('object');
      });

      it('should return with the keys "today", "yesterday" and "earlier"', function () {

        calucalatedDates.should.have.keys(['today', 'yesterday', 'earlier']);
      });

      it('should return the today attribute as true if the createdAtDate was today', function () {

        calucalatedDates = DateHelper.getDatesFromNow(momentDates, 'createdAt');
        calucalatedDates.today.should.be.true;
      });

      it('should return the yesterday attribute as true if the createdAtDate was yesterday', function () {

        model.set('created_at', moment().subtract('days', 1).startOf('day'));
        momentDates.createdAtDate = model.attributes.created_at;

        calucalatedDates = DateHelper.getDatesFromNow(momentDates, 'createdAt');
        calucalatedDates.yesterday.should.be.true;
      });

      it('should return the earlier attribute as true if the createdAtDate is from a previous year', function () {

        model.set('created_at', moment().subtract('years', 1));
        momentDates.createdAtDate = model.attributes.created_at;

        calucalatedDates = DateHelper.getDatesFromNow(momentDates, 'createdAt');
        calucalatedDates.earlier.should.be.true;
      });
    });
  });
});