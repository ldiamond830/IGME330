//web component header using bulma for styling
const template = document.createElement("template");
    template.innerHTML = `
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bulma@0.9.4/css/bulma.min.css">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bulma@0.9.4/css/bulma.min.css">
    <header class="hero is-small is-primary is-bold p-2">
    <div class="hero-body">
      <div class = "container">
        <h1 class="title"></h1>
        <h2 class="subtitle"></h2>
      </div>
    </div>
  </header>`;

  class hero extends HTMLElement {
    // called when the component is first created, but before it is added to the DOM
    constructor(){
      super();
      this.title = "";
      this.subtitle= "";
      
      this.attachShadow({mode: "open"});
      this.shadowRoot.appendChild(template.content.cloneNode(true));
    }

    static get observedAttributes() {
        return ["data-title", "data-subtitle"];
      }
  
      connectedCallback(){
        this.render();
      }

      attributeChangedCallback(attributeName, oldValue, newValue) {
        
        if(oldValue === newValue) return;
        if(attributeName == "data-title"){
          this.title = newValue;
        }
        if(attributeName == "data-subtitle"){
          this.subtitle = newValue;
        }
        this.render();
    }

    render(){
        //this.innerHTML = `<span><a href="${this._url}">${this._text}</a></span>`;
        let title = this.shadowRoot.querySelector("h1");
        let subtitle = this.shadowRoot.querySelector("h2");
        if(title){
            title.textContent = this.title;
        }
        if(subtitle){
            subtitle.textContent = this.subtitle;
        }
      }


}

customElements.define('my-header', hero);

//export {hero}
