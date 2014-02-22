define([

  '../../../vendor/backbone',
  '../vendor/lodash',
  '../../../vendor/jquery',

  '../Wunderscore'

],function (backbone, lodash, jquery, Wunderscore) {

  'use strict';

  return {
    '$': jquery,
    '_': lodash,
    'Backbone': backbone,
    'w_': Wunderscore
  };
});