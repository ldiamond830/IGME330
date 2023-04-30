import * as map from "./map.js";
import * as ajax from "./ajax.js";
import * as storage from "./storage.js"
// I. Variables & constants
// NB - it's easy to get [longitude,latitude] coordinates with this tool: http://geojson.io/
const lnglatNYS = [-75.71615970715911, 43.025810763917775];
const lnglatUSA = [-98.5696, 39.8282];
let favoriteIds = [];
let geojson;
let currentID;
let favoriteButton;
let deleteButton;

// II. Functions
//checks if the favorites array contains and id and if so removes it and updates the display
const deleteFavorite = (id) =>{
	if(favoriteIds.includes(id)){

		for(let i = 0; i < favoriteIds.length; i++){
			if(favoriteIds[i] === id){
				favoriteIds.splice(i, 1);
			}
		}

		refreshFavorites();
	}
}

//adds a new favorite id to the array and then recreates the favorites array based on that
const addToFavorite = (id) =>{
	favoriteIds.push(id);
	refreshFavorites(id);	
}

//checks if the selected POI is in the favorites array sets the enabled/disabled state of the favorite and delete buttons
const favoriteButtonsSetting = (id) =>{
	if(favoriteIds.includes(id)){
		favoriteButton.disabled = true; 
		deleteButton.disabled = false;
	}
	else{
		favoriteButton.disabled = false; 
		deleteButton.disabled = true;
	}
}

//sets button click functions
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

	favoriteButton = document.querySelector("#fav-btn");
	favoriteButton.onclick = () =>{
		addToFavorite(currentID);
		favoriteButtonsSetting(currentID);
	}

	deleteButton = document.querySelector("#delete-btn");
	deleteButton.onclick = () =>{
		deleteFavorite(currentID);
		favoriteButtonsSetting(currentID);
	}
	
}

//sets the favorites display panel based on the favoritsIds array
const refreshFavorites = () =>{
	const favoritesContainer = document.querySelector("#favorites-list");
	favoritesContainer.innerHTML = "";

	for(const id of favoriteIds){
		favoritesContainer.appendChild(createFavoriteElement(id));
	}

	//stores new favorites list
	storage.setFavorites(favoriteIds);
}


//gets the data for a POI in the geojson array
const getFeatureById = (id) =>
{
	return geojson.features.find(value => value.id == id);
}

//creates a new favorite element
const createFavoriteElement = (id) =>{
	const feature = getFeatureById(id);
	const a = document.createElement('a');
	a.className = "panel-block";
	a.id = feature.id;

	//when clicking on the favorite moves the map to it's position, sets the current ID, and state of the favorite/delete button
	a.onclick = () =>{
		showFeatureDetails(a.id);
		map.setZoomLevel(6);
		map.flyTo(feature.geometry.coordinates);
		currentID = id;
		favoriteButtonsSetting(id);
	};
	//sets a text to the feature's title, in this case the name of the park
	a.innerHTML = `<span class = "panel-icon">
					<i class = "fas fa-map-pin"></i>
	</span> ${feature.properties.title}
	`;

	return a;
}
//fills the information in the bottom details boxes using imported data
const showFeatureDetails = (id) => {
	console.log(`showFeatureDetails - id=${id}`);
	const feature = getFeatureById(id);
	document.querySelector("#details-1").innerHTML = `Info for ${feature.properties.title}`;

	//displays address phone url
	document.querySelector("#details-2").innerHTML = `Address: ${feature.properties.address}<br>
	Phone: ${feature.properties.phone}<br>
	Website: ${feature.properties.url}`;

	//displays description
	document.querySelector("#details-3").innerHTML = feature.properties.description;

	currentID = id;
	//move map cam to feature
	map.setZoomLevel(6);
	map.flyTo(feature.geometry.coordinates);
	
	favoriteButtonsSetting(id);
};


const init = () => {
	//import saved favorites
	favoriteIds = storage.getFavorites();

	//create map and UI
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