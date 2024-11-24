class GameEngine {
    constructor(canvas, onGameOver) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.onGameOver = onGameOver;
        
        // Game state
        this.isRunning = false;
        this.score = 0;
        this.snowflakes = [];
        this.backgroundOffset = 0;
        
        // Sleigh properties
        this.sleigh = {
            x: canvas.width / 2,
            y: canvas.height - 60,
            width: 50,
            height: 30,
            speed: 0,
            maxSpeed: 8,
            acceleration: 0.5,
            deceleration: 0.2
        };
        
        // Controls state
        this.keys = {
            left: false,
            right: false
        };
        
        // Game settings
        this.settings = {
            snowflakeSpawnRate: 50,
            snowflakeSpeedMin: 2,
            snowflakeSpeedMax: 4,
            snowflakeSizeMin: 5,
            snowflakeSizeMax: 15,
            backgroundSpeed: 2
        };
        
        // Bind methods
        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.handleKeyUp = this.handleKeyUp.bind(this);
        this.gameLoop = this.gameLoop.bind(this);
        
        // Initialize event listeners
        this.setupEventListeners();
    }
    
    setupEventListeners() {
        window.addEventListener('keydown', this.handleKeyDown);
        window.addEventListener('keyup', this.handleKeyUp);
    }
    
    removeEventListeners() {
        window.removeEventListener('keydown', this.handleKeyDown);
        window.removeEventListener('keyup', this.handleKeyUp);
    }
    
    handleKeyDown(event) {
        if (event.key === 'ArrowLeft') this.keys.left = true;
        if (event.key === 'ArrowRight') this.keys.right = true;
    }
    
    handleKeyUp(event) {
        if (event.key === 'ArrowLeft') this.keys.left = false;
        if (event.key === 'ArrowRight') this.keys.right = false;
    }
    
    start() {
        this.isRunning = true;
        this.score = 0;
        this.snowflakes = [];
        this.sleigh.x = this.canvas.width / 2;
        this.sleigh.speed = 0;
        requestAnimationFrame(this.gameLoop);
    }
    
    stop() {
        this.isRunning = false;
        this.removeEventListeners();
    }
    
    createSnowflake() {
        return {
            x: Math.random() * this.canvas.width,
            y: -20,
            size: Math.random() * (this.settings.snowflakeSizeMax - this.settings.snowflakeSizeMin) + this.settings.snowflakeSizeMin,
            speed: Math.random() * (this.settings.snowflakeSpeedMax - this.settings.snowflakeSpeedMin) + this.settings.snowflakeSpeedMin
        };
    }
    
    updateSleigh() {
        // Update sleigh speed based on input
        if (this.keys.left) {
            this.sleigh.speed = Math.max(this.sleigh.speed - this.sleigh.acceleration, -this.sleigh.maxSpeed);
        } else if (this.keys.right) {
            this.sleigh.speed = Math.min(this.sleigh.speed + this.sleigh.acceleration, this.sleigh.maxSpeed);
        } else {
            // Apply deceleration when no keys are pressed
            if (Math.abs(this.sleigh.speed) < this.sleigh.deceleration) {
                this.sleigh.speed = 0;
            } else {
                this.sleigh.speed *= 0.95;
            }
        }
        
        // Update sleigh position
        this.sleigh.x += this.sleigh.speed;
        
        // Keep sleigh within canvas bounds
        this.sleigh.x = Math.max(this.sleigh.width / 2, Math.min(this.canvas.width - this.sleigh.width / 2, this.sleigh.x));
    }
    
    updateSnowflakes() {
        // Create new snowflakes
        if (Math.random() * 100 < this.settings.snowflakeSpawnRate) {
            this.snowflakes.push(this.createSnowflake());
        }
        
        // Update existing snowflakes
        for (let i = this.snowflakes.length - 1; i >= 0; i--) {
            const snowflake = this.snowflakes[i];
            snowflake.y += snowflake.speed;
            
            // Remove snowflakes that are off screen
            if (snowflake.y > this.canvas.height) {
                this.snowflakes.splice(i, 1);
                this.score++;
            }
            
            // Check collision with sleigh
            if (this.checkCollision(snowflake)) {
                this.gameOver();
                return;
            }
        }
    }
    
    checkCollision(snowflake) {
        const sleighLeft = this.sleigh.x - this.sleigh.width / 2;
        const sleighRight = this.sleigh.x + this.sleigh.width / 2;
        const sleighTop = this.sleigh.y - this.sleigh.height / 2;
        const sleighBottom = this.sleigh.y + this.sleigh.height / 2;
        
        return (
            snowflake.x > sleighLeft &&
            snowflake.x < sleighRight &&
            snowflake.y > sleighTop &&
            snowflake.y < sleighBottom
        );
    }
    
    updateBackground() {
        this.backgroundOffset = (this.backgroundOffset + this.settings.backgroundSpeed) % this.canvas.height;
    }
    
    drawBackground() {
        this.ctx.fillStyle = '#87CEEB'; // Sky blue
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw scrolling snow pattern
        this.ctx.fillStyle = '#FFFFFF';
        for (let y = -this.backgroundOffset; y < this.canvas.height; y += 50) {
            for (let x = 0; x < this.canvas.width; x += 50) {
                this.ctx.beginPath();
                this.ctx.arc(x, y, 2, 0, Math.PI * 2);
                this.ctx.fill();
            }
        }
    }
    
    drawSleigh() {
        this.ctx.fillStyle = '#8B4513'; // Saddle brown
        this.ctx.beginPath();
        this.ctx.rect(
            this.sleigh.x - this.sleigh.width / 2,
            this.sleigh.y - this.sleigh.height / 2,
            this.sleigh.width,
            this.sleigh.height
        );
        this.ctx.fill();
    }
    
    drawSnowflakes() {
        this.ctx.fillStyle = '#FFFFFF';
        for (const snowflake of this.snowflakes) {
            this.ctx.beginPath();
            this.ctx.arc(snowflake.x, snowflake.y, snowflake.size / 2, 0, Math.PI * 2);
            this.ctx.fill();
        }
    }
    
    gameOver() {
        this.isRunning = false;
        this.onGameOver(this.score);
    }
    
    gameLoop() {
        if (!this.isRunning) return;
        
        // Update game state
        this.updateSleigh();
        this.updateSnowflakes();
        this.updateBackground();
        
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw game elements
        this.drawBackground();
        this.drawSleigh();
        this.drawSnowflakes();
        
        // Continue game loop
        requestAnimationFrame(this.gameLoop);
    }
}
