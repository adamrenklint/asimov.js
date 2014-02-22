define([

  '../lib/dependencies',
  '../WBSingleton'

], function (dependencies, WBSingleton) {

  'use strict';

  var $ = dependencies.$;

  return WBSingleton.extend({

    // set a custom selection
    setSelectionRange: function (input, selectionStart, selectionEnd) {

      var range;

      if (input.setSelectionRange) {

        input.focus();
        input.setSelectionRange(selectionStart, selectionEnd);
      }
      else if (input.createTextRange) {

        range = input.createTextRange();
        range.collapse(true);
        range.moveEnd('character', selectionEnd);
        range.moveStart('character', selectionStart);
        range.select();
      }
    },

    // shortcut for moving cursor to specific point
    setCaretToPos: function (input, pos) {

      var self = this;
      self.setSelectionRange(input, pos, pos);
    },

    // sets caret to start or end, based on where on the input clicked
    setCaretByClick: function (input, el, e) {

      var self = this;
      var setPosition = self.getCaretFromMousePos(input, el, e);

      self.setCaretToPos(input, setPosition);
    },

    // sets caret to start or end, based on where on the input clicked
    getCaretFromMousePos: function (input, el, e) {

      var $input = $(input);
      var $el = $(el);
      var elHeight = $el.height();
      var elY = $el.offset().top;
      var elMiddleY = elY + (elHeight / 2);
      var clickY = e.pageY;
      var setPosition = 0;

      //console.log('elY: ', elY, 'elHeight: ', elHeight, 'elMid: ', elMiddleY, 'rawClick: ', clickY);

      if (clickY > elMiddleY) {

        setPosition = $input.val().length;
      }

      return setPosition;
    },

    // find current caret position
    getCaretPos: function (input) {

      var caretPos, range, bookmark;
      if (input.setSelectionRange) {

        caretPos = input.selectionStart;
      }
      else if (document.selection && document.selection.createRange) {

        range = document.selection.createRange();
        bookmark = range.getBookmark();
        caretPos = bookmark.charCodeAt(2) - 2;
      }

      return caretPos;
    },

    //Source: http://stackoverflow.com/questions/3545018/selected-text-event-trigger-in-javascript
    getSelectedText: function () {

      var text = '';

      if (window.getSelection) {
        text = window.getSelection().toString();

        //Aparently Firefox textarea elements don't always work with getSelection()
        //SEE: http://forums.mozillazine.org/viewtopic.php?f=25&t=2268557
        if (!text && document.activeElement && document.activeElement.value && typeof document.activeElement.value === 'string') {

          var activeEl = document.activeElement;
          text = activeEl.value.substring(activeEl.selectionStart, activeEl.selectionEnd);
        }
      }
      else if (document.getSelection) {
        text = document.getSelection().toString();
      }
      else if (document.selection) {    //IE
        text = document.selection.createRange().text;
      }

      return text;
    }
  });
});