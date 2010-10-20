(function(){
	var footerSetting = footer;

	registerPlugin({
		switchTo: function(m) {
			var sel = document.getElementsByClassName("sel");

			if(sel.length < 1) return;

			if(sel[0].id.indexOf("search-#") != 0) {
				footer = footerSetting;
				return;
			}

			footer = " " + sel[0].id.slice("search-".length);
			if(footerSetting.length > 0) footer +=" " + footerSetting;
		}
	});
}());

