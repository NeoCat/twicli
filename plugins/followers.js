langResources['Color followers'] =	['フォロワーを色付け','给关注者添加颜色'];
langResources['Tweets coloring'] =	['ツイートが次のように色付けされます','发言将会以这些颜色区分'];
langResources['follower: black  non-follower: blue'] =	['フォロワー: 黒　非フォロワー: 青','关注者：黑色  非关注者：蓝色'];
langResources['Renew'] =	['更新','更新关注者数据'];
langResources['Off'] =	['無効','关闭颜色区分'];

var followers_ids_list = (readCookie('followers_ids') || '');
followers_ids_list = followers_ids_list != '' ? followers_ids_list.split(',') : [];
var followers_ids = [];
for (var i = 0; i < followers_ids_list.length; i++)
	followers_ids[followers_ids_list[i]] = 1;

registerPlugin({
	miscTab: function(ele) {
		var e = document.createElement("div");
		e.innerHTML = '<form onSubmit="twfcFollwersIDsRenew(); return false;">'+_('Color followers')+': <span id="followers_status">'+(followers_ids_list.length?"on("+followers_ids_list.length+")":"off")+'</span> <input type="submit" value="'+_('Renew')+'"><input type="button" onClick="twfcFollwersIDsClear()" value="'+_('Off')+'"> <a href="javascript:alert(\''+_('Tweets coloring')+':\\n  '+_('follower: black  non-follower: blue')+'\')">[?]</a></form>';
		ele.appendChild(e);
		var hr = document.createElement("hr");
		hr.className = "spacer";
		ele.appendChild(hr);
	},
	newMessageElement: function(ele, tw) {
		if (!display_as_rt && tw.retweeted_status && tw.retweeted_status.user)
			tw = tw.retweeted_status;
		if (followers_ids_list.length && myid != tw.user.id && !followers_ids[tw.user.id])
			for (var i = 0; i  < ele.childNodes.length; i++)
				if (ele.childNodes[i].className == "status")
					ele.childNodes[i].className += " non-follower";
	}
});

function twfcFollwersIDsClear() {
	followers_ids_list = followers_ids = [];
	var status = document.getElementById("followers_status");
	if (status) status.innerHTML = "off";
	writeCookie('followers_ids', "", 3652);
}
function twfcFollwersIDsRenew() {
	var status = document.getElementById("followers_status");
	if (status) status.innerHTML = "loading...";
	followers_ids_list = [];
	followers_ids = [];
	xds.load(twitterAPI + 'followers/ids.json?cursor=-1', twfcRenew);
}
function twfcRenew(list) {
	followers_ids_list = followers_ids_list.concat(list.ids);
	for (var i = 0; i < list.ids.length; i++)
		followers_ids[list.ids[i]] = 1;
	writeCookie('followers_ids', followers_ids_list.join(","), 3652);
	var status = document.getElementById("followers_status");
	if (status) status.innerHTML = "on (" + followers_ids_list.length + ")";
	if (list.next_cursor)
		xds.load(twitterAPI + 'followers/ids.json?cursor='+list.next_cursor_str, twfcRenew);
}
