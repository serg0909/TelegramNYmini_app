// Initialize Telegram WebApp
const tg = window.Telegram.WebApp;
tg.expand();

// Get user data
const user = tg.initDataUnsafe.user;
const username = user ? (user.username || user.first_name) : 'Guest';

// Game elements
const canvas = document.getElementById('gameCanvas');
const gameMenu = document.getElementById('gameMenu');
const welcomeMessage = document.getElementById('welcomeMessage');
const gameTitle = document.getElementById('gameTitle');
const startGameButton = document.getElementById('startGameButton');
const instructions = document.getElementById('instructions');
const instructionsText = document.getElementById('instructionsText');
const startButton = document.getElementById('startButton');
const scoreDisplay = document.getElementById('score');
const gameOverScreen = document.getElementById('gameOverScreen');
const gameOverTitle = document.getElementById('gameOverTitle');
const finalScore = document.getElementById('finalScore');
const playAgainButton = document.getElementById('playAgainButton');
const backToMenuButton = document.getElementById('backToMenuButton');

// Game state
let gameEngine = null;

// Track app launch
async function trackLaunch() {
    try {
        const response = await fetch('/api/track-launch', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                user_id: user.id
            })
        });
        const data = await response.json();
        console.log('Launch tracked:', data);
    } catch (error) {
        console.error('Error tracking launch:', error);
    }
}

// Initialize UI with translations
async function initializeUI() {
    // Set language based on user's Telegram settings
    await translator.setLanguage(user?.language_code || 'en');
    
    // Update welcome message and title
    welcomeMessage.textContent = translator.getText('welcome_message', { username });
    gameTitle.textContent = translator.getText('game_title');
    startGameButton.textContent = translator.getText('start_game_button');
    
    // Setup button event listeners
    startGameButton.onclick = showInstructions;
    startButton.onclick = startGame;
    playAgainButton.onclick = restartGame;
    backToMenuButton.onclick = showMenu;
    
    // Initialize game buttons
    playAgainButton.textContent = translator.getText('play_again');
    backToMenuButton.textContent = translator.getText('back_to_menu');
    startButton.textContent = translator.getText('start_game_button');
}

function showInstructions() {
    gameMenu.style.display = 'none';
    instructions.style.display = 'block';
    instructionsText.textContent = translator.getText('game_instructions');
}

function showMenu() {
    canvas.style.display = 'none';
    gameOverScreen.style.display = 'none';
    scoreDisplay.style.display = 'none';
    gameMenu.style.display = 'block';
    welcomeMessage.style.display = 'block';
    
    if (gameEngine) {
        gameEngine.stop();
        gameEngine = null;
    }
}

function updateScore(score) {
    scoreDisplay.textContent = translator.getText('current_score', { score });
}

function onGameOver(finalScoreValue) {
    gameOverScreen.style.display = 'block';
    gameOverTitle.textContent = translator.getText('game_over');
    finalScore.textContent = translator.getText('final_score', { score: finalScoreValue });
}

function startGame() {
    // Hide menus
    gameMenu.style.display = 'none';
    instructions.style.display = 'none';
    welcomeMessage.style.display = 'none';
    gameOverScreen.style.display = 'none';
    
    // Show game elements
    canvas.style.display = 'block';
    scoreDisplay.style.display = 'block';
    
    // Set canvas size
    canvas.width = Math.min(window.innerWidth - 40, 600);
    canvas.height = Math.min(window.innerHeight - 100, 800);
    
    // Initialize game engine
    gameEngine = new GameEngine(canvas, onGameOver);
    gameEngine.start();
    
    // Start score update loop
    function updateGameScore() {
        if (gameEngine && gameEngine.isRunning) {
            updateScore(gameEngine.score);
            requestAnimationFrame(updateGameScore);
        }
    }
    updateGameScore();
}

function restartGame() {
    gameOverScreen.style.display = 'none';
    startGame();
}

// Initialize game when page loads
document.addEventListener('DOMContentLoaded', async () => {
    await initializeUI();
    
    // Track the launch
    if (user && user.id) {
        trackLaunch();
    }
});
