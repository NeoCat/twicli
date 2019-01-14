langResources['Thumbnail'] =	['サムネイル'];
langResources['Position of thumbnail'] =	['サムネイルの位置'];
langResources['Top'] =	['上'];
langResources['Bottom'] = ['下'];
langResources['Link for Twitter photo'] =	['Twitterの写真のリンク先'];
langResources['Tweet page'] =	['ツイートページ'];
langResources['Original image'] = ['オリジナル画像'];

registerPlugin(thumbnail_plugin = {
	newMessageElement: function(elem, tw) {
		tw = tw.retweeted_status || tw;
		var entities = ent(tw);
		if (entities && entities.media) {
			for (var i = 0; i < entities.media.length; i++) {
				if (['photo', 'animated_gif', 'video'].indexOf(entities.media[i].type) >= 0) {
					addThumbnail(elem,
						entities.media[i].media_url_https + ":thumb",
							entities.media[i].type == 'photo' && thumbnail_twitter_photo_link == 'original' ?
							entities.media[i].media_url_https + ":orig" :
							entities.media[i].expanded_url);
				}
			}
		}
		var status = null;
		for(var i = 0; i < elem.childNodes.length; i++) {
			status = elem.childNodes[i];
			if (status.className && status.className.indexOf('status') >= 0)
				break;
		}
		var links = status.getElementsByTagName('a');
		for (var i = 0; i < links.length; i++) {
			this.replaceUrl(elem, links[i], links[i].href);
		}
	},
	replaceUrl: function(elem, link, url) {
		var flickr_id;
		if (link.thumbnailed && link.thumbnailed == url) return;
		link.thumbnailed = url;
		if (url.indexOf(twitterURL) == 0 || url.indexOf("javascript:") == 0)
			return; // skip @... or #...
		if (url.match(/^http:\/\/twitpic\.com\/(\w+)/)) {
			var id = RegExp.$1;
			addThumbnail(elem, 'http://twitpic.com/show/thumb/' + id, url);
		}
		else if (url.match(/^http:\/\/movapic\.com\/pic\/(\w+)$/)) {
			var id = RegExp.$1;
			addThumbnail(elem, 'http://image.movapic.com/pic/t_' + id + '.jpeg', url);
		}
		else if (url.match(/^http:\/\/f\.hatena\.ne\.jp\/([\w\-]+)\/(\d{8})(\w+)$/)) {
			var user = RegExp.$1;
			var date = RegExp.$2;
			var id = RegExp.$3;
			addThumbnail(elem,
					'http://f.hatena.ne.jp/images/fotolife/' + user[0] + '/' + user +
					'/' + date + '/' + date + id + '_120.jpg',
					url);
		}
		else if (url.match(/^(http:\/\/[\w\-]+\.tumblr\.com\/)post\/(\d+)/)) {
			var _url = url;
			xds.load(RegExp.$1+'api/read/json?id='+RegExp.$2,
					function(x) {
						var p = x.posts[0]['photo-url-75'];
						if (!p) return;
						addThumbnail(elem, p, _url);
					});
		}
		else if (flickr_id = flickrPhotoID(url)) {
			var _url = url;
			xds.load('https://www.flickr.com/services/rest?method=flickr.photos.getInfo'+
					'&format=json&api_key=9bc57a7248847fd9a80982989e80cfd0&photo_id='+flickr_id,
					function(x) {
						var p = x.photo;
						if (!p) return;
						addThumbnail(elem, 'http://farm'+p.farm+'.static.flickr.com/'+p.server+'/'+
									p.id+'_'+p.secret+'_s.jpg', _url);
					},
					null, 1, 'jsoncallback');
		}
		else if (url.match(/^http:\/\/img.ly\/(\w+)/)) {
			addThumbnail(elem, 'http://img.ly/show/thumb/'+RegExp.$1, url);
		}
		else if (url.match(/^http:\/\/ow.ly\/i\/(\w+)/)) {
			addThumbnail(elem, 'http://static.ow.ly/photos/thumb/'+RegExp.$1+".jpg", url);
		}
		else if (url.match(/^https?:\/\/(?:(?:www\.|m\.|)youtube\.com\/watch\?.*v=|youtu\.be\/)([\w\-]+)/)) {
			var id = RegExp.$1;
			addThumbnail(elem, 'https://i.ytimg.com/vi/' + id + '/default.jpg', url);
		}
		else if (url.match(/^http:\/\/(?:www\.nicovideo\.jp\/watch|nico\.ms|seiga\.nicovideo\.jp\/seiga)\/([a-z][a-z])(\d+)$/)) {
			if (RegExp.$1 == "lv" || RegExp.$1 == "nw") return; // live/news thumbnail is not supported
			var id = RegExp.$2;
			var host = parseInt(id)%4 + 1;
			if (RegExp.$1 == "im")
				addThumbnail(elem, 'http://lohas.nicoseiga.jp/thumb/' + id, url);
			else
				addThumbnail(elem, 'http://tn-skr' + host + '.smilevideo.jp/smile?i=' + id, url);
		}
		else if (url.match(/^(https?:\/\/(?:www\.)?(?:instagr\.am|instagram\.com)\/p\/[\w\-]+)\/?(?:\??|$)/)) {
			addThumbnail(elem, RegExp.$1+'/media/?size=t', url);
		}
		else if (url.match(/^http:\/\/photozou\.jp\/photo\/show\/\d+\/(\d+)/)) {
			addThumbnail(elem, "http://art"+Math.floor(Math.random()*40+1)+".photozou.jp/bin/photo/"+
							RegExp.$1 +"/org.bin?size=120", url);
		}
		else if (url.match(/^(https?:\/\/www\.slideshare\.net\/)(?!(?:mobile\/)?slideshow)(?:mobile\/)?([-_0-9a-zA-Z]+\/[-_0-9a-zA-Z]+)/)) {
			xds.load("//www.slideshare.net/api/oembed/2?url=" + RegExp.$1 + RegExp.$2 + "&format=jsonp",
					function(x) {
						addThumbnail(elem, x.thumbnail, url);
					});
		}
		else if (url.match(/^http:\/\/p\.twipple\.jp\/(\w+)/)) {
			addThumbnail(elem, 'http://p.twipple.jp/show/thumb/' + RegExp.$1, url);
		}
		else if (url.match(/^https?:(\/\/moby\.to\/\w+)/)) {
			addThumbnail(elem, RegExp.$1+':thumbnail', url);
		}
		else if (url.match(/^https?:\/\/vimeo\.com\/(?:m\/)?(\d+)$/)) {
			xds.load("//vimeo.com/api/v2/video/" + RegExp.$1 + ".json",
				function(x) {
					addThumbnail(elem, x[0].thumbnail_medium, url, x[0].title);
				});
		}
		else if (url.match(/^(http:\/\/www\.pixiv\.net\/member_illust\.php\?(?:.*&)*illust_id=\d+.*)/)) {
			xds.load("//thumbnail-url.appspot.com/url?url=" + encodeURIComponent(RegExp.$1),
				function(x) {
					if (x && x.thumbnail)
						addThumbnail(elem, x.thumbnail, url);
				});
		}
		else if (url.match(/^(https?:\/\/(?:i\.)?gyazo\.com\/[0-9a-f]+)(?:\.png)?/)) {
			xds.load("//thumbnail-url.appspot.com/url?url=" + encodeURIComponent(RegExp.$1),
				function(x) {
					if (x && x.thumbnail)
					addThumbnail(elem, x.thumbnail, url);
			});
		}
		else if (url.match(/^(https?:\/\/(?:www\.)?amazon\.(?:co\.jp|jp|com)\/.*(?:d|dp|product|ASIN)[\/%].+)/)) {
			xds.load("//thumbnail-url.appspot.com/url?url=" + encodeURIComponent(RegExp.$1),
				function(x) {
					if (x && x.thumbnail)
						addThumbnail(elem, x.thumbnail, x.link || url, x.title);
				});
		}
		else if (url.match(/^http:\/\/(?:www\.|m\.)?ustream\.tv\/(channel|recorded)\/(?:id\/)?([\w\-]+)/)) {
		    xds.load("http://api.ustream.tv/json/" + (RegExp.$1=='recorded'?'video':RegExp.$1) + "/" +
				RegExp.$2 + "/getValueOf/imageUrl?key=8149DBC1DF1083B3F4D8F7F0A1978F57",
				function(img) {
					if (img && img.medium)
						addThumbnail(elem, img.medium, url);
				});
		}
	},
	changeTheme: function(theme) {
		thumbnailModeSet(theme.thumbnail_mode || 'top');
	},
	miscTab: function(ele) {
		var e = document.createElement("div");
	e.innerHTML = '<a href="javascript:var s = $(\'thumbnail_pref\').style; s.display = s.display==\'block\'?\'none\':\'block\';void(0)"><b>▼'+_('Thumbnail')+'</b></a>' +
		'<form id="thumbnail_pref" style="display:none" onSubmit="return false;">' +
		_('Position of thumbnail')+': <select id="thumbnail_pos" onchange="thumbnailModeSet(this.value)">' +
		'<option value="top" '+ (thumbnail_mode == 'top' ? ' selected' : '') + '>' + _('Top') + '</option>' +
		'<option value="bottom" '+ (thumbnail_mode != 'top' ? ' selected' : '') + '>' + _('Bottom') + '</option>' +
		'</select><br>' +
		_('Link for Twitter photo')+': <select id="twitter_photo_link" onchange="twitterPhotoLinkSet(this.value)">' +
		'<option value="tweet" '+ (thumbnail_twitter_photo_link == 'tweet' ? ' selected' : '') + '>' +
		_('Tweet page') + '</option>' +
		'<option value="original" '+ (thumbnail_twitter_photo_link == 'original' ? ' selected' : '') + '>' +
		_('Original image') + '</option>' +
		'</select></form>';
		$("pref").appendChild(e);
	}
});

