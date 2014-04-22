(function(){
	var res = [
		{search: /^https?:\/\/(?:(?:www|m)\.youtube\.com\/watch\?.*v=|youtu\.be\/)([\w\-]+).*$/,
			replace: "http://www.youtube.com/embed/$1", type: "iframe"},
		{search: /^https?:\/\/gist\.github\.com\/(?:[A-Za-z-]+\/)?(\d+)(?:\.txt)?$/, replace: "https://gist.github.com/$1.js", type: "script"},
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
			if (lng.match(/^(https?:\/\/www\.slideshare\.net\/[-_0-9a-zA-Z.]+\/[-_0-9a-zA-Z.]+)/)) {
				link.embedsrc = true;
				xds.load("http://www.slideshare.net/api/oembed/2?url=" + RegExp.$1 + "&format=jsonp",
						function(x) {
							createAnchor(link, function(){
								dispEmbedSrc("http:\/\/www\.slideshare\.net\/slideshow\/embed_code\/"
									+ x.slideshow_id,
									link, 'iframe');
								return false;
							});
							
						});
			}
		}
	});
}());

function dispEmbedSrc(url, link, type) {
	rep_top = Math.max(cumulativeOffset(link)[1] + 20, $("control").offsetHeight);
	var win_h = window.innerHeight || document.documentElement.clientHeight;
	$('rep').style.display = "block";
	if (type == 'iframe') {
		$('reps').innerHTML = '<iframe id="embedsrc" src="' + url
			+ '" style="border:0; width:100%; height:'+Math.ceil(win_h*0.5)+'px; display:block"></iframe>';
	} else if (type == 'script') {
		$('reps').innerHTML = '<iframe id="embedsrc" style="border:0; width:100%; height: 426px; display:block"></iframe>';
		document.getElementById('embedsrc').contentWindow.document.write(
			'<div><scr'+'ipt type="text/javascript" src="'+url+
				'"></scr'+'ipt></div>');
	}
	$('rep').style.top = rep_top;
	scrollToDiv($('rep'));
	user_pick1 = user_pick2 = null;
}
