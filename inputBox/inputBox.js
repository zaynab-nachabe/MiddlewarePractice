class InputBoxComponent extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this._suggestions = [];
        this._selectedSuggestion = null;
        this._isAddressInput = false;
    }

    connectedCallback() {
        this.placeholder = this.getAttribute('placeholder') || 'Type here...';
        this.label = this.getAttribute('label') || '';
        this.name = this.getAttribute('name') || 'input-box';
        this.value = this.getAttribute('value') || '';
        this._isAddressInput = this.hasAttribute('address-input');
        
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
                    position: relative;
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
                
                .suggestions-container {
                    position: absolute;
                    top: 100%;
                    left: 0;
                    width: 100%;
                    max-height: 200px;
                    overflow-y: auto;
                    border: 1px solid #ddd;
                    border-radius: 0 0 6px 6px;
                    background-color: white;
                    z-index: 10;
                    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
                    display: none;
                }
                
                .suggestion-item {
                    padding: 10px 15px;
                    cursor: pointer;
                    border-bottom: 1px solid #f0f0f0;
                }
                
                .suggestion-item:last-child {
                    border-bottom: none;
                }
                
                .suggestion-item:hover,
                .suggestion-item.selected {
                    background-color: #f5f7ff;
                }
                
                .suggestion-item.selected {
                    background-color: #e9ecff;
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
                <div class="suggestions-container"></div>
            </div>
        `;

        this.shadowRoot.appendChild(template.content.cloneNode(true));
        this.inputField = this.shadowRoot.querySelector('.input-field');
    }

    setupEventListeners() {
        if (!this._isAddressInput) {
            // Standard input behavior
            this.inputField.addEventListener('input', (e) => {
                this.value = e.target.value;
                
                const changeEvent = new CustomEvent('input-change', {
                    detail: { value: this.value },
                    bubbles: true,
                    composed: true
                });
                this.dispatchEvent(changeEvent);
            });
        } else {
            // Address input with autocomplete
            this.suggestionsContainer = this.shadowRoot.querySelector('.suggestions-container');
            
            // Debounced fetch function to prevent too many API calls
            this.debouncedFetchAddresses = window.debounce((query) => {
                this.fetchAddresses(query);
            }, 300);
            
            this.inputField.addEventListener('input', (e) => {
                this.value = e.target.value;
                
                const changeEvent = new CustomEvent('input-change', {
                    detail: { value: this.value },
                    bubbles: true,
                    composed: true
                });
                this.dispatchEvent(changeEvent);
                
                // Only fetch if we have at least 3 characters
                if (this.value.length >= 3) {
                    this.debouncedFetchAddresses(this.value);
                } else {
                    this.clearSuggestions();
                }
            });
            
            // Handle keyboard navigation in suggestions
            this.inputField.addEventListener('keydown', (e) => {
                if (this.suggestionsContainer.style.display !== 'block') return;
                
                switch (e.key) {
                    case 'ArrowDown':
                        e.preventDefault();
                        this.selectNextSuggestion();
                        break;
                    case 'ArrowUp':
                        e.preventDefault();
                        this.selectPreviousSuggestion();
                        break;
                    case 'Enter':
                        e.preventDefault();
                        this.confirmSelectedSuggestion();
                        break;
                    case 'Escape':
                        e.preventDefault();
                        this.clearSuggestions();
                        break;
                }
            });
            
            // Close suggestions when clicking outside
            document.addEventListener('click', (e) => {
                if (!this.contains(e.target)) {
                    this.clearSuggestions();
                }
            });
        }
    }
    
    async fetchAddresses(query) {
        try {
            const response = await fetch(`https://api-adresse.data.gouv.fr/search/?q=${encodeURIComponent(query)}&limit=5`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            
            const data = await response.json();
            this.updateSuggestions(data.features);
        } catch (error) {
            console.error('Error fetching address suggestions:', error);
            this.clearSuggestions();
        }
    }
    
    updateSuggestions(features) {
        this.clearSuggestions();
        this._suggestions = features;
        
        if (features.length === 0) {
            this.suggestionsContainer.style.display = 'none';
            return;
        }
        
        features.forEach((feature, index) => {
            const item = document.createElement('div');
            item.className = 'suggestion-item';
            item.textContent = feature.properties.label;
            item.dataset.index = index;
            
            item.addEventListener('click', () => {
                this.selectSuggestion(index);
            });
            
            this.suggestionsContainer.appendChild(item);
        });
        
        this.suggestionsContainer.style.display = 'block';
    }
    
    clearSuggestions() {
        this.suggestionsContainer.innerHTML = '';
        this.suggestionsContainer.style.display = 'none';
        this._selectedSuggestion = null;
    }
    
    selectNextSuggestion() {
        const items = this.suggestionsContainer.querySelectorAll('.suggestion-item');
        if (items.length === 0) return;
        
        // Clear current selection
        items.forEach(item => item.classList.remove('selected'));
        
        // Select next or first
        if (this._selectedSuggestion === null || this._selectedSuggestion >= items.length - 1) {
            this._selectedSuggestion = 0;
        } else {
            this._selectedSuggestion++;
        }
        
        items[this._selectedSuggestion].classList.add('selected');
    }
    
    selectPreviousSuggestion() {
        const items = this.suggestionsContainer.querySelectorAll('.suggestion-item');
        if (items.length === 0) return;
        
        // Clear current selection
        items.forEach(item => item.classList.remove('selected'));
        
        // Select previous or last
        if (this._selectedSuggestion === null || this._selectedSuggestion <= 0) {
            this._selectedSuggestion = items.length - 1;
        } else {
            this._selectedSuggestion--;
        }
        
        items[this._selectedSuggestion].classList.add('selected');
    }
    
    selectSuggestion(index) {
        if (index < 0 || index >= this._suggestions.length) return;
        
        const selectedFeature = this._suggestions[index];
        this.value = selectedFeature.properties.label;
        this.inputField.value = selectedFeature.properties.label;
        
        // Dispatch a special event for address selection
        const selectionEvent = new CustomEvent('address-selected', {
            detail: {
                value: this.value,
                feature: selectedFeature,
                coordinates: selectedFeature.geometry.coordinates,
                name: this.name
            },
            bubbles: true,
            composed: true
        });
        
        this.dispatchEvent(selectionEvent);
        this.clearSuggestions();
    }
    
    confirmSelectedSuggestion() {
        if (this._selectedSuggestion !== null) {
            this.selectSuggestion(this._selectedSuggestion);
        } else if (this._suggestions.length > 0) {
            this.selectSuggestion(0);
        }
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