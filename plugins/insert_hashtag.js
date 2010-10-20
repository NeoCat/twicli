(function(){
	registerPlugin({
		post: function(st) {
			var sel = document.getElementsByClassName("sel");

			if(sel.length < 1 || sel[0].id.indexOf("search-#") != 0) return;

			var stv = document.frm.status.value;
			stv += " " + sel[0].id.slice("search-".length);
			if(stv.length > 140) return;

			document.frm.status.value = stv;
		}
	});
}());

