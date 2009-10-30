/* assist inline URL shortening in the text area */
(function(){
  var wait = 2000; // time to wait before deciding that the server is unreacheable

  var _updateCount = window.updateCount;
  var fst = $('fst');
  var timer, ele, command, original;
  var remove = function(e){if(e && e.parentNode)e.parentNode.removeChild(e); e = null};

  window.replaceText = function(hash){
    var replacement = hash[original];
    if (replacement) {
      try{ // unescape percent-encoded UTF-8 characters
        replacement = decodeURI(replacement);
      }catch(e){}
    } else {
      replacement = original;
    }

    if (fst.value.indexOf(command) >= 0) {
      fst.value = fst.value.replace(command, replacement);
    }
    // cleanup
    remove(ele);
    clearTimeout(timer);
    timer = null;
    _updateCount();
  }

  window.updateCount = function(){
    if (!(ele && ele.parentNode) && /((https?:\/\/\S+?)(?:;;;|；；；))/.test(fst.value)) {
      command = RegExp.$1;
      original = RegExp.$2;
      if (original.indexOf('http://j.mp/') === 0 || original.indexOf('http://bit.ly/') === 0) {
        var src = 'http://atsushaa.appspot.com/untiny/get?callback=replaceText&url='+encodeURIComponent(original);
      } else {
        var src = 'http://atsushaa.appspot.com/shorten/get?callback=replaceText&url='+encodeURIComponent(original);
      }
      ele = loadXDomainScript(src, ele);
      timer = setTimeout(function(){
        window.replaceText({original:null});
      }, wait);
    }
    _updateCount();
  }
})();

