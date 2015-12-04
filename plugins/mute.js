vlangResources['Hide tweets for 1hour'] =	['1時間ツイートを隠す','遮住1小时'];

var mute_min = 60; // minutes for mute

registerPlugin({
	popup: function() {
		if (!$('mute_menu')) return;
		$('mute_menu').href = "javascript:mute_menu('"+popup_ele.id+"')";
	},
	popup_hide: function() {
		var menu = $('mute_popup');
		if (menu)
			document.body.removeChild(menu);
	}
});

function mute_menu(id) {
	var ele = $(id);
	var tw = !display_as_rt && ele.tw.retweeted_status || ele.tw;
	
	var menu = document.createElement('div');
	menu.id = 'mute_popup';
	menu.className = 'popup_menu';
	document.body.appendChild(menu);
	
	menu.style.display = "block";
	menu.style.top = popup_top + 'px';
	menu.style.left =  $('popup').style.left;
	$('popup_hide').style.height = Math.max(document.body.scrollHeight, $("tw").offsetHeight+$("control").offsetHeight) + 'px';
	$('popup_hide').style.display = "block";
	
	var mute_menu_user = function(screen_name) {
		screen_name = screen_name.replace(/^[@＠]/, '');
		var a = document.createElement('a');
		a.innerHTML = _('Mute') + ': @'+screen_name;
		a.href = 'javascript:mute_user("'+screen_name+'")';
		menu.appendChild(a);
	}
	var mute_menu_hash = function(hash) {
		hash = hash.replace(/^[#＃]/, '');
		var a = document.createElement('a');
		a.innerHTML = _('Mute') + ': #'+hash;
		a.href = 'javascript:mute_hash("'+hash+'")';
		menu.appendChild(a);
	}
	
	mute_menu_user(tw.user.screen_name);
	for (var i = 0; i < ele.childNodes.length; i++) {
		var st = ele.childNodes[i];
		if (st.className && st.className.indexOf('status') >= 0) {
			for (var j = 0; j < st.childNodes.length; j++) {
				var target = st.childNodes[j];
				if (target.className == 'mention') {
					mute_menu_user(target.innerHTML);
				}
				else if (target.className == 'hashtag') {
					mute_menu_hash(target.innerHTML);
				}
			}
			break;
		}
	}
}
function mute_menu_hide() {
	$('popup_hide').style.display = "none";
	var menu = $('mute_popup');
	if (menu)
		document.body.removeChild(menu);
}

function mute_user(user) {
	var limit = parseInt(new Date().getTime()/1000) + mute_min * 60;
	setRegexp('m:^' + user + '$::1:' + limit +'\n' +
				'm::@' + user + ':1:' + limit + '\n' + pickup_regexp);
	mute_menu_hide();
}
function mute_hash(hash) {
	var limit = parseInt(new Date().getTime()/1000) + mute_min * 60;
	setRegexp('m::#' + hash + ':1:' + limit + '\n' + pickup_regexp);
	mute_menu_hide();
}

// Popup menu
if ($('regexp_add_ID')) {
	var a = document.createElement('a');
	a.id = 'mute_menu';
	a.innerHTML = _('Hide tweets for 1hour') + '...';
	$('popup').insertBefore(a, $('regexp_add_ID').nextSibling)
}
