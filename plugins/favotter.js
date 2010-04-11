var twFavPlugin = {
	cnt: 9,
	fav_update: null,
	favs: [],
	update: function() {
		if (this.cnt++ < 5) return;
		this.cnt = 0;
		this.fav_update = loadXDomainScript('http://twicli.neocat.jp/nr_favs.js?seq='+(seq++), this.fav_update);
	},
	newMessageElement: function(ele, tw) {
		var fele = document.createElement("a");
		fele.id = "nrFav" + tw.id;
		fele.href = "http://favotter.net/status.php?id=" + tw.id;
		fele.target = "favotter";
		if (this.favs[tw.id]) {
			fele.style.backgroundColor = "#3fc";
			fele.innerHTML = '<small>[fav:' + this.favs[tw.id] + ']</small>';
		}
		ele.insertBefore(fele, ele.childNodes[4]);
	},
	popup: function(ele, user, id) {
		$('favotter_link_user').href = 'http://favotter.net/user.php?user=' + user;
		$('favotter_link_status').href = 'http://favotter.net/status.php?id=' + id;
		$('favotter_link_fav').href = 'http://favotter.net/user.php?mode=fav&user=' + user;
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
a.target = 'favotter';
a.id = 'favotter_link_user';
a.innerHTML = 'Favotter / New';
$('popup').appendChild(a)

a = document.createElement("a");
a.target = 'favotter';
a.id = 'favotter_link_status';
a.innerHTML = 'Favotter / Status';
$('popup').appendChild(a)

a = document.createElement("a");
a.target = 'favotter';
a.id = 'favotter_link_fav';
a.innerHTML = 'Favotter / fav';
$('popup').appendChild(a)

