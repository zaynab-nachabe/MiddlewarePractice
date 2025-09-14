// JavaScript for the About Us page

document.addEventListener('DOMContentLoaded', function() {
    console.log('About Us page loaded');
    
    // Team member cards styling
    const teamMembers = document.querySelectorAll('.team-member');
    
    teamMembers.forEach(member => {
        // Add styles programmatically 
        member.style.padding = '20px';
        member.style.marginBottom = '20px';
        member.style.borderRadius = '8px';
        member.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
        member.style.backgroundColor = '#f8f9fa';
        member.style.borderLeft = '4px solid #4768cb';
    });
    
    // Contact form handling
    const contactInputs = document.querySelectorAll('input-box');
    const formData = {
        'contact-name': '',
        'contact-email': '',
        'contact-subject': '',
        'contact-message': ''
    };
    
    contactInputs.forEach(input => {
        input.addEventListener('input-change', function(e) {
            const inputName = input.getAttribute('name');
            formData[inputName] = e.detail.value;
            console.log(`${inputName} value changed:`, e.detail.value);
        });
    });
    
    // Add submit button handler
    const submitButton = document.querySelector('button-component');
    if (submitButton) {
        submitButton.addEventListener('button-click', function() {
            console.log('Form submitted with data:', formData);
            
            // Basic validation
            if (!formData['contact-name']) {
                alert('Please enter your name');
                return;
            }
            
            if (!formData['contact-email']) {
                alert('Please enter your email address');
                return;
            }
            
            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(formData['contact-email'])) {
                alert('Please enter a valid email address');
                return;
            }
            
            if (!formData['contact-message']) {
                alert('Please enter a message');
                return;
            }
            
            // Here you would normally send the data to a server
            // For now, we'll just simulate a successful submission
            setTimeout(() => {
                alert('Thank you for your message! We will get back to you soon.');
                
                // Clear the form
                contactInputs.forEach(input => {
                    input.inputValue = '';
                    formData[input.getAttribute('name')] = '';
                });
            }, 1000);
        });
    }
});