/*

  middleware proxy class

  mostly just provide simple access to Middleware
  and a central place to extend all your custom middlewares

*/

define([

  '../../node_modules/asimov.js/lib/server/Middleware'

], function (Middleware) {

  var _super = Middleware.prototype;

  return Middleware.extend();
});