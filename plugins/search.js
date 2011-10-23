langResources['Twitter search'] =	['Twitter検索','在Twitter上搜索'];
langResources['remove tab'] =	['タブを閉じる','关闭标签'];
langResources['Are you sure to close this tab?'] =	['このタブを閉じてもよろしいですか?','确认要关闭标签？'];


var tws_page = 0;
var tws_rpp = 50; /* results per page */
var tws_update_timer = null;
var tws_list = (readCookie('twicli_search_list') || "").split(/\r?\n/);
var tws_API = 'http://search.twitter.com/search.json';
tws_list.uniq();
writeCookie('twicli_search_list', tws_list.join("\n"), 3652);
function twsSearch(qn, no_switch) {
	var exclude_rt = qn.substr(0,1) == '^';
	var qn2 = qn.substr(exclude_rt?1:0);
	var myid = 'search-' + qn2;
	var colon = qn2.indexOf(':');
	var name = qn2;
	var q = qn2;
	if (colon > 0) {
		name = qn2.substr(0, colon);
		q = qn2.substr(colon+1);
	}
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
	switchTo(myid);
	tws_update_timer = setInterval(function(){twsSearchUpdate(q)}, 1000*Math.max(updateInterval, 30));
	var rt_checked = exclude_rt ? "" : " checked";
	$('tw2h').innerHTML = '<div class="tabcmd tabclose"><input id="tws-RT" type="checkbox"'+rt_checked+'><label for="tws-RT">RT</label> <a id="tws-closetab" href="#">[x] '+_('remove tab')+'</a></div>';
	$('tws-closetab').onclick = function(){ closeSearchTab(myid); return false; };
	tws_page = 0;
	$('tws-RT').onclick = function() { twsSwitchRT(myid); };
	xds.load_for_tab(tws_API + '?seq=' + (seq++) +
							'&include_entities=true&q=' + encodeURIComponent(q) + '&rpp=' + tws_rpp, twsSearchShow);
	return false;
}
function twsSearchUpdate(q) {
	xds.load_for_tab(tws_API + '?seq=' + (seq++) +
							'&include_entities=true&q=' + encodeURIComponent(q) + '&rpp=' + tws_rpp, twsSearchShow2);
}
function closeSearchTab(myid) {
	if (!confirm(_('Are you sure to close this tab?'))) return;
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
	if (res.error) { error(res.error); return; }
	if (!update) tws_page++;
	var result = res.results.map(function(a){
		a.user = {screen_name:a.from_user,
						name: a.from_user,
						profile_image_url: a.profile_image_url};
		a.source = a.source.replace(/&lt;/g,"<").replace(/&gt;/g,">").replace(/&amp;/g,"&").replace(/&quot;/g,'"');
		return a;
	});
	if (!update && tws_page == 1) {
		$('tw2c').innerHTML = '';
	}
	twShowToNode(result, $("tw2c"), false, !update && tws_page > 1, update, false, update);
	if (!update && res.next_page) {
		var next = nextButton('next-search');
		$("tw2c").appendChild(next);
		get_next_func = function(){
			xds.load_for_tab(tws_API + res.next_page +
								'&include_entities=true&seq=' + (seq++) + '&rpp=' + tws_rpp, twsSearchShow);
		}
	}
}

registerPlugin({
	switchTo: function(m) {
		if (!tws_update_timer) return;
		clearInterval(tws_update_timer);
		tws_update_timer = null;
	},
	miscTab: function(ele) {
		var e = document.createElement("div");
		e.innerHTML = '<form onSubmit="return twsSearch($(\'search_q\').value);"><a href="http://search.twitter.com/" target="_blank">'+_('Twitter search')+'</a> : <input type="text" size="15" id="search_q"><input type="image" src="images/go.png"></form>';
		ele.appendChild(e);
		var hr = document.createElement("hr");
		hr.className = "spacer";
		ele.appendChild(hr);
	},
	newUserInfoElement: function(ele, user) {
		var e = document.createElement("a");
		e.href = "javascript:void(twsSearch('" + user.screen_name + "'))";
		e.innerHTML = '[Search]';
		ele.appendChild(e);
	},
	newMessageElement: function(ele, tw) {
		var eles = ele.getElementsByTagName("span");
		for (var i = 0; i < eles.length; i++) {
			var target = eles[i];
			if (target.className == "status") {
				eles = target.getElementsByTagName("a");
				for (var j = 0; j < eles.length; j++) {
					target = eles[j];
					if (target.className.indexOf("hashtag") >= 0)
						(function(h){ target.onclick = function(){ return twsSearch(h) } })(target.title);
				}
				break;
			}
		}
	}
});

for (var i = 0 ; i < tws_list.length; i++)
	if (tws_list[i])
		twsSearch(tws_list[i], true);
