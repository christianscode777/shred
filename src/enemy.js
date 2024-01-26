import Phaser from 'phaser';

export default class Enemy extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'enemySpriteSheet'); // Use an appropriate sprite sheet

        // Add the sprite to the scene and initialize physics
        scene.add.existing(this);
        scene.physics.add.existing(this);

        // Set any initial properties
        this.setCollideWorldBounds(true);
    }

    // You can add any methods specific to the enemy behavior here
}
