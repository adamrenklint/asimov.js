/*

  email template helper class

*/

define([

  '../lib/render/TemplateHelper',
  'lodash'

], function (TemplateHelper, _) {

  var _super = TemplateHelper.prototype;

  return TemplateHelper.extend({

    'run': function (adress) {

      var self = this;
      var options = self.opts(arguments);
      var hash = options.hash;

      adress = _.isString(adress) ? adress : hash.adress;
      delete hash.adress;

      hash.href = 'mailto:' + adress;

      if (hash.subject) {
        hash.href += '?subject=' + encodeURIComponent(hash.subject);
        delete hash.subject;
      }

      if (_.isFunction(options.fn)) {
        hash.html = options.fn(hash);
      }
      else {
        hash.text = hash.text || hash.title || adress;
      }

      hash.title = hash.title || hash.text || adress || _.escape(hash.html);

      return self.html('a', hash);
    }
  });
});