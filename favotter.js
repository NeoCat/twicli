var twFavPlugin = {
	cnt: 9,
	fav_update: null,
	favs: [],
	update: function() {
		if (this.cnt++ < 5) return;
		this.cnt = 0;
		this.fav_update = loadXDomainScript('http://www.geocities.jp/twicli/nr_favs.js?seq='+(seq++), this.fav_update);
	},
	newMessageElement: function(ele, tw) {
		var fele = document.createElement("a");
		fele.id = "nrFav" + tw.id;
		fele.href = "http://favotter.matope.com/status.php?id=" + tw.id;
		fele.target = "twitter";
		if (this.favs[tw.id]) {
			fele.style.fontSize = "small";
			fele.style.backgroundColor = "#3fc";
			fele.innerHTML = '[fav:' + this.favs[tw.id] + '] ';
		}
		ele.insertBefore(fele, ele.childNodes[4]);
	},
	popup: function(ele, user, id) {
		$('favotter_link_user').href = 'http://favotter.matope.com/user.php?user=' + user;
		$('favotter_link_status').href = 'http://favotter.matope.com/status.php?id=' + id;
		$('favotter_link_fav').href = 'http://favotter.matope.com/user.php?mode=fav&user=' + user;
	}
};
registerPlugin(twFavPlugin);

function favEntries(favs) {
	twFavPlugin.favs = favs;
	for (x in favs) {
		var target = $('nrFav'+x);
		if (target)
			target.innerHTML = '[fav:' + favs[x] + '] '
	}
}

// Popup menu

var a = document.createElement("hr");
$('popup').appendChild(a)

a = document.createElement("a");
a.target = 'twitter';
a.id = 'favotter_link_user';
a.innerHTML = 'ふぁぼったー / ふぁぼられ';
$('popup').appendChild(a)

a = document.createElement("a");
a.target = 'twitter';
a.id = 'favotter_link_status';
a.innerHTML = 'ふぁぼったー / 発言';
$('popup').appendChild(a)

a = document.createElement("a");
a.target = 'twitter';
a.id = 'favotter_link_fav';
a.innerHTML = 'ふぁぼったー / ふぁぼり';
$('popup').appendChild(a)


