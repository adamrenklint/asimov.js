/*

  page nodes collection class

  knows how to crawl a directory and populate
  a set of set of page node models

*/

define([

  '../core/Collection',
  './PageNode',
  'lodash'

], function (Collection, PageNode, _) {

  var _super = Collection.prototype;

  return Collection.extend({

    'initialize': function (options) {

      var self = this;
      _super.initialize.apply(self, arguments);
    },

    'fetch': function (path) {

      var self = this;
      var deferred = self.deferred();



      return deferred.promise();
    }
  });
});