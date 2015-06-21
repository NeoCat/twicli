/*
 * Copyright (c) 2014 Alex Gibson
 * Released under the MIT license
 * https://github.com/alexgibson/notify.js
 */

(function(global, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD environment
    define(function() {
      return factory(global, global.document);
    });
  } else if (typeof module !== 'undefined' && module.exports) {
    // CommonJS environment
    module.exports = factory(global, global.document);
  } else {
    // Browser environment
    global.Notify = factory(global, global.document);
  }
} (typeof window !== 'undefined' ? window : this, function (w, d) {

  'use strict';

  function isFunction (item) {
    return typeof item === 'function';
  }

  function Notify(title, options) {

    if (typeof title !== 'string') {
      throw new Error('Notify(): first arg (title) must be a string.');
    }

    this.title = title;

    this.options = {
      icon: '',
      body: '',
      tag: '',
      notifyShow: null,
      notifyClose: null,
      notifyClick: null,
      notifyError: null,
      timeout: null
    };

    this.permission = null;

    if (!Notify.isSupported) {
      return;
    }

    //User defined options for notification content
    if (typeof options === 'object') {

      for (var i in options) {
        if (options.hasOwnProperty(i)) {
          this.options[i] = options[i];
        }
      }

      //callback when notification is displayed
      if (isFunction(this.options.notifyShow)) {
        this.onShowCallback = this.options.notifyShow;
      }

      //callback when notification is closed
      if (isFunction(this.options.notifyClose)) {
        this.onCloseCallback = this.options.notifyClose;
      }

      //callback when notification is clicked
      if (isFunction(this.options.notifyClick)) {
        this.onClickCallback = this.options.notifyClick;
      }

      //callback when notification throws error
      if (isFunction(this.options.notifyError)) {
        this.onErrorCallback = this.options.notifyError;
      }
    }
  }

  // true if the browser supports HTML5 Notification
  Notify.isSupported = 'Notification' in w;

  // true if the permission is not granted
  Notify.needsPermission = !(Notify.isSupported && Notification.permission === 'granted');

  // returns current permission level ('granted', 'default', 'denied' or null)
  Notify.permissionLevel = (Notify.isSupported ? Notification.permission : null);

  // asks the user for permission to display notifications.  Then calls the callback functions is supplied.
  Notify.requestPermission = function (onPermissionGrantedCallback, onPermissionDeniedCallback) {
    if (!Notify.isSupported) {
      return;
    }
    w.Notification.requestPermission(function (perm) {
      switch (perm) {
        case 'granted':
          Notify.needsPermission = false;
          if (isFunction(onPermissionGrantedCallback)) {
            onPermissionGrantedCallback();
          }
          break;
        case 'denied':
          if (isFunction(onPermissionDeniedCallback)) {
            onPermissionDeniedCallback();
          }
          break;
      }
    });
  };


  Notify.prototype.show = function () {

    if (!Notify.isSupported) {
      return;
    }

    this.myNotify = new Notification(this.title, {
      'body': this.options.body,
      'tag' : this.options.tag,
      'icon' : this.options.icon
    });

    if (this.options.timeout && !isNaN(this.options.timeout)) {
      setTimeout(this.close.bind(this), this.options.timeout * 1000);
    }

    this.myNotify.addEventListener('show', this, false);
    this.myNotify.addEventListener('error', this, false);
    this.myNotify.addEventListener('close', this, false);
    this.myNotify.addEventListener('click', this, false);
  };

  Notify.prototype.onShowNotification = function (e) {
    if (this.onShowCallback) {
      this.onShowCallback(e);
    }
  };

  Notify.prototype.onCloseNotification = function (e) {
    if (this.onCloseCallback) {
      this.onCloseCallback(e);
    }
    this.destroy();
  };

  Notify.prototype.onClickNotification = function (e) {
    if (this.onClickCallback) {
      this.onClickCallback(e);
    }
  };

  Notify.prototype.onErrorNotification = function (e) {
    if (this.onErrorCallback) {
      this.onErrorCallback(e);
    }
    this.destroy();
  };

  Notify.prototype.destroy = function () {
    this.myNotify.removeEventListener('show', this, false);
    this.myNotify.removeEventListener('error', this, false);
    this.myNotify.removeEventListener('close', this, false);
    this.myNotify.removeEventListener('click', this, false);
  };

  Notify.prototype.close = function () {
    this.myNotify.close();
  };

  Notify.prototype.handleEvent = function (e) {
    switch (e.type) {
    case 'show':
      this.onShowNotification(e);
      break;
    case 'close':
      this.onCloseNotification(e);
      break;
    case 'click':
      this.onClickNotification(e);
      break;
    case 'error':
      this.onErrorNotification(e);
      break;
    }
  };

  return Notify;

}));


/**
 * Author : oui
 * notify_desktop.js
 */

// ワーディング
langResources['Your browser does not support desktop notice.'] =	['このブラウザはデスクトップ通知をサポートしていません。'];
langResources['Notification'] = ['通知設定'];

if(Notify.needsPermission){
  if(Notify.isSupported){
    Notify.requestPermission();
  }else{
    alert(_('Your browser does not support desktop notice.'));
  }
}

