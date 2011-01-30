// common

function $(id) { return document.getElementById(id); }
// 文字参照をデコード
function charRef(s) {
	var ele = document.createElement("div");
	ele.innerHTML = s;
	return ele.firstChild.nodeValue;
}
// フォームをシリアライズ
function serializeForm(f) {
	var url = '';
	for (var e = 0; e < f.elements.length; e++) {
		var input = f.elements[e];
		if (input.name && input.value)
			url += (url == '' ? '?' : '&') + input.name + "=" + encodeURIComponent(input.value);
	}
	return url;
}
// OAuth用formに引数を設定(Twitter APIのみ)
function setupOAuthArgs(args) {
	var api_args = $("api_args");
	api_args.innerHTML = "";
	if (args) {
		args = args.split("&");
		for (var i = 0; i < args.length; i++) {
			var v = args[i].split("=");
			var el = document.createElement("input");
			el.type = "hidden";
			el.name = v[0];
			el.value = decodeURIComponent(v[1]);
			api_args.appendChild(el);
		}
	}
}
function setupOAuthURL(url, post) {
	if (url.indexOf(twitterAPI) != 0) return url;
	if (!post && ratelimit_reset_time && new Date < ratelimit_reset_time) return false;
	url = url.split("?");
	setupOAuthArgs(url[1]);
	document.request.method = post ? 'POST' : 'GET';
	document.etc.URL.value = url[0];
	consumer.signForm(document.request, document.etc);
	return document.etc.URL.value + (!post ? serializeForm(document.request) : '');
}
// クロスドメインJavaScript呼び出し(Twitter APIはOAuth認証)
function loadXDomainScript(url, ele) {
	url = setupOAuthURL(url);
	if (!url) return ele;
	if (ele && ele.parentNode)
		ele.parentNode.removeChild(ele);
	ele = document.createElement("script");
	ele.src = url;
	ele.type = "text/javascript";
	document.body.appendChild(ele);
	return ele;
}
// クロスドメインJavaScript呼び出し(クラスバージョン, Twitter APIはOAuth認証)
function XDomainScript() {
	this.cb_cnt = (new Date).getTime();
}
XDomainScript.prototype = {
	load: function(url, callback, callback_key) {
		var id = this.cb_cnt++;
		url += (url.indexOf('?') < 0 ? '?' : '&') + (callback_key ? callback_key : 'callback') + '=xds.cb' + id;
		var ele = document.createElement("script");
		ele.src = setupOAuthURL(url);
		ele.type = "text/javascript";
		this['cbe' + id] = ele;
		this['cb' + id] = function(){ this.abort(id); callback.apply(this, arguments); };
		document.body.appendChild(ele);
		return id;
	},
	abort: function(id) {
		var ele = this['cbe' + id];
		if (ele && ele.parentNode) ele.parentNode.removeChild(ele);
		if (this['cb' + id]) delete this['cb' + id];
		if (this['cbe' + id]) delete this['cbe' + id];
	}
};
var xds = new XDomainScript;
// 動的にフレームを生成してPOSTを投げる(Twitter APIはOAuth認証)
var postQueue = [];
function enqueuePost(url, done, err) {
	postQueue.push([url, done, err]);
	if (postQueue.length > 1) // 複数リクエストを同時に投げないようキューイング
		return;
	postNext();
}
function postNext() {
	if (postQueue.length) {
		postInIFrame(postQueue[0][0], postQueue[0][1], postQueue[0][2]);
	}
}
var postSeq = 0;
function postInIFrame(url, done, err) {
	var frm = url.indexOf(twitterAPI) == 0 ? document.request : document.post;
	frm.action = setupOAuthURL(url, true);
	frm.target = "pfr" + (++postSeq);
	var pfr = document.createElement("iframe"); // formのtargetとなるiframeを生成
	pfr.name = "pfr" + postSeq;
	pfr.src = "about:blank";
	pfr.style.display = "none";
	var errTimer = false;
	if (err) {  // 10秒で正常終了しなければエラーとみなす
		errTimer = setTimeout(function(){
			err();
			pfr.parentNode && pfr.parentNode.removeChild(pfr);
			postQueue.shift();
			postNext();
		}, 100000);
	}
	var cnt = 0;
	var onload = pfr.onload = function(){
		if (cnt++ == 0) {
			setTimeout(function(){frm.submit();}, 0);
		} else {
			clearTimeout(errTimer);
			done();
			setTimeout(function(){
				pfr.parentNode && pfr.parentNode.removeChild(pfr);
				postQueue.shift();
				postNext();
			}, 0);
		}
	};
	if ('v'=='\v') pfr.onreadystatechange = function(){ /* for IE */
		if (this.readyState == "complete") {
			pfr.contentWindow.name = pfr.name;
			onload();
		}
	};
	document.body.appendChild(pfr);
}
// 要素の位置を取得
function cumulativeOffset(ele) {
	var top = 0, left = 0;
	do {
		top += ele.offsetTop  || 0;
		left += ele.offsetLeft || 0;
		ele = ele.offsetParent;
	} while (ele);
	return [left, top];
}
// スクロール
if (navigator.userAgent.indexOf('iPhone') >= 0)
	window.scrollBy = function(x,y) { scrollTo(x+window.pageXOffset,y+window.pageYOffset) };
var scroll_adjust = 0;
var scroll_duration;
var scroll_timer = null;
function getScrollY() { return window.pageYOffset || document.body.scrollTop || document.documentElement.scrollTop; }
function scrollToY(y, total, start) {
	if (scroll_timer) clearTimeout(scroll_timer);
	scroll_timer = null;
	var t = (new Date).getTime();
	start = start || t;
	total = total || y - getScrollY();
	if (start == t) scroll_adjust = 0;
	if (start == t) scroll_duration = Math.min(500, Math.abs(total));
	y += scroll_adjust;
	scroll_adjust = 0;
	if (start+scroll_duration <= t)
		return scrollTo(0, y);
	var pix = Math.ceil(total*(1-Math.cos((t-start)/scroll_duration*Math.PI))/2);
	scrollTo(0, y-total+pix);
	scroll_timer = setTimeout(function(){scrollToY(y, total, start)}, 20);
}
function scrollToDiv(d, top_margin) {
	top_margin = top_margin || 0;
	var top = cumulativeOffset(d)[1];
	var h = d.offsetHeight;
	var sc_top = document.body.scrollTop || document.documentElement.scrollTop;
	var win_h = window.innerHeight || document.documentElement.clientHeight;
	if (top < sc_top+top_margin) scrollToY(top-top_margin);
	if (sc_top+win_h < top+h) scrollToY(top+h-win_h);
}
// DOM Storage (or Cookie)
var use_local_storage = true;
try {
	window.sessionStorage; /* check DOM storage is accessible */
	if (!window.localStorage) window.localStorage = window.globalStorage && window.globalStorage[location.hostname];
} catch(e) { use_local_storage = false; }
if (location.search.indexOf("cookie=1") >= 0) use_local_storage = false;
function readCookie(key) {
	try {
		if (use_local_storage && window.localStorage && window.localStorage["twicli_"+key])
			return String(window.localStorage["twicli_"+key]);
	} catch(e) { return null; }
	key += "=";
	var scookie = document.cookie + ";";
	start = scookie.indexOf(key);
	if (start >= 0) {
		var end = scookie.indexOf(";", start);
		return unescape(scookie.substring(start + key.length, end));
	}
	return null;
}
function writeCookie(key, val, days) {
	if (use_local_storage && window.localStorage)
		try {
			deleteCookie(key); // to avoid exception on iPad
			window.localStorage["twicli_"+key] = val;
		} catch(e) {
			alert("DOM storage write error!\n" + e);
		}
	else {
		var sday = new Date();
		sday.setTime(sday.getTime() + (days * 1000 * 60 * 60 * 24));
		document.cookie = key + "=" + escape(val) + ";expires=" + sday.toGMTString();
	}
}
function deleteCookie(key) {
	try { delete window.localStorage["twicli_"+key]; } catch(e) {}
	var sday = new Date();
	sday.setTime(sday.getTime() - 1);
	document.cookie = key + "=;expires=" + sday.toGMTString();
}

