import { Vector2 } from "../physics/vector.js";
import { Color } from "../ux/color.js";

// Need orthographic Size
// Use gameobject's transform as this transform

export function Camera(scale) {
    this._initialized = false;
    this.gameObject = null;
    this.backgroundColor = Color.fromHexString("#191970");

    this.transform = {
        position: new Vector2()
    };
    this.transform.position.x = 0;
    this.transform.position.y = 0;
    this.scale = scale;

    this.fovX = 0;
    this.fovY = 0;

    this._x = 0;
    this._y = 0;
    this._fovX = 0;
    this._fovY = 0;
    this._scale = this.scale;
}
Camera.prototype.initialize = function() {
    if(!this._initialized){
        this.gameObject.instance.camera = this;
        this.fovX = this.gameObject.instance.render.gameWidth/2;
        this.fovY = this.gameObject.instance.render.gameHeight/2;
        this._initialized = true;
    }
};

Camera.prototype._storeState = function(){
    this._x = this.transform.position.x;
    this._y = this.transform.position.y;
    this._fovX = this.fovX;
    this._fovY = this.fovY;
    this._scale = this.scale;
};
Camera.prototype._reset = function(){
    this.transform.position.x = 0;
    this.transform.position.y = 0;
    this.fovX = 0;
    this.fovY = 0;
    this.scale = 1;
};
Camera.prototype._loadState = function(){
    this.transform.position.x = this._x;
    this.transform.position.y = this._y;
    this.fovX = this._fovX;
    this.fovY = this._fovY;
    this.scale = this._scale;
};