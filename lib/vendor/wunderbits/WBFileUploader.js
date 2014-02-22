/* global FormData */
define([

  './lib/dependencies',
  './WBClass',
  './helpers/SafeParse'

], function (
  dependencies,
  WBClass,
  SafeParse,
  undefined
) {

  'use strict';

  var _super = WBClass.prototype;
  var _ = dependencies._;

  return WBClass.extend({

    'initialize': function (options) {

      var self = this;
      _super.initialize.apply(self, arguments);
      self.options = options || {};
      self.acceptedFileTypes = options.acceptedFileTypes || '';
      self.uploadURL = options.uploadURL || '';
      self.uploadAction = options.uploadAction || 'POST';
      self.customHeaders = options.customHeaders || '';
      self.fileKey = options.fileKey || 'avatar';
      self.extraParams = options.extraParams;

      self.xhr = new XMLHttpRequest();
      self.setupFormData();
    },

    'isFileTypeAllowed': function (file) {

      var self = this;
      var type = file.type;

      // this is here because chromium did not return mime types on application/json files
      // https://code.google.com/p/chromium/issues/detail?id=323937&thanks=323937&ts=1385565619
      var extension = self.getFileExtension(file);

      if (type === '' && extension) {

        type = 'application/' + extension;
      }

      if (self.acceptedFileTypes.indexOf(type) !== -1 || self.acceptedFileTypes === '') {

        return true;
      }

      return false;
    },

    'getFileExtension': function (file) {

      return file.name.indexOf('.') >= 0 ? file.name.split('.').pop(): false;
    },

    'upload': function (file) {

      var self = this;

      // this is a reminder to save hours of your life: never hard code the
      // Content-Type when sending an Avatar to the API. The boundary gets jacked
      // and you are not going to have a good time.

      self.file = file;
      if (self.isFileTypeAllowed(file)) {

        self.formData.append(self.fileKey, file);

        if (self.extraParams) {
          var params = _.pairs(self.extraParams);
          _.each(params, function (param) {
            self.formData.append(param[0], param[1]);
          });
        }

        self.xhr.open(self.uploadAction, self.uploadURL, true);
        self.customHeaders && self.setupCustomHeaders();
        var uploadProgress;

        self.xhr.upload.addEventListener('progress', function (ev) {

          if (ev.lengthComputable) {

            uploadProgress = (ev.loaded / ev.total * 100 | 0);
            uploadProgress = uploadProgress -= 5;
            self.onProgress(uploadProgress);
          }
        }, false);

        self.xhr.onreadystatechange = function () {
          var state = self.xhr.readyState;
          if (state === 4) {
            var data = SafeParse.json(self.xhr.responseText);
            self.onComplete(data);
          }
        };

        self.xhr.addEventListener('error', function () {
          self.options.onError && typeof self.options.onError === 'function' && self.options.onError();
          self.file = null;
        }, false);

        self.xhr.send(self.formData);
      }
    },

    'setupFormData': function () {

      var self = this;
      self.formData = new FormData();
    },

    'setupCustomHeaders': function () {

      var self = this;

      for (var i in self.customHeaders) {

        // make option
        if (i === 'X-File-Name') {
          self.xhr.setRequestHeader(i, encodeURIComponent(self.file.name));
          continue;
        }
        self.xhr.setRequestHeader(i, self.customHeaders[i]);
      }
    },

    'onProgress': function (progress) {

      var self = this;
      self.options.onProgress(progress);
    },

    'onComplete': function (resp) {

      var self = this;
      self.options.onUploadComplete(resp);
      self.file = null;
    }
  });
});