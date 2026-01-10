// Function to detect if we're in a subdirectory
function getBasePath() {
    const path = window.location.pathname;
    // Check if we're in a subdirectory (like artist-pages/)
    if (path.includes('/artist-pages/') || path.includes('/Includes/')) {
        return '../';
    }
    return '';
}

// Function to load shared components
async function loadComponent(elementId, fileName) {
    const basePath = getBasePath();
    const filePath = basePath + 'Includes/' + fileName;
    
    try {
        const response = await fetch(filePath);
        const html = await response.text();
        
        // For nav and footer, we need to adjust the paths in the loaded HTML
        let processedHtml = html;
        if (basePath === '../') {
            // We're in a subdirectory, paths in nav/footer need adjustment
            processedHtml = html.replace(/href="(?!http|#|mailto)/g, 'href="' + basePath);
            processedHtml = processedHtml.replace(/src="(?!http)/g, 'src="' + basePath);
        }
        
        document.getElementById(elementId).innerHTML = processedHtml;
        
        // If nav was loaded, execute its scripts
        if (elementId === 'nav-placeholder') {
            const scripts = document.getElementById(elementId).getElementsByTagName('script');
            for (let script of scripts) {
                eval(script.innerHTML);
            }
        }
    } catch (error) {
        console.error(`Error loading ${filePath}:`, error);
    }
}

// Load components when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    loadComponent('nav-placeholder', 'nav.html');
    loadComponent('footer-placeholder', 'footer.html');
});