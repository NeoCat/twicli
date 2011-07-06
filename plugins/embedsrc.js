(function(){
	var res = [
		{search: /^https?:\/\/(?:www\.youtube\.com\/watch\?.*v=|youtu\.be\/)([\w\-]+).*$/,
			replace: "http://www.youtube.com/embed/$1", type: "iframe"},
		{search: /^https?:\/\/gist\.github\.com\/(\d+)(?:\.txt)?$/, replace: "https://gist.github.com/$1.pibb", type: "iframe"},
		{search: /^https?:\/\/raw\.github\.com\/gist\/(\d+)(?:.*)$/, replace: "https://gist.github.com/$1.pibb", type: "iframe"},
		{search: /https?:\/\/(?:nico\.ms|www\.nicovideo\.jp\/watch)\/((?!lv)(?!nw)[a-z]{2}\d+)/, replace: "http://ext.nicovideo.jp/thumb_watch/$1", type: "script"}
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
					createAnchor(link, function(){
						dispEmbedSrc(lng.replace(res[i].search, res[i].replace), link, res[i].type);
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
									link, 'iframe');
								return false;
							});
							
						});
			}
		}
	});
}());

function dispEmbedSrc(url, link, type) {
	link.embedsrc = true;
	rep_top = Math.max(cumulativeOffset(link)[1] + 20, $("control").offsetHeight);
	var win_h = window.innerHeight || document.documentElement.clientHeight;
	$('rep').style.display = "block";
	if (type == 'iframe') {
		$('reps').innerHTML = '<iframe id="embedsrc" src="' + url
			+ '" style="border:0; width:100%; height:'+Math.ceil(win_h*0.5)+'px; display:block"></iframe>';
	} else if (type == 'script') {
		$('reps').innerHTML = '<iframe id="embedsrc" style="border:0; width:100%; height: 402px; display:block"></iframe>';
		document.getElementById('embedsrc').contentWindow.document.write(
			'<div style="text-align: center;"><scr'+'ipt type="text/javascript" src="'+url+
				'"></scr'+'ipt></div>');
	}
	$('rep').style.top = rep_top;
	scrollToDiv($('rep'));
	user_pick1 = user_pick2 = null;
}
