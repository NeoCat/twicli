/* replace short URLs with original URLs */
(function(){
    var re = /^https?:\/\/((tinyurl\.com|bit\.ly|is\.gd|u\.nu|icio\.us|tr\.im|cli\.gs|twurl\.nl|url\.ie|j\.mp|ow\.ly|ff\.im|digg\.com|dlvr\.it|buff\.ly|po\.st|(?:www\.)?tumblr\.com|tmblr\.co|htn\.to|goo\.gl|slidesha\.re|amzn\.to|ustre\.am|ift\.tt|fb\.me|urx\.nu|wp\.me)\/|b\.hatena\.ne\.jp\/-\/redirect?)|http:\/\/p\.tl\/(?!.\/)/;
  var api = 'https://resolve-url.appspot.com/url';

  window.replaceUrl = function(hash, link) {
    for (var shortUrl in hash) if (hash.hasOwnProperty(shortUrl)) {
      var longUrl = hash[shortUrl];
      var decoded = makeHumanFriendlyURL(longUrl);
      var truncated;
      if (decoded.length > 200) {
        truncated = removeScheme(decoded.slice(0,200)+'...');
      } else {
        truncated = removeScheme(decoded);
      }

      link.href = longUrl;
      if (removeScheme(link.textContent) === removeScheme(shortUrl)) {
        link.textContent = truncated;
      } else if (removeScheme(link.innerText) === removeScheme(shortUrl)) {
        link.innerText = truncated;
      }
      if (link.className.indexOf('resolved') < 0);
        link.className += ' resolved';
      link.resolved = link.resolved ? link.resolved+1 : 1;
      if (link.resolved <= 3 && re.test(link.href)) {// resolve multiply-shortened URL
        if (RegExp.$1 == 'tumblr.com') { // Specialization for tumblr.com
          link.href = link.href.replace('tumblr.com','www.tumblr.com');
          link.innerHTML = link.innerHTML.replace('tumblr.com','www.tumblr.com');
        }
        setResolver(link);
      }
      // notify to other plugins
      else if (link.parentNode && link.parentNode.parentNode) {
        var s = link.parentNode.parentNode;
        if (!s.tw) s = s.parentNode.parentNode;
        callPlugins("replaceUrl", s, link, longUrl, shortUrl);
      }
    }
  }

  function setResolver(link) {
    // JSONP with callback window.replaceUrl
    var src = api + '?url=' + encodeURIComponent(link.href);
    setTimeout(function(){
      xds.load(src, function(hash){replaceUrl(hash, link)}, null, 0);
    }, 0);
  }

  function makeHumanFriendlyURL(url) {
    try {
      return decodeURI(url);
    } catch (e) {
      return url;
    }
  }

  function findShortUrls(elem) {
    Array.prototype.forEach.call(elem.querySelectorAll('.status a.link:not(.resolved)'), function(a){
      if (re.test(a.href)) {
        if (RegExp.$1 == 'tumblr.com') { // Specialization for tumblr.com
          a.href = a.href.replace('tumblr.com','www.tumblr.com');
          a.innerHTML = a.innerHTML.replace('tumblr.com','www.tumblr.com');
        }
        setResolver(a);
        return;
      }
      a.innerHTML = makeHumanFriendlyURL(a.innerHTML);
    });
  }

  registerPlugin({
    newMessageElement : findShortUrls
  });

})()
