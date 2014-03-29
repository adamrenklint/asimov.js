# Changelog

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
