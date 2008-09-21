var twFavPlugin = {
	cnt: 9,
	fav_update: null,
	favs: [],
	update: function() {
		if (this.cnt++ < 5) return;
		this.cnt = 0;
		this.fav_update = loadXDomainScript('nr_favs.js?seq='+(seq++), this.fav_update);
	},
	newMessageElement: function(ele, tw) {
		var fele = document.createElement("a");
		fele.id = "nrFav" + tw.id;
		fele.href = "http://favotter.matope.com/status.php?id=" + tw.id;
		fele.target = "twitter";
		if (this.favs[tw.id]) {
			fele.style.fontSize = "small";
			fele.style.color = "#092";
			fele.innerHTML = '[fav:' + this.favs[tw.id] + '] ';
		}
		ele.insertBefore(fele, ele.childNodes[4]);
	},
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
