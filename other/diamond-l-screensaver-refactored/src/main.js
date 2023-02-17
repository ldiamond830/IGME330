
		import { getRandomColor, getRandomInt } from "./utils.js";
        import { drawRectangle, drawArc, drawLine } from "./canvas-utils.js";
        let ctx; 
		let paused = false;
		let canvas;
		let createRectangles = true;
		let createArcs = true;
		let createLines = true;
	
		function init(){
			console.log("page loaded!");
			// #2 Now that the page has loaded, start drawing!
			
			// A - `canvas` variable points at <canvas> tag
			canvas = document.querySelector("canvas");
			
			// B - the `ctx` variable points at a "2D drawing context"
			ctx = canvas.getContext("2d");
			
			// C - all fill operations are now in red
			//ctx.fillStyle = "green"; 
            //ctx.fillStyle = "#00FF00";
            //ctx.fillStyle= "#0F0";
            
			
			
			// D - fill a rectangle with the current fill color
			//rectangles
			drawRectangle(ctx, 20, 20, 640, 440, "rgba(0,255,0,1)")
			drawRectangle(ctx, 120, 120, 400, 300, "red");
			drawRectangle(ctx, 120,120, 400, 300, "red", 10, "magenta");
            
           

			//lines
			drawLine(ctx,20,20,620,460,10,"magenta");
			drawLine(ctx,620,20,20,460,10,"magenta");
			drawLine(ctx,0,0,600,0,20,"yellow");
		

			
			//arcs
			drawArc(ctx, 320, 230, 50, 'blue', 5, 'black')
			drawArc(ctx, 320, 240, 30, 'black', 5, 'teal',  0, Math.PI);
			drawArc(ctx, 300, 215, 10, 'black', 5, 'teal');
			drawArc(ctx,335,215,10, 'black', 5, 'teal');

			
			setupUI();
            update();
			

		}

		//event handelers
		const canvasClicked = (e) =>{
		let rect = e.target.getBoundingClientRect();
		let mouseX = e.clientX - rect.x;
		let mouseY = e.clientY - rect.y;
		console.log(mouseX,mouseY);

		for(let i = 0; i < 10; i++){
			let x = getRandomInt(-100, 100) + mouseX;
			let y = getRandomInt(-100, 100) + mouseY;
			let radius = getRandomInt(20,50);
			let height = getRandomInt(20,50);
			let color = getRandomColor();
			drawArc(ctx, x, y, radius, color);
		}
		}

		


		//utility funtctions
		const setupUI = () =>{
			document.querySelector("#btn-pause").onclick = () =>{
				paused = true;
			}
			document.querySelector("#btn-play").onclick = () =>{
				if(paused){
				paused = false;
				update();
				}
				
			}
			document.querySelector("#btn-clear").onclick = () =>{
				ctx.save();
				ctx.fillStyle = 'white'
				ctx.beginPath();
				ctx.fillRect(0, 0, 640, 480);
				ctx.closePath();
				
			}

			document.querySelector("#cb-rectangles").onclick = (e) =>{
				createRectangles = e.target.checked;
			}
			document.querySelector("#cb-circles").onclick = (e) =>{
				createArcs = e.target.checked;
			}
			document.querySelector("#cb-lines").onclick = (e) =>{
				createLines= e.target.checked;
			}

			canvas.onclick = canvasClicked;
		}
		
       

        const drawRandomRect = (ctx) =>{
			
			drawRectangle(ctx,getRandomInt(0, 640), getRandomInt(0, 480), getRandomInt(10, 90), getRandomInt(10, 90), getRandomColor(), getRandomInt(2,12), getRandomColor())
        }

		const drawRandomArc = (ctx) =>{
			drawArc(ctx, getRandomInt(0,640), getRandomInt(0,480), getRandomInt(10,90), getRandomColor(), 
			getRandomInt(2,12), getRandomColor(), getRandomInt(0, Math.PI), getRandomInt(Math.PI + 1, Math.PI *2));
		}

		const drawRandomLine = (ctx) => {
			drawLine(ctx, getRandomInt(0,640), getRandomInt(0,480), getRandomInt(0,640), getRandomInt(0,480), getRandomInt(1, 20), getRandomColor())
		}

        function update(){
			if(paused) return;

            requestAnimationFrame(update);
            if(createRectangles) drawRandomRect(ctx);
			if(createArcs) drawRandomArc(ctx);
			if(createLines) drawRandomLine(ctx);
        }

        init();