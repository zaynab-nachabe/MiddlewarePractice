class FooterComponent extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.render();
    }

    render() {
        // Load the template
        const template = document.createElement('template');
        template.innerHTML = `
            <style>
                .footer {
                    position: fixed;
                    bottom: 0;
                    left: 0;
                    width: 100%;
                    background-color: transparent;
                    border-top: 2px solid var(--block-separator-color, #d9d9d9);
                    z-index: 1000;
                    height: 50px;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    box-sizing: border-box;
                }
                
                .footer p {
                    margin: 0;
                    color: var(--main-text-color, #363636);
                    font-size: 16px;
                }
            </style>
            <div class="footer">
                <p>Zaynab Nachabe pour Polytech Nice-Sophia - 2025</p>
            </div>
        `;
        
        // Append the template content to the shadow DOM
        this.shadowRoot.appendChild(template.content.cloneNode(true));
    }
}

// Define the custom element
customElements.define('footer-component', FooterComponent);