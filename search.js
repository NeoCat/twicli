var tws_page = 0;
function twsSearch(q) {
	var myid = 'search-' + q;
	if (!$(myid)) {
		var tab = document.createElement('a');
		tab.id = myid;
		tab.pickup = new Array();
		tab.innerHTML = tab.name = q;
		tab.href = '#';
		tab.onclick = function() { twsSearch(q); return false; };
		$('menu2').insertBefore(tab, $('misc'));
	}
	switchTo(myid);

	$('tw2h').innerHTML = '<div style="background-color: #ccc; text-align: right"><a style="size: small; color: red" href="javascript:closeSearchTab(\''+myid+'\')">[x] remove tab</a></div>';
	tws_page = 0;
	update_ele2 = loadXDomainScript('http://search.twitter.com/search.json?seq=' + (seq++) +
							'&q=' + encodeURIComponent(q) + '&callback=twsSearchShow', update_ele2);
	$("loading").style.display = "block";
}
function closeSearchTab(myid) {
	if (!confirm("タブを閉じてもよろしいですか?")) return;
	var target = $(myid);
	target.parentNode.removeChild(target);
	switchTL();
}
function twsSearchShow(res) {
	var tmp = $("tmp");
	if (tmp) tmp.parentNode.removeChild(tmp);
	tws_page++;
	var result = res.results.map(function(a){
		a.user = {screen_name:a.from_user,
						name: a.from_user,
						profile_image_url: a.profile_image_url};
		a.source = a.source.replace(/&lt;/g,"<").replace(/&gt;/g,">").replace(/&amp;/g,"&").replace(/&quot;/g,'"');
		return a;
	});
	if (tws_page == 1) $('tw2c').innerHTML = '';
	twShowToNode(result, $("tw2c"), false, tws_page > 1);
	if (res.next_page) {
		$("tw2c").innerHTML += '<div onClick="getNext(this)" id="next">▽</div>';
		get_next_func = function(){
			update_ele2 = loadXDomainScript('http://search.twitter.com/search.json' + res.next_page +
								'&seq=' + (seq++) + '&callback=twsSearchShow', update_ele2);
		}
	}
}

registerPlugin({
	miscTab: function(ele) {
		var e = document.createElement("p");
		e.innerHTML = '<form onSubmit="twsSearch($(\'search_q\').value); return false;">Twitter search : <input type="text" size="15" id="search_q"><input type="image" src="go.png"></form>';
		ele.appendChild(e);
		ele.appendChild(document.createElement("hr"));
	},
	newUserInfoElement: function(ele, user) {
		var e = document.createElement("a");
		e.href = "javascript:twsSearch('" + user.screen_name + "')";
		e.innerHTML = '[search]';
		ele.appendChild(e);
	},
	newMessageElement: function(ele, tw) {
		var eles = ele.getElementsByTagName("span");
		for (var i = 0; i < eles.length; i++) {
			var target = eles[i];
			if (target.className == "status") {
				target.innerHTML = target.innerHTML.replace(/([\u0001-\/:-@\[-`{-~]|^)(\#[0-9A-Za-z_]{2,})(?=[\u0001-\/:-@\[-`{-~]|$)/g, function(_,d1,t){
					if (t.match(/^#\d+$/)) return d1+t;
					return d1+'<a href="javascript:twsSearch(\''+t+'\')">'+t+'</a>';
				});
				break;
			}
		}
	}
});
