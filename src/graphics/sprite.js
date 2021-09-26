
export function Sprite(texture, pixelsPerUnit){
    this.texture = texture === undefined ? null : texture;
    this.pixelsPerUnit = pixelsPerUnit || 1;
    this._inversePixelsPerUnit = 1/this.pixelsPerUnit;
}
