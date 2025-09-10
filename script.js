document.addEventListener('DOMContentLoaded', function() {
    const burgerMenu = document.querySelector('.burger-menu:not(.side-panel-burger)');
    const sidePanelBurger = document.querySelector('.side-panel-burger');
    const sidePanel = document.querySelector('.side-panel');
    const sidePanelOverlay = document.querySelector('.side-panel-overlay');
    const sidePanelLinks = document.querySelectorAll('.side-panel-links a');
    
    if (burgerMenu && sidePanel && sidePanelOverlay) {
        burgerMenu.addEventListener('click', function() {
            const isActive = sidePanel.classList.contains('open');
            
            if (isActive) {
                closeSidePanel();
            } else {
                openSidePanel();
            }
        });
        
        if (sidePanelBurger) {
            sidePanelBurger.addEventListener('click', function() {
                closeSidePanel();
            });
        }
        
        sidePanelOverlay.addEventListener('click', function() {
            closeSidePanel();
        });
        
        sidePanelLinks.forEach(link => {
            link.addEventListener('click', function() {
                closeSidePanel();
            });
        });
        
        function openSidePanel() {
            sidePanel.classList.add('open');
            sidePanelOverlay.classList.add('show');
            document.body.style.overflow = 'hidden';
        }
        
        function closeSidePanel() {
            sidePanel.classList.remove('open');
            sidePanelOverlay.classList.remove('show');
            document.body.style.overflow = '';
        }
    }
});