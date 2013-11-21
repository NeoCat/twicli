function dispImageFromLink(url, e) {
  if (e.parentNode.parentNode.parentNode.id != 'reps') rep_top = cumulativeOffset(e)[1] + 20;
  $('reps').innerHTML = '<img src="' + url + '" style="max-width:90%; max-height: 90%; margin: auto; display: block;">';
  $('rep').style.display = 'block';
  $('rep').style.top = rep_top + 'px';
  scrollToDiv($('reps'));
}

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
      var script = 'dispReply(\'' + m[1] + '\',\'' + m[2] + '\',this); return false;';
      var tw = a.parentNode.parentNode.tw;
      tw = tw.retweeted_status ? tw.retweeted_status : tw;
      if (tw && tw.user.screen_name == m[1] && tw.id_str == m[2] && a.href.indexOf('/photo/1') >= 0)
        script = 'dispImageFromLink(\'' + tw.entities.media[0].media_url + ':medium\', this); return false;';
      dummy.innerHTML = '<a class="button" href="#" onClick="' + script + '"><img src="images/jump.png" alt="☞" width="14" height="14"></a>';
      a.parentNode.insertBefore(dummy.firstChild, a.nextSibling);
    }
  }

  registerPlugin({
    newMessageElement : tweetUrlReply,
    replaceUrl : urlReplaced
  });

}());
