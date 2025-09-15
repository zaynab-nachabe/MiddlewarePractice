class TabsComponent extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this._activeTab = 0;
    }

    connectedCallback() {
        this.render();
        this.setupEventListeners();
        
        // Initialize with the first tab active
        setTimeout(() => {
            this.activateTab(0);
        }, 0);
    }

    render() {
        const template = document.createElement('template');
        template.innerHTML = `
            <style>
                :host {
                    display: block;
                    width: 100%;
                    margin-bottom: 20px;
                }
                
                .tabs-container {
                    width: 100%;
                }
                
                .tabs-header {
                    display: flex;
                    border-bottom: 2px solid var(--secondary-color, #4768cb);
                    margin-bottom: 20px;
                }
                
                .tab-button {
                    padding: 12px 24px;
                    background: transparent;
                    border: none;
                    border-bottom: 3px solid transparent;
                    margin-right: 5px;
                    cursor: pointer;
                    font-size: 16px;
                    font-weight: 500;
                    color: var(--main-text-color, #363636);
                    transition: all 0.3s ease;
                }
                
                .tab-button:hover {
                    background-color: rgba(71, 104, 203, 0.05);
                }
                
                .tab-button.active {
                    border-bottom: 3px solid var(--emphasis-color, #e95273);
                    color: var(--emphasis-color, #e95273);
                }
                
                .tab-content {
                    display: none;
                    padding: 15px;
                    border-radius: 6px;
                    background-color: #fff;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.05);
                }
                
                .tab-content.active {
                    display: block;
                    animation: fadeIn 0.3s ease;
                }
                
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
            </style>
            
            <div class="tabs-container">
                <div class="tabs-header">
                    <!-- Tab buttons will be added here -->
                </div>
                <div class="tabs-body">
                    <!-- Tab content will be slotted here -->
                    <slot></slot>
                </div>
            </div>
        `;

        this.shadowRoot.appendChild(template.content.cloneNode(true));
        
        // Find and set up tab content elements
        this.tabsHeader = this.shadowRoot.querySelector('.tabs-header');
        this.tabsBody = this.shadowRoot.querySelector('.tabs-body');
        
        // Get all tab content elements (direct children with tab-content attribute)
        this.tabContents = Array.from(this.querySelectorAll('[tab-content]'));
        
        // Create tab buttons based on tab-title attribute
        this.tabContents.forEach((tabContent, index) => {
            const tabTitle = tabContent.getAttribute('tab-title') || `Tab ${index + 1}`;
            const tabButton = document.createElement('button');
            tabButton.className = 'tab-button';
            tabButton.textContent = tabTitle;
            tabButton.dataset.tabIndex = index;
            this.tabsHeader.appendChild(tabButton);
            
            // Set initial styles on tab content
            tabContent.style.display = 'none';
            tabContent.dataset.tabIndex = index;
        });
    }

    setupEventListeners() {
        // Add click handlers to tab buttons
        const tabButtons = this.shadowRoot.querySelectorAll('.tab-button');
        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                const tabIndex = parseInt(button.dataset.tabIndex);
                this.activateTab(tabIndex);
            });
        });
    }
    
    activateTab(index) {
        // Update active state on buttons
        const tabButtons = this.shadowRoot.querySelectorAll('.tab-button');
        tabButtons.forEach((button, i) => {
            if (i === index) {
                button.classList.add('active');
            } else {
                button.classList.remove('active');
            }
        });
        
        // Update visibility of tab contents
        this.tabContents.forEach((content, i) => {
            if (i === index) {
                content.style.display = 'block';
                
                // Dispatch event for tab change
                const tabChangeEvent = new CustomEvent('tab-changed', {
                    detail: { 
                        index: index,
                        title: content.getAttribute('tab-title')
                    },
                    bubbles: true,
                    composed: true
                });
                this.dispatchEvent(tabChangeEvent);
            } else {
                content.style.display = 'none';
            }
        });
        
        this._activeTab = index;
    }
    
    // Getter and setter for active tab
    get activeTab() {
        return this._activeTab;
    }
    
    set activeTab(index) {
        if (index >= 0 && index < this.tabContents.length) {
            this.activateTab(index);
        }
    }
}

customElements.define('tabs-component', TabsComponent);