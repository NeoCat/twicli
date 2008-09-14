var tws_page = 0;
function twsSearch(q) {
	tws_page = 0;
	update_ele2 = loadXDomainScript('http://search.twitter.com/search.json?seq=' + (seq++) +
							'&q=' + q + '&callback=twsSearchShow', update_ele2);
	$("loading").style.display = "block";
}
function twsSearchShow(res) {
	var tmp = $("tmp");
	if (tmp) tmp.parentNode.removeChild(tmp);
	tws_page++;
	var result = res.results.map(function(a){
		a.user = {screen_name:a.from_user,
						name: a.from_user,
						profile_image_url: a.profile_image_url};
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
	}
});
