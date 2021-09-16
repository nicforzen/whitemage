export function Camera(x, y, scale) {
    this.x = x;
    this.y = y;
    this.scale = scale;
    this.fovX = 0;
    this.fovY = 0;
    this.p_x = x;
    this.p_y = y;
    this.p_fovX = 0;
    this.p_fovY = 0;
    this.p_scale = scale;
    this.followTarget = null;
}

Camera.prototype.storeState = function(){
    this.p_x = this.x;
    this.p_y = this.y;
    this.p_fovX = this.fovX;
    this.p_fovY = this.fovY;
    this.p_scale = this.scale;
};
Camera.prototype.reset = function(){
    this.x = 0;
    this.y = 0;
    this.fovX = 0;
    this.fovY = 0;
    this.scale = 1;
};
Camera.prototype.loadState = function(){
    this.x = this.p_x;
    this.y = this.p_y;
    this.fovX = this.p_fovX;
    this.fovY = this.p_fovY;
    this.scale = this.p_scale;
};
Camera.prototype.changeScale = function(s){
    if(s > 0) this.scale = s;
};