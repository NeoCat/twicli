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
      fst.focus();
      var startpos = fst.value.indexOf(command);
      if (startpos >= 0) {
        var standard = ('selectionStart' in fst);
        var ie = ('createTextRange' in fst); // IE and Opera < 10.5
        var cursorpos, range;
        // get cursor position before replace
        if (standard) {
          cursorpos = fst.selectionStart;
        } else if (ie) {
          range = document.selection.createRange();
          range.moveStart('character', -fst.value.length); // move start to 0
          cursorpos = range.text.replace(/\n/g, '').length; // when doing move() later, CRLF is counted as 1. take care of it here.
        }
        fst.value = fst.value.replace(command, replacement);

        // move cursor after replace
        if (startpos < cursorpos) {
          cursorpos += replacement.length - command.length;
        }
        if (standard) {
          fst.setSelectionRange(cursorpos, cursorpos);
        } else if (ie) {
          range = fst.createTextRange();
          range.move('character', -fst.value.length);
          range.move('character', cursorpos);
          range.select();
        }
      }
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
