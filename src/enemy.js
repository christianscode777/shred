import Phaser from 'phaser';

export default class Enemy extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'enemySpriteSheet');

        scene.add.existing(this);
        scene.physics.add.existing(this);

        // Initialize your sprite properties
        this.setScale(1);
        this.setCollideWorldBounds(true);

        // Initialize animations
        this.initAnimations(scene);
    } 

    initAnimations(scene) {
        scene.anims.create({
            key: 'walk',
            frames: scene.anims.generateFrameNumbers('enemySpriteSheet', { start: 5, end: 9 }),
            frameRate: 10,
            repeat: -1  
        });

        scene.anims.create({
            key:'idle',
            frames: scene.anims.generateFrameNumbers('enemySpriteSheet', { start: 0, end: 4 }),
            frameRate: 10,
            repeat: -1
        });
    }

    // You can add any methods specific to the enemy behavior here
}
