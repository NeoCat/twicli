var { Textcomplete, Textarea } = require('textcomplete');

// 発言欄に入力補完を設定
var textareaElement = document.getElementById('fst');
var editor = new Textarea(textareaElement);
var textcomplete = new Textcomplete(editor, {
  dropdown: {
    className: 'textcomplete-list popup_menu'
  }
});

// リスト要素を整形
var textcompleteStyle = document.createElement('style');
document.head.appendChild(textcompleteStyle);
textcompleteStyle.sheet.insertRule('.textcomplete-item.active a { background-color: #ccc; }', 0);
textcompleteStyle.sheet.insertRule('.textcomplete-item a { background-color: #eee; }', 0);
textcompleteStyle.sheet.insertRule('.textcomplete-item img { margin-right: .5em; }', 0);
textcompleteStyle.sheet.insertRule('.textcomplete-list { padding: 0; list-style: none; }', 0);

var users = {};
var tags = [];
registerPlugin({
  // 新着ポスト受信時に補完候補を配列に格納
  newMessageElement: function(ele, tw){
    // RTでなければユーザリストにスクリーンネームとアイコンを格納
    if(!tw.retweeted_status){
      users[tw.user.screen_name] = tw.user.profile_image_url_https;
    }
    // ハッシュタグがあればタグリストに追加
    var tagsLink = ele.getElementsByClassName('hashtag');
    for(var i = 0; i < tagsLink.length; i++){
      var title = tagsLink[i].title.slice(1);
      if(tags.indexOf(title) < 0) tags.unshift(title);
    }
  }
});

textcomplete.register([{
  // スクリーンネーム補完
  match: /(^|\s)@(\w*)$/,
  search: function(term, callback){
    callback(Object.keys(users).filter(function(name){
      return name.startsWith(term);
    }));
  },
  replace: function (value) {
    return '$1@' + value + ' ';
  },
  template: function(name){
    return '<img src="'+users[name]+'" class="rtuicon"/>'+name;
  }
},{
  // ハッシュタグ補完
  match: /(^|\s)#(\w*)$/,
  search: function(term, callback){
    callback(tags.filter(function(name){
      return name.startsWith(term);
    }));
  },
  replace: function (value) {
    return '$1#' + value + ' ';
  },
  template: function(name){
    return '#' + name;
  }
}]);