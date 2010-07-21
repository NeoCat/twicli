registerPlugin({
	newMessageElement: function(elem, tw) {
		if (!tw.geo || tw.geo.type != 'Point') return;
		
		var geomap = null; // find "geomap" in elem
		for (var i = 0; i < elem.childNodes.length; i++) {
			var util = elem.childNodes[i];
			if (util.className != "utils") continue;
			for (var j = 0; j < util.childNodes.length; j++) {
				var uc = util.childNodes[j];
				if (uc.className == 'button geomap') {
					geomap = uc;
					break;
				}
			}
		}
		if (!geomap) return alert("geomap not found!!");
		
		var plugin = this;
		geomap.onclick = function() {
			rep_top = cumulativeOffset(geomap)[1] + 20;
			$('reps').innerHTML = '<div id="map_canvas" style="width: 100%; height: 250px;">';
			$('rep').style.display = "block";
			plugin.make_geo_map(tw.geo.coordinates);
			$('rep').style.top = rep_top;
			user_pick1 = user_pick2 = null;
			return false;
		};
	},
	make_geo_map: function(coordinates) {
		var latlng = new google.maps.LatLng(coordinates[0], coordinates[1]);
		var map = new google.maps.Map(document.getElementById("map_canvas"),
			{zoom: 10, center: latlng, mapTypeId: google.maps.MapTypeId.ROADMAP});
		var marker = new google.maps.Marker({position: latlng, map: map});
		google.maps.event.addListener(marker, 'click', function(event) {
			window.open('http://maps.google.com?q='+coordinates.join(","));
		});
	},
});

document.write('<script type="text/javascript" src="http://maps.google.com/maps/api/js?sensor=false"></script>');
