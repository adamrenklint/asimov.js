define([

  'application/runtime',

  './WBView',

  'template!newsletter'

], function (runtime, WBView, newsletterTemplate) {

  'use strict';

  var _ = runtime._;
  var $ = runtime.$;
  var _super = WBView.prototype;

  return WBView.extend({

    'template': newsletterTemplate,

    'id': 'newsletter-box',

    'className': 'newsletter-box',

    'events': {

      'click .subscribe': 'submitForm'
    },

    'initialize': function () {

      var self = this;
      _super.initialize.apply(self, arguments);
    },

    render: function () {

      var self = this;

      _super.render.apply(self, arguments);

      return self;
    },

    'submitForm': function () {

      var self = this;
      var $submitNewsletter = self.$('#mc-embedded-subscribe');
      var email = self.$('.email').val();

      self.$('.mce_inline_error').text('');

      $.ajax('http://6wunderkinder.us2.list-manage.com/subscribe/post-json?u=ba476a60452a0649997d70cc2&id=3f327b8b05&c=&EMAIL=' + email + '&subscribe=Subscribe', {
        'dataType': 'jsonp',
        'jsonp': 'c'
      }).success(self.success)
        .error(self.error);

      _.delay(function () {

        var error = self.$('.error').text();

        // if we don't have an error, change the button text
        // it will be changed back by the library on success
        if (!error || !self.$('.error').is(':visible')) {

          $submitNewsletter.val(runtime.language.getText("button_sending_subscribe_to_newsletter"));

          _.delay(function () {

            // next error message, coming from server,
            // that's why we wait 3 seconds for it
            var message = self.$('#mce-error-response').text();

            // if there was a message, it means we had a server
            // side error - in which case we reset the button
            if (message) {
              // localize this to the old value
              $submitNewsletter.val(runtime.language.getText("button_subscribe_to_newsletter"));
            }
          }, 3000);
        }
      }, 10);
    },

    'error': function () {

      var self = this;
      self.$('#mc-embedded-subscribe').val(runtime.language.getText("button_subscribe_to_newsletter"));
      self.$('.email').addClass('error');
    },

    'success': function (response) {

      var self = this;

      var fnames = [];
      var ftypes = [];
      fnames[0]='EMAIL';
      ftypes[0]='email';

      if (response.result === 'success') {

        self.$('.response').hide();
        self.$('.email').removeClass('error');
        self.$('.email').val('');
        self.$('#mce-' + response.result + '-response').html(response.msg);
        // instead of showing success message make button greenand change label
        // $('#mce-'+resp.result+'-response').show();
        self.$('#mc-embedded-subscribe').addClass('green').val(runtime.language.getText("button_done"));
        //_gaq.push(['_trackEvent', 'Newsletter', 'Signup', 'Footer Nav']);
        _.delay(function(){
          self.$('#mc-embedded-subscribe').removeClass('green').val('Subscribe');
        },4000);

        self.$('#mc-embedded-subscribe-form').each(function(){
          this.reset();
        });
      }
      else {
        self.$('.email').addClass('error');
        var index = -1;
        var msg;
        try {
          var parts = response.msg.split(' - ',2);
          if (parts[1]===undefined){
            msg = response.msg;
          }
          else {
            var i = parseInt(parts[0], 10);
            if (i.toString() == parts[0]) {
              index = parts[0];
              msg = parts[1];
            }
            else {
              index = -1;
              msg = response.msg;
            }
          }
        }
        catch (e) {
          index = -1;
          msg = response.msg;
        }
        try {
          if (index== -1) {

            self.$('#mce-' + response.result + '-response').show();
            self.$('#mce-' + response.result + '-response').html(msg);
          }
          else {

            var err_id = 'mce_tmp_error_msg';
            var html = '<div id="' + err_id + '"> ' + msg + '</div>';

            var input_id = '#mc_embed_signup';
            var f = $(input_id);
            if (ftypes[index]=='address') {

              input_id = '#mce-'+fnames[index]+'-addr1';
              f = $(input_id).parent().parent().get(0);
            }
            else if (ftypes[index]=='date') {

              input_id = '#mce-'+fnames[index]+'-month';
              f = $(input_id).parent().parent().get(0);
            }
            else {

              input_id = '#mce-'+fnames[index];
              f = $().parent(input_id).get(0);
            }
            if (f) {

              self.$(f).append(html);
              self.$(input_id).focus();
            }
            else {

              self.$('#mce-' + response.result + '-response').show();
              self.$('#mce-' + response.result + '-response').html(msg);
            }
          }
        }
        catch (e) {

          self.$('#mce-' + response.result + '-response').show();
          self.$('#mce-' + response.result + '-response').html(msg);
        }
      }
    }
  });
});