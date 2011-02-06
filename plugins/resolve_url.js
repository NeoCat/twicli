/* replace short URLs with original URLs */
(function(){
  var re = /^http:\/\/(t\.co|tinyurl\.com|bit\.ly|is\.gd|u\.nu|icio\.us|tr\.im|cli\.gs|twurl\.nl|url\.ie|j\.mp|ow\.ly|ff\.im|digg\.com|tumblr\.com|htn\.to|goo\.gl)\/|http:\/\/p\.tl\/(?!.\/)/;
  var api = 'http://atsushaa.appspot.com/untiny/get';
  var queue = [];
  var wait = 10000;
  var remove = function(e){if (e && e.parentNode) e.parentNode.removeChild(e)};

  window.replaceUrl = function(hash) {
    for (var shortUrl in hash) if (hash.hasOwnProperty(shortUrl)) {
      var longUrl = hash[shortUrl];
      // make human friendly URL
      try{
        var decoded = decodeURI(longUrl);
      }catch(e){
        var decoded = longUrl;
      }
      if (decoded.length > 200) {
        var truncated = decoded.slice(0,200)+'...';
      } else {
        var truncated = decoded;
      }

      // search for a link with the shortUrl
      var n = queue.length, task;
      while (task = queue[--n]) if (task.link.href === shortUrl) {
        var link = task.link;
        // replace link href and text with longUrl
        link.href = longUrl;
        if (link.textContent === shortUrl) {
          link.textContent = truncated;
        } else if (link.innerText === shortUrl) {
          link.innerText = truncated;
        }
        link.className += ' resolved';
        // cleanup
        clearTimeout(task.timer);
        remove(task.script);
        queue.splice(n,1);
        // notify to other plugins
        if (link.parentNode && link.parentNode.parentNode)
          callPlugins("replaceUrl", link.parentNode.parentNode, link, longUrl, shortUrl);
      }
    }
  }

  function setResolver(link) {
    // JSONP with callback window.replaceUrl
    var src = api + '?callback=replaceUrl&url=' + encodeURIComponent(link.href);
    var script = loadXDomainScript(src);

    // cleanup if JSONP doesn't load in time
    var timer = setTimeout(function(){
      var n = queue.length;
      while (n--) if (task === queue[n]) {
        queue.splice(n,1);
        remove(task.script);
      }
    }, wait);
    var task = {link:link, script:script, timer:timer};
    queue.push(task);
  }

  function findShortUrls(elem) {
    var links = elem.getElementsByTagName('a');
    for (var i = 0; i < links.length; i++) (function(a){
      if (a.parentNode.className.indexOf('status') >= 0 && re.test(a.href)) {
        if (RegExp.$1 == 'tumblr.com') { // Specialization for tumblr.com
          a.href = a.href.replace('tumblr.com','www.tumblr.com');
          a.innerHTML = a.innerHTML.replace('tumblr.com','www.tumblr.com');
        }
        setResolver(a);
      }
    })(links[i]);
  }

  registerPlugin({
    newMessageElement : findShortUrls
  });

})()

