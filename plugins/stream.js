langResources['@$1 favorited your tweet:'] = ['@$1 がツイートをお気に入りに追加しました:'];
langResources['@$1 unfavorited your tweet:'] = ['@$1 がツイートをお気に入りから削除しました:'];

var last_update = new Date;
var ws_buffer = '';
var tw_stream_ws = null;
var ws_reopen_timer = null;

function handle_stream_data(data, tw) {
	if (data.text) {
		tw.push(data);
	} else if (data.friends) {
		// do nothing;
	} else if (data['delete'] && data['delete'].status) {
		for (var i = 0; i < 3; i++) {
			var target = $(['tw-','re-','tw2c-'][i]+data['delete'].status.id_str);
			if (target) target.className += " deleted";
		}
	} else if (data.direct_message) {
		if ($("direct").className.indexOf('new') < 0)
		$("direct").className += " new";
	} else if (data.event && (data.event == "favorite" || data.event == "unfavorite")) {
		var name = data.source.screen_name;
		if (name == myname) return;
		var text = data.target_object.text;
		if (text.length > 40) text = text.substr(0, 40) + "...";
		var msg = _("@$1 "+data.event+"d your tweet:", name);
		try {
			notify(msg + "<br>" + text);
		} catch(e) {
			console.log(e);
		}
	} else console.log(data);
}

function ts_websocket_open() {
	if (tw_stream_ws) tw_stream_ws.close();
	console.log("ws opening ...")
	var ws = new WebSocket('wss://twgateway-neocat.rhcloud.com:8443/');
	ws.onopen = function() {
		var orig = twitterAPI;
		twitterAPI = 'https://userstream.twitter.com/1.1/';
		userstream = setupOAuthURL(twitterAPI+'user.json');
		twitterAPI = orig;
		ws.send(userstream);
		console.log("ws opened - " + userstream);
		tw_stream_ws = ws;
		ws.ping_timer = setInterval(function(){
			ws.send('ping');
			ws.pong_timer = setTimeout(function(){ ws.close(); }, 5000);
		}, 5*60*1000);
		if (ws_reopen_timer) clearTimeout(ws_reopen_timer);
		ws_reopen_timer = null;
		updateInterval = 600;
	};
	ws.onclose = function() {
		console.log("ws closed");
		console.log(ws_buffer);
		updateInterval = parseInt(readCookie('update_interval')) || 90;
		tw_stream_ws = null;
		clearInterval(ws.ping_timer);
		ws_reopen_timer = setTimeout(ts_websocket_open, updateInterval*1000);
	};
	ws.onmessage = function(e) {
		if (e.data == 'Hello' || e.data == '##pong##') {
			if (ws.pong_timer) {
				clearTimeout(ws.pong_timer);
				ws.pong_timer = null;
			}
			return;
		}
		ws_buffer += e.data;
		if (ws_buffer.indexOf('\r') >= 0) {
			ary = ws_buffer.split(/\r\n?/);
			ws_buffer = ary.pop();
			var now = new Date;
			var tw = [];
			for (var i = 0; i < ary.length; ary++) {
				if (ary[i] == '' || ary[i] == '\n') continue;
				try {
					data = JSON.parse(ary[i]);
				} catch(e) {
					console.log('JSON parse error: ' + e);
					console.log(">" + ary[i] + "<");
				}
				handle_stream_data(data, tw);
			}
			if (tw.length > 0) {
				if (now - last_update > 180*1000) {
					update_reply_counter = 0;
					update_direct_counter = 0;
					last_update = now;
				} else {
					update_reply_counter = 2;
					update_direct_counter = 2;
				}
				twShow(tw);
			}
		}
	};
}

registerPlugin({
		auth: function() {
			ts_websocket_open();
		},
		savePrefs: function() {
			if (tw_stream_ws)
				updateInterval = 600;
		},
		miscTab: function() {
			$('preps').interval.value = parseInt(readCookie('update_interval')) || 90;
		}
});

document.write('<style>#tw > div { border-bottom: none; }</style>');
