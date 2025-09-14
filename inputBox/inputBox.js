class InputBoxComponent extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.placeholder = this.getAttribute('placeholder') || 'Type here...';
        this.label = this.getAttribute('label') || '';
        this.name = this.getAttribute('name') || 'input-box';
        this.value = this.getAttribute('value') || '';
        
        this.render();
        this.setupEventListeners();
    }

    render() {
        const template = document.createElement('template');
        template.innerHTML = `
            <style>
                .input-container {
                    display: flex;
                    flex-direction: column;
                    margin-bottom: 15px;
                    width: 100%;
                    max-width: 400px;
                }
                
                .input-label {
                    margin-bottom: 5px;
                    font-weight: 500;
                    color: var(--main-text-color, #363636);
                }
                
                .input-field {
                    padding: 12px 15px;
                    border: 2px solid var(--secondary-color, #4768cb);
                    border-radius: 6px;
                    background-color: rgba(71, 104, 203, 0.1);
                    color: var(--main-text-color, #363636);
                    font-size: 16px;
                    transition: all 0.3s ease;
                    outline: none;
                }
                
                .input-field:focus {
                    border-color: var(--emphasis-color, #e95273);
                    box-shadow: 0 0 5px rgba(233, 82, 115, 0.3);
                }
                
                .input-field::placeholder {
                    color: rgba(54, 54, 54, 0.6);
                }
            </style>
            
            <div class="input-container">
                ${this.label ? `<label class="input-label">${this.label}</label>` : ''}
                <input 
                    type="text" 
                    class="input-field" 
                    placeholder="${this.placeholder}" 
                    name="${this.name}" 
                    value="${this.value}"
                >
            </div>
        `;

        this.shadowRoot.appendChild(template.content.cloneNode(true));
        this.inputField = this.shadowRoot.querySelector('.input-field');
    }

    setupEventListeners() {
        this.inputField.addEventListener('input', (e) => {
            this.value = e.target.value;
            
            const changeEvent = new CustomEvent('input-change', {
                detail: { value: this.value },
                bubbles: true,
                composed: true
            });
            this.dispatchEvent(changeEvent);
        });
    }

    get inputValue() {
        return this.value;
    }

    set inputValue(newValue) {
        this.value = newValue;
        if (this.inputField) {
            this.inputField.value = newValue;
        }
    }
}

customElements.define('input-box', InputBoxComponent);