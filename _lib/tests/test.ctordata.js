module.exports = function Constructor (data) {

  document.getElementById('constructor-data').innerHTML += 'test.constructor was passed ' + JSON.stringify(data) + ', ' + data.deeper.here;
};