// DOM Storage (or Cookie)
var use_local_storage = true;
try {
	window.sessionStorage; /* check DOM storage is accessible */
	if (!window.localStorage) window.localStorage = window.globalStorage && window.globalStorage[location.hostname];
} catch(e) { use_local_storage = false; }
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
var cpath = location.pathname.replace(/\/oauth\/[^/]+$/,'/');
function writeCookie(key, val) {
	if (use_local_storage && window.localStorage)
		try {
			deleteCookie(key); // to avoid exception on iPad
			window.localStorage["twicli_"+key] = val;
		} catch(e) {
			alert("DOM storage write error!\n" + e);
		}
	else {
		var sday = new Date();
		sday.setTime(sday.getTime() + (1000 * 60 * 60 * 24 * 365));
		document.cookie = key + "=" + escape(val) + ";path=" + cpath + ";expires=" + sday.toGMTString();
	}
}
function deleteCookie(key) {
	try { delete window.localStorage["twicli_"+key]; } catch(e) {}
	var sday = new Date();
	sday.setTime(sday.getTime() - 1);
	document.cookie = key + "=;path=" + cpath + ";expires=" + sday.toGMTString();
}

function preAuth(f) {
	var key = f.oauth_token.value;
	if (key.match(/^oauth_token=([^&]+)&oauth_token_secret=([^&]+)/)) {
		writeCookie('request_token', RegExp.$1);
		writeCookie('request_secret', RegExp.$2);
		f.oauth_token.value = RegExp.$1;
	} else {
		alert("Invalid format. Please reload and retry the steps.");
		return false;
	}
	return true;
}

function getArg(key) { var v = location.search.split(key+'='); return v[1] && v[1].split('&')[0]; }

function fillRequst(f1, f2) {
	f1.oauth_token.value = readCookie('request_token');
	f2.tokenSecret.value = readCookie('request_secret');
	deleteCookie('request_token');
	deleteCookie('request_secret');
	if (getArg('oauth_token') != f1.oauth_token.value) {
		alert("Authentication failed." + "\n" + getArg('oauth_token') +"\n"+ f1.oauth_token.value);
		top.location.href = "index.html";
	}
	f1.oauth_verifier.value = getArg('oauth_verifier');
}

function saveAccessToken(f) {
	var key = f.oauth_token.value;
	if (key.match(/^oauth_token=([^&]+)&oauth_token_secret=([^&]+)/)) {
		writeCookie('access_token', RegExp.$1);
		writeCookie('access_secret', RegExp.$2);
		if (key.match(/screen_name=([^&]+)/))
			writeCookie('access_user', RegExp.$1);
		setTimeout(function(){ location.href = "../twicli.html"; }, 2000);
	} else {
		alert("Invalid format. Please reload and retry the steps.");
		location.href = "oauth.html";
	}
}
