import * as map from "./map.js";
import * as ajax from "./ajax.js";

// I. Variables & constants
// NB - it's easy to get [longitude,latitude] coordinates with this tool: http://geojson.io/
const lnglatNYS = [-75.71615970715911, 43.025810763917775];
const lnglatUSA = [-98.5696, 39.8282];
let favoriteIds = ["p20","p79","p180","p43"];
let geojson;

// II. Functions
const setupUI = () => {
	// NYS Zoom 5.2
	document.querySelector("#btn-ny-zoom").onclick = () =>{
		map.setZoomLevel(5.2);
		map.setPitchAndBearing(0,0);
		map.flyTo(lnglatNYS);
	}
	// NYS isometric view
	document.querySelector("#btn-ny-iso").onclick = () =>{
		map.setZoomLevel(5.5);
		map.setPitchAndBearing(45,0);
		map.flyTo(lnglatNYS);
	}
	// World zoom 0
	document.querySelector("#btn-usa").onclick = () =>{
		map.setZoomLevel(3);
		map.setPitchAndBearing(0,0);
		map.flyTo(lnglatUSA);
	}
}

const refreshFavorites = () =>{
	const favoritesContainer = document.querySelector("#favorites-list");
	favoritesContainer.innerHTML = "";

	for(const id of favoriteIds){
		favoritesContainer.appendChild(createFavoriteElement(id));
	}
}



const getFeatureById = (id) =>
{
	return geojson.features.find(value => value.id = id);
}

const createFavoriteElement = (id) =>{
	const feature = getFeatureById(id);
	const a = document.createElement('a');
	a.className = "panel-block";
	a.id = feature.id;

	a.onclick = () =>{
		showFeatureDetails(a.id);
		map.setZoomLevel(6);
		map.flyTo(feature.geometry.coordinates);
	};
	a.innerHTML = `<span class = "panel-icon">
					<i class = "fas fa-map-pin"></i>
	</span> ${feature.properties.title}
	`;

	return a;
}

const showFeatureDetails = (id) => {
	console.log(`showFeatureDetails - id=${id}`);
	const feature = getFeatureById(id);
	document.querySelector("#details-1").innerHTML = `Info for ${feature.properties.title}`;

	
	document.querySelector("#details-2").innerHTML = `Address: ${feature.properties.address}<br>
	Phone: ${feature.properties.phone}<br>
	Website: ${feature.properties.url}`;

	
	document.querySelector("#details-3").innerHTML = feature.properties.description;;
};

const init = () => {
	map.initMap(lnglatNYS);
	ajax.downloadFile("data/parks.geojson", (str) => {
		geojson = JSON.parse(str);
		console.log(geojson)
		map.addMarkersToMap(geojson, showFeatureDetails);
		refreshFavorites();
		setupUI();
	});
	
};

init();