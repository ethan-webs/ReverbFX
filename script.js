// Audio Player Functionality
class AudioPlayer {
    constructor() {
        this.isPlaying = false;
        this.currentTime = 0;
        this.duration = 150; // 2:30 in seconds
        this.audio = null;
        this.progressInterval = null;
        
        this.initializeElements();
        this.bindEvents();
        this.createAudioContext();
    }
    
    initializeElements() {
        this.playBtn = document.getElementById('playBtn');
        this.progressBar = document.getElementById('progressBar');
        this.waveBars = document.querySelectorAll('.wave-bar');
    }
    
    bindEvents() {
        this.playBtn.addEventListener('click', () => this.togglePlay());
        
        // Progress bar click
        const progressContainer = document.querySelector('.progress-container');
        progressContainer.addEventListener('click', (e) => {
            const rect = progressContainer.getBoundingClientRect();
            const clickX = e.clientX - rect.left;
            const percentage = clickX / rect.width;
            this.seekTo(percentage);
        });
    }
    
    createAudioContext() {
        // Create a simple audio context for demo purposes
        // In a real implementation, you would load actual audio files
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            this.createDemoAudio();
        } catch (error) {
            console.log('Web Audio API not supported');
        }
    }
    
    createDemoAudio() {
        // Create a simple demo audio with oscillators
        this.oscillator = this.audioContext.createOscillator();
        this.gainNode = this.audioContext.createGain();
        
        this.oscillator.connect(this.gainNode);
        this.gainNode.connect(this.audioContext.destination);
        
        this.oscillator.frequency.setValueAtTime(220, this.audioContext.currentTime);
        this.oscillator.type = 'sine';
        this.gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
    }
    
    togglePlay() {
        if (this.isPlaying) {
            this.pause();
        } else {
            this.play();
        }
    }
    
    play() {
        this.isPlaying = true;
        this.playBtn.innerHTML = '<i class="fas fa-pause"></i>';
        
        // Start the demo audio
        if (this.audioContext && this.audioContext.state === 'suspended') {
            this.audioContext.resume();
        }
        
        if (this.oscillator) {
            this.gainNode.gain.linearRampToValueAtTime(0.1, this.audioContext.currentTime + 0.1);
        }
        
        // Start progress animation
        this.startProgress();
        
        // Animate wave bars
        this.animateWaveBars(true);
    }
    
    pause() {
        this.isPlaying = false;
        this.playBtn.innerHTML = '<i class="fas fa-play"></i>';
        
        // Stop the demo audio
        if (this.gainNode) {
            this.gainNode.gain.linearRampToValueAtTime(0, this.audioContext.currentTime + 0.1);
        }
        
        // Stop progress animation
        this.stopProgress();
        
        // Stop wave animation
        this.animateWaveBars(false);
    }
    
    startProgress() {
        this.progressInterval = setInterval(() => {
            this.currentTime += 0.1;
            const percentage = (this.currentTime / this.duration) * 100;
            this.progressBar.style.width = percentage + '%';
            
            // Update time display
            this.updateTimeDisplay();
            
            // Auto-stop when reaching the end
            if (this.currentTime >= this.duration) {
                this.pause();
                this.currentTime = 0;
                this.progressBar.style.width = '0%';
            }
        }, 100);
    }
    
    stopProgress() {
        if (this.progressInterval) {
            clearInterval(this.progressInterval);
            this.progressInterval = null;
        }
    }
    
    seekTo(percentage) {
        this.currentTime = (percentage * this.duration);
        this.progressBar.style.width = percentage * 100 + '%';
        this.updateTimeDisplay();
    }
    
    updateTimeDisplay() {
        const minutes = Math.floor(this.currentTime / 60);
        const seconds = Math.floor(this.currentTime % 60);
        const timeString = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        
        const totalMinutes = Math.floor(this.duration / 60);
        const totalSeconds = Math.floor(this.duration % 60);
        const totalTimeString = `${totalMinutes}:${totalSeconds.toString().padStart(2, '0')}`;
        
        const timeDisplay = document.querySelector('.time-display');
        if (timeDisplay) {
            timeDisplay.textContent = `${timeString} / ${totalTimeString}`;
        }
    }
    
    animateWaveBars(animate) {
        this.waveBars.forEach((bar, index) => {
            if (animate) {
                bar.style.animationPlayState = 'running';
            } else {
                bar.style.animationPlayState = 'paused';
            }
        });
    }
}

// Smooth Scrolling for Navigation Links
function initSmoothScrolling() {
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Intersection Observer for Animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
            }
        });
    }, observerOptions);
    
    // Observe all cards and sections
    const elementsToAnimate = document.querySelectorAll('.product-card, .artist-card, .testimonial-card, .video-card');
    elementsToAnimate.forEach(el => {
        observer.observe(el);
    });
}

// Navbar Background on Scroll
function initNavbarScroll() {
    const navbar = document.querySelector('.header');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            navbar.style.background = 'rgba(0, 0, 0, 0.8)';
            navbar.style.backdropFilter = 'blur(15px)';
        } else {
            navbar.style.background = 'rgba(0, 0, 0, 0.3)';
            navbar.style.backdropFilter = 'blur(10px)';
        }
    });
}

// Video Card Interactions
function initVideoCards() {
    const videoCards = document.querySelectorAll('.video-card');
    
    videoCards.forEach(card => {
        card.addEventListener('click', () => {
            // Add a visual feedback
            card.style.transform = 'scale(0.98)';
            setTimeout(() => {
                card.style.transform = '';
            }, 150);
            
            // In a real implementation, you would open a modal or redirect to YouTube
            console.log('Video clicked - would open video player');
        });
    });
}

// Product Card Hover Effects
function initProductCards() {
    const productCards = document.querySelectorAll('.product-card');
    
    productCards.forEach(card => {
        const button = card.querySelector('.btn');
        
        card.addEventListener('mouseenter', () => {
            button.style.background = '#FF10F0';
            button.style.color = 'white';
            button.style.borderColor = '#FF10F0';
        });
        
        card.addEventListener('mouseleave', () => {
            button.style.background = 'transparent';
            button.style.color = '#FF10F0';
            button.style.borderColor = '#FF10F0';
        });
    });
}

// Parallax Effect for Hero Section
function initParallaxEffect() {
    const hero = document.querySelector('.hero');
    
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        
        if (hero) {
            hero.style.transform = `translateY(${rate}px)`;
        }
    });
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize audio player
    const audioPlayer = new AudioPlayer();
    
    // Initialize all other features
    initSmoothScrolling();
    initScrollAnimations();
    initNavbarScroll();
    initVideoCards();
    initProductCards();
    initParallaxEffect();
    
    // Add loading animation
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    }, 100);
    
    console.log('ReverbFX website initialized successfully!');
});

// Add some interactive sound effects (optional)
function playClickSound() {
    // Create a simple click sound using Web Audio API
    if (typeof AudioContext !== 'undefined' || typeof webkitAudioContext !== 'undefined') {
        const audioContext = new (AudioContext || webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.1);
    }
}

// Add click sounds to buttons
document.addEventListener('click', (e) => {
    if (e.target.matches('.btn, .control-btn, .nav-link')) {
        playClickSound();
    }
});

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Spacebar to play/pause audio
    if (e.code === 'Space' && e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
        e.preventDefault();
        const audioPlayer = window.audioPlayer;
        if (audioPlayer) {
            audioPlayer.togglePlay();
        }
    }
});

// Make audio player globally accessible
window.audioPlayer = null;
document.addEventListener('DOMContentLoaded', () => {
    window.audioPlayer = new AudioPlayer();
});
