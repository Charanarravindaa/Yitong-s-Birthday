// Make the game instance globally accessible
let gameInstance = null;

class KittyFoodieGame {
  constructor() {
    console.log('Game constructor called');
    
    // Create game container
    this.gameContainer = document.createElement('div');
    this.gameContainer.className = 'game-container';
    this.gameContainer.innerHTML = `
      <div class="game-wrapper">
        <div class="score">Score: <span id="scoreValue">0</span></div>
        <div class="lyrics-container">
          <div class="lyrics"></div>
        </div>
        <div class="cat"></div>
        <div class="game-over">
          <h2>Game Over!</h2>
          <p>Your final score: <span id="finalScore">0</span></p>
          <button id="playAgain">Play Again!</button>
        </div>
      </div>
    `;
    document.body.appendChild(this.gameContainer);

    // Initialize game state
    this.score = 0;
    this.gameActive = false;
    this.foodItems = [];
    this.goodFoods = ['fish', 'cake', 'cookie'];
    this.badFoods = ['sock', 'bug', 'vegetable'];

    // Get DOM elements
    this.cat = this.gameContainer.querySelector('.cat');
    this.scoreElement = this.gameContainer.querySelector('#scoreValue');
    this.finalScoreElement = this.gameContainer.querySelector('#finalScore');
    this.gameOverScreen = this.gameContainer.querySelector('.game-over');
    this.playAgainButton = this.gameContainer.querySelector('#playAgain');
    this.lyricsElement = this.gameContainer.querySelector('.lyrics');

    // Lyrics data
    this.lyrics = [
      { time: 0, text: "Happy birthday to you" },
      { time: 3, text: "Happy birthday to you" },
      { time: 6, text: "Happy birthday dear friend" },
      { time: 9, text: "Happy birthday to you" }
    ];

    // Set up event listeners
    this.setupEventListeners();
  }

  setupEventListeners() {
    console.log('Setting up event listeners');
    
    // Music button
    const musicButton = document.getElementById('startMusic');
    const bgMusic = document.getElementById('bg-music');
    
    if (musicButton && bgMusic) {
      console.log('Music button and audio element found');
      musicButton.addEventListener('click', () => {
        console.log('Music button clicked');
        if (bgMusic.paused) {
          bgMusic.play()
            .then(() => {
              console.log('Music started playing');
              musicButton.textContent = '🎵 Stop Music';
              musicButton.classList.add('playing');
            })
            .catch(error => {
              console.error('Playback prevented:', error);
            });
        } else {
          bgMusic.pause();
          musicButton.textContent = '🎵 Play Music';
          musicButton.classList.remove('playing');
        }
      });
    } else {
      console.error('Music button or audio element not found');
    }

    // Game button
    const startButton = document.getElementById('startGame');
    if (startButton) {
      console.log('Game button found');
      startButton.addEventListener('click', () => {
        console.log('Game button clicked');
        this.startGame();
      });
    } else {
      console.error('Game button not found');
    }

    // Play again button
    if (this.playAgainButton) {
      this.playAgainButton.addEventListener('click', () => {
        console.log('Play again button clicked');
        this.restartGame();
      });
    }
  }

  startGame() {
    console.log('Starting game');
    try {
      this.gameContainer.style.display = 'flex';
      this.gameActive = true;
      this.score = 0;
      this.updateScore();
      this.spawnFood();
      this.moveCat();
      this.startLyrics();
      console.log('Game started successfully');
    } catch (error) {
      console.error('Error starting game:', error);
    }
  }

  startLyrics() {
    let currentLyricIndex = 0;
    const updateLyrics = () => {
      if (!this.gameActive) return;

      const currentTime = document.getElementById('bg-music').currentTime;
      
      if (currentLyricIndex < this.lyrics.length && 
          currentTime >= this.lyrics[currentLyricIndex].time) {
        this.lyricsElement.textContent = this.lyrics[currentLyricIndex].text;
        this.lyricsElement.classList.add('active');
        setTimeout(() => {
          this.lyricsElement.classList.remove('active');
        }, 2000);
        currentLyricIndex++;
      }

      requestAnimationFrame(updateLyrics);
    };

    updateLyrics();
  }

  restartGame() {
    console.log('Restarting game');
    this.gameOverScreen.style.display = 'none';
    this.foodItems.forEach(food => food.element.remove());
    this.foodItems = [];
    this.startGame();
  }

  spawnFood() {
    if (!this.gameActive) return;

    const isGoodFood = Math.random() > 0.3;
    const foodType = isGoodFood 
      ? this.goodFoods[Math.floor(Math.random() * this.goodFoods.length)]
      : this.badFoods[Math.floor(Math.random() * this.badFoods.length)];

    const food = document.createElement('div');
    food.className = `food ${foodType}`;
    food.style.left = `${Math.random() * 700}px`;
    food.style.top = '-50px';
    this.gameContainer.querySelector('.game-wrapper').appendChild(food);

    this.foodItems.push({
      element: food,
      type: foodType,
      isGood: isGoodFood,
      speed: 2 + Math.random() * 3
    });

    setTimeout(() => this.spawnFood(), 1000 + Math.random() * 2000);
  }

  moveCat() {
    if (!this.gameActive) return;

    const gameWidth = this.gameContainer.querySelector('.game-wrapper').offsetWidth;
    const catWidth = this.cat.offsetWidth;
    let catPosition = (gameWidth - catWidth) / 2;

    document.addEventListener('mousemove', (e) => {
      if (!this.gameActive) return;
      const rect = this.gameContainer.getBoundingClientRect();
      catPosition = e.clientX - rect.left - catWidth / 2;
      catPosition = Math.max(0, Math.min(catPosition, gameWidth - catWidth));
      this.cat.style.left = `${catPosition}px`;
    });

    this.updateGame();
  }

  updateGame() {
    if (!this.gameActive) return;

    this.foodItems.forEach((food, index) => {
      const currentTop = parseFloat(food.element.style.top);
      food.element.style.top = `${currentTop + food.speed}px`;

      if (this.checkCollision(food)) {
        this.handleCollision(food, index);
      } else if (currentTop > 600) {
        food.element.remove();
        this.foodItems.splice(index, 1);
      }
    });

    requestAnimationFrame(() => this.updateGame());
  }

  checkCollision(food) {
    const catRect = this.cat.getBoundingClientRect();
    const foodRect = food.element.getBoundingClientRect();

    return !(
      catRect.right < foodRect.left ||
      catRect.left > foodRect.right ||
      catRect.bottom < foodRect.top ||
      catRect.top > foodRect.bottom
    );
  }

  handleCollision(food, index) {
    food.element.remove();
    this.foodItems.splice(index, 1);

    if (food.isGood) {
      this.score += 10;
      this.cat.classList.add('happy');
      setTimeout(() => this.cat.classList.remove('happy'), 1000);
    } else {
      this.score = Math.max(0, this.score - 5);
      this.cat.classList.add('disgusted');
      setTimeout(() => this.cat.classList.remove('disgusted'), 1000);
    }

    this.updateScore();
  }

  updateScore() {
    this.scoreElement.textContent = this.score;
    this.finalScoreElement.textContent = this.score;
  }

  gameOver() {
    this.gameActive = false;
    this.gameOverScreen.style.display = 'block';
  }
}

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM Content Loaded');
  try {
    gameInstance = new KittyFoodieGame();
    window.game = gameInstance;
    console.log('Game initialized successfully');
  } catch (error) {
    console.error('Error initializing game:', error);
  }
}); 