import { Vector2 } from '../physics/vector.js';

function PlayerController(){
    this.moveTarget = null;
}

PlayerController.prototype.setMoveTarget = function(x, y){
    if(this.moveTarget == null) this.moveTarget = new Vector2(Math.floor(x), Math.floor(y));
    else{
        this.moveTarget.x = Math.floor(x);
        this.moveTarget.y = Math.floor(y);
    }
};
PlayerController.prototype.clearMoveTarget = function(){
    this.moveTarget = null;
};
PlayerController.prototype.getTargetDirectionVector = function(x, y){
    let direction = new Vector2();
    if(this.moveTarget){
        direction.x = this.moveTarget.x - x;
        direction.y = this.moveTarget.y - y;

        // Check if close enough
        if(Math.abs(direction.x) < 0.5 && Math.abs(direction.y) < 0.5) {
            direction.x = 0;
            direction.y = 0;
            this.clearMoveTarget();
        }
    }
    return direction;
};
PlayerController.prototype.toJson = function(){
    return JSON.stringify(this.moveTarget);
};