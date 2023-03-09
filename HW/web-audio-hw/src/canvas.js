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
class TriangleSprite{
    static type = "triangle"; // demoing a static (class) variable here
    constructor(x1,y1,x2,y2,x3,y3){
    this.x1Origin = x1;
    this.y2Origin = y2;
    this.x3Origin = x3
    this.counter = 0;
     Object.assign(this, {x1, y1, x2, y2, x3, y3});
    }
    
    update(audioData){
      this.x1 = this.x1Origin - (audioData / 6);
      this.x3 = this.x3Origin + (audioData / 6);
      //this.y2 = this.y2Origin - (audioData / 6);
    }
    
    draw(ctx, playing){
        if(playing){
            ctx.save();
            ctx.rotate(-Math.PI/8);
            this.counter += audioCtx.currentTime
            let percent = this.counter/255;
            
            ctx.globalAlpha = 0.5;
            ctx.strokeStyle= this.color;
        
            ctx.fillStyle = `hsl(${percent}, 100%,50%)`;
            
            ctx.lineWidth=2;
            ctx.beginPath();
            ctx.moveTo(this.x1,this.y1);
            ctx.lineTo(this.x2,this.y2);
            ctx.lineTo(this.x3,this.y3);
            ctx.fill();
            
            ctx.restore();
        }
       
    }
  }

  const preloadImage = (url) =>{
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
    sprites.push(new TriangleSprite(30, 110, 80, 40, 130,110));
    sprites.push(new TriangleSprite(400, 110, 450, 40, 500, 110));
    preloadImage(imageURL);
}

const draw = (params={}, dataType) =>{
  // 1 - populate the audioData array with the frequency data from the analyserNode
	// notice these arrays are passed "by reference" 
    if(dataType == "frequency"){
         analyserNode.getByteFrequencyData(audioData);
    }
    else{ 
        analyserNode.getByteTimeDomainData(audioData);
    }
	// OR
	//analyserNode.getByteTimeDomainData(audioData); // waveform data
	


	// 2 - draw background
	ctx.save();
    ctx.drawImage(img, 0, 0, canvasWidth, canvasHeight);
    ctx.restore()
		
   

        for(let i = 0; i < audioData.length; i++){

          

            sprites[0].update(audioData[i], audioData[i]);
            sprites[0].draw(ctx, params.playing);
            sprites[1].update(audioData[i], audioData[i]);
            sprites[1].draw(ctx, params.playing);
            

            ctx.save()
            ctx.beginPath();
            ctx.fillStyle = 'red';
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


        ctx.save();
        ctx.globalCompositeOperation = "source-atop"; 
        ctx.fillStyle = "green"
        ctx.beginPath();
        ctx.moveTo(250, 175);             	// P0
        ctx.arcTo(300, 175 - audioData[i] / 10, 350, 175, 120); 	// P1, P2 and the radius
        ctx.lineTo(350, 175);               // top line: line segment between P0 & P2     
        ctx.closePath();          
        ctx.fill(); 
        ctx.restore();

        ctx.save();
        ctx.globalCompositeOperation = "source-atop"; 
        ctx.fillStyle = "green"
        ctx.beginPath();
        ctx.moveTo(450, 175);             	// P0
        ctx.arcTo(500, 175 - audioData[i] / 10, 550, 175, 120); 	// P1, P2 and the radius
        ctx.lineTo(550, 175);               // top line: line segment between P0 & P2     
        ctx.closePath();          
        ctx.fill(); 
        ctx.restore();
        }
       



        
      
        
       
      
	// 3 - draw gradient
    if(params.showGradient){
        ctx.save()
        ctx.fillStyle = gradient;
        ctx.globalAlpha = 0.3;
        ctx.fillRect(0,0,canvasWidth,canvasHeight);
        ctx.restore();
    }
	
	// 4 - draw bars
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