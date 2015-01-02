function imageLoadedFromLink(e) {
  scrollToDiv($('rep'));
  var img = new Image();
  img.src = e.src;
  if (e.width < img.width) {
    e.style.cursor = navigator.userAgent.indexOf('AppleWebKit')>0 ? '-webkit-zoom-in' : 'zoom-in';
    e.onclick = function() {
      var p = e.parentNode;
      p.removeChild(e);
      var ifr = document.createElement("iframe");
      ifr.style.display = 'block';
      ifr.src = e.src;
      var win_w = window.innerWidth || document.documentElement.clientWidth;
      var win_h = window.innerHeight || document.documentElement.clientHeight;
      ifr.width = Math.min(img.width, win_w*0.9-4);
      ifr.height = Math.min(img.height, win_h*0.9-48);
      p.appendChild(ifr);
      scrollToDiv($('rep'));
    }
  }
}
function dispImageFromLink(url, e) {
  if (e.parentNode.parentNode.parentNode.id != 'reps') rep_top = cumulativeOffset(e)[1] + 20;
  $('reps').innerHTML = url.map(function(u){return '<img src="' + u + '" style="max-width:90%; max-height: 90%; margin: auto; display: block;" onload="imageLoadedFromLink(this)">'}).join('');
  $('rep').style.display = 'block';
  $('rep').style.top = rep_top + 'px';
}

(function() {
  var re = /^https?:\/\/(?:mobile\.)?twitter\.com\/(?:#!\/|#%21\/)?(\w+)\/status(?:es)?\/(\d+)/;

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
      if (tw && tw.user.screen_name == m[1] && tw.id_str == m[2] && a.href.indexOf('/photo/1') >= 0 && tw.entities.media && tw.entities.media[0])
        script = 'dispImageFromLink([\'' +
	  Array.prototype.map.call((tw.extended_entities || tw.entities).media, function(x){return x.media_url + ':medium'}).join('\',\'') +
	  '\'], this); return false;';
      dummy.innerHTML = '<a class="button" href="#" onClick="' + script + '"><img src="images/jump.png" alt="☞" width="14" height="14"></a>';
      a.parentNode.insertBefore(dummy.firstChild, a.nextSibling);
    }
  }

  registerPlugin({
    newMessageElement : tweetUrlReply,
    replaceUrl : urlReplaced
  });

}());
