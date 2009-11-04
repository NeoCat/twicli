var lists_to_get = readCookie("lists");
lists_to_get = lists_to_get ? lists_to_get.split("\n") : [];
var lists_users = {};
function getListInfo(name) {
	if (name == "") return;
	if (name[0] == "#") name = name.substr(1);
	var del = name.indexOf('/');
	var user = name.substr(0, del), slug = name.substr(del+1);
	lists_users[name] = [];
	$("loading").style.display = "block";
	xds.load(twitterAPI + user + '/' + slug + '/members.json',
		function twlListMember (info) {
			lists_users[name] = lists_users[name].concat(info.users.map(function(u){ delete u.status; return u; }));
			if (info.next_cursor) {
				$("loading").style.display = "block";
				xds.load(twitterAPI + user + '/' + slug + '/members.json?cursor=' + info.next_cursor, twlListMember);
			} else {
				$("loading").style.display = "none";
				updateListsList();
			}
		});
}

function subscribeList(name) {
	if (name.indexOf('/') < 0)
		return alert('Please specify a list like "@user/list"');
	if (name[0] == "@") name = name.substr(1);
	for (var i = 0; i < lists_to_get.length; i++) // avoid duplication
		if (lists_to_get[i] == name || lists_to_get[i] == '#'+name)
			return;
	lists_to_get.push(name);
	writeCookie("lists", lists_to_get.join("\n"), 3652);
	getListInfo(name);
}
function unsubscribeList(name) {
	for (var i = 0; i < lists_to_get.length; i++) {
		if (lists_to_get[i] == name || lists_to_get[i] == "#"+name) {
			lists_to_get.splice(i, 1);
			break;
		}
	}
	writeCookie("lists", lists_to_get.join("\n"), 3652);
	updateListsList();
}

function twlGetLists(user) {
	update_ele2 = loadXDomainScript(twitterAPI + user + '/lists/memberships.json?seq=' + (seq++) +
							'&callback=twlFollowers', update_ele2);
	$("loading").style.display = "block";
}
function twlFollowers(res) {
	if (selected_menu.id != "user") return;
	var tmp = $("tmp");
	if (tmp) tmp.parentNode.removeChild(tmp);
	$('tw2c').innerHTML = '<div><b>Followed by :</b></div>' + res.lists.map(function(a){
		return '<div> <a target="twitter" href="' + twitterURL + a.uri.substr(1) + '">' + a.full_name + '</a> (' +
				 a.member_count + ' / ' + a.subscriber_count + ')</div>';
	}).join("");
	update_ele2 = loadXDomainScript(twitterAPI + last_user + '/lists.json?seq=' + (seq++) +
							'&callback=twlLists', update_ele2);
}
function twlLists(res) {
	if (selected_menu.id != "user") return;
	$('tw2c').innerHTML += '<div><b>Lists by ' + last_user + ' :</b></div>' + res.lists.map(function(a){
		return '<div> <a target="twitter" href="' + twitterURL + a.uri + '">' + a.full_name + '</a> (' +
				 a.member_count + ' / ' + a.subscriber_count + ')</div>';
	}).join("");
	$("loading").style.display = "none";
}

function toggleListsInTL(a, ele) {
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
	updateListsList();
}

var init_failed = false;
function updateListsList() {
	// update tab
	pickup_regexp_ex = lists_to_get.map(function(l){
		var a = l[0] == '#' ? l.substr(1) : l;
		var users = lists_users[a];
		if (!users) return "";
		return "\\"/*supress closeTab*/ + a.substr(a.indexOf('/')+1) +
			':^' + users.map(function(u){ return u.screen_name }).join('$|^') + '$' +
			(l[0] == '#' ? '::1'/*don't display in TL*/ : '');
	}).join("\n");
	if (typeof(setRegexp) == "function") {
		setRegexp(pickup_regexp);
	} else if (!init_failed) {
		init_failed = true;
		alert("lists.js: Initialization failed; regexp.js may not be loaded.");
	}

	// update list in misc tab
	var target_ele = $("lists_list");
	if (!target_ele) return;
	target_ele.innerHTML = lists_to_get.map(function(l){
		var a = l[0] == '#' ? l.substr(1) : l;
		var chk = l[0] == '#' ? '' : ' checked';
		var users = lists_users[a];
		return a != "" ? "<li>@"+ a +
			' (' + (users ? users.length : "error") + ') ' +
			'<input onchange="toggleListsInTL(\''+a+'\',this)" type="checkbox" '+
					'id="chk-lists-'+a.replace('/','-')+'"'+chk+'>'+
			'<label for="chk-lists-'+a.replace('/','-')+'">TL</label>&nbsp;&nbsp;'+
			' <a class="close" href="javascript:unsubscribeList(\''+a+'\')">'+
			'<img style="position: relative; top: 2px;" src="clr.png"></a>'+
			'</li>' : a
	}).join("");
}

registerPlugin({
	newUserInfoElement: function(ele, user) {
		var e = document.createElement("a");
		e.href = "javascript:twlGetLists('" + user.screen_name + "')";
		e.innerHTML = '[Lists]';
		ele.appendChild(e);
	},
	miscTab: function(ele) {
		var e = document.createElement("div");
		e.innerHTML = '<a href="javascript:var s = $(\'lists_pref\').style; s.display = s.display==\'block\'?\'none\':\'block\';void(0)"><b>▼Lists</b></a>' +
			'<form id="lists_pref" style="display:none" onSubmit="subscribeList($(\'newList\').value); return false;">' +
			'subscribing lists by twicli:<ul id="lists_list">' +
			'</ul><ul><li><input type="text" size="15" id="newList" value="">' +
			'<input type="submit" value="Add"></li></ul></form>';
		$("pref").appendChild(e);
		updateListsList();
	},
	init: function() {
		lists_to_get.map(getListInfo);
	}
});
