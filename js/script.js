    // Navigation functionality - Slide from right
    document.addEventListener('DOMContentLoaded', function() {
        const hamburger = document.querySelector('.hamburger');
        const navMenu = document.querySelector('.nav-menu');
        const navContainer = document.querySelector('.nav-container');
        
        // Toggle navigation menu
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
            navContainer.classList.toggle('active');
        });
        
        // Close menu when clicking on a link
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                navContainer.classList.remove('active');
            });
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!navContainer.contains(event.target)) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                navContainer.classList.remove('active');
            }
        });
        
        // Handle scroll for navbar background
        window.addEventListener('scroll', function() {
            const navbar = document.querySelector('.navbar');
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    });
   
   // Image swapping functionality for multiple image sections
   document.addEventListener('DOMContentLoaded', function() {
            
    // Function to setup image swapping for any image container
    function setupImageSwapping(containerSelector) {
        const container = document.querySelector(containerSelector);
        if (!container) return;
        
        const images = container.querySelectorAll('img');
        let currentImageIndex = 0;
        
        // Function to show only one image at a time
        function showImage(index) {
            images.forEach((img, i) => {
                if (i === index) {
                    img.style.display = 'block';
                    img.style.opacity = '1';
                } else {
                    img.style.display = 'none';
                    img.style.opacity = '0';
                }
            });
        }
        
        // Initialize - show first image
        showImage(0);
        
        // Add click event to cycle through images
        container.addEventListener('click', function() {
            currentImageIndex = (currentImageIndex + 1) % images.length;
            showImage(currentImageIndex);
        });
        
        // Auto-rotate images every 3 seconds
        setInterval(function() {
            currentImageIndex = (currentImageIndex + 1) % images.length;
            showImage(currentImageIndex);
        }, 3000);
        
        // Add hover effect to show it's clickable
        container.style.cursor = 'pointer';
        container.title = 'Click to see next image';
    }
    
    // Setup image swapping for both sections
    setupImageSwapping('.image-placeholder');    // Section 2 - snowbun images
    setupImageSwapping('.image-placeholder2');   // Section 4 - snackbox images
});