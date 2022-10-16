function imageLoadedFromLink(e) {
  scrollToDiv($('rep'), 16);
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
      scrollToDiv($('rep'), 16);
    }
  }
}
function dispImageFromLink(e, media) {
  if (e.parentNode.parentNode.parentNode.id != 'reps') rep_top = cumulativeOffset(e)[1] + 20;
  var html = '';
  for (var i = 0; i < media.length; i++) {
    var url = media[i][0], type = media[i][1];
    if (type == "video" || type == "animated_gif")
      html += '<video controls autoplay '+(type == "animated_gif" ? 'loop ' : '')+'style="max-width:90%; max-height: 90%; margin: auto; display: block;">' +
      url.map(function(u){return '<source type="' + u[0] + '" src="' + u[1] + '">'}).join('') + '</video>';
    else
      html += '<img src="' + url + '" style="max-width:90%; max-height: 90%; margin: auto; display: block;" onload="imageLoadedFromLink(this)">';
  }
  $('reps').innerHTML = html;
  openRep(true);
  $('rep').style.top = rep_top + 'px';
}

(function() {
  var re = /^https?:\/\/(?:mobile\.)?twitter\.com\/(?:#!\/|#%21\/)?(\w+)\/status(?:es)?\/(\d+)/;

  function tweetUrlReply(elem) {
    Array.prototype.forEach.call(elem.querySelectorAll('.status > a.link'), function(link) {
      insertInReplyTo(link)
    });
  }

  function urlReplaced(elem, link) {
    insertInReplyTo(link);
  }

  function insertInReplyTo(a) {
    if (a.tweetUrlChecked) return;
    var m = a.href.match(re) || [];
    var id_str = m[2];
    if (!id_str) return;
    var tw = a.parentNode.parentNode.tw;
    if (!tw) return; // quoted tweet の場合は不要 (twicli.js 本体の makeHTML() で対応済み)
    tw = tw.retweeted_status || tw;
    a.tweetUrlChecked = true;
    var entities = ent(tw);
    var className = 'dispReply';
    var script = 'dispReply(\'' + m[1] + '\',\'' + m[2] + '\',this); event.preventDefault(); return false;';
    if (tw.id_str === id_str && (a.href.indexOf('/photo/1') >= 0 || a.href.indexOf('/video/1') >= 0) &&
        entities.media && entities.media[0]) {
      var media = entities.media;
      className = 'dispImage';
      script = 'dispImageFromLink(this, [' +
        Array.prototype.map.call(media, function(x) {
          return '[' + (
            x.video_info ?
              '[' + Array.prototype.map.call(x.video_info.variants, function(y){return '[\'' + y.content_type + '\',\'' + y.url + '\']'}) + ']' :
              '\'' + x.media_url_https + ':medium\''
          ) + ', \'' + x.type +'\']';
        }).join(',') + ']); return false;';
    }
    var dummy = document.createElement('div');
    dummy.innerHTML = '<a class="button ' + className + '" href="#" onClick="' + script + '"><img src="images/jump.png" alt="☞" width="14" height="14"></a>';
    a.parentNode.insertBefore(dummy.firstChild, a.nextSibling);
  }

  function updateDispImageV2(elem) {
    var a = elem.querySelector('.dispImage');
    if (!a) return;
    a.onclick = function() {
      var media = {};
      for (var i = 0; i < elem.tw_v2.includes.media.length; i++) {
	var m = elem.tw_v2.includes.media[i];
	media[m.media_key] = m;
      }
      var list = Array.prototype.map.call(elem.tw_v2.data.attachments.media_keys, function(key) {
        return [media[key].url || Array.prototype.map.call(media[key].variants, function(m) { return [m.content_type, m.url]; }),
                media[key].type];
      });
      dispImageFromLink(elem, list);
      return false;
    };
  }

  registerPlugin({
    newMessageElement : tweetUrlReply,
    replaceUrl : urlReplaced,
    setTweetV2: updateDispImageV2
  });

}());
