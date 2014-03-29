var Router = require('./Router');

module.exports = function Application () {

  console.log('I have been constructed!');
  this.router = new Router();
};