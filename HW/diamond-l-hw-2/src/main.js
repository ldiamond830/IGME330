/*
	main.js is primarily responsible for hooking up the UI to the rest of the application 
	and setting up the main event loop
*/

// We will write the functions in this file in the traditional ES5 way
// In this instance, we feel the code is more readable if written this way
// If you want to re-write these as ES6 arrow functions, to be consistent with the other files, go ahead!

import * as utils from './utils.js';
import * as audio from './audio.js';
import * as canvas from './canvas.js';

const drawParams = {
    horns: true,
 backEyes : true,
 showBars : true,
 frontEyes : true,
 showNoise : true,
 showInvert : true,
 showEmboss : true,
 playing : false

}

let visualizationType = "frequency"


let volumeSlider;
let volumeLabel;
let bassSlider;
let bassLabel;

//object holding data and methods for datGUI
const controllerObject = {

_track : "media/Judgement - Kensuke Ushio.mp3",
_visualizationType : "frequency",
_volume : 1,
_lowPass : 0.25,
_highPass: 0.25,
_showBackEyes : true,
_showHorns : true,
_showFrontEyes : true,
_showMouth : true,
_showNoise : true,
_showInvert : true,
_showEmboss : true,

//checkbox get and set -ers
get showBackEyes(){
    return this._showBackEyes
},

set showBackEyes(value){
    this._showBackEyes = value;
    drawParams.backEyes = this._showBackEyes
},

get showFrontEyes(){
    return this._showFrontEyes
},

set showFrontEyes(value){
    this._showFrontEyes = value;
    drawParams.frontEyes = this._showFrontEyes
},


get showMouth(){
    return this._showMouth;
},

set showMouth(value){
    this._showMouth = value;
    
    drawParams.showBars = this._showMouth
},

get showHorns(){
    return this._showHorns;
},

set showHorns(value){
    this._showHorns = value;
    drawParams.horns = this._showHorns
},

get showNoise(){
    return this._showNoise;
},

set showNoise(value){
    this._showNoise = value;
    drawParams.showNoise = this._showNoise
},

get showInvert(){
    return this._showInvert;
},

set showInvert(value){
    this._showInvert = value;
    //invertCheckBox.checked = value;
    drawParams.showInvert = this._showInvert;
},

get showEmboss(){
    return this._showEmboss;
},

set showEmboss(value){
    this._showEmboss = value;
    drawParams.showEmboss = this._showEmboss;
},

//slider controlers
get volume(){
    return this._volume;
},

set volume(value){
    this._volume = value;
    audio.setVolume(this._volume);
},

get lowPass(){
    return this._lowPass;
},

set lowPass(value){
    this._lowPass = value;
    audio.bassNode.gain.setValueAtTime(this._lowPass/2 * 100, audio.audioCtx.currentTime);
    //bassSlider.value = value;
    //bassLabel.innerHTML = Math.round((e.target.value/2 * 400));
},

get highPass(){
    return this._highPass;
},

set highPass(value){
    this._highPass = value;
    audio.trebleNode.gain.setValueAtTime(this._highPass/2 * 100, audio.audioCtx.currentTime);
},

//drop down menus
get track(){
    return this._track;

},

set track(value){
    this._track = value;
    audio.loadSoundFile(this._track);
    
    if(drawParams.playing){
        audio.playCurrentSound();
        
        drawParams.playing = true;
    }
},

get visualizationType(){
    return this._visualizationType;
},

set visualizationType(value){
    this._visualizationType = value;
    visualizationType = this._visualizationType;
},


//buttons
play(){
   playAudio()
},

pause(){
    pauseAudio();
},

fullscreen(){
    utils.goFullscreen(document.documentElement);
}


}
  



// 1 - here we are faking an enumeration
const DEFAULTS = Object.freeze({
	sound1  :  "media/Judgement - Kensuke Ushio.mp3"
});

