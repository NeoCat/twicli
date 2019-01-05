if (location.protocol == 'http:' && location.host == 'twicli.neocat.jp') {
  function move2https() {
    if (!confirm('OKをクリックすると、現在の設定・Twitter認証情報をHTTPS版にコピーし、移動します。\n\n移動後に必要に応じてブックマーク等のURLを http:// から https:// に変更してください。')) return;

      var ifr = document.createElement('iframe');
      ifr.src = 'https://twicli.neocat.jp/config_receive.html';
      ifr.onload = function() {
        try {
          var data = {};
          for (var key in localStorage)
            if (key.match(/^twicli_/))
	      data[key] = localStorage[key];
          console.log(data);
          ifr.contentWindow.postMessage(data, 'https://twicli.neocat.jp');
          setTimeout(function(){ location.href = 'https://twicli.neocat.jp/twicli.html' }, 500);
        } catch(e) {
          alert(e);
        }
      }
      document.body.appendChild(ifr);
  }

  var notice = document.createElement('div');
  notice.innerHTML = '<small>現在HTTPでtwicliにアクセスしています。HTTPSに移行することをお勧めします。 <button onclick="move2https()">移行</button> <button onclick="document.body.removeChild($(\'https_notice\'))">閉じる</button></small>';
  notice.id = 'https_notice';
  notice.style.position = 'fixed';
  notice.style.left = notice.style.bottom = 0;
  notice.style.width = '100%';
  notice.style.background = '#ff9';
  notice.style.color = '#000';
  document.body.appendChild(notice);
}
