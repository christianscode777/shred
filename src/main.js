import Phaser from 'phaser';
import Player from './player';

class MyGame extends Phaser.Scene {
    constructor() {
        super('mygame'); 
    }

    preload() {
        this.load.spritesheet('mySpriteSheet', 'assets/images/player-sprite.png', {
            frameWidth: 128, 
            frameHeight: 128
        });

        this.load.spritesheet('enemySpriteSheet', 'assets/images/player-sprite.png', {
            frameWidth: 128, 
            frameHeight: 128
        });
       
        this.load.image('tileSprite', 'assets/images/ground.png'); 
        this.load.image('background', 'assets/images/level-1.png');
    }
    
    create() {
        // Set the world bounds
        const worldWidth = 10000; // Adjust to the width of your level
        this.physics.world.setBounds(0, 0, worldWidth, this.sys.game.config.height);
    
        // Add the background image
        let bg = this.add.image(0, 0, 'background').setOrigin(0, 0);
        bg.displayWidth = worldWidth; // Make background as wide as the level
        bg.displayHeight = this.sys.game.config.height;
    
        // Optional: Apply a small parallax effect
        bg.setScrollFactor(0.8);
    
        // Add the player
        this.player = new Player(this, 100, 900);

        // Add an enemy group
        this.enemies = this.physics.add.group();

        // Spawn an enemy periodically
        this.time.addEvent({
            delay: 1000, // Delay in ms between each spawn
            callback: this.spawnEnemy,
            callbackScope: this,
            loop: true
        });

    
        // Set the ground position to just above the bottom of the game screen
        let groundHeight = 100; // The height of the ground
        let groundY = this.sys.game.config.height - groundHeight / 2 - 10; // Move it up slightly
        const ground = this.add.tileSprite(
            this.sys.game.config.width / 2, // Centered horizontally
            groundY,
            this.sys.game.config.width * 2, // Double the width for side-scrolling
            groundHeight,
            'tileSprite'
        );
        this.physics.add.existing(ground, true);
    
        // Add collider between player and ground
        this.physics.add.collider(this.player, ground);
    
        this.cameras.main.setBounds(0, 0, worldWidth, this.sys.game.config.height);
        this.cameras.main.startFollow(this.player, true, 0.08, 0.08);
    
        // Move the ground image slightly up to show the entire "level-1.png" image
        this.ground = this.add.tileSprite(
            worldWidth / 2,
            this.sys.game.config.height - 150, // Adjust this value to move it up
            worldWidth, // The width of the visible area
            100, // The height of the ground
            'tileSprite' 
        );


        this.physics.add.existing(this.ground, true);
        this.physics.add.collider(this.player, this.ground);  

        
    
    } 

    spawnEnemy() {
        const spawnX = this.cameras.main.scrollX + this.cameras.main.width + 50; // Spawn off-screen to the right
        const spawnY = Phaser.Math.Between(100, this.sys.game.config.height - 100); // Random Y position within game bounds

        const enemy = new Enemy(this, spawnX, spawnY);
        this.enemies.add(enemy);
    };
    
    
    update() {
        // Update the position of the tileSprite for the ground
        if (this.ground) {
            this.ground.tilePositionX = this.cameras.main.scrollX;
        }

        this.player.update();
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
            gravity: { y: 9500 },
            debug: true
        }
    },
    scene: MyGame
};

const game = new Phaser.Game(config);
