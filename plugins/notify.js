langResources['Hide'] =	['非表示','非表示'];

var tw_notify_last = readCookie('twicli_notify_last');
if (!parseInt(tw_notify_last)) tw_notify_last = "1384109454";

function twn_hide(id) {
	ele = $('tw-'+id);
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
			tw[i].text += ' <a href="javascript:twn_hide('+tw[i].id_str+')">['+_('Hide')+']</a>';
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
