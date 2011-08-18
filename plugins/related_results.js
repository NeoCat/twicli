langResources['Related Tweets'] = ['関連ツイート'];
langResources['Tweets with conversation'] = ['会話のツイート'];
langResources['Tweets with reply'] = ['返信のツイート'];
langResources['Tweets with mention'] = ['@ユーザーを含むツイート'];
langResources['Tweets with hashtag'] = ['このハッシュタグのツイート'];
langResources['Tweets with entity'] = ['単語を含むツイート'];
langResources['Tweets from user'] = ['このユーザーのツイート'];
langResources['Reply'] = ['返信'];
langResources['Fork'] = ['分岐'];
langResources['Conversation'] = ['会話'];
var dispRelated;

(function() {
  // トリガーになるメニューをつくる
  var menuItem = document.createElement('a');
  menuItem.id = 'popup_related';
  menuItem.innerHTML = _('Related Tweets');
  $('popup_link_user').parentNode.insertBefore(menuItem, $('popup_link_user'));

  function makeRelatedMenu(elem, user, id, tweet_elem) {
    $('popup_related').href = '#';
    $('popup_related').onclick = function() {
      dispRelated(user, id, tweet_elem);
      return false;
    };
  }

  // メニューから呼ばれる
  dispRelated = function(user, id, elem) {
    var elem_top = cumulativeOffset(elem)[1] + 20;
    rep_top = elem_top;
    $("loading").style.display = "block";

    xds.load(twitterAPI + 'related_results/show/'+id+'.json?pc=true&include_entities=1&suppress_response_codes=true', function(data) {
      $('loading').style.display = 'none';
      
      if (data[0] && data[0].results) {
        $('reps').innerHTML = '';
        $('rep').style.top = elem_top;
        for (var i = 0; i < data.length; i++) {
          if (data[i].results) data[i].results = data[i].results.reverse();
          var caption = data[i].groupName.replace(/(.)([A-Z])/g, function(s,p1,p2) { return p1+' '+p2.toLowerCase() });
          addLegend(_(caption));
          if (data[i].groupName == 'TweetsWithConversation') {
            var last_role = '';
            for (var j = 0; j < data[i].results.length; j++) {
              var role = data[i].results[j].annotations.ConversationRole;
              if (last_role != role) {
                if (last_role == 'Descendant' && role == 'Ancestor') {
                  addLegendForConversation('This');
                  var tweet_elem = getTweetDiv(elem);
                  if (tweet_elem.tw) addRelatedTweet(tweet_elem.tw, 'self');
                }
                addLegendForConversation(role);
                last_role = role;
              }
              addRelatedTweet(data[i].results[j].value);
            }
          } else {
            for (var j = 0; j < data[i].results.length; j++) {
              addRelatedTweet(data[i].results[j].value);
            }
          }
        }
        $('rep').style.display = "block";
        scrollToDiv($('rep'));
      }
    });
  };

  function addLegend(caption, className) {
    var legend = document.createElement('legend');
    if (className) legend.className = className;
    legend.innerHTML = caption;
    $('reps').appendChild(legend);
  }
  function addLegendForConversation(role) {
    if (role == 'Fork')
      addLegend(' &gt; '+_('Fork'), 'fork');
    else if (role == 'Descendant')
      addLegend(' &gt; '+_('Conversation'), 'conversation');
    else if (role == 'This')
      addLegend(' &gt; '+_('Reply')+'↑', 'reply_up');
    else if (role == 'Ancestor')
      addLegend(' &gt; '+_('Reply')+'↓', 'reply_down');
    else
      addLegend(' &gt; '+role, role);
  }
  function addRelatedTweet(tw, className) {
    var el = document.createElement('div');
    el.id = 'reps-'+tw.id_str;
    if (className) el.className = className;
    el.innerHTML = makeHTML(tw, false, 'reps');
    el.tw = tw;
    callPlugins("newMessageElement", el, tw, 'reps');
    $('reps').appendChild(el);
  }

  // 任意のElementから親をたどっていって、含まれるツイートのdivを得る
  function getTweetDiv(elem) {
    var t = elem;
    while (t && !(t.tw)) t = t.parentNode;
    return t;
  }

  registerPlugin({
    popup: makeRelatedMenu
  });

})();