// Array#mapの再実装(Opera用)
if (!Array.prototype.map) {
	Array.prototype.map = function(fun) {
		var len = this.length;
		var res = new Array(len);
		var thisp = arguments[1];
		for (var i = 0; i < len; i++)
			if (i in this)
				res[i] = fun.call(thisp, this[i], i, this);
		return res;
	};
}
// Array#uniqの再実装
Array.prototype.uniq = function() {
	for (var i = 0, l = this.length; i < l; i++)
		for (var j = 0; j < i; j++)
			if (this[i] === this[j])
				this.splice(i--, l-- && 1);
	return this;
};
// 言語リソースをルックアップ
var browser_lang = navigator.browserLanguage || navigator.language || navigator.userLanguage || 'en';
var browser_lang0 = browser_lang.split('-')[0];
if (!langNames[browser_lang] && langNames[browser_lang0]) browser_lang = browser_lang0;
var user_lang = readCookie('user_lang') || browser_lang;
var lang;
for (lang = 0; lang < langList.length; lang++)
	if (langList[lang] == user_lang) break;
function _(key) {
	if (!langResources[key])
		alert("no langResource\n\n"+key);
	else
		key = langResources[key][lang] || key;
	var args = arguments;
	return key.replace(/\$(\d+)/, function(x,n){ return args[parseInt(n)] });
}
// user-defined CSS
var user_style = readCookie('user_style') || "";
document.write('<style>' + user_style + '</style>');


// twicli用変数

var twitterURL = 'http://twitter.com/';
var twitterAPI = 'http://api.twitter.com/1/';
var myname = null;		// 自ユーザ名
var myid = null;		// 自ユーザID
var last_user = null;	// user TLに表示するユーザ名
var last_user_info = null;	// user TLに表示するユーザ情報(TLから切替時のキャッシュ)
// 設定値
var cookieVer = parseInt(readCookie('ver')) || 0;
var updateInterval = (cookieVer>3) && parseInt(readCookie('update_interval')) || 60;
var pluginstr = (cookieVer>6) && readCookie('tw_plugins') || ' ssl.js\nregexp.js\nlists.js\noutputz.js\nsearch.js\nsearch2.js\nfavotter.js\nfollowers.js\nshorten_url.js\nresolve_url.js';
if (!(cookieVer>7)) pluginstr+="\ntranslate.js\nscroll.js";
if (!(cookieVer>8)) pluginstr+="\nthumbnail.js";
//if (!(cookieVer>9)) pluginstr=" worldcup-2010.js\n" + pluginstr.substr(1);
if (!(cookieVer>10)) pluginstr = pluginstr.replace(/worldcup-2010\.js[\r\n]+/,'');
if (!(cookieVer>10)) pluginstr+="\ngeomap.js";
pluginstr = pluginstr.substr(1);
var plugins = new Array;
var max_count = Math.min((cookieVer>3) && parseInt(readCookie('max_count')) || 50, 200);
var max_count_u = Math.min(parseInt(readCookie('max_count_u')) || 50, 200);;
var nr_limit = Math.max(max_count*2.5, parseInt(readCookie('limit')) || 500);		// 表示する発言数の上限
var auto_update = parseInt(readCookie('auto_update') || "1");		// POST後に自動アップデート
var no_since_id = parseInt(readCookie('no_since_id') || "0");		// since_idを使用しない
var no_counter = parseInt(readCookie('no_counter') || "0");			// 発言文字数カウンタを無効化
var no_resize_fst = parseInt(readCookie('no_resize_fst') || "0");	// フィールドの自動リサイズを無効化
var replies_in_tl = parseInt(readCookie('replies_in_tl') || "1");	// フォロー外からのReplyをTLに表示
var display_as_rt = parseInt(readCookie('display_as_rt') || "0");	// Retweetを"RT @〜: …"形式で表示
var footer = readCookie('footer') || ""; 							// フッタ文字列
var decr_enter = parseInt(readCookie('decr_enter') || "0");			// Shift/Ctrl+Enterで投稿
var no_geotag = parseInt(readCookie('no_geotag') || "0");			// GeoTaggingを無効化
// TL管理用
var cur_page = 1;				// 現在表示中のページ
var nr_page = 0;				// 次に取得するページ
var nr_page_re = 0;				// 次に取得するページ(reply用)
var get_next_func = getOldTL;	// 次ページ取得関数
var since_id = null;			// TLの最終since_id
var since_id_reply = null;		// Replyの最終since_id
var in_reply_to_user = null;	// 発言の返信先ユーザ
var in_reply_to_status_id = null;// 発言の返信先id
// クロスドメイン通信関連
var seq = (new Date).getTime();
var users_log = [];
var users_xds = [];
var auth_ele = null;
var update_ele = null;
var update_ele2 = null;
var relation_ele = null;
var reply_ele = null;
var reply_ele2 = null;
var direct_ele1 = null;
var direct_ele2 = null;
var direct1 = null;
var direct2 = null;
// UI関連
var user_pick1 = null;			// [⇔]で表示するユーザ名1
var user_pick2 = null;			// [⇔]で表示するユーザ名2
var popup_user = null;			// ポップアップメニューが選択されたユーザ名
var popup_id = null;			// ポップアップメニューが選択された発言ID
var popup_ele = null;			// ポップアップメニューが選択された発言ノード
var fav_mode = 0;				// Userタブで 1: fav表示中  2: following表示中  3: followers表示中
var rep_top = 0;				// replyのオーバーレイ位置
var rep_trace_id = null;		// replyのオーバーレイに追加する発言ID
var popup_top = 0;				// ポップアップメニューの表示位置
var min_fst_height = 30;		// 発言欄の最小の高さ
var selected_menu;				// 選択中のタブ
var update_timer = null;
var update_reply_counter = 0;
var update_direct_counter = 0;
var key_press_detected = false;
var last_post = null;
var last_in_reply_to_user = null;
var last_in_reply_to_status_id = null;
var last_direct_id = null;
var geo = null;
var geowatch = null;
var ratelimit_reset_time = null;

//ログイン・自ユーザ名受信
var access_token = readCookie('access_token');
var access_secret = readCookie('access_secret');
if (!access_token || !access_secret) location.href = 'oauth/index.html';

//URL(?status=〜)から発言入力
if (location.search.match(/[?&]status=(.*?)(?:&|$)/)) {
	writeCookie('twicli_onload', decodeURIComponent(RegExp.$1));
	location.href = "twicli.html";
} else {
	setTimeout(function(){
		if ($("fst") && $("fst").value = readCookie('twicli_onload') || '') {
			deleteCookie('twicli_onload');
		}
	}, 0);
}

function twAuth(a) {
	if (a.error) {
		alert(a.error);
		if (a.error == "Incorrect signature" || a.error.indexOf("Could not authenticate") >= 0)
			logout();
		return;
	}
	if (!myname || myname != a.screen_name) {
		myname = last_user = a.screen_name;
		last_user_info = a;
		myid = a.id;
		writeCookie('access_user', myname+'|'+myid, 3652);
		$("user").innerHTML = last_user;
		update();
	}
	if (!no_geotag && a.geo_enabled && navigator.geolocation) {
		$("option").innerHTML += '<div id="geotag"><a href="javascript:toggleGeoTag()"><img align="left" id="geotag-img" src="images/earth_off.png">'+_('GeoTagging')+' <span id="geotag-st">OFF</span></a><small id="geotag-info"></small></div>';
		setFstHeight(min_fst_height, true);
	}
	callPlugins('auth');
}
function auth() {
	var name = readCookie('access_user');
	if (name) {
		name = name.split('|');
		myname = last_user = name[0];
		myid = name[1];
		$("user").innerHTML = last_user;
		update();
	}
	auth_ele = loadXDomainScript(twitterAPI + "account/verify_credentials.json?suppress_response_codes=true&callback=twAuth", auth_ele);
}

function logout() {
	if (!confirm(_('Are you sure to logout? You need to re-authenticate twicli at next launch.')))
		return;
	callPlugins('logout');
	deleteCookie('access_token');
	deleteCookie('access_secret');
	deleteCookie('access_user');
	location.href = 'oauth/index.html';
}

function error(str) {
	if (str.indexOf('Rate limit exceeded.') == 0) {
		if (ratelimit_reset_time && new Date < ratelimit_reset_time)
			return;
		else
			update_ele2 = loadXDomainScript(twitterAPI + 'account/rate_limit_status.json' +
											'?id=' + myname + '&callback=twLimit2', update_ele2);
	}
	$('loading').style.display = 'none';
	alert(str);
}

