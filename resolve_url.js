/* replace short URLs with original URLs */
(function(){
  var list = [
"0rz.tw","2tu.us","307.to","6url.com","a.gg","a.nf","a2n.eu","ad.vu","adf.ly"
,"adjix.com","alturl.com","atu.ca","azqq.com","b23.ru","b65.com","bacn.me"
,"bit.ly","bloat.me","budurl.com","buk.me","canurl.com","chilp.it","clck.ru"
,"cli.gs","cliccami.info","clipurl.us","clop.in","cort.as","cuturls.com"
,"decenturl.com","digg.com","doiop.com","dwarfurl.com","easyurl.net"
,"eepurl.com","ewerl.com","ff.im","fff.to","fhurl.com","flingk.com","flq.us"
,"fly2.ws","fwd4.me","fwdurl.net","g8l.us","gl.am","go.9nl.com","goshrink.com"
,"hex.io","href.in","htxt.it","hugeurl.com","hurl.ws","icanhaz.com","idek.net"
,"is.gd","jijr.com","j.mp","kissa.be","kl.am","klck.me","korta.nu","l9k.net","liip.to"
,"liltext.com","lin.cr","linkgap.com","liurl.cn","ln-s.net","ln-s.ru"
,"lnkurl.com","lru.jp","lu.to","lurl.no","memurl.com","merky.de","migre.me"
,"minilien.com","moourl.com","myurl.in","nanoref.com","nanourl.se","netnet.me"
,"ni.to","nn.nf","notlong.com","nutshellurl.com","o-x.fr","offur.com","omf.gd"
,"onsaas.info","ow.ly","parv.us","peaurl.com","ping.fm","piurl.com","plumurl.com"
,"plurl.me","pnt.me","poprl.com","post.ly","ptiturl.com","qlnk.net","qurlyq.com"
,"r.im","rb6.me","rde.me","reallytinyurl.com","redir.ec","redirects.ca"
,"redirx.com","ri.ms","rickroll.it","rubyurl.com","s3nt.com","s7y.us","shink.de"
,"short.ie","short.to","shortenurl.com","shorterlink.com","shortlinks.co.uk"
,"shoturl.us","shredurl.com","shrinkify.com","shrinkr.com","shrinkurl.us"
,"shrtnd.com","shurl.net","shw.me","smallr.com","smurl.com","sn.im","sn.vc"
,"snadr.it","snipr.com","snipurl.com","snurl.com","sp2.ro","spedr.com","srnk.net"
,"srs.li","starturl.com","surl.co.uk","ta.gd","tcrn.ch","tgr.me","tighturl.com"
,"tiny.cc","tiny.pl","tinylink.com","tinyurl.com","to.ly","togoto.us","tr.im"
,"tra.kz","trunc.it","tubeurl.com","twitclicks.com","twitterurl.net"
,"twiturl.de","twurl.cc","twurl.nl","u.mavrev.com","u.nu","u76.org","ub0.cc"
,"ulu.lu","updating.me","ur1.ca","url.az","url.co.uk","url.ie","urlborg.com"
,"urlbrief.com","urlcut.com","urlcutter.com","urlhawk.com","urlkiss.com"
,"urlpire.com","urlvi.be","urlx.ie","virl.com","wapurl.co.uk","wipi.es","x.se"
,"xil.in","xrl.in","xrl.us","xurl.jp","xzb.cc","yatuc.com","yep.it","yfrog.com"
,"zi.ma","zurl.ws","zz.gd","zzang.kr"
];
 
  var re = new RegExp('^http://(?:'+list.join('|').replace(/\./g,'\\.')+')/');
  var api = 'http://atsushaa.appspot.com/untiny/get'
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
        // cleanup
        clearTimeout(task.timer);
        remove(task.script);
        queue.splice(n,1);
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
        setResolver(a);
      }
    })(links[i]);
  }

  registerPlugin({
    newMessageElement : findShortUrls
  });

})()

