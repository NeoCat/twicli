(function() {
  var re = /^https?:\/\/twitter\.com\/(\w+)\/status(?:es)?\/(\d+)/;

  function tweetUrlReply(elem) {
    var links = elem.getElementsByTagName('a');
    for (var i = 0, l = links.length; i < l; i++) {
      if (/\bstatus\b/.test(links[i].parentNode.className)) {
        if (re.test(links[i].href)) insertInReplyTo(links[i]);
      }
    }
  }

  function urlReplaced(elem, link, lng, sht) {
    if (re.test(lng)) insertInReplyTo(link);
  }

  function insertInReplyTo(a) {
    var m = a.href.match(re);
    if (m) {
      var dummy = document.createElement('div');
      dummy.innerHTML = '<a class="button" href="#" onClick="dispReply(\'' + m[1] + '\',' + m[2] + ',this); return false;"><img src="images/inrep.png" alt="☞" width="14" height="14"></a>';
      a.parentNode.insertBefore(dummy.firstChild, a.nextSibling);
    }
  }

  registerPlugin({
    newMessageElement : tweetUrlReply,
    replaceUrl : urlReplaced
  });

}());
