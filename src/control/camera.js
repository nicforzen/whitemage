import { Vector2 } from "../physics/vector.js";
import { Color } from "../ux/color.js";

// Need orthographic Size
// TODO Use gameobject's transform as this transform

export function Camera(scale) {
    if(scale === undefined) scale = 1;
    this._initialized = false;
    this.gameObject = null;
    this.backgroundColor = Color.fromHexString("#191970");

    this.transform = {
        position: new Vector2()
    };
    this.scale = scale;

    this.fovX = 0;
    this.fovY = 0;
}
Camera.prototype.initialize = function() {
    if(!this._initialized){
        this.gameObject.instance.camera = this;
        this.fovX = this.gameObject.instance.render.gameWidth/2;
        this.fovY = this.gameObject.instance.render.gameHeight/2;
        this._initialized = true;
    }
};