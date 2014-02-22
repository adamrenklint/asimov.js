define([

  './lib/dependencies',
  './WBSingleton',
  './errorFactory'

], function (dependencies, WBSingleton, errorFactory, undefined) {

  'use strict';

  var _ = dependencies._;

  function _capitalizeFirstLetter (string) {

    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  return WBSingleton.extend({

    'isValidEmail': function(email){
      // this is a strict regex
      // var filter = /^([a-zA-Z0-9_\.\-\+])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/g;
      // this is a much looser expression spaces, newlines, character before an after @ sign etc
      var filter = /^[^\s\n@]*[^\s\n\.@]\@[^\s\n\.@][^\s\n@]*(?=\.[^\s\.\n @]+$)\.[^\s\.\n @]+$/;
      // this weeks out double periods next to each other
      // var filter2 = /(?:\.\.)/;

      return email && filter.test(email);
    },

    'classCheckAttribute': function (hash, attribute, InstanceClass, instanceClassName) {

      if (!hash || !hash[attribute] || !hash[attribute].isInstanceOf || !hash[attribute].isInstanceOf(InstanceClass)) {
        var error = errorFactory.classCheckAttribute(attribute, instanceClassName);
        throw new Error(error);
      }

      return hash[attribute];
    },

    'typeCheckAttribute': function (hash, attribute, type) {

      var types = ['array', 'string', 'number', 'object', 'boolean', 'element', 'function'];

      if (!_.include(types, type) || !hash || !hash[attribute] || !_['is' + _capitalizeFirstLetter(type)](hash[attribute])) {
        var error = errorFactory.typeCheckAttribute(attribute, type);
        throw new Error(error);
      }

      return hash[attribute];
    },

    'isEqual': function (item1, item2) {

      return item1 === item2;
    },

    'isPasswordLengthOk': function (password) {

      return password.length >= 5;
    }
  });
});