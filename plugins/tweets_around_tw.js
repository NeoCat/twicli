langResources['Find tweets between before and after tweet'] =	['ツイート前後のツイートを探す',''];

var tweets_around_tw = {
	popup: function(ele, user, id) {
		$('tweets_around_tweet').onclick = function() {
			tweets_around_tw.find_tweets_around_tweet(ele, user, id);
			return false;
		}
	},
	find_tweets_around_tweet: function(ele, user, id) {
		rep_top = cumulativeOffset(ele)[1] + 20;
		xds.load_for_tab(twitterAPI + 'statuses/show.json?id=' + id,
			function(tw) {
				if (tw.errors) return error('', tw);
					// 10分前後までのtweetを取得 (snowflake ID (63bit)の上位41bit分が時刻(ms))
					var max_id = tw.id + 600000 * (1 << 22);
					var min_id = tw.id - 600000 * (1 << 22);
					xds.load_for_tab(twitterAPI + 'statuses/user_timeline.json?' +
						'user_id=' + tw.user.id_str + '&max_id=' + max_id + '&since_id=' + min_id,
						function(tws) {
							if (tws.errors) return error('', tws);
							var cnt = 0;
							for (var i=0; i < tws.length; i++) {
								var t = tws[i];
								if (cnt > 0)
									rep_trace_id = t.id_str;
								// TODO: 元になったツイートを選択状態にしたい
								dispReply2(t);
								cnt++;
							}
						});
			});
	}
};
registerPlugin(tweets_around_tw);

// Popup menu

var a = document.createElement("hr");
$('popup').appendChild(a)

a = document.createElement("a");
a.id = 'tweets_around_tweet';
a.innerHTML = _('Find tweets between before and after tweet');
a.href = "#";
$('popup').appendChild(a)
