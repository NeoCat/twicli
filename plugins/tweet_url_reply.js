(function() {
  var re = /^https?:\/\/twitter\.com\/(?:#!\/|#%21\/)?(\w+)\/status(?:es)?\/(\d+)/;

  function tweetUrlReply(elem) {
    var links = elem.getElementsByTagName('a');
    for (var i = 0, l = links.length; i < l; i++) {
      if (/\bstatus\b/.test(links[i].parentNode.className)) {
        insertInReplyTo(links[i]);
      }
    }
  }

  function urlReplaced(elem, link, lng, sht) {
    insertInReplyTo(link);
  }

  function insertInReplyTo(a) {
    if (a.tweetUrlChecked) return;
    var m = a.href.match(re);
    if (m) {
      a.tweetUrlChecked = true;
      var dummy = document.createElement('div');
      dummy.innerHTML = '<a class="button" href="#" onClick="dispReply(\'' + m[1] + '\',\'' + m[2] + '\',this); return false;"><img src="images/jump.png" alt="☞" width="14" height="14"></a>';
      a.parentNode.insertBefore(dummy.firstChild, a.nextSibling);
    }
  }

  registerPlugin({
    newMessageElement : tweetUrlReply,
    replaceUrl : urlReplaced
  });

}());
