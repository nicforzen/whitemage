import { Vector2 } from "../physics/vector.js";

// Need Background color
// Need orthographic Size

export function Camera(x, y) {
    this.gameObject = null;

    this.transform = {
        position: new Vector2()
    };
    this.transform.position.x = x;
    this.transform.position.y = y;
    this.scale = 1;

    this.fovX = 0;
    this.fovY = 0;

    this._x = x;
    this._y = y;
    this._fovX = 0;
    this._fovY = 0;
    this._scale = this.scale;
}

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