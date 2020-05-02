langResources['Twitter search'] =	['Twitter検索','在Twitter上搜索'];
langResources['remove tab'] =	['タブを閉じる','关闭标签'];
langResources['Are you sure to close this tab?'] =	['このタブを閉じてもよろしいですか?','确认要关闭标签？'];


var tws_page = 0;
var tws_next_max_id = -1;
var tws_update_timer = null;
var tws_list = (readCookie('twicli_search_list') || "").split(/\r?\n/);
tws_list.uniq();
writeCookie('twicli_search_list', tws_list.join("\n"), 3652);
function twsSearch(qn, no_switch, max_id) {
	var exclude_rt = qn.substr(0,1) == '^';
	var qn2 = qn.substr(exclude_rt?1:0);
	var myid = 'search-' + qn2;
	var colon = qn2.indexOf(':');
	var name = qn2;
	var q = qn2;
	if (colon > 0) {
		name = qn2.substr(0,colon);
		q = qn2.substr(colon+1);
	}
	var lang = null;
	q = q.replace(/lang=(\w+)\s*/, function(_,l){ lang = l; return ''; });
	if (exclude_rt) q += ' exclude:retweets';
	if (!$(myid)) {
		var tab = document.createElement('a');
		tab.id = myid;
		tab.tws_qn = qn;
		tab.pickup = new Array();
		tab.name = name;
		tab.appendChild(document.createTextNode(name));
		tab.href = '#';
		tab.onclick = function() { twsSearch(this.tws_qn); return false; };
		$('menu2').appendChild(tab);
		if (no_switch) return;
		tws_list.push(qn);
		tws_list.uniq();
		writeCookie('twicli_search_list', tws_list.join("\n"), 3652);
	}
	if (!no_switch) switchTo(myid);
	if (tws_update_timer) clearInterval(tws_update_timer);
	tws_update_timer = setInterval(function(){twsSearchUpdate(q,lang)}, 1000*Math.max(parseInt(readCookie('update_interval')) || 90, 30));
	var rt_checked = exclude_rt ? "" : " checked";
	$('tw2h').innerHTML = '<div class="tabcmd tabclose"><label><input type="checkbox" id="tws-RT"'+rt_checked+'>RT</label> <a id="tws-closetab" href="#">[x] '+_('remove tab')+'</a></div>';
	$('tws-closetab').onclick = function(){ closeSearchTab(myid); return false; };
	if (!max_id) tws_page = 0;
	$('tws-RT').onclick = function() { twsSwitchRT(myid); };
	xds.load_for_tab(twitterAPI + 'search/tweets.json' +
		'?' + default_api_args_tl + (lang?'&lang=' + lang:'') + '&q=' + encodeURIComponent(q) +
		(max_id ? '&max_id=' + max_id : '') +
		'&count=' + Math.min(100, max_count_u), twsSearchShow);
	return false;
}
function twsSearchUpdate(q,lang) {
	xds.load_for_tab(twitterAPI + 'search/tweets.json' +
		'?' + default_api_args_tl + (lang?'&lang=' + lang:'') + '&q=' + encodeURIComponent(q) +
							'&count=' + Math.min(100, max_count_u), twsSearchShow2);
}
function closeSearchTab(myid) {
	if (confirm_close && !confirm(_('Are you sure to close this tab?'))) return;
	var target = $(myid);
	target.parentNode.removeChild(target);
	for (var i = 0; i < tws_list.length; i++)
		if (target.tws_qn == tws_list[i])
			tws_list.splice(i--, 1);
	writeCookie('twicli_search_list', tws_list.join("\n"), 3652);
	switchTL();
}
function twsSwitchRT(myid) {
	var target = $(myid);
	var qn = target.tws_qn;
	if ($('tws-RT').checked)
		qn = qn.substr(1);
	else
		qn = '^' + qn;
	for (var i = 0; i < tws_list.length; i++)
		if (target.tws_qn == tws_list[i])
			tws_list[i] = qn;
	writeCookie('twicli_search_list', tws_list.join("\n"), 3652);
	target.tws_qn = qn;
	twsSearch(qn);
}
function twsSearchShow2(res) {
	twsSearchShow(res, true);
}
function twsSearchShow(res, update) {
	var tmp = $("tmp");
	if (tmp) tmp.parentNode.removeChild(tmp);
	if (res.errors) { error('', res.errors); return; }
	if (!update) tws_page++;
	var tw = [];
	for (var i = 0; i < res.statuses.length; i++) {
		if (res.statuses[i].user.id_str in tws_blocked_users) continue;
		if (res.statuses[i].user.id_str in tws_muted_users) continue;
		tw.push(res.statuses[i]);
	}
	if (!update && tws_page == 1)
		$('tw2c').innerHTML = '';
	if (tw.length == 0) return;
	twShowToNode(tw, $("tw2c"), false, !update && tws_page > 1, update, false, update);
	if (!update) {
		tws_next_max_id = tw[tw.length-1].id_str;
		$("tw2c").appendChild(nextButton('next-search'));
		get_next_func = function(){
			twsSearch(selected_menu.tws_qn, true, tws_next_max_id);
		}
	}
}
function twsReplaceLinkWithHandler(ele) {
	var eles = ele.querySelectorAll("span.status > a.hashtag, div.udesc > a.hashtag");
	for (var i = 0; i < eles.length; i++) {
		if (eles[i].className.indexOf("hashtag") >= 0)
			(function(h){ eles[i].onclick = function(){ return twsSearch(h) } })(eles[i].title);
	}
}

registerPlugin({
	auth: function() {
		tws_blocked_users = {};
		tws_muted_users = {};
		xds.load_default(twitterAPI + 'blocks/list.json?skip_status=1', function(result) {
			for (var i = 0; i < result.users.length; i++)
				tws_blocked_users[result.users[i].id_str] = result.users[i];
		});
		xds.load_default(twitterAPI + 'mutes/users/list.json?skip_status=1', function(result) {
			for (var i = 0; i < result.users.length; i++)
				tws_muted_users[result.users[i].id_str] = result.users[i];
		});
	},
	switchTo: function(m) {
		if (!tws_update_timer) return;
		clearInterval(tws_update_timer);
		tws_update_timer = null;
	},
	miscTab: function(ele) {
		var e = document.createElement("div");
		e.innerHTML = '<form onSubmit="return twsSearch($(\'search_q\').value);"><a href="https://twitter.com/search" target="_blank">'+_('Twitter search')+'</a> : <input type="text" size="15" id="search_q"><button type="submit" class="go"></button></form>';
		ele.appendChild(e);
		var hr = document.createElement("hr");
		hr.className = "spacer";
		ele.appendChild(hr);
	},
	newUserInfoElement: function(ele, user) {
		ele.innerHTML += '<a href="' + twitterURL + 'search/' + user.screen_name + '" onclick="twsSearch(\'' + user.screen_name + '\'); return false;">[Search]</a>';
		twsReplaceLinkWithHandler(ele);
	},
	newMessageElement: function(ele) {
		twsReplaceLinkWithHandler(ele);
	}
});

for (var i = 0 ; i < tws_list.length; i++)
	if (tws_list[i])
		twsSearch(tws_list[i], true);
