// DOM Elements
const sections = document.querySelectorAll('.section');
const mainContainer = document.getElementById('mainContainer');
const progressBar = document.getElementById('progressBar');
const progressDots = document.querySelectorAll('.progress-dot');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const bgMusic = document.getElementById('bgMusic');
const startBtn = document.getElementById('startBtn');
const musicToggle = document.getElementById('musicToggle');
const typewriterText = document.getElementById('typewriter-text');
const allNextBtns = document.querySelectorAll('.next-section-btn');
const allPrevBtns = document.querySelectorAll('.prev-section-btn');

// New DOM Elements for Voice Note Section
const playVoiceBtn = document.getElementById('playVoiceBtn');
const audioPlayer = document.getElementById('audioPlayer');
const voiceAudio = document.getElementById('voiceAudio');
const playPauseBtn = document.getElementById('playPauseBtn');
const muteBtn = document.getElementById('muteBtn');
const currentTimeEl = document.getElementById('currentTime');
const totalTimeEl = document.getElementById('totalTime');
const waveBars = document.querySelectorAll('.wave-bar');

// Configuration
const typewriterMessages = [
    "Mere feelings ko shabdon mein bayaan karna mushkil hai...",
    "Lekin main try karta hoon...",
    "Har roz, har pal, dil mein ek ehsaas rehta hai...",
    "Ek ajeeb si khushi milti hai sochne se...",
    "Main seriously sochta hoon, seriously mehsoos karta hoon...",
    "Bas yeh kehna chahta hoon: feelings asli hain, dil se hain."
];

let currentSection = 0;
let isMusicPlaying = false;
let isVoiceNotePlaying = false;
let typewriterInterval;

// Initialize the website
function init() {
    // Set first section as active
    updateSection();
    
    // Add blur effect on load
    document.body.classList.add('page-blur');
    setTimeout(() => {
        document.body.classList.remove('page-blur');
        document.body.classList.add('page-clear');
    }, 1500);
    
    // Add click events to navigation buttons
    prevBtn.addEventListener('click', goToPrevSection);
    nextBtn.addEventListener('click', goToNextSection);
    
    // Add click events to progress dots
    progressDots.forEach(dot => {
        dot.addEventListener('click', () => {
            const index = parseInt(dot.getAttribute('data-index'));
            goToSection(index);
        });
    });
    
    // Start button event
    startBtn.addEventListener('click', startExperience);
    
    // Music toggle event
    musicToggle.addEventListener('click', toggleMusic);
    
    // Voice note button event
    if (playVoiceBtn) {
        playVoiceBtn.addEventListener('click', playVoiceNote);
    }
    
    // Audio controls events
    if (playPauseBtn) {
        playPauseBtn.addEventListener('click', toggleVoiceNote);
    }
    
    if (muteBtn) {
        muteBtn.addEventListener('click', toggleMute);
    }
    
    // Section navigation buttons
    allNextBtns.forEach(btn => {
        btn.addEventListener('click', goToNextSection);
    });
    
    allPrevBtns.forEach(btn => {
        btn.addEventListener('click', goToPrevSection);
    });
    
    // Initialize confession text with typewriter effect
    if (typewriterText) {
        startTypewriterEffect();
    }
    
    // Initialize voice audio
    if (voiceAudio) {
        voiceAudio.addEventListener('loadedmetadata', updateAudioDuration);
        voiceAudio.addEventListener('timeupdate', updateAudioTime);
        voiceAudio.addEventListener('play', () => {
            playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
            animateWaveBars(true);
        });
        voiceAudio.addEventListener('pause', () => {
            playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
            animateWaveBars(false);
        });
        voiceAudio.addEventListener('ended', () => {
            playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
            animateWaveBars(false);
        });
    }
    
    // Keyboard navigation
    document.addEventListener('keydown', handleKeyboardNavigation);
}

// Update section display
function updateSection() {
    // Update main container position
    mainContainer.style.transform = `translateX(-${currentSection * 100}vw)`;
    
    // Update active section class
    sections.forEach((section, index) => {
        if (index === currentSection) {
            section.classList.add('active');
        } else {
            section.classList.remove('active');
        }
    });
    
    // Update progress bar
    progressBar.style.width = `${((currentSection + 1) / sections.length) * 100}%`;
    
    // Update progress dots
    progressDots.forEach((dot, index) => {
        if (index === currentSection) {
            dot.classList.add('active');
        } else {
            dot.classList.remove('active');
        }
    });
    
    // Update navigation buttons
    prevBtn.disabled = currentSection === 0;
    nextBtn.disabled = currentSection === sections.length - 1;
    
    // Hide next button on first section when not started
    if (currentSection === 0) {
        nextBtn.style.visibility = 'hidden';
    } else {
        nextBtn.style.visibility = 'visible';
    }
}

// Go to specific section
function goToSection(index) {
    if (index >= 0 && index < sections.length) {
        currentSection = index;
        updateSection();
    }
}

// Go to next section
function goToNextSection() {
    if (currentSection < sections.length - 1) {
        currentSection++;
        updateSection();
    }
}

