class ButtonComponent extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.text = this.getAttribute('text') || 'Submit';
        this.type = this.getAttribute('type') || 'primary'; // primary, secondary
        this.size = this.getAttribute('size') || 'medium'; // small, medium, large
        
        this.render();
        this.setupEventListeners();
    }

    render() {
        const template = document.createElement('template');
        template.innerHTML = `
            <style>
                .button {
                    display: inline-block;
                    font-weight: 500;
                    text-align: center;
                    border: none;
                    padding: 12px 24px;
                    border-radius: 6px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    font-size: 16px;
                    margin: 10px 0;
                }
                
                /* Types */
                .primary {
                    background-color: var(--secondary-color, #4768cb);
                    color: white;
                }
                
                .secondary {
                    background-color: transparent;
                    color: var(--secondary-color, #4768cb);
                    border: 2px solid var(--secondary-color, #4768cb);
                }
                
                /* Sizes */
                .small {
                    padding: 8px 16px;
                    font-size: 14px;
                }
                
                .medium {
                    padding: 12px 24px;
                    font-size: 16px;
                }
                
                .large {
                    padding: 16px 32px;
                    font-size: 18px;
                }
                
                /* Hover states */
                .primary:hover {
                    background-color: var(--emphasis-color, #e95273);
                    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
                }
                
                .secondary:hover {
                    background-color: rgba(71, 104, 203, 0.1);
                }
                
                /* Active states */
                .button:active {
                    transform: translateY(2px);
                }
            </style>
            
            <button class="button ${this.type} ${this.size}">
                ${this.text}
            </button>
        `;

        this.shadowRoot.appendChild(template.content.cloneNode(true));
        this.button = this.shadowRoot.querySelector('.button');
    }

    setupEventListeners() {
        this.button.addEventListener('click', () => {
            const clickEvent = new CustomEvent('button-click', {
                bubbles: true,
                composed: true
            });
            this.dispatchEvent(clickEvent);
        });
    }
}

customElements.define('button-component', ButtonComponent);
