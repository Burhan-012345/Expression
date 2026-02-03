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

// Voice Note Section Elements
const playPart1Btn = document.getElementById('playPart1Btn');
const playPart2Btn = document.getElementById('playPart2Btn');
const audioPlayer1 = document.getElementById('audioPlayer1');
const audioPlayer2 = document.getElementById('audioPlayer2');
const voiceAudio1 = document.getElementById('voiceAudio1');
const voiceAudio2 = document.getElementById('voiceAudio2');
const playPauseBtn1 = document.getElementById('playPauseBtn1');
const playPauseBtn2 = document.getElementById('playPauseBtn2');
const muteBtn1 = document.getElementById('muteBtn1');
const muteBtn2 = document.getElementById('muteBtn2');
const currentTime1 = document.getElementById('currentTime1');
const currentTime2 = document.getElementById('currentTime2');
const totalTime1 = document.getElementById('totalTime1');
const totalTime2 = document.getElementById('totalTime2');
const audioPart2 = document.getElementById('audioPart2');
const step1 = document.getElementById('step1');
const step2 = document.getElementById('step2');
const waveBars1 = audioPlayer1 ? audioPlayer1.querySelectorAll('.wave-bar') : [];
const waveBars2 = audioPlayer2 ? audioPlayer2.querySelectorAll('.wave-bar') : [];

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
let currentVoicePart = 1;
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
    
    // Voice note buttons events
    if (playPart1Btn) {
        playPart1Btn.addEventListener('click', () => playVoiceNote(1));
    }
    
    if (playPart2Btn) {
        playPart2Btn.addEventListener('click', () => playVoiceNote(2));
    }
    
    // Audio controls events
    if (playPauseBtn1) {
        playPauseBtn1.addEventListener('click', () => toggleVoiceNote(1));
    }
    
    if (playPauseBtn2) {
        playPauseBtn2.addEventListener('click', () => toggleVoiceNote(2));
    }
    
    if (muteBtn1) {
        muteBtn1.addEventListener('click', () => toggleMute(1));
    }
    
    if (muteBtn2) {
        muteBtn2.addEventListener('click', () => toggleMute(2));
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
    
    // Initialize voice audios
    initializeAudioPlayer(1);
    initializeAudioPlayer(2);
    
    // Step indicators
    if (step1) step1.addEventListener('click', () => switchVoicePart(1));
    if (step2) step2.addEventListener('click', () => switchVoicePart(2));
    
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
function playVoiceNote(part) {
    const playBtn = part === 1 ? playPart1Btn : playPart2Btn;
    const audioPlayer = part === 1 ? audioPlayer1 : audioPlayer2;
    const voiceAudio = part === 1 ? voiceAudio1 : voiceAudio2;
    
    // Show audio player
    if (audioPlayer) {
        audioPlayer.classList.remove('hidden');
        audioPlayer.classList.add('show');
    }
    
    // Hide play button
    if (playBtn) {
        playBtn.style.display = 'none';
    }
    
    // Switch to this part
    switchVoicePart(part);
    
    // Play audio after user interaction
    if (voiceAudio) {
        voiceAudio.play()
            .then(() => {
                const playPauseBtn = part === 1 ? playPauseBtn1 : playPauseBtn2;
                if (playPauseBtn) {
                    playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
                }
                animateWaveBars(part, true);
            })
            .catch(error => {
                console.log(`Voice note part ${part} playback failed:`, error);
            });
    }
}

function toggleVoiceNote(part) {
    const voiceAudio = part === 1 ? voiceAudio1 : voiceAudio2;
    const playPauseBtn = part === 1 ? playPauseBtn1 : playPauseBtn2;
    
    if (!voiceAudio) return;
    
    if (voiceAudio.paused) {
        voiceAudio.play();
        if (playPauseBtn) {
            playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
        }
        animateWaveBars(part, true);
    } else {
        voiceAudio.pause();
        if (playPauseBtn) {
            playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
        }
        animateWaveBars(part, false);
    }
}

function toggleMute(part) {
    const voiceAudio = part === 1 ? voiceAudio1 : voiceAudio2;
    const muteBtn = part === 1 ? muteBtn1 : muteBtn2;
    
    if (!voiceAudio || !muteBtn) return;
    
    voiceAudio.muted = !voiceAudio.muted;
    muteBtn.innerHTML = voiceAudio.muted ? 
        '<i class="fas fa-volume-mute"></i>' : 
        '<i class="fas fa-volume-up"></i>';
}

function initializeAudioPlayer(part) {
    const voiceAudio = part === 1 ? voiceAudio1 : voiceAudio2;
    const totalTimeEl = part === 1 ? totalTime1 : totalTime2;
    const currentTimeEl = part === 1 ? currentTime1 : currentTime2;
    const playPauseBtn = part === 1 ? playPauseBtn1 : playPauseBtn2;
    const waveBars = part === 1 ? waveBars1 : waveBars2;
    
    if (!voiceAudio) return;
    
    voiceAudio.addEventListener('loadedmetadata', () => {
        if (totalTimeEl) {
            totalTimeEl.textContent = formatTime(voiceAudio.duration);
        }
    });
    
    voiceAudio.addEventListener('timeupdate', () => {
        if (currentTimeEl) {
            currentTimeEl.textContent = formatTime(voiceAudio.currentTime);
        }
    });
    
    voiceAudio.addEventListener('play', () => {
        if (playPauseBtn) {
            playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
        }
        animateWaveBars(part, true);
    });
    
    voiceAudio.addEventListener('pause', () => {
        if (playPauseBtn) {
            playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
        }
        animateWaveBars(part, false);
    });
    
    voiceAudio.addEventListener('ended', () => {
        if (playPauseBtn) {
            playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
        }
        animateWaveBars(part, false);
        
        // Auto-advance to part 2 when part 1 ends
        if (part === 1 && audioPart2) {
            setTimeout(() => {
                switchVoicePart(2);
            }, 1000);
        }
    });
}

function updateAudioTime(part) {
    const voiceAudio = part === 1 ? voiceAudio1 : voiceAudio2;
    const currentTimeEl = part === 1 ? currentTime1 : currentTime2;
    
    if (voiceAudio && currentTimeEl) {
        currentTimeEl.textContent = formatTime(voiceAudio.currentTime);
    }
}

function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

function animateWaveBars(part, shouldAnimate) {
    const waveBars = part === 1 ? waveBars1 : waveBars2;
    
    waveBars.forEach(bar => {
        if (shouldAnimate) {
            bar.style.animationPlayState = 'running';
        } else {
            bar.style.animationPlayState = 'paused';
        }
    });
}

function switchVoicePart(part) {
    if (part === currentVoicePart) return;
    
    // Stop current audio
    if (currentVoicePart === 1 && voiceAudio1) {
        voiceAudio1.pause();
        if (playPauseBtn1) {
            playPauseBtn1.innerHTML = '<i class="fas fa-play"></i>';
        }
        animateWaveBars(1, false);
    } else if (currentVoicePart === 2 && voiceAudio2) {
        voiceAudio2.pause();
        if (playPauseBtn2) {
            playPauseBtn2.innerHTML = '<i class="fas fa-play"></i>';
        }
        animateWaveBars(2, false);
    }
    
    // Show/hide appropriate elements
    if (part === 2 && audioPart2) {
        audioPart2.classList.remove('hidden');
        audioPart2.classList.add('show');
    }
    
    // Update step indicators
    if (step1 && step2) {
        if (part === 1) {
            step1.classList.add('active');
            step2.classList.remove('active');
        } else {
            step1.classList.remove('active');
            step2.classList.add('active');
        }
    }
    
    currentVoicePart = part;
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
    playVoiceNote: (part) => playVoiceNote(part || 1)
};