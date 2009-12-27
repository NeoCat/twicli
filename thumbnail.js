registerPlugin({
	newMessageElement: function(elem) {
		var status = null;
		for(var i = 0; i < elem.childNodes.length; i++) {
			if (new String(elem.childNodes[i].className).indexOf('status') >= 0) {
				status = elem.childNodes[i];
				break;
			}
		}
		var links = status.getElementsByTagName('a');
		for (var i = 0; i < links.length; i++) {
			if (links[i].href.match(/^http:\/\/twitpic\.com\/(\w+)$/)) {
				var id = RegExp.$1;
				addThumbnail(elem, 'http://twitpic.com/show/thumb/' + id, links[i].href);
			}
			else if (links[i].href.match(/^http:\/\/movapic\.com\/pic\/(\w+)$/)) {
				var id = RegExp.$1;
				addThumbnail(elem, 'http://image.movapic.com/pic/t_' + id + '.jpeg', links[i].href);
			}
			else if (links[i].href.match(/^http:\/\/f\.hatena\.ne\.jp\/([\w-_]+)\/(\d{8})(\w+)$/)) {
				var user = RegExp.$1;
				var date = RegExp.$2;
				var id = RegExp.$3;
				addThumbnail(elem,
						'http://f.hatena.ne.jp/images/fotolife/' + user[0] + '/' + user +
						'/' + date + '/' + date + id + '_120.jpg',
						links[i].href);
			}
			else if (links[i].href.match(/^http:\/\/(www\.flickr\.com)\/photos\/[\w-_@]+\/(\d+)/) ||
					 links[i].href.match(/^http:\/\/(flic\.kr)\/p\/(\w+)/)) {
				var snipcode = RegExp.$1 == 'flic.kr' ? base58_decode(RegExp.$2) : RegExp.$2;
				var link = links[i].href;
				xds.load('http://www.flickr.com/services/rest?method=flickr.photos.getInfo'+
						'&format=json&api_key=9bc57a7248847fd9a80982989e80cfd0&photo_id='+snipcode,
						function(x) {
							var p = x.photo;
							if (!p) return;
							addThumbnail(elem, 'http://farm'+p.farm+'.static.flickr.com/'+p.server+'/'+
										p.id+'_'+p.secret+'_s.jpg', link)
						},
						'jsoncallback');
			}
		}
	},
});

function base58_decode(snipcode) {
	var alphabet = '123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ';
	var num = snipcode.length;
	var decoded = 0;
	var multi = 1;
	for (var i = (num-1) ; i >= 0 ; i--) {
		decoded = decoded + multi * alphabet.indexOf(snipcode[i]);
		multi = multi * alphabet.length;
	}
	return decoded;
}

function addThumbnail(elem, src, link) {
	var thm = document.createElement('img');
	thm.src = src;
	thm.className = 'thumbnail-image';
	var a = document.createElement('a');
	a.href = link;
	a.target = 'twitter';
	a.className = 'thumbnail-link';
	a.appendChild(thm);
	elem.insertBefore(a, elem.childNodes[2]);
}
