define([

  'requirejs'

], function (requirejs) {

  requirejs.config({
    'paths': {
      'asimov-core': '/node_modules/asimov-framework/node_modules/asimov-core/lib',
      'vendor/wunderbits.core': '/node_modules/asimov-framework/node_modules/asimov-core/vendor/wunderbits.core'
    }
  });
});