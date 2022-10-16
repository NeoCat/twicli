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
		var addThumbnailForEntities = function(entities, elem) {
			if (entities && entities.media) {
				for (var i = 0; i < entities.media.length; i++) {
					if (['photo', 'animated_gif', 'video'].indexOf(entities.media[i].type) >= 0) {
						addThumbnail(elem,
							     entities.media[i].media_url_https + ":thumb",
							     entities.media[i].type == 'photo' && thumbnail_twitter_photo_link == 'original' ?
							     entities.media[i].media_url_https + ":orig" :
							     entities.media[i].expanded_urls,
							     null, "entities");
					}
				}
			}
		};
		addThumbnailForEntities(ent(tw), elem);
		tw.quoted_status && addThumbnailForEntities(ent(tw.quoted_status), elem.querySelector('.quoted') || elem);

		Array.prototype.forEach.call(elem.querySelectorAll('.status > a.link'), function(a) {
			this.replaceUrl(a.parentNode.parentNode, a, a.href);
		}.bind(this));
	},
	replaceUrl: function(elem, link, url) {
		var flickr_id, id, _url;
		if (link.thumbnailed && link.thumbnailed == url) return;
		link.thumbnailed = url;
                if (url.match(/^https?:\/\/twitter\.com\/i\/web\/status\/(\d+)/)) {
			// multiple media attachment
			return xds.load(twitterAPI2 + 'tweets/' + RegExp.$1 + '?expansions=attachments.media_keys&media.fields=variants,preview_image_url',
				function(r) {
					elem.tw_v2 = r;
					var keys = r.data.attachments.media_keys;
					var media = {};
					for (var i = 0; i < r.includes.media.length; i++) {
						var m = r.includes.media[i];
						media[m.media_key] = m;
					}
					Array.prototype.forEach.call(elem.querySelectorAll('.entities'), function(a) {
						a.parentNode.removeChild(a);
					});
					for (var i = 0; i < keys.length; i++) {
						addThumbnail(elem, media[keys[i]].preview_image_url + ':thumb', media[keys[i]].variants[0].url);
					}
					callPlugins('setTweetV2', elem);
				 }, null, null, false);
                }
		if (url.indexOf(twitterURL) == 0 || url.indexOf("javascript:") == 0)
			return; // skip @... or #...
		if (url.match(/^http:\/\/movapic\.com\/pic\/(\w+)$/)) {
			id = RegExp.$1;
			addThumbnail(elem, 'http://image.movapic.com/pic/t_' + id + '.jpeg', url);
		}
		else if (url.match(/^http:\/\/f\.hatena\.ne\.jp\/([\w-]+)\/(\d{8})(\w+)$/)) {
			var user = RegExp.$1;
			var date = RegExp.$2;
			id = RegExp.$3;
			addThumbnail(elem,
					'http://f.hatena.ne.jp/images/fotolife/' + user[0] + '/' + user +
					'/' + date + '/' + date + id + '_120.jpg',
					url);
		}
		else if (url.match(/^(http:\/\/[\w-]+\.tumblr\.com\/)post\/(\d+)/)) {
			_url = url;
			xds.load(RegExp.$1+'api/read/json?id='+RegExp.$2,
					function(x) {
						var p = x.posts[0]['photo-url-75'];
						if (!p) return;
						addThumbnail(elem, p, _url);
					});
		}
		else if (flickr_id = flickrPhotoID(url)) {
			_url = url;
			xds.load('https://www.flickr.com/services/rest?method=flickr.photos.getInfo'+
					'&format=json&api_key=9bc57a7248847fd9a80982989e80cfd0&photo_id='+flickr_id,
					function(x) {
						var p = x.photo;
						if (!p) return;
						addThumbnail(elem, '//farm'+(p.farm || 1)+'.static.flickr.com/'+p.server+'/'+
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
		else if (url.match(/^https?:\/\/(?:(?:www\.|m\.|)youtube\.com\/watch\?.*v=|youtu\.be\/)([\w-]+)/)) {
			id = RegExp.$1;
			addThumbnail(elem, 'https://i.ytimg.com/vi/' + id + '/default.jpg', url);
		}
		else if (url.match(/^http:\/\/(?:www\.nicovideo\.jp\/watch|nico\.ms|seiga\.nicovideo\.jp\/seiga)\/([a-z][a-z])(\d+)$/)) {
			if (RegExp.$1 == "lv" || RegExp.$1 == "nw") return; // live/news thumbnail is not supported
			id = RegExp.$2;
			var host = parseInt(id)%4 + 1;
			if (RegExp.$1 == "im")
				addThumbnail(elem, 'http://lohas.nicoseiga.jp/thumb/' + id, url);
			else
				addThumbnail(elem, 'http://tn-skr' + host + '.smilevideo.jp/smile?i=' + id, url);
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
		else if (url.match(/^https?:(\/\/moby\.to\/\w+)/)) {
			addThumbnail(elem, RegExp.$1+':thumbnail', url);
		}
		else if (url.match(/^https?:\/\/vimeo\.com\/(?:m\/)?(\d+)$/)) {
			xds.load("//vimeo.com/api/v2/video/" + RegExp.$1 + ".json",
				function(x) {
					addThumbnail(elem, x[0].thumbnail_medium, url, x[0].title);
				});
		}
		else if (url.match(/^https?:\/\/(?:i\.)?gyazo\.com\/([0-9a-f]+)(?:\.png|\.jpg)?/)) {
			var gyazo_prefix = 'https://i.gyazo.com/thumb/400/';
			addThumbnail(elem, [gyazo_prefix + RegExp.$1 + '-png.jpg', gyazo_prefix + RegExp.$1 + '-jpg.jpg'], url);
		}
		else if (url.match(/^(https?:\/\/(?:www\.)?amazon\.(?:co\.jp|jp|com)\/.*(?:d|dp|product|ASIN)[/%][^?]+)\??/)) {
			xds.load("//thumbnail-url-t2yaxfegmq-uw.a.run.app/url?url=" + encodeURIComponent(RegExp.$1),
				function(x) {
					if (x && x.thumbnail)
						addThumbnail(elem, x.thumbnail, x.link || url, x.title);
				});
		}
	},
	changeTheme: function(theme) {
		thumbnailModeSet(theme.thumbnail_mode || 'top');
	},
	miscTab: function() {
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
		for (i = 0; i < $(['tw','re'][p]).childNodes.length; i++) {
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

function addThumbnail(elem, src, url, title, class_name) {
	var thm = document.createElement('img');
	if (typeof(src) == 'string')
	  thm.src = src;
	else {
		thm.src = src[0];
		thm.onerror = function() { thm.onerror = null; thm.src = src[1]; };
	}
	thm.className = 'thumbnail-image';
	thm.ontouchstart = function(){ thm.style.maxWidth = '200px'; };
	thm.ontouchend   = function(){ thm.style.maxWidth = '30px'; };
	var a = document.createElement('a');
	a.href = url;
	if (title) a.title = title;
	a.target = 'twitter';
	a.className = 'thumbnail-link ' + (class_name || '');
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
				span.className = 'thumbnail-link ' + (class_name || '');
				elem.insertBefore(span, elem.childNodes[i]);
			}
			if (span.className && span.className.match(/^thumbnail-link/))
				return span.appendChild(a);
		}
	}
}
