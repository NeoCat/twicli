var twicli_debug_log = [];

registerPlugin({
	noticeNewReply: function(replies) {
		twicli_debug_log.push([since_id, since_id_reply, tl_oldest_id, nr_tw, replies.map(function(x){return x.id})]);
	},
	miscTab: function() {
		var e = document.createElement("div");
		e.innerHTML = '<a href="javascript:var s = $(\'debug_log\').style; s.display = s.display==\'block\'?\'none\':\'block\';void(0)"><b>▼Debug Log</b></a>' +
			'<form id="debug_log" method="post" target="_blank" action="http://twicli.neocat.jp/debug.cgi" style="display:none">' +
			'<textarea name="log" rows="5" cols="40">' + [myid, cookieVer, updateInterval, pluginstr.replace(/\n/g,","), max_count, max_count_u, nr_limit, auto_update, no_since_id, no_counter, no_resize_fst, replies_in_tl, decr_enter].join(",") + "\n" + twicli_debug_log.join("\n") + '</textarea>' +
			'<input type="submit" value="Submit debug log"></form>';
		$("pref").appendChild(e);
	}
});

