
// public interfaces...

var Asimov = require('./lib/bootstrap/Asimov');
var asimov = module.exports = new Asimov();

// 'Collections',
//       'ServerCluster',
//       'CollectionEvents',
//       'ComputedPageProperties',
//       'PagePostRender',
//       'FetchCollections'

// asimov
//   .use(require('./lib/plugins/initializers'))
//   .use(require('./lib/plugins/processors'))
//   .use(require('./lib/proxies/middleware'));

// console.log(Object.keys(asimov));process.exit();

module.parent || asimov.start();




// /*

//   minimal bootstrap

// */

// // Override env flags
// // process.env.DEBUG = true;
// // process.env.ENV = 'development';

// var options = {};
// module.exports = require('./lib/asimov')(options);

// //if included as module, or executed...