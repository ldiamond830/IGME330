import * as map from "./map.js"
import * as ajax from "./ajax.js"

let poi;

const loadPOI = () =>{
  const url = "https://people.rit.edu/~acjvks/shared/330/igm-points-of-interest.php"

  const poiLoaded = (jsonString) =>{
    poi = JSON.parse(jsonString);
    console.log(poi);

    for(let p of poi){
      map.addMarker(p.coordinates, p.title, "A POI!", "poi")
    }
  }

  ajax.downloadFile(url, poiLoaded)
}

const setupUI = () =>{
  // it's easy to get [longitude,latitude] coordinates with this tool: http://geojson.io/
  const lnglatRIT = [-77.67454147338866, 43.08484339838443];
  const lnglatIGM = [-77.67990589141846, 43.08447511795301];

  const btn1 = document.querySelector("#btn-1");
  const btn2 = document.querySelector("#btn-2");
  const btn3 = document.querySelector("#btn-3");
  const btn4 = document.querySelector("#btn-4");
  const btn5 = document.querySelector("#btn-5");

  btn1.onclick = () =>{
    map.setZoomLevel(15.5);
    map.setPitchandBearing(0,0);
    map.flyTo(lnglatRIT);
  }
  btn2.onclick = () =>{
    map.setZoomLevel(15.5);
    map.setPitchandBearing(45,0);
    map.flyTo(lnglatRIT);
  }
  btn3.onclick = () =>{
    map.setZoomLevel();
    map.setPitchandBearing(0,0);
    map.flyTo();
  }
  btn4.onclick = () =>{
    map.setZoomLevel(18);
    map.setPitchandBearing(0,0);
    map.flyTo(lnglatIGM);
  }
  btn5.onclick = () =>{
    if(!poi){
      loadPOI();
    }
  }
}

const init = () => {
map.initMap();
map.loadMarkers();
map.addMarkersToMap();
setupUI();
}



export {init}