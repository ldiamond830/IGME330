    import {randomElement} from "./utils.js";
	
	
	let words1;
	
	let words2;
	
	let words3;


   
    //generates a 3 word technobabble phrase as many times as specified by the parameter and outputs to the HTML element
    const generateTechno = (num) =>{
        
        
         let completeTechno = "";
         //loops the number of times specified by the parameter
         for(let i =0; i < num; i++)
         {
            //the three arrays all have the same length so the same index can be used for each
            let index = randomElement(words1.length);

            let currentTecho = `${words1[index]} ${words2[index]} ${words3[index]}<br>`;
            completeTechno += currentTecho;

            
         }
         
         document.querySelector("#output").innerHTML = completeTechno; 
         
        //console.log("call");
    }


    //gets data from external JSON file and parses it to be stored in the three arrays
    const populateArrays = () =>{
        const url = "data/babble.json";
        const xhr = new XMLHttpRequest();

        xhr.onload = (e) =>{
            console.log(`In onload - HTTP status code = ${e.target.status}`);
            const json = e.target.responseText;

            //converts Json to string
            const jsonString = JSON.parse(json);

            words1 = jsonString.words1;
            words2 = jsonString.words2;
            words3 = jsonString.words3;


            //calls method on load to have some starting text
            generateOne();
        };
        xhr.onerror = e => console.log(`In onerror - HTTP status code = ${e.target.status}`);
        xhr.open("GET", url);
        xhr.send();

        

    }

    //wrapper functions for calling generate techno with different parameters
    const generateOne = () => generateTechno(1);
    

    const generateFive = () => generateTechno(5);

    const init = () =>{
        //get references to buttons
        const printOneButton = document.querySelector("#print-one-button");
        const printFiveButton = document.querySelector("#print-five-button");

        //pulls data from arrays and prints initial babble to the page
        populateArrays();

        

        //attaches printBable to the button's click event
        printOneButton.onclick = generateOne;
        printFiveButton.onclick = generateFive;

       


    }

    init();

    
	
