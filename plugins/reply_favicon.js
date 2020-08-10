
(function() {
// http://stackoverflow.com/questions/260857/changing-website-favicon-dynamically
/*!
 * Dynamically changing favicons with JavaScript
 * Works in all A-grade browsers except Safari and Internet Explorer
 * Demo: http://mathiasbynens.be/demo/dynamic-favicons
 */

// HTML5™, baby! http://mathiasbynens.be/notes/document-head
document.head = document.head || document.getElementsByTagName('head')[0];

// Browser sniffing :`(
if (/Chrome/.test(navigator.userAgent)) {
 var isChrome = 1,
     iframe = document.createElement('iframe');
 iframe.src = 'about:blank';
 iframe.style.display = 'none';
 document.body.appendChild(iframe);
}

function changeFavicon(src) {
 var link = document.createElement('link'),
     oldLink = document.getElementById('dynamic-favicon');
 link.id = 'dynamic-favicon';
 link.rel = 'shortcut icon';
 link.href = src;
 if (oldLink) {
  document.head.removeChild(oldLink);
 }
 document.head.appendChild(link);
 if (isChrome) {
  iframe.src += '';
 }
}

  // original code from here
  var favicon_status = 'normal';
  var title = document.title;

  function toReplyFavicon () {
    if (favicon_status === 'normal') {
      changeFavicon('favicon_reply.ico');
      favicon_status = 'reply';
      document.title = '\u261c ' + title;
    }
  }

  function toNormalFavicon (tab) {
    if (tab.id !== 'reply') return;
    changeFavicon('favicon.ico');
    favicon_status = 'normal';
    document.title = title;
  }

  registerPlugin({
    noticeNewReply: toReplyFavicon,
    switchTo: toNormalFavicon
  });

})();
