import * as main from "./main.js";

export let imageURL;

window.onload = ()=>{
	console.log("window.onload called");
	// 1 - do preload here - load fonts, images, additional sounds, etc...
	loadFromJSON();

	
	
}

//pulls in data from json file, parses it, and outputs it to the DOM
const loadFromJSON = () =>{
	const url = "data/av-data.json";
	const xhr = new XMLHttpRequest();

	xhr.onload = (e) =>{
		console.log(`In onload - HTTP status code = ${e.target.status}`);
		const string = e.target.responseText;
		console.log(e.target);

		const json = JSON.parse(string);

		document.querySelector("title").innerHTML = json.title;


		const trackSelect = document.querySelector("#track-select");
		let innerHTML;
		for(let i = 0; i < json.audioFiles.length; i++){
			innerHTML += `<option value="${json.audioFiles[i].file}">${json.audioFiles[i].trackName}</option>`
		}

		trackSelect.innerHTML = innerHTML;
		
		imageURL = json.imageURL

		//once data has been loaded calls init
		main.init();
	};
	xhr.onerror = e => console.log(`In onerror - HTTP status code = ${e.target.status}`);
	xhr.open("GET", url);
	xhr.send();
}

