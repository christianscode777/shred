import Phaser from 'phaser';
import Player from './player'; 
import Enemy from './enemy'; 

class MyGame extends Phaser.Scene {
    constructor() {
        super('mygame'); 
    } 

    preload() {
        this.load.spritesheet('mySpriteSheet', 'assets/images/player-sprite.png', {
            frameWidth: 128, 
            frameHeight: 128
        });

        this.load.spritesheet('enemySpriteSheet', 'assets/images/enemy-sprite.png', {
            frameWidth: 100, 
            frameHeight: 100
        });
       
        this.load.image('tileSprite', 'assets/images/ground.png'); 
        this.load.image('background', 'assets/images/level-1.png');
    }

    create() {
        // Set the world bounds
        const worldWidth = 9999; // Adjust to the width of your level
        this.physics.world.setBounds(0, 0, worldWidth, this.sys.game.config.height);
    
        // Add the background image
        let bg = this.add.image(0, 0, 'background').setOrigin(0, 0);
        bg.displayWidth = worldWidth; // Make background as wide as the level
        bg.displayHeight = this.sys.game.config.height;
    
        // Optional: Apply a small parallax effect
        bg.setScrollFactor(0.8);
    
        // Add the player
        this.player = this.initializePlayer(220, 900);  

        // Add enemy group
        this.enemies = this.physics.add.group(); 

        // Initialize enemies
        this.spawnInitialEnemies();
    
        // Set the ground position to just above the bottom of the game screen
        let groundHeight = 200; // The height of the ground
        let groundY = this.sys.game.config.height - groundHeight / 2 - 10; // Move it up slightly
        const ground = this.add.tileSprite(
            this.sys.game.config.width / 2, // Centered horizontally
            groundY,
            this.sys.game.config.width * 4, // Double the width for side-scrolling
            groundHeight,
            'tileSprite'
        );
        this.physics.add.existing(ground, true);
    
        // Add collider between player and ground
        this.physics.add.collider(this.player, ground); 
        this.physics.add.collider(this.enemies, ground); // Add this line

        this.cameras.main.setBounds(0, 0, worldWidth, this.sys.game.config.height);
        this.cameras.main.startFollow(this.player, true, 0.08, 0.08);
    }

    initializePlayer(x, y) {
        return new Player(this, x, y);
    }

    initializeEnemy(x, y) {
        return new Enemy(this, x, y);
    }

    spawnInitialEnemies() {
        this.originalEnemySpawn = { x: 220, y: 920 }; 
        this.respawnEnemies(); // Call respawnEnemies method to spawn initial enemies
    }

    respawnEnemies() {
        let numEnemies = 2;
        for (let i = 0; i < numEnemies; i++) {
            let adjustedX = this.originalEnemySpawn.x + i * 50;
            let newEnemy = this.initializeEnemy(adjustedX, this.originalEnemySpawn.y);
            this.enemies.add(newEnemy);
        }
        numEnemies *= 2;
    }

    update() {
        // Update the position of the tileSprite for the ground
        if (this.ground) {
            this.ground.tilePositionX = this.cameras.main.scrollX;
        }

        this.player.update();

        this.enemies.getChildren().forEach(enemy => {
            if (enemy.active) {
                enemy.update(); // Update each enemy
                // Check if enemy needs to respawn
                if (enemy.y > this.sys.game.config.height) {
                    enemy.destroy();
                    this.respawnEnemies(); // Respawn enemy
                }
            }
        });
    }
} 



const config = {
    type: Phaser.AUTO,
    width: 2000,
    height: 1200, 
    parent: 'game-container',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 3500 },
            debug: true
        }
    },
    scene: MyGame
};

const game = new Phaser.Game(config);
