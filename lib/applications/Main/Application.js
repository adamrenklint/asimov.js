var Router = require('./Router');

module.exports = function Application () {

  this.router = new Router();
  console.log('Application has been constructed');
};