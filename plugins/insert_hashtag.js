(function(){
	var footerSetting = footer;

	registerPlugin({
		switchTo: function(menu) {
			if(menu.id.indexOf("search-#") != 0) {
				footer = footerSetting;
				return;
			}
			footer = " " + menu.id.slice("search-".length);
			if(footerSetting.length > 0) footer +=" " + footerSetting;
		},
		savePrefs: function(frm) {
			footerSetting = footer;
		}
	});
}());

