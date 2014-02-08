define([

  './lib/dependencies',

  './WBSingleton'

], function (dependencies, WBSingleton) {

  'use strict';

  var $ = dependencies.$;

  return WBSingleton.extend({

    'run': function () {

      var $input = $('<input id="blur-hack" style="opacity:0;margin-top:-5000px;position:absolute;" aria-hidden="true"/>');
      $('body').append($input);
      $input.click().focus().blur().remove();
    }
  });
});