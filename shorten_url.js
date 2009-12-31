/* assist inline URL shortening in the text area */
(function(){
  var wait = 5000; // time to wait before deciding that the server is unreacheable
  var _updateCount = window.updateCount;
  var fst = $('fst');
  var timer, ele, command, original;
  var remove = function(e){if(e && e.parentNode)e.parentNode.removeChild(e); e = null};
  var api = 'http://atsushaa.appspot.com/shorten/get';
  var cache = {};

  window.replaceText = function(hash){
    var replacement = hash[original] || original;
    if (hash[original]) cache[replacement] = original;

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
      if (cache[original]) {
        timer = setTimeout(function(){ window.replaceText(cache); }, 100);
      } else {
        var src = api + '?callback=replaceText&url='+encodeURIComponent(original);
        ele = loadXDomainScript(src);
        timer = setTimeout(function(){ window.replaceText({original:null}); }, wait);
      }
    }
    _updateCount();
  }

  registerPlugin({
    post: function(){ cache = {} }
  })
})();

