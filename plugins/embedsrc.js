(function(){
	var res = [
		{search: /^(https?:\/\/www\.slideshare\.net\/)(?:mobile\/)?(slideshow\/embed_code\/(?:key\/)?[-_0-9a-zA-Z.]+)/,
			replace: "$1$2", type: "iframe"},
		{search: /^(https?:\/\/www\.slideshare\.net\/)(?:mobile\/)?([-_0-9a-zA-Z.]+\/[-_0-9a-zA-Z.\/]+)/,
			replace: "http://www.slideshare.net/api/oembed/2?url=$1$2&format=jsonp", type: "slideshare"},
		{search: /^(https?:\/\/[\w\-]+\.tumblr\.com\/)post\/(\d+)(?:\/.*)/,
			replace: "$1api/read/json?id=$2", type: "tumblr"},
		{search: /^https?:\/\/(?:\w+\.)?theta360\.com\/(?:[sm]\/\w+|spheres\/samples\/[a-z0-9-]+)/,
			replace: "$&/", type: "theta"},
		{search: /^https?:\/\/(?:\w+\.)?pinterest\.com\/pin\/\d+/,
			replace: "$&/", type: "pin"},
		{search: /^https?:\/\/(?:(?:www|m)\.youtube\.com\/watch\?.*v=|youtu\.be\/)([\w\-]+).*$/,
			replace: "http://www.youtube.com/embed/$1", type: "iframe"},
		{search: /^(https?:\/\/(?:i\.)?gyazo\.com\/[0-9a-f]+)(?:\.png)?$/,
			replace: "$1.png", type: "iframe"},
		{search: /^https?:\/\/gist\.github\.com\/([A-Za-z0-9-]+\/)?([A-Za-z0-9-]+)(?:\.txt)?$/, replace: "https://gist.github.com/$1$2.js", type: "script"},
		{search: /^https?:\/\/raw\.github\.com\/gist\/(\d+)(?:.*)$/, replace: "https://gist.github.com/$1.js", type: "script"},
		{search: /https?:\/\/(?:nico\.ms|www\.nicovideo\.jp\/watch)\/((?!lv)(?!nw)(?!im)[a-z]{2}\d+)/, replace: "http://ext.nicovideo.jp/thumb_watch/$1", type: "script"},
		{search: /^https?:\/\/vine\.co\/v\/(\w+)$/, replace: "https://vine.co/v/$1/embed/simple", type: "iframe"},
		{search: /^https?:\/\/vimeo\.com\/(?:m\/)?(\d+)$/, replace: "https://player.vimeo.com/video/$1", type: "iframe"}
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
			if (link.embedsrc) return;
			for (var i = 0; i < res.length; i++) {
				if (res[i].search.test(lng)) {
					link.embedsrc = true;
					createAnchor(link, function(){
						dispEmbedSrc(lng.replace(res[i].search, res[i].replace), link, res[i].type);
						return false;
					});
					return;
				}
			}
		}
	});
}());

function dispEmbedSrc(url, link, type) {
	rep_top = Math.max(cumulativeOffset(link)[1] + 20, $("control").offsetHeight);
	var win_h = window.innerHeight || document.documentElement.clientHeight;
	var createIframe = function (content) {
		var ifr = document.getElementById("embedsrc") || document.createElement("iframe");
		ifr.id = "embedsrc";
		ifr.style.border = "0";
		ifr.style.width = "100%";
		ifr.style.height = content.height || "426px";
		ifr.style.display = "block";
		$('reps').appendChild(ifr);
		if (content.document) {
			ifr.contentWindow.document.write(content.document);
		} else if (content.src) {
			ifr.src = content.src;
		}
		$('rep').style.display = "block";
		$('rep').style.top = rep_top;
		scrollToDiv($('rep'));
		user_pick1 = user_pick2 = null;
		return ifr;
	};
	switch (type) {
		case 'data':
			createIframe({
				document: '<div style="text-align: center;">' + url + '</div>'
			});
			break;
		case 'iframe':
			createIframe({
				src: url,
				height: Math.ceil(win_h * 0.5) + "px"
			});
			break;
		case 'script':
			createIframe({
				document: '<div><scr' + 'ipt type="text/javascript" src="' + url +
					'"></scr' + 'ipt></div>'
			});
			break;
		case 'pin':
			createIframe({
				document: '<div><a data-pin-do="embedPin" href="' + url
					+ '"></a><scr'
					+ 'ipt type="text/javascript" async src="//assets.pinterest.com/js/pinit.js"></scr'
					+ 'ipt></div>'
			});
			break;
		case 'theta':
			createIframe({
				document: '<div class="ricoh-theta-spherical-image" ><a href="' + url
					+ '" target="_blank"></a></div><scr'
					+ 'ipt async src="https://theta360.com/widgets.js" charset="utf-8"></scr'
					+ 'ipt>'
			});
			break;
		case 'slideshare':
			xds.load(url, function(x) {
				dispEmbedSrc("http:\/\/www\.slideshare\.net\/slideshow\/embed_code\/"
					+ x.slideshow_id, link, 'iframe');
			});
			break;
		case 'tumblr':
			xds.load(url, function(x) {
				var p = x.posts[0]['photo-url-500'];
				var v = x.posts[0]['video-player'];
				if (v) {
					dispEmbedSrc(v, link, 'data');
				} else if (p) {
					dispEmbedSrc('<img src="' + p + '">', link, 'data');
				}
			});
			break;
	}
}
