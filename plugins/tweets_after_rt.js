langResources['Find tweets after retweets'] =	['リツイート直後のツイートを探す',''];

var tweets_after_rt = {
	popup: function(ele, user, id) {
		$('tweets_after_retweet').onclick = function() {
			tweets_after_rt.find_tweets_after_retweets(ele, user, id);
			return false;
		}
	},
	find_tweets_after_retweets: function(ele, user, id) {
		rep_top = cumulativeOffset(ele)[1] + 20;
		xds.load_for_tab(twitterAPI + 'statuses/retweets/' + id + '.json?count=100',
			function(tw) {
				var cnt = 0;
				if (tw.errors) return error('', tw);
				for (var i = 0; i < tw.length; i++) {
					var rtid = tw[i].id_str;
					// 10分後までのtweetを取得 (snowflake ID (63bit)の上位41bit分が時刻(ms))
					var max_id = tw[i].id + 600000 * (1 << 22);
					xds.load_for_tab(twitterAPI + 'statuses/user_timeline.json?' +
						'user_id=' + tw[i].user.id_str + '&max_id=' + max_id + '&since_id=' + rtid,
						function(tws) {
							if (tws.errors) return error('', tws);
							if (tws.length > 0) {
								var t = tws[tws.length-1];
								if (t.retweeted_status) return; // 他のRTは除外
								if (cnt > 0)
									rep_trace_id = t.id_str;
								dispReply2(t);
								cnt++;
							}
						});
				}
			});
	}
};
registerPlugin(tweets_after_rt);

function favEntries(favs) {
	twFavPlugin.favs = favs;
	for (var x in favs) {
		for (var i = 0; i < 3; i++) {
			var target = $('nrFav-'+['tw-','re-','tw2c-'][i]+x);
			if (target)
				target.innerHTML = '[fav:' + favs[x] + ']';
		}
	}
}

// Popup menu

var a = document.createElement("hr");
$('popup').appendChild(a)

a = document.createElement("a");
a.id = 'tweets_after_retweet';
a.innerHTML = _('Find tweets after retweets');
a.href = "#";
$('popup').appendChild(a)
