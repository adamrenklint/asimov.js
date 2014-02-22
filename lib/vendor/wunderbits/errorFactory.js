(function () {

  'use strict';

  function _getFauxContentForType (type) {
    /* jshint indent: false */
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
      default:
        return {};
    }
  }

  function _errorFactory () {

    return {

      'classCheckAttribute': function (attribute, className) {
        return 'Attribute "' + attribute + '" must be instance of ' + className;
      },

      'typeCheckAttribute': function (attribute, type) {
        return 'Attribute "' + attribute + '" must be of type "' + type + '"';
      }
    };
  }

  define(_errorFactory);

})(window);