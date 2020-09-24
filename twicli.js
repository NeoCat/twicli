// common

function $(id) { return document.getElementById(id); }
// 文字参照をデコード
function charRef(s) {
	var ele = document.createElement("div");
	ele.innerHTML = s;
	return ele.firstChild.nodeValue;
}
// フォームをシリアライズ
function serializeForm(f, filter) {
	var url = '';
	for (var e = 0; e < f.elements.length; e++) {
		var input = f.elements[e];
		if (input.name && input.value && (!filter || input.name.indexOf(filter) >= 0))
			url += (url == '' ? '?' : '&') + input.name + "=" + OAuth.percentEncode(input.value.replace(/\r?\n/g, "\r\n"));
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
function setupOAuthURL(url, post, post_agent, multipart) {
	if (url.indexOf(twitterAPI) != 0) return url;
	var media_upload = url.indexOf('update_with_media.json') >= 0 && post;
	var json_post = url.indexOf('?_body=') >= 0 && post;
	if (media_upload || json_post) multipart = true;
	var nosign = [];
	url = url.split("?");
	if (post && !(media_upload && post_agent) && url[1] && url[1].match(/(^|&)((?:status)=[^&]+)/) && RegExp.$2.indexOf('%2A') >= 0 || RegExp.$2.indexOf('*') >= 0) {
		// "*"(%2A)はPOSTデータではURLEncodeされずに送信されOAuthエラーとなるため、URL内に含める（statusにのみ対応）
		url[1] = url[1].replace(RegExp.$1+RegExp.$2, '');
		url[0] += "?" + RegExp.$2.replace(/\*/g, '%2A');
	}
	setupOAuthArgs(url[1]);
	if (multipart || json_post) {
		var cs = document.request.childNodes;
		for (var e = cs.length - 1; e >= 0; e--) {
			if (cs[e].tagName == 'INPUT' && cs[e].name.indexOf('oauth') < 0 || cs[e] === $('api_args')) {
				nosign.push(cs[e]);
				cs[e].parentNode.removeChild(cs[e]);
			}
		}
		document.request.enctype = 'multipart/form-data';
	} else
		document.request.enctype = 'application/x-www-form-urlencoded';
	document.request.method = (post || post_agent) ? 'POST' : 'GET';
	document.etc.URL.value = url[0];
	consumer.signForm(document.request, document.etc);
	url = document.etc.URL.value;
	if (post_agent) {
		var sid = ['','2'][((new Date).getTime()/1000/60/60/12|0)%2];
		url = url.replace(twitterAPI, 'https://tweet-agent'+sid+'.appspot.com/1.1/');
	}
	for (e = 0; e < nosign.length; e++)
		document.request.appendChild(nosign[e]);
	if (media_upload) {
		var media = $("media");
		media.parentNode.removeChild(media);
		media.style.display = "none";
		$("api_args").appendChild(media);
	}
	return url + (!post || multipart ? serializeForm(document.request, multipart && 'oauth') : '');
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
// クロスドメインJavaScript呼び出し(エラー処理+リトライ付き, Twitter APIはOAuth認証)
var xds = {
	load: function(url, callback, onerror, retry, callback_key, post_agent) {
		var url2 = setupOAuthURL(url + (url.indexOf('?')<0?'?':'&') +
								(callback_key?callback_key:'callback') + '=cb', false, post_agent);
		if (!url2) return null;
		loading(true);
		var ifr = document.createElement("iframe");
		ifr.style.display = "none";
		document.body.appendChild(ifr);
		var d = ifr.contentWindow.document;
		var cnt = 0; // 二重onload防止
		ifr[ifr.readyState/*IE*/ ? "onreadystatechange" : "onload"] = function() {
			if (this.readyState && this.readyState != 'complete' || cnt++) return;
			if (d.x) {
				if (callback) callback.apply(this, d.x);
			} else if (retry && retry > 1) {
				if (url.indexOf(twitterAPI) == 0) {
					updateRateLimit(function(limits){
						if (url.substr(twitterAPI.length).match(/(.*?)\/(.*)\.json/)) {
							var ep = '/'+RegExp.$1+'/'+RegExp.$2;
							var resource = limits.resources[RegExp.$1];
							ep = ep.replace(/\d+/,':id');
							if (resource && resource[ep] && resource[ep].remaining <= 0) {
								var d = resource[ep].reset - Math.floor((new Date).getTime()/1000);
								return error(_('Too many requests: Twitter API $1 is rate limited; reset in $2', ep, Math.floor(d/60) + ":" + d2(Math.floor(d%60))));
							}
						}
						loading(true); // retry待ち表示
						setTimeout(function(){ xds.load(url, callback, onerror, retry-1);
							loading(false);
						}, 1000);
					});
				}
			} else if (onerror)
				onerror();
			loading(false);
			setTimeout(function(){ try { ifr.parentNode.removeChild(ifr); } catch(e) {} }, 0);
		};
		d.write('<scr'+'ipt src="array.js"></scr'+'ipt>' +
				'<scr'+'ipt src="'+url2+'"></scr'+'ipt>');
		d.close();
		return ifr;
	},
	abort: function(ifr) {
		if (ifr && ifr.parentNode) {
			ifr.parentNode.removeChild(ifr);
			loading(false);
		}
	},
	
	load_default: function(url, callback, old, callback_key) {
		this.abort(old);
		return this.load(url, callback, twFail, 3, callback_key);
	},
	load_for_tab: function(url, callback, callback_key) { // タブ切替時に自動abort
		var ifr_tab = this.ifr_tab;
		var fr = [this.load(url,
					function() { callback.apply(this,arguments); try { ifr_tab.remove(fr[0]); } catch(e) {} },
					function() { twFail(); try { ifr_tab.remove(fr[0]); } catch(e) {} },
					3, callback_key)];
		this.ifr_tab.push(fr[0]);
	},
	abort_tab: function() {
		for (var i = 0; i < this.ifr_tab.length; i++)
			this.abort(this.ifr_tab[i])
		this.ifr_tab = [];
	},
	ifr_tab: []
};
// CORSによるPOST (Agent経由)
function corsPost(url, done, err) {
	loading(true);
	var url_post = setupOAuthURL(url, true, true, true);
	var form = new FormData();
	var inputs = document.request.getElementsByTagName("INPUT");
	for (var i = 0; i < inputs.length; i++)
		if (inputs[i].type == 'file')
			form.append(inputs[i].name, inputs[i].files[0]);
		else if (inputs[i].name.indexOf('oauth_') != 0)
			form.append(inputs[i].name, inputs[i].value);
	var xhr = new XMLHttpRequest();
	xhr.onload = function(){
		if (xhr.readyState != 4) return;
		loading(false);
		if (xhr.status == 200)
			done(JSON.parse(xhr.responseText));
		else
			done({'errors': [{message: xhr.responseText}]});
	}
	xhr.onerror = function(){ loading(false); err(); }
	xhr.open('POST', url_post, true);
	xhr.send(form);
}
// 動的にフレームを生成してPOSTを投げる(Twitter APIはOAuth認証)
var postQueue = [];
function enqueuePost(url, done, err, retry, force_post) {
	if (post_via_agent && url.indexOf(twitterAPI) == 0)
		if ((!$('media') || !$('media').value) && !force_post)
			return xds.load(url, done, err, retry, null, true);
		else
			return corsPost(url, done, err);
	postQueue.push(arguments);
	if (postQueue.length > 1) // 複数リクエストを同時に投げないようキューイング
		return;
	postNext();
}
function postNext() {
	if (postQueue.length)
		postInIFrame.apply(this, postQueue[0]);
}
var postSeq = 0;
var postTimeout = 3000;
function postInIFrame(url, done, err, retry) {
	loading(true);
	var frm = url.indexOf(twitterAPI) == 0 ? document.request : document.post;
	frm.action = setupOAuthURL(url, true);
	frm.target = "pfr" + (++postSeq);
	var pfr = document.createElement("iframe"); // formのtargetとなるiframeを生成
	pfr.name = "pfr" + postSeq;
	pfr.src = "about:blank";
	pfr.style.display = "none";
	var errTimer = false;
	// 一定時間内に正常終了しなければエラーとみなす
	// 通常5秒、エラー処理指定時はデフォルト3秒→10秒、ファイル送信時は更に+30秒)
	errTimer = setTimeout(function(){
		loading(false);
		if (err) err(); else done();
		setTimeout(function(){
			pfr.parentNode && pfr.parentNode.removeChild(pfr);
			postQueue.shift();
			postNext();
		}, 0);
		}, (frm.enctype=='multipart/form-data'?30000:0) + (retry?10000:err?postTimeout:5000));
	var cnt = 0;
	var onload = pfr.onload = function(){
		if (cnt++ == 0) {
			setTimeout(function(){frm.submit();}, 0);
		} else {
			loading(false);
			clearTimeout(errTimer);
			done();
			setTimeout(function(){
				pfr.parentNode && pfr.parentNode.removeChild(pfr);
				postQueue.shift();
				postNext();
			}, 0);
		}
	};
	if ('\v'=='v') pfr.onreadystatechange = function(){ /* for IE */
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
	var cont =  scroll_timer && !start;
	if (scroll_timer) clearTimeout(scroll_timer);
	scroll_timer = null;
	var t = (new Date).getTime();
	start = start || t;
	total = total || y - getScrollY();
	if (start == t) scroll_adjust = 0;
	if (start == t) scroll_duration = Math.min(500, Math.abs(total));
	y += scroll_adjust;
	scroll_adjust = 0;
	if (start+scroll_duration <= t || cont)
		return scrollTo(0, y);
	var pix = Math.ceil(total*(1-Math.cos((t-start)/scroll_duration*Math.PI))/2);
	scrollTo(0, y-total+pix);
	scroll_timer = setTimeout(function(){scrollToY(y, total, start)}, 20);
}
function scrollToDiv(d, top_margin) {
	top_margin = (top_margin || 0) + $('control').clientHeight+1;
	var top = cumulativeOffset(d)[1];
	var h = d.offsetHeight;
	var sc_top = document.body.scrollTop || document.documentElement.scrollTop;
	var win_h = window.innerHeight || document.documentElement.clientHeight;
	if (top < sc_top+top_margin) scrollToY(top-top_margin);
	if (sc_top+win_h < top+h)
		if (win_h >= h+top_margin) scrollToY(top+h-win_h);
		else scrollToY(top-top_margin);
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
	var start = scookie.indexOf(key);
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

function exportableKey(key) {
	if (key.indexOf('twicli_') != 0) return false;
	var blacklist = ['access','accounts','followers_ids','lists_users.'];
	for (var i = 0; i < blacklist.length; i++)
		if (key.indexOf('twicli_' + blacklist[i]) == 0) return false;
	return true;
}
function serializeCookies() {
	if (!use_local_storage || !window.localStorage) return null;
	var ret = {};
	for (var key in localStorage)
		if (exportableKey(key))
			ret[key] = localStorage[key];
	return JSON.stringify(ret);
}
function deserializeCookies(json) {
	var ret = JSON.parse(json);
	for (var key in ret)
		if (exportableKey(key))
			localStorage[key] = ret[key] || "";
}

function uploadSettings() {
	if (!confirm(_('Are you sure to upload your settings to the server? The settings are only downloadable from the current account. Authentication information is not included.'))) return;
	var xhr = new XMLHttpRequest();
	xhr.open('POST', 'save_settings.cgi', true);
	xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
	xhr.onreadystatechange = function() {
		if (xhr.readyState == 4) {
			if (xhr.status == 200 && xhr.responseText == "OK\n")
				alert(_('Your settings are uploaded successfully.'));
			else
				alert(_('Failed to upload settings. (Error $1)', xhr.status));
		}
	}
	xhr.send('key=' + hex_sha1(access_token) + '&data=' + encodeURIComponent(serializeCookies()));
}
function downloadSettings() {
	if (!confirm(_('Are you sure to download your settings from the server? Current settings are overwritten.'))) return;
	var xhr = new XMLHttpRequest();
	xhr.open('GET', 'settings/' + hex_sha1(access_token) + '?' + (new Date).getTime(), true);
	xhr.responseType = 'text';
	xhr.onreadystatechange = function() {
		if (xhr.readyState == 4) {
			if (xhr.status == 200) {
				deserializeCookies(xhr.responseText);
				alert(_('Your settings are downloaded. Please reload to enable them.'));
			}
			else
				alert(_('Failed to download settings. (Error $1)', xhr.status));
		}
	}
	xhr.send();
}

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
	return key.replace(/\$(\d+)/g, function(x,n){ return args[parseInt(n)] });
}

// version check
document.twicli_js_ver = 10;
if (!document.twicli_html_ver || document.twicli_html_ver < document.twicli_js_ver) {
	if (location.href.indexOf('?') < 0) {
		location.href = location.href + '?' + document.twicli_js_ver;
	} else {
		alert(_('An old HTML file is loaded. Please reload it. If the problem is not fixed, please try erasing caches.'));
	}
}

// user-defined CSS
try {
	$('theme_css').innerHTML = readCookie('theme_css') || "";
} catch(e) {
	console.log("Failed to apply theme_css.");
}
var dark_mode = false;
try {
	if (!readCookie('theme_name') && window.matchMedia("(prefers-color-scheme: dark)").matches) {
		document.write('<style id="dark_mode">@import url(styles/dark.css);</style>');
		dark_mode = true;
	}
} catch(e) {
	console.log("Error on dark-mode switch: " + e);
}
var user_style = readCookie('user_style') || "";
document.write('<style id="usercss">' + user_style + '</style>');


// twicli用変数

var twitterURL = 'https://twitter.com/';
var twitterAPI = 'https://api.twitter.com/1.1/';
var myname = null;		// 自ユーザ名
var myid = null;		// 自ユーザID
var last_user = null;	// user TLに表示するユーザ名
var last_user_info = null;	// user TLに表示するユーザ情報(TLから切替時のキャッシュ)
// 設定値
var currentCookieVer = 25;
var cookieVer = parseInt(readCookie('ver')) || 0;
var updateInterval = (cookieVer>18) && parseInt(readCookie('update_interval')) || 90;
var pluginstr = (cookieVer>6) && readCookie('tw_plugins') || ' regexp.js\nlists.js\nsearch.js\nfollowers.js\nshorten_url.js\nresolve_url.js';
if (cookieVer<8) pluginstr+="\ntranslate.js\nscroll.js";
if (cookieVer<9) pluginstr+="\nthumbnail.js";
//if (cookieVer<10) pluginstr=" worldcup-2010.js\n" + pluginstr.substr(1);
if (cookieVer<11) pluginstr = pluginstr.replace(/worldcup-2010\.js[\r\n]+/,'');
if (cookieVer<11) pluginstr+="\ngeomap.js";
if (cookieVer<12 && pluginstr.indexOf('tweet_url_reply.js')<0) pluginstr+="\ntweet_url_reply.js";
//if (cookieVer<13) pluginstr+="\nrelated_results.js";
if (cookieVer<14) pluginstr+="\nembedsrc.js";
if (cookieVer<15) pluginstr = pluginstr.replace(/search2\.js[\r\n]+/,'');
if (cookieVer<16) pluginstr+="\nmute.js";
if (cookieVer<17) pluginstr = pluginstr.replace(/outputz\.js[\r\n]+/,'');
if (cookieVer<17) pluginstr = pluginstr.replace(/related_results\.js[\r\n]+/,'');
if (cookieVer<18) if (pluginstr.indexOf('shortcutkey.js')<0) pluginstr+="\nshortcutkey.js";
if (cookieVer<18) if (pluginstr.indexOf('multi_account.js')<0) pluginstr+="\nmulti_account.js";
if (cookieVer<18) if (pluginstr.indexOf('notify.js')<0) pluginstr+="\nnotify.js";
if (cookieVer<21) if (pluginstr.indexOf('tweets_after_rt.js')<0) pluginstr+="\ntweets_after_rt.js";
//if (cookieVer<23) if (pluginstr.indexOf('ioc_flags.js')<0) pluginstr+="\nioc_flags.js";
if (cookieVer<24) pluginstr = pluginstr.replace(/ioc_flags\.js[\r\n]+/,'');
if (cookieVer<25) if (pluginstr.indexOf('move2https.js')<0) pluginstr+="\nmove2https.js";
pluginstr = pluginstr.substr(1);
var plugins = new Array;
var max_count = Math.min((cookieVer>3) && parseInt(readCookie('max_count')) || 50, 800);
var max_count_u = Math.min(parseInt(readCookie('max_count_u')) || 50, 800);
var nr_limit = Math.max(max_count*2.5, parseInt(readCookie('limit')) || 500);		// 表示する発言数の上限
var no_since_id = parseInt(readCookie('no_since_id') || "0");		// since_idを使用しない
var no_counter = parseInt(readCookie('no_counter') || "0");			// 発言文字数カウンタを無効化
var no_resize_fst = parseInt(readCookie('no_resize_fst') || "0");	// フィールドの自動リサイズを無効化
var replies_in_tl = parseInt(readCookie('replies_in_tl') || "1");	// フォロー外からのReplyをTLに表示
var display_as_rt = parseInt(readCookie('display_as_rt') || "0");	// Retweetを"RT @〜: …"形式で表示
var reply_to_all = parseInt(readCookie('reply_to_all') || "1");	// 全員に返信
var footer = readCookie('footer') || ""; 							// フッタ文字列
var decr_enter = parseInt(readCookie('decr_enter') || "0");			// Shift/Ctrl+Enterで投稿
var confirm_close = parseInt(readCookie('confirm_close') || "1");			// Tabを閉じるとき確認
var confirm_delete = parseInt(readCookie('confirm_delete') || "1");			// ツイート削除時に確認
var confirm_rt = parseInt(readCookie('confirm_rt') || "1");			// Retweet時に確認
var confirm_too_long = parseInt(readCookie('confirm_too_long') || "1");		// 長いツイートをする前に確認
var no_geotag = parseInt(readCookie('no_geotag') || "0");			// GeoTaggingを無効化
var post_via_agent = cookieVer > 19 ? parseInt(readCookie('post_via_agent') || "1") : 1;	// tweet-agent経由でツイート
var show_header_img = parseInt(readCookie('show_header_img') || "1");	// ヘッダ画像表示
var dnd_image_upload_supported = navigator.userAgent.indexOf('WebKit') >= 0 ||
	navigator.userAgent.match(/Firefox\/(\d+)/) && RegExp.$1 >= 10;
var dnd_image_upload = cookieVer > 21 ? parseInt(readCookie('dnd_image_upload') ||
	(dnd_image_upload_supported ? "1" : "0")) : dnd_image_upload_supported;	// ドラッグ&ドロップで画像アップロード
// TL管理用
var cur_page = 1;				// 現在表示中のページ
var nr_page = 0;				// 次に取得するページ
var nr_page_re = 0;				// 次に取得するページ(reply用)
var max_id;
var get_next_func = getOldTL;	// 次ページ取得関数
var since_id = null;			// TLの最終since_id
var since_id_reply = null;		// Replyの最終since_id
var in_reply_to_user = null;	// 発言の返信先ユーザ
var in_reply_to_status_id = null;// 発言の返信先id
// クロスドメイン通信関連
var seq = (new Date).getTime();
var users_log = [];
var update_ele = null;
var update_ele2 = null;
var reply_ele = null;
var reply_ele2 = null;
var direct_ele = null;
// UI関連
var user_picks = [];			// [⇔]で表示するユーザ名
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
var last_post = null;
var last_in_reply_to_user = null;
var last_in_reply_to_status_id = null;
var in_reply_to_status_id_tw = null;
var last_direct_id = null;
var geo = null;
var geowatch = null;
var loading_cnt = 0;
var err_timeout = null;
var update_post_check = false;
var tweet_failed_notified = false;
var tw_config;
var tw_limits = {};
var t_co_maxstr = "http://t.co/********";
var api_resources = ['statuses','friendships','friends','followers','users','search','lists','favorites'];
var first_update = true;
var reset_timer = null;
var last_update_time = null;
var default_api_args = 'suppress_response_codes=true';
var default_api_args_tl = default_api_args + '&include_entities=true&tweet_mode=extended';
var user_cache = {};
var user_cache_by_screen_name = {};
var user_cache_fetch_list = [];
var user_fetch_callback = null;

function text(tw) {
	return tw.extended_tweet && tw.extended_tweet.full_text || tw.full_text || tw.text;
}
function ent(tw, for_urls) {
	return tw.extended_tweet && tw.extended_tweet.entities ||
		!for_urls && tw.extended_entities || tw.entities;
}

// loading表示のコントロール
function loading(start) {
	loading_cnt += start ? 1 : loading_cnt > 0 ? -1 : 0;
	$('loading').style.display = loading_cnt > 0 ? "block" : "none";
}

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
		if ($("fst") && ($("fst").value = readCookie('twicli_onload') || '')) {
			deleteCookie('twicli_onload');
		}
	}, 0);
}

function twAuth(a) {
	if (a.errors && a.errors[0]) {
		alert(a.errors[0].message);
		if (a.errors[0].message == "Incorrect signature" || a.errors[0].message.indexOf("Could not authenticate") >= 0)
			logout();
		return;
	}
	if (!myname || !myid || myname != a.screen_name) {
		myname = last_user = a.screen_name;
		last_user_info = a;
		myid = a.id_str || a.id;
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
function twAuthFallback() {
	// verify_credentials API is unavailable?
	xds.load(twitterAPI + "users/show.json?screen_name="+myname +
		"&" + default_api_args, twAuth, function(){error("Authentication failed.");});
}
function auth() {
	var name = readCookie('access_user');
	if (!myname && name) {
		name = name.split('|');
		myname = last_user = name[0];
		myid = name[1];
		$("user").innerHTML = last_user;
		update();
	}
	xds.load_default(twitterAPI + 'help/configuration.json', twConfig);
	xds.load(twitterAPI + "account/verify_credentials.json?" +
		default_api_args, twAuth, twAuthFallback, 1);
}

function logout(force) {
	if (!force && !confirm(_('Are you sure to logout? You need to re-authenticate twicli at next launch.')))
		return;
	callPlugins('logout');
	deleteCookie('access_token');
	deleteCookie('access_secret');
	deleteCookie('access_user');
	location.href = 'oauth/index.html';
}

function error(str, err) {
	if (err && err[0] && err[0].code == 93) {
		if (confirm(_('Cannot access to direct messages. Please re-auth twicli for DM access.')))
			logout(true);
		return;
	}
	if (err && err.errors && err.errors[0])
		str += _('Twitter API error') + ': ' + err.errors[0].message;
	$("errorc").innerHTML = str;
	$("error").style.display = "block";
	if (err_timeout) clearTimeout(err_timeout);
	err_timeout = error_animate(true);
}
function error_animate(show, t) {
	t = t || new Date();
	var dur = new Date() - t;
	var opacity = Math.min(0.7, dur/300.0);
	if (!show) opacity = Math.max(0, 0.7-opacity);
	$("error").style.opacity = opacity;
	if (show && opacity == 0.7)
		err_timeout = setTimeout(function(){ error_animate(false); }, 5000);
	else if (!show && opacity == 0)
		$("error").style.display = "none";
	else
		err_timeout = setTimeout(function(){ error_animate(show, t); }, 30);
}
function clear_error() {
	if ($("error").style.opacity == 0.7) {
		clearTimeout(err_timeout);
		err_timeout = setTimeout(function(){ error_animate(false); }, 0);
	}
}

var notify_queue = [];
var notify_timer = null;
function notify(str) {
	callPlugins('notify', str);
	if (notify_timer) {
		notify_queue.push(str);
		return;
	}
	notify_show(str);
}
function notify_show(str) {
	$("notifyc").innerHTML = str || notify_queue.shift() || '';
	$("notify").style.display = "block";
	setTimeout(function(){
		var win_h = window.innerHeight || document.documentElement.clientHeight;
		$("notify").style.top = win_h - $("notifyc").clientHeight + "px";
		notify_timer = setTimeout(clear_notify, 5000);
	}, 0);
}
function clear_notify() {
	if (notify_timer) clearTimeout(notify_timer);
	$("notify").style.top = "100%";
	if (notify_queue.length)
		notify_timer = setTimeout(notify_show, 500);
	else
		notify_timer = setTimeout(function(){
			$("notify").style.display = "none";
			notify_timer = null;
		}, 500);
}

function twFail() {
	error('<img style="vertical-align:middle" src="images/whale.png">&nbsp;&nbsp;'+_('API error (Twitter may be over capacity?)'));
}

function sendMessage(user, text) {
	callPlugins("sendMessage", user, text);
	fetchUserCacheByScreenName(user, function() {
		var user_id = user_cache_by_screen_name[user].id_str;
		enqueuePost(twitterAPI + "direct_messages/events/new.json?_body={\"event\": " +
					"{\"type\":\"message_create\",\"message_create\":{\"target\":{\"recipient_id\":" + user_id +
					"},\"message_data\":{\"text\":\"" + encodeURIComponent(text) + "\"}}}}",
			function(tw){ if (tw && tw.errors) error('', tw); resetFrm(); },
			function(){ error(_('Twitter API error')); resetFrm(); },
			false, true);
	});
	return false;
}

function isMessage() {
	return document.frm.status.value.match(/^[dD]\s+(\w+)\s+([\w\W]+)/);
}
// enterキーで発言, "r"入力で再投稿, 空欄でTL更新
function press(e) {
	if (e != 1 && (e.keyCode != 13 && e.keyCode != 10 ||
		!decr_enter && (e.ctrlKey || e.shiftKey) || decr_enter && !(e.ctrlKey || e.shiftKey)) )
			return true;
	var st = document.frm.status;
	if (st.value == '' && !($('media')&&$('media').value)) {
		update();
		return false;
	}
	if (parseInt($("counter").innerHTML,10) < 0)
		if (confirm_too_long && !confirm(_("This tweet is too long.")))
			return false;
	var retry = 0;
	if (st.value == "r" && last_post) {
		retry = 1;
		st.value = last_post;
		in_reply_to_user = last_in_reply_to_user;
		setReplyId(last_in_reply_to_status_id);
	}
	if (isMessage()) {
		// DM送信
		return sendMessage(RegExp.$1, RegExp.$2);
	}
	last_post = st.value;
	last_in_reply_to_user = in_reply_to_user;
	last_in_reply_to_status_id = in_reply_to_status_id;
	if (st.value.substr(0,1) == ".")
		setReplyId(false); // "."で始まる時はin_reply_to指定無し
	callPlugins("post", st.value);
	st.value += footer;
	st.select();
	var text = st.value;
	var do_post = function(r){
		var media = $('media')&&$('media').value;
		enqueuePost(twitterAPI + 'statuses/update' + (media ? '_with_media' : '') + '.json?'+
				default_api_args_tl +
				'&status=' + OAuth.percentEncode(st.value) +
				(geo && geo.coords ?  "&display_coordinates=true&lat=" + geo.coords.latitude +
										"&long=" + geo.coords.longitude : "") +
				(in_reply_to_status_id ? "&in_reply_to_status_id=" + in_reply_to_status_id : ""),
			function(tw){ if (tw && tw.errors) error('', tw); else resetFrm(); twShow([tw]); },
			function(err){ if (err) return error('', err); if (media && post_via_agent) { resetFrm(); setTimeout(update, 1000); } else if (r && post_via_agent) do_post(false); },
				retry);
	};
	do_post(true);
	callPlugins("postQueued", text);
	in_reply_to_user = null;
	setReplyId(false);
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
	if (Math.abs(h - parseInt($("fst").style.height)) < 3 && !force) return;
	var exh = (navigator.userAgent.indexOf("MSIE 8") >= 0 ? 1 : navigator.userAgent.indexOf("MSIE 9") >= 0 ? 1 : 0), opt = $("option").clientHeight;
	$("fst").style.height = h + 'px';
	$("option").style.top = h + 2 + exh*5 + 'px';
	$("menu").style.top = $("counter-div").style.top = h+3+exh*5 + opt + 'px';
	var mh = Math.max($("menu").clientHeight, $("menu2").clientHeight);
	$("control").style.height = h+mh+2+exh*5 + opt + 'px';
	$("tw").style.top = $("tw2").style.top = $("re").style.top = h+mh+3+exh*4 + opt + 'px';
}
if (navigator.userAgent.indexOf('iPhone') < 0)
	window.onresize = function(){ setFstHeight(null, true); }
// 発言文字数カウンタ表示・更新
function updateCount() {
	setFstHeight();
	if (!no_counter) $("counter-div").style.display = "block";
	
	// for calculate length with shorten URL.
	var s = $("fst").value.replace(
			/https?:\/\/[^/\s]*[\w!#$%&'()*+,./:;=?~-]*[\w#/+-]/g,
			function(t) {return t_co_maxstr.replace(/^http/, t.substr(0, t.indexOf(':')))});
	$("counter").innerHTML = isMessage() ? tw_config.dm_text_character_limit - RegExp.$2.length  : 140 - footer.length - s.length;
}
// フォームのフォーカス解除時の処理
function blurFst() {
	if ($("fst").value == "") setReplyId(false);
}
// フォームの初期化
function resetFrm(arg) {
	document.frm.reset();
	$("api_args").innerHTML = "";
	if ($("imgup")) $("option").removeChild($("imgup"));
	setReplyId(false);
	if ($("counter-div").style.display == "block") updateCount();
	setFstHeight(min_fst_height, true);
	callPlugins("resetFrm", arg);
}
// reply先の設定/解除
function setReplyId(id, tw_id) {
	var t;
	if (in_reply_to_status_id_tw && (t = $(in_reply_to_status_id_tw)))
		t.className = t.className.replace(/ ?inrep/, '');
	else if (in_reply_to_status_id) for (var i = 0; i < 3; i++) {
		t = $(['tw-','re-','tw2c-'][i]+in_reply_to_status_id);
		if (t) t.className = t.className.replace(/ ?inrep/, '');
	}
	in_reply_to_status_id = id;
	in_reply_to_status_id_tw = tw_id;
	if (tw_id)
		$(tw_id).className += ' inrep';
	else if (id) for (i = 0; i < 3; i++) {
		t = $(['tw-','re-','tw2c-'][i]+id);
		if (t) t.className += ' inrep';
	}
}
// reply先を設定
function replyTo(user, id, tw_id, direct) {
	in_reply_to_user = user;
	var head = (direct || selected_menu.id == "direct" ? "d " : "@") + user + " ";
	var ele = $(tw_id);
	if (!direct && selected_menu.id != "direct" && reply_to_all && ele) {
		var tw = ele.tw.retweeted_status || ele.tw;
		var users = text(tw).match(/@\w+/g);
		if (users)
			head = head + (users.uniq().join(" ")+" ").replace(head, '').replace('@'+myname+' ', '');
	}
	if (document.frm.status.value.toLowerCase().indexOf(head.toLowerCase()) !== 0) // 連続押しガード
		document.frm.status.value = head + document.frm.status.value;
	setReplyId(id, tw_id);
	document.frm.status.select();
}
// reply先を表示
function dispReply(user, id, ele, cascade) {
	user_picks.push(user);
	var e = !cascade && (window.event || arguments.callee.caller.arguments[0]);
	var shiftkey = e && (e.shiftKey || e.modifiers & 4);
	var td = $((selected_menu.id == "TL" ? "tw" : selected_menu.id == "reply" ? "re" : "tw2c") + "-" + id);
	if (td && td.style.display == "none") td = null;
	var rd = $('reps-' + id);
	// 通常      → 反転表示 (rdあり) or オーバーレイ表示
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
		reply_ele = xds.load_default(twitterAPI + 'statuses/show/'+id+'.json?' +
			default_api_args_tl, dispReply2, reply_ele);
		return;
	}
	// 反転表示
	if (d.parentNode.id != 'reps')
		closeRep();
	scrollToDiv(d);
	d.className += ' emp';
	setTimeout(function(){d.className = d.className.replace(' emp','')}, 2000);
}
// reply先をoverlay表示
function dispReply2(tw) {
	if (tw.errors) return error('', tw);
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
		$('rep').style.top = rep_top + 'px';
	} else
		$('reps').appendChild(document.createElement('hr'));
	$('reps').appendChild(el);
	$('rep').style.display = "block";
	scrollToDiv(el);
	user_picks.push(tw.user.screen_name);
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
	user_picks = [];
}
// quotedStatusをoverlay表示
function overlayQuoted(ele) {
	ele = ele.parentNode.parentNode;
	rep_top = cumulativeOffset(ele)[1];
	var tw = ele.parentNode.parentNode.tw;
	closeRep();
	setTimeout(function(){ dispReply2((tw.retweeted_status || tw).quoted_status); }, 0);
	return false;
}
// replyからユーザ間のタイムラインを取得
function pickup2() {
	user_picks = user_picks.uniq();
	if (user_picks.length < 2) return;
	switchUser(user_picks.join());
}
// ポップアップメニューの初期化
function popup_init() {
	var popup_id_list = ['popup_link_user', 'popup_link_status', 'popup_status_delete',
						'popup_status_retweet', 'popup_status_quote', 'popup_status_href',
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
	$('popup_status_delete').style.display = (selected_menu.id == "direct" || popup_ele.tw.user.screen_name == myname ? "block" : "none");
	$('popup_status_retweet').style.display = (selected_menu.id != "direct" ? "block" : "none");
	$('popup_status_quote').style.display = (selected_menu.id != "direct" ? "block" : "none");
	$('popup_status_href').style.display = (selected_menu.id != "direct" ? "block" : "none");
	$('popup').style.display = "block";
	var pos = cumulativeOffset(ele);
	$('popup').style.left = pos[0] <  $('popup').offsetWidth - ele.offsetWidth ? 0 : pos[0] - $('popup').offsetWidth + ele.offsetWidth + 'px';
	popup_top = pos[1] + 20;
	$('popup').style.top = popup_top + 'px';
	$('popup_hide').style.height = Math.max(document.body.scrollHeight, $("tw").offsetHeight+$("control").offsetHeight) + 'px';
	$('popup_hide').style.display = "block";
}
// ポップアップメニューを非表示
function popup_hide() {
	callPlugins("popup_hide");
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
	$('userinfo_popup').style.left = pos[0] <  $('userinfo_popup').offsetWidth - ele.offsetWidth ? 0 : pos[0] - $('userinfo_popup').offsetWidth + ele.offsetWidth + 'px';
	$('userinfo_popup').style.top = pos[1] + 20 + 'px';
	$('popup_hide').style.height = Math.max(document.body.scrollHeight, $("tw").offsetHeight+$("control").offsetHeight) + 'px';
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
	if (confirm_rt && !confirm(_("Retweet to your followers?"))) return false;
	var target_ele = ele;
	enqueuePost(twitterAPI + 'statuses/retweet/' + id + '.json',
		function(){
			var img = document.createElement("span");
			img.className = "rtinfo";
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
	if ($('lock-' + ele.id) && confirm_rt && !confirm(_("This tweet is protected; Are you sure to retweet?"))) return false;
	var tw = !display_as_rt && ele.tw.retweeted_status || ele.tw;
	$('fst').value = "RT @"+user+": " + charRef(text(tw));
	$('fst').focus(); $('fst').select();
	return false;
}
// 発言のURLを挿入
function hrefStatus(id, user, ele) {
	id = id || popup_id;
	user = user || popup_user;
	ele = ele || popup_ele;
	if (!id) return false;
	if ($('lock-' + ele.id) && confirm_rt && !confirm(_("This tweet is protected; Are you sure to insert URL?"))) return false;
	$('fst').value = $('fst').value + " https://twitter.com/" + user + "/statuses/" + id;
	$('fst').focus(); $('fst').select();
	return false;
}
// 発言の削除
function deleteStatus(id) {
	id = id || popup_ele.tw.id_str || popup_ele.tw.id;
	if (!id) return false;
	if (confirm_delete && !confirm(_('Are you sure to delete this tweet?'))) return false;
	for (var i = 0; i < 3; i++) {
		var target = $(['tw-','re-','tw2c-'][i]+id);
		if (target) {
			target.className += " deleted";
			target.tw.deleted = true;
		}
	}
	if (selected_menu.id == 'direct')
		enqueuePost(twitterAPI + 'direct_messages/events/destroy.json?_method=delete&id=' + id, function(){}, function(){});
	else
		enqueuePost(twitterAPI + 'statuses/destroy/' + id + '.json', function(){}, function(){});
	return false;
}
// 最新タイムラインを取得
function dec_id(id_str) {
	id_str = ('' + id_str).split('');
	var i = id_str.length - 1;
	while (id_str[i] == '0' && i) {
		id_str[i--] = '9';
	}
	id_str[i] = ''+(id_str[i]-1);
	return id_str.join('');
}
function update() {
	if (!myname) return auth();
	last_update_time = new Date();
	callPlugins("update");
	xds.load(twitterAPI + 'statuses/home_timeline.json' +
						'?count=' + (since_id ? 800 : max_count) +
						'&' + default_api_args_tl +
						(!no_since_id && since_id ? '&since_id='+dec_id(since_id) : ''),
			twShow, function(){
				if (first_update)
					error(_('Cannot get TL. Please try $1logout of Twitter web site$2.', '<a href="'+twitterURL+'logout" onclick="return link(this);" target="twitter">', '</a>'));
				else
					twFail();
			}, 3);
	resetUpdateTimer();
}
function resetUpdateTimer() {
	if (update_timer) clearInterval(update_timer);
	update_timer = setInterval(update, Math.max(parseInt(updateInterval||5)*1000, 5000));
}
// 外部リンクを開く際のフック
function link() { return true; }
// tweetのHTML表現を生成
var needGMT = isNaN(new Date("Wed Jan 01 00:00:00 +0000 2014").getDate());
function toDate(d) {
	return new Date(typeof(d)=='string' && needGMT ? d.replace('+','GMT+') : d);
}
function d2(dig) { return (dig>9?"":"0") + dig }
function dateFmt(d) {
	d = toDate(d);
	var now = new Date();
	var y = (d.getFullYear()*12 + d.getMonth() <= now.getFullYear()*12 + now.getMonth() - 12 ? d.getFullYear() + "/" : "")
	return y + (d.getMonth()+1) + "/" + d.getDate() + " " + d.getHours() + ":" + d2(d.getMinutes()) + ":" + d2(d.getSeconds());
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
var hashtag_pattern = (function() {
	var chars = 'A-Za-zÀ-ÖØ-öø-ÿĀ-ɏɓ-ɔɖ-ɗəɛɣɨɯɲʉʋʻ̀-ͯḀ-ỿЀ-ӿԀ-ԧⷠ-ⷿꙀ-֑ꚟ-ֿׁ-ׂׄ-ׇׅא-תװ-״﬒-ﬨשׁ-זּטּ-לּמּנּ-סּףּ-פּצּ-ﭏؐ-ؚؠ-ٟٮ-ۓە-ۜ۞-۪ۨ-ۯۺ-ۼۿݐ-ݿࢠࢢ-ࢬࣤ-ࣾﭐ-ﮱﯓ-ﴽﵐ-ﶏﶒ-ﷇﷰ-ﷻﹰ-ﹴﹶ-ﻼ‌ก-ฺเ-๎ᄀ-ᇿ㄰-ㆅꥠ-꥿가-힯ힰ-퟿ﾡ-ￜァ-ヺー-ヾｦ-ﾟｰＡ-Ｚａ-ｚぁ-ゖ゙-ゞ㐀-䶿一-鿿꜀-뜿띀-렟-﨟〃々〻';
	var chars_first_and_last = '0-9０-９_〜・' + chars;
	return '([#＃])([' + chars_first_and_last + ']*?[' + chars + '][' + chars_first_and_last + ']*)(?=[^' + chars + ']|$)';
})();
var regexp_links = RegExp('https?://t\\.co/\\w+|https?://[^/\\s]*[\\w!#$%&\'()*+,./:;=?~-]*[\\w#/+-]|[@＠](\\w+(?:/[\\w-]+)?)|([ -/:-@\\[-`{-~　、。！？「」（）『』｛｝［］【】]|\\s|^)' + hashtag_pattern, 'g');
function makeHTML(tw, no_name, pid, userdesc, noctl) {
	var rt = tw.retweeted_status;
	var rs = tw.retweeted_status || tw;
	var rt_mode = !!(display_as_rt || userdesc);
	var rt_cnt = (typeof(tw.retweet_count) == 'string' ? parseInt(tw.retweet_count) : tw.retweet_count);
	var fav_cnt = (typeof(tw.favorite_count) == 'string' ? parseInt(tw.favorite_count) : tw.favorite_count);
	var t = rt_mode ? tw : rs;
	var ttext = text(t);
	var un = t.user.screen_name;
	if (display_as_rt)
		ttext = rt && rt.user ? "RT @" + rt.user.screen_name + ":" + text(rt) : text(tw);
	if (userdesc)
		ttext = tw.user.description || '';
	var id = tw.id_str || tw.id;
	var id2 = t.id_str || t.id;
	var eid = pid+'-'+id;
	var in_reply_to = t.in_reply_to_status_id_str || t.in_reply_to_status_id;
	var quoted = false;
	var entities = ent(t, true);

	function replaceEntitiesWithLink(ttext, entities, tw) {
		var expandedTweetText = ttext;
		[{
			entities: entities.hashtags,
			prefix: '#＃',
			key: 'text',
			callback: function(p, s) {
				return '<a target="_blank" class="hashtag" title="#' + s + '" href="' + twitterURL + 'search?q='
					+ encodeURIComponent('#' + s) + '">' + p + s + '</a>';
			}
		}, {
			entities: entities.user_mentions,
			prefix: '@＠',
			key: 'screen_name',
			callback: function(p, s) {
				return '<a href="' + twitterURL + s + '" class="mention" onClick="switchUser(\'' + s + '\'); return false;" >'
					+ p + s + '</a>';
			}
		}, {
			entities: Array.prototype.concat.apply(entities.urls || [], entities.media || []),
			key: 'url',
			expandedKey: 'expanded_url',
			callback: function(p, s, e) {
				if (!quoted && tw.quoted_status && tw.quoted_status.user && tw.quoted_status_id_str
					&& (e.indexOf(twitterURL) === 0 || e.indexOf(twitterURL.replace(/^https:/, 'http:')) === 0)
					&& e.indexOf(tw.quoted_status_id_str) > -1) {
					quoted = true;
					return '<blockquote class="quoted">' + makeHTML(tw.quoted_status, false, pid, null, true) + '</blockquote>';
				}
				return '<a class="link" target="_blank" href="' + e.replace(/"/g, '%22') + '" onclick="return link(this);">'
					+ removeScheme(e).replace(/&/g, '&amp;') + '</a>';
			}
		}].forEach(function(a) {
			var ttextWithLink = '';
			var startWith = 0;
			Array.isArray(a.entities) && a.entities.forEach(function(s) {
				var startWithBefore = startWith;
				var prefixList = (a.prefix || '').split('');
				s[a.key] && (prefixList.length ? prefixList : ['']).forEach(function(p) {
					if (startWithBefore < startWith) return; // already replaced
					var index = expandedTweetText.indexOf(p + s[a.key], startWith);
					if (index < startWith) return; // entitiy not found in rest of text
					ttextWithLink += expandedTweetText.substring(startWith, index);
					ttextWithLink += a.callback(p, s[a.key], s[a.expandedKey || a.key]);
					startWith = index + (p + s[a.key]).length;
				});
			});
			expandedTweetText = ttextWithLink + expandedTweetText.substring(startWith);
		});
		return expandedTweetText;
	}

	return /*fav*/ (noctl || t.d_dir ? '' : '<div class="fav"><img alt="☆" src="images/icon_star_'+(rs.favorited?'full':'empty')+'.png" ' +
			'onClick="fav(this,\'' + id + '\')"' + (pid ? ' id="fav-'+eid+'"' : '') + '><span></span></div>')+
		 (!no_name || (!display_as_rt && rt) ?
			//ユーザアイコン
			'<img class="uicon" src="' + t.user.profile_image_url_https + '" title="' + (t.user.description ? t.user.description.replace(/"/g,'&quot;') :'') + '" onClick="switchUserTL(this.parentNode,'+rt_mode+');return false">' + (t.user.url ? '</a>' : '') +
			//名前
			'<a href="' + twitterURL + un + '" onClick="switchUserTL(this.parentNode,'+rt_mode+');return false" class="user"><span class="uid">@' + un + '</span>' +
			 /*プロフィールの名前*/ '<span class="uname' + (t.user.name!=un ? '' : '_same') + '"><span class="uname_paren">(</span>'+insertPDF(t.user.name)+'<span class="uname_paren2">)</span></span></a>'
		: '') +
		 /* verified? */ (!no_name && t.user.verified ? '<div id="verified-' + eid + '" class="verified"></div>' : '') +
		 /* protected? */ (t.user.protected ? '<div alt="lock" id="lock-' + eid + '" class="lock"></div>' : '') +
		/*ダイレクトメッセージの方向*/ (t.d_dir == 1 ? '<span class="dir">→</span> ' : t.d_dir == 2 ? '<span class="dir">←</span> ' : '') +
		//本文 (https〜をリンクに置換 + @を本家リンク+JavaScriptに置換)
		" <span id=\"text-" + eid + "\" class=\"status" + (tw.deleted ? " deleted" : "") + "\">" +
		(userdesc ? getDescripionHTML(tw.user) : replaceEntitiesWithLink(ttext, entities, t).replace(/\r?\n|\r/g, "<br>")) +
		(noctl ? '<a class="button inrep overlay" href="#" onclick="return overlayQuoted(this)"><img src="images/jump.png"></a>' : '') +
		'</span>' +
		(noctl ? '' :
		//Retweet情報
		(rt_cnt>0 || rt ?
			'<span id="rtinfo-'+eid+'" class="rtinfo'+(display_as_rt?' rtinfo-alt':'')+'">' +
				(rt && !display_as_rt ? 'by <a href="'+twitterURL+tw.user.screen_name+'" onclick="switchUserTL(this.parentNode.parentNode, true);return false"><img src="'+tw.user.profile_image_url_https+'" alt="@'+tw.user.screen_name+'" class="rtuicon">@'+tw.user.screen_name+'</a>'+(rt_cnt>1?' & '+(rt_cnt-1):'') : rt_cnt) +
			'</span>' : '') +
		//Favorited情報
		(fav_cnt > 0 ? '<span id="favinfo-'+eid+'" class="favinfo">'+fav_cnt+'</span>' : '') +
		//日付
		'<span id="utils-'+eid+'" class="utils">' +
		(tw.metadata && tw.metadata.result_type=='popular' ? '<span class="popular"></span>' : '') +
		'<span class="prop"><a class="date" target="twitter" href="'+twitterURL+(t.d_dir ? '#!/messages' : un+'/statuses/'+id2)+'" onclick="return link(this)">' + dateFmt(t.created_at) + '</a>' +
		//クライアント
		(t.source ? '<span class="separator"> / </span><span class="source">' + t.source.replace(/<a /,'<a target="twitter" onclick="return link(this)"') + '</span>' : '') + '</span>' +
		//Geolocation
		(rs.geo && rs.geo.type == 'Point' ? '<a class="button geomap" id="geomap-' + eid + '" target="_blank" href="https://maps.google.com?q=' + rs.geo.coordinates.join(',') + '" onclick="return link(this);"><img src="images/marker.png" alt="geolocation" title="' + rs.geo.coordinates.join(',') + '"></a>' : '') +
		(!rs.geo && rs.place ? '<a class="button geomap" id="geomap-' + eid + '" target="_blank" href="https://maps.google.com?q=' + encodeURIComponent(rs.place.full_name) + '" onclick="return link(this);"><img src="images/marker.png" alt="geolocation" title="' + rs.place.full_name.replace(/'/g,"&apos;") + '"></a>' : '') +
		//返信先を設定
		' <a class="button reply" href="javascript:replyTo(\'' + un + "','" + id2 + '\',\'' + eid + '\')"><img src="images/reply.png" alt="↩" width="14" height="14"></a>' +
		//返信元へのリンク
		(in_reply_to ? ' <a class="button inrep" href="#" onClick="dispReply(\'' + un + '\',\'' + in_reply_to + '\',this); return false;"><img src="images/inrep.png" alt="☞" width="14" height="14"></a>' : '') +
		//popupメニュー表示
		'&nbsp;&nbsp;&nbsp;<a class="button popup" href="#" onClick="popup_menu(\'' + un + "','" + id2 + '\', this); return false;"><small><small>▼</small></small></a>' +
		'</span>');
}
function removeScheme(url) {
	return url.replace(/^https?:\/\//, '');
}
function replaceUserAndHashtagWithLink(_, u, x, h, s) {
	if (h === "#" || h === "＃") {
		if (s.match(/^\d+$/)) return _;
		return (x + '<a target="_blank" class="hashtag" title="#' + s + '" href="' + twitterURL + 'search?q='
			+ encodeURIComponent('#' + s) + '">' + h + s + '</a>');
	} else if (u) {
		if (u.indexOf('/') > 0) return _;
		return '<a href="' + twitterURL + u + '"  class="mention" onClick="switchUser(\'' + u + '\'); return false;" >' + _ + '</a>';
	}
	return _;
}
function getDescripionHTML(user) {
	if (!user.description) return '<br>';
	var expanded_urls = {};
	if (user.entities && user.entities.description && Array.isArray(user.entities.description.urls)) {
		user.entities.description.urls.forEach(function(u) {
			if (u.url && u.expanded_url) {
				expanded_urls[u.url] = {
					display_url: u.display_url,
					expanded_url: u.expanded_url
				};
			}
		});
	}
	return user.description.replace(regexp_links, function(_, u, x, h, s) {
		if (h === "#" || h === "＃" || u) {
			return replaceUserAndHashtagWithLink(_, u, x, h, s);
		}
		var url = expanded_urls[_] || { display_url: _, expanded_url: _ };
		return ('<a class="link" target="_blank" href="' + url.expanded_url.replace(/"/g, '%22') + '" onclick="return link(this);">'
			+ url.display_url.replace(/&/g, '&amp;') + '</a>');
	}).replace(/\r?\n|\r/g, "<br>");
}
// ユーザ情報のHTML表現を生成
function makeUserInfoHTML(user) {
	function getWebSiteHTML(user) {
		if (!user.url) return '';
		var url = {};
		if (user.entities && user.entities.url && Array.isArray(user.entities.url.urls)) {
			var cand = user.entities.url.urls.filter(function(u) { return u.url === user.url; }).shift();
			if (cand) url = cand;
		}
		return '<a target="_blank" href="' + (url.expanded_url || user.url).replace(/"/g, '%22') + '" onclick="return link(this);">' + (url.display_url || user.url).replace(/&/g, '&amp;') + '</a>';
	}
	return '<a class="uicona" target="twitter" href="' + user.profile_image_url_https.replace('_normal', '') +'"><img class="uicon2" src="' + user.profile_image_url_https.replace('normal.','reasonably_small.') + '" onerror="if(this.src!=\''+user.profile_image_url_https+'\')this.src=\''+user.profile_image_url_https+'\'"></a><div id="profile"><div>' +
			(user.verified ? '<img class="verified" alt="verified" src="images/verified.png">' : '') +
			(user.protected ? '<img class="lock" alt="lock" src="images/icon_lock.png">' : '') +
			'<b>@' + user.screen_name + '</b> / <b>' + user.name + '</b></div>' +
			'<div class="udesc">' + getDescripionHTML(user) + '</div>' +
			'<div class="uloc">' + [user.location, getWebSiteHTML(user)].filter(function(u) { return !!u; }).join('・') + '</div>' +
			'<b><a href="' + twitterURL + user.screen_name + '/following" onclick="switchFollowing();return false;">' + user.friends_count + '<small>'+_('following')+'</small></a> / ' +
						'<a href="' + twitterURL + user.screen_name + '/followers" onclick="switchFollower();return false;">' + user.followers_count + '<small>'+_('followers')+'</small></a>' +
			' / <a href="' + twitterURL + user.screen_name + '" onclick="switchStatus();return false;">' + user.statuses_count + '<small>'+_('tweets')+'</small></a> / ' +
						'<a href="' + twitterURL + user.screen_name + '/favorites" onclick="switchFav();return false;">' + user.favourites_count + '<small>'+_('favs')+'</small></a></b>' +
			'</div></div>'+
			(user.screen_name != myname ? '<a class="button upopup" href="#" onClick="userinfo_popup_menu(\'' + user.screen_name + '\',' + (user.id_str || user.id) + ', this); return false;"><small><small>▼</small></small></a>' : '')+
			'<a target="twitter" href="' + twitterURL + user.screen_name + '">[Twitter]</a>'
}
// Rate Limit情報のHTML表現を生成
function makeRateLimitInfo(ep) {
	var family = ep.split('/')[0];
	var info = tw_limits.resources[family] && tw_limits.resources[family]['/'+ep];
	if (!info) return '<tr><th>' + ep + ' :</th><td>???</td>';
	var d = info.reset - Math.floor((new Date).getTime()/1000);
	return "<tr><th>" + ep + " :</th><td>" + info.remaining + "/" + info.limit + "</td><td>(" + Math.floor(d/60) + ":" + d2(Math.floor(d%60)) + ")</td></tr>"
}
// 過去の発言取得ボタン(DOM)生成
function nextButton(id, p) {
	var ret = document.createElement('div');
	ret.id = id;
	ret.className = 'get-next';
	ret.onclick = function() { getNext(this); };
	ret.innerHTML = (p ? '<span>' + p + '</span>' : '');
	return ret;
}
// favoriteの追加/削除
function fav(img, id) {
	if (img.src.indexOf('loading') >= 0) return;
	var f = img.src.indexOf('empty') >= 0;
	setFavIcon(img, id, -1);
	enqueuePost(twitterAPI + 'favorites/' + (f ? 'create' : 'destroy') + '.json?id=' + id,
		function(){ setFavIcon(img, id, f) }/*, function(){ setFavIcon(img, id, !f) }*/);
}
// favアイコンの設定(f=0: 未fav, f=1:fav済, f=-1:通信中)
function setFavIcon(img, id, f) {
	var img_tl = $('fav-tw-' + id);
	var img_re = $('fav-re-' + id);
	var img_tw2c = $('fav-tw2c-' + id);
	var img_url = (f==-1) ? 'images/icon_star_loading.png' :
						'images/icon_star_' + (f ? 'full' : 'empty') + '.png';
	img.src = img_url;
	if (img_tl) img_tl.src = img_url;
	if (img_re) img_re.src = img_url;
	if (img_tw2c) img_tw2c.src = img_url;
	callPlugins("fav", id, f, img, img_tl, img_re, img_tw2c);
}
// followとremove
function follow(f) {
	if (!f && !confirm(_("Are you sure to remove $1?", last_user))) return false;
	enqueuePost(twitterAPI + 'friendships/' + (f ? 'create' : 'destroy') + '.json?screen_name=' + last_user, reloadUser);
	return false;
}
// blockとunblock
function blockUser(f) {
	if (f && !confirm(_("Are you sure to block $1?", last_user))) return false;
	enqueuePost(twitterAPI + 'blocks/' + (f ? 'create' : 'destroy') + '.json?skip_status=1&screen_name=' + last_user, reloadUser);
	return false;
}
function reportSpam(f) {
	if (f && !confirm(_("Are you sure to report $1 as spam?", last_user))) return false;
	enqueuePost(twitterAPI + 'users/report_spam.json?screen_name=' + last_user, reloadUser);
	return false;
}
// ユーザ情報を表示
function applyLinearGrad(ele, dir, c, amax) {
	var r = parseInt(c.substr(0,2), 16);
	var g = parseInt(c.substr(2,2), 16);
	var b = parseInt(c.substr(4,2), 16);
	for (var i = 0; i < 4; i++) {
		var prefix = ['-moz-','-webkit-','-o-',''][i];
		try {
			ele.style.background = prefix + 'linear-gradient(' +
				(prefix != '' ? '' : 'to ') + dir +
				', rgba(' + r + ',' + g + ',' + b + ',' + (prefix != '' ? '0' : amax) + 
				') 0, rgba(' + r + ',' + g + ',' + b + ',' + (prefix != '' ? amax : '0') + 
				') 100%)';
		} catch (e) {}
		if (document.all) {
			ele.style.filter = "progid:DXImageTransform.Microsoft.gradient(GradientType="+(dir=="top"||dir=="bottom"?"0":"1")+", startColorstr='#"+(dir=="top"||dir=="left"?"00":"ff")+c+"',  endColorstr='#"+(dir=="top"||dir=="left"?"ff":"00")+c+"')";
		}
	}
}
function twUserInfo(user) {
	if (user.errors) return error('', user);
	var elem = $('user_info');
	elem.innerHTML = makeUserInfoHTML(user);
	callPlugins("newUserInfoElement", elem, user);
	if (show_header_img) {
		var hdr = document.createElement('div');
		hdr.id = "user_info_hdr";
		$('user_info_b').insertBefore(hdr, elem);
		hdr.innerHTML = '<div id="user_info_sl"></div><div id="user_info_sr"></div><div id="user_info_sb"></div>';
		var grad = document.createElement('div');
		grad.id = "user_info_grad";
		$('user_info_b').insertBefore(grad, elem);
		elem.className = 'user_header';
		hdr.style.backgroundImage = user.profile_banner_url ? 'url('+user.profile_banner_url+'/web)' : 'url(https://si0.twimg.com/a/1355267558/t1/img/grey_header_web.png)';
		var bg = user.profile_background_color;
		$('user_info_b').style.backgroundColor = "#"+bg;
		applyLinearGrad($('user_info_grad'), 'top', '000000', 0.55);
		applyLinearGrad(document.getElementById('user_info_sl'), 'right', bg, 1);
		applyLinearGrad(document.getElementById('user_info_sr'), 'left', bg, 1);
		applyLinearGrad(document.getElementById('user_info_sb'), 'top', bg, 1);
	}
	if (myname != user.screen_name) {
		xds.load_for_tab(twitterAPI + 'friendships/show.json' +
					'?source_screen_name=' + myname + '&target_id=' + (user.id_str || user.id) +
					'&' + default_api_args, twRelation);
	}
}
// ユーザ情報にフォロー関係を表示
function twRelation(rel) {
	var source = rel.relationship.source;
	var elem = $("user_info");
	if (source.followed_by)
		elem.innerHTML += '<a href="javascript:replyTo(\'' + rel.relationship.target.screen_name + '\',0,0,1)">[DM]</a>';
	elem.innerHTML += '<button type="button" onClick="follow('+!source.following+')">' + _(source.following ? 'Remove $1' : 'Follow $1', last_user) + '</button>';
	if (source.followed_by)
		$("profile").innerHTML += "<br><span id=\"following_you\" class=\"following_you\">" + _('$1 is following you!', rel.relationship.target.screen_name)+'</span>';
	callPlugins("newUserRelationship", elem, rel);
}
// ユーザ情報キャッシュ
function fetchUserCache(list) {
	for (var i = 0; i < list.length; i++) {
		if (!list[i] || user_cache[list[i]]) continue;
		if (user_cache_fetch_list.indexOf(list[i]) >= 0) continue;
		user_cache_fetch_list.push(list[i]);
		xds.load(twitterAPI + 'users/show.json?user_id=' + list[i] + '&' +
					default_api_args, cacheUserInfo, twFail);
	}
}
function fetchUserCacheByScreenName(user, callback, args) {
	if (user_cache_by_screen_name[user]) return callback.apply(this, args);
	xds.load(twitterAPI + 'users/show.json?screen_name=' + user + '&' +
				default_api_args, cacheUserInfo, twFail);
	user_fetch_callback = [callback, args];
}
function cacheUserInfo(u) {
	if (u.errors) return error('', u);
	user_cache[u.id_str] = u;
	user_cache_by_screen_name[u.screen_name] = u;
	var idx = user_cache_fetch_list.indexOf(u.id_str);
	if (idx >= 0) user_cache_fetch_list.splice(idx, 1);
	if (user_cache_fetch_list.length == 0 && user_fetch_callback) {
		user_fetch_callback[0].apply(this, user_fetch_callback[1]);
		user_fetch_callback = null;
	}
}
function invokeUserFetch(callback, args) {
	if (user_cache_fetch_list.length == 0)
		return callback.apply(this, args);
	user_fetch_callback = [callback, args];
}
// ダイレクトメッセージ一覧の受信
function twDirect(tw) {
	if (tw.errors) return error('', tw);
	for (var i = 0; i < tw.events.length; i++) {
		var e = tw.events[i];
		if (!e.message_create) continue;
		fetchUserCache([e.message_create.sender_id, e.message_create.target.recipient_id]);
	}
	invokeUserFetch(twDirectList, [tw]);
}
function twDirectList(tw) {
	tw = tw.events.map(function(e){
		if (!e.message_create || !e.message_create.message_data) return null;
		var d = e.message_create.message_data;
		if (e.message_create.sender_id != myid) {
			d.user = user_cache[e.message_create.sender_id];
			d.d_dir = 1;
		} else {
			d.user = user_cache[e.message_create.target.recipient_id];
			d.d_dir = 2;
		}
		d.id_str = d.id = e.id;
		d.created_at = new Date(+e.created_timestamp);
		return d;
	});
	twShow2(tw);
}
function checkDirect() {
	direct_ele = xds.load_default(twitterAPI + 'direct_messages/events/list.json?' +
								default_api_args, twDirectCheck, direct_ele);
	update_direct_counter = 2;
}
function twDirectCheck(tw) {
	if (tw.errors) return error('', tw);
	if (!tw || tw.events.length == 0) return false;
	var id = tw.events[0].id;
	if (last_direct_id && last_direct_id != id) {
		$("direct").className += " new";
		callPlugins('notifyDM', tw.events, last_direct_id);
	}
	last_direct_id = id;
}
// API情報の受信
function twConfig(config) {
	tw_config = config;
	if (tw_config && tw_config.short_url_length)
		while (t_co_maxstr.length < tw_config.short_url_length)
			t_co_maxstr += "*";
}
function twRateLimit(limits) {
	if (limits.errors) return error('', limits);
	tw_limits = limits;
	if (selected_menu.id != "misc") return;
	var ele = document.createElement('div');
	ele.className = 'ratelimits';
	ele.innerHTML = '<table>' + makeRateLimitInfo('statuses/home_timeline') +
					makeRateLimitInfo('statuses/mentions_timeline') +
					makeRateLimitInfo('statuses/user_timeline') +
					makeRateLimitInfo('statuses/show/:id') +
					makeRateLimitInfo('friendships/show') +
					makeRateLimitInfo('search/tweets') +
					makeRateLimitInfo('lists/statuses') +
					'</table>';
	$('tw2c').innerHTML = '<div><b>API statuses:</b></div>'
	$('tw2c').appendChild(ele);
}
function updateRateLimit(callback) {
	xds.load(twitterAPI + 'application/rate_limit_status.json' +
				'?resources='+api_resources.join(',') + '&' + default_api_args,
		function(limits){
			if (limits.errors) return error('Cannot update rate limit status', limits);
			tw_limits = limits;
			callback(limits);
		});
}
// 新着reply受信通知
function noticeNewReply(replies) {
	if ($("reply").className.indexOf("new") < 0)
		$("reply").className += " new";
	callPlugins("noticeNewReply", replies);
}
// 新着repliesを取得
function getReplies() {
		reply_ele2 = xds.load_default(twitterAPI + 'statuses/mentions_timeline.json' +
						'?count=' + (since_id_reply ? 800 : max_count_u) +
						(since_id_reply ? '&since_id='+since_id_reply : '') +
						'&' + default_api_args_tl,
						twReplies, reply_ele2);
		update_reply_counter = 2;
}
// 受信repliesを表示
function twReplies(tw, fromTL) {
	if (tw.errors) return error('', tw);

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
function removeLink(text) {
	return text.replace(/https?:\/\/[^/\s]*[\w!#$%&'()*+,./:;=?~-]*[\w#/+-]/g, '');
}
function twShow(tw) {
	first_update = false;
	if (tw.errors) return error('', tw);

	tw.reverse();
	var skipped = !no_since_id && !!since_id && tw.length > max_count*0.9; // several(10% is heuristic...) tweets may not be retrieved
	for (var j in tw) if (tw[j] && tw[j].user) {
		callPlugins("gotNewMessage", tw[j]);
		if (since_id && since_id == (tw[j].id_str || tw[j].id))
			skipped = false;
		if (update_post_check && tw[j].user.screen_name == myname && removeLink(text(tw[j])) == removeLink(update_post_check[1])) {
			if ($('fst').value == update_post_check[1]) resetFrm();
			if (update_post_check[0] != 1) postTimeout = Math.max(1000, postTimeout-50);
			update_post_check = false;
		}
	}
	tw.reverse();
	if (nr_page == 0) {
		nr_page = max_count == 800 ? 2 : 1;
		$("tw").appendChild(nextButton('get_old', nr_page));
		skipped = false;
	} else if (skipped) {
		skipped = document.createElement('div');
		skipped.innerHTML = '…';
		skipped.className = 'skipped';
	}

	var nr_shown = twShowToNode(tw, $("tw"), false, false, true, true, true);
	if (nr_shown && skipped)
		$("tw").childNodes[0].appendChild(skipped);
	if ($("tw").oldest_id && update_reply_counter-- <= 0)
		getReplies();
	if (update_direct_counter-- <= 0)
		checkDirect();
	callPlugins("noticeUpdate", tw, nr_shown);
	if (update_post_check) {
		var st = document.frm.status;
		if (update_post_check[0] != 1)  {
			postTimeout = Math.min(10000, postTimeout+500);
			if (update_post_check[0] == 0 && st.value == update_post_check[1] && st.value == last_post) {
				st.value = 'r';
				press(1);
			} else
				update_post_check = false;
		} else {
			// fault again...
			update_post_check = false;
			if (!tweet_failed_notified)
				error(_('Cannot tweet from twicli? Please try logging out of Twitter web site...'));
			tweet_failed_notified = true;
		}
	}
}
function twOld(tw) {
	if (tw.errors) return error('', tw);
	var tmp = $("tmp");
	twShowToNode(tw, $("tw"), false, true, false, false, false, true);
	if (tmp && tmp.parentNode) tmp.parentNode.removeChild(tmp);
	$("tw").appendChild(nextButton('get_old', nr_page));
}
function twOldReply(tw) {
	if (tw.errors) return error('', tw);
	var tmp = $("tmp");
	twShowToNode(tw, $("re"), false, true, false, false, false, true);
	if (tmp && tmp.parentNode) tmp.parentNode.removeChild(tmp);
	$("re").appendChild(nextButton('get_old_re', nr_page_re));
}
function getTwMaxId(tw) {
	var last_tw = tw[tw.length-1] || [];
	return last_tw.id_str || last_tw.id || '';
}
function twShow2(tw) {
	var user_info = $("user_info");
	if ((tw.errors && tw.errors[0].message.indexOf("Not authorized") >= 0 || tw.error && tw.error.indexOf("Not authorized") >= 0 || tw.length < 1 ) && !!user_info && !fav_mode && user_info.innerHTML == '') {
		xds.load_for_tab(twitterAPI + 'users/show.json?screen_name=' + last_user +
			'&' + default_api_args_tl, twUserInfo);
		return;
	}
	if (tw.error) return error(tw.error);
	if (tw.errors) return error('', tw);
	if (tw.length < 1) return;
	var tmp = $("tmp");
	if (tmp && tmp.parentNode) tmp.parentNode.removeChild(tmp);
	twShowToNode(tw, $("tw2c"), !!user_info && !fav_mode, cur_page > 1);
	if (selected_menu.id == "reply" || selected_menu.id == "user" && last_user.indexOf(',') < 0) {
		max_id = getTwMaxId(tw);
		$("tw2c").appendChild(nextButton('next'));
		get_next_func = getNextFuncCommon;
	}
	if (tw[0] && selected_menu.id == "user" && last_user.indexOf(',') < 0 && !fav_mode && user_info.innerHTML == '')
		twUserInfo(tw[0].user);
	if (tw[0] && selected_menu.id == "user" && last_user.indexOf('id=') == 0)
		$("user").innerHTML = last_user = tw[0].user.screen_name;
}
function twShow3(tw) {
	if (tw.errors) return error('', tw);
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
	if (tw.errors) return error('', tw);
	var tmp = $("tmp");
	if (tmp && tmp.parentNode) tmp.parentNode.removeChild(tmp);
	var tw2 = tw.users.map(function(x){
		if (!x.status) x.status = {'text':'', id:0, 'created_at':x.created_at};
		x.status.user = x;
		return x.status;
	});
	twShowToNode(tw2, $("tw2c"), false, cur_page > 1, false, false, false, false, false, true);
	if (tw.next_cursor) {
		$("tw2c").appendChild(nextButton('next'));
		get_next_func = function() {
			cur_page++;
			xds.load_for_tab(twitterAPI +
					(fav_mode == 2 ? 'friends/list.json' : 'followers/list.json') +
					'?screen_name=' + last_user + '&cursor=' + tw.next_cursor +
					'&' + default_api_args_tl, twUsers);
		};
	}
}
function twShowToNode(tw, tw_node, no_name, after, animation, check_since, ignore_old, ignore_new, weak, userdesc) {
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
			s.innerHTML = makeHTML(tw[i], no_name, tw_node.id, userdesc);
			s.screen_name = tw[i].user.screen_name;
			s.tw = tw[i]; // DOMツリーにJSONを記録
			if (weak) s.weak = true;
			if (tw[i].d_dir == 1 || text(tw[i]).match(myname_r)) {
				s.className = "tome";
				if ((tw_node.id == "tw" || tw_node.id == "re") && !duplication) {
					replies.push(tw[i]);
				}
			}
			var user = tw[i].retweeted_status && tw[i].retweeted_status.user || tw[i].user;
			if (tw[i].d_dir == 2 || user.screen_name == myname)
				s.className = "fromme";
			if (tw[i].retweeted_status && !userdesc)
				s.className += " retweeted";
			if (userdesc)
				s.className += " userdesc";
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
		$('rep').style.top = (rep_top += ch) + 'px';
		$('popup').style.top = (popup_top += ch) + 'px';
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
		for (i = 0; i < 3 && i < tw_node.childNodes.length; i++) { // 最大3要素スキャン
			var target_block = tw_node.childNodes[tw_node.childNodes.length-i-1].childNodes;
			var target_ele = target_block[target_block.length-1];
			if (!target_ele.weak && target_ele.tw && (target_ele.tw.id < tl_oldest_id || !tl_oldest_id))
				tl_oldest_id = target_ele.tw.id;
		}
		tw_node.oldest_id = tl_oldest_id;
	}
	for (i = 0; check_since && i < len; i++) {
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
	callPlugins("added", tw, tw_node.id, after);
	return nr_show;
}
// 新規tweetの出現アニメーション処理
function animate(elem, max, start) {
	var t = (new Date).getTime();
	if (start+1000 <= t)
		return elem.style.maxHeight = 'none';
	elem.style.maxHeight = Math.ceil(max*(1-Math.cos((t-start)/1000*Math.PI))/2) + 'px';
	setTimeout(function(){animate(elem, max, start)}, 20);
}
// 次ページ取得
function getNext(ele) {
	var tmp = document.createElement("div");
	tmp.id = "tmp";
	tmp.innerHTML = "<p></p>";
	ele.parentNode.appendChild(tmp);
	ele.parentNode.removeChild(ele);
	get_next_func();
}
function getOldTL() {
	update_ele2 = xds.load_default(twitterAPI + 'statuses/home_timeline.json' +
				'?count=800&page=' + (nr_page++) +
				'&' + default_api_args_tl, twOld, update_ele2);
}
function getOldReply() {
	update_ele2 = xds.load_default(twitterAPI + 'statuses/mentions_timeline.json' +
				'?count=' + max_count_u + '&page=' + (nr_page_re++) +
				'&' + default_api_args_tl, twOldReply, update_ele2);
}
function getNextFuncCommon() {
	if (selected_menu.id == "user" && !fav_mode)
		xds.load_for_tab(twitterAPI + 'statuses/user_timeline.json' +
					'?count=' + max_count_u + '&page=' + (++cur_page) + 
					'&screen_name=' + last_user +
					'&include_rts=true&' + default_api_args_tl, twShow2);
	else if (selected_menu.id == "user" && fav_mode == 1)
		xds.load_for_tab(twitterAPI + 'favorites/list.json?screen_name=' + last_user +
					'&page=' + (++cur_page) + '&' + default_api_args_tl, twShow2);
	else if (selected_menu.id == "user" && fav_mode == 4) {
		++cur_page;
		xds.load_for_tab(twitterAPI + 'statuses/following_timeline.json' +
					'?count = ' + max_count_u + '&max_id=' + max_id +
					'&screen_name=' + last_user + '&' + default_api_args_tl, twShow2);
	}
}
// タイムライン切り替え
function switchTo(id) {
	if (err_timeout) {
		clearTimeout(err_timeout);
		err_timeout = error_animate(false);
	}
	xds.abort_tab();
	if (selected_menu.id == "TL" || selected_menu.id == "reply") {
		if (getScrollY() >= 10) {
			// スクロール位置を保持
			selected_menu.lastTopDiv = $(selected_menu.id=="TL"?"tw":"re").childNodes[0];
			selected_menu.lastScrollY = getScrollY() - selected_menu.offsetTop;
		} else {
			selected_menu.lastTopDiv = null;
			selected_menu.lastScrollY = 0;
		}
	}
	var last_menu = selected_menu;
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
	if (last_menu.id != id && (id == "TL" || id == "reply") &&
		selected_menu.lastScrollY && selected_menu.lastTopDiv && selected_menu.lastTopDiv.parentNode) {
		scrollTo(0, selected_menu.lastScrollY + selected_menu.lastTopDiv.offsetTop);
	} else {
		scrollTo(0, 1);
		scrollTo(0, 0);
	}
	cur_page = 1;
	fav_mode = 0;
	callPlugins("switchTo", selected_menu, last_menu);
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
		getReplies();
	} else {
		switchTo("reply");
	}
}
function switchUserTL(div, rt) {
	var tw = div.tw;
	if (!tw) {
		tw = div.parentNode.parentNode.tw;
		tw = tw.quoted_status || tw.retweeted_status.quoted_status;
	}
	if (!(rt || display_as_rt))
		tw = tw.retweeted_status || tw;
	if (tw.user.description)
		last_user_info = tw.user;
	switchUser(tw.user.screen_name);
}
function reloadUser() {
	switchUser();
}
function switchUser(user) {
	if (!user) {
		user = last_user;
		last_user_info = null;
	}
	last_user = user;
	$("user").innerHTML = user;
	switchTo("user");
	var users = user.split(',');
	if (users.length == 1) {
		$("tw2h").innerHTML = (show_header_img ? "<div id=\"user_info_b\">" : "") + "<div id=\"user_info\"></div>" + (show_header_img ? "</div>" : "");
		if (last_user_info && last_user_info.screen_name == user)
			twUserInfo(last_user_info);
		var query = user.indexOf('id=') == 0 ? 'user_id=' + user.substr(3) : 'screen_name=' + user;
		xds.load_for_tab(twitterAPI + 'statuses/user_timeline.json' +
			'?count=' + max_count_u + '&' + query +
			'&include_rts=true&' + default_api_args_tl, twShow2);
	} else {
		users_log = [];
		xds.abort_tab();
		for (var i = 0; i < users.length; i++)
			xds.load_for_tab(twitterAPI + 'statuses/user_timeline.json?screen_name=' + users[i] +
				'&' + default_api_args_tl + '&include_rts=true&count=' + max_count_u, twShow3);
	}
}
function switchStatus() {
	cur_page = 1;
	fav_mode = 0;
	$("tw2c").innerHTML = "";
	xds.load_for_tab(twitterAPI + 'statuses/user_timeline.json' +
		'?count=' + max_count_u + '&screen_name=' + last_user + 
		'&include_rts=true&' + default_api_args_tl, twShow2);
}
function switchFav() {
	cur_page = 1;
	fav_mode = 1;
	$("tw2c").innerHTML = "";
	xds.load_for_tab(twitterAPI + 'favorites/list.json?screen_name=' + last_user +
					'&' + default_api_args_tl, twShow2);
}
function switchFollowing() {
	cur_page = 1;
	fav_mode = 2;
	$("tw2c").innerHTML = "";
	xds.load_for_tab(twitterAPI + 'friends/list.json?screen_name=' + last_user + 
			'&cursor=-1&' + default_api_args_tl, twUsers);
}
function switchFollower() {
	cur_page = 1;
	fav_mode = 3;
	$("tw2c").innerHTML = "";
	xds.load_for_tab(twitterAPI + 'followers/list.json' +
		'?screen_name=' + last_user + '&cursor=-1&' + default_api_args_tl, twUsers);
}
function switchDirect() {
	switchTo("direct");
	xds.load_for_tab(twitterAPI + 'direct_messages/events/list.json' +
						'?&count=50&' + default_api_args, twDirect);
}
function switchMisc() {
	switchTo("misc");
	$("tw2h").innerHTML = '<br><a id="clientname" target="twitter" href="index.html"><b>twicli</b></a> : A browser-based Twitter client<br><small id="copyright">Copyright &copy; 2008-2019 NeoCat</small><hr class="spacer">' +
	'<a href="javascript:showMediaOption()">' + _('Upload images') + '</a><br>' +
					'<form id="switchuser" onSubmit="switchUser($(\'user_id\').value); return false;">'+
					_('show user info')+' : @<input type="text" size="15" id="user_id" value="' + myname + '"><button type="submit" class="go"></button></form>' +
					'<a id="logout" href="javascript:logout()"><b>'+_('Log out')+'</b></a><hr class="spacer">' +
					'<form id="theme" onSubmit="return false;">' +
					_('Theme') + ': <select id="themelist" onchange="changeTheme(this.value)"></select><span id="theme-loading">Loading ...</span><a href="#">' +
					'<button type="button" style="display:none;" class="go" id="theme-link" onclick="window.open(this.href); return false"></button>' +
					'</form>' +
					'<div id="pref"><a href="javascript:togglePreps()">▼<b>'+_('Preferences')+'</b></a>' +
					'<form id="preps" onSubmit="try { setPreps(this); } catch(e) { alert(\'Cannot save preferences: \'+e) } return false;" style="display: none;">' +
					_('language')+': <select name="user_lang">'+(['en'].concat(langList)).map(function(x){
							return '<option value="'+x+'"'+(x==user_lang?' selected':'')+'>'+langNames[x]+'</option>';
						})+'</select><br>' +
					_('max #msgs in TL')+': <input type="text" name="limit" size="5" value="' + nr_limit + '"><br>' +
					_('#msgs in TL on update (max=800)')+': <input type="text" name="maxc" size="3" value="' + max_count + '"><br>' +
					_('#msgs in user on update (max=800)')+': <input type="text" name="maxu" size="3" value="' + max_count_u + '"><br>' +
					_('update interval')+': <input type="text" name="interval" size="3" value="' + updateInterval + '"> sec<br>' +
					'<label><input type="checkbox" name="since_check"' + (no_since_id?"":" checked") + '>'+_('since_id check')+'</label><br>' +
					'<label><input type="checkbox" name="replies_in_tl"' + (replies_in_tl?" checked":"") + '>'+_('Show not-following replies in TL')+'</label><br>' +
					'<label><input type="checkbox" name="reply_to_all"' + (reply_to_all?" checked":"") + '>'+_('Reply to all')+'</label><br>' +
					'<label><input type="checkbox" name="display_as_rt"' + (display_as_rt?" checked":"") + '>'+_('Show retweets in "RT:" form')+'</label><br>' +
					'<label><input type="checkbox" name="counter"' + (no_counter?"":" checked") + '>'+_('Post length counter')+'</label><br>' +
					'<label><input type="checkbox" name="resize_fst"' + (no_resize_fst?"":" checked") + '>'+_('Auto-resize field')+'</label><br>' +
					'<label><input type="checkbox" name="decr_enter"' + (decr_enter?" checked":"") + '>'+_('Post with ctrl/shift+enter')+'</label><br>' +
					'<label><input type="checkbox" name="confirm_too_long"' + (confirm_too_long?" checked":"") + '>'+_('Confirm before posting too long tweets')+'</label><br>' +
					'<label><input type="checkbox" name="confirm_close"' + (confirm_close?" checked":"") + '>'+_('Confirm before closing tabs')+'</label><br>' +
					'<label><input type="checkbox" name="confirm_delete"' + (confirm_delete?" checked":"") + '>'+_('Confirm before deleting tweets')+'</label><br>' +
					'<label><input type="checkbox" name="confirm_rt"' + (confirm_rt?" checked":"") + '>'+_('Confirm before retweet')+'</label><br>' +
					'<label><input type="checkbox" name="geotag"' + (no_geotag?"":" checked") + '>'+_('Enable GeoTagging')+'</label><br>' +
					'<label><input type="checkbox" name="post_via_agent"' + (post_via_agent?" checked":"") + '>'+_('Tweet via GAE server')+'</label><br>' +
					'<label><input type="checkbox" name="show_header_img"' + (show_header_img?" checked":"") + '>'+_('Show header image')+'</label><br>' +
					(dnd_image_upload_supported ? '<label><input type="checkbox" name="dnd_image_upload"' + (dnd_image_upload?" checked":"") + '>'+_('Drag&drop image upload')+'</label><br>' : '') +
					_('Footer')+': <input type="text" name="footer" size="20" value="' + footer + '"><br>' +
					_('Plugins')+':<br><textarea cols="30" rows="4" name="list">' + pluginstr + '</textarea><br>' +
					_('user stylesheet')+':<br><textarea cols="30" rows="4" name="user_style">' + user_style + '</textarea><br>' +
					'<button type="submit">'+_('Save')+'</button>&nbsp;<button onclick="uploadSettings(); return false">'+_('Upload')+'</button><button onclick="downloadSettings(); return false">'+_('Download')+'</button></form></div><hr class="spacer">';
	callPlugins("miscTab", $("tw2h"));
	xds.load_for_tab(twitterAPI + 'application/rate_limit_status.json' +
				'?resources='+api_resources.join(',') + '&' + default_api_args, twRateLimit);
	loadTheme();
}
function loadTheme() {
	if (!window.themes)
		return xds.load_for_tab('themes.json', function(t) { if (t) { window.themes = t; loadTheme(); }});
	$('theme-loading').style.display = 'none';
	$('themelist').innerHTML = '';
	var current_theme = readCookie('theme_name') || (dark_mode ? 'dark' : 'default');
	for (var i = 0; i < window.themes.length; i++) {
		var t = window.themes[i];
		window.themes[t.name] = t;
		var option = document.createElement('option');
		option.text = t.name;
		option.value = t.name;
		option.selected = current_theme == t.name;
		$('themelist').add(option);
	}
}
function changeTheme(t) {
	var css = $('theme_css');
	var themes = window.themes;
	if (themes[t] && themes[t].type == "link") {
		$('theme-link').href = themes[t].url;
		$('theme-link').style.display = 'inline';
	}
	if (themes[t] && themes[t].type == "css") {
		$('theme-link').style.display = 'none';
		try {
			css.innerHTML = themes[t].content;
		} catch(e) {
			alert("Couldn't apply theme. Please relaod.");
			return;
		}
		if (dark_mode) document.head.removeChild($('dark_mode'));
		dark_mode = false;
		setFstHeight(null, true);
		writeCookie('theme_name', t, 3652);
		writeCookie('theme_css', themes[t].content, 3652);
		callPlugins('changeTheme', themes[t]);
	}
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
	updateInterval = Math.max(parseInt(frm.interval.value), 60);
	no_since_id = !frm.since_check.checked;
	no_counter = !frm.counter.checked;
	no_resize_fst = !frm.resize_fst.checked;
	replies_in_tl = frm.replies_in_tl.checked;
	reply_to_all = frm.reply_to_all.checked;
	display_as_rt = frm.display_as_rt.checked;
	confirm_close = frm.confirm_close.checked;
	confirm_delete = frm.confirm_delete.checked;
	confirm_rt = frm.confirm_rt.checked;
	confirm_too_long = frm.confirm_too_long.checked;
	footer = new String(frm.footer.value);
	decr_enter = frm.decr_enter.checked;
	no_geotag = !frm.geotag.checked;
	post_via_agent = frm.post_via_agent.checked;
	show_header_img = frm.show_header_img.checked;
	dnd_image_upload = dnd_image_upload_supported && frm.dnd_image_upload.checked;
	user_style = frm.user_style.value;
	try {
		$('usercss').innerHTML = user_style;
	} catch(e) {
		if (window.console && console.log)
			console.log('Cannot set user style:' + e);
	}
	resetUpdateTimer();
	writeCookie('ver', currentCookieVer, 3652);
	writeCookie('user_lang', user_lang, 3652);
	writeCookie('limit', nr_limit, 3652);
	writeCookie('max_count', max_count, 3652);
	writeCookie('max_count_u', max_count_u, 3652);
	writeCookie('update_interval', updateInterval, 3652);
	writeCookie('no_since_id', no_since_id?1:0, 3652);
	writeCookie('no_counter', no_counter?1:0, 3652);
	writeCookie('no_resize_fst', no_resize_fst?1:0, 3652);
	writeCookie('replies_in_tl', replies_in_tl?1:0, 3652);
	writeCookie('reply_to_all', reply_to_all?1:0, 3652);
	writeCookie('display_as_rt', display_as_rt?1:0, 3652);
	writeCookie('footer', footer, 3652);
	writeCookie('decr_enter', decr_enter?1:0, 3652);
	writeCookie('confirm_close', confirm_close?1:0, 3652);
	writeCookie('confirm_delete', confirm_delete?1:0, 3652);
	writeCookie('confirm_rt', confirm_rt?1:0, 3652);
	writeCookie('confirm_too_long', confirm_too_long?1:0, 3652);
	writeCookie('no_geotag', no_geotag?1:0, 3652);
	writeCookie('post_via_agent', post_via_agent?1:0, 3652);
	writeCookie('show_header_img', show_header_img?1:0, 3652);
	writeCookie('dnd_image_upload', dnd_image_upload?1:0, 3652);
	writeCookie('tw_plugins', new String(" " + frm.list.value), 3652);
	writeCookie('user_style', new String(frm.user_style.value), 3652);
	callPlugins('savePrefs', frm);
	alert(_("Your settings are saved. Please reload to apply plugins."));
}
// 画像ファイルの検証
function checkMedia() {
	var m = $('media');
	if (m.files && m.files[0] && m.files[0].size > tw_config.photo_size_limit) {
		error(_("This image is larger than $1MB.", tw_config.photo_size_limit>>20));
		m.value = "";
	}
}
// 画像アップロードボックスの表示
function showMediaOption() {
	if (!$('media'))
		$("option").innerHTML += '<form id="imgup">'+_('Images')+': <div id="media_div"><input id="media" type="file" name="media[]" multiple onchange="checkMedia()" onclick="var m=$(\'media\').ondrop; if(m) m()"</div><div id="imgclr" class="clr"  onclick="$(\'option\').removeChild($(\'imgup\'));setFstHeight(null,true)">';
	setFstHeight(null, true);
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
	// ファイルドロップで画像投稿 - 現状ではWebKit系／Firefoxでしか動作しない
	if (!dnd_image_upload || !dnd_image_upload_supported) return;
	document.ondragenter = function(e) {
		e.preventDefault();
		showMediaOption();
		var m = $('media');
		if (m.style.position == 'fixed') return;
		var of = cumulativeOffset(m);
		var btn_w = m.clientWidth;
		var btn_h = m.clientHeight;
		var win_w = window.innerWidth || document.documentElement.clientWidth
		var win_h = window.innerHeight || document.documentElement.clientHeight;
		console.log(of);
		m.style.position = "fixed";
		m.style.zIndex = 20;
		m.style.left = m.style.top = 0;
		m.style.width = m.style.height = "100%";
		m.style.paddingLeft = of[0] + "px";
		m.style.paddingTop = of[1] + "px";
		m.style.paddingRight = win_w - of[0] - btn_w + "px";
		m.style.paddingBottom = win_h - of[1] - btn_h + "px";
		m.ondragenter = function(e) { e.stopPropagation(); };
		m.ondrop = function(e) {
			if (e) e.stopPropagation();
			m.style.position = "static";
			m.style.width = m.style.height = "auto";
			m.style.paddingLeft = m.style.paddingTop = m.style.paddingRight = m.style.paddingBottom = 0;
			setFstHeight(null, true);
			setTimeout(function(){
				var m = $('media');
				if (m && !m.value)
					$("option").removeChild($("imgup"));
					setFstHeight(null, true);
			}, 1);
		};
		m.ondragleave = function(e) {
			e.preventDefault();
			m.ondrop(e);
		};
	}
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
		var ps = pluginstr.split(/[\r\n]+/);
		var pss = "";
		for (var i = 0; i < ps.length; i++) {
			pss += '<scr'+'ipt type="text/javascript">plugin_name="'+ps[i].replace(/[\\"]/g,'')+'"</scr'+'ipt>';
			pss += '<scr'+'ipt type="text/javascript" src="' + (ps[i].indexOf("/") >= 0 ? ps[i] : 'plugins/'+ps[i]+'?'+document.twicli_js_ver) + '"></scr'+'ipt>';
		}
		document.write(pss);
	}
}
