# Changelog

## 0.17.4

  - **Released Monday April 14th, 2014 @ 1.25pm**
  - Fixed issue with rendered variables not being accessible in template helpers
  - Increased render job timeout to 10 seconds

## 0.17.3

  - **Released Monday April 14th, 2014 @ 11.55am**
  - Fixed issue with wrong path for Browserify executable

## 0.17.2

  - **Released Monday April 14th, 2014 @ 11.30am**
  - Fixed issue with Youtube and Vimeo template helpers crashing because of bad type check

## 0.17.1

  - **Released Monday April 14th, 2014 @ 1am**
  - Fixed critical issue that put render queue into an infinite loop on larger projects

## 0.17.0

  - **Released Monday April 14th, 2014 @ 12am**
  - Simplified how data is passed to template helpers, with breaking changes to existing template helpers using ```self.opts()```, which is removed. Instead you always get params and block callbacks in the function arguments.
  - Fixed issues with the consistency and data available in textfiles and templates, now enforces defaults [#192](https://github.com/adamrenklint/asimov.js/issues/192)
  - ```pages.filter()``` and ```pages.childrenOf()``` now takes an options object, which can be used to filter, sort and slice the results [#175](https://github.com/adamrenklint/asimov.js/issues/175)
  - Define ```options.sortBy``` as an attribute key to sort pages by that attribute
  - Use ```options.reverse``` or ```options.order = "DESC"``` to reverse the order of pages
  - ```options.limit``` and ```options.offset``` also works to slice the array of models
  - All the above options are also available in the ```{{#children}}``` helper, for example using ```{{#children limit=5 offset=10}}```
  - ```{{#pages}}``` block helper will iterate over all your pages, and also takes all the options above
  - Initializers can now also hook in right after a page has been rendered, to modify the rendered content before it's written to the static build folder, by listening to ```post:render:page``` on ```self.mediator``` [#47](https://github.com/adamrenklint/asimov.js/issues/47)
  - Add custom, page specific stylesheets by creating a stylus file in your page folder and including it in the textfile or template with ```{{style "myCustomStyles"}}``` [#189](https://github.com/adamrenklint/asimov.js/issues/189)
  - If any attribute in a textfile is changed, the page is re-rendered and the browser reloaded [#190](https://github.com/adamrenklint/asimov.js/issues/190)
  - Fixed issue with invalidating nested templates, changing a template file now re-renders all pages that uses it; directly, imported or nested in an imported template [#209](https://github.com/adamrenklint/asimov.js/issues/209)
  - The ```{{#children}}```, ```{{#pages}}``` and ```{{#menu}}``` helpers registers the current page as a dependency, using ```helper.registerDependency(parent, child)``` and will re-render if any included resource is changed [#185](https://github.com/adamrenklint/asimov.js/issues/185)
  - When any textfile in ```site/data``` is added, changed or removed, all pages are re-rendered [#19](https://github.com/adamrenklint/asimov.js/issues/19)
  - Define which files should be exported from your project as a npm module with ```config.exportScripts```
  - Generate a code complexity and maintainability report with Plato, using ```ajs complexity [--open]``` [#187](https://github.com/adamrenklint/asimov.js/issues/187)
  - Pages register all template helpers they use as dependencies, and will re-render whenever they change [#191](https://github.com/adamrenklint/asimov.js/issues/191)
  - Changing initializers, middleware or configuration files will restart the entire process [#213](https://github.com/adamrenklint/asimov.js/issues/213)
  - Template handler names are now used camelCased, meaning that your ```lib/helpers/MyCustomHelper``` is used with ```{{#myCustomHelper}}``` [#195](https://github.com/adamrenklint/asimov.js/issues/195)
  - Slimmed down core dependencies: install what's needed, when it's needed [#212](https://github.com/adamrenklint/asimov.js/issues/212)

## 0.16.1

  - **Released Friday April 11th, 2014 @ 8.40am**
  - Fixed a regression in the CollectionEvents initializer, which would prevent templates to be parsed for dependencies to watch for changes
  - Fixed the ```ajs publish``` command, which would always exit after running tests, regardless of test output

## 0.16.0

  - **Released Friday April 11th, 2014 @ 0.30am**
  - The server is now clustered, spawning one worker per cpu [#151](https://github.com/adamrenklint/asimov.js/issues/151)
  - Upgraded to Express 4 [#206](https://github.com/adamrenklint/asimov.js/issues/206)
  - Server workers are caching resolved middleware paths, cuts response times in half
  - LiveReload doesn't use the default port anymore, to avoid conflict with other running servers [#200](https://github.com/adamrenklint/asimov.js/issues/200)
  - Improved throughput calculation, now reports the actual requests per minute in the last minute, not aggregated [#202](https://github.com/adamrenklint/asimov.js/issues/202)
  - Solved performance bottleneck in ```Collection.add()```, which would fire a ```change``` event for each attribute on the added model [#173](https://github.com/adamrenklint/asimov.js/issues/173)
  - Fixed an issue where ```ajs test [grep]``` would always run all tests [#204](https://github.com/adamrenklint/asimov.js/issues/204)
  - ```ajs``` default command is now ```start``` [#201](https://github.com/adamrenklint/asimov.js/issues/201)
  - Improved error message in when an invalid path is passed to the ```{{script}}``` helper [#184](https://github.com/adamrenklint/asimov.js/issues/184)
  - Use any standard mocha reporter with a flag, for example ```ajs test --spec``` or ```--dot```
  - Initializers can hook in right before a page is rendered and modify its attributes, by listening to ```pre:render:page``` on ```self.mediator``` [#193](https://github.com/adamrenklint/asimov.js/issues/193)
  - Default computed page properties are ```isHomepage```, ```isVisible```, ```isNotFoundPage```, ```hasChildren``` and ```childCount``` [#78](https://github.com/adamrenklint/asimov.js/issues/78) [#79](https://github.com/adamrenklint/asimov.js/issues/79) [#81](https://github.com/adamrenklint/asimov.js/issues/81) [#82](https://github.com/adamrenklint/asimov.js/issues/82)

## 0.15.5

  - **Released Tuesday April 8th, 2014 @ 4.50pm**
  - Fixed an issue with images inside the content folder returning 404s because of an incorrect path

## 0.15.4

  - **Released Tuesday April 8th, 2014 @ 2.40pm**
  - The project path is now stripped when logging, for cleaner logs
  - Fixed broken Coverage command exit [#196](https://github.com/adamrenklint/asimov.js/issues/196)
  - Fixed new Command subclasses including an invalid path to its superclass [#197](https://github.com/adamrenklint/asimov.js/issues/197)
  - Added <code>ajs new style [name]</code> instructions to <code>ajs help</code> [#194](https://github.com/adamrenklint/asimov.js/issues/194)
  - Fixed issue where the wrong path for the Browserify executable was used and everything crashes

## 0.15.3

  - **Released Sundary April 6th, 2014 @ 6.30pm**
  - Removed version from *meta generator** tag, a security faux pas
  - Omitting ```[template]``` in ```ajs new page [url] [template]``` now defaults to ```page``` [#179](https://github.com/adamrenklint/asimov.js/issues/179)
  - Server now also reports throughput (requests per minute) every 15 seconds [#181](https://github.com/adamrenklint/asimov.js/issues/181)
  - Expose ```Command``` class for extending the command line interface

## 0.15.2

  - **Released Saturday April 5th, 2014 @ 4.55pm**
  - Fixed issue with default error stylesheet not being namespaced and getting overwritten by project specific stylesheet with the same name

## 0.15.1

  - **Released Saturday April 5th, 2014 @ 4.45pm**
  - Fixed issue in ```ajs publish```, which always published with ```--beta``` flag

## 0.15.0

  - **Released Saturday April 5th, 2014 @ 4.40pm**
  - Install globally with ```npm install -g asimov.js``` to use the new CLI
  - Scaffold a brand new project in seconds with ```ajs create [name]```
  - Start your project with ```ajs start```, which is really just an alias for ```node main.js```
  - Run all tests with ```ajs test```, or just a few matching a string with ```ajs test [grep]```
  - Create a new page with ```ajs new page [url] [template]```, for example ```ajs new page /blog/01-hello-world post```
  - Create a new template in ```/site/templates``` using ```ajs new template [name]```
  - Create a new stylesheet in ```/site/styles``` using ```ajs new style [name]```
  - Extend default classes with ```ajs extend [type] [path]```, where ```[type]``` can be Base, Middleware, Initializer, Helper or Test and ```[path]``` is relative to ```/lib```, without file extension
  - Extend your custom classes with ```ajs new [parent] [path]```, where both ```[parent]``` and ```[path]``` are paths relative to ```/lib```, without file extension
  - Publish project to NPM, create and push git tag with ```ajs publish```
  - Publish beta version with ```ajs publish --beta```, which makes the module installable with ```npm install yourModule@beta```
  - All file model paths are now consistently absolute

## 0.14.7

  - **Released Monday March 31th, 2014 @ 3.50pm**
  - Fixed issue with all page attributes gettings converted to SafeString after rendering value - SafeString will now only be used if the output value contains HTML [#174](https://github.com/adamrenklint/asimov.js/issues/174)

## 0.14.6

  - **Released Monday March 31th, 2014 @ 11.10am**
  - Fixed issue with loading path for browserify binary
  - Changed timeout for initial integration test request to 30 seconds

## 0.14.4, 0.14.5

  - **Released Sunday March 30th, 2014 @ 11.15pm**
  - Fixed critical issue with not respecting process.env.PORT
  - Added ```make publish-beta```, which makes the version installable with ```npm install asimov.js@beta``` - **use a beta version name with a fourth param**, for example ```0.12.4.beta2```

## 0.14.3

  - **Released Sunday March 30th, 2014 @ 10.50pm**
  - Restructured dependencies, everything is available everywhere

## 0.14.2

  - **Released Sunday March 30th, 2014 @ 10.30pm**
  - Fixed dev dependencies attempting to load in production environment

## 0.14.1

  - **Released Sunday March 30th, 2014 @ 10.20pm**
  - Fixed a critical issue with loading the initial config, crashed every time when loaded as npm module

## 0.14.0

  - **Released Sunday March 30th, 2014 @ 10pm**
  - Completely new and much simpler test runner format, without the awkward dependency loader [#169](https://github.com/adamrenklint/asimov.js/issues/169)
  - Use ```make test``` for the dot reporter, ```make test-verbose``` for the spec reporter
  - Test coverage reports with Istanbul with ```make coverage``` [#40](https://github.com/adamrenklint/asimov.js/issues/40)
  - Better initialization of integration test server, without setTimeout [#153](https://github.com/adamrenklint/asimov.js/issues/153)
  - ```.asimov-wrapper``` in ```asimov.base.styl``` is now responsive

## 0.13.5

  - **Released Saturday March 29th, 2014 @ 4.15pm**
  - Don't watch stylesheet dependency if it is located in ```node_modules```

## 0.13.4

  - **Released Saturday March 29th, 2014 @ 4.05pm**
  - Fixed order of loading stylesheets - now you can use the same name as a default framework stylesheet

## 0.13.3

  - **Released Saturday March 29th, 2014 @ 4pm**
  - Fixed order of loading templates - now you can use the same name as a default framework template

## 0.13.2

  - **Released Saturday March 29th, 2014 @ 3.55pm**
  - Removed test scripts from default error pages
  - Fixed framework script paths wrong when installed as npm module

## 0.13.1

  - **Released Saturday March 29th, 2014 @ 3.50pm**
  - Fixed framework templates and styles paths wrong when installed as npm module

## 0.13.0

  - **Released Saturday March 29th, 2014 @ 3.45pm**
  - Automatically reload browser when build folder changes [#62](https://github.com/adamrenklint/asimov.js/issues/62)
  - All client side javascript is now processed with browserify and served minified
  - Removed ```{{bundle}}``` helper, instead use ```{{script :path construct=true}}```
  - Fixed high CPU usage from watching directories [#165](https://github.com/adamrenklint/asimov.js/issues/165)
  - Simple redirects with page.attributes.alias [#45](https://github.com/adamrenklint/asimov.js/issues/45)
  - Better error message when trying to include a non-existing stylesheet [#166](https://github.com/adamrenklint/asimov.js/issues/166)
  - Handle both single and double quoted @import statements [#168](https://github.com/adamrenklint/asimov.js/issues/168)
  - Fixed menu helper not applying active class to active page [#142](https://github.com/adamrenklint/asimov.js/issues/142)
