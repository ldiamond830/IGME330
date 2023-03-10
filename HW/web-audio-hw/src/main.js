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

// 1 - here we are faking an enumeration
const DEFAULTS = Object.freeze({
	sound1  :  "media/Judgement - Kensuke Ushio.mp3"
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

    //hookup volume slider and label
  let bassSlider = document.querySelector("#bass-slider");
  let bassLabel = document.querySelector("#bass-label");

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
        if(playButton.dataset.playing == "yes"){
            playButton.dispatchEvent(new MouseEvent("click"));
        }
    }

    let gradientCheckBox = document.querySelector("#gradient-check");
    gradientCheckBox.onclick = e =>{
        
        drawParams.backEyes = e.target.checked;
       
    }
    
    gradientCheckBox.dispatchEvent(new Event("click"));
   
    let circleCheckBox = document.querySelector("#circles-check");
    circleCheckBox.onclick = e =>{
        
        drawParams.frontEyes = e.target.checked;
       console.log(drawParams.frontEyes);
    }

    let hornsCheckBox = document.querySelector("#horns-check");
    hornsCheckBox.onclick = e =>{
        
        drawParams.horns = e.target.checked;
       console.log(drawParams.horns);
    }
    
   hornsCheckBox.dispatchEvent(new Event("click"));

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
    //called 60 times per second draws visualizer based on params
        setTimeout(loop, 1/60);
        canvas.draw(drawParams, visualizationType);
        
    }

export {init};