var s_tl = 0,
    s_rep = 1,
    s_dm = 2,
    s_rt = 3,
    s_fav = 4,
    s_post = 5,
    s_flw = 6,
    s_cls = 7,
    s_men = 8,
    text,
    icon_img;

// 設定読み書き
var notification = (readCookie('notification') || 'false').split(',');
var len = notification.length;
if(len>0){
  for(var i=0; i<len; i++){
    (notification[i] === 'true') ? notification[i] = true : notification[i] = false;
  }
}
function setNotificationSettings() {
  var settings = [];
  var len = $('notification_pref').getElementsByTagName('input').length;
  for(var i=0; i<len; i++){
    settings.push($('notification_'+i).checked);
  }
  notification = settings;
  writeCookie('notification', settings.join(","), 3652);
}
function getChecked(c) {
  return c ? 'checked' : '';
}

registerPlugin({
  cnt: 0,
  update: function() { this.cnt++; },
  gotNewMessage: function(tw) {
    if (this.cnt <= 1) return;
    var uname = tw.user.screen_name;
    // RTされ
    if(notification[s_rt] && tw.retweeted_status && tw.retweeted_status.user.screen_name == myname){
      icon_img = tw.user.profile_image_url;
      text = tw.retweeted_status.text;
      showNotification('Retweeted by @'+uname);
    // 通常のポスト
    }else{
      if(!notification[s_tl]) return;
      if(uname == myname) return;
      icon_img = tw.user.profile_image_url;
      text = tw.text;
      showNotification('Timeline: @'+uname);
    }
  },
  // リプライ・Mention
  noticeNewReply: function(replies){
    if(!notification[s_rep] && !notification[s_men]) return;
    for(var i=0; i<replies.length; i++){
      if(replies[i].retweeted_status) return;
      var uname = replies[i].user.screen_name;
      if(uname == myname) return;
      text = replies[i].text;
      icon_img = replies[i].user.profile_image_url;
      if(notification[s_rep] && (replies[i].in_reply_to_status_id || text.charAt(0) === '@')){
        showNotification('Reply by @'+uname);
      }else if(notification[s_men]){
        showNotification('Mention by @'+uname);
      }
    }
  },
  // DM
  newDM: function(data){
    if(!notification[s_dm]) return;
    var uname = data.sender_screen_name;
    if(uname == myname) return;
    icon_img = data.sender.profile_image_url;
    text = data.text;
    showNotification('Direct Message by @'+uname);
  },
  // ふぁぼられ
  favorited: function(tw){
    if(!notification[s_fav]) return;
    var uname = tw.source.screen_name;
    if(uname == myname) return;
    icon_img = tw.source.profile_image_url;
    text = tw.target_object.text;
    showNotification('Favorited by @'+uname);
  },
  // 自分のポスト
  postQueued: function(str) {
    if(!notification[s_post]) return;
    icon_img = '';
    text = str;
    showNotification('Post: ');
  },
  // フォローされ
  followed: function(data){
    if(!notification[s_flw]) return;
    if(data.screen_name == myname) return;
    icon_img = data.profile_image_url;
    text = '';
    showNotification('Followed by @'+data.screen_name);
  },
  // 設定タブに要素を追加
  miscTab: function(ele) {
    var e = document.createElement("div");
    e.innerHTML = 
      '<a href="javascript:var s = $(\'notification_pref\').style; s.display = s.display==\'block\'?\'none\':\'block\';void(0)"><b>▼'+_('Notification')+'</b></a>' +
      '<form id="notification_pref" style="display:none;" onSubmit="setNotificationSettings(); return false;">' +
      '<label><input type="checkbox" id="notification_'+s_tl+'" '+getChecked(notification[s_tl])+'>Timeline</label>'+
      '<label><input type="checkbox" id="notification_'+s_rep+'" '+getChecked(notification[s_rep])+'>Reply</label>'+
      '<label><input type="checkbox" id="notification_'+s_dm+'" '+getChecked(notification[s_dm])+'>DM</label>'+
      '<label><input type="checkbox" id="notification_'+s_rt+'" '+getChecked(notification[s_rt])+'>Retweeted</label>'+
      '<label><input type="checkbox" id="notification_'+s_men+'" '+getChecked(notification[s_men])+'>Mentioned</label>'+
      '<label><input type="checkbox" id="notification_'+s_fav+'" '+getChecked(notification[s_fav])+'>Favorited</label>'+
      '<label><input type="checkbox" id="notification_'+s_post+'" '+getChecked(notification[s_post])+'>Post</label>'+
      '<label><input type="checkbox" id="notification_'+s_flw+'" '+getChecked(notification[s_flw])+'>Followed</label><br>'+
      '<label><input type="checkbox" id="notification_'+s_cls+'" '+getChecked(notification[s_cls])+'>Auto Close</label><br>'+
      '<button type="submit">'+_('Apply')+'</button></form>';
    $("pref").appendChild(e);
  }
});

function showNotification(title) {
  var autoClose = null;
  if(notification[s_cls]) autoClose = 3;
  var notify = new Notify(title, {
    body: text,
    icon: icon_img,
    timeout: autoClose
  });
  notify.show();
}