// Function to play and stop the video based on visibility
function setupIntersectionObserver() {
    const videoContainer = document.querySelector('.video-container');
    const iframe = videoContainer.querySelector('iframe');
    const player = new YT.Player(iframe);

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Play the video when it enters the viewport
                player.playVideo();
            } else {
                // Pause the video when it leaves the viewport
                player.pauseVideo();
            }
        });
    }, { threshold: 0.5 });

    observer.observe(videoContainer);
}

// Initialize the YouTube Iframe API
function onYouTubeIframeAPIReady() {
    setupIntersectionObserver();
}

// Load YouTube API
const tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
const firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
