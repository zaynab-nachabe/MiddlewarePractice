document.addEventListener('DOMContentLoaded', function() {
    console.log('Itineraries page loaded');
    
    const inputBoxes = document.querySelectorAll('input-box');
    const departureInput = document.querySelector('input-box[name="departure-address"]');
    const destinationInput = document.querySelector('input-box[name="destination-address"]');
    const dateInput = document.querySelector('input-box[name="travel-date"]');
    
    const originDisplay = document.getElementById('origin-display');
    const destinationDisplay = document.getElementById('destination-display');
    const mapOrigin = document.getElementById('map-origin');
    const mapDestination = document.getElementById('map-destination');
    const stepOrigin = document.getElementById('step-origin');
    const stepDestination = document.getElementById('step-destination');
    
    const formData = {
        'departure-address': '',
        'destination-address': '',
        'travel-date': ''
    };
    
    try {
        const savedAddresses = JSON.parse(localStorage.getItem('selectedAddresses'));
        if (savedAddresses) {
            console.log('Found saved addresses:', savedAddresses);
            
            // Fill in the form with saved addresses
            if (departureInput && savedAddresses.departure) {
                departureInput.inputValue = savedAddresses.departure.address;
                formData['departure-address'] = savedAddresses.departure.address;
                
                updateOriginDisplays(savedAddresses.departure.address);
            }
            
            if (destinationInput && savedAddresses.destination) {
                destinationInput.inputValue = savedAddresses.destination.address;
                formData['destination-address'] = savedAddresses.destination.address;
                
                updateDestinationDisplays(savedAddresses.destination.address);
            }
            
            if (dateInput) {
                setTimeout(() => {
                    dateInput.shadowRoot.querySelector('input').focus();
                }, 500);
            }
        } else {
            updateOriginDisplays('Please select a departure point');
            updateDestinationDisplays('Please select a destination');
        }
    } catch (error) {
        console.error('Error loading saved addresses:', error);
        updateOriginDisplays('Error loading departure');
        updateDestinationDisplays('Error loading destination');
    }
    
    inputBoxes.forEach(input => {
        input.addEventListener('input-change', function(e) {
            const inputName = input.getAttribute('name');
            formData[inputName] = e.detail.value;
            console.log(`${inputName} changed:`, e.detail.value);
        });
        
        if (input.hasAttribute('address-input')) {
            input.addEventListener('address-selected', function(e) {
                const inputName = input.getAttribute('name');
                formData[inputName] = e.detail.value;
                console.log(`${inputName} address selected:`, e.detail.value);
                
                const coordinates = e.detail.coordinates;
                
                if (inputName === 'departure-address') {
                    updateOriginDisplays(e.detail.value);
                    
                    const savedAddresses = JSON.parse(localStorage.getItem('selectedAddresses') || '{}');
                    savedAddresses.departure = {
                        address: e.detail.value,
                        coordinates: coordinates
                    };
                    localStorage.setItem('selectedAddresses', JSON.stringify(savedAddresses));
                    
                    // If map is initialized, update it
                    if (typeof geocodeAddress === 'function') {
                        geocodeAddress(e.detail.value, true);
                    }
                } else if (inputName === 'destination-address') {
                    updateDestinationDisplays(e.detail.value);
                    
                    // Update the saved addresses with coordinates
                    const savedAddresses = JSON.parse(localStorage.getItem('selectedAddresses') || '{}');
                    savedAddresses.destination = {
                        address: e.detail.value,
                        coordinates: coordinates
                    };
                    localStorage.setItem('selectedAddresses', JSON.stringify(savedAddresses));
                    
                    // If map is initialized, update it
                    if (typeof geocodeAddress === 'function') {
                        geocodeAddress(e.detail.value, false);
                    }
                }
            });
        }
    });
    
    const searchButton = document.querySelector('button-component');
    if (searchButton) {
        searchButton.addEventListener('button-click', function() {
            console.log('Searching for routes with data:', formData);
            
            // Validate form data
            if (!formData['departure-address']) {
                alert('Please enter a departure address');
                return;
            }
            
            if (!formData['destination-address']) {
                alert('Please enter a destination address');
                return;
            }
            
            saveToLocalStorage();
            
            updateOriginDisplays(formData['departure-address']);
            updateDestinationDisplays(formData['destination-address']);
            
            if (typeof geocodeAddress === 'function') {
                geocodeAddress(formData['departure-address'], true);
                geocodeAddress(formData['destination-address'], false);
            }
        });
    }
    
    setupPopularRoutes();
    
    const tabsComponent = document.querySelector('tabs-component');
    if (tabsComponent) {
        tabsComponent.addEventListener('tab-changed', function(e) {
            console.log('Tab changed to:', e.detail.title);
        });
    }
    
    function updateOriginDisplays(text) {
        if (originDisplay) originDisplay.textContent = text;
        if (mapOrigin) mapOrigin.textContent = text;
        if (stepOrigin) stepOrigin.textContent = text;
    }
    
    function updateDestinationDisplays(text) {
        if (destinationDisplay) destinationDisplay.textContent = text;
        if (mapDestination) mapDestination.textContent = text;
        if (stepDestination) stepDestination.textContent = text;
    }
    
    function setupPopularRoutes() {
        const popularRoutesElements = [
            document.querySelector('.popular-routes-sidebar ul'),
            document.querySelector('#popular-routes ul')
        ];
        
        popularRoutesElements.forEach(element => {
            if (!element) return;
            
            // Style the popular routes list
            const listItems = element.querySelectorAll('li');
            listItems.forEach(item => {
                item.style.padding = '10px';
                item.style.margin = '5px 0';
                item.style.borderRadius = '5px';
                item.style.backgroundColor = 'rgba(71, 104, 203, 0.1)';
                item.style.borderLeft = '3px solid #4768cb';
                item.style.listStyleType = 'none';
                
                // Make list items clickable
                item.style.cursor = 'pointer';
                item.addEventListener('click', function() {
                    const route = item.textContent.split(' to ');
                    if (route.length === 2) {
                        // Set the values programmatically
                        if (departureInput) departureInput.inputValue = route[0];
                        if (destinationInput) destinationInput.inputValue = route[1];
                        
                        formData['departure-address'] = route[0];
                        formData['destination-address'] = route[1];
                        
                        updateOriginDisplays(route[0]);
                        updateDestinationDisplays(route[1]);
                        
                        saveToLocalStorage();
                        
                        // If map is initialized, update it by geocoding the addresses
                        if (typeof geocodeAddress === 'function') {
                            geocodeAddress(route[0], true);
                            geocodeAddress(route[1], false);
                        }
                        
                        if (searchButton) {
                            searchButton.click();
                        }
                    }
                });
            });
        });
    }
    
    function saveToLocalStorage() {
        const selectedAddresses = {
            departure: {
                address: formData['departure-address'],
                coordinates: null
            },
            destination: {
                address: formData['destination-address'],
                coordinates: null
            }
        };
        
        localStorage.setItem('selectedAddresses', JSON.stringify(selectedAddresses));
    }
});