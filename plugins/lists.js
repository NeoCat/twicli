langResources['Add'] =	['追加','添加'];
langResources['Subscribe'] =	['購読','添加'];
langResources['get all tweets'] =	['全ツイートを取得','获取所有发言'];
langResources['Please specify a list like "@user/list".'] =	['リストを"@user/list"の形式で指定して下さい。','请使用"@user/list"的格式指定List'];
langResources['Lists'] =	['リスト','列表'];
langResources['subscribing lists by twicli'] =	['twicliで購読中のリスト','用twicli订阅的lists'];
langResources['Initialization failed; regexp.js may not be loaded.'] =	['初期化に失敗しました。regexp.jsがロードされていないようです。','初始化失败。regexp.js可能无法加载。'];
langResources['Reload'] =	['更新','更新'];
langResources['Add this user to list "$1"'] =	['ユーザをリスト"$1"に追加','把这个用户追加到名单"$1"'];
langResources['Remove this user from list "$1"'] =	['ユーザをリスト"$1"から削除', '从名单"$1"删除这个用户'];
langResources['Update tweets in list tab automatically'] = 	['リストタブのツイートを自動更新', '自动地提取所有发言'];

var list_auto_update = parseInt(readCookie('list_auto_update') || 0);
var last_list = ['',''];
var twl_page = 0;
var twl_update_timer = null;
var lists_to_get = readCookie("lists");
lists_to_get = lists_to_get ? lists_to_get.split("\n") : [];
var list_names = lists_to_get.map(function(a){ return a.substr(0, 1) == '#' ? a.substr(1) : a });
var lists_users = {};
function twlGetListInfo(name) {
	if (name == "") return;
	if (name[0] == "#") name = name.substr(1);
	var del = name.indexOf('/');
	var user = name.substr(0, del), slug = name.substr(del+1);
	var lists_users_str = readCookie("lists_users." + name);
	if (lists_users_str) {
		lists_users[name] = lists_users_str.split(",");
		twlUpdateListsList();
		return;
	}
	lists_users[name] = [];
	xds.load_for_tab(twitterAPI + 'lists/members.json?owner_screen_name=' + user + '&slug=' + slug,
		function twlListMember (info) {
			if (info.error || info.errors) {
				twlUnsubscribeList(name);
				alert(info.error || info.errors[0].message);
				return;
			}
			lists_users[name] = lists_users[name].concat(info.users.map(function(u){ return u.screen_name; }));
			if (info.next_cursor_str && info.next_cursor_str != "0" || info.next_cursor) {
				xds.load_for_tab(twitterAPI + 'lists/members.json?owner_screen_name=' + user + '&slug=' + slug + '&cursor=' + (info.next_cursor_str || info.next_cursor), twlListMember);
			} else {
				writeCookie("lists_users." + name, lists_users[name].join(","), 3652);
				twlUpdateListsList();
			}
		});
}

function twlSubscribeList(name) {
	if (name.indexOf('/') < 0)
		return alert(_('Please specify a list like "@user/list".'));
	if (name[0] == "@") name = name.substr(1);
	if (list_names.indexOf(name) >= 0) return; // avoid duplication
	lists_to_get.push(name);
	writeCookie("lists", lists_to_get.join("\n"), 3652);
	twlGetListInfo(name);
}
function twlUnsubscribeList(name) {
	if (name[0] == "@") name = name.substr(1);
	for (var i = 0; i < lists_to_get.length; i++) {
		if (lists_to_get[i] == name || lists_to_get[i] == "#"+name) {
			lists_to_get.splice(i, 1);
			break;
		}
	}
	writeCookie("lists", lists_to_get.join("\n"), 3652);
	deleteCookie("lists_users." + name);
	twlUpdateListsList();
}
function twlToggleListsInTL(a, ele) {
	if (ele.checked) {
		for (var i = 0; i < lists_to_get.length; i++) {
			if (lists_to_get[i] == '#'+a) {
				lists_to_get[i] = a;
				break;
			}
		}
	} else {
		for (i = 0; i < lists_to_get.length; i++) {
			if (lists_to_get[i] == a) {
				lists_to_get[i] = '#'+a;
				break;
			}
		}
	}
	writeCookie("lists", lists_to_get.join("\n"), 3652);
	twlUpdateListsList();
}
function twlToggleSubscribe(ele, name) {
	if (ele.checked)
		twlSubscribeList(name);
	else
		twlUnsubscribeList(name);
}
function twlGetLists(user) {
	xds.load_for_tab(twitterAPI + 'lists/memberships.json?seq=' + (seq++) + '&screen_name=' + user, twlFollowers);
}
function twlListLink(a) {
	return '<div> <a target="_blank" href="' + twitterURL + a.uri.substr(1) +
		'" onclick="return twlGetListStatus(\'' + a.uri.substr(1) + '\')">' +
		a.full_name + '</a> (' +
		a.member_count + ' / ' + a.subscriber_count + ') '+
		'<input type="checkbox" id="subscribe-' + a.full_name + '" ' +
		(list_names.indexOf(a.full_name.replace('@', '')) >= 0 ? 'checked ' : '') +
		'onclick="twlToggleSubscribe(this, \'' + a.full_name + '\')">' +
		'<label for="subscribe-' + a.full_name +'">' + _('Subscribe') + '</label></div>';
}
function twlFollowers(res) {
	if (selected_menu.id != "user") return;
	var tmp = $("tmp");
	if (tmp) tmp.parentNode.removeChild(tmp);
	$('tw2c').innerHTML = '<div><b>Followed by :</b></div>' + res.lists.map(twlListLink).join("");
	xds.load_for_tab(twitterAPI + 'lists/list.json?seq=' + (seq++) + '&screen_name=' + last_user, twlLists);
}
function twlLists(res) {
	if (selected_menu.id != "user") return;
	$('tw2c').innerHTML += '<div><b>Lists by ' + last_user + ' :</b></div>' + res.map(twlListLink).join("");
}

