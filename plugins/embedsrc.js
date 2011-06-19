(function(){
	var res = [
		{search: /^https?:\/\/gist\.github\.com\/(\d+)(?:\.txt)?$/, replace: "https://gist.github.com/$1.pibb"},
		{search: /^https?:\/\/raw\.github\.com\/gist\/(\d+)(?:.*)$/, replace: "https://gist.github.com/$1.pibb"}
	];

	var createAnchor = function(link, onclick) {
		var a = document.createElement('a');
		a.className = "button";
		a.href = "#";
		a.onclick = onclick;
		a.innerHTML = '<img src="images/jump.png" alt="☞" width="14" height="14">';
		link.parentNode.insertBefore(a, link.nextSibling);
	};

	registerPlugin({
		newMessageElement: function(elem) {
			var status = null;
			for(var i = 0; i < elem.childNodes.length; i++) {
				status = elem.childNodes[i];
				if (status.className && status.className.indexOf('status') >= 0)
					break;
			}
			var links = status.getElementsByTagName('a');
			var url;
			for (var i = 0; i < links.length; i++) {
				url = links[i].href;
				this.replaceUrl(null, links[i], url, url);
			}
		},
		replaceUrl : function(elem, link, lng, sht) {
			for (var i = 0; i < res.length; i++) {
				if (res[i].search.test(lng)) {
					createAnchor(link, function(){
						dispEmbedSrc(lng.replace(res[i].search, res[i].replace), link);
						return false;
					});
					return;
				}
			}
			if (lng.match(/^(https?:\/\/www\.slideshare\.net\/[-_0-9a-zA-Z]+\/[-_0-9a-zA-Z]+)/)) {
				xds.load("http://www.slideshare.net/api/oembed/2?url=" + RegExp.$1 + "&format=jsonp",
						function(x) {
							createAnchor(link, function(){
								dispEmbedSrc("http:\/\/www\.slideshare\.net\/slideshow\/embed_code\/"
									+ x.slideshow_id,
									link);
								return false;
							});
							
						});
			}
		}
	});
}());

function dispEmbedSrc(url, link) {
	rep_top = Math.max(cumulativeOffset(link)[1] + 20, $("control").offsetHeight);

	$('rep').style.display = "block";
	$('reps').innerHTML = '<iframe id="embedsrc" src="' + url
		+ '" style="width:100%; height: 250px; display:block">';
	$('rep').style.top = rep_top;
	user_pick1 = user_pick2 = null;
}
