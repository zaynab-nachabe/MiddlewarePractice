/**
 * Debounce function to limit the rate at which a function can fire.
 * @param {Function} func
 * @param {number} wait
 * @return {Function}
 */
function debounce(func, wait = 300) {
    let timeout;
    
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

window.debounce = debounce;