function twlGetListStatus(list) {
	list = list.replace('/lists/', '/');
	twl_page = 0;
	if (twl_update_timer) clearInterval(twl_update_timer);
	if (selected_menu.id == "user") {
		$("tw2c").innerHTML = "";
	} else {
		if (list_auto_update)
			twl_update_timer = setInterval(function(){twlGetListStatusUpdate(list,true)},
				1000*Math.max(parseInt(readCookie('update_interval')) || 90, 30));
	}
	twlGetListStatusUpdate(list);
	return false;
}
function twlGetListStatusUpdate(list, update) {
	last_list = list.split("/");
	if (selected_menu.id == "user") fav_mode = 9;
	xds.load_for_tab(twitterAPI + 'lists/statuses.json?seq=' + (seq++)
		+ '&owner_screen_name=' + last_list[0] + '&slug=' + last_list[1]
		+ '&include_rts=true&count=' + max_count_u + '&' + default_api_args_tl,
			update ? twlShowListStatus2 : twlShowListStatus);
}
function twlShowListStatus2(tw) {
	twlShowListStatus(tw, true);
}
function twlShowListStatus(tw, update) {
	var tmp = $("tmp");
	if (tmp) tmp.parentNode.removeChild(tmp);
	if (!update && ++twl_page == 1) {
		$('tw2c').innerHTML = '';
	}
	twShowToNode(tw, $("tw2c"), false, !update && twl_page > 1, update, false, update);
	if (!update) {
		var next = nextButton('next-list');
		$("tw2c").appendChild(next);
		get_next_func = function(){
			xds.load_for_tab(twitterAPI + 'lists/statuses.json?seq=' + (seq++)
				+ '&owner_screen_name=' + last_list[0] + '&slug=' + last_list[1]
				+ '&&include_rts=true&per_page=' + max_count_u
				+ '&max_id=' + getTwMaxId(tw) + '&' + default_api_args_tl, twlShowListStatus);
		}
		if (twl_page == 1) callPlugins('switchTo', selected_menu, selected_menu);
	}
}

var init_failed = false;
function twlUpdateListsList() {
	list_names = lists_to_get.map(function(a){ return a.substr(0, 1) == '#' ? a.substr(1) : a });
	// update tab
	pickup_regexp_ex = lists_to_get.map(function(l){
		var a = l[0] == '#' ? l.substr(1) : l;
		var users = lists_users[a];
		if (!users) return "";
		return "\\"/*supress closeTab*/ + a.substr(a.indexOf('/')+1) + "\\list#"/*info*/ + a +
			':^' + users.join('$|^') + '$' + (l[0] == '#' ? '::1'/*don't display in TL*/ : '') +
			"\n\\"/*supress closeTab*/ + a.substr(a.indexOf('/')+1) + "\\list#"/*info*/ + a +
			'::\\nby @' + users.join('$|\\nby @') + '$' + (l[0] == '#' ? ':1'/*don't display in TL*/ : '');
	}).join("\n");
	if (typeof(setRegexp) == "function") {
		setRegexp(pickup_regexp);
	} else if (!init_failed) {
		init_failed = true;
		alert('lists.js: '+_('Initialization failed; regexp.js may not be loaded.'));
	}
	twlUpdateMisc();
}

