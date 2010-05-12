var twFavPlugin = {
	fav_update: null,
	favs: [],
	updateFavs: function() {
		twFavPlugin.fav_update = loadXDomainScript('http://twicli.neocat.jp/nr_favs.js?seq='+(seq++), twFavPlugin.fav_update);
		setTimeout(twFavPlugin.updateFavs, 15*60*1000);
	},
	newMessageElement: function(ele, tw) {
		var fele = document.createElement("a");
		fele.id = "nrFav" + tw.id;
		fele.href = "http://favotter.net/status.php?id=" + tw.id;
		fele.target = "favotter";
		fele.style.backgroundColor = "#3fc";
		if (this.favs[tw.id]) {
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
twFavPlugin.updateFavs();

function favEntries(favs) {
	twFavPlugin.favs = favs;
	for (x in favs) {
		var target = $('nrFav'+x);
		if (target)
			target.innerHTML = '<small>[fav:' + favs[x] + ']</small>';
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

