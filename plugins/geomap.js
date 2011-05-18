registerPlugin({
	newMessageElement: function(elem, tw) {
		var rs = tw.retweeted_status || tw;
		if (!rs.place && !(rs.geo && rs.geo.type == 'Point')) return;

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
			
		if (rs.geo && rs.geo.type == 'Point')
			geomap.onclick = function() {
				display_map(rs.geo.coordinates, geomap);
				return false;
			};
		else if (rs.place && rs.place.bounding_box)
			geomap.onclick = function() {
				display_placemap(rs.place, geomap);
				return false;
			};
	}
});

function display_map(coordinates, elem) {
	rep_top = Math.max(cumulativeOffset(elem)[1] + 20, $("control").offsetHeight);
	var win_h = window.innerHeight || document.documentElement.clientHeight;
	$('reps').innerHTML = '<div id="map_canvas" style="width: 100%; height: '+Math.ceil(win_h*0.67)+'px;">';
	$('rep').style.top = rep_top;
	$('rep').style.display = "block";
	make_geo_map(coordinates);
	scrollToDiv($('rep'));
	user_pick1 = user_pick2 = null;
}

function make_geo_map(coordinates) {
	var latlng = new google.maps.LatLng(coordinates[0], coordinates[1]);
	var map = new google.maps.Map(document.getElementById("map_canvas"),
		{zoom: 13, center: latlng, mapTypeId: google.maps.MapTypeId.ROADMAP});
	var marker = new google.maps.Marker({position: latlng, map: map});

	if (coordinates[2]) {
		mapAccCircleOption.radius = coordinates.pop();
		var accCircle = new google.maps.Circle(mapAccCircleOption);
		accCircle.setCenter(latlng);
		accCircle.setMap(map);
	}

	google.maps.event.addListener(marker, 'click', function(event) {
		window.open('http://maps.google.com?q='+coordinates.join(","));
	});
}

var mapAccCircleOption = {
	fillColor:      '#f37171',
	fillOpacity:    0.3,
	strokeColor:    '#f37171',
	strokeOpacity:  0.7,
	strokeWeight:   4
};

function display_placemap(place, elem) {
	rep_top = Math.max(cumulativeOffset(elem)[1] + 20, $("control").offsetHeight);
	var win_h = window.innerHeight || document.documentElement.clientHeight;
	$('reps').innerHTML = '<div id="map_canvas" style="width: 100%; height: '+Math.ceil(win_h*0.67)+'px;">';
	$('rep').style.top = rep_top;
	$('rep').style.display = "block";
	make_geo_placemap(place);
	scrollToDiv($('rep'));
	user_pick1 = user_pick2 = null;
}

function make_geo_placemap(place) {
	var box_coords = place.bounding_box.coordinates[0];
	var la = 0,lo = 0;
	for (var i=0; i<box_coords.length; i++) {
		lo += box_coords[i][0];
		la += box_coords[i][1];
	}
	lo /= box_coords.length;
	la /= box_coords.length;
	var latlng = new google.maps.LatLng(la, lo);
	var map = new google.maps.Map(document.getElementById("map_canvas"),
		{zoom: 11, center: latlng, mapTypeId: google.maps.MapTypeId.ROADMAP});

	if (!place.id) return;

	var rendarPolygonMap = function (geoobj) {
		if (!geoobj.geometry || geoobj.geometry.type != "Polygon") return;
		var paths = [];
		for (var i=0; i< geoobj.geometry.coordinates[0].length; i++)
			paths.push(new google.maps.LatLng(
						geoobj.geometry.coordinates[0][i][1],
						geoobj.geometry.coordinates[0][i][0]));
		var polygon = new google.maps.Polygon(mapPolygonOptions);
		polygon.setPaths(paths);
		polygon.setMap(map);
	};
	xds.load_for_tab(twitterAPI + 'geo/id/' + place.id + '.json', rendarPolygonMap);
}

var mapPolygonOptions = {
	fillColor:      '#f37171',
	fillOpacity:    0.3,
	strokeColor:    '#f37171',
	strokeOpacity:  0.7,
	strokeWeight:   4
};

document.write('<script type="text/javascript" src="http://maps.google.com/maps/api/js?sensor=false"></script>');
