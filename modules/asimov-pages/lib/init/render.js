var Queue = require('../render/Queue');
var OutputWriter = require('../render/OutputWriter');

module.exports = function (next, asimov) {

  var queue = new Queue();
  var writer = new OutputWriter();

  var collections = [
    asimov.pages
  ];

  collections.forEach(function (collection) {

    collection.on('add change:raw forced:change', queue.add);
    collection.on('add', queue.start);
    collection.on('change:rendered', writer.write);
    collection.on('remove', writer.clear);
  });

  next();
};
