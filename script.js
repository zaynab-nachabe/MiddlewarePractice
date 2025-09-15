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
    
    // Handle address selection
    const departureInput = document.querySelector('input-box[name="departure-address"]');
    const destinationInput = document.querySelector('input-box[name="destination-address"]');
    const searchButton = document.querySelector('button-component');
    
    // State to track selected addresses
    const selectedAddresses = {
        departure: null,
        destination: null
    };
    
    // Event listeners for address selection
    if (departureInput && destinationInput) {
        departureInput.addEventListener('address-selected', function(e) {
            console.log('Departure address selected:', e.detail.value);
            selectedAddresses.departure = {
                address: e.detail.value,
                coordinates: e.detail.coordinates
            };
            checkAddressesAndRedirect();
        });
        
        destinationInput.addEventListener('address-selected', function(e) {
            console.log('Destination address selected:', e.detail.value);
            selectedAddresses.destination = {
                address: e.detail.value,
                coordinates: e.detail.coordinates
            };
            checkAddressesAndRedirect();
        });
        
        // Search button click handler
        if (searchButton) {
            searchButton.addEventListener('button-click', function() {
                if (departureInput.inputValue && destinationInput.inputValue) {
                    // Even if not from autocomplete, save the entered values
                    if (!selectedAddresses.departure) {
                        selectedAddresses.departure = {
                            address: departureInput.inputValue,
                            coordinates: null
                        };
                    }
                    
                    if (!selectedAddresses.destination) {
                        selectedAddresses.destination = {
                            address: destinationInput.inputValue,
                            coordinates: null
                        };
                    }
                    
                    // Save and redirect
                    saveToLocalStorage();
                    window.location.href = 'iteneraries.html';
                } else {
                    alert('Please enter both departure and destination addresses');
                }
            });
        }
    }
    
    // Check if both addresses are selected and redirect if they are
    function checkAddressesAndRedirect() {
        if (selectedAddresses.departure && selectedAddresses.destination) {
            saveToLocalStorage();
            window.location.href = 'iteneraries.html';
        }
    }
    
    // Save the selected addresses to localStorage
    function saveToLocalStorage() {
        localStorage.setItem('selectedAddresses', JSON.stringify(selectedAddresses));
    }
});