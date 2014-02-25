define([

  'express'

], function (express) {

  var app = express();

  app.get('/', function (req, res) {
    res.send('OK');
  });

  return app;
});