const init = (audioFiles) =>{
    audio.setupWebaudio(DEFAULTS.sound1);
	console.log("init called");
	console.log(`Testing utils.getRandomColor() import: ${utils.getRandomColor()}`);
	let canvasElement = document.querySelector("canvas"); // hookup <canvas> element
    audio.loadSoundFile(DEFAULTS.sound1);
	setupUI(canvasElement, audioFiles);
    canvas.setupCanvas(canvasElement,audio.analyserNode);
    loop();
}

const setupUI = (canvasElement, audioFiles) =>{

    //initializing dat GUI
    const gui = new dat.GUI({ width: 400 });
	gui.close();

    //buttons
    gui.add(controllerObject, 'play').name("Play");
    gui.add(controllerObject, 'pause').name("Pause");
    gui.add(controllerObject, 'fullscreen').name("Fullscreen");

    
    let trackList = {}

    //compiles the tracklist loaded in from the json file into an object literal which is passed into the dropdown menu
    for(let track of audioFiles){
        let newTrack = track.trackName
        trackList[newTrack] = track.file
    }

    //drop down menus
    gui.add(controllerObject, 'track', trackList ).name('Track');
    gui.add(controllerObject, 'visualizationType', { Frequency: "frequency", WaveLength: "waveLength"} ).name('Visualization Type');

    //sliders
    gui.add(controllerObject, 'volume').min(0).max(2).step(0.1).name('Volume');
    gui.add(controllerObject, 'lowPass').min(0).max(1).step("0.01").name('Low Pass Filter');
    gui.add(controllerObject, 'highPass').min(0).max(1).step("0.01").name('High Pass Filter');

    //check boxes
    gui.add(controllerObject, 'showBackEyes').name("Show Back Eyes");
    gui.add(controllerObject, 'showFrontEyes').name("Show Front Eyes");
    gui.add(controllerObject, 'showMouth').name("Show Mouth");
    gui.add(controllerObject, 'showHorns').name("Show Horns");
    gui.add(controllerObject, 'showNoise').name("Show Noise");
    gui.add(controllerObject, 'showInvert').name("Show Invert");
    gui.add(controllerObject, 'showEmboss').name("Show Emboss");




//initializing DOM controls
  // A - hookup fullscreen button
  const fsButton = document.querySelector("#fs-button");
  const playButton = document.querySelector("#play-button");

  // add .onclick event to button
  fsButton.onclick = e => {
    console.log("init called");
    utils.goFullscreen(canvasElement);
  };

  playButton.onclick = e =>{
    console.log(`audioCtx.state before = ${audio.audioCtx.state}`);

    //check if context is in suspended state
    if(audio.audioCtx.state == "suspended"){
        audio.audioCtx.resume();
        drawParams.playing = true;
    }
    console.log(`audioCtx.state after = ${audio.audioCtx.state}`);
    //if track is currently paused play it
    if(e.target.dataset.playing == "no"){
        audio.playCurrentSound();
        e.target.dataset.playing = "yes";
        drawParams.playing = true;
       
    }
    //if track is currently playing pause it
    else{
        audio.pauseCurrentSound();
        e.target.dataset.playing = "no";
        drawParams.playing = false;
        
    }
  }

  //hookup volume slider and label
  volumeSlider = document.querySelector("#volume-slider");
  volumeLabel = document.querySelector("#volume-label");

  //add oninput event
	volumeSlider.oninput = e =>{
        //set volume
        audio.setVolume(e.target.value);
        //update value of the label to match volume
        volumeLabel.innerHTML = Math.round((e.target.value/2 * 100));

    }
    //set value of label to match slider on set up
    volumeSlider.dispatchEvent(new Event("input"));

    //hookup volume slider and label
    bassSlider = document.querySelector("#bass-slider");
    bassLabel = document.querySelector("#bass-label");

  //add oninput event
	bassSlider.oninput = e =>{
        //set volume
        audio.bassNode.gain.setValueAtTime(e.target.value/2 * 100, audio.audioCtx.currentTime);
        //update value of the label to match volume
        bassLabel.innerHTML = Math.round((e.target.value/2 * 400));

    }
    //set value of label to match slider on set up
    bassSlider.dispatchEvent(new Event("input"));

      //hookup volume slider and label
  let trebleSlider = document.querySelector("#treble-slider");
  let trebleLabel = document.querySelector("#treble-label");

  //add oninput event
  trebleSlider.oninput = e =>{
        //set volume
        audio.trebleNode.gain.setValueAtTime(e.target.value/2 * 100, audio.audioCtx.currentTime);
        //update value of the label to match volume
        trebleLabel.innerHTML = Math.round((e.target.value/2 * 400));

    }
    //set value of label to match slider on set up
    trebleSlider.dispatchEvent(new Event("input"));

    //hookup track selector
    let trackSelect = document.querySelector("#track-select");

    trackSelect.onchange = e =>{
        audio.loadSoundFile(e.target.value);
        //pause the current track if it is playing
        if(drawParams.playing == true){
            audio.playCurrentSound();
            drawParams.playing = true;
        }
    }
    
    let backEyesCheckBox = document.querySelector("#back-eyes-check");
    backEyesCheckBox.onclick = e =>{
        
        drawParams.backEyes = e.target.checked;
       
    }
    backEyesCheckBox.checked = true;
    backEyesCheckBox.dispatchEvent(new Event("click"));
   
    let frontEyesCheckBox = document.querySelector("#front-eyes-check");
    frontEyesCheckBox.onclick = e =>{
        
        drawParams.frontEyes = e.target.checked;
       console.log(drawParams.frontEyes);
    }
    frontEyesCheckBox.checked = true;
    frontEyesCheckBox.dispatchEvent(new Event("click"));

    let hornsCheckBox = document.querySelector("#horns-check");
    hornsCheckBox.onclick = e =>{
        
        drawParams.horns = e.target.checked;
       console.log(drawParams.horns);
    }
    hornsCheckBox.checked = true;
   hornsCheckBox.dispatchEvent(new Event("click"));

   let barsCheckBox = document.querySelector("#bars-check");
    barsCheckBox.onclick = e =>{
        
        drawParams.showBars = e.target.checked;
       
    }
    barsCheckBox.checked = true;
   barsCheckBox.dispatchEvent(new Event("click"));

   

    let noiseCheckBox = document.querySelector("#noise-check");
    noiseCheckBox.onclick = e =>{
        console.log(e.target.checked)
        drawParams.showNoise = e.target.checked;
       
    }
    noiseCheckBox.checked = true;
    noiseCheckBox.dispatchEvent(new Event("click"));

    let invertCheckBox = document.querySelector("#invert-check");
    invertCheckBox.onclick = e =>{
        console.log(e.target.checked)
        drawParams.showInvert = e.target.checked;
       
    }
    invertCheckBox.checked = true;
    invertCheckBox.dispatchEvent(new Event("click"));

    let embossCheckBox = document.querySelector("#emboss-check");
   embossCheckBox.onclick = e =>{
        
        drawParams.showEmboss = e.target.checked;
        gui
        controllerObject.showEmboss = e.target.checked;
       
    }
    embossCheckBox.checked = true;
    embossCheckBox.dispatchEvent(new Event("click"));

    let visualizationTypeSelector = document.querySelector("#visualization-type");
    visualizationTypeSelector.onchange = e =>{
        visualizationType = e.target.value;
    }
    
    
} // end setupUI

const loop = () =>{
    //called 60 times per second draws visualizer based on params
        setTimeout(loop, 1/60);
        canvas.draw(drawParams, visualizationType);
        
    }

export {init};

//helper methods for play and pause buttons
const playAudio = () =>{
    //if track is currently paused play it
    if(drawParams.playing == false){
        audio.playCurrentSound();
        //e.target.dataset.playing = "yes";
        drawParams.playing = true;
       
    }
     //check if context is in suspended state
     if(audio.audioCtx.state == "suspended"){
        audio.audioCtx.resume();
        drawParams.playing = true;
    }
    console.log(`audioCtx.state after = ${audio.audioCtx.state}`);
    
}

const pauseAudio = () =>{
    if(drawParams.playing == true){
        audio.pauseCurrentSound();
        //e.target.dataset.playing = "no";
        drawParams.playing = false;
    }
}