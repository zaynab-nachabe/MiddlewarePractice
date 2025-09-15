/**
 * InfoPopup Component - Displays notifications at the bottom right of the screen
 * Supports multiple popups with different types (info, warning, error)
 * Auto-dismisses after timeout unless configured otherwise
 * 
 * Usage:
 * InfoPopup.show({
 *   type: 'info',           // 'info', 'warning', or 'error'
 *   title: 'Route Update',  // Title of the popup
 *   message: 'Your route has been updated due to traffic conditions',
 *   duration: 5000,         // Time in ms before auto-dismiss (0 for persistent)
 *   action: {               // Optional action button
 *     text: 'View Details',
 *     callback: () => { console.log('Action clicked'); }
 *   }
 * });
 */

class InfoPopup {
    static container = null;
    static popups = [];
    static idCounter = 0;
    
    /**
     * Initialize the container for popups
     */
    static init() {
        if (!InfoPopup.container) {
            InfoPopup.container = document.createElement('div');
            InfoPopup.container.className = 'info-popup-container';
            document.body.appendChild(InfoPopup.container);
        }
    }
    
    /**
     * Show a new popup notification
     * @param {Object} options - Configuration options for the popup
     * @returns {number} - ID of the created popup for reference
     */
    static show(options) {
        InfoPopup.init();
        
        const id = ++InfoPopup.idCounter;
        const defaults = {
            type: 'info',
            title: 'Information',
            message: '',
            duration: 5000, // 5 seconds default
            action: null
        };
        
        const config = { ...defaults, ...options };
        
        // Create the popup element
        const popup = document.createElement('div');
        popup.className = `info-popup ${config.type}`;
        popup.setAttribute('data-id', id);
        
        // Create popup content
        popup.innerHTML = `
            <div class="info-popup-header">
                <h4 class="info-popup-title">${config.title}</h4>
                <button class="info-popup-close" aria-label="Close">&times;</button>
            </div>
            <p class="info-popup-content">${config.message}</p>
            ${config.action ? `
                <div class="info-popup-footer">
                    <button class="info-popup-button">${config.action.text}</button>
                </div>
            ` : ''}
            ${config.duration > 0 ? `
                <div class="info-popup-progress">
                    <div class="info-popup-progress-bar" style="animation-duration: ${config.duration}ms;"></div>
                </div>
            ` : ''}
        `;
        
        // Add event listeners
        const closeBtn = popup.querySelector('.info-popup-close');
        closeBtn.addEventListener('click', () => {
            InfoPopup.dismiss(id);
        });
        
        if (config.action) {
            const actionBtn = popup.querySelector('.info-popup-button');
            actionBtn.addEventListener('click', (e) => {
                e.preventDefault();
                if (typeof config.action.callback === 'function') {
                    config.action.callback();
                }
                InfoPopup.dismiss(id);
            });
        }
        
        // Add to DOM
        InfoPopup.container.appendChild(popup);
        
        // Store reference
        InfoPopup.popups.push({
            id,
            element: popup,
            timeout: config.duration > 0 ? setTimeout(() => {
                InfoPopup.dismiss(id);
            }, config.duration) : null
        });
        
        // Trigger animation
        setTimeout(() => {
            popup.classList.add('show');
        }, 10);
        
        return id;
    }
    
    /**
     * Dismiss a specific popup by ID
     * @param {number} id - ID of the popup to dismiss
     */
    static dismiss(id) {
        const popupIndex = InfoPopup.popups.findIndex(p => p.id === id);
        if (popupIndex !== -1) {
            const popup = InfoPopup.popups[popupIndex];
            
            // Clear timeout if exists
            if (popup.timeout) {
                clearTimeout(popup.timeout);
            }
            
            // Remove animation
            popup.element.classList.remove('show');
            
            // Remove after animation completes
            setTimeout(() => {
                if (popup.element.parentNode) {
                    popup.element.parentNode.removeChild(popup.element);
                }
                InfoPopup.popups.splice(popupIndex, 1);
            }, 300);
        }
    }
    
    /**
     * Dismiss all current popups
     */
    static dismissAll() {
        [...InfoPopup.popups].forEach(popup => {
            InfoPopup.dismiss(popup.id);
        });
    }
    
    /**
     * Shorthand for showing an info popup
     * @param {string} message - The message to display
     * @param {string} title - Optional title
     * @param {number} duration - Optional duration
     * @returns {number} - ID of the created popup
     */
    static info(message, title = 'Information', duration = 5000) {
        return InfoPopup.show({
            type: 'info',
            title,
            message,
            duration
        });
    }
    
    /**
     * Shorthand for showing a warning popup
     * @param {string} message - The message to display
     * @param {string} title - Optional title
     * @param {number} duration - Optional duration
     * @returns {number} - ID of the created popup
     */
    static warning(message, title = 'Warning', duration = 7000) {
        return InfoPopup.show({
            type: 'warning',
            title,
            message,
            duration
        });
    }
    
    /**
     * Shorthand for showing an error popup
     * @param {string} message - The message to display
     * @param {string} title - Optional title
     * @param {number} duration - Optional duration (0 for persistent)
     * @returns {number} - ID of the created popup
     */
    static error(message, title = 'Error', duration = 0) {
        return InfoPopup.show({
            type: 'error',
            title,
            message,
            duration
        });
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', InfoPopup.init);

// Export for module usage if needed
if (typeof module !== 'undefined' && module.exports) {
    module.exports = InfoPopup;
}