define([

  './lib/dependencies',
  './global',

  // don't import and get core dependencies from runtime,
  // since runtime requires this file - circular dependencies
  'vendor/ua-detector',

  './mixins/WBBindableMixin',
  './WBSingleton'

], function (dependencies, global, UADetector, WBBindableMixin, WBSingleton, undefined) {

  'use strict';

  var _ = dependencies._;
  var $ = dependencies.$;

  var _$window = $(global);

  var _context = false;
  var _isAnimationEnabled = false;
  var _envInfo = {};
  var _isTouch;
  var _ieVersion;
  var _webkitSpeech;

  var self = WBSingleton.extend({

    'mixins': [
      WBBindableMixin
    ],

    'init': function () {

      self.on('destroy', self._onDestroy);

      self.bindTo(_$window, 'resize', self._onWindowResize);

      // resize is not a valid event on ipad, use onorientationchange instead
      self.bindTo(_$window, 'onorientationchange', self._onWindowResize);
      self._onWindowResize();

      self._bindConnectionEvents();
      self._gatherEnvInfo(window.navigator, window.document);
      self._isOnline = true;

      _.delay(self._enableAnimations, 1000);

      // add browser class to the body
      var browser = self.getBrowser();
      $('body').addClass(browser);

      return self;
    },

    '_gatherEnvInfo': function (navigator, document) {

      var self = this;

      // TODO: (for aditya)
      // We should respect navigator.doNotTrack
      // We should check browsers without going through the user agent

      // Don't gather user's env info if Do-Not-Track is enabled
      // if(!!navigator.doNotTrack) {
      //   return;
      // }

      var chrome = global.chrome;
      _.extend(_envInfo, {

        'language': navigator.userLanguage || navigator.language || 'en-US',
        'UA': navigator.userAgent, // For extrating browser/platform info
        'platform': navigator.platform, // Faking UA doesn't alter this
        'referer': document.referer || '',
        'OS': UADetector.os.toLowerCase(),
        'browser': UADetector.browser.toLowerCase(),
        'version': UADetector.version,
        'retina': window.devicePixelRatio >= 2,
        'touch': self.isTouchDevice(),
        'chromeApp': !!(chrome && chrome.app && chrome.app.runtime),
        // TODO: find a better way to detect firefox OS.. MozActivity is lazy loaded now
        // (typeof global.MozActivity === 'function' && !!navigator.mozApps)
        'firefoxApp': false
      });
    },

    'getBrowser': function () {

      return UADetector.browser.toLowerCase();
    },

    'getTransitionEndEvent': function () {

      var self = this;
      var transitionEndEvent =  self.isWebkit() ? 'webkitTransitionEnd' : self.isFirefox() ? 'transitionend' : self.isOpera() ? 'oTransitionEnd otransitionend': self.isIE() ? 'transitionend' :'transitionend';
      return transitionEndEvent;
    },

    '_onWindowResize': function () {

      try {

        var context = window.getComputedStyle(document.body,':after').getPropertyValue('content');
        var oldContext = _context || '';

        if (context && (_context !== context)) {

          _context = context;

          self.trigger('change:context', {

            'context': _context,
            'oldContext': oldContext
          });
        }
      }
      catch (e) {

        // suppressing errors
      }
      self._setupSwipeDistance();
      self._enableAnimations();
      self.isTouchDevice();
    },

    '_onDestroy': function () {

      _$window.off('resize', self._onDocumentResize);
    },

    '_setupSwipeDistance': function () {

      var self = this;
      var newSwipevalues = {};
      var oldSwipevalues = $.event.swipe;
      var docWidth = self.getCurrentWidth();

      newSwipevalues.min = 100;
      newSwipevalues.max = docWidth;
      newSwipevalues.delay = 800;

      _.extend(oldSwipevalues, newSwipevalues);
    },

    '_onOnlineConnection': function () {

      if (!self._isOnline) {

        self._isOnline = true;
        self.trigger('online');
      }
    },

    '_onOfflineConnection': function () {

      if (self._isOnline) {

        self._isOnline = false;
        self.trigger('offline');
      }
    },

    '_bindConnectionEvents': function () {

      $(document).ajaxSuccess(self._onOnlineConnection).ajaxError(function (e, xhr) {

        (xhr.status === 0) && self._onOfflineConnection();
      });

      self.bindTo(_$window, 'online', self._onOnlineConnection);
      self.bindTo(_$window, 'offline', self._onOfflineConnection);
    },

    'getCurrentWidth': function () {

      return _$window.width();
    },

    '_enableAnimations': function () {

      var $body = $('body');

      if ((self.isTouchDevice() || self.isPointerEnabled())) {

        _isAnimationEnabled = true;
      }
      else if (_context === 'large' || !self.isTouchDevice()) {

        _isAnimationEnabled = true;
      }
      else {

        _isAnimationEnabled = false;
      }

      if (_isAnimationEnabled) {

        $body.addClass('animate');
        $.fx.off = false;
      }
      else {

        $body.removeClass('animate');
        $.fx.off = true;
      }
    },

    'isAnimationEnabled': function() {

      return _isAnimationEnabled;
    },

    'isOnline': function () {

      return !!self._isOnline;
    },

    'isMicro': function () {

      var self = this;
      if (self.isIE() || self.isFirefox() || self.isOpera()) {

        return _context && /micro/.test(_context);
      }

      return _context === 'micro';
    },

    'isMini': function () {

      var self = this;

      if (self.isIE() || self.isFirefox() || self.isOpera()) {

        return _context && /mini/.test(_context);
      }

      return _context === 'mini';
    },

    'isMedium': function () {

      var self = this;

      if (self.isIE() || self.isFirefox() || self.isOpera()) {

        return _context && /medium/.test(_context);
      }

      return _context === 'medium';
    },

    'isLarge': function () {

      var self = this;
      if (self.isIE() || self.isFirefox() || self.isOpera()) {

        return _context && /large/.test(_context);
      }

      return _context === 'large';
    },

    'isRetina': function () {

      return _envInfo.retina;
    },

    'isOpera': function () {

      return _envInfo.browser === 'opera';
    },

    'isFirefox': function() {

      return _envInfo.browser === 'firefox';
    },

    'isFirefoxApp': function () {

      return _envInfo.firefoxApp;
    },

    'isSafari': function() {

      return _envInfo.browser === 'safari';
    },

    'isChrome': function () {

      return _envInfo.browser === 'chrome';
    },

    'isChromeApp': function () {

      return _envInfo.chromeApp;
    },

    'isPackagedApp': function () {

      return _envInfo.firefoxApp || _envInfo.chromeApp;
    },

    'isIE': function () {

      return !!self.getIEVersion();
    },

    'isIE9': function () {

      var IE = self.isIE();
      return IE && self.getIEVersion() === 9;
    },

    'getIEVersion': function () {

      // cache is your friend!
      if (_ieVersion === undefined) {

        _ieVersion = (function () {

          var v = 3;
          var div = document.createElement('div');
          var all = div.getElementsByTagName('i');

          while ((div.innerHTML = '<!--[if gt IE ' + (++v) + ']><i></i><![endif]-->') && all[0]) {

            // ha ha this is some convulted shit right here!
          }

          return v > 4 ? v : false;
        }());
      }

      // IE 10 check
      if (_ieVersion === false) {

        _ieVersion = _envInfo.browser === 'explorer' ? 10 : false;
      }

      // IE 11 check
      if (_ieVersion === false && _envInfo.OS === 'windows' && /Trident/.test(_envInfo.UA)) {

        _ieVersion = _envInfo.version;
      }

      return _ieVersion;
    },

    'isWindows': function () {

      return _envInfo.OS === 'windows';
    },

    'isMac': function () {

      return _envInfo.OS === 'mac';
    },

    'isChromeOS': function () {

      return (/cros/i).test(window.navigator.userAgent);
    },

    'isArmProcessor': function () {

      return (/armv/i).test(window.navigator.userAgent);
    },

    'hasTouchEvents': function () {

      return (('ontouchstart' in window) || (window.DocumentTouch && document instanceof window.DocumentTouch) || window.navigator.msMaxTouchPoints);
    },

    'disableAsTouchDevice': function () {

      _isTouch = false;
      _envInfo.isTouchDevice = _isTouch;

      $('body').toggleClass('touch', _isTouch);
    },

    'enabledAsTouchDevice': function () {

      var self = this;

      _isTouch = true;
      _envInfo.isTouchDevice = _isTouch;

      $('body').toggleClass('touch', self.isChromeOS() ? false : _isTouch);
    },

    'isTouchDevice': function () {

      var self = this;

      if (_isTouch === undefined) {

        if ((('ontouchstart' in window) || (window.DocumentTouch && document instanceof window.DocumentTouch) || window.navigator.msMaxTouchPoints)) {

          _isTouch = true;
        }
        else {

          _isTouch = false;
        }

        _envInfo.isTouchDevice = _isTouch;

        $('body').toggleClass('touch', self.isChromeOS() ? false : _isTouch);
      }

      return _isTouch;
    },

    'getEnvIdentifier': function () {

      var self = this;
      return (self.isChromeOS() ? 'chromeos': _envInfo.OS) + '_' + _envInfo.browser + '_touch';
    },

    'isWebkit': function () {

      return $.browser.webkit;
    },

    'isWebkitSpeechEnabled': function (){

      if (_webkitSpeech === undefined) {

        _webkitSpeech = document.createElement("input").webkitSpeech !== undefined;
      }

      return _webkitSpeech;
    },

    // pointer events are Microsoft's gift from hell. the need special logic
    'isPointerEnabled': function () {

      self.isPointerDevice = window.navigator.msPointerEnabled !== undefined && window.navigator.msMaxTouchPoints > 0 ? true: false;

      return self.isPointerDevice;
    },

    'getContext': function () {

      var self = this;

      if (!_context || _context === 'none') {

        self._onWindowResize();
      }

      return _context;
    },

    'getEnvInfo': function() {
      // return a copy of the env info
      return _.clone(_envInfo);
    },

    'relevantExtensionLink': function () {

      var self = this;
      if (self.isSafari()) {
        return 'http://wunderlist2-static.s3.amazonaws.com/extensions/add-to-wunderlist.safariextz';
      }
      if (self.isFirefox()) {
        return 'https://addons.mozilla.org/en-us/firefox/addon/add-to-wunderlist/';
      }
      if (self.isChrome()) {
        return 'https://chrome.google.com/webstore/detail/add-to-wunderlist/dmnddeddcgdllibmaodanoonljfdmooc?hl=en';
      }
      return false;
    }
  });

  return self;
});