// enterキーで発言, "r"入力で再投稿, 空欄でTL更新
function press(e) {
	if (e != 1) key_press_detected = true;
	if (e != 1 && (e.keyCode != 13 && e.keyCode != 10 ||
		!decr_enter && (e.ctrlKey || e.shiftKey) || decr_enter && !(e.ctrlKey || e.shiftKey)) )
			return true;
	var st = document.frm.status;
	if (!key_press_detected) st.value = st.value.replace(/\n/g, "");
	if (st.value == '') {
		$("loading").style.display = "block";
		update();
		return false;
	}
	if (st.value.length + footer.length > 140) {
		alert(_("This tweet is too long."));
		return false;
	}
	if (st.value == "r" && last_post) {
		st.value = last_post;
		in_reply_to_user = last_in_reply_to_user;
		setReplyId(last_in_reply_to_status_id);
	}
	last_post = st.value;
	last_in_reply_to_user = in_reply_to_user;
	last_in_reply_to_status_id = in_reply_to_status_id;
	if (st.value.substr(0,1) == "." || st.value.indexOf("@"+in_reply_to_user) < 0)
		setReplyId(false); // "."で始まるか"@ユーザ名"が含まれていない時はin_reply_to指定無し
	callPlugins("post", st.value);
	st.value += footer;
	st.select();
	enqueuePost(twitterAPI + 'statuses/update.xml?status=' + encodeURIComponent(st.value) +
				(geo && geo.coords ?  "&display_coordinates=true&lat=" + geo.coords.latitude +
										"&long=" + geo.coords.longitude : "") +
				(in_reply_to_status_id ? "&in_reply_to_status_id=" + in_reply_to_status_id : ""),
				function(){ resetFrm(); if (auto_update) update() });
	in_reply_to_user = in_reply_to_status_id = null;
	return false;
}
// GeoTag
function toggleGeoTag() {
	if (!geowatch) {
		geowatch = navigator.geolocation.watchPosition(function(g){
			geo = g;
			var maplink = typeof(display_map) == 'function';
			$("geotag-info").innerHTML = " : " + (maplink ? '<a href="javascript:display_map([geo.coords.latitude, geo.coords.longitude, geo.coords.accuracy], $(\'geotag-info\'))">' : '') + g.coords.latitude + ", " + g.coords.longitude + " (" + g.coords.accuracy + "m)" + (maplink ? '</a>' : '');
			setFstHeight(null, true);
		});
		$("geotag-img").src = "images/earth.png";
		$("geotag-st").innerHTML = "ON";
		$("geotag-info").innerHTML = " : -";
	} else {
		navigator.geolocation.clearWatch(geowatch);
		geo = geowatch = null;
		$("geotag-img").src = "images/earth_off.png";
		$("geotag-st").innerHTML = "OFF";
		$("geotag-info").innerHTML = "";
		setFstHeight(null, true);
	}
}
// フォームリサイズ
function setFstHeight(h, force) {
	if (!h)
		h = $("fst").value.length ? Math.max($("fst").scrollHeight+2,min_fst_height) : min_fst_height;
	if (no_resize_fst && !force) return;
	var exh = (navigator.userAgent.indexOf("MSIE 8") >= 0 ? 1 : 0), opt = $("option").clientHeight;
	$("fst").style.height = h;
	$("option").style.top = h + 2;
	$("menu").style.top = $("counter-div").style.top = h+3+exh*5 + opt;
	var mh = Math.max($("menu").clientHeight, $("menu2").clientHeight);
	$("control").style.height = h+mh+2+exh*5 + opt;
	$("tw").style.top = $("tw2").style.top = $("re").style.top = h+mh+3+exh*4 + opt;
}
if (navigator.userAgent.indexOf('iPhone') < 0)
	window.onresize = function(){ setFstHeight(null, true); }
