import * as main from "./main.js";

export let imageURL;

window.onload = ()=>{
	console.log("window.onload called");
	// 1 - do preload here - load fonts, images, additional sounds, etc...
	loadFromJSON();
	
	
}


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
			//innerHTML += `<option value="media/New Adventure Theme.mp3" selected>New Adventure Theme</option>`
		}

		trackSelect.innerHTML = innerHTML;
		
		imageURL = json.imageURL

		//start up app when app is finished loading
		main.init();
	};
	xhr.onerror = e => console.log(`In onerror - HTTP status code = ${e.target.status}`);
	xhr.open("GET", url);
	xhr.send();
}