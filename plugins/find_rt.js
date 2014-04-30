(function(){
	registerPlugin({
		newMessageElement: function(elem) {
			var node = elem;
			var status = null;
			for(var i = 0; i < elem.childNodes.length; i++) {
				status = elem.childNodes[i];
				if (status.className && status.className.indexOf('status') >= 0)
					break;
			}
			for (var i = 0; i < status.childNodes.length; i++) {
				var ele = status.childNodes[i];
				if (ele.nodeType == 3) {// text node
					if (ele.nodeValue.match(/([\s\S]*)((?:>|＞|→)\s*RT)([\s\S]*)/)) {
						ele.nodeValue = RegExp.$1;
						var a = document.createElement('a');
						a.href = "#";
						a.onclick = function(){
							var t = node.tw.retweeted_status || node.tw;
							var p = elem;
							var pp = elem.parentNode;
							while (true) {
								if (!p) {
									pp = pp.nextSibling;
									if (!pp) break;
									p = pp.childNodes[0];
								} else {
									p = p.nextSibling;
								}
								if (!p || !p.tw) continue;
								if (p.tw.user.id == t.user.id && p.tw.retweeted_status) {
									rep_top = cumulativeOffset(node)[1] + 20;
									dispReply2(p.tw);
									break;
								}
							}
							if (!pp) {
								xds.load_for_tab(twitterAPI + 'statuses/user_timeline.json' +
									'?count=10&id=' + t.user.id + '&max_id=' + t.id +
									'&include_rts=true&include_entities=true&suppress_response_codes=true',
									function(tw) {
										for (var i = 0; i < tw.length; i++) {
											if (tw[i].retweeted_status) {
												rep_top = cumulativeOffset(node)[1] + 20;
												dispReply2(tw[i]);
												break;
											}
										}
									}
								);
							}
							return false;
						};
						a.appendChild(document.createTextNode(RegExp.$2));
						status.insertBefore(a, ele.nextSibling);
						status.insertBefore(document.createTextNode(RegExp.$3), a.nextSibling);
					}
				}
			}
		}
	});
}());

