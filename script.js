// Initialize background music
const audio = document.getElementById('bg-music');
audio.volume = 0.3;

// Music button functionality
const musicButton = document.getElementById('startMusic');
musicButton.addEventListener('click', () => {
  if (audio.paused) {
    audio.play()
      .then(() => {
        musicButton.textContent = '🔊 Music Playing';
        musicButton.classList.add('playing');
      })
      .catch(error => {
        console.error('Error playing audio:', error);
        musicButton.textContent = '❌ Click to Play';
      });
  } else {
    audio.pause();
    musicButton.textContent = '🎵 Play Music';
    musicButton.classList.remove('playing');
  }
});

// Create shooting stars
function createHeart() {
  const star = document.createElement('div');
  star.className = 'floating-heart';
  star.innerHTML = '⭐';
  star.style.left = Math.random() * window.innerWidth + 'px';
  star.style.top = Math.random() * window.innerHeight + 'px';
  star.style.fontSize = Math.random() * 15 + 8 + 'px';
  star.style.animationDuration = Math.random() * 1.5 + 1 + 's';
  document.querySelector('.floating-hearts').appendChild(star);
  
  // Remove star after animation
  setTimeout(() => {
    star.remove();
  }, 3000);
}

// Start star animation
function startHeartAnimation() {
  // Create initial batch of stars
  for (let i = 0; i < 10; i++) {
    setTimeout(() => createHeart(), i * 200);
  }
  
  // Continue creating stars at regular intervals
  setInterval(createHeart, 200);
}

// Initialize notes
function initNotes() {
  const notes = document.querySelectorAll('.note');
  
  notes.forEach(note => {
    // Set random initial rotation
    const rotation = Math.random() * 20 - 10;
    note.style.setProperty('--rotation', `${rotation}deg`);
    
    // Add hover effect
    note.addEventListener('mouseenter', () => {
      createHeart();
    });
    
    // Make notes draggable
    let isDragging = false;
    let currentX;
    let currentY;
    let initialX;
    let initialY;
    let xOffset = 0;
    let yOffset = 0;
    
    note.addEventListener('mousedown', dragStart);
    note.addEventListener('mousemove', drag);
    note.addEventListener('mouseup', dragEnd);
    note.addEventListener('mouseleave', dragEnd);
    
    // Touch events
    note.addEventListener('touchstart', dragStart);
    note.addEventListener('touchmove', drag);
    note.addEventListener('touchend', dragEnd);
    
    function dragStart(e) {
      if (e.type === 'touchstart') {
        initialX = e.touches[0].clientX - xOffset;
        initialY = e.touches[0].clientY - yOffset;
      } else {
        initialX = e.clientX - xOffset;
        initialY = e.clientY - yOffset;
      }
      
      if (e.target === note) {
        isDragging = true;
        note.style.zIndex = 1000;
        note.style.transform = `scale(1.1) rotate(0deg)`;
      }
    }
    
    function drag(e) {
      if (isDragging) {
        e.preventDefault();
        
        if (e.type === 'touchmove') {
          currentX = e.touches[0].clientX - initialX;
          currentY = e.touches[0].clientY - initialY;
        } else {
          currentX = e.clientX - initialX;
          currentY = e.clientY - initialY;
        }
        
        // Constrain to viewport
        const rect = note.getBoundingClientRect();
        const maxX = window.innerWidth - rect.width;
        const maxY = window.innerHeight - rect.height;
        
        xOffset = Math.max(0, Math.min(currentX, maxX));
        yOffset = Math.max(0, Math.min(currentY, maxY));
        
        note.style.transform = `translate(${xOffset}px, ${yOffset}px) scale(1.1) rotate(0deg)`;
      }
    }
    
    function dragEnd() {
      if (isDragging) {
        isDragging = false;
        note.style.zIndex = 3;
        note.style.transform = `translate(${xOffset}px, ${yOffset}px) scale(1) rotate(var(--rotation))`;
        createHeart();
      }
    }
  });
}

// Handle window resize
window.addEventListener('resize', () => {
  const notes = document.querySelectorAll('.note');
  notes.forEach(note => {
    const rect = note.getBoundingClientRect();
    const maxX = window.innerWidth - rect.width;
    const maxY = window.innerHeight - rect.height;
    
    const currentX = parseInt(note.style.transform.match(/translate\((\d+)px/)?.[1] || '0');
    const currentY = parseInt(note.style.transform.match(/translate\(\d+px, (\d+)px/)?.[1] || '0');
    
    const newX = Math.min(currentX, maxX);
    const newY = Math.min(currentY, maxY);
    
    note.style.transform = `translate(${newX}px, ${newY}px) rotate(var(--rotation))`;
  });
});

// Mirror and Compliments
const compliments = [
  `You've always been beautiful.
  To me, you're the most beautiful person I've ever met.
  
  Not just in how you look,
  but in how you carry yourself, how you care,
  and how you make everything feel brighter.
  
  You're the first person who truly understood me —
  the first time I felt like I could just be me.
  
  Around you, I can talk freely,
  share my excitement,
  and say whatever's on my mind without worry.
  
  That kind of comfort means more to me than I can say.
  
  No gift I buy could ever express
  my gratitude, so I made this instead.
  
  Happy Birthday, Yi Tong!!
  
  Here's to more moments and memories,
  and everything still to come.
  
  You'll always have a place in my thoughts.
  
  —Charan`
];

const mirror = document.querySelector('.magic-mirror');
const modal = document.querySelector('.compliment-modal');
const complimentText = document.querySelector('.compliment-text');
const closeButton = document.querySelector('.close-compliment');

function getRandomCompliment() {
  return compliments[0]; // Since we only have one message now
}

function showCompliment() {
  const modal = document.querySelector('.compliment-modal');
  const text = document.querySelector('.compliment-text');
  const compliment = compliments[Math.floor(Math.random() * compliments.length)];
  
  modal.classList.add('active');
  text.textContent = '';
  
  let i = 0;
  const words = compliment.split(' ');
  
  function writeWord() {
    if (i < words.length) {
      const word = words[i];
      let j = 0;
      
      function writeChar() {
        if (j < word.length) {
          text.textContent += word[j];
          j++;
          setTimeout(writeChar, 20); // Reduced from 100ms to 20ms for faster typing
        } else {
          text.textContent += ' ';
          i++;
          setTimeout(writeWord, 50); // Reduced from 200ms to 50ms for faster word transition
        }
      }
      
      writeChar();
    }
  }
  
  writeWord();
}

function hideCompliment() {
  modal.classList.remove('active');
}

// Mirror click event
mirror.addEventListener('click', showCompliment);

// Close button click event
closeButton.addEventListener('click', hideCompliment);

// Close modal when clicking outside
modal.addEventListener('click', (e) => {
  if (e.target === modal) {
    hideCompliment();
  }
});

// Initialize everything when the page loads
window.addEventListener('load', () => {
  startHeartAnimation();
  initNotes();
});
