//template and componeent for footer
const footerTemplate = document.createElement("template");
    footerTemplate.innerHTML = `
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bulma@0.9.4/css/bulma.min.css">
	<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" crossorigin="anonymous" referrerpolicy="no-referrer">
    <div class="footer has-background-info has-text-centered has-text-light p-1">&copy;<slot name = "year"></slot> <slot name = "title"></slot></div>
    `;

    class componentFooter extends HTMLElement{
      constructor(){
        super();
        this.attachShadow({mode: "open"});
        this.shadowRoot.appendChild(footerTemplate.content.cloneNode(true));
      }
    }

  customElements.define('component-footer', componentFooter);