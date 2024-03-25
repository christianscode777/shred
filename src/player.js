import Phaser from 'phaser';

export default class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'mySpriteSheet');

        // Add the sprite to the scene
        scene.add.existing(this);
        scene.physics.add.existing(this);

        // Initialize your sprite properties
        this.setScale(1);
        this.setCollideWorldBounds(true);

        // Initialize animations
        this.initAnimations(scene);

        // Create cursor keys for movement
        this.cursors = scene.input.keyboard.createCursorKeys();  
        this.spaceKey = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        // Jump properties
        this.isJumping = false;
        this.jumpSpeed = -200; // Adjust this value as needed
    }

    initAnimations(scene) {
        scene.anims.create({
            key: 'right',
            frames: scene.anims.generateFrameNumbers('mySpriteSheet', { start: 0, end: 13 }),
            frameRate: 30,
            repeat: -1  
        });

        scene.anims.create({
            key:'idle',
            frames: scene.anims.generateFrameNumbers('mySpriteSheet', { start: 14, end: 22 }),
            frameRate: 30,
            repeat: -1
        });
    }

    update() {
        // Reset velocity
        this.setVelocity(0);

        // Movement and animation
        if (this.cursors.right.isDown) {
            this.setVelocityX(160 * 5);
            this.anims.play('right', true); 
            this.setFlipX(false); 
        } else if (this.cursors.left.isDown) {
            this.setVelocityX(-160 * 5);
            this.anims.play('right', true); 
            this.setFlipX(true);
        } else {
            this.anims.play('idle', true);
        }

        // Jumping
        if (this.spaceKey.isDown && !this.isJumping && this.body.touching.down) {
            this.isJumping = true;
            this.setVelocityY(this.jumpSpeed);
        }

        // Reset jumping when touching the ground
        if (this.body.touching.down) {
            this.isJumping = false;
        }

        // Terminal velocity for fast falling
        const terminalVelocity = 1500; // Adjust as needed
        if (this.body.velocity.y > terminalVelocity) {
            this.setVelocityY(terminalVelocity);
        }
    }
}
