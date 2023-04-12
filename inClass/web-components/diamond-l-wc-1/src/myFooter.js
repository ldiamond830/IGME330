class myFooter extends HTMLElement{
    constructor(){
        super();
        this.name = "placeholder";
        this.year = 0;
    }

    static get observedAttributes(){
        return["data-name", "data-year"]
    }

    connectedCallback(){
        this.render();
      }
  
      attributeChangedCallback(attributeName, oldValue, newValue){
        console.log(attributeName, oldValue, newValue);
  
        if(oldValue === newValue) return;
  
        if(attributeName == "data-name"){
          this.name = newValue;
        }
        else if(attributeName == "data-year"){
            this.year = newValue;
        }
          
          this.render();
      }
      
      render(){
        this.innerHTML = `© ${this.year} ${this.name}`
      }



}

customElements.define('my-footer', myFooter);