var tws_page = 0;
var tws_nr = 0;
var tws_rpp = 50; /* results per page */
var tws_update_timer = null;
var tws_list = (readCookie('twicli_search_list') || "").split(/\r?\n/);
function twsSearch(qn, no_switch) {
	var myid = 'search-' + qn;
	var colon = qn.indexOf(':');
	var name = qn;
	var q = qn;
	if (colon > 0) {
		name = qn.substr(0, colon);
		q = qn.substr(colon+1);
	}
	if (!$(myid)) {
		var tab = document.createElement('a');
		tab.id = myid;
		tab.tws_qn = qn;
		tab.pickup = new Array();
		tab.name = name;
		tab.appendChild(document.createTextNode(name));
		tab.href = '#';
		tab.onclick = function() { twsSearch(qn); return false; };
		$('menu2').appendChild(tab);
		tws_list.push(qn);
		writeCookie('twicli_search_list', tws_list.join("\n"), 3652);
	}
	if (no_switch) return;
	switchTo(myid);
	tws_update_timer = setInterval(function(){twsSearchUpdate(q)}, 1000*Math.max(updateInterval, 30));

	$('tw2h').innerHTML = '<div style="background-color: #ccc; text-align: right"><a style="size: small; color: red" id="tws-closetab" href="#">[x] remove tab</a></div>';
	$('tws-closetab').onclick = function(){ closeSearchTab(myid); return false; };
	tws_page = 0;
	update_ele2 = loadXDomainScript('http://search.twitter.com/search.json?seq=' + (seq++) +
							'&q=' + encodeURIComponent(q) + '&rpp=' + tws_rpp +
							'&callback=twsSearchShow', update_ele2);
	$("loading").style.display = "block";
	return false;
}
function twsSearchUpdate(q) {
	update_ele2 = loadXDomainScript('http://search.twitter.com/search.json?seq=' + (seq++) +
							'&q=' + encodeURIComponent(q) + '&rpp=' + tws_rpp +
							'&callback=twsSearchShow2', update_ele2);
	$("loading").style.display = "block";
}
function closeSearchTab(myid) {
	if (!confirm("Are you sure to close this tab?")) return;
	var target = $(myid);
	target.parentNode.removeChild(target);
	for (var i = 0; i < tws_list.length; i++)
		if (target.tws_qn == tws_list[i])
			tws_list.splice(i--, 1);
	writeCookie('twicli_search_list', tws_list.join("\n"), 3652);
	switchTL();
}
function twsSearchShow2(res) {
	twsSearchShow(res, true);
	var twNode = $('tw2c');
	while (tws_nr > nr_limit) {
		var last_node = twNode.childNodes[twNode.childNodes.length-1];
		tws_nr -= last_node.childNodes.length;
		twNode.removeChild(last_node);
	}
}
function twsSearchShow(res, update) {
	var tmp = $("tmp");
	if (tmp) tmp.parentNode.removeChild(tmp);
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
		tws_nr = 0;
	}
	tws_nr += twShowToNode(result, $("tw2c"), false, !update && tws_page > 1, update);
	if (!update && res.next_page) {
		var next = nextButton('next-search');
		$("tw2c").appendChild(next);
		get_next_func = function(){
			update_ele2 = loadXDomainScript('http://search.twitter.com/search.json' + res.next_page +
								'&seq=' + (seq++) + '&rpp=' + tws_rpp +
								'&callback=twsSearchShow', update_ele2);
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
		e.innerHTML = '<form onSubmit="return twsSearch($(\'search_q\').value);">Twitter search : <input type="text" size="15" id="search_q"><input type="image" src="images/go.png"></form>';
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
				target.innerHTML = target.innerHTML.replace(/<a .*?>.*?<\/a>|(\W|_|^)([#＃])(\w{2,})(?=\W|$)/gi, function(_,d1,m,t){
					if (_.substr(0,1) == '<') return _; // skip link
					if (t.match(/^[#＃]\d+$/)) return _;
					return d1+'<a href="http://search.twitter.com/search?q=' + encodeURIComponent(t) +'" onclick="return twsSearch(\'#'+t+'\')">'+m+t+'</a>';
				});
				break;
			}
		}
	}
});

for (var i = 0 ; i < tws_list.length; i++)
	if (tws_list[i])
		twsSearch(tws_list[i], true);
