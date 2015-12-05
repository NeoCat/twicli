langResources['Isolate tweets for 1hour'] =	['1時間ツイートを隔離','隔离1小时'];
langResources['Isolate'] =	['隔離','隔离'];

var isolate_min = 60; // minutes for isolate

registerPlugin({
	popup: function() {
		if (!$('isolate_menu')) return;
		$('isolate_menu').href = "javascript:isolate_menu('"+popup_ele.id+"')";
	},
	popup_hide: function() {
		var menu = $('isolate_popup');
		if (menu)
			document.body.removeChild(menu);
	}
});

function isolate_menu(id) {
	var ele = $(id);
	var tw = !display_as_rt && ele.tw.retweeted_status || ele.tw;
	
	var menu = document.createElement('div');
	menu.id = 'isolate_popup';
	menu.className = 'popup_menu';
	document.body.appendChild(menu);
	
	menu.style.display = "block";
	menu.style.top = popup_top + 'px';
	menu.style.left =  $('popup').style.left;
	$('popup_hide').style.height = Math.max(document.body.scrollHeight, $("tw").offsetHeight+$("control").offsetHeight) + 'px';
	$('popup_hide').style.display = "block";
	
	var isolate_menu_user = function(screen_name) {
		screen_name = screen_name.replace(/^[@＠]/, '');
		var a = document.createElement('a');
		a.innerHTML = _('Isolate') + ': @'+screen_name;
		a.href = 'javascript:isolate_user("'+screen_name+'")';
		menu.appendChild(a);
	}
	var isolate_menu_hash = function(hash) {
		hash = hash.replace(/^[#＃]/, '');
		var a = document.createElement('a');
		a.innerHTML = _('Isolate') + ': #'+hash;
		a.href = 'javascript:isolate_hash("'+hash+'")';
		menu.appendChild(a);
	}
	
	isolate_menu_user(tw.user.screen_name);
	for (var i = 0; i < ele.childNodes.length; i++) {
		var st = ele.childNodes[i];
		if (st.className && st.className.indexOf('status') >= 0) {
			for (var j = 0; j < st.childNodes.length; j++) {
				var target = st.childNodes[j];
				if (target.className == 'mention') {
					isolate_menu_user(target.innerHTML);
				}
				else if (target.className == 'hashtag') {
					isolate_menu_hash(target.innerHTML);
				}
			}
			break;
		}
	}
}
function isolate_menu_isolate() {
	$('popup_hide').style.display = "none";
	var menu = $('isolate_popup');
	if (menu)
		document.body.removeChild(menu);
}

function isolate_user(user) {
	var limit = parseInt(new Date().getTime()/1000) + isolate_min * 60;
	setRegexp('m:^' + user + '$::1:' + limit +'\n' +
				'm::@' + user + ':1:' + limit + '\n' + pickup_regexp);
	isolate_menu_isolate();
}
function isolate_hash(hash) {
	var limit = parseInt(new Date().getTime()/1000) + isolate_min * 60;
	setRegexp('m::#' + hash + ':1:' + limit + '\n' + pickup_regexp);
	isolate_menu_isolate();
}

// Popup menu
if ($('regexp_add_ID')) {
	var a = document.createElement('a');
	a.id = 'isolate_menu';
	a.innerHTML = _('Isolate tweets for 1hour') + '...';
	$('popup').insertBefore(a, $('regexp_add_ID').nextSibling)
}
