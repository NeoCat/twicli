var last_update = new Date;
var ws_buffer = '';

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
	} else console.log(data);
}

function ts_websocket_open() {
	var ws = new WebSocket('wss://twgateway-neocat.rhcloud.com:8443/');
	ws.onopen = function() {
		var orig = twitterAPI;
		twitterAPI = 'https://userstream.twitter.com/1.1/';
		userstream = setupOAuthURL(twitterAPI+'user.json');
		twitterAPI = orig;
		ws.send(userstream);
		console.log("ws opened - " + userstream);
	};
	ws.onclose = function() {
		console.log("ws closed");
		console.log(ws_buffer);
		var updateInterval = parseInt(readCookie('update_interval')) || 90;
		setTimeout(ts_websocket_open, updateInterval*1000);
	};
	ws.onmessage = function(e) {
		if (e.data == 'Hello') return;
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
					handle_stream_data(data, tw);
				} catch(e) {
					console.log('JSON parse error: ' + e);
					console.log(">" + ary[i] + "<");
				}
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
			updateInterval = 600;
			ts_websocket_open();
		},
		savePrefs: function() {
			updateInterval = 600;
		},
		miscTab: function() {
			$('preps').interval.value = parseInt(readCookie('update_interval')) || 90;
		}
});

document.write('<style>#tw > div { border-bottom: none; }</style>');
