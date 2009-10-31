/* assist inline URL shortening in the text area */
(function(){
  var wait = 2000; // time to wait before deciding that the server is unreacheable

  var _updateCount = window.updateCount;
  var fst = $('fst');
  var timer = null;
  var ele = null;
  var remove = function(e){if(e && e.parentNode)e.parentNode.removeChild(e); e = null};

  window.replaceText = function(hash){
    for (var original in hash) if (hash.hasOwnProperty(original)) {
      var replacement = hash[original];
      try{
        var replacement = decodeURI(replacement);
      }catch(e){}

      if (fst.value.indexOf(original+';;;') >= 0) {
        fst.value = fst.value.replace(original+';;;', replacement || original);
      } else if (fst.value.indexOf(original+'；；；') >= 0) {
        fst.value = fst.value.replace(original+'；；；', replacement || original);
      }
    }
    remove(ele);
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
    _updateCount();
  }

  window.updateCount = function(){
    if (!(ele && ele.parentNode) && /((https?:\/\/\S+?)(?:;;;|；；；))/.test(fst.value)) {
      var command = RegExp.$1;
      var originalUrl = RegExp.$2;
      if (originalUrl.indexOf('http://j.mp/') === 0 || originalUrl.indexOf('http://bit.ly/') === 0) {
        var src = 'http://atsushaa.appspot.com/untiny/get?callback=replaceText&url='+encodeURIComponent(originalUrl);
      } else {
        var src = 'http://atsushaa.appspot.com/shorten/get?callback=replaceText&url='+encodeURIComponent(originalUrl);
      }
      loadXDomainScript(src, ele);
      timer = setTimeout(function(){
        fst.value = fst.value.replace(command, originalUrl);
        remove(ele);
        timer = null;
      }, wait);
    }
    _updateCount();
  }
})();

