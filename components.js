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
        
        // If nav was loaded, attach mobile menu functionality
        if (elementId === 'nav-placeholder') {
            initializeMobileMenu();
        }
    } catch (error) {
        console.error(`Error loading ${filePath}:`, error);
    }
}

// Initialize mobile menu functionality
function initializeMobileMenu() {
    const burger = document.querySelector('.mobile-menu');
    const menu = document.getElementById('navMenu');
    
    if (!burger || !menu) {
        console.error('Mobile menu elements not found');
        return;
    }
    
    // Toggle menu when clicking burger
    burger.addEventListener('click', function(e) {
        e.stopPropagation();
        menu.classList.toggle('active');
        burger.classList.toggle('active');
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', function(event) {
        const nav = document.querySelector('nav');
        if (nav && !nav.contains(event.target) && menu.classList.contains('active')) {
            menu.classList.remove('active');
            burger.classList.remove('active');
        }
    });
    
    // Close menu when clicking nav links
    document.querySelectorAll('#navMenu a').forEach(link => {
        link.addEventListener('click', () => {
            menu.classList.remove('active');
            burger.classList.remove('active');
        });
    });
}

// Load components when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    loadComponent('nav-placeholder', 'nav.html');
    loadComponent('footer-placeholder', 'footer.html');

    // Dot-grid texture on the body background
    const tex = document.createElement('style');
    tex.textContent = 'body { background-image: radial-gradient(rgba(255,255,255,0.055) 1px, transparent 1px); background-size: 36px 36px; }';
    document.head.appendChild(tex);

    // Film grain overlay on top of everything
    const grain = document.createElement('div');
    grain.setAttribute('aria-hidden', 'true');
    grain.style.position = 'fixed';
    grain.style.inset = '0';
    grain.style.pointerEvents = 'none';
    grain.style.zIndex = '9998';
    grain.style.opacity = '0.07';
    grain.style.backgroundImage = "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.72' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";
    document.body.appendChild(grain);
});