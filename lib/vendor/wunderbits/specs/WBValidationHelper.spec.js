describe('wunderbits/WBValidationHelper', function () {

  'use strict';

  var WBClass, WBValidationHelper, errorFactory, isInstanceOf;

  beforeEach(function (done) {

    requirejs([

      'wunderbits/WBClass',
      'wunderbits/WBValidationHelper',
      'wunderbits/errorFactory',
      'wunderbits/lib/isInstanceOf'

    ], function (WBClassModule, WBValidationHelperModule, ErrorFactoryModule, isInstanceOfFunction) {

      WBClass = WBClassModule;
      WBValidationHelper = WBValidationHelperModule;
      errorFactory = ErrorFactoryModule;
      isInstanceOf = isInstanceOfFunction;
      done();
    });
  });

  function _getFauxContentForType (type) {

    switch (type) {
      case 'string':
        return 'adjlksadklsaj';
      case 'array':
        return ['adas', 'kalsjd', 'lkasjda'];
      case 'number':
        return 718203;
      case 'date':
        return new Date();
      case 'boolean':
        return true;
      case 'function':
        return function () {};
      case 'object':
        return new Object();
      default:
        return {};
    }
  }

  describe('#isEqual', function() {

    it('should return true if the values are equal', function() {

      var value1 = '123';
      var value2 = '123';

      expect(WBValidationHelper.isEqual(value1, value2)).to.be.ok;
    });

    it('should return false if values are not equal', function () {

      var value1 = '123';
      var value2 = 123;

      expect(WBValidationHelper.isEqual(value1, value2)).to.not.be.ok;
    });
  });

  describe('#isPasswordLengthOk', function() {

    it('should return true if the password is at least 5 characters long', function() {

      var password = '12345';

      expect(WBValidationHelper.isPasswordLengthOk(password)).to.be.ok;
    });

    it('should return false if the password is less than 5 characters', function () {

      var password = '1234';

      expect(WBValidationHelper.isPasswordLengthOk(password)).to.not.be.ok;
    });
  });

  describe('#isValidEmail', function() {

    it('should return false if there is no "@" sign', function(){

      var email = 'accountnameAtgmail.com';
      expect(WBValidationHelper.isValidEmail(email)).to.not.be.ok;
    });

    it('should return false if there is no "." character', function(){

      var email = 'accountname@gmailDotcom';
      expect(WBValidationHelper.isValidEmail(email)).to.not.be.ok;
    });

    it('should return false if there is no space between the "@" sign and "." character', function(){

      var email = 'accountname@.com';
      expect(WBValidationHelper.isValidEmail(email)).to.not.be.ok;
    });

    it('should return false if there is no character before the "@"', function(){

      var email = '@gmail.com';
      expect(WBValidationHelper.isValidEmail(email)).to.not.be.ok;
    });

    it('should return true for a valid e-mail adress', function () {

      expect(WBValidationHelper.isValidEmail('adam@6wunderkinder.com')).to.be.ok;
    });
  });

  describe('#typeCheckAttribute', function () {

    var attribute = 'foo';
    var types = ['array', 'string', 'number', 'object', 'boolean', 'function']; 
    //no 'element' type since I can't create a DOM element without access to document object
    var numTypes = types.length;
    var error;

    for(var i = 0; i < numTypes; i++) {

      var type = types[i];
      it('should return the attribute value if attribute is of type "' + type + '"', function () {
        
        var options = {};
        options[attribute] = _getFauxContentForType(type);
        var returned = WBValidationHelper.typeCheckAttribute(options, attribute, type);
        expect(returned).to.equal(options[attribute]);
      });

      for(var j = 0; j < numTypes; j++) {

        if (j===i) {
          continue;
        }

        it('should throw error if the attribute value is not of type "' + type + '"', function () {
          
          var options = {};
          options[attribute] = _getFauxContentForType(types[j]);
          var fn = _.bind(WBValidationHelper.typeCheckAttribute, WBValidationHelper, options, attribute, type);
          error = errorFactory.typeCheckAttribute(attribute, type);
          expect(fn).to.throw(error);
        });
      }
    }
  });
  
  describe('#classCheckAttribute', function () {

    var attribute = 'foo';
    var instanceClassName = 'InstanceClass';
    var superClassName = 'WBClass';
    var WBValidationHelperClassName = 'WBValidationHelper';
    var InstanceClass, error, options;

    beforeEach(function (done) {

      InstanceClass = WBClass.extend({
        'isInstanceOf': isInstanceOf
      });
      options = {};
      options[attribute] = new InstanceClass();
      done();
    });

    it('should return the attribute value if attribute is instance of "' + instanceClassName + '"', function () {
      
      var returned = WBValidationHelper.classCheckAttribute(options, attribute, InstanceClass, instanceClassName);
      expect(returned).to.equal(options[attribute]);
    });

    it('should return the attribute value if attribute is instance of "' + superClassName + '"', function () {
      
      var returned = WBValidationHelper.classCheckAttribute(options, attribute, WBClass, superClassName);
      expect(returned).to.equal(options[attribute]);
    });

    it('should throw error if the attribute value is not an instance of "' + WBValidationHelperClassName + '" or its parent classes', function () {
      
      var fn = _.bind(WBValidationHelper.classCheckAttribute, WBValidationHelper, options, attribute, WBValidationHelper, WBValidationHelperClassName);
      error = errorFactory.classCheckAttribute(attribute, WBValidationHelperClassName);
      expect(fn).to.throw(error);
    });
  });

});