// Go to previous section
function goToPrevSection() {
    if (currentSection > 0) {
        currentSection--;
        updateSection();
    }
}

// Start the experience
function startExperience() {
    // Start background music
    bgMusic.volume = 0.5;
    bgMusic.play()
        .then(() => {
            isMusicPlaying = true;
            musicToggle.innerHTML = '<i class="fas fa-volume-up"></i>';
        })
        .catch(error => {
            console.log("Music playback failed:", error);
        });
    
    // Go to next section
    goToNextSection();
    
    // Change button text
    startBtn.textContent = "Thank you for starting ";
    startBtn.innerHTML += '<i class="fas fa-heart"></i>';
    startBtn.disabled = true;
}

// Toggle background music
function toggleMusic() {
    if (isMusicPlaying) {
        bgMusic.pause();
        musicToggle.innerHTML = '<i class="fas fa-volume-mute"></i>';
    } else {
        bgMusic.play()
            .then(() => {
                musicToggle.innerHTML = '<i class="fas fa-volume-up"></i>';
            })
            .catch(error => {
                console.log("Music playback failed:", error);
            });
    }
    isMusicPlaying = !isMusicPlaying;
}

// Typewriter Effect
function startTypewriterEffect() {
    let currentMessage = 0;
    let currentChar = 0;
    let isDeleting = false;
    const typingSpeed = 50;
    const deletingSpeed = 30;
    const pauseBetweenMessages = 1500;
    
    typewriterText.textContent = '';
    
    function type() {
        const currentText = typewriterMessages[currentMessage];
        
        if (isDeleting) {
            typewriterText.textContent = currentText.substring(0, currentChar - 1);
            currentChar--;
        } else {
            typewriterText.textContent = currentText.substring(0, currentChar + 1);
            currentChar++;
        }
        
        if (!isDeleting && currentChar === currentText.length) {
            isDeleting = true;
            clearInterval(typewriterInterval);
            typewriterInterval = setTimeout(type, pauseBetweenMessages);
            return;
        }
        
        if (isDeleting && currentChar === 0) {
            isDeleting = false;
            currentMessage = (currentMessage + 1) % typewriterMessages.length;
        }
        
        const speed = isDeleting ? deletingSpeed : typingSpeed;
        clearInterval(typewriterInterval);
        typewriterInterval = setTimeout(type, speed);
    }
    
    typewriterInterval = setTimeout(type, typingSpeed);
}

// Voice Note Functions
function playVoiceNote() {
    // Show audio player
    audioPlayer.classList.remove('hidden');
    audioPlayer.classList.add('show');
    
    // Hide play voice button
    playVoiceBtn.style.display = 'none';
    
    // Play audio after user interaction
    voiceAudio.play()
        .then(() => {
            isVoiceNotePlaying = true;
            playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
            animateWaveBars(true);
        })
        .catch(error => {
            console.log("Voice note playback failed:", error);
        });
}

function toggleVoiceNote() {
    if (voiceAudio.paused) {
        voiceAudio.play();
        playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
        animateWaveBars(true);
    } else {
        voiceAudio.pause();
        playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
        animateWaveBars(false);
    }
}

function toggleMute() {
    voiceAudio.muted = !voiceAudio.muted;
    muteBtn.innerHTML = voiceAudio.muted ? 
        '<i class="fas fa-volume-mute"></i>' : 
        '<i class="fas fa-volume-up"></i>';
}

function updateAudioDuration() {
    const duration = voiceAudio.duration;
    totalTimeEl.textContent = formatTime(duration);
}

function updateAudioTime() {
    const currentTime = voiceAudio.currentTime;
    currentTimeEl.textContent = formatTime(currentTime);
}

function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

function animateWaveBars(shouldAnimate) {
    waveBars.forEach(bar => {
        if (shouldAnimate) {
            bar.style.animationPlayState = 'running';
        } else {
            bar.style.animationPlayState = 'paused';
        }
    });
}

// Handle keyboard navigation
function handleKeyboardNavigation(event) {
    if (event.key === 'ArrowRight' || event.key === ' ') {
        goToNextSection();
        event.preventDefault();
    } else if (event.key === 'ArrowLeft') {
        goToPrevSection();
        event.preventDefault();
    } else if (event.key === 'Home') {
        goToSection(0);
        event.preventDefault();
    } else if (event.key === 'End') {
        goToSection(sections.length - 1);
        event.preventDefault();
    } else if (event.key === 'm' || event.key === 'M') {
        toggleMusic();
        event.preventDefault();
    }
}

// Enable audio on user interaction
document.body.addEventListener('click', function() {
    if (bgMusic.paused) {
        bgMusic.volume = 0;
        bgMusic.play().then(() => {
            bgMusic.pause();
            bgMusic.volume = 0.5;
        });
    }
}, { once: true });

// Initialize when page loads
window.addEventListener('DOMContentLoaded', init);

// Export functions for use in other pages
window.websiteFunctions = {
    goToSection,
    toggleMusic,
    startTypewriterEffect,
    playVoiceNote
};