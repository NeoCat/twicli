loadLeaflet();

var geomap = {
	color: '#4183c4',
	opacity: 0.7,
	fillOpacity: 0.3,
	tileLayer: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
	attribution: 'Map data © <a href="https://openstreetmap.org" target="_blank">OpenStreetMap</a> contributors',
	zoomDefault: 13,
	openMap: function() {
		var zoom = geomap[geomap.zoom > -1 ? 'zoom' : 'zoomDefault']
		window.open(
			// OpenStreetMap
			'https://www.openstreetmap.org/?mlat=' + geomap.coordinates[0] + '&mlon=' + geomap.coordinates[1] +
			'#map=' + zoom + '/' + geomap.coordinates.join('/')
			// Google
			// 'https://www.google.com/maps/place/@' + geomap.coordinates.join(',') + ',' + zoom + 'z?q=' +
			// geomap.coordinates.join(',');
		);
	}
};

registerPlugin({
	newMessageElement: function(elem, tw) {
		var rs = tw.retweeted_status || tw;
		if (!rs.place && !(rs.geo && rs.geo.type == 'Point')) return;

		var button = elem.querySelector('.utils > .button.geomap');
		if (!button) return alert("geomap not found!!");

		button.onclick = undefined;
		L.DomEvent.on(button, 'click', function(ev) {
			if (rs.geo && rs.geo.type == 'Point') {
				display_map(rs.geo.coordinates, button);
			} else if (rs.place && rs.place.bounding_box) {
				display_placemap(rs.place, button);
			} else {
				return link(ev.currentTarget);
			}
			L.DomEvent.stop(ev);
		});
	}
});

function display_map(coordinates, elem) {
	showMapCanvas(elem);
	make_geo_map(coordinates);
}

function make_geo_map(coordinates) {
	var radius = coordinates.length === 3 ? coordinates.pop() : 0;
	var map = L.map('map_canvas').setView(coordinates, geomap.zoomDefault);
	L.marker(coordinates).on('click', geomap.openMap).addTo(map);
	setTileLayer(map);
	radius && L.circle(coordinates, {
		color: geomap.color,
		opacity: geomap.opacity,
		fillColor: geomap.color,
		fillOpacity: geomap.fillOpacity,
		radius: radius
	}).addTo(map);
	geomap.coordinates = coordinates;
	map.on('zoomanim', function(event) {
		geomap.zoom = event.zoom;
	});
}

function display_placemap(place, elem) {
	showMapCanvas(elem);
	make_geo_placemap(place);
}

function make_geo_placemap(place) {
	var box_coords = place.bounding_box.coordinates[0] || [];
	var latLngBounds = box_coords.map(function(lngLat) { return L.latLng(lngLat[1], lngLat[0]); });
	var map = L.map('map_canvas').fitBounds(L.latLngBounds(latLngBounds));
	setTileLayer(map);

	if (!place.id) return;

	var rendarPolygonMap = function(geoobj) {
		var coords = [];
		if (geoobj.geometry && geoobj.geometry.type === 'Polygon')
			coords = geoobj.geometry.coordinates[0];
		else if (geoobj.bounding_box && geoobj.bounding_box.type === 'Polygon')
			coords = box_coords;
		var paths = coords.map(function (lngLat) { return L.latLng(lngLat[1], lngLat[0]); });
		paths.length > 3 && paths[0].equals(paths[paths.length - 1]) && paths.pop(); // 始点と終点が同じならば除外
		L.polygon(paths, {
			color: geomap.color,
			opacity: geomap.opacity,
			fillColor: geomap.color,
			fillOpacity: geomap.fillOpacity
		}).addTo(map);
	};
	xds.load_for_tab(twitterAPI + 'geo/id/' + place.id + '.json', rendarPolygonMap);
}

function showMapCanvas(elem) {
	rep_top = Math.max(cumulativeOffset(elem)[1] + 20, L.DomUtil.get('control').offsetHeight);
	var win_h = window.innerHeight || document.documentElement.clientHeight;
	L.DomUtil.get('reps').innerHTML = '<div id="map_canvas" style="width: 100%; height: ' + Math.ceil(win_h * 0.67) + 'px;">';
	var rep = L.DomUtil.get('rep');
	rep.style.top = rep_top;
	rep.style.display = 'block';
	scrollToDiv(rep);
	user_pick1 = user_pick2 = null;
}

function setTileLayer(map) {
	L.tileLayer(geomap.tileLayer, { attribution: geomap.attribution })
		.on('load', function() {
			Array.prototype.forEach.call(
				document.querySelectorAll(
					'#map_canvas > div.leaflet-control-container .leaflet-control.leaflet-control-attribution > a[href]'
				),
				function(a) {
					a.target = '_blank';
				}
			);
		})
		.addTo(map);
}

function loadLeaflet() {
	var style = document.createElement('link');
	style.rel='stylesheet';
	style.href='https://unpkg.com/leaflet@1.6.0/dist/leaflet.css';
	style.type = 'text/css';
	style.integrity='sha512-xwE/Az9zrjBIphAcBb3F6JVqxf46+CDLwfLMHloNu6KEQCAWi6HcDUbeOfBIptF7tcCzusKFjFw2yuvEpDL9wQ==';
	style.crossOrigin = 'anonymous';
	document.head.appendChild(style);

	var script = document.createElement('script');
	script.type = 'text/javascript';
	script.src = 'https://unpkg.com/leaflet@1.6.0/dist/leaflet.js';
	script.integrity = 'sha512-gZwIG9x3wUXg2hdXF6+rVkLF/0Vi9U8D2Ntg4Ga5I5BZpVkVxlJWbSQtXPSiUTtC0TjtGOmxa1AJPuV0CPthew==';
	script.crossOrigin = 'anonymous';
	document.body.appendChild(script);

	/* global L */
}
