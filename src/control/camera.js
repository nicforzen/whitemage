import { Vector2 } from "../physics/vector.js";
import { Color } from "../ux/color.js";

// TODO Use gameobject's transform as this transform
// TODO move to core module

// Replace wings with FOV, remove gameWidth and height

export function Camera(scale) {
    if(scale === undefined) scale = 1;
    this._initialized = false;
    this.gameObject = null;
    this.backgroundColor = Color.fromHexString("#191970");
    this.aspect = 1;
    this.orthographicSize = 5;
    this.enabled = true;

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

        this.fovY = this.orthographicSize;
        this.fovX = this.orthographicSize * this.aspect;
        this._initialized = true;
    }
};