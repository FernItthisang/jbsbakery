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