function twlUpdateMisc() {
	// update list in misc tab
	var target_ele = $("lists_list");
	if (!target_ele) return;
	target_ele.innerHTML = lists_to_get.map(function(l){
		var a = l[0] == '#' ? l.substr(1) : l;
		var chk = l[0] == '#' ? '' : ' checked';
		var users = lists_users[a];
		return a != "" ? '<li><a target="twitter" href="' + twitterURL + a + '">@'+ a + '</a>' +
			' (' + (users ? users.length : "error") + ') ' +
			'<label><input type="checkbox" onchange="twlToggleListsInTL(\''+a+'\',this)" id="chk-lists-'+a.replace('/','-')+'" '+chk+'>TL</label>&nbsp;&nbsp;'+
			' <a class="close" href="javascript:twlUnsubscribeList(\''+a+'\')">'+
			'<img style="position: relative; top: 2px;" src="images/clr.png"></a>'+
			'<button type="button" onclick="twlReloadListInfo(\'' + a + '\')">'+ _('Reload') + '</button></a>'+
			'</li>' : a
	}).join("");
}

function twlUpdateUserPopup(target_ele, user) {
	for (var i = 0; i < target_ele.childNodes.length; i++) {
		var ele = target_ele.childNodes[i];
		if (ele.id && ele.id.indexOf('edit_list_user_') == 0) {
			target_ele.removeChild(ele);
			i--;
		}
	}
	var hr = document.createElement('hr');
	hr.id = 'edit_list_user_hr';
	target_ele.appendChild(hr);
	for (i = 0; i < lists_to_get.length; i++) {
		var list = lists_to_get[i];
		list = list[0] == '#' ? list.substr(1) : list;
		var a = document.createElement("a");
		a.id = 'edit_list_user_' + list.replace('/', '_');
		if (lists_users[list].indexOf(user) < 0) {
			a.innerHTML = _('Add this user to list "$1"', list);
			a.href = 'javascript:twlEditUserInList("'+list+'","'+user+'",true)';
		} else {
			a.innerHTML = _('Remove this user from list "$1"', list);
			a.href = 'javascript:twlEditUserInList("'+list+'","'+user+'",false)';
		}
		target_ele.appendChild(a);
	}
}
function twlEditUserInList(list, user, f) {
	var l = list.split('/');
	enqueuePost(twitterAPI + 'lists/members/' + (f ? 'create' : 'destroy') + '.json' +
			'?owner_screen_name=' + l[0] + '&slug=' + l[1] + '&screen_name=' + user,
		function(){ twlReloadListInfo(list); });
}
function twlSetAutoUpdate(update) {
	list_auto_update = update;
	writeCookie('list_auto_update', list_auto_update?1:0, 3652);
}

function twlReloadListInfo(name) {
	deleteCookie("lists_users." + name);
	twlGetListInfo(name);
	twlUpdateMisc();
}


registerPlugin({
	switchTo: function(m, n) {
		if (!twl_update_timer || m === n) return;
		clearInterval(twl_update_timer);
		twl_update_timer = null;
	},
	newUserInfoElement: function(ele, user) {
		ele.innerHTML += '<a href="' + twitterURL + user.screen_name + '/lists/memberships" onclick="twlGetLists(\'' + user.screen_name + '\'); return false;">[Lists]</a>';
	},
	miscTab: function() {
		var e = document.createElement("div");
		e.innerHTML = '<a href="javascript:var s = $(\'lists_pref\').style; s.display = s.display==\'block\'?\'none\':\'block\';void(0)"><b>▼'+_('Lists')+'</b></a>' +
			'<form id="lists_pref" style="display:none" onSubmit="twlSubscribeList($(\'newList\').value); return false;">' +
			_('subscribing lists by twicli')+':<ul id="lists_list">' +
			'</ul><ul><li><input type="text" size="15" id="newList" value="">' +
			'<button type="submit">'+_('Add')+'</button></li></ul><p>' +
			'<label><input type="checkbox" id="auto_update" onchange="twlSetAutoUpdate(this.checked)"' +
			(list_auto_update ? ' checked' : '') + '>'+ _('Update tweets in list tab automatically') +
			'</label></form>';
		$("pref").appendChild(e);
		twlUpdateMisc();
	},
	init: function() {
		lists_to_get.map(twlGetListInfo);
	},
	regexp_switched: function(tab) {
		if (!tab.info || tab.info.indexOf('list#') != 0) return;
		var a = tab.info.substr(5);
		if (list_auto_update)
			twlGetListStatus(a);
		else
			$('tw2h').innerHTML = '<div class="tabcmd"><a id="list_get_all" href="'+twitterURL+a+'" onclick="twlGetListStatus(\''+a+'\');return false">'+_('get all tweets')+'</a></div>';
	},
	userinfo_popup: function(ele, user) {
		twlUpdateUserPopup(ele, user);
	}
});
