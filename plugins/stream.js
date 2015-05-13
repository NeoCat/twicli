langResources['@$1 favorited your tweet:'] = ['@$1 がツイートをお気に入りに追加しました:'];
langResources['@$1 unfavorited your tweet:'] = ['@$1 がツイートをお気に入りから削除しました:'];

var last_update = new Date;
var ws_buffer = '';
var tw_stream_ws = null;
var ws_reopen_timer = null;
var ws_blocked = {};

function ws_blocked_get(cursor) {
	xds.load(twitterAPI + 'blocks/ids.json?stringify_ids=true&cursor='+cursor,
		function(blocks) {
			for (var i = 0; i < blocks.ids.length; i++)
				ws_blocked[blocks.ids[i]] = 1;
			if (blocks.next_cursor)
				ws_blocked_get(blocks.next_cursor_str);
		});
}

function debug(msg) {
	console.log(typeof(msg) == 'object' ? msg : new Date() + ": " + msg);
}

function handle_stream_data(data, tw) {
	handled = true;
	if (data.text) {
		if (!ws_blocked[data.user.id_str])
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
		callPlugins('newDM', data.direct_message);
	} else if (data.event && (data.event == "favorite" || data.event == "unfavorite")) {
		var name = data.source.screen_name;
		if (name == myname) return;
		var text = data.target_object.text;
		if (text.length > 40) text = text.substr(0, 40) + "...";
		var msg = _("@$1 "+data.event+"d your tweet:", name);
		try {
			notify(msg + "<br>" + text);
		} catch(e) {
			debug(e);
		}
		callPlugins(data.event+"d", data);
	} else if (data.event && data.event == "follow") {
		callPlugins("followed", data.source);
	} else if (data.event && data.event == "block") {
		ws_blocked[data.target.id_str] = 1;
	} else if (data.event && data.event == "unblock") {
		ws_blocked[data.target.id_str] = 0;
	} else {
		handled = false;
		debug(data);
	}
	if (handled)
		tw_stream_ws.renew_reconnect_timer();
}

function ws_open() {
	if (tw_stream_ws) tw_stream_ws.close();
	debug("ws opening ...")
	var ws = new WebSocket('wss://twgateway-neocat.rhcloud.com:8443/');
	ws.send_ping = function() {
		if (ws.readyState == ws.CLOSING || ws.readyState == ws.CLOSED)
		return ws.onerror("closed");
		ws.send('ping');
		ws.pong_timer = setTimeout(function(){ debug("ping timeout"); ws.close(); }, 10000);
	};
	ws.renew_reconnect_timer = function() {
		if (ws.reconnect_timer) clearTimeout(ws.reconnect_timer);
		ws.reconnect_timer = setTimeout(function(){ debug('reconnect'); ws_open(); }, 180000);
	};
	ws.onopen = function() {
		var orig = twitterAPI;
		twitterAPI = 'https://userstream.twitter.com/1.1/';
		userstream = setupOAuthURL(twitterAPI+'user.json');
		twitterAPI = orig;
		ws.send(userstream);
		debug("ws opened - " + userstream);
		tw_stream_ws = ws;
		ws.ping_timer = setInterval(ws.send_ping, 5*60*1000);
		ws.pong_timer = setTimeout(function(){ debug("hello timeout"); ws.close(); }, 10000);
		ws.renew_reconnect_timer();
		if (ws_reopen_timer) clearTimeout(ws_reopen_timer);
		ws_reopen_timer = null;
		updateInterval = 600;
	};
	ws.onerror = function(e) {
		debug("ws error: " + e);
		if (ws.readyState == ws.CLOSING || ws.readyState == ws.CLOSED)
			ws.onclose();
		else
			ws.close();
	}
	ws.onclose = function() {
		debug("ws closed");
		debug(ws_buffer);
		updateInterval = parseInt(readCookie('update_interval')) || 90;
		clearInterval(ws.ping_timer);
		clearInterval(ws.reconnect_timer);
		if (tw_stream_ws == this)
			tw_stream_ws = null;
		if (!tw_stream_ws)
			ws_reopen_timer = setTimeout(ws_open, updateInterval*1000 - 15000);
		update();
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
					debug('JSON parse error: ' + e);
					debug(">" + ary[i] + "<");
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
			ws_blocked_get("-1");
			ws_open();
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
