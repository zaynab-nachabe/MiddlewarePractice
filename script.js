document.addEventListener('DOMContentLoaded', function() {
    const burgerMenu = document.querySelector('.burger-menu:not(.side-panel-burger)');
    const sidePanelBurger = document.querySelector('.side-panel-burger');
    const sidePanel = document.querySelector('.side-panel');
    const sidePanelOverlay = document.querySelector('.side-panel-overlay');
    const sidePanelLinks = document.querySelectorAll('.side-panel-links a');
    
    // Initialize panel state
    let sidePanelOpen = false;
    
    if (burgerMenu && sidePanel && sidePanelOverlay) {
        // Ensure panels have correct initial state
        sidePanel.classList.remove('open');
        sidePanelOverlay.classList.remove('show');
        sidePanel.style.display = 'none';
        sidePanelOverlay.style.display = 'none';
        
        // The main burger menu now uses the onclick attribute
        // so we don't need this event listener anymore
        
        // Handle overlay clicks to close panel
        sidePanelOverlay.addEventListener('click', function() {
            window.toggleSidePanel('close');
        });
        
        // Handle navigation link clicks to close panel
        sidePanelLinks.forEach(link => {
            link.addEventListener('click', function() {
                window.toggleSidePanel('close');
            });
        });
    }
});