var fs = require('fs');

function countLinesInPath (path) {

  var count = 0;

  if (!fs.existsSync(path)) {
    return count;
  }
  else if (fs.statSync(path).isDirectory()) {
    var files = fs.readdirSync(path);
    files.forEach(function (filePath) {
      count += countLinesInPath(path + '/' + filePath);
    });
  }
  else if (path.match(/\.js$/)) {
    count += countLinesInFile(path);
  }

  return count;
}

function countLinesInFile (path) {
  var file = fs.readFileSync(path).toString();
  return file.split('\n').length;
}

// module.exports = function () {
//   console.log(getLinesInPath(process.cwd() + '/lib'));
// };


var asimov = require('../../index');

// function countLinesInPath (path) {
//   // A function that recursively counts
//   // the lines in all the javascript files
//   // You'll need to figure that part out on your own
// }

module.exports = function () {

  // Some basic setup
  var path = process.cwd() + '/lib';
  var namespace = 'loc';
  var started = new Date();

  // And get the count
  var count = countLinesInPath(path);

  // Log the result, and how long it took to count
  var message = 'Counted ' + count + ' lines in ' + path;
  asimov.logger.since(namespace, message, started);
};
