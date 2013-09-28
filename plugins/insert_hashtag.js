(function(){
	var footerSetting = footer;
	var footerModified = null;

	registerPlugin({
		switchTo: function(menu) {
			if(menu.id.indexOf("search-#") != 0) {
				footer = footerSetting;
				footerModified = null;
				return;
			}
			footer = " " + menu.id.slice("search-".length);
			if(footerSetting.length > 0) footer +=" " + footerSetting;
			footerModified = footer;
		},
		savePrefs: function(frm) {
			footerSetting = footer;
		},

		// Avoid duplicated hashtags
		post: function(str) {
			var hashtag_regexp = /([#＃][\w々ぁ-ゖァ-ヺーㄱ-ㆅ㐀-\u4DBF一-\u9FFF가-\uD7FF\uF900-\uFAFF０-９Ａ-Ｚａ-ｚｦ-ﾟ]+)/g;
			var hashtags = str.match(hashtag_regexp);
			var footers = footer.match(hashtag_regexp);
			if (!hashtags || !footers) return;
			for (var i = 0; i < hashtags.length; i++) {
				for (var j = 0; j < footers.length; j++) {
					if (hashtags[i].replace(/^＃/,"#") == footers[j]) {
						footer = footer.replace(footers[j], '');
					}
				}
			}
		},
		postQueued: function() {
			footer = footerModified || footerSetting;
		}
	});
}());