// 発言文字数カウンタ表示・更新
function updateCount() {
	setFstHeight();
	if (no_counter) return;
	$("counter-div").style.display = "block";
	$("counter").innerHTML = 140 - footer.length - $("fst").value.length;
}
// フォームの初期化
function resetFrm() {
	document.frm.reset();
	setReplyId(false);
	if ($("counter-div").style.display == "block") updateCount();
	setFstHeight(min_fst_height);
}
// reply先の設定/解除
function setReplyId(id) {
	in_reply_to_status_id = id;
}
// reply先を設定
function replyTo(user, id) {
	in_reply_to_user = user;
	var head = (selected_menu.id == "direct" ? "d " : "@") + user + " ";
	if (document.frm.status.value.indexOf(head) !== 0) // 連続押しガード
		document.frm.status.value = head + document.frm.status.value;
	setReplyId(id);
	document.frm.status.select();
}
// reply先を表示
function dispReply(user, id, ele, cascade) {
	user_pick1 = user;
	var e = !cascade && (window.event || arguments.callee.caller.arguments[0]);
	var shiftkey = e && (e.shiftKey || e.modifiers & 4);
	var td = $((selected_menu.id == "TL" ? "tw" : selected_menu.id == "reply" ? "re" : "tw2c") + "-" + id);
	if (td && td.style.display == "none") td = null;
	var rd = $('reps-' + id);
	// 通常　　  → 反転表示 (rdあり) or オーバーレイ表示
	// shiftキー → 反転表示 (td優先) or オーバーレイ表示(td/rdなし)
	var d = shiftkey ? td || rd : rd || td;
	if (!shiftkey && !rd || shiftkey && !d || cascade) {
		// オーバーレイ表示
		var ele_top = cumulativeOffset(ele)[1] + 20;
		if (ele.parentNode.parentNode.id == "reps" || ele.parentNode.parentNode.parentNode.id == "reps" || cascade)
			rep_trace_id = id;
		else
			rep_top = ele_top;
		d = d || $("tw-" + id) || $("re-" + id) || $("tw2c-" + id);
		if (d && d.tw) {
			dispReply2(d.tw);
			return;
		}
		if (cascade) return;
		$("loading").style.display = "block";
		reply_ele = loadXDomainScript(twitterAPI + 'statuses/show/'+id+'.json?suppress_response_codes=true&callback=dispReply2', reply_ele);
		return;
	}
	// 反転表示
	if (d.parentNode.id != 'reps')
		closeRep();
	scrollToDiv(d);
	d.className += ' emp';
	setTimeout(function(){d.className = d.className.replace(' emp','')}, 2000);
}
// reply先をoverlay表示 (Timelineに無い場合)
function dispReply2(tw) {
	$("loading").style.display = "none";
	if (tw.error) return error(tw.error);
	var id = tw.id_str || tw.id;
	if ($('rep').style.display == 'block' && $('reps-'+id)) // already displayed
		return;
	var el = document.createElement("div");
	el.id = 'reps-'+id;
	el.innerHTML = makeHTML(tw, false, 'reps');
	el.tw = tw;
	callPlugins("newMessageElement", el, tw, 'reps');
	if (!rep_trace_id || id != rep_trace_id) {
		$('reps').innerHTML = '';
		$('rep').style.top = rep_top;
	} else
		$('reps').appendChild(document.createElement('hr'));
	$('reps').appendChild(el);
	$('rep').style.display = "block";
	scrollToDiv($('rep'));
	user_pick2 = tw.user.screen_name;
	var in_reply_to = tw.in_reply_to_status_id_str || tw.in_reply_to_status_id;
	if (in_reply_to) {
		var d = $("tw-" + in_reply_to) || $("re-" + in_reply_to) || $("tw2c-" + in_reply_to);
		if (d)
			dispReply(tw.user.screen_name, in_reply_to, $('reps') /* この引数は使われない */, true);
	}
}
// replyのoverlay表示を閉じる
function closeRep() {
	callPlugins('closeRep');
	$('rep').style.display = 'none';
	$('reps').innerHTML = '';
	rep_trace_id = null;
}
// replyからユーザ間のタイムラインを取得
function pickup2() {
	if (user_pick1 && user_pick2)
		switchUser(user_pick1 + "," + user_pick2);
}
// ポップアップメニューの初期化
function popup_init() {
	var popup_id_list = ['popup_link_user', 'popup_link_status', 'popup_status_delete',
						'popup_status_retweet', 'popup_status_quote',
						'upopup_user_block', 'upopup_user_unblock', 'upopup_user_spam'];
	for (var x = 0; x < popup_id_list.length; x++)
		$(popup_id_list[x]).innerHTML = _($(popup_id_list[x]).innerHTML);
}
// ポップアップメニューを表示
function popup_menu(user, id, ele) {
	popup_user = user;
	popup_id = id;
	popup_ele = ele.parentNode.parentNode;
	callPlugins("popup", $('popup'), user, id, ele);
	$('popup_link_user').href = twitterURL + user;
	$('popup_link_status').href = twitterURL + user + '/statuses/' + id;
	$('popup_status_delete').style.display = (selected_menu.id == "direct" || user == myname ? "block" : "none");
	$('popup_status_retweet').style.display = (selected_menu.id != "direct" ? "block" : "none");
	$('popup_status_quote').style.display = (selected_menu.id != "direct" ? "block" : "none");
	$('popup').style.display = "block";
	var pos = cumulativeOffset(ele);
	$('popup').style.left = pos[0] <  $('popup').offsetWidth - ele.offsetWidth ? 0 : pos[0] - $('popup').offsetWidth + ele.offsetWidth;
	$('popup').style.top = popup_top = pos[1] + 20;
	$('popup_hide').style.height = Math.max(document.body.scrollHeight, $("tw").offsetHeight+$("control").offsetHeight);
	$('popup_hide').style.display = "block";
}
// ポップアップメニューを非表示
function popup_hide() {
	$('popup').style.display = 'none';
	$('userinfo_popup').style.display = 'none';
	$('popup_hide').style.display = 'none';
	popup_user = popup_id = popup_ele = null;
}
// ユーザ情報のポップアップメニューを表示
function userinfo_popup_menu(user, id, ele) {
	popup_user = user;
	popup_id = id;
	callPlugins("userinfo_popup", $('userinfo_popup'), user, id, ele);
	$('userinfo_popup').style.display = "block";
	var pos = cumulativeOffset(ele);
	$('userinfo_popup').style.left = pos[0] <  $('userinfo_popup').offsetWidth - ele.offsetWidth ? 0 : pos[0] - $('userinfo_popup').offsetWidth + ele.offsetWidth;
	$('userinfo_popup').style.top = pos[1] + 20;
	$('popup_hide').style.height = Math.max(document.body.scrollHeight, $("tw").offsetHeight+$("control").offsetHeight);
	$('popup_hide').style.display = "block";
}
// 発言のReTweet
function retweetStatus(id, ele) {
	id = id || popup_id;
	ele = ele || popup_ele;
	if (!id) return false;
	if ($('lock-' + ele.id)) {
		error(_("This tweet is protected."));
		return false;
	}
	if (!confirm(_("Retweet to your followers?"))) return false;
	$("loading").style.display = "block";
	var target_ele = ele;
	enqueuePost(twitterAPI + 'statuses/retweet/' + id + '.xml',
		function(){
			$("loading").style.display = "none";
			var img = document.createElement("img");
			img.src = "images/rt.png";
			target_ele.insertBefore(img, target_ele.childNodes[target_ele.childNodes.length-1]);
		});
	return false;
}
// 発言をRT付きで引用
function quoteStatus(id, user, ele) {
	id = id || popup_id;
	user = user || popup_user;
	ele = ele || popup_ele;
	if (!id) return false;
	if ($('lock-' + ele.id) && !confirm(_("This tweet is protected; Are you sure to retweet?"))) return false;
	var tw = !display_as_rt && ele.tw.retweeted_status || ele.tw;
	$('fst').value = "RT @"+user+": " + charRef(tw.text);
	$('fst').focus(); $('fst').select();
	return false;
}
// 発言の削除
function deleteStatus(id) {
	id = id || popup_id;
	if (!id) return false;
	if (!confirm(_('Are you sure to delete this tweet?'))) return false;
	$("loading").style.display = "block";
	for (var i = 0; i < 3; i++) {
		var target = $(['tw-','re-','tw2c-'][i]+id);
		if (target) target.className += " deleted";
	}
	enqueuePost(twitterAPI + (selected_menu.id == 'direct'?'direct_messages':'statuses') + '/destroy/' + id + '.xml',
		function(){$("loading").style.display = "none";}, function(){$("loading").style.display = "none";});
	return false;
}
// 最新タイムラインを取得
function update() {
	if (!myname) return auth();
	callPlugins("update");
	update_ele = loadXDomainScript(twitterAPI + 'statuses/home_timeline.json' +
						'?count=' + (since_id ? 200 : max_count) +
						'&suppress_response_codes=true&callback=twShow' + (!no_since_id && since_id ? '&since_id='+since_id : ''), update_ele);
	resetUpdateTimer();
}
function resetUpdateTimer() {
	if (update_timer) clearInterval(update_timer);
	update_timer = setInterval(update, Math.max(parseInt(updateInterval||5)*1000, 5000));
}
// 外部リンクを開く際のフック
function link(a) { return true; }
// tweetのHTML表現を生成
function dateFmt(d) {
	d = new Date(typeof(d)=='string' ? d.replace('+','GMT+') : d);
	function d2(dig) { return (dig>9?"":"0") + dig }
	return (d.getMonth()+1) + "/" + d.getDate() + " " + d.getHours() + ":" + d2(d.getMinutes()) + ":" + d2(d.getSeconds());
}
function insertPDF(str) {
	var k = 0;
	for (var i = 0; i < str.length; i++) {
		if (str[i] == "\u202A" || str[i] == "\u202B" || str[i] == "\u202D" || str[i] == "\u202E")
			k++;
		else if (str[i] == "\u202C" && i > 0)
			k--;
	}
	while (k--)
		str += "\u202C"
	return str;
}
function makeHTML(tw, no_name, pid) {
	var rt = tw.retweeted_status;
	var rs = tw.retweeted_status || tw;
	var rt_mode = !!(display_as_rt || fav_mode == 2 || fav_mode == 3);
	var t = rt_mode ? tw : rs;
	var text = t.text;
	var un = t.user.screen_name;
	if (display_as_rt || fav_mode == 2 || fav_mode == 3)
		text = rt && rt.user ? "RT @" + rt.user.screen_name + ":" + rt.text : tw.text;
	var id = tw.id_str || tw.id;
	var id2 = t.id_str || t.id;
	var eid = pid+'-'+id;
	var in_reply_to = t.in_reply_to_status_id_str || t.in_reply_to_status_id;
	return /*fav*/ '<img alt="☆" class="fav" src="http://assets3.twitter.com/images/icon_star_'+(!rt&&rs.favorited?'full':'empty')+'.gif" ' +
			'onClick="fav(this,\'' + id + '\')"' + (pid ? ' id="fav-'+eid+'"' : '') + '>' +
		 (!no_name || (!display_as_rt && rt) ?
			//ユーザアイコン
			(t.user.url ? '<a target="_blank" href="'+t.user.url+'" onclick="return link(this);">' : '') +
			'<img class="uicon" src="' + t.user.profile_image_url + '">' + (t.user.url ? '</a>' : '') +
			//名前
			'<a href="' + twitterURL + un + '" onClick="switchUserTL(this.parentNode,'+rt_mode+');return false"><span class="uid">' + un + '</span>' +
			 /*プロフィールの名前*/ (t.user.name!=un ? '<span class="uname">('+insertPDF(t.user.name)+')</span>' : '') + '</a>'
		: '') +
		 /* protected? */ (t.user.protected ? '<img alt="lock" id="lock-' + eid + '" class="lock" src="http://assets0.twitter.com/images/icon_lock.gif">' : '') +
		/*ダイレクトメッセージの方向*/ (t.d_dir == 1 ? '<span class="dir">→</span> ' : t.d_dir == 2 ? '<span class="dir">←</span> ' : '') +
		//本文 (https〜をリンクに置換 + @を本家リンク+JavaScriptに置換)
		" <span id=\"text-" + eid + "\" class=\"status\">" +
		text.replace(/https?:\/\/[\w!#$%&'()*+,.\/:;=?@~-]+(?=&\w+;)|https?:\/\/[\w!#$%&'()*+,.\/:;=?@~-]+|[@＠]([\/\w-]+)/g, function(_,u){
				if (!u) {
					var paren = '';
					if (_.substr(_.length-1) == ')') { // 末尾の")"はURLに含めない
						_ = _.substr(0, _.length-1);
						paren = ')';
					}
					return "<a class=\"link\" target=\"_blank\" href=\""+_+"\" onclick=\"return link(this);\">"+_+"</a>"+paren;
				}
				if (u.indexOf('/') > 0) return "<a target=\"_blank\" href=\""+twitterURL+u+"\" onclick=\"return link(this);\">"+_+"</a>";
				return "<a href=\""+twitterURL+u+"\" onClick=\"switchUser('"+u+"'); return false;\" >"+_+"</a>";
			}).replace(/\r?\n|\r/g, "<br>") + '</span>' +
		//Retweet情報
		' <span id="rtinfo-'+eid+'" class="rtinfo">' +
		(!display_as_rt && rt ? "<img src=\"images/rt.png\" alt=\"RT\">by <img src=\""+tw.user.profile_image_url+"\" alt=\""+tw.user.screen_name+"\" class=\"rtuicon\"><a href=\""+twitterURL+tw.user.screen_name+"\" onclick=\"switchUserTL(this.parentNode.parentNode, true);return false\">" + tw.user.screen_name + "</a> " :'') + '</span>' +
		//日付
		' <span id="utils-'+eid+'" class="utils">' +
		'<span class="prop"><a class="date" target="twitter" href="'+twitterURL+(t.d_dir ? '#!/messages' : un+'/statuses/'+id2)+'">' + dateFmt(t.created_at) + '</a>' +
		//クライアント
		(t.source ? '<span class="separator"> / </span><span class="source">' + t.source.replace(/<a /,'<a target="twitter"') + '</span>' : '') + '</span>' +
		//Geolocation
		(rs.geo && rs.geo.type == 'Point' ? '<a class="button geomap" id="geomap-' + eid + '" target="_blank" href="http://maps.google.com?q=' + rs.geo.coordinates.join(',') + '" onclick="return link(this);"><img src="images/marker.png" alt="geolocation" title="' + rs.geo.coordinates.join(',') + '"></a>' : '') +
		//返信先を設定
		' <a class="button reply" href="javascript:replyTo(\'' + un + "','" + id2 + '\')"><img src="images/reply.png" alt="↩" width="14" height="14"></a>' +
		//返信元へのリンク
		(in_reply_to ? ' <a class="button inrep" href="#" onClick="dispReply(\'' + un + '\',\'' + in_reply_to + '\',this); return false;"><img src="images/inrep.png" alt="☞" width="14" height="14"></a>' : '') +
		//popupメニュー表示
		'&nbsp;&nbsp;&nbsp;<a class="button popup" href="#" onClick="popup_menu(\'' + un + "','" + id2 + '\', this); return false;"><small><small>▼</small></small></a>' +
		'</span><div class="dummy"></div>';
}
// ユーザ情報のHTML表現を生成
function makeUserInfoHTML(user) {
	return '<table><tr><td><a target="twitter" href="' + twitterURL + 'account/profile_image/'+
			user.screen_name+'"><img class="uicon2" src="' + user.profile_image_url + '"></a></td><td id="profile"><div>' +
			(user.protected ? '<img alt="lock" src="http://assets0.twitter.com/images/icon_lock.gif">' : '') +
			'<b>' + user.screen_name + '</b> / <b>' + user.name + '</b></div>' +
			(user.location ? '<div><b>'+_('Location')+'</b>: ' + user.location + '</div>' : '') +
			(user.url ? '<div><b>'+_('URL')+'</b>: <a target="_blank" href="' + user.url + '" onclick="return link(this);">' + user.url + '</a></div>' : '') +
			'<div>' + (user.description ? user.description : '<br>') +
			'</div><b><a href="javascript:switchFollowing()">' + user.friends_count + '<small>'+_('following')+'</small></a> / ' + 
						'<a href="javascript:switchFollower()">' + user.followers_count + '<small>'+_('followers')+'</small></a>' +
			'<br><a href="javascript:switchStatus()">' + user.statuses_count + '<small>'+_('tweets')+'</small></a> / ' +
						'<a href="javascript:switchFav()">' + user.favourites_count + '<small>'+_('favs')+'</small></a></b>' +
			'</td></tr></table>'+
			'<a class="button upopup" href="#" onClick="userinfo_popup_menu(\'' + user.screen_name + '\',' + user.id + ', this); return false;"><small><small>▼</small></small></a>'+
			'<a target="twitter" href="' + twitterURL + user.screen_name + '">[Twitter]</a> ';
}
// 過去の発言取得ボタン(DOM)生成
function nextButton(id, p) {
	var ret = document.createElement('div');
	ret.id = id;
	ret.className = 'get-next';
	ret.onclick = function() { getNext(this); };
	ret.innerHTML = '▽' + (p ? '(' + p + ')' : '');
	return ret;
}
// favoriteの追加/削除
function fav(img, id) {
	if (img.src.indexOf('throbber') >= 0) return;
	var f = img.src.indexOf('empty') >= 0;
	setFavIcon(img, id, -1);
	enqueuePost(twitterAPI + 'favorites/' + (f ? 'create' : 'destroy') + '/' + id + '.xml',
		function(){ setFavIcon(img, id, f) }, function(){ setFavIcon(img, id, !f) });
}
// favアイコンの設定(f=0: 未fav, f=1:fav済, f=-1:通信中)
function setFavIcon(img, id, f) {
	var img_tl = $('fav-tw-' + id);
	var img_re = $('fav-re-' + id);
	var img_tw2c = $('fav-tw2c-' + id);
	var img_url = (f==-1) ? twitterURL + 'images/icon_throbber.gif' :
						'http://assets3.twitter.com/images/icon_star_' + (f ? 'full' : 'empty') + '.gif';
	img.src = img_url;
	if (img_tl) img_tl.src = img_url;
	if (img_re) img_re.src = img_url;
	if (img_tw2c) img_tw2c.src = img_url;
	callPlugins("fav", id, f, img, img_tl, img_re, img_tw2c);
}
// followとremove
function follow(f) {
	if (!f && !confirm(_("Are you sure to remove $1?", last_user))) return false;
	enqueuePost(twitterAPI + 'friendships/' + (f ? 'create' : 'destroy') + '/' + last_user + '.xml', switchUser);
	$("loading").style.display = "block";
	return false;
}
// blockとunblock
function blockUser(f) {
	if (f && !confirm(_("Are you sure to block $1?", last_user))) return false;
	enqueuePost(twitterAPI + 'blocks/' + (f ? 'create' : 'destroy') + '/' + last_user + '.xml', switchUser);
	$("loading").style.display = "block";
	return false;
}
function reportSpam(f) {
	if (f && !confirm(_("Are you sure to report $1 as spam?", last_user))) return false;
	enqueuePost(twitterAPI + 'report_spam.xml?screen_name=' + last_user, switchUser);
	$("loading").style.display = "block";
	return false;
}
// ユーザ情報を表示
function twUserInfo(user) {
	if (user.error) return error(user.error);
	var elem = $('user_info');
	elem.innerHTML = makeUserInfoHTML(user);
	callPlugins("newUserInfoElement", elem, user);
	if (myname != user.screen_name) {
		relation_ele = loadXDomainScript(twitterAPI + 'friendships/show.json' +
					'?source_screen_name=' + myname + '&target_id=' + user.id +
					'&suppress_response_codes=true&callback=twRelation', relation_ele);
	}
}
// ユーザ情報にフォロー関係を表示
function twRelation(rel) {
	var source = rel.relationship.source;
	var elem = $("user_info");
	elem.innerHTML += '<input type="button" value="' + _(source.following ? 'Remove $1' : 'Follow $1', last_user) +
					'" onClick="follow('+!source.following+')">';
	if (source.followed_by)
		$("profile").innerHTML += "<br><span class=\"following_you\">" + _('$1 is following you!', rel.relationship.target.screen_name)+'</span>';
	callPlugins("newUserRelationship", elem, rel);
}
// ダイレクトメッセージ一覧の受信
function twDirect1(tw) {
	if (tw.error) return error(tw.error);
	direct1 = tw;
	if (direct2)
		twDirectShow();
}
function twDirect2(tw) {
	if (tw.error) return error(tw.error);
	direct2 = tw;
	if (direct1)
		twDirectShow();
}
function twDirectShow() {
	var direct = direct1.concat(direct2).sort(function(a,b){return b.id - a.id});
	direct = direct.map(function(d){
		if (d.recipient_screen_name == myname) {
			d.user = d.sender;
			d.d_dir = 1;
		} else {
			d.user = d.recipient;
			d.d_dir = 2;
		}
		return d;
	});
	twShow2(direct);
	direct1 = direct2 = false;
}
function checkDirect() {
	direct_ele1 = loadXDomainScript(twitterAPI + 'direct_messages.json' +
									'?suppress_response_codes=true&callback=twDirectCheck', direct_ele1);
	update_direct_counter = 20;
}
function twDirectCheck(tw) {
	if (tw.error) return error(tw.error);
	if (!tw || tw.length == 0) return false;
	var id = tw[0].id_str || tw[0].id;
	if (last_direct_id && last_direct_id != id)
			$("direct").className += " new";
	last_direct_id = id;
}
// API制限情報の受信
function twLimit(lim) {
	$("loading").style.display = "none";
	$("tw2c").innerHTML = '<b>'+_('Twitter API status')+':</b><br>' +
					_('hourly limit')+' : ' + lim.remaining_hits + ' / ' + lim.hourly_limit + "<br>" +
					_('reset at')+' : ' + dateFmt(lim.reset_time);
}
function twLimit2(lim) {
	ratelimit_reset_time = new Date(lim.reset_time.replace('+','GMT+'));;
}
// 新着reply受信通知
function noticeNewReply(replies) {
	if ($("reply").className.indexOf("new") < 0)
		$("reply").className += " new";
	callPlugins("noticeNewReply", replies);
}
// 新着repliesを取得
function getReplies() {
		reply_ele2 = loadXDomainScript(twitterAPI + 'statuses/mentions.json' +
						'?count=' + (since_id_reply ? 200 : max_count_u) +
						(since_id_reply ? '&since_id='+since_id_reply : '') +
						'&suppress_response_codes=true&callback=twReplies',
					reply_ele2);
		update_reply_counter = 4;
}
// 受信repliesを表示
function twReplies(tw, fromTL) {
	if (tw.error) return error(tw.error);

	tw.reverse();
	for (var j in tw) if (tw[j] && tw[j].user) callPlugins("gotNewReply", tw[j]);
	tw.reverse();
	if (nr_page_re == 0) {
		nr_page_re = 2;
		$("re").appendChild(nextButton('get_old_re', nr_page_re));
	}
	twShowToNode(tw, $("re"), false, false, true, false, true, false, fromTL);
	if (!fromTL && replies_in_tl)
		twShowToNode(tw, $("tw"), false, false, true, false, true);
	if (!fromTL && tw.length > 0) since_id_reply = tw[0].id_str || tw[0].id;
}
// 受信tweetを表示
function twShow(tw) {
	if (tw.error) return error(tw.error);

	tw.reverse();
	for (var j in tw) if (tw[j] && tw[j].user) callPlugins("gotNewMessage", tw[j]);
	tw.reverse();
	if (nr_page == 0) {
		nr_page = max_count == 200 ? 2 : 1;
		$("tw").appendChild(nextButton('get_old', nr_page));
	}

	var nr_shown = twShowToNode(tw, $("tw"), false, false, true, true, true);
	if ($("tw").oldest_id && update_reply_counter-- <= 0)
		getReplies();
	if (update_direct_counter-- <= 0)
		checkDirect();
	callPlugins("noticeUpdate", tw, nr_shown);
}
function twOld(tw) {
	if (tw.error) return error(tw.error);
	var tmp = $("tmp");
	twShowToNode(tw, $("tw"), false, true, false, false, false, true);
	if (tmp && tmp.parentNode) tmp.parentNode.removeChild(tmp);
	$("tw").appendChild(nextButton('get_old', nr_page));
}
function twOldReply(tw) {
	if (tw.error) return error(tw.error);
	var tmp = $("tmp");
	twShowToNode(tw, $("re"), false, true, false, false, false, true);
	if (tmp && tmp.parentNode) tmp.parentNode.removeChild(tmp);
	$("re").appendChild(nextButton('get_old_re', nr_page_re));
}
function twShow2(tw) {
	var user_info = $("user_info");
	if (tw.error && tw.error == "Not authorized" && !!user_info && !fav_mode && user_info.innerHTML == '') {
		update_ele2 = loadXDomainScript(twitterAPI + 'users/show.json?screen_name=' + last_user +
			'&suppress_response_codes=true&callback=twUserInfo', update_ele2);
		return;
	}
	if (tw.error) return error(tw.error);
	var tmp = $("tmp");
	if (tmp && tmp.parentNode) tmp.parentNode.removeChild(tmp);
	twShowToNode(tw, $("tw2c"), !!user_info && !fav_mode, cur_page > 1);
	if (selected_menu.id == "reply" || selected_menu.id == "user" && last_user.indexOf(',') < 0) {
		$("tw2c").appendChild(nextButton('next'));
		get_next_func = getNextFuncCommon;
	}
	if (tw[0] && selected_menu.id == "user" && last_user.indexOf(',') < 0 && !fav_mode && user_info.innerHTML == '')
		twUserInfo(tw[0].user);
}
function twShow3(tw) {
	if (tw.error) return error(tw.error);
	users_log.push(tw);
	if (users_log.length == last_user.split(',').length) {
		var tws = [];
		for (var i = 0; i < users_log.length; i++)
			tws = tws.concat(users_log[i]);
		tws = tws.sort(function(a,b){return b.id - a.id});
		twShow2(tws);
	}
}
function twUsers(tw) {
	if (tw.error) return error(tw.error);
	var tmp = $("tmp");
	if (tmp && tmp.parentNode) tmp.parentNode.removeChild(tmp);
	var tw2 = tw.users.map(function(x){
		if (!x.status) x.status = {'text':'', id:0, 'created_at':x.created_at};
		x.status.user = x;
		return x.status;
	});
	twShowToNode(tw2, $("tw2c"), false, cur_page > 1);
	if (tw.next_cursor) {
		$("tw2c").appendChild(nextButton('next'));
		get_next_func = function() {
			cur_page++;
			update_ele2 = loadXDomainScript(twitterAPI +
					(fav_mode == 2 ? 'statuses/friends.json' : 'statuses/followers.json') +
					'?screen_name=' + last_user + '&cursor=' + tw.next_cursor +
					'&suppress_response_codes=true&callback=twUsers', update_ele2);
		};
	}
}
function twShowToNode(tw, tw_node, no_name, after, animation, check_since, ignore_old, ignore_new, weak) {
	$('loading').style.display = 'none';
	var len = tw.length;
	if (len == 0) return 0;
	var pNode = document.createElement('div');
	var dummy = pNode.appendChild(document.createElement('div'));
	var myname_r = new RegExp("[@＠]"+myname+"\\b","i");
	var nr_show = 0;
	var replies = [];
	for (var i = len-1; i >= 0; i--) {
		if (!tw[i]) continue;
		var id = tw[i].id_str || tw[i].id;
		var duplication = $(tw_node.id + "-" + id);
		if (duplication) {
			if (duplication.weak)
				duplication.parentNode.removeChild(duplication);
			else
				continue;
		}
		if (ignore_old && tw_node.oldest_id && tw_node.oldest_id > tw[i].id)
			continue;
		if (ignore_new && tw_node.oldest_id && tw_node.oldest_id < tw[i].id)
			continue;
		if (tw[i].user) {
			var s = document.createElement('div');
			s.id = tw_node.id + "-" + id;
			s.innerHTML = makeHTML(tw[i], no_name, tw_node.id);
			s.screen_name = tw[i].user.screen_name;
			s.tw = tw[i]; // DOMツリーにJSONを記録
			if (weak) s.weak = true;
			if (tw[i].d_dir == 1 || tw[i].text.match(myname_r)) {
				s.className = "tome";
				if ((tw_node.id == "tw" || tw_node.id == "re") && !duplication) {
					replies.push(tw[i]);
				}
			}
			var user = tw[i].retweeted_status && tw[i].retweeted_status.user || tw[i].user;
			if (tw[i].d_dir == 2 || user.screen_name == myname)
				s.className = "fromme";
			if (tw[i].retweeted_status)
				s.className += " retweeted";
			callPlugins("newMessageElement", s, tw[i], tw_node.id);
			pNode.insertBefore(s, pNode.childNodes[0]);
			nr_show++;
		}
	}
	pNode.removeChild(dummy);
	if (pNode.childNodes.length == 0) return 0;
	pNode.style.overflow = "hidden";
	var animation2 = animation && getScrollY() < 10;
	var maxH;
	if (animation2) { // get maxH
		tw_node.appendChild(pNode);
		maxH = pNode.clientHeight;
		tw_node.removeChild(pNode);
		pNode.style.minHeight = 0;
	}
	if (after || !tw_node.childNodes[0])
		tw_node.appendChild(pNode);
	else
		tw_node.insertBefore(pNode, tw_node.childNodes[0]);
	if (animation2)
		animate(pNode, maxH, (new Date).getTime());
	else if (animation) {
		var ch = pNode.clientHeight + parseInt(pNode.style.borderBottomWidth || 0);
		$('rep').style.top = (rep_top += ch);
		$('popup').style.top = (popup_top += ch);
		scrollTo(0, getScrollY()+ch);
		scroll_adjust += ch;
	}
	tw_node.nr_tw = (tw_node.nr_tw || 0) + nr_show;
	if(!tw_node.oldest_id && !weak) { // oldest_id設定
		for (var j = tw.length - 1; j >= 0; j--) {
			if (tw[j] && tw[j].user) {
				tw_node.oldest_id = tw[j].id;
				break;
			}
		}
	}
	if (animation && tw_node.nr_tw > nr_limit) {
		while (tw_node.nr_tw > nr_limit) {
			var last_node = tw_node.childNodes[tw_node.childNodes.length-1];
			tw_node.nr_tw -= last_node.childNodes.length;
			tw_node.removeChild(last_node);
		}
		var tl_oldest_id = 0; // 削除に伴いoldest_id更新
		for (var i = 0; i < 3 && i < tw_node.childNodes.length; i++) { // 最大3要素スキャン
			var target_block = tw_node.childNodes[tw_node.childNodes.length-i-1].childNodes;
			var target_ele = target_block[target_block.length-1];
			if (!target_ele.weak && target_ele.tw && (target_ele.tw.id < tl_oldest_id || !tl_oldest_id))
				tl_oldest_id = target_ele.tw.id;
		}
		tw_node.oldest_id = tl_oldest_id;
	}
	for (var i = 0; check_since && i < len; i++) {
		if (tw[i].user.screen_name != myname) {
			since_id = tw[i].id_str || tw[i].id;
			break;
		}
	}
	if (replies.length) {
		if (tw_node.id == "tw") {
			replies.reverse();
			twReplies(replies, true);
			replies.reverse();
		}
		else if (weak || since_id_reply) // 初回Reply取得時にはnoticeしない
			noticeNewReply(replies);
	}
	if (nr_show > 0) setFstHeight(null, true);
	return nr_show;
}
// 新規tweetの出現アニメーション処理
function animate(elem, max, start) {
	var t = (new Date).getTime();
	if (start+1000 <= t)
		return elem.style.maxHeight = 'none';
	elem.style.maxHeight = Math.ceil(max*(1-Math.cos((t-start)/1000*Math.PI))/2);
	setTimeout(function(){animate(elem, max, start)}, 20);
}
// 次ページ取得
function getNext(ele) {
	var tmp = document.createElement("div");
	tmp.id = "tmp";
	tmp.innerHTML = "<p></p>";
	ele.parentNode.appendChild(tmp);
	ele.parentNode.removeChild(ele);
	$("loading").style.display = "block";
	get_next_func();
}
function getOldTL() {
	update_ele2 = loadXDomainScript(twitterAPI + 'statuses/home_timeline.json' +
				'?count=200&page=' + (nr_page++) +
				'&suppress_response_codes=true&callback=twOld', update_ele2);
}
function getOldReply() {
	update_ele2 = loadXDomainScript(twitterAPI + 'statuses/mentions.json' +
				'?count=' + max_count_u + '&page=' + (nr_page_re++) +
				'&suppress_response_codes=true&callback=twOldReply', update_ele2);
}
function getNextFuncCommon() {
	if (selected_menu.id == "user" && !fav_mode)
		update_ele2 = loadXDomainScript(twitterAPI + 'statuses/user_timeline.json' +
					'?count=' + max_count_u + '&page=' + (++cur_page) + '&screen_name=' + last_user +
					'&include_rts=true&suppress_response_codes=true&callback=twShow2', update_ele2);
	else if (selected_menu.id == "user" && fav_mode)
		update_ele2 = loadXDomainScript(twitterAPI + 'favorites/' + last_user + '.json' +
					'?page=' + (++cur_page) + '&suppress_response_codes=true&callback=twShow2', update_ele2);
}
// タイムライン切り替え
function switchTo(id) {
	selected_menu.className = "";
	selected_menu = $(id);
	selected_menu.className = "sel";
	$("tw").style.display = id=="TL"?"block":"none";
	$("re").style.display = id=="reply"?"block":"none";
	$("tw2h").innerHTML = "";
	$("tw2c").innerHTML = "";
	$("tw2").style.display = id!="TL"&&id!="reply"?"block":"none";
	$("tw2c").nr_tw = 0;
	$("tw2c").oldest_id = undefined;
	closeRep();
	scrollTo(0, 1); scrollTo(0, 0);
	cur_page = 1;
	fav_mode = 0;
	callPlugins("switchTo", selected_menu);
	setTimeout(function(){ setFstHeight(null, true); }, 0);
}
function switchTL() {
	get_next_func = getOldTL;
	switchTo("TL");
}
function switchReply() {
	get_next_func = getOldReply;
	if (selected_menu.id == "reply") {
		switchTo("reply");
		$("loading").style.display = "block";
		getReplies();
	} else {
		switchTo("reply");
	}
}
function switchUserTL(div, rt) {
	var tw = div.tw;
	if (!(rt || display_as_rt))
		tw = tw.retweeted_status || tw;
	if (tw.user.description)
		last_user_info = tw.user;
	switchUser(tw.user.screen_name);
}
function switchUser(user) {
	if (!user) {
		user = last_user;
		last_user_info = null;
	}
	last_user = user;
	$("user").innerHTML = user;
	switchTo("user");
	$("loading").style.display = "block";
	var users = user.split(',');
	if (users.length == 1) {
		$("tw2h").innerHTML = "<div id=\"user_info\"></div>";
		if (last_user_info && last_user_info.screen_name == user)
			twUserInfo(last_user_info);
		update_ele2 = loadXDomainScript(twitterAPI + 'statuses/user_timeline.json' +
			'?count=' + max_count_u + '&screen_name=' + user + 
			'&include_rts=true&suppress_response_codes=true&callback=twShow2', update_ele2);
	} else {
		users_log = [];
		for (var i = 0; i < users_xds.length; i++)
			xds.abort(users_xds[i]);
		users_xds = users.map(function(u) {
			xds.load(twitterAPI + 'statuses/user_timeline.json?screen_name=' + u +
							 '&include_rts=true&suppress_response_codes=true&count=' + max_count_u, twShow3);
		});
	}
}
function switchStatus() {
	$("loading").style.display = "block";
	cur_page = 1;
	fav_mode = 0;
	$("tw2c").innerHTML = "";
	update_ele2 = loadXDomainScript(twitterAPI + 'statuses/user_timeline.json' +
		'?count=' + max_count_u + '&screen_name=' + last_user + 
		'&include_rts=true&suppress_response_codes=true&callback=twShow2', update_ele2);
}
function switchFav() {
	$("loading").style.display = "block";
	cur_page = 1;
	fav_mode = 1;
	$("tw2c").innerHTML = "";
	update_ele2 = loadXDomainScript(twitterAPI + 'favorites/' + last_user + '.json' +
										'?suppress_response_codes=true&callback=twShow2', update_ele2);
}
function switchFollowing() {
	$("loading").style.display = "block";
	cur_page = 1;
	fav_mode = 2;
	$("tw2c").innerHTML = "";
	update_ele2 = loadXDomainScript(twitterAPI + 'statuses/friends.json' +
			'?screen_name=' + last_user + '&cursor=-1&suppress_response_codes=true&callback=twUsers', update_ele2);
}
function switchFollower() {
	$("loading").style.display = "block";
	cur_page = 1;
	fav_mode = 3;
	$("tw2c").innerHTML = "";
	update_ele2 = loadXDomainScript(twitterAPI + 'statuses/followers.json' +
			'?screen_name=' + last_user + '&cursor=-1&suppress_response_codes=true&callback=twUsers', update_ele2);
}
function switchDirect() {
	switchTo("direct");
	$("loading").style.display = "block";
	direct_ele1 = loadXDomainScript(twitterAPI + 'direct_messages.json' +
										'?suppress_response_codes=true&callback=twDirect1', direct_ele1);
	direct_ele2 = loadXDomainScript(twitterAPI + 'direct_messages/sent.json' +
										'?suppress_response_codes=true&callback=twDirect2', direct_ele2);
}
function switchMisc() {
	switchTo("misc");
	$("tw2h").innerHTML = '<br><a id="clientname" target="twitter" href="index.html"><b>twicli</b></a> : A browser-based Twitter client<br><small id="copyright">Copyright &copy; 2008-2010 NeoCat</small><hr class="spacer">' +
					'<form id="switchuser" onSubmit="switchUser($(\'user_id\').value); return false;">'+
					_('show user info')+' : @<input type="text" size="15" id="user_id" value="' + myname + '"><input type="image" src="images/go.png"></form>' +
					'<a id="logout" href="javascript:logout()"><b>'+_('Log out')+'</b></a><hr class="spacer">' +
					'<div id="pref"><a href="javascript:togglePreps()">▼<b>'+_('Preferences')+'</b></a>' +
					'<form id="preps" onSubmit="setPreps(this); return false;" style="display: none;">' +
					_('language')+': <select name="user_lang">'+(['en'].concat(langList)).map(function(x){
							return '<option value="'+x+'"'+(x==user_lang?' selected':'')+'>'+langNames[x]+'</option>';
						})+'</select><br>' +
					_('max #msgs in TL')+': <input name="limit" size="5" value="' + nr_limit + '"><br>' +
					_('#msgs in TL on update (max=200)')+': <input name="maxc" size="3" value="' + max_count + '"><br>' +
					_('#msgs in user on update (max=200)')+': <input name="maxu" size="3" value="' + max_count_u + '"><br>' +
					_('update interval')+': <input name="interval" size="3" value="' + updateInterval + '"> sec<br>' +
					'<input type="checkbox" name="auto_update"' + (auto_update?" checked":"") + '>'+_('Update after post')+'<br>' +
					'<input type="checkbox" name="since_check"' + (no_since_id?"":" checked") + '>'+_('since_id check')+'<br>' +
					'<input type="checkbox" name="replies_in_tl"' + (replies_in_tl?" checked":"") + '>'+_('Show not-following replies in TL')+'<br>' +
					'<input type="checkbox" name="display_as_rt"' + (display_as_rt?" checked":"") + '>'+_('Show retweets in "RT:" form')+'<br>' +
					'<input type="checkbox" name="counter"' + (no_counter?"":" checked") + '>'+_('Post length counter')+'<br>' +
					'<input type="checkbox" name="resize_fst"' + (no_resize_fst?"":" checked") + '>'+_('Auto-resize field')+'<br>' +
					'<input type="checkbox" name="decr_enter"' + (decr_enter?" checked":"") + '>'+_('Post with ctrl/shift+enter')+'<br>' +
					'<input type="checkbox" name="geotag"' + (no_geotag?"":" checked") + '>'+_('Enable GeoTagging')+'<br>' +
					_('Footer')+': <input name="footer" size="20" value="' + footer + '"><br>' +
					_('Plugins')+':<br><textarea cols="30" rows="4" name="list">' + pluginstr + '</textarea><br>' +
					_('user stylesheet')+':<br><textarea cols="30" rows="4" name="user_style">' + user_style + '</textarea><br>' +
					'<input type="submit" value="'+_('Save')+'"></form></div><hr class="spacer">';
	callPlugins("miscTab", $("tw2h"));
	$("loading").style.display = "block";
	if (ratelimit_reset_time && new Date < ratelimit_reset_time)
		$("tw2c").innerHTML = '<b>'+_('Twitter API status')+':</b><br>' +
					_('hourly limit')+' : 0<br>'+_('reset at')+': ' + dateFmt(ratelimit_reset_time);
	else
		update_ele2 = loadXDomainScript(twitterAPI + 'account/rate_limit_status.json' +
										'?id=' + myname + '&callback=twLimit', update_ele2);
}
function togglePreps() {
	$('preps').style.display = $('preps').style.display == 'block' ? 'none' : 'block';
}
function setPreps(frm) {
	var ps = frm.list.value.split("\n");
	for (var i = 0; i < ps.length; i++)
		if (ps[i].indexOf("/") >= 0)
			if (!confirm(_('An external plugin is specified. This plugin can fully access to your account.\nAre you sure to load this?')+"\n\n" + ps[i]))
				return;
	
	user_lang = frm.user_lang.value;
	nr_limit = frm.limit.value;
	max_count = frm.maxc.value;
	max_count_u = frm.maxu.value;
	updateInterval = frm.interval.value;
	auto_update = frm.auto_update.checked;
	no_since_id = !frm.since_check.checked;
	no_counter = !frm.counter.checked;
	no_resize_fst = !frm.resize_fst.checked;
	replies_in_tl = frm.replies_in_tl.checked;
	display_as_rt = frm.display_as_rt.checked;
	footer = new String(frm.footer.value);
	decr_enter = frm.decr_enter.checked;
	no_geotag = !frm.geotag.checked;
	resetUpdateTimer();
	writeCookie('ver', 11, 3652);
	writeCookie('user_lang', user_lang, 3652);
	writeCookie('limit', nr_limit, 3652);
	writeCookie('max_count', max_count, 3652);
	writeCookie('max_count_u', max_count_u, 3652);
	writeCookie('update_interval', updateInterval, 3652);
	writeCookie('auto_update', auto_update?1:0, 3652);
	writeCookie('no_since_id', no_since_id?1:0, 3652);
	writeCookie('no_counter', no_counter?1:0, 3652);
	writeCookie('no_resize_fst', no_resize_fst?1:0, 3652);
	writeCookie('replies_in_tl', replies_in_tl?1:0, 3652);
	writeCookie('display_as_rt', display_as_rt?1:0, 3652);
	writeCookie('footer', footer, 3652);
	writeCookie('decr_enter', decr_enter?1:0, 3652);
	writeCookie('no_geotag', no_geotag?1:0, 3652);
	writeCookie('tw_plugins', new String(" " + frm.list.value), 3652);
	writeCookie('user_style', new String(frm.user_style.value), 3652);
	callPlugins('savePrefs', frm);
	alert(_("Your settings are saved. Please reload to apply plugins and CSS."));
}
// 初期化
function init() {
	popup_init();
	selected_menu = $("TL");
	setTimeout(function(){scrollTo(0, 1)}, 0);
	document.request.oauth_token.value = access_token;
	document.etc.tokenSecret.value = access_secret;
	document.etc.consumerSecret.value = "7ypxMreeJuumgiq3ts7QtOqigl5G1sosJFfeaoKGJA";
	setFstHeight(min_fst_height, true);
	// 初回アップデート
	callPlugins("init");
	setTimeout(auth, 0);
}
// プラグイン
var plugin_name;
function registerPlugin(obj) {
	plugins.push([plugin_name,obj]);
}
function callPlugins(name) {
	var args = [].slice.apply(arguments);
	args.shift();
	for (var i = 0; i < plugins.length; i++)
		if (typeof plugins[i][1][name] == "function")
			try {
				plugins[i][1][name].apply(plugins[i][1], args);
			} catch (e) {
				alert(_('Plugin error')+'('+plugins[i][0]+'): ' + e);
			}
}
function loadPlugins() {
	if (pluginstr) {
		var ps = pluginstr.split("\n");
		var pss = "";
		for (var i = 0; i < ps.length; i++) {
			pss += '<scr'+'ipt type="text/javascript">plugin_name="'+ps[i].replace(/[\\\"]/g,'')+'"</scr'+'ipt>';
			pss += '<scr'+'ipt type="text/javascript" src="' + (ps[i].indexOf("/") >= 0 ? '' : 'plugins/') + ps[i] + '"></scr'+'ipt>';
		}
		document.write(pss);
	}
}
