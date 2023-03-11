/*
	The purpose of this file is to take in the analyser node and a <canvas> element: 
	  - the module will create a drawing context that points at the <canvas> 
	  - it will store the reference to the analyser node
	  - in draw(), it will loop through the data in the analyser node
	  - and then draw something representative on the canvas
	  - maybe a better name for this file/module would be *visualizer.js* ?
*/

import * as utils from './utils.js';
import { imageURL } from './loader.js';
import { audioCtx } from './audio.js';

let ctx,canvasWidth,canvasHeight,gradient,analyserNode,audioData;
let sprites = [];
let img;
class hornSprite{
    static type = "triangle"; // demoing a static (class) variable here
    constructor(direction, translateX, translateY){
    
    this.counter = 0;
    this.hue = 0
    this.color = `hsl(${this.hue}, 100%, 10%)`
     Object.assign(this, {direction, translateX, translateY});
    }
    
    update(audioData){
        //color changes over time as the song continues
        this.hue += audioCtx.currentTime/255;
        //resets color
        if(this.hue >= 255)
        {
            this.hue = 0;
        }
        //saturation is controled by audio data
        let saturation = 40 + (audioData * 2);
        //caps saturation
        if(saturation > 100){
            saturation = 100;
        }

        this.color = `hsl(${this.hue}, ${saturation}%, 50%)`
    }
    
    draw(ctx, playing){
        //stops color change when not playing
        if(playing){
            ctx.save();
           
            
            //this.counter += audioCtx.currentTime
            //let percent = this.counter/255;
            //goes to new origin
            ctx.translate(this.translateX, this.translateY);
            //angles horns
            if(this.direction == "right"){
                ctx.rotate(-Math.PI/8);
            }
            else if(this.direction == "left"){
                ctx.rotate(Math.PI/8);
            }
            
            //draws the horn
            ctx.globalAlpha = 0.5;
            ctx.fillStyle = this.color;
            
            //ctx.lineWidth=2;
            ctx.beginPath();

            ctx.moveTo(30,110);
            ctx.lineTo(80,40);
            ctx.lineTo(130,110);
            
            ctx.closePath();
            
            ctx.fill();
            
            ctx.restore();
        }
       
    }
  }

  //loads in the image to be drawn to the screen
  const loadImage = (url) =>{
    img = new Image;
    img.onerror = _=>{
        console.log(`Image Error`);
      };
  
      
      img.src = url;

  }

const setupCanvas = (canvasElement,analyserNodeRef) =>{
	// create drawing context
	ctx = canvasElement.getContext("2d");
	canvasWidth = canvasElement.width;
	canvasHeight = canvasElement.height;
	// create a gradient that runs top to bottom
	gradient = utils.getLinearGradient(ctx,0,0,0,canvasHeight,[{percent:0,color:"blue"},{percent:.25,color:"green"},{percent:.5,color:"yellow"},{percent:.75,color:"red"},{percent:1,color:"magenta"}]);
	// keep a reference to the analyser node
	analyserNode = analyserNodeRef;
	// this is the array where the analyser data will be stored
	audioData = new Uint8Array(analyserNode.fftSize/2);
    sprites.push(new hornSprite("right", 0, 10));
    //sprites.push(new TriangleSprite(400, 110, 450, 40, 500, 110));
    sprites.push(new hornSprite("left", 650, -55));
    loadImage(imageURL);
}

