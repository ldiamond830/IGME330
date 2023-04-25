// I. Variables & constants
const accessToken = "pk.eyJ1IjoibGdkMTY0OSIsImEiOiJjbGc2dXV3am4wMDJmM2RtYjQ0dDZhOTVmIn0.s9BEYPK3Ecx4hYMCP9T55w";
let map;

// An example of how our GeoJSON is formatted
// This will be replaced by the GeoJSON loaded from parks.geojson
let geojson = {
	type: "FeatureCollection",
	features: [{
		"type": "Feature",
		"id" : "p79",
		"properties": {
			"title": "Letchworth State Park",
			"description": "Letchworth State Park, renowned as the \"Grand Canyon of the East,\".",
			"url": "https://parks.ny.gov/parks/letchworth",
			"address": "1 Letchworth State Park, Castile, NY 14427",
			"phone": "(585) 493-3600"
		},
		"geometry": {
			"coordinates": [
				-78.051170,
				42.570148
			],
			"type": "Point"
		}
	}]
};

// II. "private" - will not be exported
const initMap = (center) => {
	mapboxgl.accessToken = accessToken;

	map = new mapboxgl.Map({
		container: "map",
		style: "mapbox://styles/mapbox/light-v11",
		center: center,
		zoom: 5.2
	});
	map.addControl(new mapboxgl.NavigationControl({showCompass:false}));

	// test
	const clickHandler = (id) => alert(`${id} was clicked!`);
	addMarker(geojson.features[0], "poi", clickHandler);
};

const addMarker = (feature, className, clickHandler) => {
	//Create a map marker using feature data
	const element = document.createElement('div');
	element.className = className;
	element.id = feature.id;

	//HTML for the pop up
	const html = `<b>${feature.properties.title}</b>
				 <p>${feature.properties.address}<br>phone: ${feature.properties.phone}</p>`;

	//add marker and pop up to map
	const marker = new mapboxgl.Marker(element)
	.setLngLat(feature.geometry.coordinates)
	.setPopup(new mapboxgl.Popup({offset: 10})
	.setHTML(html))
	.addTo(map);

	element.addEventListener("click", () => clickHandler(marker._element.id));
}

// III. "public" - will be exported
const addMarkersToMap = (json, clickHandler) =>{
	geojson = json;

	for(const feature of geojson.features){
		addMarker(feature, "poi", clickHandler);
	}
}

const flyTo = (center = [0,0]) => {
	//https://docs.mapbox.com/mapbox-gl-js/api/#map#flyto
	map.flyTo({ center: center });
};

const setZoomLevel = (value=0) => {
	// https://docs.mapbox.com/help/glossary/zoom-level/
	map.setZoom(value);
};

const setPitchAndBearing = (pitch=0,bearing=0) => {
	// https://docs.mapbox.com/mapbox-gl-js/example/live-update-feature/
	// https://docs.mapbox.com/mapbox-gl-js/example/set-perspective/
	map.setPitch(pitch);
	map.setBearing(bearing);
};

export { initMap, flyTo, setZoomLevel, setPitchAndBearing, addMarkersToMap };