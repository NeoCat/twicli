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
				this.addThumbnail(elem, 'http://twitpic.com/show/thumb/' + id, links[i].href);
			}
			else if (links[i].href.match(/^http:\/\/movapic\.com\/pic\/(\w+)$/)) {
				var id = RegExp.$1;
				this.addThumbnail(elem, 'http://image.movapic.com/pic/t_' + id + '.jpeg', links[i].href);
			}
			else if (links[i].href.match(/^http:\/\/f\.hatena\.ne\.jp\/([\w-_]+)\/(\d{8})(\w+)$/)) {
				var user = RegExp.$1;
				var date = RegExp.$2;
				var id = RegExp.$3;
				this.addThumbnail(elem,
						'http://f.hatena.ne.jp/images/fotolife/' + user[0] + '/' + user +
						'/' + date + '/' + date + id + '_120.jpg',
						links[i].href);
			}
		}
	},

	addThumbnail: function(elem, src, link) {
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
});
