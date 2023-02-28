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
 showGradient : true,
 showBars : true,
 showCircles : true,
 showNoise : true,
 showInvert : true,
 showEmboss : true

}

let visualizationType = "frequency"

// 1 - here we are faking an enumeration
const DEFAULTS = Object.freeze({
	sound1  :  "media/New Adventure Theme.mp3"
});

const init = () =>{
    audio.setupWebaudio(DEFAULTS.sound1);
	console.log("init called");
	console.log(`Testing utils.getRandomColor() import: ${utils.getRandomColor()}`);
	let canvasElement = document.querySelector("canvas"); // hookup <canvas> element
	setupUI(canvasElement);
    canvas.setupCanvas(canvasElement,audio.analyserNode);
    loop();
}

const setupUI = (canvasElement) =>{
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
    }
    console.log(`audioCtx.state after = ${audio.audioCtx.state}`);
    //if track is currently paused play it
    if(e.target.dataset.playing == "no"){
        audio.playCurrentSound();
        e.target.dataset.playing = "yes";
    }
    //if track is currently playing pause it
    else{
        audio.pauseCurrentSound();
        e.target.dataset.playing = "no";
    }
  }

  //hookup volume slider and label
  let volumeSlider = document.querySelector("#volume-slider");
  let volumeLabel = document.querySelector("#volume-label");

  //add oninput event
	volumeSlider.oninput = e =>{
        //set volume
        audio.setVolume(e.target.value);
        //update value of the label to match volume
        volumeLabel.innerHTML = Math.round((e.target.value/2 * 100));

    }
    //set value of label to match slider on set up
    volumeSlider.dispatchEvent(new Event("input"));

    //hookup track selector
    let trackSelect = document.querySelector("#track-select");

    trackSelect.onchange = e =>{
        audio.loadSoundFile(e.target.value);
        //pause the current track if it is playing
        if(playButton.dataset.playing == "yes"){
            playButton.dispatchEvent(new MouseEvent("click"));
        }
    }

    let gradientCheckBox = document.querySelector("#gradient-check");
    gradientCheckBox.onclick = e =>{
        
        drawParams.showGradient = e.target.checked;
       
    }
    
    gradientCheckBox.dispatchEvent(new Event("click"));
   
    let circleCheckBox = document.querySelector("#circles-check");
    circleCheckBox.onclick = e =>{
        
        drawParams.showCircles = e.target.checked;
       console.log(drawParams.showCircles);
    }
    
   circleCheckBox.dispatchEvent(new Event("click"));

   let barsCheckBox = document.querySelector("#bars-check");
    barsCheckBox.onclick = e =>{
        
        drawParams.showBars = e.target.checked;
       
    }
    
   barsCheckBox.dispatchEvent(new Event("click"));

   

    let noiseCheckBox = document.querySelector("#noise-check");
    noiseCheckBox.onclick = e =>{
        console.log(e.target.checked)
        drawParams.showNoise = e.target.checked;
       
    }
    noiseCheckBox.checked = false;
    noiseCheckBox.dispatchEvent(new Event("click"));

    let invertCheckBox = document.querySelector("#invert-check");
    invertCheckBox.onclick = e =>{
        console.log(e.target.checked)
        drawParams.showInvert = e.target.checked;
       
    }
    invertCheckBox.checked = false;
    invertCheckBox.dispatchEvent(new Event("click"));

    let embossCheckBox = document.querySelector("#emboss-check");
   embossCheckBox.onclick = e =>{
        
        drawParams.showEmboss = e.target.checked;
       
    }
    embossCheckBox.checked = false;
    embossCheckBox.dispatchEvent(new Event("click"));

    let frequencySelector = document.querySelector("#frequency-select");
    frequencySelector.checked = true;
    let waveformSelector = document.querySelector("#waveform-select");
    frequencySelector.onclick = () =>
    {
        visualizationType = "frequency";
        waveformSelector.checked = false;
    }

    
    waveformSelector.onclick = () =>{
        visualizationType = "waveform"
        frequencySelector.checked = false;
    }
} // end setupUI

const loop = () =>{
    /* NOTE: This is temporary testing code that we will delete in Part II */
        requestAnimationFrame(loop);
        canvas.draw(drawParams, visualizationType);
         /*
        // 1) create a byte array (values of 0-255) to hold the audio data
        // normally, we do this once when the program starts up, NOT every frame
        let audioData = new Uint8Array(audio.analyserNode.fftSize/2);
        
        // 2) populate the array of audio data *by reference* (i.e. by its address)
        audio.analyserNode.getByteFrequencyData(audioData);
        
        // 3) log out the array and the average loudness (amplitude) of all of the frequency bins
       
            console.log(audioData);
            
            console.log("-----Audio Stats-----");
            let totalLoudness =  audioData.reduce((total,num) => total + num);
            let averageLoudness =  totalLoudness/(audio.analyserNode.fftSize/2);
            let minLoudness =  Math.min(...audioData); // ooh - the ES6 spread operator is handy!
            let maxLoudness =  Math.max(...audioData); // ditto!
            // Now look at loudness in a specific bin
            // 22050 kHz divided by 128 bins = 172.23 kHz per bin
            // the 12th element in array represents loudness at 2.067 kHz
            let loudnessAt2K = audioData[11]; 
            console.log(`averageLoudness = ${averageLoudness}`);
            console.log(`minLoudness = ${minLoudness}`);
            console.log(`maxLoudness = ${maxLoudness}`);
            console.log(`loudnessAt2K = ${loudnessAt2K}`);
            console.log("---------------------");
            */
    }

export {init};