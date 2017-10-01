var tws_last_update = new Date;
var tws_ws_buffer = '';
var tws_stream_ws = null;
var tws_reopen_timer = null;

function debug(msg) {
	console.log(typeof(msg) == 'object' ? msg : new Date() + ": " + msg);
}

function tws_handle_stream_data(data, tw, ws) {
	var text_data = text(data);
	if (text_data) {
		for (var i = 0; i < ws.filter.length; i++)
			if (text_data.indexOf(ws.filter[i]) >= 0)
				return;
		tw.push(data);
	} else {
		debug(data);
	}
}

function tws_ws_open(track) {
	if (tws_stream_ws) tws_stream_ws.close();
	debug("ws opening ...");
	var ws = new WebSocket('wss://tw-twgateway.7e14.starter-us-west-2.openshiftapps.com/');
	ws.send_ping = function() {
		if (ws.readyState == ws.CLOSING || ws.readyState == ws.CLOSED)
		return ws.onerror("closed");
		ws.send('ping');
		ws.pong_timer = setTimeout(function(){ debug("ping timeout"); ws.close(); }, 10000);
	};
	ws.onopen = function() {
		var orig = twitterAPI;
		twitterAPI = 'https://stream.twitter.com/1.1/';
		var lang = '';
		var filter = [];
		track = track.replace(/\s*lang[=:](.*)\s*/, function(_, l){ lang = '&language=' + l; return ''; });
		track = (' ' + track).replace(/\s+-(\S+)/g, function(_, f) { filter.push(f); return ''; });
		track = track.replace(/^\s+|\s+$/g, '');
		track = track.replace(/^\^/, function() { filter.push('RT'); return ''; });
		ws.filter = filter;
		stream = setupOAuthURL(twitterAPI+'statuses/filter.json?track=' +
			track.replace(/^.*:/, '').replace(/ OR /g, ',').replace(/ AND /g, ' ') + lang);
		twitterAPI = orig;
		ws.send(stream);
		debug("ws opened - " + stream);
		tws_stream_ws = ws;
		ws.ping_timer = setInterval(ws.send_ping, 5*60*1000);
		ws.pong_timer = setTimeout(function(){ debug("hello timeout"); ws.close(); }, 10000);
	};
	ws.onerror = function(e) {
		ws.error_msg = e;
		if (ws.readyState == ws.CLOSING || ws.readyState == ws.CLOSED)
			ws.onclose();
		else
			ws.close();
	}
	ws.onclose = function() {
		debug("ws closed");
		debug(tws_ws_buffer);
		clearInterval(ws.ping_timer);
		if (this.error_msg)
			error("websocket closed: " + this.error_msg);
		if (tws_stream_ws == this)
			tws_stream_ws = null;
	};
	ws.onmessage = function(e) {
		if (e.data == 'Hello' || e.data == '##pong##') {
			if (ws.pong_timer) {
				clearTimeout(ws.pong_timer);
				ws.pong_timer = null;
			}
			return;
		}
		tws_ws_buffer += e.data;
		if (tws_ws_buffer.indexOf('\r') >= 0) {
			ary = tws_ws_buffer.split(/\r\n?/);
			tws_ws_buffer = ary.pop();
			var now = new Date;
			var tw = [];
			var data;
			for (var i = 0; i < ary.length; ary++) {
				if (ary[i] == '' || ary[i] == '\n') continue;
				data = null;
				try {
					data = JSON.parse(ary[i]);
				} catch(e) {
					debug('JSON parse error: ' + e);
					debug(">" + ary[i] + "<");
					if (i == 0) ws.error_msg = ary[i];
				}
				if (data) tws_handle_stream_data(data, tw, ws);
			}
			if (tw.length > 0) {
				twShowToNode(tw, $("tw2c"), false, !update && tws_page > 1, update, false, update);
			}
		}
	};
}

registerPlugin({
		switchTo: function(selected, last) {
			if (selected.tws_qn)
				tws_ws_open(selected.tws_qn);
			else if (tws_stream_ws)
				tws_stream_ws.close();
		}
});
