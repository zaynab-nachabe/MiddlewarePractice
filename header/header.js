class HeaderComponent extends HTMLElement {
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
                .nav {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    background-color: white;
                    border-bottom: 2px solid var(--block-separator-color, #d9d9d9);
                    padding: 20px 30px;
                    box-sizing: border-box;
                    display: flex;
                    align-items: center;
                    gap: 50px;
                    z-index: 1001;
                    height: 80px;
                }
                
                .nav-logo .logo {
                    height: 65px;
                    width: auto;
                }
                
                .nav-links {
                    display: flex;
                    list-style: none;
                    margin: 0;
                    padding: 0;
                    gap: 30px;
                }
                
                .nav-links li {
                    margin: 0;
                }
                
                .nav-links a {
                    text-decoration: none;
                    color: var(--main-text-color, #363636);
                    font-weight: 500;
                    font-size: 20px;
                    padding: 10px 15px;
                    border-radius: 5px;
                    transition: background-color 0.3s ease;
                }
                
                .nav-links a:hover {
                    text-decoration: underline;
                    text-decoration-color: var(--secondary-color, #4768cb);
                }
                
                .burger-menu {
                    display: none;
                    flex-direction: column;
                    justify-content: space-between;
                    width: 45px;
                    height: 44px;
                    cursor: pointer;
                    position: relative;
                }
                
                .burger-line {
                    width: 45px;
                    height: 6px;
                    background-color: #000000;
                    margin: 0;
                    transition: none;
                    transform-origin: center;
                    border-radius: 3px;
                    box-shadow: 0 1px 2px rgba(0,0,0,0.2);
                }
                
                @media (max-width: 1100px) {
                    .nav-links {
                        display: none;
                    }
                    
                    .nav {
                        justify-content: space-between;
                        gap: 20px;
                        padding: 10px 20px;
                        height: 60px;
                    }
                    
                    .nav-logo .logo {
                        height: 35px;
                    }
                    
                    .burger-menu {
                        display: flex;
                    }
                }
            </style>
            <nav class="nav">
                <div class="nav-logo">
                    <img src="logopns.png" alt="Logo" class="logo">
                </div>
                <ul class="nav-links">
                    <li><a href="index.html">Homepage</a></li>
                    <li><a href="iteneraries.html">Itineraries</a></li>
                    <li><a href="aboutUs.html">About us</a></li>
                </ul>
                <div class="burger-menu" id="burger-menu">
                    <span class="burger-line"></span>
                    <span class="burger-line"></span>
                    <span class="burger-line"></span>
                </div>
            </nav>
        `;
        
        // Append the template content to the shadow DOM
        this.shadowRoot.appendChild(template.content.cloneNode(true));
        
        // Add event listener to burger menu
        const burgerMenu = this.shadowRoot.getElementById('burger-menu');
        if (burgerMenu) {
            burgerMenu.addEventListener('click', () => {
                window.toggleSidePanel('open');
            });
        }
    }
}

// Define the custom element
customElements.define('header-component', HeaderComponent);