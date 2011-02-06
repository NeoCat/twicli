langResources['Add'] =	['追加','添加'];
langResources['get all tweets'] =	['全ツイートを取得','获取所有发言'];
langResources['Please specify a list like "@user/list".'] =	['リストを"@user/list"の形式で指定して下さい。','请使用"@user/list"的格式指定List'];
langResources['Lists'] =	['リスト','列表'];
langResources['subscribing lists by twicli'] =	['twicliで購読中のリスト','用twicli订阅的lists'];
langResources['Initialization failed; regexp.js may not be loaded.'] =	['初期化に失敗しました。regexp.jsがロードされていないようです。','初始化失败。regexp.js可能无法加载。'];


var last_list = ['',''];
var twl_page = 0;
var twl_update_timer = null;
var lists_to_get = readCookie("lists");
lists_to_get = lists_to_get ? lists_to_get.split("\n") : [];
var lists_users = {};
function twlGetListInfo(name) {
	if (name == "") return;
	if (name[0] == "#") name = name.substr(1);
	var del = name.indexOf('/');
	var user = name.substr(0, del), slug = name.substr(del+1);
	lists_users[name] = [];
	xds.load_for_tab(twitterAPI + user + '/' + slug + '/members.json',
		function twlListMember (info) {
			if (info.error) {
				alert(info.error);
				twlUnsubscribeList(name);
				return;
			}
			lists_users[name] = lists_users[name].concat(info.users.map(function(u){ delete u.status; return u; }));
			if (info.next_cursor) {
				xds.load_for_tab(twitterAPI + user + '/' + slug + '/members.json?cursor=' + info.next_cursor, twlListMember);
			} else {
				twlUpdateListsList();
			}
		});
}

function twlSubscribeList(name) {
	if (name.indexOf('/') < 0)
		return alert(_('Please specify a list like "@user/list".'));
	if (name[0] == "@") name = name.substr(1);
	for (var i = 0; i < lists_to_get.length; i++) // avoid duplication
		if (lists_to_get[i] == name || lists_to_get[i] == '#'+name)
			return;
	lists_to_get.push(name);
	writeCookie("lists", lists_to_get.join("\n"), 3652);
	twlGetListInfo(name);
}
function twlUnsubscribeList(name) {
	for (var i = 0; i < lists_to_get.length; i++) {
		if (lists_to_get[i] == name || lists_to_get[i] == "#"+name) {
			lists_to_get.splice(i, 1);
			break;
		}
	}
	writeCookie("lists", lists_to_get.join("\n"), 3652);
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
		for (var i = 0; i < lists_to_get.length; i++) {
			if (lists_to_get[i] == a) {
				lists_to_get[i] = '#'+a;
				break;
			}
		}
	}
	writeCookie("lists", lists_to_get.join("\n"), 3652);
	twlUpdateListsList();
}

function twlGetLists(user) {
	xds.load_for_tab(twitterAPI + user + '/lists/memberships.json?seq=' + (seq++), twlFollowers);
}
function twlFollowers(res) {
	if (selected_menu.id != "user") return;
	var tmp = $("tmp");
	if (tmp) tmp.parentNode.removeChild(tmp);
	$('tw2c').innerHTML = '<div><b>Followed by :</b></div>' + res.lists.map(function(a){
		return '<div> <a target="_blank" href="' + twitterURL + a.uri.substr(1) + '" onclick="return twlGetListStatus(\'' + a.uri.substr(1) + '\')">' + a.full_name + '</a> (' +
				 a.member_count + ' / ' + a.subscriber_count + ')</div>';
	}).join("");
	xds.load_for_tab(twitterAPI + last_user + '/lists.json?seq=' + (seq++), twlLists);
}
function twlLists(res) {
	if (selected_menu.id != "user") return;
	$('tw2c').innerHTML += '<div><b>Lists by ' + last_user + ' :</b></div>' + res.lists.map(function(a){
		return '<div> <a target="_blank" href="' + twitterURL + a.uri.substr(1) + '" onclick="return twlGetListStatus(\'' + a.uri.substr(1) + '\')">' + a.full_name + '</a> (' +
				 a.member_count + ' / ' + a.subscriber_count + ')</div>';
	}).join("");
}

