// JavaScript for the Itineraries page

document.addEventListener('DOMContentLoaded', function() {
    console.log('Itineraries page loaded');
    
    // Get all input boxes on the page
    const inputBoxes = document.querySelectorAll('input-box');
    
    // Form data object to store input values
    const formData = {
        'departure-address': '',
        'destination-address': '',
        'travel-date': ''
    };
    
    // Add event listeners to capture input changes
    inputBoxes.forEach(input => {
        input.addEventListener('input-change', function(e) {
            const inputName = input.getAttribute('name');
            formData[inputName] = e.detail.value;
            console.log(`${inputName} changed:`, e.detail.value);
        });
    });
    
    // Add button click handler
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
            
            // Here you would normally send the data to a server
            // For now, we'll just simulate a successful response
            setTimeout(() => {
                alert('Routes found! We\'ll display them soon.');
            }, 1000);
        });
    }
    
    // Add route data to popular routes
    const popularRoutes = document.querySelector('#popular-routes ul');
    if (popularRoutes) {
        // Style the popular routes list
        const listItems = popularRoutes.querySelectorAll('li');
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
                    // Find the input boxes
                    const departureInput = document.querySelector('input-box[name="departure-address"]');
                    const destinationInput = document.querySelector('input-box[name="destination-address"]');
                    
                    // Set the values programmatically
                    if (departureInput) departureInput.inputValue = route[0];
                    if (destinationInput) destinationInput.inputValue = route[1];
                    
                    // Update the form data
                    formData['departure-address'] = route[0];
                    formData['destination-address'] = route[1];
                    
                    // Scroll to the route planning section
                    document.querySelector('#route-planning').scrollIntoView({ 
                        behavior: 'smooth' 
                    });
                }
            });
        });
    }
});