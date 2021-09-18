import { Vector2 } from "../physics/vector.js";

export function Camera(x, y, scale) {
    this.transform = {
        position: new Vector2()
    };
    this.transform.position.x = x;
    this.transform.position.y = y;
    this.scale = scale;
    this.fovX = 0;
    this.fovY = 0;
    this._x = x;
    this._y = y;
    this._fovX = 0;
    this._fovY = 0;
    this._scale = scale;
    this.followTarget = null;
}

Camera.prototype.storeState = function(){
    this._x = this.transform.position.x;
    this._y = this.transform.position.y;
    this._fovX = this.fovX;
    this._fovY = this.fovY;
    this._scale = this.scale;
};
Camera.prototype.reset = function(){
    this.transform.position.x = 0;
    this.transform.position.y = 0;
    this.fovX = 0;
    this.fovY = 0;
    this.scale = 1;
};
Camera.prototype.loadState = function(){
    this.transform.position.x = this._x;
    this.transform.position.y = this._y;
    this.fovX = this._fovX;
    this.fovY = this._fovY;
    this.scale = this._scale;
};
Camera.prototype.setScale = function(s){
    if(s > 0) this.scale = s;
};