function twlGetListStatus(list) {
	last_list = list.split("/");
	twl_page = 0;
	if (twl_update_timer) clearInterval(twl_update_timer);
	if (selected_menu.id == "user") fav_mode = 9;
	$("tw2c").innerHTML = "";
	twl_update_timer = setInterval(function(){twlGetListStatusUpdate(list)}, 1000*Math.max(updateInterval, 30));
	xds.load_for_tab(twitterAPI + last_list[0] + '/lists/' + last_list[1] + '/statuses.json?' +
				'seq=' + (seq++) + '&per_page=' + max_count_u, twlShowListStatus);
	return false;
}
function twlGetListStatusUpdate(list) {
	last_list = list.split("/");
	if (selected_menu.id == "user") fav_mode = 9;
	xds.load_for_tab(twitterAPI + last_list[0] + '/lists/' + last_list[1] +
							'/statuses.json?seq=' + (seq++) + '&per_page=' + max_count_u,
							twlShowListStatus2)
}
function twlShowListStatus2(tw) {
	twlShowListStatus(tw, true);
	var twNode = $('tw2c');
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
	xds.load_for_tab(twitterAPI + last_list[0] + '/lists/' + last_list[1] +
							'/statuses.json?seq=' + (seq++) + '&per_page=' + max_count_u +
							'&max_id=' + tw[tw.length-1].id, twlShowListStatus);
	}
	}
}

var init_failed = false;
function twlUpdateListsList() {
	// update tab
	pickup_regexp_ex = lists_to_get.map(function(l){
		var a = l[0] == '#' ? l.substr(1) : l;
		var users = lists_users[a];
		if (!users) return "";
		return "\\"/*supress closeTab*/ + a.substr(a.indexOf('/')+1) + "\\list#"/*info*/ + a +
			':^' + users.map(function(u){ return u.screen_name }).join('$|^') + '$' +
			(l[0] == '#' ? '::1'/*don't display in TL*/ : '');
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
			'<input onchange="twlToggleListsInTL(\''+a+'\',this)" type="checkbox" '+
					'id="chk-lists-'+a.replace('/','-')+'"'+chk+'>'+
			'<label for="chk-lists-'+a.replace('/','-')+'">TL</label>&nbsp;&nbsp;'+
			' <a class="close" href="javascript:twlUnsubscribeList(\''+a+'\')">'+
			'<img style="position: relative; top: 2px;" src="images/clr.png"></a>'+
			'</li>' : a
	}).join("");
}

registerPlugin({
	switchTo: function(m) {
		if (!twl_update_timer) return;
		clearInterval(twl_update_timer);
		twl_update_timer = null;
	},
	newUserInfoElement: function(ele, user) {
		var e = document.createElement("a");
		e.href = "javascript:twlGetLists('" + user.screen_name + "')";
		e.innerHTML = '[Lists]';
		ele.appendChild(e);
	},
	miscTab: function(ele) {
		var e = document.createElement("div");
		e.innerHTML = '<a href="javascript:var s = $(\'lists_pref\').style; s.display = s.display==\'block\'?\'none\':\'block\';void(0)"><b>▼'+_('Lists')+'</b></a>' +
			'<form id="lists_pref" style="display:none" onSubmit="twlSubscribeList($(\'newList\').value); return false;">' +
			_('subscribing lists by twicli')+':<ul id="lists_list">' +
			'</ul><ul><li><input type="text" size="15" id="newList" value="">' +
			'<input type="submit" value="'+_('Add')+'"></li></ul></form>';
		$("pref").appendChild(e);
		twlUpdateMisc();
	},
	init: function() {
		lists_to_get.map(twlGetListInfo);
	},
	regexp_switched: function(tab) {
		if (!tab.info || tab.info.indexOf('list#') != 0) return;
		var a = tab.info.substr(5);
		$('tw2h').innerHTML = '<div class="tabcmd"><a href="javascript:void(twlGetListStatus(\''+a+'\'))">'+_('get all tweets')+'</a></div>';
	}
});
