var twicli_debug_log = [];

function __map(obj,fun) {
	var len = obj.length;
	var res = new Array(len);
	for (var i = 0; i < len; i++)
		if (i in obj)
			res[i] = fun.call(obj, obj[i]);
	return res;
}

registerPlugin({
	noticeNewReply: function(replies) {
		twicli_debug_log.push([since_id, since_id_reply, $("tw").oldest_id, $("tw").nr_tw, replies.map(function(x){return x.id})]);
	},
	miscTab: function() {
		var e = document.createElement("div");
		e.innerHTML = '<a href="javascript:var s = $(\'debug_log\').style; s.display = s.display==\'block\'?\'none\':\'block\';void(0)"><b>▼Debug Log</b></a>' +
			'<form id="debug_log" method="post" target="_blank" action="http://twicli.neocat.jp/debug.cgi" style="display:none">' +
			'<textarea name="log" rows="5" cols="40">' + [myid, cookieVer, updateInterval, pluginstr.replace(/\n/g,","), max_count, max_count_u, nr_limit, auto_update, no_since_id, no_counter, no_resize_fst, replies_in_tl, decr_enter].join(",") + "\n" + twicli_debug_log.join("\n") + "\n" +
			__map($("tw").childNodes, function(x){return __map(x.childNodes,function(y){return [y.tw?y.tw.id:-1,y.weak]})}) + "\n" + 
			__map($("re").childNodes, function(x){return __map(x.childNodes,function(y){return [y.tw?y.tw.id:-1,y.weak]})}) + "\n" + 
			'</textarea>' +
			'<button type="submit">Submit debug log</button></form>';
		$("pref").appendChild(e);
	}
});