function thumbnailModeSet(mode) {
	if (thumbnail_mode == mode) return;
	thumbnail_mode = mode;
	writeCookie('thumbnail_mode', mode, 3652);
	var eles = document.getElementsByClassName('thumbnail-link');
	for (var i = eles.length - 1; i >= 0; i--)
	eles[i].parentNode.removeChild(eles[i]);
	for (var p = 0; p < 2; p++) {
		for (var i = 0; i < $(['tw','re'][p]).childNodes.length; i++) {
			var tp = $(['tw','re'][p]).childNodes[i];
			for (var j = 0; j < tp.childNodes.length; j++) {
				var td = tp.childNodes[j];
				if (!td.tw) continue;
				thumbnail_plugin.newMessageElement(td, td.tw);
			}
		}
	}
}

function twitterPhotoLinkSet(link) {
	thumbnail_twitter_photo_link = link;
	writeCookie('thumbnail_twitter_photo_link', link, 3652);
}

function flickrPhotoID(url) {
	if (url.match(/^https?:\/\/(?:www\.flickr\.com\/photos\/[\w\-@]+\/(\d+)|flic\.kr\/p\/(\w+)$)/))
		return RegExp.$2 ? decodeBase58(RegExp.$2) : RegExp.$1;
}
function decodeBase58(snipcode) {
	var base58_letters = '123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ';
	var ret = 0;
	for (var i = snipcode.length, m = 1; i; i--, m *= 58)
		ret += base58_letters.indexOf(snipcode.substr(i-1,1)) * m;
	return ret;
}

var thumbnail_mode = readCookie('thumbnail_mode') || 'top';
var thumbnail_twitter_photo_link = readCookie('thumbnail_twitter_photo_link') || 'tweet';

function addThumbnail(elem, src, url, title) {
	var thm = document.createElement('img');
	thm.src = src;
	thm.className = 'thumbnail-image';
	thm.ontouchstart = function(){ thm.style.maxWidth = '200px'; };
	thm.ontouchend   = function(){ thm.style.maxWidth = '30px'; };
	var a = document.createElement('a');
	a.href = url;
	if (title) a.title = title;
	a.target = 'twitter';
	a.className = 'thumbnail-link';
	a.onclick = function(){ return link(a); };
	a.appendChild(thm);
	if (thumbnail_mode == 'top')
		return elem.insertBefore(a, elem.childNodes[2]);
	else {
		for (var i = 0; i < elem.childNodes.length; i++) {
			a.className = 'thumbnail-link2';
			var span = elem.childNodes[i];
			if (span.className == "utils") {
				span = document.createElement('span');
				span.className = 'thumbnail-link';
				elem.insertBefore(span, elem.childNodes[i]);
			}
			if (span.className == 'thumbnail-link')
				return span.appendChild(a);
		}
	}
}