const draw = (params={}, dataType) =>{
  //gets the audio data based on whether the user has selected frequency or waveform
    if(dataType == "frequency"){
         analyserNode.getByteFrequencyData(audioData);
    }
    else{ 
        analyserNode.getByteTimeDomainData(audioData);
    }
	
	


	// 2 - draw background
	ctx.save();
    ctx.drawImage(img, 0, 0, canvasWidth, canvasHeight);
    ctx.restore()
		
   
        //sprite update
        if(params.horns){
            for(let i = 0; i < audioData.length; i++){
                sprites[0].update(audioData[i], audioData[i]);
                sprites[0].draw(ctx, params.playing);
                sprites[1].update(audioData[i], audioData[i]);
                sprites[1].draw(ctx, params.playing);
            
            
            }
        }
        
       
        //eye background that grows and shrinks based on audio data
        if(params.backEyes){
            for(let i = 0; i < audioData.length; i++){
            ctx.save()
            ctx.beginPath();
            ctx.fillStyle = 'white';
            ctx.moveTo(300, 230);
            ctx.lineTo(325, 190);
            ctx.lineTo(300, 120);
            ctx.lineTo(315 - audioData[i] / 2, 190 - audioData[i] / 2);
            ctx.closePath();
            ctx.fill();

            ctx.beginPath();
            ctx.moveTo(500, 230);
            ctx.lineTo(475, 190);
            ctx.lineTo(500, 120);
            ctx.lineTo(485 + audioData[i] / 2, 190 - audioData[i] / 2);
            ctx.closePath();
            ctx.fill();
            ctx.restore()
            }
        }

        //arc that varies based on audio data to look like eyes opening
        if(params.frontEyes){
            for(let i = 0; i < audioData.length; i++){
                ctx.save();
                    ctx.fillStyle = `red`
                    ctx.beginPath();
                    ctx.moveTo(225, 150);             	// P0
                    ctx.arcTo(275, 150 - audioData[i] / 8, 326, 150, 120); 	// P1, P2 and the radius
                    ctx.lineTo(325, 150);               // top line: line segment between P0 & P2     
                    ctx.closePath();          
                    ctx.fill(); 
                    
                   
                    ctx.beginPath();
                    ctx.moveTo(475, 150);             	// P0
                    ctx.arcTo(525, 150 - audioData[i] / 8, 575, 150, 120); 	// P1, P2 and the radius
                    ctx.lineTo(575, 150);               // top line: line segment between P0 & P2     
                    ctx.closePath();          
                    ctx.fill(); 
                    ctx.restore();
              
                }
        }
        
       
      // changed bars from the start code to follow a more parabolic shape to look like many teeth moving up and down
	if(params.showBars){
        let barSpacing = 4;
        let margin = 5;
        let screenWidthForBars = canvasWidth - (audioData.length * barSpacing) - margin * 2;
        let barWidth = screenWidthForBars / audioData.length;
        let maxBarHeight = 10;
        let topSpacing = 100;
        
        ctx.save();
        ctx.fillStyle = `rgba(255,255,255,0.5)`;
        ctx.strokeStyle = `rgba(0,0,0,0.5)`;
        //loop through data and draw
        for(let i = 0; i < audioData.length; i++){
            let temp =  -1 * (i - (audioData.length/2)) * (i - (audioData.length/2));
            ctx.fillRect(margin + i * (barWidth * barSpacing), canvasHeight, barWidth, -1 * (maxBarHeight - temp / 50 + audioData[i]/ 5) - i);
            ctx.strokeRect(margin + i * (barWidth * barSpacing), canvasHeight, barWidth, -1 * (maxBarHeight - temp / 50 + audioData[i]/ 5) - i);
        }
        ctx.restore();
    }
        /* unused code from starter
	// 3 - draw gradient
    if(params.showGradient){
        ctx.save()
        ctx.fillStyle = gradient;
        ctx.globalAlpha = 0.3;
        ctx.fillRect(0,0,canvasWidth,canvasHeight);
        ctx.restore();
    }
	
	
	// 5 - draw circles
    if(params.showCircles){
        let maxRadius = canvasHeight / 4;
        ctx.save();
        ctx.globalAlpha = 0.5;
        for(let i =0; i < audioData.length; i++){
            //red-ish circles
            let percent= audioData[i] / 255;

            let circleRadius = percent * maxRadius;

            ctx.beginPath();
            ctx.fillStyle = utils.makeColor(255, 111, 111, 0.34 - percent/3.0);
            ctx.arc(canvasWidth/2, canvasHeight/2, circleRadius, 0, Math.PI * 2, false);
            ctx.fill();
            ctx.closePath();

            //bigger more transparent blueish circles
            ctx.beginPath();
            ctx.fillStyle = utils.makeColor(0,0,255, .10 - percent/10.0 );
            ctx.arc(canvasWidth/2, canvasHeight/2, circleRadius * 1.5, 0, Math.PI * 2, false);
            ctx.fill()
            ctx.closePath();

            
            //smaller yellow circles
            ctx.save();
            ctx.beginPath();
            ctx.fillStyle = utils.makeColor(200, 200, 0, .5 - percent/5.0);
            ctx.arc(canvasWidth/2, canvasHeight/2, circleRadius * 0.5, 0, Math.PI * 2, false);
            ctx.fill();
            ctx.closePath()
            ctx.restore();

        }

        ctx.restore()
    }
*/
    
    
    // 6 - bitmap manipulation
	// TODO: right now. we are looping though every pixel of the canvas (320,000 of them!), 
	// regardless of whether or not we are applying a pixel effect
	// At some point, refactor this code so that we are looping though the image data only if
	// it is necessary

	// A) grab all of the pixels on the canvas and put them in the `data` array
	// `imageData.data` is a `Uint8ClampedArray()` typed array that has 1.28 million elements!
	// the variable `data` below is a reference to that array 
	let imageData = ctx.getImageData(0,0,canvasWidth, canvasHeight);
    let data = imageData.data;
    let length = data.length;
    let width = imageData.width;


    
	// B) Iterate through each pixel, stepping 4 elements at a time (which is the RGBA for 1 pixel)
    for(let i = 0; i < length; i+=4){
		// C) randomly change every 20th pixel to red
        if(params.showNoise && Math.random() < .05){

        
			// data[i] is the red channel
			// data[i+1] is the green channel
			// data[i+2] is the blue channel
			// data[i+3] is the alpha channel
			data[i] = data[i + 1]  = data[i+2] = 0;// zero out the red and green and blue channels
			data[i + 1] = 255;// make the green channel 100% 
		} // end if
        //invert
    if(params.showInvert){
        let red = data[i], green = data[i + 1], blue = data[i + 2];
        data[i] = 255 - red;
        data [i + 1] = 255 - green;
        data[i + 2] = 255 - blue;
         
    }
	} // end for

    if(params.showEmboss){
        for(let i = 0; i < length; i++){
            if(i%4 == 3) continue; // skip alpha channel

            data[i] = 127 + 2 * data[i] - data[i +4] - data[i + width * 4]
        }
    }
	
	// D) copy image data back to canvas
    ctx.putImageData(imageData,0,0);

    
}

export {setupCanvas,draw};