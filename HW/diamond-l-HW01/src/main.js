
	
	
	const words1 = ["Acute", "Aft", "Anti-matter", "Bipolar", "Cargo", "Command", "Communication", "Computer", "Deuterium", "Dorsal", "Emergency", "Engineering", "Environmental", "Flight", "Fore", "Guidance", "Heat", "Impulse", "Increased", "Inertial", "Infinite", "Ionizing", "Isolinear", "Lateral", "Linear", "Matter", "Medical", "Navigational", "Optical", "Optimal", "Optional", "Personal", "Personnel", "Phased", "Reduced", "Science", "Ship's", "Shuttlecraft", "Structural", "Subspace", "Transporter", "Ventral"];
	
	const words2 = ["Propulsion", "Dissipation", "Sensor", "Improbability", "Buffer", "Graviton", "Replicator", "Matter", "Anti-matter", "Organic", "Power", "Silicon", "Holographic", "Transient", "Integrity", "Plasma", "Fusion", "Control", "Access", "Auto", "Destruct", "Isolinear", "Transwarp", "Energy", "Medical", "Environmental", "Coil", "Impulse", "Warp", "Phaser", "Operating", "Photon", "Deflector", "Integrity", "Control", "Bridge", "Dampening", "Display", "Beam", "Quantum", "Baseline", "Input"];
	
	const words3 = ["Chamber", "Interface", "Coil", "Polymer", "Biosphere", "Platform", "Thruster", "Deflector", "Replicator", "Tricorder", "Operation", "Array", "Matrix", "Grid", "Sensor", "Mode", "Panel", "Storage", "Conduit", "Pod", "Hatch", "Regulator", "Display", "Inverter", "Spectrum", "Generator", "Cloud", "Field", "Terminal", "Module", "Procedure", "System", "Diagnostic", "Device", "Beam", "Probe", "Bank", "Tie-In", "Facility", "Bay", "Indicator", "Cell"];


   

    const generateTechno = (num) =>{
        
        
         let completeTechno = "";
         //loops the number of times specified by the parameter
         for(let i =0; i < num; i++)
         {
            //the three arrays all have the same length so the same index can be used for each
            let index = Math.floor(Math.random() * words1.length);

            let currentTecho = `${words1[index]} ${words2[index]} ${words3[index]}`;
            completeTechno += currentTecho;

            if(num > 1){
                completeTechno += " ";
            }
         }
         
         document.querySelector("#output").innerHTML = completeTechno; 
         
        //console.log("call");
    }

    const generateOne = () => generateTechno(1);
    

    const generateFive = () => generateTechno(5);

    const init = () =>{
        //get references to buttons
        const printOneButton = document.querySelector("#print-one-button");
        const printFiveButton = document.querySelector("#print-five-button");
        //calls print babble intially to have some starting text
        generateOne();
        //attaches printBable to the button's click event
        printOneButton.onclick = generateOne;
        printFiveButton.onclick = generateFive;

       


    }

    window.onload = init;

    
	
