var Klass = require('../../asimov-core').Klass;
var _super = Klass.prototype;

module.exports = Klass.extend({

  'initialize': function () {

    var self = this;
    _super.initialize.apply(self, arguments);

    self.it = self.options.test.it;
  },

  'throwError': function (message, callback) {

    var self = this;

    if (typeof message !== 'string') {
      callback = message;
      message = null;
    }

    var wrapper = function () {
      expect(callback).to.throw(message || Error);
    };

    if (typeof callback !== 'function') {
      wrapper = null;
    }

    self.it('should throw an error', wrapper);
  },

  'notThrowError': function (message, callback) {

    var self = this;

    if (typeof message !== 'string') {
      callback = message;
      message = null;
    }

    var wrapper = function () {
      expect(callback).to.not.throw(message || Error);
    };

    if (typeof callback !== 'function') {
      wrapper = null;
    }

    self.it('should not throw an error', wrapper);
  },

  'loadPage': function () {

    var self = this;

    self.it('should load page and return a 200 OK', function () {
      expect(this.browser.success).to.be.true;
    });
  },

  'containLinkTo': function (url) {

    var self = this;

    self.it('should contain a link to ' + url, function () {
      expect(this.browser.html('a')).to.contain(url + '"');
    });
  }
});