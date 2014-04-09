var Middleware = require('./Middleware');
var _super = Middleware.prototype;

module.exports = Middleware.extend({

  'use': function (req, res, next) {

    var self = this;

    res.status(404);
    res.sendfile(self.options.outputPath + '/404/index.html');

    self.logger.lowSince(self.namespace, 'Responded with 404 Not Found @ '+ req.host + ':' + self.options.port + req.url, req.started);
  }
});