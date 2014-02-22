(function (target) {

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

  function _itShould (errorFactory) {

    return {

      'throwErrorIf': function (description, error, callback) {

        it('should throw error if ' + description, function() {
          expect(callback).toThrow(error);
        });
      },

      'notThrowErrorIf': function (description, error, callback) {

        it('should not throw error if ' + description, function () {
          expect(callback).not.toThrow(error);
        });
      },

      'typeCheckAttribute': function (attribute, type, callback) {

        var itShould = this;
        var error = errorFactory.typeCheckAttribute(attribute, type);

        itShould.throwErrorIf('no attribute "' + attribute + '" is provided', error, function () {
          callback({});
        });

        itShould.throwErrorIf('provided attribute "' + attribute + '" is not of type "' + type + '"', error, function () {
          var options = {};
          var wrong = {};
          if (type === 'object') {
            wrong = [];
          }
          options[attribute] = wrong;
          callback(options);
        });

        itShould.notThrowErrorIf('provided attribute "' + attribute + '" is of type "' + type + '"', error, function () {
          var options = {};
          options[attribute] = _getFauxContentForType(type);
          callback(options);
        });
      },

      'beSubClassOf': function (modules, topicClassName, superClassName) {

        it('should be subclass of ' + superClassName, function () {
          var Constructor = modules[topicClassName];
          var _super = modules[superClassName];
          if (superClassName.indexOf('.') > -1) {
            superClassName = superClassName.split('.');
            _super = modules[superClassName[0]][superClassName[1]];
          }
          var topic = new Constructor();
          expect(topic instanceof _super).toBeTruthy();
        });
      },

      // 'applyMixin': function (subject, Mixin, description) {

      //   _.each(Mixin.Behavior || Mixin, function (prop, name) {
      //     it('should have mixin method #' + name + ' from ' + description, function () {
      //       expect(_.isFunction(subject[name])).toBeTruthy();
      //     });
      //   });
      // },

      // 'assignEachInstanceUniqueAttribute': function (SubjectClass, idProp, iterations) {

      //   it('should assign each instance unique attribute (' + idProp + ')', function () {

      //     var lastInstance;
      //     for (var i = 0, max = iterations || 10; i < max; i++) {

      //       var instance = new SubjectClass();
      //       expect(instance[idProp]).toBeDefined();
      //       lastInstance && expect(instance[idProp] === lastInstance[idProp]).toBeFalsy();
      //       lastInstance = instance;
      //     }
      //   });
      // },

      'loadFixture': function (fileName) {

        var data = {};
        $.ajax({
          url: '/specs/fixtures/' + fileName + '.json',
          async: false,
          dataType: 'json',
          success: function(response) {
            _.extend(data, response);
          }
        });
        return data;
      }
    };
  }

  if (typeof target.it !== 'function') {
    define(['./errorFactory'], _itShould);
  }
  else {
    target.itShould = _itShould(target.errorFactory);
  }

})(window);

