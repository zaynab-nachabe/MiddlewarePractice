
document.addEventListener('DOMContentLoaded', function() {
    if (typeof InfoPopup === 'undefined') {
        console.error('InfoPopup component not loaded');
        return;
    }
    
    const testButton = document.createElement('button');
    testButton.textContent = 'Test Notifications';
    testButton.style.position = 'fixed';
    testButton.style.top = '80px';
    testButton.style.right = '20px';
    testButton.style.zIndex = '1000';
    testButton.style.padding = '8px 16px';
    testButton.style.backgroundColor = '#4768cb';
    testButton.style.color = 'white';
    testButton.style.border = 'none';
    testButton.style.borderRadius = '4px';
    testButton.style.cursor = 'pointer';
    
    document.body.appendChild(testButton);
    
    testButton.addEventListener('click', function() {
        InfoPopup.info(
            'Your route has been recalculated based on traffic conditions.',
            'Route Updated',
            8000
        );
        
        setTimeout(() => {
            InfoPopup.warning(
                'Heavy traffic detected on A8 highway. Expect delays of 15-20 minutes.',
                'Traffic Alert',
                10000
            );
        }, 1000);
        
        setTimeout(() => {
            InfoPopup.error(
                'Road closure detected on your route. Please check alternative routes.',
                'Road Closure',
                0 // This will stay until dismissed
            );
        }, 2000);
        
        setTimeout(() => {
            InfoPopup.show({
                type: 'info',
                title: 'Public Transport Option',
                message: 'A train is available that could be faster than driving in current conditions.',
                duration: 12000,
                action: {
                    text: 'View Train Schedule',
                    callback: function() {
                        alert('This would open the train schedule page');
                    }
                }
            });
        }, 3000);
    });
});