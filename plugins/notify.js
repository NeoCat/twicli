langResources['Hide'] =	['非表示','非表示'];

var tw_notify_last = readCookie('twicli_notify_last');
if (!parseInt(tw_notify_last)) tw_notify_last = "297864206617825281";

function twn_hide(id) {
	var ele = $('tw-'+id);
	if (!ele || !ele.tw) return;
	ele.style.display = 'none';
	if (parseInt(tw_notify_last) > ele.tw.id) return;
	tw_notify_last = ele.tw.id_str;
	writeCookie('twicli_notify_last', tw_notify_last, 3652);
}

registerPlugin({
	twnShow: function(tw) {
		if (tw.error) return error(tw.error);
		if (tw.errors) return error('', tw);
		if (tw.length < 1) return;
		for (var i = 0; i < tw.length; i++) {
			if (tw[i].full_text)
				tw[i].full_text += ' <a href="javascript:twn_hide(\''+tw[i].id_str+'\')">['+_('Hide')+']</a>';
			if (tw[i].text)
				tw[i].text += ' <a href="javascript:twn_hide(\''+tw[i].id_str+'\')">['+_('Hide')+']</a>';
			if (new Date() - toDate(tw[i].created_at) > 30*24*60*60*1000)
				tw[i].user = null;
		}
		twShowToNode(tw, $("tw"));
	},
	noticeUpdate: function(){
		if (this.done) return;
		xds.load(twitterAPI + 'statuses/user_timeline.json' +
					'?count=5&screen_name=twicli&since_id=' + tw_notify_last +
					'&include_entities=true&suppress_response_codes=true', this.twnShow);
		this.done = true;
	}
});
