loadLeaflet();

var geomap = {
	button: null
};

registerPlugin({
	newMessageElement: function(elem, tw) {
		var rs = tw.retweeted_status || tw;
		if (!rs.place && !(rs.geo && rs.geo.type == 'Point')) return;

		var button = elem.querySelector('.utils > .button.geomap');
		if (!button) return alert("geomap not found!!");

		L.DomEvent.on(button, 'click', function(ev) {
			if (rs.geo && rs.geo.type == 'Point') {
				display_map(rs.geo.coordinates, button);
			} else if (rs.place && rs.place.bounding_box) {
				display_placemap(rs.place, button);
			}
			L.DomEvent.stop(ev);
		});
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
		window.open('https://maps.google.com?q='+coordinates.join(","));
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
		var coords = [[]], paths = [];
		if (geoobj.geometry && geoobj.geometry.type === "Polygon")
			coords = geoobj.geometry.coordinates;
		else if (geoobj.bounding_box && geoobj.bounding_box.type === "Polygon")
			coords = geoobj.bounding_box.coordinates;
		for (var i = 0; i < coords[0].length; i++)
			paths.push(new google.maps.LatLng(coords[0][i][1], coords[0][i][0]));
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

function loadLeaflet() {
	var style = document.createElement('link');
	style.rel='stylesheet';
	style.href='//unpkg.com/leaflet@1.4.0/dist/leaflet.css';
	style.type = 'text/css';
	style.integrity='sha512-puBpdR0798OZvTTbP4A8Ix/l+A4dHDD0DGqYW6RQ+9jxkRFclaxxQb/SJAWZfWAkuyeQUytO7+7N4QKrDh+drA==';
	style.crossOrigin = 'anonymous';
	document.head.appendChild(style);
	
	var script = document.createElement('script');
	script.type = 'text/javascript';
	script.src = '//unpkg.com/leaflet@1.4.0/dist/leaflet.js';
	script.integrity = 'sha512-QVftwZFqvtRNi0ZyCtsznlKSWOStnDORoefr1enyq5mVL4tmKB3S/EnC3rRJcxCPavG10IcrVGSmPh6Qw5lwrg==';
	script.crossOrigin = 'anonymous';
	document.body.appendChild(script);
}

document.write('<script type="text/javascript" src="https://maps.google.com/maps/api/js"></script>');
