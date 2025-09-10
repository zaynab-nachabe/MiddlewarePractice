window.toggleSidePanel = function(action) {
    const sidePanel = document.querySelector('.side-panel');
    const sidePanelOverlay = document.querySelector('.side-panel-overlay');
 
    if (!sidePanel || !sidePanelOverlay) return;
    
    // Force specific action or toggle current state
    if (action === 'open') {
        // Always open
        sidePanel.style.display = 'block';
        sidePanelOverlay.style.display = 'block';
        
        // Use setTimeout to ensure the display change is processed
        // before adding the transition class
        setTimeout(function() {
            sidePanel.classList.add('open');
            sidePanelOverlay.classList.add('show');
            document.body.style.overflow = 'hidden';
        }, 10);
    } else if (action === 'close') {
        // Always close
        sidePanel.classList.remove('open');
        sidePanelOverlay.classList.remove('show');
        document.body.style.overflow = '';
        
        // Delay hiding until transition completes
        setTimeout(function() {
            if (!sidePanel.classList.contains('open')) {
                sidePanel.style.display = 'none';
                sidePanelOverlay.style.display = 'none';
            }
        }, 300);
    } else {
        // Toggle based on current state
        const isOpen = sidePanel.classList.contains('open');
        
        if (isOpen) {
            // Close panel
            sidePanel.classList.remove('open');
            sidePanelOverlay.classList.remove('show');
            document.body.style.overflow = '';
            
            setTimeout(function() {
                sidePanel.style.display = 'none';
                sidePanelOverlay.style.display = 'none';
            }, 300);
        } else {
            // Open panel
            sidePanel.style.display = 'block';
            sidePanelOverlay.style.display = 'block';
            
            setTimeout(function() {
                sidePanel.classList.add('open');
                sidePanelOverlay.classList.add('show');
                document.body.style.overflow = 'hidden';
            }, 10);
        }
    }
};
