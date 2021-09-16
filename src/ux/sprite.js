export function Sprite(imageName, spriteName, isFlippedX, isFlippedY) {
    this.imageName = imageName;
    this.spriteName = spriteName;
    this.isFlippedX = (isFlippedX !== undefined) ? isFlippedX : false;
    this.isFlippedY = (isFlippedY !== undefined) ? isFlippedY : false;
}

Sprite.prototype = {};